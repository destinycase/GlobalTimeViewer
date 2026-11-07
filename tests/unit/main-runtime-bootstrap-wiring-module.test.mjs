import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-runtime-bootstrap-wiring.js");
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

function accessorWith(methods, name) {
    return methods.reduce((acc, methodName) => {
        acc[methodName] = () => methodName;
        return acc;
    }, { name });
}

const UI_METHODS = ["showFatalError","showToast","switchMainTab","refreshOptionToggleDividers","getCopyFieldLabel","getTimePartLabel","getDisplayColumns","getDisplayTimeInputMode","buildRowActionCells","renderList","renderTimelineFrame","resolveFixedTimeSlotUtcDate","getFixedTimeSlotHeaderLabel","renderFixedTimeTab"];
const OPERATION_METHODS = ["updateClocks","resolveLocalDatePartsByTimezoneAtDate","resolveLocalDatePartsByTimezone","buildStrictUtcDateFromParts","handleTimeChange","handleMultiRangeTimeChange","formatTimeTextByParts","formatSnapshotText","initCalculators","copyText","getPersistenceSnapshot","sanitizeGroup","loadPersistence"];
const BOOTSTRAP_METHODS = ["initApp","startBootstrapOnDomReady"];

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
        const uiAccessor = accessorWith(UI_METHODS, "ui-accessor");
        const operationAccessor = accessorWith(OPERATION_METHODS, "operation-accessor");
        const bootstrapAccessor = accessorWith(BOOTSTRAP_METHODS, "bootstrap-accessor");
        const uiCreateService = vi.fn(() => uiAccessor);
        const operationCreateService = vi.fn(() => operationAccessor);
        const publicApiCreateService = vi.fn(() => ({ name: "public-api" }));
        const bootstrapAccessorCreateService = vi.fn(() => bootstrapAccessor);
        const createMainAppBootstrapService = vi.fn((config) => ({ config, name: "app-bootstrap-service" }));
        const getMainUiInitServiceRef = () => ({ initUI: () => "initialized" });
        const getTimezoneSearchServiceRef = () => ({ initSearchAndSelect: () => "searched" });
        const getTimerEngineServiceRef = () => ({ startRealtimeTicker: () => "started" });

        const service = moduleApi.createService({
            runtimeUiBridgeAccessorProxiesModule: { createService: uiCreateService },
            runtimeOperationAccessorProxiesModule: { createService: operationCreateService },
            runtimePublicApiBindings: { createService: publicApiCreateService },
            runtimeBootstrapAccessorProxiesModule: { createService: bootstrapAccessorCreateService },
            mainCoreServices: { createMainAppBootstrapService },
            bindFacadeMethod: (getter, methodName) => (...args) => getter()[methodName](...args),
            getMainUiInitServiceRef,
            getTimezoneSearchServiceRef,
            getTimerEngineServiceRef,
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getPatchedMainTabState: () => "live",
            getUpdateClocksRef: () => () => "updated"
        });

        expect(uiCreateService).toHaveBeenCalledTimes(1);
        expect(operationCreateService).toHaveBeenCalledTimes(1);
        expect(publicApiCreateService).toHaveBeenCalledTimes(1);
        const appBootstrapConfig = createMainAppBootstrapService.mock.calls[0][0];
        expect(appBootstrapConfig.initUI()).toBe("initialized");
        expect(appBootstrapConfig.initSearchAndSelect()).toBe("searched");
        expect(appBootstrapConfig.startRealtimeTicker()).toBe("started");
        expect(appBootstrapConfig.getCurrentMainTab()).toBe("live");
        expect(appBootstrapConfig.updateClocks()).toBe("updated");
        expect(bootstrapAccessorCreateService).toHaveBeenCalledTimes(1);
        expect(uiCreateService.mock.calls[0][0]).not.toHaveProperty("runtimeUiBridgeAccessorProxiesModule");
        expect(service.mainRuntimeUiBridgeAccessorService).toEqual(uiAccessor);
        expect(Object.isFrozen(service.mainRuntimeUiBridgeAccessorService)).toBe(true);
        expect(service.mainRuntimeOperationAccessorService).toEqual(operationAccessor);
        expect(service.mainRuntimePublicApiService).toEqual({ name: "public-api" });
        expect(service.mainAppBootstrapService).toMatchObject({ name: "app-bootstrap-service" });
        expect(service.mainRuntimeBootstrapAccessorService).toEqual(bootstrapAccessor);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing bindings or builder contracts", () => {
        const moduleApi = loadMainRuntimeBootstrapWiringModule();

        expect(() => moduleApi.createService({})).toThrow("Missing required dependency: runtimePublicApiBindings");
        expect(() => moduleApi.createService({
            runtimePublicApiBindings: { createService: () => ({}) },
            mainCoreServices: { createMainAppBootstrapService: () => ({}) }
        })).toThrow("Missing required module API: GTVMainRuntimeUiBridgeAccessorProxies.createService");
        expect(() => moduleApi.createService({
            runtimePublicApiBindings: { createService: () => ({}) },
            mainCoreServices: { createMainAppBootstrapService: () => ({}) },
            runtimeUiBridgeAccessorProxiesModule: { createService: () => ({ showToast: () => undefined }) }
        })).toThrow("Invalid main runtime UI bridge accessor proxies service");
    });
});
