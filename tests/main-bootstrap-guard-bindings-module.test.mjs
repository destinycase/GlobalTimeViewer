import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-bootstrap-guard-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainBootstrapGuardBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainBootstrapGuardBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainBootstrapGuardBindings || globalThis.GTVMainBootstrapGuardBindings;
}

describe("GTV main bootstrap guard bindings module", () => {
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

    it("creates bootstrap guard bindings from delegated module", () => {
        const moduleApi = loadMainBootstrapGuardBindingsModule();
        const mainBootstrapGuardService = {
            assertRequiredServices: vi.fn(() => undefined)
        };
        const bootstrapGuardModule = {
            createService: vi.fn(() => mainBootstrapGuardService)
        };
        const getServiceMethod = vi.fn(() => null);

        const service = moduleApi.createService({
            bootstrapGuardModule,
            serviceGetters: {},
            getServiceMethod,
            requiredSpecs: []
        });

        expect(bootstrapGuardModule.createService).toHaveBeenCalledWith({
            serviceGetters: {},
            getServiceMethod,
            requiredSpecs: []
        });
        expect(service.mainBootstrapGuardService).toBe(mainBootstrapGuardService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainBootstrapGuardBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainBootstrapGuard.createService"
        );
        expect(() => moduleApi.createService({
            bootstrapGuardModule: { createService: () => null }
        })).toThrow("Invalid main bootstrap guard service");
        expect(() => moduleApi.createService({
            bootstrapGuardModule: { createService: () => ({}) }
        })).toThrow("Invalid main bootstrap guard service");
    });
});
