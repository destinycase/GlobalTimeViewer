import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-initializer-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateInitializerBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateInitializerBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateInitializerBindings || globalThis.GTVMainStateInitializerBindings;
}

describe("GTV main state initializer bindings module", () => {
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

    it("creates state initializer bindings from delegated module", () => {
        const moduleApi = loadMainStateInitializerBindingsModule();
        const mainStateInitializerService = {
            deriveInitialState: vi.fn(() => ({}))
        };
        const stateInitializerModule = {
            createService: vi.fn(() => mainStateInitializerService)
        };

        const service = moduleApi.createService({
            stateInitializerModule
        });

        expect(stateInitializerModule.createService).toHaveBeenCalledWith({});
        expect(service.mainStateInitializerService).toBe(mainStateInitializerService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainStateInitializerBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainStateInitializer.createService"
        );
        expect(() => moduleApi.createService({
            stateInitializerModule: { createService: () => null }
        })).toThrow("Invalid main state initializer service");
    });
});
