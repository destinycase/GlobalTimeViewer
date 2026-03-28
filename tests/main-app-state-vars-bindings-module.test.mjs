import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-vars-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainAppStateVarsBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainAppStateVarsBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainAppStateVarsBindings || globalThis.GTVMainAppStateVarsBindings;
}

describe("GTV main app state vars bindings module", () => {
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

    it("creates app state vars bindings from delegated module", () => {
        const moduleApi = loadMainAppStateVarsBindingsModule();
        const mainAppStateVarsService = {
            initialState: {},
            createDirectStateSetters: vi.fn(() => ({}))
        };
        const appStateVarsModule = {
            createService: vi.fn(() => mainAppStateVarsService)
        };

        const service = moduleApi.createService({
            appStateVarsModule,
            t: (key) => key
        });

        expect(appStateVarsModule.createService).toHaveBeenCalledWith({
            t: expect.any(Function)
        });
        expect(service.mainAppStateVarsService).toBe(mainAppStateVarsService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainAppStateVarsBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainAppStateVars.createService"
        );
        expect(() => moduleApi.createService({
            appStateVarsModule: { createService: () => null }
        })).toThrow("Invalid main app state vars service");
    });
});
