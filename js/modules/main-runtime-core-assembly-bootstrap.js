(function initGtvMainRuntimeCoreAssemblyBootstrap(globalObj) {
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

        const mainCoreAssemblyConfigBuilderService = requireObject(
            safeDeps.mainCoreAssemblyConfigBuilderService,
            "mainCoreAssemblyConfigBuilderService"
        );
        const moduleRefs = requireObject(safeDeps.moduleRefs, "moduleRefs");
        const runtimeReferenceAccessorService = requireObject(
            safeDeps.runtimeReferenceAccessorService,
            "runtimeReferenceAccessorService"
        );
        const patchedStateAccessorService = requireObject(
            safeDeps.patchedStateAccessorService,
            "patchedStateAccessorService"
        );

        const buildMainCoreAssemblyConfig = requireFunction(
            mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig,
            "mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig"
        );

        const mainCoreAssemblyConfig = buildMainCoreAssemblyConfig({
            GTV_MAIN_SERVICE_METHOD_BRIDGE: moduleRefs.GTV_MAIN_SERVICE_METHOD_BRIDGE,
            GTV_MAIN_DIRECT_STATE_PATCH: moduleRefs.GTV_MAIN_DIRECT_STATE_PATCH,
            GTV_MAIN_APP_STATE_BRIDGE: moduleRefs.GTV_MAIN_APP_STATE_BRIDGE,
            GTV_MAIN_PATCHED_STATE_SELECTORS: moduleRefs.GTV_MAIN_PATCHED_STATE_SELECTORS,
            GTV_MAIN_SHARED_UTILS: moduleRefs.GTV_MAIN_SHARED_UTILS,
            GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE: moduleRefs.GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE,
            GTV_MAIN_TIMEZONE_RUNTIME_SERVICES: moduleRefs.GTV_MAIN_TIMEZONE_RUNTIME_SERVICES,
            GTV_MAIN_FORMAT_PROFILE_FACADE: moduleRefs.GTV_MAIN_FORMAT_PROFILE_FACADE,
            GTV_MAIN_TIMEZONE_FACADE: moduleRefs.GTV_MAIN_TIMEZONE_FACADE,
            GTV_MAIN_BASE_TIMEZONE_SERVICES: moduleRefs.GTV_MAIN_BASE_TIMEZONE_SERVICES,
            GTV_MAIN_TIMEZONE_MUTATION_SERVICES: moduleRefs.GTV_MAIN_TIMEZONE_MUTATION_SERVICES,
            GTV_MAIN_TIMEZONE_TABLE_FACADE: moduleRefs.GTV_MAIN_TIMEZONE_TABLE_FACADE,
            GTV_MAIN_TIME_ADJUST_FACADE: moduleRefs.GTV_MAIN_TIME_ADJUST_FACADE,
            GTV_MAIN_FIXED_TIME_TAB_FACADE: moduleRefs.GTV_MAIN_FIXED_TIME_TAB_FACADE,
            GTV_MAIN_FIXED_TIME_FACADE: moduleRefs.GTV_MAIN_FIXED_TIME_FACADE,
            GTV_MAIN_TIMELINE_FACADE: moduleRefs.GTV_MAIN_TIMELINE_FACADE,
            GTV_MAIN_MULTI_RANGE_TAB_FACADE: moduleRefs.GTV_MAIN_MULTI_RANGE_TAB_FACADE,
            GTV_MAIN_GROUP_LOCALIZATION_SERVICES: moduleRefs.GTV_MAIN_GROUP_LOCALIZATION_SERVICES,
            GTV_MAIN_ORCHESTRATION_FLOW_SERVICES: moduleRefs.GTV_MAIN_ORCHESTRATION_FLOW_SERVICES,
            GTV_MAIN_SELECT_SERVICES: moduleRefs.GTV_MAIN_SELECT_SERVICES,
            GTV_TIMEZONE_SEARCH: moduleRefs.GTV_TIMEZONE_SEARCH,
            GTV_SNAPSHOT_FORMAT: moduleRefs.GTV_SNAPSHOT_FORMAT,
            GTV_TIME_INPUT_MUTATIONS: moduleRefs.GTV_TIME_INPUT_MUTATIONS,
            GTV_MAIN_ROW_ORDER_SERVICES: moduleRefs.GTV_MAIN_ROW_ORDER_SERVICES,
            GTV_MAIN_ROW_VIEW_SERVICES: moduleRefs.GTV_MAIN_ROW_VIEW_SERVICES,
            GTV_TABLE_RENDER: moduleRefs.GTV_TABLE_RENDER,
            GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY: moduleRefs.GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY,
            GTV_MAIN_IMAGE_RUNTIME_SERVICES: moduleRefs.GTV_MAIN_IMAGE_RUNTIME_SERVICES,
            GTV_MAIN_FIXED_TIME_SERVICES: moduleRefs.GTV_MAIN_FIXED_TIME_SERVICES,
            GTV_MAIN_MULTI_RANGE_SERVICES: moduleRefs.GTV_MAIN_MULTI_RANGE_SERVICES,
            GTV_MAIN_TIME_ADJUST_SERVICES: moduleRefs.GTV_MAIN_TIME_ADJUST_SERVICES,
            GTV_MAIN_TAB_SERVICES: moduleRefs.GTV_MAIN_TAB_SERVICES,
            GTV_MAIN_GROUP_STATE_SERVICES: moduleRefs.GTV_MAIN_GROUP_STATE_SERVICES,
            GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY: moduleRefs.GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY,
            GTV_MAIN_IMAGE_EXPORT_SERVICES: moduleRefs.GTV_MAIN_IMAGE_EXPORT_SERVICES,
            GTV_MAIN_APP_STATE_SERVICES: moduleRefs.GTV_MAIN_APP_STATE_SERVICES,
            GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES: moduleRefs.GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES,
            GTV_MAIN_RUNTIME_COMPOSITION_SERVICES: moduleRefs.GTV_MAIN_RUNTIME_COMPOSITION_SERVICES,
            GTV_MAIN_APP_BOOTSTRAP: moduleRefs.GTV_MAIN_APP_BOOTSTRAP,
            ...pickDeps([
                "consoleWarn",
                "showMissingFeatureToastOnce",
                "directStateSetters",
                "setIsRealtimeState",
                "callServiceMethod",
            ]),
            getAppStatePatcherServiceRef: runtimeReferenceAccessorService.getAppStatePatcherServiceRef,
            getAppPersistenceStateServiceRef: runtimeReferenceAccessorService.getAppPersistenceStateServiceRef,
            ...pickDeps([
                "applyDirectStatePatch",
                "SERVICE_METHOD_MISSING",
                "buildPatchedStateFallbackSnapshot",
                "TABLE_IMAGE_EXPORT_WIDTH",
                "createCanvasSafely",
            ]),
            getMainTimezoneRuntimeBridgeServiceRef: runtimeReferenceAccessorService.getMainTimezoneRuntimeBridgeServiceRef,
            getMainTimezoneRuntimeServiceRef: runtimeReferenceAccessorService.getMainTimezoneRuntimeServiceRef,
            getMainBaseTimezoneServiceRef: runtimeReferenceAccessorService.getMainBaseTimezoneServiceRef,
            getMainTimezoneMutationServiceRef: runtimeReferenceAccessorService.getMainTimezoneMutationServiceRef,
            getTimezoneSearchServiceRef: runtimeReferenceAccessorService.getTimezoneSearchServiceRef,
            getTimeCoreRef: runtimeReferenceAccessorService.getTimeCoreRef,
            ...pickDeps([
                "getBaseTimeSnapshot",
            ]),
            getZoneMapRef: runtimeReferenceAccessorService.getZoneMapRef,
            getTzDatabaseRef: runtimeReferenceAccessorService.getTzDatabaseRef,
            getTimeServiceRef: runtimeReferenceAccessorService.getTimeServiceRef,
            ...pickDeps([
                "formatUtcOffsetLabel",
                "bindFacadeMethod",
            ]),
            getMainTimezoneFacadeServiceRef: runtimeReferenceAccessorService.getMainTimezoneFacadeServiceRef,
            ...pickDeps([
                "timezoneOffsetCache",
                "timezoneDstCache",
                "zoneAbbrCache",
                "getCurrentGroupBaseTimezoneId",
                "getRandomUUIDSafely",
            ]),
            getRandomValue: runtimeReferenceAccessorService.getRandomValue,
            getGroupStateServiceRef: runtimeReferenceAccessorService.getGroupStateServiceRef,
            ...pickDeps([
                "normalizeCustomAbbr",
                "deferDynamicCall",
            ]),
            getRenderListRef: runtimeReferenceAccessorService.getRenderListRef,
            getTableRenderServiceRef: runtimeReferenceAccessorService.getTableRenderServiceRef,
            getCopyActionsServiceRef: runtimeReferenceAccessorService.getCopyActionsServiceRef,
            ...pickDeps([
                "isFixedTimeTab",
                "renderFixedTimeTab",
            ]),
            getTimeAdjustUiServiceRef: runtimeReferenceAccessorService.getTimeAdjustUiServiceRef,
            getTimeAdjustActionsServiceRef: runtimeReferenceAccessorService.getTimeAdjustActionsServiceRef,
            getMultiBulkToolsServiceRef: runtimeReferenceAccessorService.getMultiBulkToolsServiceRef,
            ...pickDeps([
                "getTimeAdjustDayStepBySlotSnapshot",
                "setTimeAdjustDayStepBySlotState",
                "DEFAULT_TIME_ADJUST_DAY_STEP",
                "MIN_TIME_ADJUST_DAY_STEP",
                "MAX_TIME_ADJUST_DAY_STEP",
            ]),
            getFixedTimeTableServiceRef: runtimeReferenceAccessorService.getFixedTimeTableServiceRef,
            ...pickDeps([
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "refreshFixedTimeSlotCountControls",
                "getCurrentGroupFixedTimeShowLiveNow",
                "getDocumentRefOrNull",
            ]),
            invokeRenderBaseTimeSelect: runtimeReferenceAccessorService.invokeRenderBaseTimeSelect,
            getMultiRangeRenderServiceRef: runtimeReferenceAccessorService.getMultiRangeRenderServiceRef,
            getMultiRangeCopyServiceRef: runtimeReferenceAccessorService.getMultiRangeCopyServiceRef,
            getMultiStateServiceRef: runtimeReferenceAccessorService.getMultiStateServiceRef,
            ...pickDeps([
                "getCurrentMultiRangeStateSnapshot",
                "setMultiRangeState",
                "sanitizeMultiRangeCount",
                "sanitizeMultiRangeTitle",
                "ensureMultiRangeState",
                "refreshMultiRangeControls",
                "getRuntimeNowMs",
            ]),
            getMainClockOrchestratorServiceRef: runtimeReferenceAccessorService.getMainClockOrchestratorServiceRef,
            getMainPersistenceSnapshotServiceRef: runtimeReferenceAccessorService.getMainPersistenceSnapshotServiceRef,
            ...pickDeps([
                "warnMissingServiceMethod",
            ]),
            getFixedTimeCoreServiceRef: runtimeReferenceAccessorService.getFixedTimeCoreServiceRef,
            getFixedTimeActionsServiceRef: runtimeReferenceAccessorService.getFixedTimeActionsServiceRef,
            getPatchedCopyFormatOrderState: patchedStateAccessorService.getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState: patchedStateAccessorService.getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState: patchedStateAccessorService.getPatchedCopyTimePartsEnabledState,
            getSanitizeCopyFormatOrderForContextRef: runtimeReferenceAccessorService.getSanitizeCopyFormatOrderForContextRef,
            getSanitizeCopyFormatEnabledForContextRef: runtimeReferenceAccessorService.getSanitizeCopyFormatEnabledForContextRef,
            getSanitizeTimePartsEnabledForContextRef: runtimeReferenceAccessorService.getSanitizeTimePartsEnabledForContextRef,
            ...pickDeps([
                "getWindowRefOrNull",
            ]),
            getTimelineFrameServiceRef: runtimeReferenceAccessorService.getTimelineFrameServiceRef,
            getFixedTimeTimelineServiceRef: runtimeReferenceAccessorService.getFixedTimeTimelineServiceRef,
            getPatchedMainTabState: patchedStateAccessorService.getPatchedMainTabState,
            getShowTimelineStateRef: runtimeReferenceAccessorService.getShowTimelineStateRef,
            ...pickDeps([
                "getGlobalTimeState",
                "getFixedTimeSlotCountForGroupRef",
                "getFixedTimeSlotHeaderLabel",
            ]),
            getPatchedSlotCountState: patchedStateAccessorService.getPatchedSlotCountState,
            ...pickDeps([
                "GTV_GROUP_CONTEXT_STATE",
                "GTV_FORMAT_PROFILE_STATE",
                "GTV_MULTI_RANGE_STATE",
                "GTV_FIXED_TIME_SLOT_UTILS",
                "GTV_FIXED_TIME_STATE",
                "GTV_UI_PREFERENCES_STATE",
                "GTV_TIMER_ENGINE",
                "GTV_TIME_SERVICE",
                "MAIN_TABS",
                "getGroupsStateSnapshot",
            ]),
            getPatchedActiveFormatProfileContextState: patchedStateAccessorService.getPatchedActiveFormatProfileContextState,
            getPatchedActiveGroupIdState: patchedStateAccessorService.getPatchedActiveGroupIdState,
            ...pickDeps([
                "getActiveGroupIdByMainTabStateSnapshot",
                "patchPrimaryState",
                "getUTCRef",
                "COPY_FORMAT_KEYS",
                "TIME_PART_KEYS",
                "FORMAT_PROFILE_CONTEXT_KEYS",
                "DEFAULT_DISPLAY_FORMAT_ENABLED",
                "DEFAULT_COPY_FORMAT_ENABLED",
                "DEFAULT_DISPLAY_TIME_PARTS_ENABLED",
                "DEFAULT_COPY_TIME_PARTS_ENABLED",
                "sanitizeMainTab",
            ]),
            getDisplayFormatOrderStateRef: runtimeReferenceAccessorService.getDisplayFormatOrderStateRef,
            getDisplayFormatEnabledStateRef: runtimeReferenceAccessorService.getDisplayFormatEnabledStateRef,
            getDisplayTimePartsEnabledStateRef: runtimeReferenceAccessorService.getDisplayTimePartsEnabledStateRef,
            getCopyFormatOrderStateRef: runtimeReferenceAccessorService.getCopyFormatOrderStateRef,
            getCopyFormatEnabledStateRef: runtimeReferenceAccessorService.getCopyFormatEnabledStateRef,
            getCopyTimePartsEnabledStateRef: runtimeReferenceAccessorService.getCopyTimePartsEnabledStateRef,
            getFormatProfilesStateRef: runtimeReferenceAccessorService.getFormatProfilesStateRef,
            getActiveFormatProfileContextStateRef: runtimeReferenceAccessorService.getActiveFormatProfileContextStateRef,
            patchAppState: patchedStateAccessorService.patchAppState,
            ...pickDeps([
                "MIN_MULTI_RANGE_COUNT",
                "MAX_MULTI_RANGE_COUNT",
                "DEFAULT_MULTI_RANGE_TITLE",
                "gtvT",
            ]),
            getShowToastRef: runtimeReferenceAccessorService.getShowToastRef,
            ...pickDeps([
                "getGlobalTimesState",
                "isMultiTab",
                "renderMultiRangesSafely",
                "updateTimeAdjustPanelSafely",
                "savePersistenceSafely",
                "MIN_FIXED_TIME_SLOT_COUNT",
                "MAX_FIXED_TIME_SLOT_COUNT",
                "DEFAULT_FIXED_TIME_VALUE",
                "parseDateTimeParts",
                "buildStrictUtcDateFromParts",
                "getNextFixedTimeSeed",
                "sanitizeFixedDateValue",
                "sanitizeFixedTimeShowLiveNow",
                "sanitizeFixedTimeSlotCount",
                "getRenderTimelineFrameRef",
                "createUniqueFixedTimeId",
                "createDefaultFixedTimeSlot",
                "MIN_UI_SCALE_PERCENT",
                "MAX_UI_SCALE_PERCENT",
                "DEFAULT_UI_SCALE_PERCENT",
                "UI_SCALE_PERCENT_OPTIONS",
                "DEFAULT_DAY_START_HOUR",
                "DEFAULT_NIGHT_START_HOUR",
                "DAY_NIGHT_HOUR_OPTIONS",
                "THEME_LIST",
                "THEME_STORAGE_KEY",
                "UI_SCALE_STORAGE_KEY",
                "MAIN_I18N_DATA",
            ]),
            getPersistenceServiceRef: runtimeReferenceAccessorService.getPersistenceServiceRef,
            getUiScaleState: runtimeReferenceAccessorService.getUiScaleState,
            getCurrentThemeStateRef: runtimeReferenceAccessorService.getCurrentThemeStateRef,
            getDayStartHourStateRef: runtimeReferenceAccessorService.getDayStartHourStateRef,
            getNightStartHourStateRef: runtimeReferenceAccessorService.getNightStartHourStateRef,
            getPatchedCurrentLangState: patchedStateAccessorService.getPatchedCurrentLangState,
            getCurrentLangStateRef: runtimeReferenceAccessorService.getCurrentLangStateRef,
            ...pickDeps([
                "setUiPreferencesState",
                "DEFAULT_REALTIME_TICK_MS",
                "getIsRealtimeState",
                "shouldRunRealtimeTick",
                "setGlobalTimeState",
                "MAX_RUNTIME_CACHE_SIZE",
            ]),
            getUpdateClocksRef: runtimeReferenceAccessorService.getUpdateClocksRef,
            ...pickDeps([
                "setRuntimeInterval",
                "clearRuntimeInterval",
                "getLuxonGlobalRef",
            ]),
        });

        return Object.freeze({
            mainCoreAssemblyConfig
        });
    }

    globalObj.GTVMainRuntimeCoreAssemblyBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
