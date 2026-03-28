import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-patched-state-fallback-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePatchedStateFallbackBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePatchedStateFallbackBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimePatchedStateFallbackBindings || globalThis.GTVMainRuntimePatchedStateFallbackBindings;
}

describe("GTV main runtime patched state fallback bindings module", () => {
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

    it("creates runtime patched state fallback bindings from delegated module", () => {
        const moduleApi = loadMainRuntimePatchedStateFallbackBindingsModule();
        const mainRuntimePatchedStateFallbackService = {
            buildPatchedStateFallbackSnapshot: vi.fn(() => ({}))
        };
        const runtimePatchedStateFallbackModule = {
            createService: vi.fn(() => mainRuntimePatchedStateFallbackService)
        };

        const service = moduleApi.createService({
            runtimePatchedStateFallbackModule,
            getCurrentMainTab: () => "live"
        });

        expect(runtimePatchedStateFallbackModule.createService).toHaveBeenCalledWith({
            getCurrentMainTab: expect.any(Function)
        });
        expect(service.mainRuntimePatchedStateFallbackService).toBe(mainRuntimePatchedStateFallbackService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimePatchedStateFallbackBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimePatchedStateFallback.createService"
        );
        expect(() => moduleApi.createService({
            runtimePatchedStateFallbackModule: { createService: () => null }
        })).toThrow("Invalid main runtime patched state fallback service");
    });
});
