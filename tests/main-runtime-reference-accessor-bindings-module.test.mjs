import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-reference-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeReferenceAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeReferenceAccessorBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeReferenceAccessorBindings || globalThis.GTVMainRuntimeReferenceAccessorBindings;
}

describe("GTV main runtime reference accessor bindings module", () => {
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

    it("delegates to runtime reference accessors module with forwarded dependencies", () => {
        const moduleApi = loadMainRuntimeReferenceAccessorBindingsModule();
        const forwardedDeps = {
            getRenderList: () => [],
            getTranslator: () => (key) => key
        };
        const runtimeReferenceAccessorsService = {
            getRenderListRef: vi.fn(() => ["row"]),
            getTranslatorRef: vi.fn(() => ((key) => key))
        };
        const runtimeReferenceAccessorsModule = {
            createService: vi.fn(() => runtimeReferenceAccessorsService)
        };

        const service = moduleApi.createService({
            runtimeReferenceAccessorsModule,
            ...forwardedDeps
        });

        expect(runtimeReferenceAccessorsModule.createService).toHaveBeenCalledWith(forwardedDeps);
        expect(service.getRenderListRef()).toEqual(["row"]);
        expect(typeof service.getTranslatorRef()).toBe("function");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module API and invalid service result", () => {
        const moduleApi = loadMainRuntimeReferenceAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeReferenceAccessors.createService"
        );
        expect(() => moduleApi.createService({
            runtimeReferenceAccessorsModule: { createService: () => null }
        })).toThrow("Invalid runtime reference accessors service");
    });
});
