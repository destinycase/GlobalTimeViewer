import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-foundation-services-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFoundationServicesBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFoundationServicesBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFoundationServicesBindings || globalThis.GTVMainFoundationServicesBindings;
}

describe("GTV main foundation services bindings module", () => {
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

    it("creates foundation services via delegated module", () => {
        const moduleApi = loadMainFoundationServicesBindingsModule();
        const mainFoundationServices = { serviceBootstrap: {}, appFeedbackService: {} };
        const foundationServicesModule = {
            createService: vi.fn(() => mainFoundationServices)
        };
        const mainFoundationConfig = { foo: "bar" };

        const service = moduleApi.createService({
            foundationServicesModule,
            mainFoundationConfig
        });

        expect(foundationServicesModule.createService).toHaveBeenCalledWith(mainFoundationConfig);
        expect(service.mainFoundationServices).toBe(mainFoundationServices);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainFoundationServicesBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainFoundationServices.createService"
        );
        expect(() => moduleApi.createService({
            foundationServicesModule: { createService: () => null }
        })).toThrow("Invalid main foundation services");
    });
});
