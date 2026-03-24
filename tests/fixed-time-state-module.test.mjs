import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-state.js");

function createDocumentStub(elements = {}) {
    return {
        getElementById(id) {
            return elements[id] || null;
        }
    };
}

function createButton() {
    return {
        disabled: false
    };
}

function createInput() {
    return {
        value: ""
    };
}

function loadFixedTimeStateModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || createDocumentStub(),
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/fixed-time-state.js" });
    return sandbox.window.GTVFixedTimeState || sandbox.GTVFixedTimeState || sandbox.globalThis.GTVFixedTimeState;
}

describe("GTV fixed time state module", () => {
    it("getFixedTimeSlotCount falls back to min when group/sanitize result is invalid", () => {
        const module = loadFixedTimeStateModule();
        const service = module.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 2,
            sanitizeFixedTimeSlotCount: () => Number.NaN
        });

        expect(service.getFixedTimeSlotCount(null)).toBe(2);
    });

    it("getFixedTimeSlotCount uses sanitized group fixedTimes length", () => {
        const module = loadFixedTimeStateModule();
        let ensureCalls = 0;
        const group = { fixedTimes: [{}, {}, {}] };
        const service = module.createService({
            ensureGroupFixedTimes: () => {
                ensureCalls += 1;
            },
            sanitizeFixedTimeSlotCount: (value) => Number(value)
        });

        expect(service.getFixedTimeSlotCount(group)).toBe(3);
        expect(ensureCalls).toBe(1);
    });

    it("setCurrentGroupFixedDate updates state and triggers rerender/persist conditions", () => {
        const module = loadFixedTimeStateModule();
        const group = { fixedDate: "2026-03-07", fixedTimes: [] };
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            sanitizeFixedDateValue: (value, fallback) => String(value || fallback || ""),
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => {
                renderFixedCount += 1;
            },
            renderTimelineFrame: () => {
                renderTimelineCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        expect(service.setCurrentGroupFixedDate("2026-03-08")).toBe(true);
        expect(group.fixedDate).toBe("2026-03-08");
        expect(renderFixedCount).toBe(1);
        expect(renderTimelineCount).toBe(1);
        expect(saveCount).toBe(1);

        expect(service.setCurrentGroupFixedDate("2026-03-08")).toBe(false);
    });

    it("setCurrentGroupFixedDate honors rerender/persist options and missing group guard", () => {
        const module = loadFixedTimeStateModule();
        const serviceNoGroup = module.createService({
            getCurrentGroup: () => null
        });
        expect(serviceNoGroup.setCurrentGroupFixedDate("2026-03-08")).toBe(false);

        const group = { fixedDate: "", fixedTimes: [] };
        let saveCount = 0;
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            sanitizeFixedDateValue: (value) => String(value || ""),
            isFixedTimeTab: () => false,
            savePersistence: () => {
                saveCount += 1;
            }
        });
        expect(service.setCurrentGroupFixedDate("2026-03-08", { persist: false, rerender: false })).toBe(true);
        expect(saveCount).toBe(0);
    });

    it("refreshFixedTimeSlotCountControls disables controls when group is missing", () => {
        const countInput = createInput();
        const decreaseBtn = createButton();
        const increaseBtn = createButton();
        const module = loadFixedTimeStateModule({
            document: createDocumentStub({
                "fixed-time-slot-count-input": countInput,
                "fixed-time-slot-count-decrease": decreaseBtn,
                "fixed-time-slot-count-increase": increaseBtn
            })
        });
        const service = module.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 2,
            getCurrentGroup: () => null
        });

        service.refreshFixedTimeSlotCountControls();

        expect(countInput.value).toBe("2");
        expect(decreaseBtn.disabled).toBe(true);
        expect(increaseBtn.disabled).toBe(true);
    });

    it("refreshFixedTimeSlotCountControls enables controls when group exists", () => {
        const countInput = createInput();
        const decreaseBtn = createButton();
        const increaseBtn = createButton();
        const group = { fixedTimes: [{}, {}] };
        const module = loadFixedTimeStateModule({
            document: createDocumentStub({
                "fixed-time-slot-count-input": countInput,
                "fixed-time-slot-count-decrease": decreaseBtn,
                "fixed-time-slot-count-increase": increaseBtn
            })
        });
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            sanitizeFixedTimeSlotCount: (value) => Number(value)
        });

        service.refreshFixedTimeSlotCountControls();

        expect(countInput.value).toBe("2");
        expect(decreaseBtn.disabled).toBe(false);
        expect(increaseBtn.disabled).toBe(false);
    });

    it("setFixedTimeSlotCount returns false when group is missing", () => {
        const module = loadFixedTimeStateModule();
        const service = module.createService({
            getCurrentGroup: () => null
        });

        expect(service.setFixedTimeSlotCount(3)).toBe(false);
    });

    it("setFixedTimeSlotCount emits boundary toasts and keeps count when unchanged", () => {
        const countInput = createInput();
        const decreaseBtn = createButton();
        const increaseBtn = createButton();
        const group = { fixedTimes: [{ id: "a" }, { id: "b" }] };
        const toasts = [];
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const module = loadFixedTimeStateModule({
            document: createDocumentStub({
                "fixed-time-slot-count-input": countInput,
                "fixed-time-slot-count-decrease": decreaseBtn,
                "fixed-time-slot-count-increase": increaseBtn
            })
        });
        const service = module.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 1,
            MAX_FIXED_TIME_SLOT_COUNT: 5,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            sanitizeFixedTimeSlotCount: () => 2,
            t: (key) => key,
            showToast: (message, options = {}) => {
                toasts.push({ message, type: options.type || "" });
            },
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => {
                renderFixedCount += 1;
            },
            renderTimelineFrame: () => {
                renderTimelineCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        expect(service.setFixedTimeSlotCount(99, { showBoundaryToast: true })).toBe(false);
        expect(service.setFixedTimeSlotCount(0, { showBoundaryToast: true })).toBe(false);
        expect(toasts.some((toast) => toast.message === "toast_fixed_time_max")).toBe(true);
        expect(toasts.some((toast) => toast.message === "toast_fixed_time_min")).toBe(true);
        expect(renderFixedCount).toBe(2);
        expect(renderTimelineCount).toBe(2);
        expect(saveCount).toBe(2);
    });

    it("setFixedTimeSlotCount shrinks and expands slots with rerender/persist hooks", () => {
        const group = {
            fixedTimes: [
                { id: "slot-1", name: "A", time: "09:00" },
                { id: "slot-2", name: "B", time: "10:00" },
                { id: "slot-3", name: "C", time: "11:00" }
            ]
        };
        let idSeq = 0;
        let ensureCalls = 0;
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const module = loadFixedTimeStateModule();
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => {
                ensureCalls += 1;
            },
            sanitizeFixedTimeSlotCount: (value) => {
                const parsed = Number(value);
                if (!Number.isFinite(parsed)) return group.fixedTimes.length;
                return Math.max(1, Math.min(5, Math.trunc(parsed)));
            },
            createUniqueFixedTimeId: () => {
                idSeq += 1;
                return `new-${idSeq}`;
            },
            createDefaultFixedTimeSlot: (id) => ({ id, name: "Fixed", time: "09:00" }),
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => {
                renderFixedCount += 1;
            },
            renderTimelineFrame: () => {
                renderTimelineCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        expect(service.setFixedTimeSlotCount(2)).toBe(true);
        expect(group.fixedTimes).toHaveLength(2);

        expect(service.setFixedTimeSlotCount(4)).toBe(true);
        expect(group.fixedTimes).toHaveLength(4);
        expect(group.fixedTimes[2].id).toBe("new-1");
        expect(group.fixedTimes[3].id).toBe("new-2");

        expect(ensureCalls).toBeGreaterThanOrEqual(2);
        expect(renderFixedCount).toBe(2);
        expect(renderTimelineCount).toBe(2);
        expect(saveCount).toBe(2);
    });
});
