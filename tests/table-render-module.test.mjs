import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-render.js");
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
        draggable: false,
        children: [],
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            child.parentElement = this;
            return child;
        },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        },
        insertAdjacentHTML() { },
        addEventListener(type, cb) {
            const key = String(type || "");
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(cb);
        },
        dispatch(type, event = {}) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            list.forEach((cb) => cb(event));
        }
    };
    return el;
}

function loadTableRenderModule(options = {}) {
    const globalPatches = {
        window: options.window || {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelector() {
                return null;
            },
            createElement() {
                return createElementStub();
            }
        },
        console
    };
    const keys = ["window", "document", "GTVTableRender", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTableRender || globalThis.GTVTableRender;
}

describe("GTV table render module", () => {
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

    it("getDisplayColumns tolerates malformed format state", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            sanitizeCopyFormatOrder: () => null,
            getDisplayFormatOrder: () => null,
            getDisplayFormatEnabled: () => null
        });

        expect(service.getDisplayColumns(1)).toEqual([]);
    });

    it("getDisplayTimeInputMode returns none when parts map is missing", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            getDisplayTimePartsEnabled: () => null
        });

        expect(service.getDisplayTimeInputMode()).toBe("none");
    });

    it("getDisplayTimeInputMode honors part toggles even in multi tab", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            isMultiTab: () => true,
            getDisplayTimePartsEnabled: () => ({ dn: true, date: false, time: false, weekday: true })
        });

        expect(service.getDisplayTimeInputMode()).toBe("none");
    });

    it("createInteractiveTimezoneRow exits safely when document.createElement is missing", () => {
        const module = loadTableRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(service.createInteractiveTimezoneRow({ id: "utc" }, 1, ["timezone"], "utc")).toBe(null);
    });

    it("createInteractiveTimezoneRow prefers injected documentRef when global document is unavailable", () => {
        let rowCreateCount = 0;
        const module = loadTableRenderModule({
            document: {
                createElement() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const service = module.createService({
            documentRef: {
                documentElement: {
                    lang: "en",
                    getAttribute() {
                        return "dark";
                    }
                },
                createElement(tagName) {
                    if (tagName === "tr") rowCreateCount += 1;
                    return createElementStub();
                }
            },
            getDisplayTimePartsEnabled: () => ({ date: false, time: false, dn: false, weekday: false }),
            getZoneDisplayName: () => "UTC"
        });

        const row = service.createInteractiveTimezoneRow({ id: "utc", zone: "UTC", type: "standard" }, 1, ["timezone"], "utc");

        expect(row).not.toBe(null);
        expect(rowCreateCount).toBe(1);
    });

    it("createInteractiveTimezoneRow prefers injected getDocumentRefOrNull when global document is unavailable", () => {
        let rowCreateCount = 0;
        const module = loadTableRenderModule({
            document: {
                createElement() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const service = module.createService({
            getDocumentRefOrNull: () => ({
                documentElement: {
                    lang: "en",
                    getAttribute() {
                        return "dark";
                    }
                },
                createElement(tagName) {
                    if (tagName === "tr") rowCreateCount += 1;
                    return createElementStub();
                }
            }),
            getDisplayTimePartsEnabled: () => ({ date: false, time: false, dn: false, weekday: false }),
            getZoneDisplayName: () => "UTC"
        });

        const row = service.createInteractiveTimezoneRow({ id: "utc", zone: "UTC", type: "standard" }, 1, ["timezone"], "utc");

        expect(row).not.toBe(null);
        expect(rowCreateCount).toBe(1);
    });

    it("getRenderableTimezoneRows handles non-array zones input", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            getCurrentGroupZones: () => null,
            isCurrentGroupUtcRowVisible: () => false
        });

        expect(service.getRenderableTimezoneRows({ id: "utc" })).toEqual([]);
    });

    it("renderList exits safely when required DOM nodes are missing", () => {
        const module = loadTableRenderModule({
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
            hideFloatingTooltip: () => { },
            isMultiTab: () => false,
            isRealtime: () => false,
            getSlotCount: () => 1,
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" })
        });

        expect(() => service.renderList()).not.toThrow();
    });

    it("getDisplayColumns keeps time column in multi-tab while filtering period on single slot", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            sanitizeCopyFormatOrder: (order) => order,
            getDisplayFormatOrder: () => ["timezone", "time", "period_days", "period_time"],
            getDisplayFormatEnabled: () => ({
                timezone: true,
                time: false,
                period_days: true,
                period_time: true
            }),
            isMultiTab: () => true
        });

        expect(service.getDisplayColumns(1)).toEqual(["timezone", "time_main"]);
    });

    it("buildTimeColumnCell reflects hidden/readonly branches", () => {
        const module = loadTableRenderModule();
        const hiddenService = module.createService({
            getDisplayTimePartsEnabled: () => ({ dn: true, date: false, time: false, weekday: true })
        });
        const hiddenCell = hiddenService.buildTimeColumnCell(0, 1, { isReadonly: false });
        expect(hiddenCell).toContain("time-input-hidden");
        expect(hiddenCell).toContain("readonly");
        expect(hiddenCell).toContain("day-slot-0");
        expect(hiddenCell).not.toContain("trigger-slot-0");

        const timeOnlyService = module.createService({
            getDisplayTimePartsEnabled: () => ({ dn: false, date: false, time: true, weekday: false })
        });
        const timeOnlyCell = timeOnlyService.buildTimeColumnCell(0, 1, { isReadonly: true });
        expect(timeOnlyCell).toContain('data-input-mode="time"');
        expect(timeOnlyCell).toContain("readonly");
    });

    it("getDisplayColumnHeader switches between range and main labels", () => {
        const module = loadTableRenderModule();
        const rangeService = module.createService({
            t: (key) => key,
            isRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(rangeService.getDisplayColumnHeader("time_main")).toContain("th_time_day_start");
        expect(rangeService.getDisplayColumnHeader("time_extra")).toContain("th_time_day_end");

        const mainService = module.createService({
            t: (key) => key,
            isRealtime: () => true,
            getSlotCount: () => 2
        });
        expect(mainService.getDisplayColumnHeader("time_main")).toContain("th_time_day_main");
    });

    it("buildRowActionCells includes remove title when provided", () => {
        const module = loadTableRenderModule();
        const service = module.createService({});
        const html = service.buildRowActionCells("copy", "X", "remove-title");

        expect(html).toContain("copy-row-btn");
        expect(html).toContain('title="remove-title"');
        expect(html).toContain("remove-row-btn");
    });

    it("getRenderableTimezoneRows inserts utc row at configured order", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            getCurrentGroupZones: () => [
                { id: "tokyo", zone: "Asia/Tokyo", type: "standard" },
                { id: "ny", zone: "America/New_York", type: "standard" }
            ],
            isCurrentGroupUtcRowVisible: () => true,
            getUTCRef: () => ({ id: "utc", zone: "UTC", type: "standard" }),
            getCurrentGroupUtcRowOrder: () => 1
        });

        const rows = service.getRenderableTimezoneRows({ id: "base", zone: "Asia/Seoul", type: "standard" });
        expect(rows.map((row) => row.id)).toEqual(["tokyo", "utc", "ny"]);
    });

    it("createInteractiveTimezoneRow wires row handlers and drag lifecycle", () => {
        let copyCalls = 0;
        let removeCalls = 0;
        const timeChanges = [];
        let clearGhostCalls = 0;
        let saveOrderCalls = 0;
        let updateCalls = 0;
        let pickerCreateCalls = 0;
        const createdRows = [];

        function createRowStub() {
            const tr = createElementStub();
            const zoneName = { textContent: "" };
            const zoneCode = { classList: createClassList() };
            const copyBtn = createElementStub();
            const removeBtn = createElementStub();
            const dragHandle = createElementStub();
            dragHandle.className = "drag-handle";
            const trigger0 = createElementStub();
            const slot0 = {
                dataset: { slot: "0", inputMode: "datetime" },
                classList: createClassList(),
                value: "",
                blurCalls: 0,
                blur() { this.blurCalls += 1; },
                parentElement: { querySelector: () => trigger0 }
            };
            const selectorMap = {
                ".zone-name": zoneName,
                ".zone-code": zoneCode,
                ".copy-row-btn": copyBtn,
                ".remove-row-btn": removeBtn,
                ".drag-handle": dragHandle
            };
            const listMap = {
                ".time-input": [slot0]
            };
            tr.querySelector = (selector) => selectorMap[selector] || null;
            tr.querySelectorAll = (selector) => listMap[selector] || [];
            tr.__copyBtn = copyBtn;
            tr.__removeBtn = removeBtn;
            tr.__dragHandle = dragHandle;
            tr.__slot0 = slot0;
            tr.__zoneCode = zoneCode;
            createdRows.push(tr);
            return tr;
        }

        const module = loadTableRenderModule({
            window: {
                CustomDatePicker: function CustomDatePicker() {
                    pickerCreateCalls += 1;
                    this.destroy = () => { };
                }
            },
            document: {
                documentElement: {
                    lang: "en",
                    getAttribute() {
                        return "dark";
                    }
                },
                getElementById() {
                    return null;
                },
                querySelector() {
                    return null;
                },
                createElement(tagName) {
                    if (tagName === "tr") return createRowStub();
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            t: (key) => key,
            getDisplayTimePartsEnabled: () => ({ date: true, time: true, dn: true, weekday: true }),
            isRealtime: () => false,
            getZoneDisplayName: () => "KST",
            copyRow: () => { copyCalls += 1; },
            removeTimezone: () => { removeCalls += 1; },
            handleTimeChange: (...args) => { timeChanges.push(args); },
            createDragGhostFromRow: () => createElementStub(),
            clearDragGhost: () => { clearGhostCalls += 1; },
            saveOrder: () => { saveOrderCalls += 1; },
            updateClocks: () => { updateCalls += 1; }
        });

        const row = service.createInteractiveTimezoneRow(
            { id: "seoul", zone: "Asia/Seoul", type: "standard" },
            1,
            ["timezone", "region", "time_main"],
            "seoul",
            new Date(Date.UTC(2026, 2, 13, 0, 0, 0))
        );

        expect(row).toBeTruthy();
        const tr = createdRows[0];
        tr.__copyBtn.dispatch("click");
        tr.__removeBtn.dispatch("click");
        tr.__slot0.onchange?.({ target: { value: "2026-03-13 09:00:00" } });
        tr.__slot0.onkeydown?.({ key: "Enter", target: { value: "2026-03-13 09:30:00" } });
        tr.__dragHandle.dispatch("dragstart", {
            dataTransfer: {
                effectAllowed: "",
                setData() { },
                setDragImage() { }
            }
        });
        tr.__dragHandle.dispatch("dragend");

        expect(copyCalls).toBe(1);
        expect(removeCalls).toBe(1);
        expect(timeChanges).toHaveLength(2);
        expect(tr.__slot0.blurCalls).toBe(1);
        expect(clearGhostCalls).toBe(1);
        expect(saveOrderCalls).toBe(1);
        expect(updateCalls).toBe(1);
        expect(pickerCreateCalls).toBe(1);
        expect(tr.__zoneCode.classList.contains("zone-code-standard")).toBe(true);
    });

    it("createInteractiveTimezoneRow skips picker and edit handlers in realtime mode", () => {
        let pickerCreateCalls = 0;
        let handleTimeChangeCalls = 0;
        const createdRows = [];

        function createRowStub() {
            const tr = createElementStub();
            const zoneName = { textContent: "" };
            const zoneCode = { classList: createClassList() };
            const copyBtn = createElementStub();
            const removeBtn = createElementStub();
            const dragHandle = createElementStub();
            const trigger0 = createElementStub();
            const slot0 = {
                dataset: { slot: "0", inputMode: "datetime" },
                classList: createClassList(),
                value: "",
                blur() { },
                parentElement: { querySelector: () => trigger0 },
                readOnly: false,
                onchange: undefined,
                onkeydown: undefined
            };
            const selectorMap = {
                ".zone-name": zoneName,
                ".zone-code": zoneCode,
                ".copy-row-btn": copyBtn,
                ".remove-row-btn": removeBtn,
                ".drag-handle": dragHandle
            };
            const listMap = {
                ".time-input": [slot0]
            };
            tr.querySelector = (selector) => selectorMap[selector] || null;
            tr.querySelectorAll = (selector) => listMap[selector] || [];
            tr.__slot0 = slot0;
            createdRows.push(tr);
            return tr;
        }

        const module = loadTableRenderModule({
            window: {
                CustomDatePicker: function CustomDatePicker() {
                    pickerCreateCalls += 1;
                    this.destroy = () => { };
                }
            },
            document: {
                documentElement: {
                    lang: "en",
                    getAttribute() {
                        return "dark";
                    }
                },
                getElementById() {
                    return null;
                },
                querySelector() {
                    return null;
                },
                createElement(tagName) {
                    if (tagName === "tr") return createRowStub();
                    return createElementStub();
                }
            }
        });

        const service = module.createService({
            t: (key) => key,
            getDisplayTimePartsEnabled: () => ({ date: true, time: true, dn: true, weekday: true }),
            isRealtime: () => true,
            getZoneDisplayName: () => "KST",
            handleTimeChange: () => { handleTimeChangeCalls += 1; }
        });

        const row = service.createInteractiveTimezoneRow(
            { id: "seoul", zone: "Asia/Seoul", type: "standard" },
            1,
            ["timezone", "region", "time_main"],
            "seoul",
            new Date(Date.UTC(2026, 2, 13, 0, 0, 0))
        );

        expect(row).toBeTruthy();
        const tr = createdRows[0];
        expect(pickerCreateCalls).toBe(0);
        expect(tr.__slot0.readOnly).toBe(true);
        expect(tr.__slot0.onchange).toBe(null);
        expect(tr.__slot0.onkeydown).toBe(null);
        expect(handleTimeChangeCalls).toBe(0);
    });

    it("renderList delegates directly to multi-range render when multi tab is active", () => {
        const module = loadTableRenderModule({
            document: {
                getElementById() {
                    return null;
                },
                querySelector() {
                    return null;
                }
            }
        });
        let multiRenderCalls = 0;
        const service = module.createService({
            isMultiTab: () => true,
            hideFloatingTooltip: () => { },
            renderMultiRanges: () => { multiRenderCalls += 1; }
        });

        service.renderList();

        expect(multiRenderCalls).toBe(1);
    });

    it("renderList builds table head and appends base plus dynamic rows", () => {
        const headRow = createElementStub();
        let headHtml = "";
        headRow.insertAdjacentHTML = (_where, html) => { headHtml = html; };
        const container = createElementStub();
        container.querySelectorAll = () => [];
        const module = loadTableRenderModule({
            document: {
                getElementById(id) {
                    if (id === "clocks-container") return container;
                    return null;
                },
                querySelector(selector) {
                    if (selector === "#table-head tr") return headRow;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        let baseSelectCalls = 0;
        let adjustPanelCalls = 0;
        let updateCalls = 0;
        const service = module.createService({
            t: (key) => key,
            hideFloatingTooltip: () => { },
            isMultiTab: () => false,
            isRealtime: () => false,
            getSlotCount: () => 1,
            getDisplayFormatOrder: () => ["timezone", "time"],
            sanitizeCopyFormatOrder: (order) => order,
            getDisplayFormatEnabled: () => ({ timezone: true, time: true }),
            getDisplayTimePartsEnabled: () => ({ dn: true, date: true, time: true, weekday: true }),
            getBaseTimezoneRef: () => ({ id: "base", zone: "UTC", type: "standard" }),
            getCurrentGroupZones: () => [{ id: "tokyo", zone: "Asia/Tokyo", type: "standard" }],
            getZoneDisplayName: () => "UTC",
            isCurrentGroupUtcRowVisible: () => false,
            renderBaseTimeSelect: () => { baseSelectCalls += 1; },
            updateTimeAdjustPanel: () => { adjustPanelCalls += 1; },
            updateClocks: () => { updateCalls += 1; },
            upgradeNativeTitleTooltips: () => { }
        });

        service.renderList();

        expect(headHtml).toContain("th_order");
        expect(container.children.length).toBe(2);
        expect(baseSelectCalls).toBe(1);
        expect(adjustPanelCalls).toBe(1);
        expect(updateCalls).toBe(1);
    });
});
