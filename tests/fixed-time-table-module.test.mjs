import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-table.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createClassList(owner) {
    const tokens = new Set();
    const syncFromOwner = () => {
        tokens.clear();
        String(owner._className || "").split(/\s+/).filter(Boolean).forEach((token) => tokens.add(token));
    };
    const syncToOwner = () => {
        owner._className = Array.from(tokens).join(" ");
    };
    return {
        add(...values) {
            syncFromOwner();
            values.forEach((value) => tokens.add(String(value)));
            syncToOwner();
        },
        remove(...values) {
            syncFromOwner();
            values.forEach((value) => tokens.delete(String(value)));
            syncToOwner();
        },
        toggle(value, force) {
            syncFromOwner();
            const key = String(value);
            const next = (typeof force === "boolean") ? force : !tokens.has(key);
            if (next) tokens.add(key);
            else tokens.delete(key);
            syncToOwner();
            return next;
        },
        contains(value) {
            syncFromOwner();
            return tokens.has(String(value));
        }
    };
}

function createElement(tagName = "div") {
    const listeners = new Map();
    const attrs = new Map();
    const el = {
        tagName: String(tagName || "div").toUpperCase(),
        _className: "",
        style: {},
        dataset: {},
        children: [],
        parentElement: null,
        id: "",
        value: "",
        textContent: "",
        title: "",
        type: "",
        tabIndex: 0,
        spellcheck: true,
        classList: null,
        appendChild(child) {
            if (!child) return child;
            if (child.parentElement && Array.isArray(child.parentElement.children)) {
                child.parentElement.children = child.parentElement.children.filter((item) => item !== child);
            }
            child.parentElement = el;
            el.children.push(child);
            return child;
        },
        addEventListener(name, handler) {
            if (!listeners.has(name)) listeners.set(name, []);
            listeners.get(name).push(handler);
        },
        dispatchEvent(event) {
            const evt = event || { type: "" };
            if (typeof evt.preventDefault !== "function") evt.preventDefault = () => { };
            if (typeof evt.stopPropagation !== "function") evt.stopPropagation = () => { };
            if (!evt.target) evt.target = el;
            const handlers = listeners.get(evt.type) || [];
            handlers.forEach((handler) => handler(evt));
            return true;
        },
        setAttribute(name, value) {
            attrs.set(String(name), String(value));
        },
        getAttribute(name) {
            return attrs.has(String(name)) ? attrs.get(String(name)) : null;
        },
        blur() {
            el.dispatchEvent({ type: "blur", target: el });
        }
    };
    Object.defineProperty(el, "className", {
        get() {
            return el._className;
        },
        set(value) {
            el._className = String(value || "");
        }
    });
    let textContentValue = "";
    Object.defineProperty(el, "textContent", {
        get() {
            return textContentValue;
        },
        set(value) {
            textContentValue = String(value ?? "");
            if (textContentValue === "") el.children = [];
        }
    });
    el.classList = createClassList(el);
    return el;
}

function findByClass(root, className) {
    if (!root) return [];
    const out = [];
    const stack = [root];
    while (stack.length) {
        const node = stack.pop();
        if (node?.classList?.contains?.(className)) out.push(node);
        (node?.children || []).forEach((child) => stack.push(child));
    }
    return out;
}

function createTableDocument() {
    const headRow = createElement("tr");
    const body = createElement("tbody");
    const styleWrites = [];
    const tableEl = createElement("table");
    tableEl.style = {
        setProperty(name, value) {
            styleWrites.push({ name, value });
        }
    };
    const doc = {
        createElement,
        getElementById(id) {
            if (id === "fixed-time-body") return body;
            return null;
        },
        querySelector(selector) {
            if (selector === "#fixed-time-table-head tr") return headRow;
            if (selector === ".fixed-time-table") return tableEl;
            return null;
        }
    };
    return { doc, headRow, body, styleWrites };
}

