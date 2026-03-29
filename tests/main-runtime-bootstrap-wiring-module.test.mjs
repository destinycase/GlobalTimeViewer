import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-bootstrap-wiring.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeBootstrapWiringModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeBootstrapWiring", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimeBootstrapWiring
        || globalThis.GTVMainRuntimeBootstrapWiring
    );
}

describe("GTV main runtime bootstrap wiring module", () => {
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

    it("creates ui/operation/public/bootstrap services through binding and core contracts", () => {
        const moduleApi = loadMainRuntimeBootstrapWiringModule();
        const uiCreateService = vi.fn(() => ({ name: "ui-accessor" }));
        const operationCreateService = vi.fn(() => ({ name: "operation-accessor" }));
        const publicApiCreateService = vi.fn(() => ({ name: "public-api" }));
        const bootstrapAccessorCreateService = vi.fn(() => ({ name: "bootstrap-accessor" }));
        const buildMainAppBootstrapConfig = vi.fn(() => ({ kind: "app-bootstrap-config" }));
        const createMainAppBootstrapService = vi.fn(() => ({ name: "app-bootstrap-service" }));

        const service = moduleApi.createService({
            runtimeUiBridgeAccessorBindings: { createService: uiCreateService },
            runtimeOperationAccessorBindings: { createService: operationCreateService },
            runtimePublicApiBindings: { createService: publicApiCreateService },
            runtimeBootstrapAccessorBindings: { createService: bootstrapAccessorCreateService },
            mainRuntimeServiceConfigBuilderService: { buildMainAppBootstrapConfig },
            mainCoreServices: { createMainAppBootstrapService }
        });

        expect(uiCreateService).toHaveBeenCalledTimes(1);
        expect(operationCreateService).toHaveBeenCalledTimes(1);
        expect(publicApiCreateService).toHaveBeenCalledTimes(1);
        expect(buildMainAppBootstrapConfig).toHaveBeenCalledTimes(1);
        expect(createMainAppBootstrapService).toHaveBeenCalledWith({ kind: "app-bootstrap-config" });
        expect(bootstrapAccessorCreateService).toHaveBeenCalledTimes(1);
        expect(service.mainRuntimeUiBridgeAccessorService).toEqual({ name: "ui-accessor" });
        expect(service.mainRuntimeOperationAccessorService).toEqual({ name: "operation-accessor" });
        expect(service.mainRuntimePublicApiService).toEqual({ name: "public-api" });
        expect(service.mainAppBootstrapService).toEqual({ name: "app-bootstrap-service" });
        expect(service.mainRuntimeBootstrapAccessorService).toEqual({ name: "bootstrap-accessor" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing bindings or builder contracts", () => {
        const moduleApi = loadMainRuntimeBootstrapWiringModule();

        expect(() => moduleApi.createService({})).toThrow("Missing required dependency: runtimeUiBridgeAccessorBindings");
        expect(() => moduleApi.createService({
            runtimeUiBridgeAccessorBindings: {},
            runtimeOperationAccessorBindings: {},
            runtimePublicApiBindings: {},
            runtimeBootstrapAccessorBindings: {},
            mainRuntimeServiceConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow("Missing required dependency: runtimeUiBridgeAccessorBindings.createService");
    });
});
