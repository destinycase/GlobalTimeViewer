import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-test-helpers-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTestHelpersBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainTestHelpersBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTestHelpersBindings || globalThis.GTVMainTestHelpersBindings;
}

describe("GTV main test helpers bindings module", () => {
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

    it("creates test helper bindings from delegated module", () => {
        const moduleApi = loadMainTestHelpersBindingsModule();
        const mainTestHelpersService = {
            install: vi.fn(() => true)
        };
        const testHelpersModule = {
            createService: vi.fn(() => mainTestHelpersService)
        };

        const service = moduleApi.createService({
            testHelpersModule,
            getGlobalRef: () => globalThis
        });

        expect(testHelpersModule.createService).toHaveBeenCalledWith({
            getGlobalRef: expect.any(Function)
        });
        expect(service.mainTestHelpersService).toBe(mainTestHelpersService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainTestHelpersBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainTestHelpers.createService"
        );
        expect(() => moduleApi.createService({
            testHelpersModule: { createService: () => null }
        })).toThrow("Invalid main test helpers service");
    });
});
