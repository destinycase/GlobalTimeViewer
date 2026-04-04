import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-ui.js");
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
    const globalPatches = {
        window: {},
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
    const keys = ["window", "document", "console", "GTVTimeAdjustUI", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTimeAdjustUI || globalThis.GTVTimeAdjustUI;
}

describe("GTV time adjust UI module", () => {
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

    it("sanitizeTimeAdjustDayStep falls back to safe defaults when constants are missing", () => {
        const module = loadTimeAdjustUiModule();
        const service = module.createService({});

        expect(service.sanitizeTimeAdjustDayStep("abc")).toBe(1);
        expect(service.sanitizeTimeAdjustDayStep(0)).toBe(1);
        expect(service.sanitizeTimeAdjustDayStep(999999)).toBe(36500);
    });

    it("createTimeAdjustActionButton uses deps.document when global document is insufficient", () => {
        const fallbackDocument = {
            createElement() {
                return createElementStub();
            }
        };
        const module = loadTimeAdjustUiModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const calls = [];
        const service = module.createService({
            document: fallbackDocument,
            t: (key) => key,
            applyTimeAdjustAction: (slotIdx, action) => {
                calls.push({ slotIdx, action });
            }
        });

        const button = service.createTimeAdjustActionButton("btn_plus_hour", 0, "plus_hour");
        button.dispatch("click");

        expect(button).toBeTruthy();
        expect(calls).toEqual([{ slotIdx: 0, action: "plus_hour" }]);
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

    it("createTimeAdjustActionButton prefers injected getDocumentRefOrNull over global document", () => {
        const module = loadTimeAdjustUiModule({
            document: {
                createElement() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const calls = [];
        const service = module.createService({
            getDocumentRefOrNull: () => ({
                createElement() {
                    return createElementStub();
                }
            }),
            t: (key) => key,
            applyTimeAdjustAction: (slotIdx, action) => {
                calls.push({ slotIdx, action });
            }
        });

        const button = service.createTimeAdjustActionButton("btn_plus_hour", 2, "plus_hour");
        button.dispatch("click");

        expect(button).toBeTruthy();
        expect(calls).toEqual([{ slotIdx: 2, action: "plus_hour" }]);
    });
});
