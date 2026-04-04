import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timeline-frame.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function splitClassNames(className = "") {
    return String(className || "")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
}

function normalizeDataKey(name = "") {
    return String(name || "")
        .replace(/^data-/, "")
        .replace(/-([a-z])/g, (_m, ch) => ch.toUpperCase());
}

function createMockElement(ownerDocument = null) {
    const handlers = new Map();
    const capturedPointerIds = new Set();
    const el = {
        ownerDocument,
        style: {},
        dataset: {},
        attributes: {},
        children: [],
        className: "",
        _textContent: "",
        clientWidth: 240,
        offsetLeft: 0,
        isConnected: true,
        appendChild(child) {
            if (child && typeof child === "object") {
                child.parentNode = this;
                child.parentElement = this;
                if (!child.ownerDocument) child.ownerDocument = this.ownerDocument;
                this.children.push(child);
            }
            return child;
        },
        addEventListener(type, cb) {
            const key = String(type || "");
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(cb);
        },
        removeEventListener(type, cb) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            handlers.set(key, list.filter((item) => item !== cb));
        },
        dispatch(type, event = {}) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            list.forEach((cb) => cb(event));
        },
        setPointerCapture(pointerId) {
            if (Number.isInteger(pointerId)) capturedPointerIds.add(pointerId);
        },
        releasePointerCapture(pointerId) {
            capturedPointerIds.delete(pointerId);
        },
        hasPointerCapture(pointerId) {
            return capturedPointerIds.has(pointerId);
        },
        getBoundingClientRect() {
            return { left: 0, width: this.clientWidth };
        },
        setAttribute(name, value) {
            const key = String(name || "");
            const text = String(value ?? "");
            this.attributes[key] = text;
            if (key === "class") this.className = text;
            if (key.startsWith("data-")) this.dataset[normalizeDataKey(key)] = text;
        },
        getAttribute(name) {
            const key = String(name || "");
            if (key === "class") return this.className || "";
            if (Object.prototype.hasOwnProperty.call(this.attributes, key)) return this.attributes[key];
            return null;
        },
        removeAttribute(name) {
            const key = String(name || "");
            delete this.attributes[key];
            if (key === "class") this.className = "";
            if (key.startsWith("data-")) delete this.dataset[normalizeDataKey(key)];
        },
        querySelector(selector) {
            const all = this.querySelectorAll(selector);
            return all[0] || null;
        },
        querySelectorAll(selector) {
            const classMatch = String(selector || "").match(/^\.([a-zA-Z0-9_-]+)(?:\[data-slot="([^"]+)"\])?$/);
            if (!classMatch) return [];
            const classToken = classMatch[1];
            const dataSlot = classMatch[2];
            const matched = [];

            const walk = (node) => {
                (node.children || []).forEach((child) => {
                    const classNames = splitClassNames(child.className);
                    const classOk = classNames.includes(classToken);
                    const slotOk = (dataSlot === undefined) || String(child.dataset?.slot || "") === String(dataSlot);
                    if (classOk && slotOk) matched.push(child);
                    walk(child);
                });
            };
            walk(this);
            return matched;
        }
    };
    el.classList = {
        add(...tokens) {
            const set = new Set(splitClassNames(el.className));
            tokens.forEach((token) => {
                if (token) set.add(String(token));
            });
            el.className = Array.from(set).join(" ");
        },
        remove(...tokens) {
            const removeSet = new Set(tokens.map((token) => String(token)));
            el.className = splitClassNames(el.className)
                .filter((token) => !removeSet.has(token))
                .join(" ");
        },
        contains(token) {
            return splitClassNames(el.className).includes(String(token));
        }
    };
    Object.defineProperty(el, "textContent", {
        get() {
            return this._textContent;
        },
        set(next) {
            this._textContent = String(next ?? "");
            if (this._textContent === "") this.children = [];
        }
    });
    return el;
}

function createEventTarget() {
    const handlers = new Map();
    return {
        addEventListener(type, cb) {
            const key = String(type || "");
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(cb);
        },
        removeEventListener(type, cb) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            handlers.set(key, list.filter((item) => item !== cb));
        },
        dispatch(type, event = {}) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            list.forEach((cb) => cb(event));
        }
    };
}

