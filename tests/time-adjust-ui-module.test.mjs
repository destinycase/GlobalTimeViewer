import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-ui.js");

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
        }
    };
}

function createElementStub() {
    const listeners = new Map();
    return {
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        innerHTML: "",
        children: [],
        scrollWidth: 0,
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            return child;
        },
        addEventListener(eventName, handler) {
            if (!listeners.has(eventName)) listeners.set(eventName, []);
            listeners.get(eventName).push(handler);
        },
        dispatch(eventName, extra = {}) {
            const handlers = listeners.get(eventName) || [];
            const event = { target: this, ...extra };
            handlers.forEach((handler) => handler(event));
        },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        }
    };
}

function loadTimeAdjustUiModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement() {
                return createElementStub();
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/time-adjust-ui.js" });
    return sandbox.window.GTVTimeAdjustUI || sandbox.GTVTimeAdjustUI || sandbox.globalThis.GTVTimeAdjustUI;
}

describe("GTV time adjust UI module", () => {
    it("sanitizeTimeAdjustDayStep falls back to safe defaults when constants are missing", () => {
        const module = loadTimeAdjustUiModule();
        const service = module.createService({});

        expect(service.sanitizeTimeAdjustDayStep("abc")).toBe(1);
        expect(service.sanitizeTimeAdjustDayStep(0)).toBe(1);
        expect(service.sanitizeTimeAdjustDayStep(999999)).toBe(36500);
    });

    it("attachTimeAdjustToggleLabel exits safely for invalid elements", () => {
        const module = loadTimeAdjustUiModule();
        const service = module.createService({});

        expect(() => service.attachTimeAdjustToggleLabel(null, true, "X", () => { })).not.toThrow();
        expect(() => service.attachTimeAdjustToggleLabel({}, true, "X", () => { })).not.toThrow();
    });

    it("updateTimeAdjustPanel exits safely when required DOM nodes are missing", () => {
        const module = loadTimeAdjustUiModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.updateTimeAdjustPanel()).not.toThrow();
    });

    it("updateTimeAdjustPanel renders fixed mode controls for one slot", () => {
        const frame = createElementStub();
        const row = createElementStub();
        const buttons = createElementStub();
        const module = loadTimeAdjustUiModule({
            document: {
                getElementById(id) {
                    if (id === "time-adjust-frame") return frame;
                    if (id === "time-adjust-row") return row;
                    if (id === "time-adjust-buttons") return buttons;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const daySteps = [1, 1];
        const service = module.createService({
            t: (key) => key,
            DEFAULT_TIME_ADJUST_DAY_STEP: 1,
            MIN_TIME_ADJUST_DAY_STEP: 1,
            MAX_TIME_ADJUST_DAY_STEP: 36500,
            getCurrentMainTab: () => "fixed",
            isRealtime: () => false,
            getSlotCount: () => 1,
            getTimeAdjustDayStepValue: (idx) => daySteps[idx] ?? 1,
            setTimeAdjustDayStepValue: (idx, value) => { daySteps[idx] = value; }
        });

        service.updateTimeAdjustPanel();

        expect(frame.style.display).toBe("block");
        expect(row.style.display).toBe("block");
        expect(buttons.children.length).toBe(1);
    });

    it("updateTimeAdjustPanel hides controls outside fixed mode", () => {
        const frame = createElementStub();
        const row = createElementStub();
        const buttons = createElementStub();
        buttons.textContent = "stale";
        const module = loadTimeAdjustUiModule({
            document: {
                getElementById(id) {
                    if (id === "time-adjust-frame") return frame;
                    if (id === "time-adjust-row") return row;
                    if (id === "time-adjust-buttons") return buttons;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            getCurrentMainTab: () => "live"
        });

        service.updateTimeAdjustPanel();

        expect(frame.style.display).toBe("none");
        expect(row.style.display).toBe("none");
        expect(buttons.textContent).toBe("");
    });

    it("createTimeAdjustActionButton uses applyTimeAdjustAction dependency by default", () => {
        const module = loadTimeAdjustUiModule();
        const calls = [];
        const service = module.createService({
            t: (key) => key,
            applyTimeAdjustAction: (slotIdx, action) => {
                calls.push({ slotIdx, action });
            }
        });

        const button = service.createTimeAdjustActionButton("btn_plus_hour", 1, "plus_hour");
        button.dispatch("click");

        expect(calls).toEqual([{ slotIdx: 1, action: "plus_hour" }]);
    });
});
