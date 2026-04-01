import path from "node:path";
import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-vars.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

function loadFreshModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
}

describe.sequential("GTV main app state vars runtime loading", () => {
    it("registers module on globalThis when window is absent and uses fallback branches", async () => {
        const originalWindow = globalThis.window;
        const hadWindow = Object.prototype.hasOwnProperty.call(globalThis, "window");
        delete globalThis.window;
        delete globalThis.GTVMainAppStateVars;

        try {
            loadFreshModule();
            const moduleApi = globalThis.GTVMainAppStateVars;
            expect(moduleApi).toBeTruthy();

            const fallbackService = moduleApi.createService("invalid");
            expect(fallbackService.initialState.displayFormatOrder).toEqual([]);
            expect(fallbackService.initialState.copyFormatOrder).toEqual([]);
            expect(fallbackService.initialState.timeAdjustDayStepBySlot).toEqual([1, 1]);

            const noOpSetters = fallbackService.createDirectStateSetters(null);
            expect(() => noOpSetters.showTimeline(1)).not.toThrow();
            expect(() => noOpSetters.groups([])).not.toThrow();
        } finally {
            delete require.cache[MODULE_ID];
            delete globalThis.GTVMainAppStateVars;
            if (hadWindow) {
                globalThis.window = originalWindow;
            } else {
                delete globalThis.window;
            }
        }
    });

    it("registers module on window and applies provided dependencies", async () => {
        const originalWindow = globalThis.window;
        globalThis.window = {};
        delete globalThis.GTVMainAppStateVars;

        try {
            loadFreshModule();
            const moduleApi = globalThis.window.GTVMainAppStateVars;
            expect(moduleApi).toBeTruthy();

            let capturedTimeline = false;
            const service = moduleApi.createService({
                t: () => "",
                copyFormatKeys: ["date"],
                defaultDisplayFormatEnabled: { date: true },
                defaultCopyFormatEnabled: { date: true },
                defaultDisplayTimePartsEnabled: { sec: false },
                defaultCopyTimePartsEnabled: { sec: true },
                defaultTimeAdjustDayStep: 3
            });
            const setters = service.createDirectStateSetters({
                showTimeline: (value) => { capturedTimeline = value; }
            });

            setters.showTimeline("truthy");
            expect(capturedTimeline).toBe(true);
            expect(service.initialState.multiRangeTitle).toBe("Range");
            expect(service.initialState.displayFormatEnabled).toEqual({ date: true });
            expect(service.initialState.timeAdjustDayStepBySlot).toEqual([3, 3]);
        } finally {
            delete require.cache[MODULE_ID];
            delete globalThis.window.GTVMainAppStateVars;
            globalThis.window = originalWindow;
            delete globalThis.GTVMainAppStateVars;
        }
    });
});
