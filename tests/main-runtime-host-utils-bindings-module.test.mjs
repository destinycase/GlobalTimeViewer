import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-host-utils-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeHostUtilsBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeHostUtilsBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeHostUtilsBindings || globalThis.GTVMainRuntimeHostUtilsBindings;
}

describe("GTV main runtime host utils bindings module", () => {
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

    it("creates runtime host utils bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeHostUtilsBindingsModule();
        const mainRuntimeHostUtilsService = { applyVersionBranding: vi.fn(() => undefined) };
        const runtimeHostUtilsModule = {
            createService: vi.fn(() => mainRuntimeHostUtilsService)
        };

        const service = moduleApi.createService({
            runtimeHostUtilsModule,
            appDisplayName: "App"
        });

        expect(runtimeHostUtilsModule.createService).toHaveBeenCalledWith({
            appDisplayName: "App"
        });
        expect(service.mainRuntimeHostUtilsService).toBe(mainRuntimeHostUtilsService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeHostUtilsBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeHostUtils.createService"
        );
        expect(() => moduleApi.createService({
            runtimeHostUtilsModule: { createService: () => null }
        })).toThrow("Invalid main runtime host utils service");
    });
});
