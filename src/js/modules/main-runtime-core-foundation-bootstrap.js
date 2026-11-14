(function initGtvMainRuntimeCoreFoundationBootstrap(globalObj) {
    "use strict";

    // Services copied out of the core/foundation containers (formerly
    // main-core-service-bindings.js and main-foundation-service-bindings.js).
    const CORE_SERVICE_KEYS = Object.freeze([
        "mainServiceMethodBridgeService",
        "mainDirectStatePatchService",
        "mainAppStateBridgeService",
        "mainPatchedStateSelectorsService",
        "mainSharedUtilsService",
        "mainTimezoneRuntimeBridgeService",
        "mainTimezoneRuntimeService",
        "mainTimezoneFacadeService",
        "mainBaseTimezoneService",
        "mainTimezoneMutationService",
        "mainTimezoneTableFacadeService",
        "mainTimeAdjustFacadeService",
        "mainFixedTimeTabFacadeService",
        "mainFixedTimeFacadeService",
        "mainTimelineFacadeService",
        "mainMultiRangeTabFacadeService",
        "mainGroupLocalizationServices",
        "mainOrchestrationFlowServices"
    ]);
    const FOUNDATION_SERVICE_KEYS = Object.freeze([
        "serviceBootstrap",
        "persistenceServiceBundleFactory",
        "mainUiUtilsService",
        "appFeedbackService",
        "calculatorActionsService",
        "setCustomTooltip",
        "upgradeNativeTitleTooltips",
        "hideFloatingTooltip",
        "bindFloatingTooltipEvents"
    ]);
    const CORE_DOMAIN_SERVICE_KEYS = Object.freeze([
        "groupContextStateService",
        "formatProfileStateService",
        "multiRangeStateService",
        "fixedTimeSlotUtilsService",
        "fixedTimeStateService",
        "uiPreferencesStateService",
        "timerEngineService",
        "timeService"
    ]);

    function pickKeys(source, keyList) {
        return keyList.reduce((acc, key) => {
            acc[key] = source[key];
            return acc;
        }, {});
    }

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const mainCoreAssemblyConfigBuilderService = requireObject(
            safeDeps.mainCoreAssemblyConfigBuilderService,
            "mainCoreAssemblyConfigBuilderService"
        );
        const coreServiceAssemblyBindings = requireObject(
            safeDeps.coreServiceAssemblyBindings,
            "coreServiceAssemblyBindings"
        );
        const foundationServicesBindings = requireObject(
            safeDeps.foundationServicesBindings,
            "foundationServicesBindings"
        );

        const buildMainFoundationConfig = requireFunction(
            mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig,
            "mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig"
        );
        const createCoreServiceAssembly = requireFunction(
            coreServiceAssemblyBindings.createService,
            "coreServiceAssemblyBindings.createService"
        );
        const createFoundationServices = requireFunction(
            foundationServicesBindings.createService,
            "foundationServicesBindings.createService"
        );
        const serviceInvokeUtils = requireObject(
            globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils,
            "GTVServiceInvokeUtils"
        );

        const { mainCoreServices } = createCoreServiceAssembly({
            ...pickDeps([
                "coreServiceAssemblyModule",
                "mainCoreAssemblyConfig"
            ])
        });
        if (!mainCoreServices || typeof mainCoreServices !== "object") {
            throw new Error("Missing dependency: mainCoreServices");
        }
        const mainCoreServiceBindings = pickKeys(mainCoreServices, CORE_SERVICE_KEYS);

        const mainFoundationConfig = buildMainFoundationConfig({
            ...pickDeps([
                "GTV_SERVICE_BOOTSTRAP",
                "GTV_PERSISTENCE_SERVICE_BUNDLE",
                "GTV_MAIN_UI_UTILS",
                "GTV_APP_FEEDBACK",
                "GTV_CALCULATOR_ACTIONS",
                "GTV_TAB_UI",
                "GTV_TAB_ORCHESTRATOR",
                "GTV_GROUP_STATE",
                "GTV_STATE_PERSISTENCE",
                "GTV_SETTINGS_IO",
                "GTV_DATA_TRANSFER",
                "GTV_UI_SETTINGS_ACTIONS",
                "GTV_CALCULATOR",
                "PERIOD_RESULT_IDS",
                "gtvT",
                "getShowToastRef",
                "deferDynamicCall",
                "getPersistenceServiceRef",
                "confirmRuntime",
                "getLocationRefOrNull",
                "getDocumentRefOrNull",
                "consoleError"
            ])
        });

        const { mainFoundationServices } = createFoundationServices({
            ...pickDeps([
                "foundationServicesModule"
            ]),
            mainFoundationConfig
        });
        if (!mainFoundationServices || typeof mainFoundationServices !== "object") {
            throw new Error("Missing dependency: mainFoundationServices");
        }
        const mainFoundationServiceBindings = {
            ...pickKeys(mainFoundationServices, FOUNDATION_SERVICE_KEYS),
            ...pickKeys(mainCoreServices, CORE_DOMAIN_SERVICE_KEYS)
        };

        const mainStateDomainProxiesService = serviceInvokeUtils.createRequiredModuleService(
            safeDeps.mainStateDomainProxiesModule,
            "GTVMainStateDomainProxies",
            {
            fixedTimeSlotUtilsService: mainFoundationServiceBindings.fixedTimeSlotUtilsService,
            multiRangeStateService: mainFoundationServiceBindings.multiRangeStateService,
            fixedTimeStateService: mainFoundationServiceBindings.fixedTimeStateService,
            uiPreferencesStateService: mainFoundationServiceBindings.uiPreferencesStateService,
            groupContextStateService: mainFoundationServiceBindings.groupContextStateService,
            mainAppStateBridgeService: mainCoreServiceBindings.mainAppStateBridgeService,
            ...pickDeps([
                "getPatchedMainTabState",
                "getCurrentGroup",
                "defaultFixedTimeValue"
            ])
            },
            [],
            "Invalid main state domain proxies service"
        );

        return Object.freeze({
            mainCoreServices,
            mainFoundationServices,
            ...mainCoreServiceBindings,
            ...mainFoundationServiceBindings,
            mainStateDomainProxiesService
        });
    }

    globalObj.GTVMainRuntimeCoreFoundationBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
