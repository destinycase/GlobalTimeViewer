import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-primary-state-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePrimaryStateBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePrimaryStateBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimePrimaryStateBindings || globalThis.GTVMainRuntimePrimaryStateBindings;
}

describe("GTV main runtime primary state bindings module", () => {
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

    it("creates runtime primary state bindings from delegated module", () => {
        const moduleApi = loadMainRuntimePrimaryStateBindingsModule();
        const mainRuntimePrimaryStateService = {
            setIsRealtimeState: vi.fn(() => true)
        };
        const runtimePrimaryStateModule = {
            createService: vi.fn(() => mainRuntimePrimaryStateService)
        };

        const service = moduleApi.createService({
            runtimePrimaryStateModule,
            getIsRealtime: () => false
        });

        expect(runtimePrimaryStateModule.createService).toHaveBeenCalledWith({
            getIsRealtime: expect.any(Function)
        });
        expect(service.mainRuntimePrimaryStateService).toBe(mainRuntimePrimaryStateService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimePrimaryStateBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimePrimaryState.createService"
        );
        expect(() => moduleApi.createService({
            runtimePrimaryStateModule: { createService: () => null }
        })).toThrow("Invalid main runtime primary state service");
    });
});
