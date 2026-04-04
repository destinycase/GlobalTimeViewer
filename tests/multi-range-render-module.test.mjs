import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-render.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createClassList() {
    const values = new Set();
    return {
        add(...tokens) {
            tokens.forEach((token) => values.add(String(token)));
        },
        remove(...tokens) {
            tokens.forEach((token) => values.delete(String(token)));
        },
        contains(token) {
            return values.has(String(token));
        },
        toggle(token, force) {
            const key = String(token);
            const shouldAdd = (force === undefined) ? !values.has(key) : !!force;
            if (shouldAdd) values.add(key);
            else values.delete(key);
            return shouldAdd;
        }
    };
}

function createElementStub() {
    const handlers = new Map();
    const el = {
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        innerHTML: "",
        id: "",
        readOnly: false,
        children: [],
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            child.parentElement = this;
            return child;
        },
        setAttribute() { },
        addEventListener(type, cb) {
            const key = String(type || "");
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(cb);
        },
        dispatch(type, event = {}) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            list.forEach((cb) => cb(event));
        },
        insertAdjacentHTML() { },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        }
    };
    return el;
}

function findDescendants(root, predicate, matched = []) {
    if (!root || typeof root !== "object") return matched;
    (root.children || []).forEach((child) => {
        if (predicate(child)) matched.push(child);
        findDescendants(child, predicate, matched);
    });
    return matched;
}

