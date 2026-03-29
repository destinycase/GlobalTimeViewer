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
            coreServiceAssemblyModule: safeDeps.coreServiceAssemblyModule,
            mainCoreAssemblyConfig: safeDeps.mainCoreAssemblyConfig
        });
        const mainCoreServiceBindings = createCoreServiceBindings({
            mainCoreServices
        });

        const mainFoundationConfig = buildMainFoundationConfig({
            GTV_SERVICE_BOOTSTRAP: safeDeps.GTV_SERVICE_BOOTSTRAP,
            GTV_PERSISTENCE_SERVICE_BUNDLE: safeDeps.GTV_PERSISTENCE_SERVICE_BUNDLE,
            GTV_MAIN_UI_UTILS: safeDeps.GTV_MAIN_UI_UTILS,
            GTV_APP_FEEDBACK: safeDeps.GTV_APP_FEEDBACK,
            GTV_CALCULATOR_ACTIONS: safeDeps.GTV_CALCULATOR_ACTIONS,
            GTV_TAB_UI: safeDeps.GTV_TAB_UI,
            GTV_TAB_ORCHESTRATOR: safeDeps.GTV_TAB_ORCHESTRATOR,
            GTV_GROUP_STATE: safeDeps.GTV_GROUP_STATE,
            GTV_STATE_PERSISTENCE: safeDeps.GTV_STATE_PERSISTENCE,
            GTV_SETTINGS_IO: safeDeps.GTV_SETTINGS_IO,
            GTV_DATA_TRANSFER: safeDeps.GTV_DATA_TRANSFER,
            GTV_UI_SETTINGS_ACTIONS: safeDeps.GTV_UI_SETTINGS_ACTIONS,
            GTV_CALCULATOR: safeDeps.GTV_CALCULATOR,
            PERIOD_RESULT_IDS: safeDeps.PERIOD_RESULT_IDS,
            gtvT: safeDeps.gtvT,
            getShowToastRef: safeDeps.getShowToastRef,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getPersistenceServiceRef: safeDeps.getPersistenceServiceRef,
            confirmRuntime: safeDeps.confirmRuntime,
            getLocationRefOrNull: safeDeps.getLocationRefOrNull,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            consoleError: safeDeps.consoleError
        });

        const { mainFoundationServices } = createFoundationServices({
            foundationServicesModule: safeDeps.foundationServicesModule,
            mainFoundationConfig
        });
        const mainFoundationServiceBindings = createFoundationServiceBindings({
            mainFoundationServices,
            mainCoreServices
        });

        const { mainStateDomainProxiesService } = createStateDomainProxyBindings({
            stateDomainProxiesModule: safeDeps.mainStateDomainProxiesModule,
            fixedTimeSlotUtilsService: mainFoundationServiceBindings.fixedTimeSlotUtilsService,
            multiRangeStateService: mainFoundationServiceBindings.multiRangeStateService,
            fixedTimeStateService: mainFoundationServiceBindings.fixedTimeStateService,
            uiPreferencesStateService: mainFoundationServiceBindings.uiPreferencesStateService,
            groupContextStateService: mainFoundationServiceBindings.groupContextStateService,
            mainAppStateBridgeService: mainCoreServiceBindings.mainAppStateBridgeService,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            getCurrentGroup: safeDeps.getCurrentGroup,
            defaultFixedTimeValue: safeDeps.defaultFixedTimeValue
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
