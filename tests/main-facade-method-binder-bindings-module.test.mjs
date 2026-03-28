import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-facade-method-binder-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFacadeMethodBinderBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFacadeMethodBinderBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFacadeMethodBinderBindings || globalThis.GTVMainFacadeMethodBinderBindings;
}

describe("GTV main facade method binder bindings module", () => {
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

    it("creates facade method binder bindings from delegated module", () => {
        const moduleApi = loadMainFacadeMethodBinderBindingsModule();
        const facadeMethodBinderService = {
            deriveFacadeServiceName: vi.fn(() => "mainTimezoneFacadeService"),
            bindFacadeMethod: vi.fn(() => () => undefined)
        };
        const facadeMethodBinderModule = {
            createService: vi.fn(() => facadeMethodBinderService)
        };
        const callServiceMethod = vi.fn(() => undefined);

        const service = moduleApi.createService({
            facadeMethodBinderModule,
            callServiceMethod
        });

        expect(facadeMethodBinderModule.createService).toHaveBeenCalledWith({
            callServiceMethod
        });
        expect(service.mainFacadeMethodBinderService).toBe(facadeMethodBinderService);
        expect(service.deriveFacadeServiceName).toBe(facadeMethodBinderService.deriveFacadeServiceName);
        expect(service.bindFacadeMethod).toBe(facadeMethodBinderService.bindFacadeMethod);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainFacadeMethodBinderBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainFacadeMethodBinder.createService"
        );
        expect(() => moduleApi.createService({
            facadeMethodBinderModule: { createService: () => null }
        })).toThrow("Invalid main facade method binder service");
        expect(() => moduleApi.createService({
            facadeMethodBinderModule: { createService: () => ({}) }
        })).toThrow("Invalid main facade method binder service");
    });
});