function loadFixedTimeTableModule(options = {}) {
    const globalPatches = {
        window: options.window || {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelector() {
                return null;
            }
        },
        console
    };
    const keys = ["window", "document", "console", "GTVFixedTimeTable", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVFixedTimeTable || globalThis.GTVFixedTimeTable;
}

describe("GTV fixed time table module", () => {
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

    it("getFixedTimeSlotLayoutMetrics scales with enabled parts", () => {
        const module = loadFixedTimeTableModule();
        const service = module.createService({});

        const full = service.getFixedTimeSlotLayoutMetrics({ dn: true, time: true, weekday: true });
        const minimal = service.getFixedTimeSlotLayoutMetrics({ dn: false, time: true, weekday: false });
        const noTime = service.getFixedTimeSlotLayoutMetrics({ dn: true, time: false, weekday: true });

        expect(full.columnMinWidthPx).toBeGreaterThan(minimal.columnMinWidthPx);
        expect(full.inputWidthPx).toBe(85);
        expect(noTime.inputWidthPx).toBe(0);
    });

    it("getFixedTimeDisplayColumns follows sanitized order/enabled states", () => {
        const module = loadFixedTimeTableModule();
        const service = module.createService({
            getDisplayFormatOrder: () => ["offset", "time", "timezone", "region"],
            getDisplayFormatEnabled: () => ({
                timezone: true,
                region: false,
                offset: true,
                time: true
            }),
            sanitizeCopyFormatOrderForContext: (order) => order,
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled
        });

        expect(service.getFixedTimeDisplayColumns()).toEqual(["offset", "time_slots", "timezone"]);
    });

    it("renderFixedTimeTable exits safely when required DOM nodes are missing", () => {
        const module = loadFixedTimeTableModule({
            document: {
                getElementById() {
                    return null;
                },
                querySelector() {
                    return null;
                }
            }
        });
        const service = module.createService({
            getCurrentGroup: () => null
        });

        expect(() => service.renderFixedTimeTable()).not.toThrow();
    });

    it("getFixedTimeOffsetTextAtDate supports custom/utc/fixed/fallback branches", () => {
        const module = loadFixedTimeTableModule();
        const service = module.createService({
            formatUtcOffsetLabel: (minutes) => `UTC${minutes}`,
            getCustomOffsetMinutes: () => 330,
            getFixedOffsetForDisplayAtDate: (tz) => {
                if (tz.zone === "Asia/Seoul") return 540;
                return Number.NaN;
            },
            getTimezoneOffset: () => -300
        });

        expect(service.getFixedTimeOffsetTextAtDate({ type: "custom" }, new Date("2026-03-07T00:00:00.000Z"))).toBe("UTC330");
        expect(service.getFixedTimeOffsetTextAtDate({ zone: "UTC" }, new Date("2026-03-07T00:00:00.000Z"))).toBe("UTC0");
        expect(service.getFixedTimeOffsetTextAtDate({ zone: "Asia/Seoul" }, new Date("2026-03-07T00:00:00.000Z"))).toBe("UTC540");
        expect(service.getFixedTimeOffsetTextAtDate({ zone: "America/New_York" }, new Date("2026-03-07T00:00:00.000Z"))).toBe("UTC-300");
    });

    it("renderFixedTimeTable builds rows/headers and wires slot actions", () => {
        const { doc, headRow, body, styleWrites } = createTableDocument();
        const module = loadFixedTimeTableModule({ document: doc });
        const group = {
            fixedTimes: [{ id: "slot-1", name: "Morning", time: "09:00" }]
        };
        const baseRef = { id: "utc", zone: "UTC", type: "standard" };
        const customRow = { id: "custom-1", zone: "Custom/1", type: "custom" };
        let renameCalls = 0;
        let copySlotCalls = 0;
        let copyCellCalls = 0;
        let applyCalls = 0;
        let upgradeCalls = 0;
        let bindCalls = 0;
        const service = module.createService({
            t: (key) => key,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getFixedTimeDisplayPartsEnabled: () => ({ dn: true, time: true, weekday: true }),
            getDisplayFormatOrder: () => ["timezone", "region", "offset", "time"],
            getDisplayFormatEnabled: () => ({ timezone: true, region: true, offset: true, time: true }),
            sanitizeCopyFormatOrderForContext: (order) => order,
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getFixedTimeTimelineIndicatorColor: () => "#00aaff",
            getFixedTimeSlotHeaderLabel: () => "Morning",
            renameFixedTimeSlot: () => { renameCalls += 1; },
            copyFixedTimeSlotColumn: async () => { copySlotCalls += 1; },
            getBaseTimezoneRef: () => baseRef,
            getRenderableTimezoneRows: () => [customRow],
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => new Date("2026-03-07T09:00:00.000Z"),
            getZoneAbbreviation: (tz) => (tz.type === "custom" ? "CST" : "UTC"),
            getZoneDisplayNameForUiAtDate: () => "",
            getZoneDisplayName: (tz) => (tz.type === "custom" ? "Custom Zone" : "UTC"),
            formatUtcOffsetLabel: (minutes) => `UTC${minutes}`,
            getCustomOffsetMinutes: () => 60,
            getFixedOffsetForDisplayAtDate: () => Number.NaN,
            getTimezoneOffset: () => 60,
            buildFixedTimeDisplayPayloadAtUtc: () => ({
                dayNightGlyph: "AM",
                dayNightMarker: "DAY",
                dayName: "Sat",
                weekdayIndex: 6
            }),
            buildFixedTimeCellInputValue: () => "09:00:00",
            bindCustomDatePickerForInput: () => { bindCalls += 1; },
            applyFixedTimeSlotByTimezoneInput: () => { applyCalls += 1; },
            copyFixedTimeCellByTimezone: async () => { copyCellCalls += 1; },
            upgradeNativeTitleTooltips: () => { upgradeCalls += 1; }
        });

        service.renderFixedTimeTable();

        expect(headRow.children.length).toBeGreaterThanOrEqual(4);
        expect(body.children.length).toBe(2);
        expect(styleWrites.some((item) => item.name === "--fixed-time-slot-min-width")).toBe(true);
        expect(styleWrites.some((item) => item.name === "--fixed-time-input-width")).toBe(true);
        expect(bindCalls).toBe(2);
        expect(upgradeCalls).toBe(2);

        const renameButtons = findByClass(headRow, "fixed-time-slot-rename-btn");
        const slotCopyButtons = findByClass(headRow, "fixed-time-slot-copy-btn");
        expect(renameButtons.length).toBe(1);
        expect(slotCopyButtons.length).toBe(1);
        renameButtons[0].dispatchEvent({ type: "click" });
        slotCopyButtons[0].dispatchEvent({ type: "click" });

        const timeInputs = findByClass(body, "fixed-time-time-input");
        const cellCopyButtons = findByClass(body, "fixed-time-copy-btn");
        expect(timeInputs.length).toBe(2);
        expect(cellCopyButtons.length).toBe(2);
        timeInputs[0].value = "10:20:30";
        timeInputs[0].dispatchEvent({ type: "change", target: timeInputs[0] });
        timeInputs[0].dispatchEvent({ type: "keydown", key: "Enter", target: timeInputs[0], preventDefault() { } });
        cellCopyButtons[0].dispatchEvent({ type: "click" });

        expect(renameCalls).toBe(1);
        expect(copySlotCalls).toBe(1);
        expect(copyCellCalls).toBe(1);
        expect(applyCalls).toBeGreaterThanOrEqual(1);
        const customZoneCode = findByClass(body, "zone-code-custom");
        expect(customZoneCode.length).toBeGreaterThan(0);
    });

    it("renderFixedTimeTable appends realtime-now column when enabled", () => {
        const { doc, headRow, body } = createTableDocument();
        const module = loadFixedTimeTableModule({ document: doc });
        const service = module.createService({
            t: (key) => key,
            getCurrentGroup: () => ({
                fixedTimeShowLiveNow: true,
                fixedTimes: [{ id: "slot-1", name: "Morning", time: "09:00" }]
            }),
            ensureGroupFixedTimes: () => { },
            getFixedTimeDisplayPartsEnabled: () => ({ dn: true, time: true, weekday: true }),
            getDisplayFormatOrder: () => ["timezone", "time"],
            getDisplayFormatEnabled: () => ({ timezone: true, time: true }),
            sanitizeCopyFormatOrderForContext: (order) => order,
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getFixedTimeTimelineIndicatorColor: () => "#00aaff",
            getFixedTimeSlotHeaderLabel: () => "Morning",
            renameFixedTimeSlot: () => { },
            copyFixedTimeSlotColumn: async () => { },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getRenderableTimezoneRows: () => [{ id: "tz-1", zone: "Asia/Seoul", type: "standard" }],
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => new Date("2026-03-07T09:00:00.000Z"),
            getZoneAbbreviation: () => "UTC",
            getZoneDisplayNameForUiAtDate: () => "",
            getZoneDisplayName: () => "UTC",
            formatUtcOffsetLabel: (minutes) => `UTC${minutes}`,
            getCustomOffsetMinutes: () => 0,
            getFixedOffsetForDisplayAtDate: () => 0,
            getTimezoneOffset: () => 0,
            buildFixedTimeDisplayPayloadAtUtc: () => ({
                dayNightGlyph: "AM",
                clock: "12:34:56",
                dayName: "Sat",
                weekdayIndex: 6
            }),
            buildFixedTimeCellInputValue: () => "09:00:00",
            bindCustomDatePickerForInput: () => { },
            applyFixedTimeSlotByTimezoneInput: () => { },
            copyFixedTimeCellByTimezone: async () => { },
            upgradeNativeTitleTooltips: () => { }
        });

        service.renderFixedTimeTable();

        expect(headRow.children[1].textContent).toBe("th_fixed_time_live_now");
        const liveNowCells = findByClass(body, "fixed-time-live-now");
        expect(liveNowCells.length).toBe(2);
        const clocks = findByClass(body, "fixed-time-clock");
        expect(clocks.some((el) => el.value === "12:34:56" || el.textContent === "12:34:56")).toBe(true);
    });

    it("renderFixedTimeTable exits when base timezone is missing after clearing body", () => {
        const { doc, body } = createTableDocument();
        const module = loadFixedTimeTableModule({ document: doc });
        body.appendChild(createElement("tr"));
        const service = module.createService({
            getCurrentGroup: () => ({ fixedTimes: [{ id: "s1", time: "09:00" }] }),
            ensureGroupFixedTimes: () => { },
            getFixedTimeDisplayPartsEnabled: () => ({ dn: true, time: true, weekday: true }),
            getDisplayFormatOrder: () => ["time"],
            getDisplayFormatEnabled: () => ({ time: true }),
            sanitizeCopyFormatOrderForContext: (order) => order,
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getBaseTimezoneRef: () => null
        });

        service.renderFixedTimeTable();

        expect(body.children.length).toBe(0);
    });
});
