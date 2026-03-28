import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-config-builder-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeServiceConfigBuilderBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeServiceConfigBuilderBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeServiceConfigBuilderBindings || globalThis.GTVMainRuntimeServiceConfigBuilderBindings;
}

describe("GTV main runtime service config builder bindings module", () => {
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

    it("creates runtime service config builder bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderBindingsModule();
        const mainRuntimeServiceConfigBuilderService = {
            buildMainSelectServicesConfig: vi.fn(() => ({ ok: true })),
            buildTimezoneSearchConfig: vi.fn(() => ({ ok: true }))
        };
        const runtimeServiceConfigBuilderModule = {
            createService: vi.fn(() => mainRuntimeServiceConfigBuilderService)
        };

        const service = moduleApi.createService({
            runtimeServiceConfigBuilderModule
        });

        expect(runtimeServiceConfigBuilderModule.createService).toHaveBeenCalledWith({});
        expect(service.mainRuntimeServiceConfigBuilderService).toBe(mainRuntimeServiceConfigBuilderService);
        expect(service.buildMainSelectServicesConfig).toBe(mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig);
        expect(service.buildTimezoneSearchConfig).toBe(mainRuntimeServiceConfigBuilderService.buildTimezoneSearchConfig);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeServiceConfigBuilder.createService"
        );
        expect(() => moduleApi.createService({
            runtimeServiceConfigBuilderModule: { createService: () => null }
        })).toThrow("Invalid main runtime service config builder service");
        expect(() => moduleApi.createService({
            runtimeServiceConfigBuilderModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime service config builder service");
    });
});
