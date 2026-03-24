import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-state.js");

function loadMultiRangeStateModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Date: options.Date || Date,
        document: options.document || {
            getElementById() {
                return null;
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-range-state.js" });
    return sandbox.window.GTVMultiRangeState || sandbox.GTVMultiRangeState || sandbox.globalThis.GTVMultiRangeState;
}

function createState(overrides = {}) {
    return {
        multiRangeCount: 1,
        multiRangeTitle: "",
        multiRanges: [{ startUtcMs: 1000, endUtcMs: 2000 }],
        multiRangeCollapsed: [false],
        multiRangeStartEditEnabled: [false],
        multiRangeEndEditEnabled: [true],
        ...overrides
    };
}

function createDeps(state, overrides = {}) {
    return {
        MIN_MULTI_RANGE_COUNT: 1,
        MAX_MULTI_RANGE_COUNT: 3,
        t: (key) => key,
        getState: () => state,
        setState: (next) => {
            Object.assign(state, next);
        },
        getGlobalTimes: () => [new Date(1000), new Date(2000)],
        isMultiTab: () => false,
        renderMultiRanges: () => { },
        savePersistence: () => { },
        showToast: () => { },
        ...overrides
    };
}

describe("GTV multi-range state module", () => {
    it("sanitizeMultiRangeCount clamps by configured min/max", () => {
        const module = loadMultiRangeStateModule();
        const service = module.createService({
            MIN_MULTI_RANGE_COUNT: 2,
            MAX_MULTI_RANGE_COUNT: 4
        });

        expect(service.sanitizeMultiRangeCount("abc")).toBe(2);
        expect(service.sanitizeMultiRangeCount(1)).toBe(2);
        expect(service.sanitizeMultiRangeCount(9)).toBe(4);
        expect(service.sanitizeMultiRangeCount(3)).toBe(3);
    });

    it("ensureMultiRangeState normalizes ranges/title and links start times", () => {
        const module = loadMultiRangeStateModule();
        const state = createState({
            multiRangeCount: 3,
            multiRangeTitle: "",
            multiRanges: [{ startUtcMs: 1000, endUtcMs: 2000 }],
            multiRangeCollapsed: [true],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: []
        });
        const service = module.createService(createDeps(state));

        service.ensureMultiRangeState();

        expect(state.multiRangeTitle).toBe("placeholder_range_title");
        expect(state.multiRanges).toHaveLength(3);
        expect(state.multiRanges[1]).toEqual({ startUtcMs: 2000, endUtcMs: 3000 });
        expect(state.multiRanges[2]).toEqual({ startUtcMs: 3000, endUtcMs: 4000 });
        expect(state.multiRangeCollapsed).toEqual([true, false, false]);
        expect(state.multiRangeStartEditEnabled).toEqual([false, false, false]);
        expect(state.multiRangeEndEditEnabled).toEqual([true, true, true]);
    });

    it("setMultiRangeStartEditEnabled updates linkage and can skip render/persist", () => {
        const module = loadMultiRangeStateModule();
        const state = createState({
            multiRangeCount: 2,
            multiRanges: [
                { startUtcMs: 1000, endUtcMs: 2000 },
                { startUtcMs: 2500, endUtcMs: 3500 }
            ],
            multiRangeStartEditEnabled: [false, true],
            multiRangeEndEditEnabled: [true, true]
        });
        let renderCalls = 0;
        let persistCalls = 0;
        const service = module.createService(createDeps(state, {
            isMultiTab: () => true,
            renderMultiRanges: () => { renderCalls += 1; },
            savePersistence: () => { persistCalls += 1; }
        }));

        const changed = service.setMultiRangeStartEditEnabled(1, false);
        expect(changed).toBe(true);
        expect(state.multiRanges[1].startUtcMs).toBe(2000);
        expect(renderCalls).toBe(1);
        expect(persistCalls).toBe(1);

        const changedNoSideEffects = service.setMultiRangeStartEditEnabled(1, true, {
            persist: false,
            rerender: false
        });
        expect(changedNoSideEffects).toBe(true);
        expect(renderCalls).toBe(1);
        expect(persistCalls).toBe(1);
    });

    it("syncLinkedRangesFrom stops at unlocked range by default and can continue", () => {
        const module = loadMultiRangeStateModule();
        const state = createState({
            multiRangeCount: 4,
            multiRanges: [
                { startUtcMs: 0, endUtcMs: 10 },
                { startUtcMs: 10, endUtcMs: 20 },
                { startUtcMs: 25, endUtcMs: 35 },
                { startUtcMs: 40, endUtcMs: 50 }
            ],
            multiRangeStartEditEnabled: [false, false, true, false],
            multiRangeEndEditEnabled: [true, true, true, true]
        });
        const service = module.createService(createDeps(state, {
            MAX_MULTI_RANGE_COUNT: 6
        }));

        service.syncLinkedRangesFrom(0, { includeCurrent: true, stopAtFirstUnlocked: true });
        expect(state.multiRanges[2]).toEqual({ startUtcMs: 25, endUtcMs: 35 });
        expect(state.multiRanges[3]).toEqual({ startUtcMs: 35, endUtcMs: 50 });

        service.syncLinkedRangesFrom(0, { includeCurrent: true, stopAtFirstUnlocked: false });
        expect(state.multiRanges[3]).toEqual({ startUtcMs: 35, endUtcMs: 50 });
    });

    it("setMultiRangeCount applies boundaries and emits boundary toasts", () => {
        const module = loadMultiRangeStateModule();
        const state = createState({
            multiRangeCount: 1
        });
        const toasts = [];
        const service = module.createService(createDeps(state, {
            showToast: (message) => {
                toasts.push(String(message));
            }
        }));

        service.setMultiRangeCount(99, { showBoundaryToast: true, persist: false, rerender: false });
        expect(state.multiRangeCount).toBe(3);
        expect(toasts).toContain("toast_range_count_max");

        service.setMultiRangeCount(0, { showBoundaryToast: true, persist: false, rerender: false });
        expect(state.multiRangeCount).toBe(1);
        expect(toasts).toContain("toast_range_count_min");
    });

    it("refreshMultiRangeControls syncs input value and boundary button disabled states", () => {
        const countInput = { value: "" };
        const decreaseBtn = { disabled: false };
        const increaseBtn = { disabled: false };
        const documentStub = {
            getElementById(id) {
                if (id === "multi-range-count-input") return countInput;
                if (id === "multi-range-count-decrease") return decreaseBtn;
                if (id === "multi-range-count-increase") return increaseBtn;
                return null;
            }
        };
        const module = loadMultiRangeStateModule({ document: documentStub });
        const state = createState({ multiRangeCount: 3 });
        const service = module.createService(createDeps(state));

        service.refreshMultiRangeControls();
        expect(countInput.value).toBe("3");
        expect(decreaseBtn.disabled).toBe(false);
        expect(increaseBtn.disabled).toBe(true);

        state.multiRangeCount = 1;
        service.refreshMultiRangeControls();
        expect(countInput.value).toBe("1");
        expect(decreaseBtn.disabled).toBe(true);
        expect(increaseBtn.disabled).toBe(false);
    });

    it("setMultiRangeSlotDate validates input date and updates chosen slot", () => {
        const module = loadMultiRangeStateModule();
        const state = createState({
            multiRangeCount: 1,
            multiRanges: [{ startUtcMs: 1000, endUtcMs: 2000 }]
        });
        const service = module.createService(createDeps(state));

        const invalid = service.setMultiRangeSlotDate(0, 1, new Date("invalid"));
        expect(invalid).toBe(false);
        expect(state.multiRanges[0].endUtcMs).toBe(2000);

        const nextDate = new Date(5000);
        const valid = service.setMultiRangeSlotDate(0, 1, nextDate);
        expect(valid).toBe(true);
        expect(state.multiRanges[0].endUtcMs).toBe(5000);
    });
});