function loadMultiRangeRenderModule(options = {}) {
    const globalPatches = {
        window: options.window || {},
        document: options.document || {
            activeElement: null,
            getElementById() {
                return null;
            },
            createElement() {
                return createElementStub();
            }
        },
        console
    };
    const keys = ["window", "document", "GTVMultiRangeRender", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMultiRangeRender || globalThis.GTVMultiRangeRender;
}

describe("GTV multi-range render module", () => {
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

    it("buildTimezoneComputedSnapshotForRange returns null for missing timezone", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        expect(service.buildTimezoneComputedSnapshotForRange(null, new Date(), new Date())).toBe(null);
    });

    it("applySnapshotToRow exits safely for malformed row objects", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        expect(() => service.applySnapshotToRow(null, {})).not.toThrow();
        expect(() => service.applySnapshotToRow({}, {})).not.toThrow();
    });

    it("applySnapshotToRow populates time inputs from iterable querySelectorAll results", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});
        const slot0Input = { dataset: { inputMode: "datetime" }, value: "" };
        const slot1Input = { dataset: { inputMode: "datetime" }, value: "" };
        const emptyIterable = { *[Symbol.iterator]() { } };
        const iterableOf = (items) => ({ *[Symbol.iterator]() { yield* items; } });
        const row = {
            querySelector() {
                return null;
            },
            querySelectorAll(selector) {
                if (selector === '.time-input[data-slot="0"]') return iterableOf([slot0Input]);
                if (selector === '.time-input[data-slot="1"]') return iterableOf([slot1Input]);
                return emptyIterable;
            }
        };

        service.applySnapshotToRow(row, {
            times: ["2026-03-13 09:00:00", "2026-03-13 10:00:00"],
            dates: ["2026-03-13", "2026-03-13"],
            clocks: ["09:00:00", "10:00:00"],
            dayNames: ["Fri", "Fri"],
            dayIndexes: [5, 5],
            dayNightIcons: ["DAY", "DAY"],
            periodDays: "1d",
            periodTime: "0d 1h 0m"
        });

        expect(slot0Input.value).toBe("2026-03-13 09:00:00");
        expect(slot1Input.value).toBe("2026-03-13 10:00:00");
    });

    it("formatRangeDurationText falls back to english when lang dep is missing", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        const text = service.formatRangeDurationText(0, 90 * 60000);
        expect(text).toBe("0d 1h 30m");
    });

    it("createMultiRangeTableRow returns null when document.createElement is unavailable", () => {
        const module = loadMultiRangeRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        const row = service.createMultiRangeTableRow({ id: "utc" }, {
            rangeIdx: 0,
            range: { startUtcMs: 0, endUtcMs: 1000 },
            displayColumns: [],
            rowId: "utc"
        });
        expect(row).toBe(null);
    });

    it("renderMultiRanges exits safely when container is missing", () => {
        const module = loadMultiRangeRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.renderMultiRanges()).not.toThrow();
    });

    it("renderMultiRanges prefers injected getDocumentRefOrNull over global document", () => {
        const container = createElementStub();
        const module = loadMultiRangeRenderModule({
            document: {
                getElementById() {
                    throw new Error("global document should not be used");
                },
                createElement() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const service = module.createService({
            getDocumentRefOrNull: () => ({
                activeElement: null,
                getElementById(id) {
                    if (id === "multi-ranges-container") return container;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }),
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getZoneDisplayName: () => "UTC",
            escapeHtml: (value) => String(value || ""),
            getDisplayColumns: () => [],
            getRenderableTimezoneRows: () => [],
            getMultiRanges: () => [],
            getMultiRangeCollapsed: () => [],
            getMultiRangeCount: () => 0
        });

        expect(() => service.renderMultiRanges()).not.toThrow();
        expect(container.children).toHaveLength(0);
    });

    it("renderMultiRanges handles empty multi-range state without crashing", () => {
        const container = createElementStub();
        const module = loadMultiRangeRenderModule({
            document: {
                activeElement: null,
                getElementById(id) {
                    if (id === "multi-ranges-container") return container;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getZoneDisplayName: () => "UTC",
            escapeHtml: (value) => String(value || ""),
            getDisplayColumns: () => [],
            getRenderableTimezoneRows: () => [],
            getMultiRanges: () => [],
            getMultiRangeCollapsed: () => [],
            getMultiRangeCount: () => 0
        });

        expect(() => service.renderMultiRanges()).not.toThrow();
        expect(container.children.length).toBe(0);
    });

    it("getTimezoneDisplayPointAtDate falls back to day/night marker by local hour", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({
            buildTimezoneComputedSnapshotForDates: () => ({
                times: ["2026-03-13 20:10:00"],
                dates: ["2026-03-13"],
                clocks: ["20:10:00"],
                dayIndexes: [5],
                dayNames: ["Fri"],
                dayNightIcons: [""]
            }),
            getDayNightMarkerByHour: () => "invalid"
        });

        const point = service.getTimezoneDisplayPointAtDate(new Date(Date.UTC(2026, 2, 13, 0, 0, 0)), {
            id: "utc",
            zone: "UTC"
        });

        expect(point.clockStr).toBe("20:10:00");
        expect(point.dayNightIcon).toBe("NIGHT");
    });

    it("applySnapshotToRow updates day badge and day/night titles", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({
            t: (key) => key
        });
        const dayBadge0 = {
            textContent: "",
            className: "",
            classList: createClassList()
        };
        const dayBadge1 = {
            textContent: "",
            className: "",
            classList: createClassList()
        };
        const dn0 = { textContent: "", title: "" };
        const dn1 = { textContent: "", title: "" };
        const periodDays = { textContent: "" };
        const periodTime = { textContent: "" };
        const focusedInput = { dataset: { inputMode: "datetime" }, value: "" };
        const otherInput = { dataset: { inputMode: "none" }, value: "seed" };
        const row = {
            querySelector(selector) {
                if (selector === ".period-days-text") return periodDays;
                if (selector === ".period-time-text") return periodTime;
                return null;
            },
            querySelectorAll(selector) {
                if (selector === '.time-input[data-slot="0"]') return [focusedInput];
                if (selector === '.time-input[data-slot="1"]') return [otherInput];
                if (selector === ".day-slot-0") return [dayBadge0];
                if (selector === ".day-slot-1") return [dayBadge1];
                if (selector === ".dn-slot-0") return [dn0];
                if (selector === ".dn-slot-1") return [dn1];
                return [];
            }
        };
        const doc = {
            activeElement: focusedInput,
            getElementById() {
                return null;
            },
            createElement() {
                return createElementStub();
            }
        };
        const moduleWithDoc = loadMultiRangeRenderModule({ document: doc });
        const serviceWithDoc = moduleWithDoc.createService({
            t: (key) => key
        });

        serviceWithDoc.applySnapshotToRow(row, {
            times: ["2026-03-13 09:00:00", "2026-03-14 10:00:00"],
            dates: ["2026-03-13", "2026-03-14"],
            clocks: ["09:00:00", "10:00:00"],
            dayNames: ["Sun", "Sat"],
            dayIndexes: [0, 6],
            dayNightIcons: ["DAY", "NIGHT"],
            periodDays: " ",
            periodTime: ""
        });

        expect(focusedInput.value).toBe("");
        expect(otherInput.value).toBe("");
        expect(dayBadge0.classList.contains("day-sun")).toBe(true);
        expect(dayBadge1.classList.contains("day-sat")).toBe(true);
        expect(dn0.title).toBe("dn_day");
        expect(dn1.title).toBe("dn_night");
        expect(periodDays.textContent).toBe("-");
        expect(periodTime.textContent).toBe("-");
        expect(service).toBeTruthy();
    });

    it("formatRangeDurationText returns localized Korean string when lang is ko", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({
            getCurrentLang: () => "ko"
        });

        expect(service.formatRangeDurationText(2 * 24 * 60 * 60 * 1000, 0)).toBe("-2일 0시간 0분");
    });

    it("createMultiRangeTableRow locks start slot and wires end-slot handlers", () => {
        const createdRows = [];
        let pickerCreateCount = 0;
        let copyArgs = null;
        const handled = [];
        function createTableRowStub() {
            const tr = createElementStub();
            const zoneCode = { classList: createClassList(), textContent: "" };
            const zoneName = { textContent: "" };
            const copyBtn = createElementStub();
            const trigger0 = createElementStub();
            const trigger1 = createElementStub();
            const slot0Input = {
                dataset: { slot: "0", inputMode: "datetime" },
                classList: createClassList(),
                readOnly: false,
                value: "",
                parentElement: { querySelector: () => trigger0 },
                blur() { }
            };
            const slot1Input = {
                dataset: { slot: "1", inputMode: "datetime" },
                classList: createClassList(),
                readOnly: false,
                value: "",
                parentElement: { querySelector: () => trigger1 },
                blurCalls: 0,
                blur() { this.blurCalls += 1; }
            };
            tr.querySelector = (selector) => {
                if (selector === ".zone-code") return zoneCode;
                if (selector === ".zone-name") return zoneName;
                if (selector === ".copy-row-btn") return copyBtn;
                return null;
            };
            tr.querySelectorAll = (selector) => {
                if (selector === ".time-input") return [slot0Input, slot1Input];
                if (selector === '.time-input[data-slot="0"]') return [slot0Input];
                if (selector === '.time-input[data-slot="1"]') return [slot1Input];
                return [];
            };
            tr.__zoneCode = zoneCode;
            tr.__copyBtn = copyBtn;
            tr.__slot0Input = slot0Input;
            tr.__slot1Input = slot1Input;
            tr.__trigger0 = trigger0;
            createdRows.push(tr);
            return tr;
        }

        const module = loadMultiRangeRenderModule({
            window: {
                CustomDatePicker: function CustomDatePicker(inputRef) {
                    pickerCreateCount += 1;
                    this.destroy = () => { inputRef._pickerDestroyed = true; };
                }
            },
            document: {
                activeElement: null,
                getElementById() {
                    return null;
                },
                createElement(tagName) {
                    if (tagName === "tr") return createTableRowStub();
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            buildDynamicRowCell: () => "",
            buildStaticRowCell: () => "",
            getZoneDisplayNameForUiAtDate: () => "UTC",
            getZoneDisplayName: () => "UTC",
            copyMultiRangeRow: (...args) => { copyArgs = args; },
            isMultiRangeStartEditEnabled: () => false,
            isMultiRangeEndEditEnabled: () => true,
            handleMultiRangeTimeChange: (...args) => { handled.push(args); },
            buildTimezoneComputedSnapshotForDates: () => ({
                timezone: "UTC",
                region: "UTC",
                offset: "+00:00",
                times: ["2026-03-13 09:00:00", "2026-03-13 10:00:00"],
                dates: ["2026-03-13", "2026-03-13"],
                clocks: ["09:00:00", "10:00:00"],
                dayNames: ["Fri", "Fri"],
                dayIndexes: [5, 5],
                dayNightIcons: ["DAY", "DAY"],
                periodDays: "1d",
                periodTime: "0d 1h 0m"
            })
        });

        const row = service.createMultiRangeTableRow({ id: "custom1", type: "custom", zone: "CUSTOM" }, {
            rangeIdx: 1,
            range: { startUtcMs: 0, endUtcMs: 3600000 },
            displayColumns: ["time_main", "time_extra"],
            rowId: "custom1"
        });

        expect(row).toBeTruthy();
        const tr = createdRows[0];
        expect(tr.__slot0Input.readOnly).toBe(true);
        expect(tr.__trigger0.style.display).toBe("none");
        expect(pickerCreateCount).toBe(1);
        expect(tr.__zoneCode.classList.contains("zone-code-custom")).toBe(true);

        tr.__slot0Input.onchange?.({ target: { value: "2026-03-13 09:30:00" } });
        tr.__slot1Input.onchange?.({ target: { value: "2026-03-13 10:30:00" } });
        tr.__slot1Input.value = "2026-03-13 11:00:00";
        tr.__slot1Input.onkeydown?.({ key: "Enter" });
        tr.__copyBtn.dispatch("click");

        expect(handled).toHaveLength(2);
        expect(copyArgs).toEqual([1, "custom1"]);
        expect(tr.__slot1Input.blurCalls).toBe(1);
    });

    it("renderMultiRanges clears stale pickers when base timezone is unavailable", () => {
        const stalePickerInput = { _cdp: { destroyCalls: 0, destroy() { this.destroyCalls += 1; } } };
        const container = createElementStub();
        container.querySelectorAll = () => [stalePickerInput];
        const module = loadMultiRangeRenderModule({
            document: {
                activeElement: null,
                getElementById(id) {
                    if (id === "multi-ranges-container") return container;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            getBaseTimezoneRef: () => null
        });

        service.renderMultiRanges();

        expect(stalePickerInput._cdp).toBe(null);
        expect(container.innerHTML).toBe("");
    });

    it("renderMultiRanges creates header actions and dispatches callbacks", () => {
        const container = createElementStub();
        let saveSingleCalls = 0;
        let copyWholeCalls = 0;
        let collapseCalls = 0;
        let expandCalls = 0;
        let toggleCalls = 0;
        const module = loadMultiRangeRenderModule({
            document: {
                activeElement: null,
                getElementById(id) {
                    if (id === "multi-ranges-container") return container;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getDisplayColumns: () => ["timezone"],
            getRenderableTimezoneRows: () => [],
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getMultiRangeCollapsed: () => [false],
            getMultiRangeCount: () => 1,
            getZoneDisplayName: () => "UTC",
            escapeHtml: (value) => String(value || ""),
            getMultiDisplayColumnHeader: () => "<th>tz</th>",
            buildTimezoneComputedSnapshotForDates: () => ({
                times: ["2026-03-13 09:00:00", "2026-03-13 09:00:01"],
                dates: ["2026-03-13", "2026-03-13"],
                clocks: ["09:00:00", "09:00:01"]
            }),
            saveMultiRangeSingleImage: () => { saveSingleCalls += 1; },
            copyWholeMultiRange: () => { copyWholeCalls += 1; },
            setMultiRangesCollapsedBelow: (_idx, shouldCollapse) => {
                if (shouldCollapse) collapseCalls += 1;
                else expandCalls += 1;
            },
            toggleMultiRangeCollapsed: () => { toggleCalls += 1; },
            renderTimeAdjustSet: () => null
        });

        service.renderMultiRanges();

        const buttons = findDescendants(container, (node) => node.className.includes("multi-range-"));
        buttons
            .filter((btn) => btn.className.includes("btn"))
            .forEach((btn) => btn.dispatch("click"));

        expect(container.children.length).toBe(1);
        expect(saveSingleCalls).toBe(1);
        expect(copyWholeCalls).toBe(1);
        expect(collapseCalls).toBe(1);
        expect(expandCalls).toBe(1);
        expect(toggleCalls).toBe(1);
    });
});
