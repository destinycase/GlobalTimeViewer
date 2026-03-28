import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-facade-bridge-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFacadeBridgeBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFacadeBridgeBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFacadeBridgeBindings || globalThis.GTVMainFacadeBridgeBindings;
}

describe("GTV main facade bridge bindings module", () => {
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

    it("creates facade bridge bindings from delegated module", () => {
        const moduleApi = loadMainFacadeBridgeBindingsModule();
        const facadeBridgeService = {
            sanitizeUtcRowOrderViaTimeCore: vi.fn(() => []),
            addTimezone: vi.fn(() => "ok")
        };
        const facadeBridgeModule = {
            createService: vi.fn(() => facadeBridgeService)
        };

        const service = moduleApi.createService({
            facadeBridgeModule,
            facadeBindingsModule: {},
            bindFacadeMethod: () => () => undefined
        });

        expect(facadeBridgeModule.createService).toHaveBeenCalledWith({
            facadeBindingsModule: {},
            bindFacadeMethod: expect.any(Function)
        });
        expect(service.addTimezone()).toBe("ok");
        expect(typeof service.sanitizeUtcRowOrderViaTimeCore).toBe("function");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing bridge module api and invalid result", () => {
        const moduleApi = loadMainFacadeBridgeBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainFacadeBridge.createService"
        );
        expect(() => moduleApi.createService({
            facadeBridgeModule: { createService: () => null }
        })).toThrow("Invalid facade bridge service");
    });
});
