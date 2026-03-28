import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-module-resolution-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainModuleResolutionBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainModuleResolutionBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainModuleResolutionBindings || globalThis.GTVMainModuleResolutionBindings;
}

describe("GTV main module resolution bindings module", () => {
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

    it("creates resolver bridge from module resolver and spec modules", () => {
        const moduleApi = loadMainModuleResolutionBindingsModule();
        const specMap = { A: { globalName: "A" } };
        const moduleSpecModule = {
            createSpecMap: vi.fn(() => specMap)
        };
        const resolved = { A: { ok: true } };
        const moduleResolverModule = {
            resolveModules: vi.fn(() => resolved)
        };

        const service = moduleApi.createService({
            moduleResolverModule,
            moduleSpecModule
        });

        expect(service.resolveModulesFromSpec()).toBe(resolved);
        expect(moduleSpecModule.createSpecMap).toHaveBeenCalledTimes(1);
        expect(moduleResolverModule.resolveModules).toHaveBeenCalledWith(specMap);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing required module APIs", () => {
        const moduleApi = loadMainModuleResolutionBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainModuleResolver.resolveModules"
        );
        expect(() => moduleApi.createService({
            moduleResolverModule: { resolveModules: () => ({}) }
        })).toThrow("Missing required module API: GTVMainModuleSpec.createSpecMap");
    });
});
