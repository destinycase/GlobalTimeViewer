import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-bridge-helper-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeServiceBridgeHelperBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeServiceBridgeHelperBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeServiceBridgeHelperBindings || globalThis.GTVMainRuntimeServiceBridgeHelperBindings;
}

describe("GTV main runtime service bridge helper bindings module", () => {
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

    it("creates runtime service bridge helper bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelperBindingsModule();
        const runtimeServiceBridgeHelpersService = {
            warnMissingServiceMethod: vi.fn()
        };
        const runtimeServiceBridgeHelpersModule = {
            createService: vi.fn(() => runtimeServiceBridgeHelpersService)
        };

        const service = moduleApi.createService({
            runtimeServiceBridgeHelpersModule,
            getMainServiceMethodBridgeService: () => ({})
        });

        expect(runtimeServiceBridgeHelpersModule.createService).toHaveBeenCalledWith({
            getMainServiceMethodBridgeService: expect.any(Function)
        });
        expect(service.mainRuntimeServiceBridgeHelpersService).toBe(runtimeServiceBridgeHelpersService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelperBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeServiceBridgeHelpers.createService"
        );
        expect(() => moduleApi.createService({
            runtimeServiceBridgeHelpersModule: { createService: () => null }
        })).toThrow("Invalid main runtime service bridge helpers service");
    });
});
