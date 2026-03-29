import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-foundation-bootstrap.js");
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
        const createCoreServiceAssembly = vi.fn(() => ({
            mainCoreServices: { tag: "core-services" }
        }));
        const createCoreServiceBindings = vi.fn(() => ({
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
            mainOrchestrationFlowServices: { tag: "mainOrchestrationFlowServices" }
        }));
        const createFoundationServices = vi.fn(() => ({
            mainFoundationServices: { tag: "foundation-services" }
        }));
        const createFoundationServiceBindings = vi.fn(() => ({
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
            groupContextStateService: { tag: "groupContextStateService" },
            formatProfileStateService: { tag: "formatProfileStateService" },
            multiRangeStateService: { tag: "multiRangeStateService" },
            fixedTimeSlotUtilsService: { tag: "fixedTimeSlotUtilsService" },
            fixedTimeStateService: { tag: "fixedTimeStateService" },
            uiPreferencesStateService: { tag: "uiPreferencesStateService" },
            timerEngineService: { tag: "timerEngineService" },
            timeService: { tag: "timeService" }
        }));
        const createStateDomainProxyBindings = vi.fn(() => ({
            mainStateDomainProxiesService: { tag: "state-domain-proxies-service" }
        }));

        const service = moduleApi.createService({
            mainCoreAssemblyConfigBuilderService: {
                buildMainFoundationConfig
            },
            coreServiceAssemblyBindings: { createService: createCoreServiceAssembly },
            coreServiceAssemblyModule: { kind: "core-assembly-module" },
            coreServiceBindings: { createService: createCoreServiceBindings },
            foundationServicesBindings: { createService: createFoundationServices },
            foundationServicesModule: { kind: "foundation-services-module" },
            foundationServiceBindings: { createService: createFoundationServiceBindings },
            stateDomainProxyBindings: { createService: createStateDomainProxyBindings },
            mainStateDomainProxiesModule: { kind: "state-domain-proxies-module" },
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
        expect(createStateDomainProxyBindings).toHaveBeenCalledWith(
            expect.objectContaining({
                stateDomainProxiesModule: { kind: "state-domain-proxies-module" }
            })
        );
        expect(service.mainCoreServices).toEqual({ tag: "core-services" });
        expect(service.mainFoundationServices).toEqual({ tag: "foundation-services" });
        expect(service.mainStateDomainProxiesService).toEqual({ tag: "state-domain-proxies-service" });
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
            coreServiceBindings: {},
            foundationServicesBindings: {},
            foundationServiceBindings: {},
            stateDomainProxyBindings: {}
        })).toThrow(
            "Missing required dependency: mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig"
        );
    });
});
