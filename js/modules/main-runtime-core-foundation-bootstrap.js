(function initGtvMainRuntimeCoreFoundationBootstrap(globalObj) {
    "use strict";

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

        function pickAliasedDeps(aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = safeDeps[aliasMap[targetKey]];
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
        const coreServiceBindings = requireObject(
            safeDeps.coreServiceBindings,
            "coreServiceBindings"
        );
        const foundationServicesBindings = requireObject(
            safeDeps.foundationServicesBindings,
            "foundationServicesBindings"
        );
        const foundationServiceBindings = requireObject(
            safeDeps.foundationServiceBindings,
            "foundationServiceBindings"
        );
        const stateDomainProxyBindings = requireObject(
            safeDeps.stateDomainProxyBindings,
            "stateDomainProxyBindings"
        );

        const buildMainFoundationConfig = requireFunction(
            mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig,
            "mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig"
        );
        const createCoreServiceAssembly = requireFunction(
            coreServiceAssemblyBindings.createService,
            "coreServiceAssemblyBindings.createService"
        );
        const createCoreServiceBindings = requireFunction(
            coreServiceBindings.createService,
            "coreServiceBindings.createService"
        );
        const createFoundationServices = requireFunction(
            foundationServicesBindings.createService,
            "foundationServicesBindings.createService"
        );
        const createFoundationServiceBindings = requireFunction(
            foundationServiceBindings.createService,
            "foundationServiceBindings.createService"
        );
        const createStateDomainProxyBindings = requireFunction(
            stateDomainProxyBindings.createService,
            "stateDomainProxyBindings.createService"
        );

        const { mainCoreServices } = createCoreServiceAssembly({
            ...pickDeps([
                "coreServiceAssemblyModule",
                "mainCoreAssemblyConfig"
            ])
        });
        const mainCoreServiceBindings = createCoreServiceBindings({
            mainCoreServices
        });

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
        const mainFoundationServiceBindings = createFoundationServiceBindings({
            mainFoundationServices,
            mainCoreServices
        });

        const { mainStateDomainProxiesService } = createStateDomainProxyBindings({
            ...pickAliasedDeps({
                "stateDomainProxiesModule": "mainStateDomainProxiesModule"
            }),
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
        });

        return Object.freeze({
            mainCoreServices,
            mainFoundationServices,
            mainServiceMethodBridgeService: mainCoreServiceBindings.mainServiceMethodBridgeService,
            mainDirectStatePatchService: mainCoreServiceBindings.mainDirectStatePatchService,
            mainAppStateBridgeService: mainCoreServiceBindings.mainAppStateBridgeService,
            mainPatchedStateSelectorsService: mainCoreServiceBindings.mainPatchedStateSelectorsService,
            mainSharedUtilsService: mainCoreServiceBindings.mainSharedUtilsService,
            mainTimezoneRuntimeBridgeService: mainCoreServiceBindings.mainTimezoneRuntimeBridgeService,
            mainTimezoneRuntimeService: mainCoreServiceBindings.mainTimezoneRuntimeService,
            mainTimezoneFacadeService: mainCoreServiceBindings.mainTimezoneFacadeService,
            mainBaseTimezoneService: mainCoreServiceBindings.mainBaseTimezoneService,
            mainTimezoneMutationService: mainCoreServiceBindings.mainTimezoneMutationService,
            mainTimezoneTableFacadeService: mainCoreServiceBindings.mainTimezoneTableFacadeService,
            mainTimeAdjustFacadeService: mainCoreServiceBindings.mainTimeAdjustFacadeService,
            mainFixedTimeTabFacadeService: mainCoreServiceBindings.mainFixedTimeTabFacadeService,
            mainFixedTimeFacadeService: mainCoreServiceBindings.mainFixedTimeFacadeService,
            mainTimelineFacadeService: mainCoreServiceBindings.mainTimelineFacadeService,
            mainMultiRangeTabFacadeService: mainCoreServiceBindings.mainMultiRangeTabFacadeService,
            mainGroupLocalizationServices: mainCoreServiceBindings.mainGroupLocalizationServices,
            mainOrchestrationFlowServices: mainCoreServiceBindings.mainOrchestrationFlowServices,
            appFeedbackService: mainFoundationServiceBindings.appFeedbackService,
            calculatorActionsService: mainFoundationServiceBindings.calculatorActionsService,
            serviceBootstrap: mainFoundationServiceBindings.serviceBootstrap,
            persistenceServiceBundleFactory: mainFoundationServiceBindings.persistenceServiceBundleFactory,
            mainUiUtilsService: mainFoundationServiceBindings.mainUiUtilsService,
            setCustomTooltip: mainFoundationServiceBindings.setCustomTooltip,
            upgradeNativeTitleTooltips: mainFoundationServiceBindings.upgradeNativeTitleTooltips,
            hideFloatingTooltip: mainFoundationServiceBindings.hideFloatingTooltip,
            bindFloatingTooltipEvents: mainFoundationServiceBindings.bindFloatingTooltipEvents,
            clearDragGhost: mainFoundationServiceBindings.clearDragGhost,
            createDragGhostFromRow: mainFoundationServiceBindings.createDragGhostFromRow,
            groupContextStateService: mainFoundationServiceBindings.groupContextStateService,
            formatProfileStateService: mainFoundationServiceBindings.formatProfileStateService,
            multiRangeStateService: mainFoundationServiceBindings.multiRangeStateService,
            fixedTimeSlotUtilsService: mainFoundationServiceBindings.fixedTimeSlotUtilsService,
            fixedTimeStateService: mainFoundationServiceBindings.fixedTimeStateService,
            uiPreferencesStateService: mainFoundationServiceBindings.uiPreferencesStateService,
            timerEngineService: mainFoundationServiceBindings.timerEngineService,
            timeService: mainFoundationServiceBindings.timeService,
            mainStateDomainProxiesService
        });
    }

    globalObj.GTVMainRuntimeCoreFoundationBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
