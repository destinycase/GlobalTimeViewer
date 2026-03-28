import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-core-assembly-config-builder-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCoreAssemblyConfigBuilderBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainCoreAssemblyConfigBuilderBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCoreAssemblyConfigBuilderBindings || globalThis.GTVMainCoreAssemblyConfigBuilderBindings;
}

describe("GTV main core assembly config builder bindings module", () => {
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

    it("creates core assembly config builder bindings from delegated module", () => {
        const moduleApi = loadMainCoreAssemblyConfigBuilderBindingsModule();
        const mainCoreAssemblyConfigBuilderService = {
            buildMainCoreAssemblyConfig: vi.fn(() => ({ ok: true }))
        };
        const coreAssemblyConfigBuilderModule = {
            createService: vi.fn(() => mainCoreAssemblyConfigBuilderService)
        };

        const service = moduleApi.createService({
            coreAssemblyConfigBuilderModule
        });

        expect(coreAssemblyConfigBuilderModule.createService).toHaveBeenCalledWith({});
        expect(service.mainCoreAssemblyConfigBuilderService).toBe(mainCoreAssemblyConfigBuilderService);
        expect(service.buildMainCoreAssemblyConfig).toBe(mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainCoreAssemblyConfigBuilderBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainCoreAssemblyConfigBuilder.createService"
        );
        expect(() => moduleApi.createService({
            coreAssemblyConfigBuilderModule: { createService: () => null }
        })).toThrow("Invalid main core assembly config builder service");
        expect(() => moduleApi.createService({
            coreAssemblyConfigBuilderModule: { createService: () => ({}) }
        })).toThrow("Invalid main core assembly config builder service");
    });
});