function loadTimelineFrameModule(options = {}) {
    const globalPatches = {
        window: options.window || {},
        Date: options.Date || Date,
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement() {
                return null;
            }
        },
        console
    };
    const keys = ["GTVTimelineFrame", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return globalThis.window?.GTVTimelineFrame || globalThis.GTVTimelineFrame;
}

describe("GTV timeline frame module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });
    it("shouldRenderTimeline follows tab/toggle/multi conditions", () => {
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed",
            isMultiTab: () => false
        });
        expect(service.shouldRenderTimeline()).toBe(true);

        const serviceMulti = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed",
            isMultiTab: () => true
        });
        expect(serviceMulti.shouldRenderTimeline()).toBe(false);
    });

    it("renderTimelineFrame exits safely without frame element", () => {
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => null
        });
        expect(() => service.renderTimelineFrame()).not.toThrow();
    });

    it("prefers injected logWarn when dependency access throws", () => {
        const module = loadTimelineFrameModule();
        const warnings = [];
        const service = module.createService({
            logWarn: (...args) => {
                warnings.push(args);
            },
            getTimelineFrameElement: () => {
                throw new Error("frame failure");
            }
        });

        expect(() => service.renderTimelineFrame()).not.toThrow();
        expect(warnings).toHaveLength(1);
        expect(String(warnings[0][0])).toContain("Dependency \"getTimelineFrameElement\" threw.");
    });

    it("applyTimelineRatioToSlot uses fixed-time path and respects render/persist options", () => {
        const module = loadTimelineFrameModule();
        let applyCount = 0;
        let updateCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => true,
            applyFixedTimeSlotTimelineRatio: () => {
                applyCount += 1;
                return true;
            },
            updateClocks: () => {
                updateCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        service.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" }, { render: false, persist: false });
        expect(applyCount).toBe(1);
        expect(updateCount).toBe(0);
        expect(saveCount).toBe(0);

        service.applyTimelineRatioToSlot(0, 0.75, { id: "utc", zone: "UTC" });
        expect(applyCount).toBe(2);
        expect(updateCount).toBe(1);
        expect(saveCount).toBe(1);
    });

    it("applyTimelineRatioToSlot updates UTC time through non-fixed path", () => {
        const module = loadTimelineFrameModule();
        let savedDate = new Date(Date.UTC(2026, 2, 24, 0, 0, 0));
        let updateCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => false,
            getGlobalTime: () => savedDate,
            setGlobalTime: (_slotIdx, nextDate) => {
                savedDate = new Date(nextDate);
            },
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({
                year: 2026,
                month: 3,
                day: 24,
                hour: 0,
                minute: 0,
                second: 0
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
            updateClocks: () => {
                updateCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        service.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" });

        expect(savedDate.getUTCHours()).toBe(12);
        expect(savedDate.getUTCMinutes()).toBe(0);
        expect(updateCount).toBe(1);
        expect(saveCount).toBe(0);
    });

    it("getTimelinePanelCount follows realtime and fixed-time branches", () => {
        const module = loadTimelineFrameModule();

        const nonRealtimeDual = module.createService({
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(nonRealtimeDual.getTimelinePanelCount()).toBe(2);

        const realtimeSingle = module.createService({
            isFixedTimeTab: () => false,
            getIsRealtime: () => true,
            getSlotCount: () => 2
        });
        expect(realtimeSingle.getTimelinePanelCount()).toBe(1);

        const fixedTimeSingle = module.createService({
            isFixedTimeTab: () => true,
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(fixedTimeSingle.getTimelinePanelCount()).toBe(1);
    });

    it("getTimelineIndicatorLabel uses range labels on fixed tab with two slots", () => {
        const module = loadTimelineFrameModule();
        const fixedService = module.createService({
            t: (key) => key,
            getCurrentMainTab: () => "fixed",
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(fixedService.getTimelineIndicatorLabel(0)).toBe("th_time_day_start");
        expect(fixedService.getTimelineIndicatorLabel(1)).toBe("th_time_day_end");

        const liveService = module.createService({
            t: (key) => key,
            getCurrentMainTab: () => "live",
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(liveService.getTimelineIndicatorLabel(0)).toBe("th_time_day_main");
    });

    it("renderTimelineFrame hides and clears frame when timeline should not render", () => {
        const frame = {
            style: {},
            textContent: "stale",
            removed: [],
            removeAttribute(name) {
                this.removed.push(name);
            },
            classList: {
                add() { },
                remove() { }
            }
        };
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => false
        });

        service.renderTimelineFrame();

        expect(frame.style.display).toBe("none");
        expect(frame.textContent).toBe("");
        expect(frame.removed).toContain("data-render-key");
    });

    it("renderTimelineFrame regenerates render key when day/night range changes", () => {
        const module = loadTimelineFrameModule();

        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        let dayStartHour = 6;
        let nightStartHour = 18;

        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 1,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 0, 0, 0)),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => {
                const safeHour = ((Number(hour) % 24) + 24) % 24;
                return (safeHour >= dayStartHour && safeHour < nightStartHour) ? "DAY" : "NIGHT";
            },
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark",
            updateClocks: () => {},
            savePersistence: () => {}
        });

        service.renderTimelineFrame();
        const firstRenderKey = frame.getAttribute("data-render-key");
        expect(typeof firstRenderKey).toBe("string");
        expect(firstRenderKey.length).toBeGreaterThan(0);

        dayStartHour = 8;
        nightStartHour = 20;
        service.renderTimelineFrame();
        const secondRenderKey = frame.getAttribute("data-render-key");

        expect(secondRenderKey).not.toBe(firstRenderKey);
    });

    it("applyTimelineRatioToSlot no-ops in realtime and with malformed local parts", () => {
        const module = loadTimelineFrameModule();
        let setCalls = 0;
        let updateCalls = 0;
        const realtimeService = module.createService({
            getIsRealtime: () => true,
            setGlobalTime: () => { setCalls += 1; },
            updateClocks: () => { updateCalls += 1; }
        });
        realtimeService.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" });
        expect(setCalls).toBe(0);
        expect(updateCalls).toBe(0);

        const malformedService = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => false,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 0, 0, 0)),
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => null,
            setGlobalTime: () => { setCalls += 1; },
            updateClocks: () => { updateCalls += 1; }
        });
        malformedService.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" });
        expect(setCalls).toBe(0);
        expect(updateCalls).toBe(0);
    });

    it("renderTimelineFrame exits safely when base timezone reference is missing", () => {
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            getBaseTimezoneRef: () => null
        });

        expect(() => service.renderTimelineFrame()).not.toThrow();
        expect(frame.getAttribute("data-render-key")).toBe(null);
    });

    it("renderTimelineFrame renders fixed-time slot indicators", () => {
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed-time",
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getIsRealtime: () => false,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 0, 0, 0)),
            getFixedTimeTimelineSlots: () => [{ id: "s1" }, { id: "s2" }],
            getFixedTimeTimelineSlotCount: () => 2,
            getFixedTimeSlotTimelineLabel: (_slot, idx) => `S${idx + 1}`,
            getFixedTimeTimelineIndicatorToken: () => "token",
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "light",
            updateClocks: () => { },
            savePersistence: () => { }
        });

        service.renderTimelineFrame();

        const indicators = frame.querySelectorAll(".fixed-slot");
        expect(indicators).toHaveLength(2);
        expect(indicators[0]?.querySelector(".timeline-indicator-label")?.textContent).toBe("S1");
        expect(indicators[1]?.querySelector(".timeline-indicator-label")?.textContent).toBe("S2");
    });

    it("renderTimelineFrame schedules indicator refresh when widths are not measurable", () => {
        let frameRequestCalls = 0;
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            requestUiFrame: (cb) => {
                frameRequestCalls += 1;
                cb();
                return frameRequestCalls;
            },
            cancelUiFrame: () => { },
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 1,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 0, 0, 0)),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark",
            updateClocks: () => { },
            savePersistence: () => { }
        });

        service.renderTimelineFrame();
        frame.querySelectorAll(".timeline-box-row").forEach((row) => {
            row.clientWidth = 0;
        });
        frameRequestCalls = 0;
        service.renderTimelineFrame();

        expect(frameRequestCalls).toBeGreaterThanOrEqual(2);
    });

    it("rendered timeline indicator drag updates time and persists on pointerup", () => {
        const windowEvents = createEventTarget();
        let frameRequestId = 0;
        let savedDate = new Date(Date.UTC(2026, 2, 26, 0, 0, 0));
        let updateCalls = 0;
        let saveCalls = 0;
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule({
            window: windowEvents
        });
        const service = module.createService({
            requestUiFrame: (cb) => {
                frameRequestId += 1;
                cb();
                return frameRequestId;
            },
            cancelUiFrame: () => { },
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 1,
            getGlobalTime: () => savedDate,
            setGlobalTime: (_slotIdx, nextDate) => {
                savedDate = new Date(nextDate);
            },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark",
            updateClocks: () => { updateCalls += 1; },
            savePersistence: () => { saveCalls += 1; }
        });

        service.renderTimelineFrame();
        const indicator = frame.querySelector(".timeline-indicator");
        expect(indicator).toBeTruthy();

        indicator.dispatch("pointerdown", {
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
            pointerId: 11,
            clientX: 120,
            preventDefault() { }
        });
        windowEvents.dispatch("pointermove", {
            pointerId: 11,
            clientX: 240,
            preventDefault() { }
        });
        windowEvents.dispatch("pointerup", {
            pointerId: 11,
            clientX: 240,
            preventDefault() { }
        });
        service.stopTimelineDrag();

        expect(savedDate.getUTCHours()).toBe(23);
        expect(updateCalls).toBeGreaterThan(0);
        expect(saveCalls).toBe(0);
    });

    it("shouldRenderTimeline handles unsupported and fallback tab values", () => {
        const module = loadTimelineFrameModule();
        const unsupported = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "calc",
            isMultiTab: () => false
        });
        expect(unsupported.shouldRenderTimeline()).toBe(false);

        const fallbackLive = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "unknown-tab",
            isMultiTab: () => false
        });
        expect(fallbackLive.shouldRenderTimeline()).toBe(true);
    });

    it("applyTimelineRatioToSlot fixed-time path aborts when apply returns false", () => {
        const module = loadTimelineFrameModule();
        let updateCalls = 0;
        let saveCalls = 0;
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => true,
            applyFixedTimeSlotTimelineRatio: () => false,
            updateClocks: () => { updateCalls += 1; },
            savePersistence: () => { saveCalls += 1; }
        });

        service.applyTimelineRatioToSlot(0, 0.2, { id: "utc", zone: "UTC" });

        expect(updateCalls).toBe(0);
        expect(saveCalls).toBe(0);
    });

    it("renderTimelineFrame marks realtime class and skips scheduled refresh when positioned", () => {
        let rafCalls = 0;
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            requestUiFrame: () => {
                rafCalls += 1;
                return rafCalls;
            },
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => true,
            getSlotCount: () => 2,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 10, 0, 0)),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "light"
        });

        service.renderTimelineFrame();
        rafCalls = 0;
        service.renderTimelineFrame();

        expect(frame.classList.contains("is-realtime")).toBe(true);
        expect(rafCalls).toBe(0);
    });

    it("fixed-time indicator labels fallback to slot index in realtime mode", () => {
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed-time",
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getIsRealtime: () => true,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 0, 0, 0)),
            getFixedTimeTimelineSlots: () => [{ id: "slot-a" }, { id: "slot-b" }],
            getFixedTimeTimelineSlotCount: () => 2,
            getFixedTimeSlotTimelineLabel: () => "   ",
            getFixedTimeTimelineIndicatorToken: () => "token",
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark"
        });

        service.renderTimelineFrame();

        const indicators = frame.querySelectorAll(".fixed-slot");
        expect(indicators).toHaveLength(2);
        expect(indicators[0]?.querySelector(".timeline-indicator-label")?.textContent).toBe("1");
        expect(indicators[1]?.querySelector(".timeline-indicator-label")?.textContent).toBe("2");
        const trackBody = frame.querySelector(".timeline-track-body");
        expect(trackBody.classList.contains("draggable")).toBe(false);
    });

    it("pointerdown guards and manual stopTimelineDrag release pointer capture", () => {
        const windowEvents = createEventTarget();
        let savedDate = new Date(Date.UTC(2026, 2, 26, 0, 0, 0));
        let updateCalls = 0;
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule({
            window: windowEvents
        });
        const service = module.createService({
            requestUiFrame: (cb) => {
                cb();
                return 1;
            },
            cancelUiFrame: () => { },
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 1,
            getGlobalTime: () => savedDate,
            setGlobalTime: (_slotIdx, nextDate) => {
                savedDate = new Date(nextDate);
            },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: (hour) => (Number(hour) >= 6 && Number(hour) < 18 ? "DAY" : "NIGHT"),
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark",
            updateClocks: () => { updateCalls += 1; },
            savePersistence: () => { }
        });

        service.renderTimelineFrame();
        const indicator = frame.querySelector(".timeline-indicator");
        expect(indicator).toBeTruthy();

        indicator.dispatch("pointerdown", {
            pointerType: "mouse",
            isPrimary: false,
            button: 0,
            pointerId: 7,
            clientX: 120,
            preventDefault() { }
        });
        expect(updateCalls).toBe(0);

        indicator.dispatch("pointerdown", {
            pointerType: "mouse",
            isPrimary: true,
            button: 1,
            pointerId: 8,
            clientX: 120,
            preventDefault() { }
        });
        expect(updateCalls).toBe(0);

        indicator.dispatch("pointerdown", {
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
            pointerId: 9,
            clientX: 60,
            preventDefault() { }
        });
        expect(indicator.hasPointerCapture(9)).toBe(true);
        service.stopTimelineDrag();
        expect(indicator.hasPointerCapture(9)).toBe(false);
    });

    it("renderTimelineFrame creates panel titles in dual live range mode", () => {
        const documentStub = {
            createElement() {
                return createMockElement(documentStub);
            },
            getElementById() {
                return null;
            }
        };
        const frame = createMockElement(documentStub);
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 2,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 10, 0, 0)),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: () => "",
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "light"
        });

        service.renderTimelineFrame();

        const titles = frame.querySelectorAll(".timeline-panel-title");
        expect(titles).toHaveLength(2);
        expect(titles[0].textContent).toBe("th_time_day_start");
        expect(titles[1].textContent).toBe("th_time_day_end");
    });

    it("renderTimelineFrame prefers injected getDocumentRefOrNull when direct document dep is unusable", () => {
        const frame = createMockElement(null);
        const injectedDoc = {
            createElement() {
                return createMockElement(injectedDoc);
            },
            getElementById() {
                return null;
            }
        };
        const module = loadTimelineFrameModule({
            document: {
                createElement() {
                    throw new Error("global document should not be used");
                },
                getElementById() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const service = module.createService({
            document: {
                createElement() {
                    throw new Error("direct document dep should not be used");
                },
                getElementById() {
                    throw new Error("direct document dep should not be used");
                }
            },
            getDocumentRefOrNull: () => injectedDoc,
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => true,
            getCurrentMainTab: () => "live",
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => true,
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 26, 10, 0, 0)),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (dateObj) => ({
                year: dateObj.getUTCFullYear(),
                month: dateObj.getUTCMonth() + 1,
                day: dateObj.getUTCDate(),
                hour: dateObj.getUTCHours(),
                minute: dateObj.getUTCMinutes(),
                second: dateObj.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(
                Number(parts?.year || 1970),
                Number(parts?.month || 1) - 1,
                Number(parts?.day || 1),
                Number(parts?.hour || 0),
                Number(parts?.minute || 0),
                Number(parts?.second || 0)
            )),
            getDayNightMarkerByHour: () => "DAY",
            t: (key) => key,
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark"
        });

        expect(() => service.renderTimelineFrame()).not.toThrow();
        expect(frame.querySelectorAll(".timeline-panel")).toHaveLength(1);
    });

    it("applyTimelineRatioToSlot clamps out-of-range ratio values", () => {
        const module = loadTimelineFrameModule();
        let savedDate = new Date(Date.UTC(2026, 2, 26, 12, 0, 0));
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => false,
            getGlobalTime: () => savedDate,
            setGlobalTime: (_slotIdx, nextDate) => {
                savedDate = new Date(nextDate);
            },
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({
                year: 2026,
                month: 3,
                day: 26,
                hour: 0,
                minute: 0,
                second: 0
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
            updateClocks: () => { }
        });

        service.applyTimelineRatioToSlot(0, 2, { id: "utc", zone: "UTC" });
        expect(savedDate.getUTCHours()).toBe(23);
        expect(savedDate.getUTCMinutes()).toBe(59);

        service.applyTimelineRatioToSlot(0, -1, { id: "utc", zone: "UTC" });
        expect(savedDate.getUTCHours()).toBe(0);
        expect(savedDate.getUTCMinutes()).toBe(0);
    });
});
