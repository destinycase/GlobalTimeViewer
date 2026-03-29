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
            GTV_FIXED_TIME_CORE: safeDeps.GTV_FIXED_TIME_CORE,
            GTV_FIXED_TIME_TIMELINE: safeDeps.GTV_FIXED_TIME_TIMELINE,
            GTV_FIXED_TIME_ACTIONS: safeDeps.GTV_FIXED_TIME_ACTIONS,
            DEFAULT_FIXED_TIME_VALUE: safeDeps.DEFAULT_FIXED_TIME_VALUE,
            MIN_FIXED_TIME_SLOT_COUNT: safeDeps.MIN_FIXED_TIME_SLOT_COUNT,
            TIMELINE_TOTAL_SECONDS: safeDeps.TIMELINE_TOTAL_SECONDS,
            MAIN_I18N_DATA: safeDeps.MAIN_I18N_DATA,
            gtvT: safeDeps.gtvT,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            sanitizeFixedTimeValue: safeDeps.sanitizeFixedTimeValue,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: safeDeps.getLocalPartsByTimezone,
            getUTCDateFromLocalParts: safeDeps.getUTCDateFromLocalParts,
            pad: safeDeps.pad,
            sanitizeTimePartsEnabledForContext: safeDeps.sanitizeTimePartsEnabledForContext,
            getPatchedDisplayTimePartsEnabledState: safeDeps.getPatchedDisplayTimePartsEnabledState,
            getDefaultFixedTimeName: safeDeps.getDefaultFixedTimeName,
            sanitizeFixedTimeName: safeDeps.sanitizeFixedTimeName,
            getFixedDatePartsFromGroup: safeDeps.getFixedDatePartsFromGroup,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            resolveFixedTimeSlotUtcDate: safeDeps.resolveFixedTimeSlotUtcDate,
            clampNumber: safeDeps.clampNumber,
            getFixedTimeSlotCount: safeDeps.getFixedTimeSlotCount,
            sanitizeFixedTimeId: safeDeps.sanitizeFixedTimeId,
            getFixedTimeSlotHeaderLabel: safeDeps.getFixedTimeSlotHeaderLabel,
            sanitizeCopyFormatOrderForContext: safeDeps.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: safeDeps.sanitizeCopyFormatEnabledForContext,
            getPatchedCopyFormatOrderState: safeDeps.getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState: safeDeps.getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState: safeDeps.getPatchedCopyTimePartsEnabledState,
            buildTimezoneComputedSnapshotForDatesViaSnapshotService: safeDeps.buildTimezoneComputedSnapshotForDatesViaSnapshotService,
            formatSnapshotTextViaSnapshotService: safeDeps.formatSnapshotTextViaSnapshotService,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getRenderableTimezoneRowsFromTableRender: safeDeps.getRenderableTimezoneRowsFromTableRender,
            parseDateTimeParts: safeDeps.parseDateTimeParts,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getShowToastRef: safeDeps.getShowToastRef,
            writeClipboardText: safeDeps.writeClipboardText,
            buildFixedTimeDisplayPayloadAtUtc: safeDeps.buildFixedTimeDisplayPayloadAtUtc,
            getRenderFixedTimeTabRef: safeDeps.getRenderFixedTimeTabRef,
            getRenderTimelineFrameRef: safeDeps.getRenderTimelineFrameRef,
            getSavePersistenceSafelyRef: safeDeps.getSavePersistenceSafelyRef,
            setFixedTimeSlotCount: safeDeps.setFixedTimeSlotCount,
            getRefreshFixedTimeSlotCountControlsRef: safeDeps.getRefreshFixedTimeSlotCountControlsRef
        });
        const mainFixedTimeServices = createMainFixedTimeServices(mainFixedTimeServicesConfig);
        const fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
        const fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
        const fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

        const mainMultiRangeServicesConfig = buildMainMultiRangeServicesConfig({
            GTV_MULTI_RANGE_RENDER: safeDeps.GTV_MULTI_RANGE_RENDER,
            GTV_MULTI_RANGE_COPY: safeDeps.GTV_MULTI_RANGE_COPY,
            GTV_COPY_ACTIONS: safeDeps.GTV_COPY_ACTIONS,
            MAIN_I18N_DATA: safeDeps.MAIN_I18N_DATA,
            gtvT: safeDeps.gtvT,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            pad: safeDeps.pad,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getSignedInclusiveDaySpan: safeDeps.getSignedInclusiveDaySpan,
            getSignedDurationDayHourMinute: safeDeps.getSignedDurationDayHourMinute,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            sanitizeMultiSubgroupNameViaState: safeDeps.sanitizeMultiSubgroupNameViaState,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName,
            sanitizeMultiRangeTitle: safeDeps.sanitizeMultiRangeTitle,
            getPatchedMultiRangeTitleState: safeDeps.getPatchedMultiRangeTitleState,
            buildStaticRowCellFromTableRender: safeDeps.buildStaticRowCellFromTableRender,
            buildDynamicRowCellFromTableRender: safeDeps.buildDynamicRowCellFromTableRender,
            isMultiRangeStartEditEnabled: safeDeps.isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled: safeDeps.isMultiRangeEndEditEnabled,
            handleMultiRangeTimeChange: safeDeps.handleMultiRangeTimeChange,
            copyMultiRangeRow: safeDeps.copyMultiRangeRow,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            renderMultiBulkToolSets: safeDeps.renderMultiBulkToolSets,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            escapeHtmlViaSharedUtils: safeDeps.escapeHtmlViaSharedUtils,
            getDisplayColumns: safeDeps.getDisplayColumns,
            getRenderableTimezoneRowsFromTableRender: safeDeps.getRenderableTimezoneRowsFromTableRender,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            getPatchedMultiRangeCollapsedState: safeDeps.getPatchedMultiRangeCollapsedState,
            getPatchedMultiRangeCountState: safeDeps.getPatchedMultiRangeCountState,
            buildTimezoneComputedSnapshotForDatesViaSnapshotService: safeDeps.buildTimezoneComputedSnapshotForDatesViaSnapshotService,
            saveMultiRangeSingleImage: safeDeps.saveMultiRangeSingleImage,
            setMultiRangesCollapsedBelow: safeDeps.setMultiRangesCollapsedBelow,
            toggleMultiRangeCollapsed: safeDeps.toggleMultiRangeCollapsed,
            renderTimeAdjustSet: safeDeps.renderTimeAdjustSet,
            applyMultiRangeTimeAdjustAction: safeDeps.applyMultiRangeTimeAdjustAction,
            attachTimeAdjustToggleLabel: safeDeps.attachTimeAdjustToggleLabel,
            setMultiRangeStartEditEnabled: safeDeps.setMultiRangeStartEditEnabled,
            setMultiRangeEndEditEnabled: safeDeps.setMultiRangeEndEditEnabled,
            getMultiDisplayColumnHeaderFromTableRender: safeDeps.getMultiDisplayColumnHeaderFromTableRender,
            updateTimeAdjustPanelSafely: safeDeps.updateTimeAdjustPanelSafely,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getShowToastRef: safeDeps.getShowToastRef,
            getTimezoneRefByIdFromSnapshotService: safeDeps.getTimezoneRefByIdFromSnapshotService,
            buildTimezoneComputedSnapshotForRange: safeDeps.buildTimezoneComputedSnapshotForRange,
            formatSnapshotText: safeDeps.formatSnapshotText,
            getPatchedCopyFormatOrderState: safeDeps.getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState: safeDeps.getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState: safeDeps.getPatchedCopyTimePartsEnabledState,
            writeClipboardText: safeDeps.writeClipboardText,
            getPatchedShowCopyFormatState: safeDeps.getPatchedShowCopyFormatState,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getRowFormattedTextViaSnapshotService: safeDeps.getRowFormattedTextViaSnapshotService,
            getRowCopyTextViaSnapshotService: safeDeps.getRowCopyTextViaSnapshotService,
            getFixedTimePreviewCopyText: safeDeps.getFixedTimePreviewCopyText,
            getAllFixedTimeRowsCopyText: safeDeps.getAllFixedTimeRowsCopyText,
            copyAllMultiRangeTimezones: safeDeps.copyAllMultiRangeTimezones
        });
        const mainMultiRangeServices = createMainMultiRangeServices(mainMultiRangeServicesConfig);
        const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
        const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
        const copyActionsService = mainMultiRangeServices.copyActionsService;

        const mainTimeAdjustServicesConfig = buildMainTimeAdjustServicesConfig({
            GTV_TIME_ADJUST_UI: safeDeps.GTV_TIME_ADJUST_UI,
            GTV_MULTI_BULK_TOOLS: safeDeps.GTV_MULTI_BULK_TOOLS,
            GTV_TIME_ADJUST_ACTIONS: safeDeps.GTV_TIME_ADJUST_ACTIONS,
            MIN_TIME_ADJUST_DAY_STEP: safeDeps.MIN_TIME_ADJUST_DAY_STEP,
            MAX_TIME_ADJUST_DAY_STEP: safeDeps.MAX_TIME_ADJUST_DAY_STEP,
            DEFAULT_TIME_ADJUST_DAY_STEP: safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP,
            gtvT: safeDeps.gtvT,
            savePersistenceSafely: safeDeps.savePersistenceSafely,
            applyTimeAdjustAction: safeDeps.applyTimeAdjustAction,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            getTimeAdjustDayStepValue: safeDeps.getTimeAdjustDayStepValue,
            getTimeAdjustDayStepBySlotSnapshot: safeDeps.getTimeAdjustDayStepBySlotSnapshot,
            setTimeAdjustDayStepBySlotState: safeDeps.setTimeAdjustDayStepBySlotState,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            getPatchedMultiRangeCountState: safeDeps.getPatchedMultiRangeCountState,
            applyBulkRangeAllAction: safeDeps.applyBulkRangeAllAction,
            applyFirstRangeStartAdjustAction: safeDeps.applyFirstRangeStartAdjustAction,
            setAllMultiRangeStartEditEnabled: safeDeps.setAllMultiRangeStartEditEnabled,
            setAllMultiRangeEndEditEnabled: safeDeps.setAllMultiRangeEndEditEnabled,
            getGlobalTimesState: safeDeps.getGlobalTimesState,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getUpdateClocksRef: safeDeps.getUpdateClocksRef,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getFixedOffsetForDisplay: safeDeps.getFixedOffsetForDisplay,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getTimeAdjustDayStep: safeDeps.getTimeAdjustDayStep,
            timeService: safeDeps.timeService,
            sanitizeUtcMsViaTimeCore: safeDeps.sanitizeUtcMsViaTimeCore,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            isMultiRangeStartLinked: safeDeps.isMultiRangeStartLinked,
            isMultiTab: safeDeps.isMultiTab,
            renderMultiRangesSafely: safeDeps.renderMultiRangesSafely,
            isMultiRangeStartEditEnabled: safeDeps.isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled: safeDeps.isMultiRangeEndEditEnabled,
            syncLinkedRangesFrom: safeDeps.syncLinkedRangesFrom,
            getMultiRangeSlotDate: safeDeps.getMultiRangeSlotDate,
            setMultiRangeSlotDate: safeDeps.setMultiRangeSlotDate,
            syncFollowingRangesByDuration: safeDeps.syncFollowingRangesByDuration,
            syncMultiRangeStartLinks: safeDeps.syncMultiRangeStartLinks
        });
        const mainTimeAdjustServices = createMainTimeAdjustServices(mainTimeAdjustServicesConfig);
        const timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
        const multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
        const timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;

        const mainTabServicesConfig = buildMainTabServicesConfig({
            GTV_FORMAT_CONTROLS: safeDeps.GTV_FORMAT_CONTROLS,
            serviceBootstrap: safeDeps.serviceBootstrap,
            COPY_FORMAT_KEYS: safeDeps.COPY_FORMAT_KEYS,
            TIME_PART_KEYS: safeDeps.TIME_PART_KEYS,
            gtvT: safeDeps.gtvT,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getRenderListRef: safeDeps.getRenderListRef,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            savePersistenceSafely: safeDeps.savePersistenceSafely,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            getPatchedShowCopyFormatState: safeDeps.getPatchedShowCopyFormatState,
            getPatchedDisplayFormatOrderState: safeDeps.getPatchedDisplayFormatOrderState,
            getPatchedActiveFormatProfileContextState: safeDeps.getPatchedActiveFormatProfileContextState,
            patchAppState: safeDeps.patchAppState,
            sanitizeCopyFormatOrderForContext: safeDeps.sanitizeCopyFormatOrderForContext,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            getPatchedDisplayFormatEnabledState: safeDeps.getPatchedDisplayFormatEnabledState,
            sanitizeCopyFormatEnabledForContext: safeDeps.sanitizeCopyFormatEnabledForContext,
            getPatchedDisplayTimePartsEnabledState: safeDeps.getPatchedDisplayTimePartsEnabledState,
            sanitizeTimePartsEnabledForContext: safeDeps.sanitizeTimePartsEnabledForContext,
            getPatchedCopyFormatOrderState: safeDeps.getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState: safeDeps.getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState: safeDeps.getPatchedCopyTimePartsEnabledState,
            getActiveCopyFormatKeysForCurrentContext: safeDeps.getActiveCopyFormatKeysForCurrentContext,
            getActiveTimePartKeysForCurrentContext: safeDeps.getActiveTimePartKeysForCurrentContext,
            sanitizeMainTab: safeDeps.sanitizeMainTab,
            clampGroupIndex: safeDeps.clampGroupIndex,
            normalizeGroupTabState: safeDeps.normalizeGroupTabState,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            getPatchedShowTimelineState: safeDeps.getPatchedShowTimelineState,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            setIsRealtimeState: safeDeps.setIsRealtimeState,
            setGlobalTimeState: safeDeps.setGlobalTimeState,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            setCurrentMainTabState: safeDeps.setCurrentMainTabState,
            getPatchedActiveGroupIdState: safeDeps.getPatchedActiveGroupIdState,
            setActiveGroupIdState: safeDeps.setActiveGroupIdState,
            getActiveGroupIdByMainTabStateSnapshot: safeDeps.getActiveGroupIdByMainTabStateSnapshot,
            setActiveGroupIdByMainTabState: safeDeps.setActiveGroupIdByMainTabState,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            syncCurrentMultiStateToActiveSubgroup: safeDeps.syncCurrentMultiStateToActiveSubgroup,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            bindFacadeMethod: safeDeps.bindFacadeMethod,
            getGroupTabsServiceRef: safeDeps.getGroupTabsServiceRef,
            renderMultiRangesSafely: safeDeps.renderMultiRangesSafely,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            getRenderTimelineFrameRef: safeDeps.getRenderTimelineFrameRef,
            updateTimeAdjustPanelSafely: safeDeps.updateTimeAdjustPanelSafely,
            resolveFormatProfileContext: safeDeps.resolveFormatProfileContext,
            activateFormatProfileContext: safeDeps.activateFormatProfileContext
        });
        const mainTabServices = createMainTabServices(mainTabServicesConfig);
        const formatControlsService = mainTabServices.formatControlsService;
        const tabUiService = mainTabServices.tabUiService;
        const tabOrchestratorService = mainTabServices.tabOrchestratorService;

        const mainGroupStateServicesConfig = buildMainGroupStateServicesConfig({
            GTV_MULTI_STATE: safeDeps.GTV_MULTI_STATE,
            serviceBootstrap: safeDeps.serviceBootstrap,
            MIN_MULTI_RANGE_COUNT: safeDeps.MIN_MULTI_RANGE_COUNT,
            gtvT: safeDeps.gtvT,
            getGroupsStateSnapshot: safeDeps.getGroupsStateSnapshot,
            getDefaultMultiRangeBounds: safeDeps.getDefaultMultiRangeBounds,
            sanitizeMultiRangeCount: safeDeps.sanitizeMultiRangeCount,
            sanitizeMultiRangeItem: safeDeps.sanitizeMultiRangeItem,
            sanitizeUtcMsViaTimeCore: safeDeps.sanitizeUtcMsViaTimeCore,
            sanitizeTimezoneId: safeDeps.sanitizeTimezoneId,
            createUniqueTimezoneId: safeDeps.createUniqueTimezoneId,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            normalizeZoneAbbreviationViaSearch: safeDeps.normalizeZoneAbbreviationViaSearch,
            sanitizeBaseTimezoneId: safeDeps.sanitizeBaseTimezoneId,
            sanitizeUtcRowOrderViaTimeCore: safeDeps.sanitizeUtcRowOrderViaTimeCore,
            sanitizeFixedTimes: safeDeps.sanitizeFixedTimes,
            sanitizeFixedDateValue: safeDeps.sanitizeFixedDateValue,
            sanitizeFixedTimeShowLiveNow: safeDeps.sanitizeFixedTimeShowLiveNow
        });
        const mainGroupStateServices = createMainGroupStateServices(mainGroupStateServicesConfig);
        const multiStateService = mainGroupStateServices.multiStateService;
        const groupStateService = mainGroupStateServices.groupStateService;

        const mainImageExportNamingProxyConfig = buildMainImageExportNamingProxyConfig({
            getImageExportNamingServiceRef: safeDeps.getImageExportNamingServiceRef,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            pad: safeDeps.pad,
            timeService: safeDeps.timeService,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getGroupsStateSnapshot: safeDeps.getGroupsStateSnapshot,
            getPatchedActiveGroupIdState: safeDeps.getPatchedActiveGroupIdState,
            gtvT: safeDeps.gtvT,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getBaseTimeSnapshot: safeDeps.getBaseTimeSnapshot,
            sanitizeMultiSubgroupNameForExport: safeDeps.sanitizeMultiSubgroupNameForExport,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName
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
            GTV_IMAGE_EXPORT_NAMING: safeDeps.GTV_IMAGE_EXPORT_NAMING,
            GTV_IMAGE_EXPORT_ACTIONS: safeDeps.GTV_IMAGE_EXPORT_ACTIONS,
            GTV_IMAGE_EXPORT: safeDeps.GTV_IMAGE_EXPORT,
            gtvT: safeDeps.gtvT,
            pad: safeDeps.pad,
            timeService: safeDeps.timeService,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getBaseTimeSnapshot: safeDeps.getBaseTimeSnapshot,
            getActiveGroupNameSnapshot: safeDeps.getActiveGroupNameSnapshot,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            sanitizeMultiSubgroupNameForExport: safeDeps.sanitizeMultiSubgroupNameForExport,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getShowToastRef: safeDeps.getShowToastRef,
            isMultiTab: safeDeps.isMultiTab,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            detectForeignObjectRendererSupport: safeDeps.detectForeignObjectRendererSupport,
            renderTimezoneTableToPngDataUrl: safeDeps.renderTimezoneTableToPngDataUrl,
            renderTimezoneTableFallbackDataUrl: safeDeps.renderTimezoneTableFallbackDataUrl,
            renderMultiRangesToPngDataUrl: safeDeps.renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl: safeDeps.renderMultiRangeSingleToPngDataUrl,
            renderMultiRangesFallbackDataUrl: safeDeps.renderMultiRangesFallbackDataUrl,
            renderMultiRangeTitlesToPngDataUrl: safeDeps.renderMultiRangeTitlesToPngDataUrl,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            isDomExceptionLike: safeDeps.isDomExceptionLike,
            setCanUseForeignObjectRenderer: safeDeps.setCanUseForeignObjectRenderer
        });
        const mainImageExportServices = createMainImageExportServices(mainImageExportServicesConfig);
        const imageExportNamingService = mainImageExportServices.imageExportNamingService;
        const imageExportActionsService = mainImageExportServices.imageExportActionsService;

        const mainAppStateServicesConfig = buildMainAppStateServicesConfig({
            GTV_APP_STATE_PATCHER: safeDeps.GTV_APP_STATE_PATCHER,
            GTV_APP_PERSISTENCE_STATE: safeDeps.GTV_APP_PERSISTENCE_STATE,
            getMainAppStateSource: safeDeps.getMainAppStateSource,
            directStateSetters: safeDeps.directStateSetters,
            setIsRealtimeState: safeDeps.setIsRealtimeState,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            ensureFormatProfiles: safeDeps.ensureFormatProfiles,
            getCurrentFormatProfileState: safeDeps.getCurrentFormatProfileState,
            resolveFormatProfileContext: safeDeps.resolveFormatProfileContext,
            applyFormatProfileState: safeDeps.applyFormatProfileState
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
