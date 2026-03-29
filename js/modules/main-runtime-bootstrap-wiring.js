(function initGtvMainRuntimeBootstrapWiring(globalObj) {
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

        const runtimeUiBridgeAccessorBindings = requireObject(
            safeDeps.runtimeUiBridgeAccessorBindings,
            "runtimeUiBridgeAccessorBindings"
        );
        const runtimeOperationAccessorBindings = requireObject(
            safeDeps.runtimeOperationAccessorBindings,
            "runtimeOperationAccessorBindings"
        );
        const runtimePublicApiBindings = requireObject(
            safeDeps.runtimePublicApiBindings,
            "runtimePublicApiBindings"
        );
        const runtimeBootstrapAccessorBindings = requireObject(
            safeDeps.runtimeBootstrapAccessorBindings,
            "runtimeBootstrapAccessorBindings"
        );
        const mainRuntimeServiceConfigBuilderService = requireObject(
            safeDeps.mainRuntimeServiceConfigBuilderService,
            "mainRuntimeServiceConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const createRuntimeUiBridgeAccessorService = requireFunction(
            runtimeUiBridgeAccessorBindings.createService,
            "runtimeUiBridgeAccessorBindings.createService"
        );
        const createRuntimeOperationAccessorService = requireFunction(
            runtimeOperationAccessorBindings.createService,
            "runtimeOperationAccessorBindings.createService"
        );
        const createRuntimePublicApiService = requireFunction(
            runtimePublicApiBindings.createService,
            "runtimePublicApiBindings.createService"
        );
        const createRuntimeBootstrapAccessorService = requireFunction(
            runtimeBootstrapAccessorBindings.createService,
            "runtimeBootstrapAccessorBindings.createService"
        );
        const buildMainAppBootstrapConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainAppBootstrapConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainAppBootstrapConfig"
        );
        const createMainAppBootstrapService = requireFunction(
            mainCoreServices.createMainAppBootstrapService,
            "mainCoreServices.createMainAppBootstrapService"
        );

        const mainRuntimeUiBridgeAccessorService = createRuntimeUiBridgeAccessorService({
            runtimeUiBridgeAccessorProxiesModule: safeDeps.runtimeUiBridgeAccessorProxiesModule,
            callServiceMethod: safeDeps.callServiceMethod,
            getAppFeedbackService: safeDeps.getAppFeedbackService,
            getTabOrchestratorService: safeDeps.getTabOrchestratorService,
            getFormatControlsService: safeDeps.getFormatControlsService,
            getTableRenderService: safeDeps.getTableRenderService,
            getMainTimezoneTableFacadeService: safeDeps.getMainTimezoneTableFacadeService,
            getMainTimelineFacadeService: safeDeps.getMainTimelineFacadeService,
            getMainFixedTimeFacadeService: safeDeps.getMainFixedTimeFacadeService,
            getMainFixedTimeTabFacadeService: safeDeps.getMainFixedTimeTabFacadeService,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            serviceMethodMissingToken: safeDeps.serviceMethodMissingToken,
            consoleError: safeDeps.consoleError
        });

        const mainRuntimeOperationAccessorService = createRuntimeOperationAccessorService({
            runtimeOperationAccessorProxiesModule: safeDeps.runtimeOperationAccessorProxiesModule,
            callServiceMethod: safeDeps.callServiceMethod,
            getMainOrchestrationFlowServices: safeDeps.getMainOrchestrationFlowServices,
            getTimeInputMutationsService: safeDeps.getTimeInputMutationsService,
            getSnapshotFormatService: safeDeps.getSnapshotFormatService,
            getCalculatorActionsService: safeDeps.getCalculatorActionsService,
            getGroupStateService: safeDeps.getGroupStateService,
            getPersistenceService: safeDeps.getPersistenceService,
            defaultCopyTimePartsEnabled: safeDeps.defaultCopyTimePartsEnabled
        });

        let mainRuntimeBootstrapAccessorService = null;
        const getMainRuntimeBootstrapAccessorService = (
            typeof safeDeps.getMainRuntimeBootstrapAccessorService === "function"
        )
            ? safeDeps.getMainRuntimeBootstrapAccessorService
            : (() => mainRuntimeBootstrapAccessorService);
        const mainRuntimePublicApiService = createRuntimePublicApiService({
            getUiBridgeAccessorService: () => mainRuntimeUiBridgeAccessorService,
            getOperationAccessorService: () => mainRuntimeOperationAccessorService,
            getBootstrapAccessorService: () => getMainRuntimeBootstrapAccessorService(),
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            defaultCopyTimePartsEnabled: safeDeps.defaultCopyTimePartsEnabled
        });

        const mainAppBootstrapConfig = buildMainAppBootstrapConfig({
            assertRequiredServices: safeDeps.assertRequiredServices,
            loadPersistence: safeDeps.loadPersistence,
            localizeAutoGeneratedNamesForCurrentLanguage: safeDeps.localizeAutoGeneratedNamesForCurrentLanguage,
            savePersistenceSafely: safeDeps.savePersistenceSafely,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            loadThemePreference: safeDeps.loadThemePreference,
            applyTheme: safeDeps.applyTheme,
            loadUiScalePreference: safeDeps.loadUiScalePreference,
            applyUiScale: safeDeps.applyUiScale,
            applyTranslations: safeDeps.applyTranslations,
            applyVersionBranding: safeDeps.applyVersionBranding,
            bindFacadeMethod: safeDeps.bindFacadeMethod,
            getMainUiInitServiceRef: safeDeps.getMainUiInitServiceRef,
            bindFloatingTooltipEvents: safeDeps.bindFloatingTooltipEvents,
            initDragAndDrop: safeDeps.initDragAndDrop,
            getTimezoneSearchServiceRef: safeDeps.getTimezoneSearchServiceRef,
            initCalculators: safeDeps.initCalculators,
            getTimerEngineServiceRef: safeDeps.getTimerEngineServiceRef,
            switchMainTab: safeDeps.switchMainTab,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getUpdateClocksRef: safeDeps.getUpdateClocksRef,
            showFatalError: safeDeps.showFatalError
        });
        const mainAppBootstrapService = createMainAppBootstrapService(mainAppBootstrapConfig);
        if (typeof safeDeps.setMainAppBootstrapService === "function") {
            safeDeps.setMainAppBootstrapService(mainAppBootstrapService);
        }

        mainRuntimeBootstrapAccessorService = createRuntimeBootstrapAccessorService({
            runtimeBootstrapAccessorProxiesModule: safeDeps.runtimeBootstrapAccessorProxiesModule,
            getMainAppBootstrapService: (typeof safeDeps.getMainAppBootstrapService === "function")
                ? safeDeps.getMainAppBootstrapService
                : (() => mainAppBootstrapService),
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull
        });
        if (typeof safeDeps.setMainRuntimeBootstrapAccessorService === "function") {
            safeDeps.setMainRuntimeBootstrapAccessorService(mainRuntimeBootstrapAccessorService);
        }

        return Object.freeze({
            mainRuntimeUiBridgeAccessorService,
            mainRuntimeOperationAccessorService,
            mainRuntimePublicApiService,
            mainAppBootstrapService,
            mainRuntimeBootstrapAccessorService
        });
    }

    globalObj.GTVMainRuntimeBootstrapWiring = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
