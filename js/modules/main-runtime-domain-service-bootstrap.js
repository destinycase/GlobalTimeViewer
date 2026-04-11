(function initGtvMainRuntimeDomainServiceBootstrap(globalObj) {
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

        const mainRuntimeServiceConfigBuilderService = requireObject(
            safeDeps.mainRuntimeServiceConfigBuilderService,
            "mainRuntimeServiceConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildMainFixedTimeServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainFixedTimeServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainFixedTimeServicesConfig"
        );
        const buildMainMultiRangeServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainMultiRangeServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainMultiRangeServicesConfig"
        );
        const buildMainTimeAdjustServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainTimeAdjustServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainTimeAdjustServicesConfig"
        );
        const buildMainTabServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainTabServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainTabServicesConfig"
        );
        const buildMainGroupStateServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainGroupStateServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainGroupStateServicesConfig"
        );
        const buildMainImageExportNamingProxyConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainImageExportNamingProxyConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainImageExportNamingProxyConfig"
        );
        const buildMainImageExportServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainImageExportServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainImageExportServicesConfig"
        );
        const buildMainAppStateServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainAppStateServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainAppStateServicesConfig"
        );

        const createMainFixedTimeServices = requireFunction(
            mainCoreServices.createMainFixedTimeServices,
            "mainCoreServices.createMainFixedTimeServices"
        );
        const createMainMultiRangeServices = requireFunction(
            mainCoreServices.createMainMultiRangeServices,
            "mainCoreServices.createMainMultiRangeServices"
        );
        const createMainTimeAdjustServices = requireFunction(
            mainCoreServices.createMainTimeAdjustServices,
            "mainCoreServices.createMainTimeAdjustServices"
        );
        const createMainTabServices = requireFunction(
            mainCoreServices.createMainTabServices,
            "mainCoreServices.createMainTabServices"
        );
        const createMainGroupStateServices = requireFunction(
            mainCoreServices.createMainGroupStateServices,
            "mainCoreServices.createMainGroupStateServices"
        );
        const createMainImageExportNamingProxy = requireFunction(
            mainCoreServices.createMainImageExportNamingProxy,
            "mainCoreServices.createMainImageExportNamingProxy"
        );
        const createMainImageExportServices = requireFunction(
            mainCoreServices.createMainImageExportServices,
            "mainCoreServices.createMainImageExportServices"
        );
        const createMainAppStateServices = requireFunction(
            mainCoreServices.createMainAppStateServices,
            "mainCoreServices.createMainAppStateServices"
        );

        const mainFixedTimeServicesConfig = buildMainFixedTimeServicesConfig({
            ...pickDeps([
                "GTV_FIXED_TIME_CORE",
                "GTV_FIXED_TIME_TIMELINE",
                "GTV_FIXED_TIME_ACTIONS",
                "DEFAULT_FIXED_TIME_VALUE",
                "MIN_FIXED_TIME_SLOT_COUNT",
                "TIMELINE_TOTAL_SECONDS",
                "MAIN_I18N_DATA",
                "gtvT",
                "getPatchedCurrentLangState",
                "sanitizeFixedTimeValue",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "pad",
                "sanitizeTimePartsEnabledForContext",
                "getPatchedDisplayTimePartsEnabledState",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "getFixedDatePartsFromGroup",
                "getDayNightMarkerByHour",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getGlobalTimeState",
                "resolveFixedTimeSlotUtcDate",
                "clampNumber",
                "getFixedTimeSlotCount",
                "sanitizeFixedTimeId",
                "getFixedTimeSlotHeaderLabel",
                "sanitizeCopyFormatOrderForContext",
                "sanitizeCopyFormatEnabledForContext",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                "formatSnapshotTextViaSnapshotService",
                "getBaseTimezoneRef",
                "getRenderableTimezoneRowsFromTableRender",
                "parseDateTimeParts",
                "deferDynamicCall",
                "getShowToastRef",
                "writeClipboardText",
                "buildFixedTimeDisplayPayloadAtUtc",
                "getRenderFixedTimeTabRef",
                "getRenderTimelineFrameRef",
                "getSavePersistenceSafelyRef",
                "setFixedTimeSlotCount",
                "getRefreshFixedTimeSlotCountControlsRef",
            ]),
        });
        const mainFixedTimeServices = createMainFixedTimeServices(mainFixedTimeServicesConfig);
        const fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
        const fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
        const fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

        const mainMultiRangeServicesConfig = buildMainMultiRangeServicesConfig({
            ...pickDeps([
                "GTV_MULTI_RANGE_RENDER",
                "GTV_MULTI_RANGE_COPY",
                "GTV_COPY_ACTIONS",
                "MAIN_I18N_DATA",
                "gtvT",
                "getPatchedCurrentLangState",
                "pad",
                "getDayNightMarkerByHour",
                "getCustomOffsetMinutes",
                "getFixedOffsetForDisplayAtDate",
                "normalizeCustomAbbr",
                "getZoneAbbreviation",
                "getSignedInclusiveDaySpan",
                "getSignedDurationDayHourMinute",
                "getZoneDisplayName",
                "getZoneDisplayNameForUiAtDate",
                "sanitizeMultiSubgroupNameViaState",
                "getCurrentMultiSubgroupName",
                "sanitizeMultiRangeTitle",
                "getPatchedMultiRangeTitleState",
                "buildStaticRowCellFromTableRender",
                "buildDynamicRowCellFromTableRender",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "handleMultiRangeTimeChange",
                "copyMultiRangeRow",
                "hideFloatingTooltip",
                "ensureMultiRangeState",
                "refreshMultiRangeControls",
                "renderMultiBulkToolSets",
                "getBaseTimezoneRef",
                "escapeHtmlViaSharedUtils",
                "getDisplayColumns",
                "getRenderableTimezoneRowsFromTableRender",
                "getPatchedMultiRangesState",
                "getPatchedMultiRangeCollapsedState",
                "getPatchedMultiRangeCountState",
                "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                "saveMultiRangeSingleImage",
                "setMultiRangesCollapsedBelow",
                "toggleMultiRangeCollapsed",
                "renderTimeAdjustSet",
                "applyMultiRangeTimeAdjustAction",
                "attachTimeAdjustToggleLabel",
                "setMultiRangeStartEditEnabled",
                "setMultiRangeEndEditEnabled",
                "getMultiDisplayColumnHeaderFromTableRender",
                "updateTimeAdjustPanelSafely",
                "updateCopyFormatPreview",
                "upgradeNativeTitleTooltips",
                "deferDynamicCall",
                "getShowToastRef",
                "getTimezoneRefByIdFromSnapshotService",
                "buildTimezoneComputedSnapshotForRange",
                "formatSnapshotText",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "writeClipboardText",
                "getPatchedShowCopyFormatState",
                "isMultiTab",
                "isFixedTimeTab",
                "getRowFormattedTextViaSnapshotService",
                "getRowCopyTextViaSnapshotService",
                "getFixedTimePreviewCopyText",
                "getAllFixedTimeRowsCopyText",
                "copyAllMultiRangeTimezones",
            ]),
        });
        const mainMultiRangeServices = createMainMultiRangeServices(mainMultiRangeServicesConfig);
        const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
        const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
        const copyActionsService = mainMultiRangeServices.copyActionsService;

        const mainTimeAdjustServicesConfig = buildMainTimeAdjustServicesConfig({
            ...pickDeps([
                "GTV_TIME_ADJUST_UI",
                "GTV_MULTI_BULK_TOOLS",
                "GTV_TIME_ADJUST_ACTIONS",
                "MIN_TIME_ADJUST_DAY_STEP",
                "MAX_TIME_ADJUST_DAY_STEP",
                "DEFAULT_TIME_ADJUST_DAY_STEP",
                "gtvT",
                "savePersistenceSafely",
                "applyTimeAdjustAction",
                "getPatchedMainTabState",
                "getIsRealtimeState",
                "getPatchedSlotCountState",
                "getTimeAdjustDayStepValue",
                "getTimeAdjustDayStepBySlotSnapshot",
                "setTimeAdjustDayStepBySlotState",
                "upgradeNativeTitleTooltips",
                "getPatchedMultiRangeCountState",
                "applyBulkRangeAllAction",
                "applyFirstRangeStartAdjustAction",
                "setAllMultiRangeStartEditEnabled",
                "setAllMultiRangeEndEditEnabled",
                "getGlobalTimesState",
                "deferDynamicCall",
                "getUpdateClocksRef",
                "getBaseTimezoneRef",
                "getFixedOffsetForDisplay",
                "getFixedOffsetForDisplayAtDate",
                "getCustomOffsetMinutes",
                "getTimeAdjustDayStep",
                "timeService",
                "sanitizeUtcMsViaTimeCore",
                "ensureMultiRangeState",
                "getPatchedMultiRangesState",
                "isMultiRangeStartLinked",
                "isMultiTab",
                "renderMultiRangesSafely",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "syncLinkedRangesFrom",
                "getMultiRangeSlotDate",
                "setMultiRangeSlotDate",
                "syncFollowingRangesByDuration",
                "syncMultiRangeStartLinks",
            ]),
        });
        const mainTimeAdjustServices = createMainTimeAdjustServices(mainTimeAdjustServicesConfig);
        const timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
        const multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
        const timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;

        const mainTabServicesConfig = buildMainTabServicesConfig({
            ...pickDeps([
                "GTV_FORMAT_CONTROLS",
                "serviceBootstrap",
                "COPY_FORMAT_KEYS",
                "TIME_PART_KEYS",
                "gtvT",
                "sanitizeCopyFormatOrder",
                "deferDynamicCall",
                "getRenderListRef",
                "updateCopyFormatPreview",
                "savePersistenceSafely",
                "upgradeNativeTitleTooltips",
                "getPatchedShowCopyFormatState",
                "getPatchedDisplayFormatOrderState",
                "getPatchedActiveFormatProfileContextState",
                "patchAppState",
                "sanitizeCopyFormatOrderForContext",
                "syncActiveFormatProfileFromState",
                "getPatchedDisplayFormatEnabledState",
                "sanitizeCopyFormatEnabledForContext",
                "getPatchedDisplayTimePartsEnabledState",
                "sanitizeTimePartsEnabledForContext",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "getActiveCopyFormatKeysForCurrentContext",
                "getActiveTimePartKeysForCurrentContext",
                "sanitizeMainTab",
                "clampGroupIndex",
                "normalizeGroupTabState",
                "isMultiTab",
                "isFixedTimeTab",
                "getPatchedSlotCountState",
                "getPatchedShowTimelineState",
                "getIsRealtimeState",
                "setIsRealtimeState",
                "setGlobalTimeState",
                "getPatchedMainTabState",
                "setCurrentMainTabState",
                "getPatchedActiveGroupIdState",
                "setActiveGroupIdState",
                "getActiveGroupIdByMainTabStateSnapshot",
                "setActiveGroupIdByMainTabState",
                "hideFloatingTooltip",
                "syncCurrentMultiStateToActiveSubgroup",
                "refreshMultiRangeControls",
                "renderBaseTimeSelect",
                "loadCurrentMultiStateFromActiveSubgroup",
                "bindFacadeMethod",
                "getGroupTabsServiceRef",
                "renderMultiRangesSafely",
                "renderFixedTimeTab",
                "getRenderTimelineFrameRef",
                "updateTimeAdjustPanelSafely",
                "resolveFormatProfileContext",
                "activateFormatProfileContext",
            ]),
        });
        const mainTabServices = createMainTabServices(mainTabServicesConfig);
        const formatControlsService = mainTabServices.formatControlsService;
        const tabUiService = mainTabServices.tabUiService;
        const tabOrchestratorService = mainTabServices.tabOrchestratorService;

        const mainGroupStateServicesConfig = buildMainGroupStateServicesConfig({
            ...pickDeps([
                "GTV_MULTI_STATE",
                "serviceBootstrap",
                "MIN_MULTI_RANGE_COUNT",
                "gtvT",
                "getGroupsStateSnapshot",
                "getDefaultMultiRangeBounds",
                "sanitizeMultiRangeCount",
                "sanitizeMultiRangeItem",
                "sanitizeUtcMsViaTimeCore",
                "sanitizeTimezoneId",
                "createUniqueTimezoneId",
                "normalizeCustomAbbr",
                "normalizeZoneAbbreviationViaSearch",
                "sanitizeBaseTimezoneId",
                "sanitizeUtcRowOrderViaTimeCore",
                "sanitizeFixedTimes",
                "sanitizeFixedDateValue",
                "sanitizeFixedTimeShowLiveNow",
            ]),
        });
        const mainGroupStateServices = createMainGroupStateServices(mainGroupStateServicesConfig);
        const multiStateService = mainGroupStateServices.multiStateService;
        const groupStateService = mainGroupStateServices.groupStateService;

        const mainImageExportNamingProxyConfig = buildMainImageExportNamingProxyConfig({
            ...pickDeps([
                "getImageExportNamingServiceRef",
                "getCustomOffsetMinutes",
                "pad",
                "timeService",
                "getBaseTimezoneRef",
                "getGroupsStateSnapshot",
                "getPatchedActiveGroupIdState",
                "gtvT",
                "getZoneAbbreviation",
                "getBaseTimeSnapshot",
                "sanitizeMultiSubgroupNameForExport",
                "getCurrentMultiSubgroupName",
            ]),
        });
        const mainImageExportNamingProxy = createMainImageExportNamingProxy(mainImageExportNamingProxyConfig);
        const {
            sanitizeFilenamePart,
            formatDateTimeByTimezone,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename
        } = mainImageExportNamingProxy;

        const mainImageExportServicesConfig = buildMainImageExportServicesConfig({
            ...pickDeps([
                "GTV_IMAGE_EXPORT_NAMING",
                "GTV_IMAGE_EXPORT_ACTIONS",
                "GTV_IMAGE_EXPORT",
                "gtvT",
                "pad",
                "timeService",
                "getCustomOffsetMinutes",
                "getBaseTimezoneRef",
                "getBaseTimeSnapshot",
                "getActiveGroupNameSnapshot",
                "getZoneAbbreviation",
                "sanitizeMultiSubgroupNameForExport",
                "getCurrentMultiSubgroupName",
                "deferDynamicCall",
                "getShowToastRef",
                "isMultiTab",
                "ensureMultiRangeState",
                "detectForeignObjectRendererSupport",
                "renderTimezoneTableToPngDataUrl",
                "renderTimezoneTableFallbackDataUrl",
                "renderMultiRangesToPngDataUrl",
                "renderMultiRangeSingleToPngDataUrl",
                "renderMultiRangesFallbackDataUrl",
                "renderMultiRangeTitlesToPngDataUrl",
            ]),
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename,
            ...pickDeps([
                "getPatchedMultiRangesState",
                "isDomExceptionLike",
                "setCanUseForeignObjectRenderer",
            ]),
        });
        const mainImageExportServices = createMainImageExportServices(mainImageExportServicesConfig);
        const imageExportNamingService = mainImageExportServices.imageExportNamingService;
        const imageExportActionsService = mainImageExportServices.imageExportActionsService;

        const mainAppStateServicesConfig = buildMainAppStateServicesConfig({
            ...pickDeps([
                "GTV_APP_STATE_PATCHER",
                "GTV_APP_PERSISTENCE_STATE",
                "getMainAppStateSource",
                "directStateSetters",
                "setIsRealtimeState",
                "syncActiveFormatProfileFromState",
                "ensureFormatProfiles",
                "getCurrentFormatProfileState",
                "resolveFormatProfileContext",
                "applyFormatProfileState",
            ]),
        });
        const mainAppStateServices = createMainAppStateServices(mainAppStateServicesConfig);
        const appStatePatcherService = mainAppStateServices.appStatePatcherService;
        const appPersistenceStateService = mainAppStateServices.appPersistenceStateService;

        return Object.freeze({
            fixedTimeCoreService,
            fixedTimeTimelineService,
            fixedTimeActionsService,
            multiRangeRenderService,
            multiRangeCopyService,
            copyActionsService,
            timeAdjustUiService,
            multiBulkToolsService,
            timeAdjustActionsService,
            formatControlsService,
            tabUiService,
            tabOrchestratorService,
            multiStateService,
            groupStateService,
            sanitizeFilenamePart,
            formatDateTimeByTimezone,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename,
            imageExportNamingService,
            imageExportActionsService,
            appStatePatcherService,
            appPersistenceStateService
        });
    }

    globalObj.GTVMainRuntimeDomainServiceBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
