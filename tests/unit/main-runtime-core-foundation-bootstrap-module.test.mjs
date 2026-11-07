import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-runtime-core-foundation-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCoreFoundationBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreFoundationBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreFoundationBootstrap
        || globalThis.GTVMainRuntimeCoreFoundationBootstrap
    );
}

describe("GTV main runtime core foundation bootstrap module", () => {
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

    it("builds core/foundation bindings and state-domain proxy service from deps", () => {
        const moduleApi = loadMainRuntimeCoreFoundationBootstrapModule();
        const buildMainFoundationConfig = vi.fn(() => ({ kind: "foundation-config" }));
        const coreServices = {
            mainServiceMethodBridgeService: { tag: "mainServiceMethodBridgeService" },
            mainDirectStatePatchService: { tag: "mainDirectStatePatchService" },
            mainAppStateBridgeService: { tag: "mainAppStateBridgeService" },
            mainPatchedStateSelectorsService: { tag: "mainPatchedStateSelectorsService" },
            mainSharedUtilsService: { tag: "mainSharedUtilsService" },
            mainTimezoneRuntimeBridgeService: { tag: "mainTimezoneRuntimeBridgeService" },
            mainTimezoneRuntimeService: { tag: "mainTimezoneRuntimeService" },
            mainTimezoneFacadeService: { tag: "mainTimezoneFacadeService" },
            mainBaseTimezoneService: { tag: "mainBaseTimezoneService" },
            mainTimezoneMutationService: { tag: "mainTimezoneMutationService" },
            mainTimezoneTableFacadeService: { tag: "mainTimezoneTableFacadeService" },
            mainTimeAdjustFacadeService: { tag: "mainTimeAdjustFacadeService" },
            mainFixedTimeTabFacadeService: { tag: "mainFixedTimeTabFacadeService" },
            mainFixedTimeFacadeService: { tag: "mainFixedTimeFacadeService" },
            mainTimelineFacadeService: { tag: "mainTimelineFacadeService" },
            mainMultiRangeTabFacadeService: { tag: "mainMultiRangeTabFacadeService" },
            mainGroupLocalizationServices: { tag: "mainGroupLocalizationServices" },
            mainOrchestrationFlowServices: { tag: "mainOrchestrationFlowServices" },
            groupContextStateService: { tag: "groupContextStateService" },
            formatProfileStateService: { tag: "formatProfileStateService" },
            multiRangeStateService: { tag: "multiRangeStateService" },
            fixedTimeSlotUtilsService: { tag: "fixedTimeSlotUtilsService" },
            fixedTimeStateService: { tag: "fixedTimeStateService" },
            uiPreferencesStateService: { tag: "uiPreferencesStateService" },
            timerEngineService: { tag: "timerEngineService" },
            timeService: { tag: "timeService" },
            unrelatedCoreService: { tag: "not-exposed" }
        };
        const createCoreServiceAssembly = vi.fn(() => ({ mainCoreServices: coreServices }));
        const foundationServices = {
            appFeedbackService: { tag: "appFeedbackService" },
            calculatorActionsService: { tag: "calculatorActionsService" },
            serviceBootstrap: { tag: "serviceBootstrap" },
            persistenceServiceBundleFactory: { tag: "persistenceServiceBundleFactory" },
            mainUiUtilsService: { tag: "mainUiUtilsService" },
            setCustomTooltip: vi.fn(),
            upgradeNativeTitleTooltips: vi.fn(),
            hideFloatingTooltip: vi.fn(),
            bindFloatingTooltipEvents: vi.fn(),
            clearDragGhost: vi.fn(),
            createDragGhostFromRow: vi.fn(),
            groupContextStateService: { tag: "foundation-copy-must-not-win" }
        };
        const createFoundationServices = vi.fn(() => ({ mainFoundationServices: foundationServices }));
        const stateDomainProxiesService = { tag: "state-domain-proxies-service" };
        const createStateDomainProxies = vi.fn(() => stateDomainProxiesService);

        const service = moduleApi.createService({
            mainCoreAssemblyConfigBuilderService: {
                buildMainFoundationConfig
            },
            coreServiceAssemblyBindings: { createService: createCoreServiceAssembly },
            coreServiceAssemblyModule: { kind: "core-assembly-module" },
            foundationServicesBindings: { createService: createFoundationServices },
            foundationServicesModule: { kind: "foundation-services-module" },
            mainStateDomainProxiesModule: { createService: createStateDomainProxies },
            mainCoreAssemblyConfig: { kind: "main-core-assembly-config" },
            getPatchedMainTabState: () => "live",
            getCurrentGroup: () => ({ id: "g1" }),
            defaultFixedTimeValue: "09:00"
        });

        expect(createCoreServiceAssembly).toHaveBeenCalledWith({
            coreServiceAssemblyModule: { kind: "core-assembly-module" },
            mainCoreAssemblyConfig: { kind: "main-core-assembly-config" }
        });
        expect(buildMainFoundationConfig).toHaveBeenCalledTimes(1);
        expect(createFoundationServices).toHaveBeenCalledWith({
            foundationServicesModule: { kind: "foundation-services-module" },
            mainFoundationConfig: { kind: "foundation-config" }
        });
        const proxyDeps = createStateDomainProxies.mock.calls[0][0];
        expect(proxyDeps).not.toHaveProperty("mainStateDomainProxiesModule");
        expect(proxyDeps.fixedTimeSlotUtilsService).toBe(coreServices.fixedTimeSlotUtilsService);
        expect(proxyDeps.groupContextStateService).toBe(coreServices.groupContextStateService);
        expect(proxyDeps.mainAppStateBridgeService).toBe(coreServices.mainAppStateBridgeService);
        expect(proxyDeps.defaultFixedTimeValue).toBe("09:00");
        expect(proxyDeps.getCurrentGroup()).toEqual({ id: "g1" });
        expect(service.mainCoreServices).toBe(coreServices);
        expect(service.mainFoundationServices).toBe(foundationServices);
        expect(service.mainStateDomainProxiesService).toBe(stateDomainProxiesService);
        expect(service.mainTimelineFacadeService).toBe(coreServices.mainTimelineFacadeService);
        expect(service.timeService).toBe(coreServices.timeService);
        expect(service.groupContextStateService).toBe(coreServices.groupContextStateService);
        expect(service.serviceBootstrap).toBe(foundationServices.serviceBootstrap);
        expect(service.createDragGhostFromRow).toBe(foundationServices.createDragGhostFromRow);
        expect(service).not.toHaveProperty("unrelatedCoreService");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing required contracts", () => {
        const moduleApi = loadMainRuntimeCoreFoundationBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCoreAssemblyConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainCoreAssemblyConfigBuilderService: {},
            coreServiceAssemblyBindings: {},
            foundationServicesBindings: {}
        })).toThrow(
            "Missing required dependency: mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig"
        );
        const base = {
            mainCoreAssemblyConfigBuilderService: { buildMainFoundationConfig: () => ({}) },
            foundationServicesBindings: { createService: () => ({ mainFoundationServices: {} }) }
        };
        expect(() => moduleApi.createService({
            ...base,
            coreServiceAssemblyBindings: { createService: () => ({}) }
        })).toThrow("Missing dependency: mainCoreServices");
        expect(() => moduleApi.createService({
            ...base,
            coreServiceAssemblyBindings: { createService: () => ({ mainCoreServices: {} }) },
            foundationServicesBindings: { createService: () => ({}) }
        })).toThrow("Missing dependency: mainFoundationServices");
        expect(() => moduleApi.createService({
            ...base,
            coreServiceAssemblyBindings: { createService: () => ({ mainCoreServices: {} }) }
        })).toThrow("Missing required module API: GTVMainStateDomainProxies.createService");
        expect(() => moduleApi.createService({
            ...base,
            coreServiceAssemblyBindings: { createService: () => ({ mainCoreServices: {} }) },
            mainStateDomainProxiesModule: { createService: () => null }
        })).toThrow("Invalid main state domain proxies service");
    });
});
