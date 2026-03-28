import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-composition-config-builder-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCompositionConfigBuilderBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainCompositionConfigBuilderBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCompositionConfigBuilderBindings || globalThis.GTVMainCompositionConfigBuilderBindings;
}

describe("GTV main composition config builder bindings module", () => {
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

    it("creates composition config builder bindings from delegated module", () => {
        const moduleApi = loadMainCompositionConfigBuilderBindingsModule();
        const mainCompositionConfigBuilderService = {
            buildPersistenceCompositionConfig: vi.fn(() => ({ ok: true })),
            buildRuntimeCompositionConfig: vi.fn(() => ({ ok: true }))
        };
        const compositionConfigBuilderModule = {
            createService: vi.fn(() => mainCompositionConfigBuilderService)
        };

        const service = moduleApi.createService({
            compositionConfigBuilderModule
        });

        expect(compositionConfigBuilderModule.createService).toHaveBeenCalledWith({});
        expect(service.mainCompositionConfigBuilderService).toBe(mainCompositionConfigBuilderService);
        expect(service.buildPersistenceCompositionConfig).toBe(
            mainCompositionConfigBuilderService.buildPersistenceCompositionConfig
        );
        expect(service.buildRuntimeCompositionConfig).toBe(
            mainCompositionConfigBuilderService.buildRuntimeCompositionConfig
        );
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainCompositionConfigBuilderBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainCompositionConfigBuilder.createService"
        );
        expect(() => moduleApi.createService({
            compositionConfigBuilderModule: { createService: () => null }
        })).toThrow("Invalid main composition config builder service");
        expect(() => moduleApi.createService({
            compositionConfigBuilderModule: { createService: () => ({}) }
        })).toThrow("Invalid main composition config builder service");
    });
});
