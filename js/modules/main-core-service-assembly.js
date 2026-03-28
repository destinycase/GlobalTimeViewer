(function initGtvMainCoreServiceAssembly(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const getRuntimeCurrentLangState = (typeof deps.getRuntimeCurrentLangState === "function")
            ? deps.getRuntimeCurrentLangState
            : deps.getCurrentLangState;

        const mainServiceMethodBridgeService = deps.GTV_MAIN_SERVICE_METHOD_BRIDGE.createService({
            onWarnMissingMethod: deps.onWarnMissingMethod,
            onMissingFeature: deps.onMissingFeature
        });

        const mainDirectStatePatchService = deps.GTV_MAIN_DIRECT_STATE_PATCH.createService({
            stateSetters: deps.stateSetters,
            setIsRealtimeState: deps.setIsRealtimeState
        });

        const mainAppStateBridgeService = deps.GTV_MAIN_APP_STATE_BRIDGE.createService({
            callServiceMethod: deps.callServiceMethod,
            getAppStatePatcherService: deps.getAppStatePatcherService,
            getAppPersistenceStateService: deps.getAppPersistenceStateService,
            applyDirectStatePatch: deps.applyDirectStatePatch,
            serviceMethodMissingToken: deps.serviceMethodMissingToken
        });

        const mainPatchedStateSelectorsService = deps.GTV_MAIN_PATCHED_STATE_SELECTORS.createService({
            getPatchedStateValue: (key, fallbackValue) => mainAppStateBridgeService.getPatchedStateValue(key, fallbackValue),
            getPatchedIntegerStateValue: (key, fallbackValue = 0) =>
                mainAppStateBridgeService.getPatchedIntegerStateValue(key, fallbackValue),
            getPatchedBooleanStateValue: (key, fallbackValue = false) =>
                mainAppStateBridgeService.getPatchedBooleanStateValue(key, fallbackValue),
            getPatchedStringStateValue: (key, fallbackValue = "") =>
                mainAppStateBridgeService.getPatchedStringStateValue(key, fallbackValue),
            getPatchedArrayStateValue: (key, fallbackValue = []) =>
                mainAppStateBridgeService.getPatchedArrayStateValue(key, fallbackValue),
            getPatchedObjectStateValue: (key, fallbackValue = {}) =>
                mainAppStateBridgeService.getPatchedObjectStateValue(key, fallbackValue),
            patchAppState: (next = {}) => mainAppStateBridgeService.patchAppState(next),
            getFallbackState: deps.getPatchedStateFallback
        });

        const mainSharedUtilsService = deps.GTV_MAIN_SHARED_UTILS.createService({
            tableImageExportWidth: deps.tableImageExportWidth,
            createCanvas: deps.createCanvas
        });

        const mainTimezoneRuntimeBridgeService = deps.GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE.createService({
            callServiceMethod: deps.callServiceMethod,
            getMainTimezoneRuntimeService: deps.getMainTimezoneRuntimeService,
            getGlobalTimeState: deps.getGlobalTimeState,
            getCurrentLangState: getRuntimeCurrentLangState,
            maxRuntimeCacheSize: deps.maxRuntimeCacheSize
        });

        const mainTimezoneRuntimeService = deps.GTV_MAIN_TIMEZONE_RUNTIME_SERVICES.createService({
            maxRuntimeCacheSize: deps.maxRuntimeCacheSize,
            timezoneOffsetCache: deps.timezoneOffsetCache,
            timezoneDstCache: deps.timezoneDstCache,
            zoneAbbrCache: deps.zoneAbbrCache,
            getBaseTime: deps.getBaseTime,
            getZoneMap: deps.getZoneMap,
            getTzDatabase: deps.getTzDatabase,
            getTimeService: deps.getTimeService,
            normalizeCustomAbbr: deps.normalizeCustomAbbr,
            getTimezoneSearchService: deps.getTimezoneSearchService,
            formatUtcOffsetLabel: deps.formatUtcOffsetLabel,
            getCurrentLang: getRuntimeCurrentLangState,
            t: deps.t,
            resolveLocalizedTZLabel: deps.resolveLocalizedTZLabel
        });

        const mainTimezoneFacadeService = deps.GTV_MAIN_TIMEZONE_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getMainTimezoneRuntimeBridgeService: deps.getMainTimezoneRuntimeBridgeService,
            getMainBaseTimezoneService: deps.getMainBaseTimezoneService,
            getMainTimezoneMutationService: deps.getMainTimezoneMutationService,
            getTimezoneSearchService: deps.getTimezoneSearchService,
            getTimeCore: deps.getTimeCore
        });

        const mainBaseTimezoneService = deps.GTV_MAIN_BASE_TIMEZONE_SERVICES.createService({
            getCurrentGroup: deps.getCurrentGroup,
            sanitizeBaseTimezoneId: deps.sanitizeBaseTimezoneId,
            renderList: deps.renderList,
            renderTimelineFrame: deps.renderTimelineFrame,
            updateTimeAdjustPanel: deps.updateTimeAdjustPanelSafely,
            savePersistence: deps.savePersistenceSafely
        });

        const mainTimezoneMutationService = deps.GTV_MAIN_TIMEZONE_MUTATION_SERVICES.createService({
            getGroups: deps.getGroupsStateSnapshot,
            getCurrentGroup: deps.getCurrentGroup,
            getCurrentGroupBaseTimezoneId: deps.getCurrentGroupBaseTimezoneId,
            sanitizeTimezoneId: deps.sanitizeTimezoneId,
            getNextTimezoneIdSeed: deps.getNextTimezoneIdSeed,
            getNow: deps.now,
            getRandomUUID: deps.getRandomUUID,
            getRandom: deps.getRandom,
            getGroupStateService: deps.getGroupStateService,
            normalizeCustomAbbr: deps.normalizeCustomAbbr,
            showToast: deps.showToast,
            t: deps.t,
            savePersistence: deps.savePersistenceSafely,
            renderList: deps.renderList,
            renderTimelineFrame: deps.renderTimelineFrame
        });

        const mainTimezoneTableFacadeService = deps.GTV_MAIN_TIMEZONE_TABLE_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getTableRenderService: deps.getTableRenderService,
            getMainTimezoneFacadeService: deps.getMainTimezoneFacadeService,
            getCopyActionsService: deps.getCopyActionsService,
            isFixedTimeTab: deps.isFixedTimeTab,
            renderFixedTimeTab: deps.renderFixedTimeTab
        });

        const mainTimeAdjustFacadeService = deps.GTV_MAIN_TIME_ADJUST_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getTimeAdjustUiService: deps.getTimeAdjustUiService,
            getTimeAdjustActionsService: deps.getTimeAdjustActionsService,
            getMultiBulkToolsService: deps.getMultiBulkToolsService,
            getTimeAdjustDayStepBySlotSnapshot: deps.getTimeAdjustDayStepBySlotSnapshot,
            setTimeAdjustDayStepBySlotState: deps.setTimeAdjustDayStepBySlotState,
            defaultTimeAdjustDayStep: deps.defaultTimeAdjustDayStep,
            minTimeAdjustDayStep: deps.minTimeAdjustDayStep,
            maxTimeAdjustDayStep: deps.maxTimeAdjustDayStep
        });

        const mainFixedTimeTabFacadeService = deps.GTV_MAIN_FIXED_TIME_TAB_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getFixedTimeTableService: deps.getFixedTimeTableService,
            getCurrentGroup: deps.getCurrentGroup,
            ensureGroupFixedTimes: deps.ensureGroupFixedTimes,
            refreshFixedTimeSlotCountControls: deps.refreshFixedTimeSlotCountControls,
            getCurrentGroupFixedTimeShowLiveNow: deps.getCurrentGroupFixedTimeShowLiveNow,
            getDocumentRef: deps.getDocumentRef,
            renderBaseTimeSelect: deps.renderBaseTimeSelect,
        });

        const mainFixedTimeFacadeService = deps.GTV_MAIN_FIXED_TIME_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getFixedTimeCoreService: deps.getFixedTimeCoreService,
            getFixedTimeActionsService: deps.getFixedTimeActionsService,
            getCopyFormatOrderState: deps.getPatchedCopyFormatOrderState,
            getCopyFormatEnabledState: deps.getPatchedCopyFormatEnabledState,
            getCopyTimePartsEnabledState: deps.getPatchedCopyTimePartsEnabledState,
            sanitizeCopyFormatOrderForContext: deps.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: deps.sanitizeCopyFormatEnabledForContext,
            sanitizeTimePartsEnabledForContext: deps.sanitizeTimePartsEnabledForContext,
            getWindowRef: deps.getWindowRef,
            getDocumentRef: deps.getDocumentRef,
            t: deps.t
        });

        const mainTimelineFacadeService = deps.GTV_MAIN_TIMELINE_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getTimelineFrameService: deps.getTimelineFrameService,
            getFixedTimeTimelineService: deps.getFixedTimeTimelineService,
            getFixedTimeCoreService: deps.getFixedTimeCoreService,
            getMainTabState: deps.getMainTabState,
            getShowTimelineState: deps.getShowTimelineState,
            isMultiTab: deps.isMultiTab,
            getGlobalTimeState: deps.getGlobalTimeState,
            getCurrentGroup: deps.getCurrentGroup,
            getFixedTimeSlotCountForGroup: deps.getFixedTimeSlotCountForGroup,
            getFixedTimeSlotHeaderLabel: deps.getFixedTimeSlotHeaderLabel,
            getIsRealtimeState: deps.getIsRealtimeState,
            getSlotCountState: deps.getSlotCountState,
            isFixedTimeTab: deps.isFixedTimeTab,
            t: deps.t
        });

        const mainMultiRangeTabFacadeService = deps.GTV_MAIN_MULTI_RANGE_TAB_FACADE.createService({
            callServiceMethod: deps.callServiceMethod,
            getMultiRangeRenderService: deps.getMultiRangeRenderService,
            getMultiRangeCopyService: deps.getMultiRangeCopyService
        });

        const mainGroupLocalizationServices = deps.GTV_MAIN_GROUP_LOCALIZATION_SERVICES.createService({
            getGroups: deps.getGroupsStateSnapshot,
            getCurrentGroup: deps.getCurrentGroup,
            getMultiStateService: deps.getMultiStateService,
            t: deps.t,
            getMultiRangeState: deps.getMultiRangeStateSnapshot,
            setMultiRangeState: deps.setMultiRangeState,
            sanitizeMultiRangeCount: deps.sanitizeMultiRangeCount,
            sanitizeMultiRangeTitle: deps.sanitizeMultiRangeTitle,
            sanitizeUtcMs: deps.sanitizeUtcMs,
            ensureMultiRangeState: deps.ensureMultiRangeState,
            refreshMultiRangeControls: deps.refreshMultiRangeControls,
            now: deps.now
        });

        const mainOrchestrationFlowServices = deps.GTV_MAIN_ORCHESTRATION_FLOW_SERVICES.createService({
            getMainClockOrchestratorService: deps.getMainClockOrchestratorService,
            getMainPersistenceSnapshotService: deps.getMainPersistenceSnapshotService,
            getMainGroupLocalizationService: () => mainGroupLocalizationServices,
            warnMissingServiceMethod: deps.warnMissingServiceMethod
        });

        const groupContextStateService = deps.GTV_GROUP_CONTEXT_STATE.createService({
            MAIN_TABS: deps.MAIN_TABS,
            getGroups: deps.getGroupsStateSnapshot,
            getState: () => ({
                currentMainTab: deps.getPatchedMainTabState(),
                activeGroupId: deps.getPatchedActiveGroupIdState(),
                activeGroupIdByMainTab: deps.getActiveGroupIdByMainTabStateSnapshot()
            }),
            setState: deps.patchPrimaryState,
            getUTCRef: deps.getUTCRef,
            sanitizeUtcRowOrder: deps.sanitizeUtcRowOrder
        });

        const formatProfileStateService = deps.GTV_FORMAT_PROFILE_STATE.createService({
            COPY_FORMAT_KEYS: deps.COPY_FORMAT_KEYS,
            TIME_PART_KEYS: deps.TIME_PART_KEYS,
            FORMAT_PROFILE_CONTEXT_KEYS: deps.FORMAT_PROFILE_CONTEXT_KEYS,
            DEFAULT_DISPLAY_FORMAT_ENABLED: deps.DEFAULT_DISPLAY_FORMAT_ENABLED,
            DEFAULT_COPY_FORMAT_ENABLED: deps.DEFAULT_COPY_FORMAT_ENABLED,
            DEFAULT_DISPLAY_TIME_PARTS_ENABLED: deps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
            DEFAULT_COPY_TIME_PARTS_ENABLED: deps.DEFAULT_COPY_TIME_PARTS_ENABLED,
            sanitizeMainTab: deps.sanitizeMainTab,
            getState: () => ({
                displayFormatOrder: deps.getDisplayFormatOrderState(),
                displayFormatEnabled: deps.getDisplayFormatEnabledState(),
                displayTimePartsEnabled: deps.getDisplayTimePartsEnabledState(),
                copyFormatOrder: deps.getCopyFormatOrderState(),
                copyFormatEnabled: deps.getCopyFormatEnabledState(),
                copyTimePartsEnabled: deps.getCopyTimePartsEnabledState(),
                formatProfiles: deps.getFormatProfilesState(),
                activeFormatProfileContext: deps.getActiveFormatProfileContextState(),
                currentMainTab: deps.getPatchedMainTabState(),
                slotCount: deps.getPatchedSlotCountState()
            }),
            setState: deps.patchAppState
        });

        const mainFormatProfileFacadeService = deps.GTV_MAIN_FORMAT_PROFILE_FACADE.createService({
            getFormatProfileStateService: () => formatProfileStateService,
            getActiveFormatProfileContextState: deps.getPatchedActiveFormatProfileContextState,
            getMainTabState: deps.getPatchedMainTabState,
            getSlotCountState: deps.getPatchedSlotCountState
        });

        const multiRangeStateService = deps.GTV_MULTI_RANGE_STATE.createService({
            MIN_MULTI_RANGE_COUNT: deps.MIN_MULTI_RANGE_COUNT,
            MAX_MULTI_RANGE_COUNT: deps.MAX_MULTI_RANGE_COUNT,
            DEFAULT_MULTI_RANGE_TITLE: deps.DEFAULT_MULTI_RANGE_TITLE,
            t: deps.t,
            showToast: deps.showToast,
            sanitizeUtcMs: deps.sanitizeUtcMs,
            getGlobalTimes: deps.getGlobalTimesState,
            getState: deps.getCurrentMultiRangeStateSnapshot,
            setState: deps.patchAppState,
            isMultiTab: deps.isMultiTab,
            renderMultiRanges: deps.renderMultiRangesSafely,
            savePersistence: deps.savePersistenceSafely
        });

        const fixedTimeSlotUtilsService = deps.GTV_FIXED_TIME_SLOT_UTILS.createService({
            MIN_FIXED_TIME_SLOT_COUNT: deps.MIN_FIXED_TIME_SLOT_COUNT,
            MAX_FIXED_TIME_SLOT_COUNT: deps.MAX_FIXED_TIME_SLOT_COUNT,
            DEFAULT_FIXED_TIME_VALUE: deps.DEFAULT_FIXED_TIME_VALUE,
            t: deps.t,
            pad: deps.pad,
            parseDateTimeParts: deps.parseDateTimeParts,
            buildStrictUtcDateFromParts: deps.buildStrictUtcDateFromParts,
            getCurrentGroup: deps.getCurrentGroup,
            getNextFixedTimeSeed: deps.getNextFixedTimeSeed
        });

        const fixedTimeStateService = deps.GTV_FIXED_TIME_STATE.createService({
            MIN_FIXED_TIME_SLOT_COUNT: deps.MIN_FIXED_TIME_SLOT_COUNT,
            MAX_FIXED_TIME_SLOT_COUNT: deps.MAX_FIXED_TIME_SLOT_COUNT,
            t: deps.t,
            showToast: deps.showToast,
            getCurrentGroup: deps.getCurrentGroup,
            ensureGroupFixedTimes: deps.ensureGroupFixedTimes,
            sanitizeFixedDateValue: deps.sanitizeFixedDateValue,
            sanitizeFixedTimeShowLiveNow: deps.sanitizeFixedTimeShowLiveNow,
            sanitizeFixedTimeSlotCount: deps.sanitizeFixedTimeSlotCount,
            isFixedTimeTab: deps.isFixedTimeTab,
            renderFixedTimeTab: deps.renderFixedTimeTab,
            renderTimelineFrame: deps.renderTimelineFrame,
            savePersistence: deps.savePersistenceSafely,
            createUniqueFixedTimeId: deps.createUniqueFixedTimeId,
            createDefaultFixedTimeSlot: deps.createDefaultFixedTimeSlot
        });

        const uiPreferencesStateService = deps.GTV_UI_PREFERENCES_STATE.createService({
            MIN_UI_SCALE_PERCENT: deps.MIN_UI_SCALE_PERCENT,
            MAX_UI_SCALE_PERCENT: deps.MAX_UI_SCALE_PERCENT,
            DEFAULT_UI_SCALE_PERCENT: deps.DEFAULT_UI_SCALE_PERCENT,
            UI_SCALE_PERCENT_OPTIONS: deps.UI_SCALE_PERCENT_OPTIONS,
            DEFAULT_DAY_START_HOUR: deps.DEFAULT_DAY_START_HOUR,
            DEFAULT_NIGHT_START_HOUR: deps.DEFAULT_NIGHT_START_HOUR,
            DAY_NIGHT_HOUR_OPTIONS: deps.DAY_NIGHT_HOUR_OPTIONS,
            THEME_LIST: deps.THEME_LIST,
            THEME_STORAGE_KEY: deps.THEME_STORAGE_KEY,
            UI_SCALE_STORAGE_KEY: deps.UI_SCALE_STORAGE_KEY,
            I18N_DATA: deps.I18N_DATA,
            t: deps.t,
            showToast: deps.showToast,
            getStorageValue: deps.getStorageValue,
            setStorageValue: deps.setStorageValue,
            updateClocks: deps.updateClocks,
            savePersistence: deps.savePersistenceSafely,
            getState: () => ({
                uiScale: deps.getUiScaleState(),
                currentTheme: deps.getCurrentThemeState(),
                dayStartHour: deps.getDayStartHourState(),
                nightStartHour: deps.getNightStartHourState(),
                currentLang: deps.getCurrentLangState()
            }),
            setState: deps.setUiPreferencesState
        });

        const timerEngineService = deps.GTV_TIMER_ENGINE.createService({
            DEFAULT_REALTIME_TICK_MS: deps.DEFAULT_REALTIME_TICK_MS,
            shouldTick: (typeof deps.shouldRunRealtimeTick === "function")
                ? deps.shouldRunRealtimeTick
                : deps.getIsRealtimeState,
            onTick: () => {
                deps.setGlobalTimeState(0, new Date());
                deps.updateClocks();
            },
            setIntervalFn: deps.setIntervalFn,
            clearIntervalFn: deps.clearIntervalFn
        });

        const timeService = deps.GTV_TIME_SERVICE.createService({
            luxon: deps.luxon
        });

        return Object.freeze({
            mainServiceMethodBridgeService,
            mainDirectStatePatchService,
            mainAppStateBridgeService,
            mainPatchedStateSelectorsService,
            mainSharedUtilsService,
            mainTimezoneRuntimeBridgeService,
            mainTimezoneRuntimeService,
            mainTimezoneFacadeService,
            mainBaseTimezoneService,
            mainTimezoneMutationService,
            mainTimezoneTableFacadeService,
            mainTimeAdjustFacadeService,
            mainFixedTimeTabFacadeService,
            mainFixedTimeFacadeService,
            mainTimelineFacadeService,
            mainMultiRangeTabFacadeService,
            mainGroupLocalizationServices,
            mainOrchestrationFlowServices,
            mainFormatProfileFacadeService,
            groupContextStateService,
            formatProfileStateService,
            multiRangeStateService,
            fixedTimeSlotUtilsService,
            fixedTimeStateService,
            uiPreferencesStateService,
            timerEngineService,
            timeService,
            createMainSelectServices: (config = {}) => deps.GTV_MAIN_SELECT_SERVICES.createService(config),
            createTimezoneSearchService: (config = {}) => deps.GTV_TIMEZONE_SEARCH.createService(config),
            createSnapshotFormatService: (config = {}) => deps.GTV_SNAPSHOT_FORMAT.createService(config),
            createTimeInputMutationsService: (config = {}) => deps.GTV_TIME_INPUT_MUTATIONS.createService(config),
            createMainRowOrderServices: (config = {}) => deps.GTV_MAIN_ROW_ORDER_SERVICES.createService(config),
            createMainRowViewServices: (config = {}) => deps.GTV_MAIN_ROW_VIEW_SERVICES.createService(config),
            createTableRenderService: (config = {}) => deps.GTV_TABLE_RENDER.createService(config),
            createMainImageExportBridgeProxy: (config = {}) => deps.GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY.createService(config),
            createMainImageRuntimeServices: (config = {}) => deps.GTV_MAIN_IMAGE_RUNTIME_SERVICES.createService(config),
            createMainFixedTimeServices: (config = {}) => deps.GTV_MAIN_FIXED_TIME_SERVICES.createService(config),
            createMainMultiRangeServices: (config = {}) => deps.GTV_MAIN_MULTI_RANGE_SERVICES.createService(config),
            createMainTimeAdjustServices: (config = {}) => deps.GTV_MAIN_TIME_ADJUST_SERVICES.createService(config),
            createMainTabServices: (config = {}) => deps.GTV_MAIN_TAB_SERVICES.createService(config),
            createMainGroupStateServices: (config = {}) => deps.GTV_MAIN_GROUP_STATE_SERVICES.createService(config),
            createMainImageExportNamingProxy: (config = {}) => deps.GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY.createService(config),
            createMainImageExportServices: (config = {}) => deps.GTV_MAIN_IMAGE_EXPORT_SERVICES.createService(config),
            createMainAppStateServices: (config = {}) => deps.GTV_MAIN_APP_STATE_SERVICES.createService(config),
            createMainPersistenceCompositionServices: (config = {}) =>
                deps.GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES.createService(config),
            createMainRuntimeCompositionServices: (config = {}) =>
                deps.GTV_MAIN_RUNTIME_COMPOSITION_SERVICES.createService(config),
            createMainAppBootstrapService: (config = {}) => deps.GTV_MAIN_APP_BOOTSTRAP.createService(config)
        });
    }

    globalObj.GTVMainCoreServiceAssembly = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
