import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-core-service-assembly-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCoreServiceAssemblyBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainCoreServiceAssemblyBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCoreServiceAssemblyBindings || globalThis.GTVMainCoreServiceAssemblyBindings;
}

describe("GTV main core service assembly bindings module", () => {
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

    it("creates core services via delegated module", () => {
        const moduleApi = loadMainCoreServiceAssemblyBindingsModule();
        const mainCoreServices = { createMainSelectServices: vi.fn(() => ({})) };
        const coreServiceAssemblyModule = {
            createService: vi.fn(() => mainCoreServices)
        };
        const mainCoreAssemblyConfig = { foo: "bar" };

        const service = moduleApi.createService({
            coreServiceAssemblyModule,
            mainCoreAssemblyConfig
        });

        expect(coreServiceAssemblyModule.createService).toHaveBeenCalledWith(mainCoreAssemblyConfig);
        expect(service.mainCoreServices).toBe(mainCoreServices);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainCoreServiceAssemblyBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainCoreServiceAssembly.createService"
        );
        expect(() => moduleApi.createService({
            coreServiceAssemblyModule: { createService: () => null }
        })).toThrow("Invalid main core services");
    });
});
