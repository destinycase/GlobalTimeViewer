(function initGtvMainRuntimeCompositionBootstrap(globalObj) {
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
        const mainCompositionConfigBuilderService = requireObject(
            safeDeps.mainCompositionConfigBuilderService,
            "mainCompositionConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildRuntimeCompositionConfig = requireFunction(
            mainCompositionConfigBuilderService.buildRuntimeCompositionConfig,
            "mainCompositionConfigBuilderService.buildRuntimeCompositionConfig"
        );
        const createMainRuntimeCompositionServices = requireFunction(
            mainCoreServices.createMainRuntimeCompositionServices,
            "mainCoreServices.createMainRuntimeCompositionServices"
        );

        const mainRuntimeCompositionConfig = buildRuntimeCompositionConfig({
            GTV_MAIN_UI_RUNTIME_SERVICES: safeDeps.GTV_MAIN_UI_RUNTIME_SERVICES,
            GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES: safeDeps.GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
            GTV_TIMELINE_FRAME: safeDeps.GTV_TIMELINE_FRAME,
            GTV_FIXED_TIME_TABLE: safeDeps.GTV_FIXED_TIME_TABLE,
            GTV_MAIN_UI_INIT: safeDeps.GTV_MAIN_UI_INIT,
            TIMELINE_TOTAL_HOURS: safeDeps.TIMELINE_TOTAL_HOURS,
            TIMELINE_TOTAL_SECONDS: safeDeps.TIMELINE_TOTAL_SECONDS,
            requestUiFrame: safeDeps.requestUiFrame,
            cancelUiFrame: safeDeps.cancelUiFrame,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            setGlobalTimeState: safeDeps.setGlobalTimeState,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            getPatchedCurrentThemeState: safeDeps.getPatchedCurrentThemeState,
            getUiScaleState: safeDeps.getUiScaleState,
            getPatchedDayStartHourState: safeDeps.getPatchedDayStartHourState,
            getPatchedNightStartHourState: safeDeps.getPatchedNightStartHourState,
            getPatchedMultiRangeCountState: safeDeps.getPatchedMultiRangeCountState,
            getPatchedShowCopyFormatState: safeDeps.getPatchedShowCopyFormatState,
            setPatchedShowCopyFormatState: safeDeps.setPatchedShowCopyFormatState,
            getPatchedShowTimelineState: safeDeps.getPatchedShowTimelineState,
            setPatchedShowTimelineState: safeDeps.setPatchedShowTimelineState,
            setPatchedSlotCountState: safeDeps.setPatchedSlotCountState,
            getPersistenceServiceRef: safeDeps.getPersistenceServiceRef,
            getTableRenderServiceRef: safeDeps.getTableRenderServiceRef,
            getFormatControlsServiceRef: safeDeps.getFormatControlsServiceRef,
            getGroupTabsServiceRef: safeDeps.getGroupTabsServiceRef,
            getMultiRangeRenderServiceRef: safeDeps.getMultiRangeRenderServiceRef,
            getTimezoneSearchServiceRef: safeDeps.getTimezoneSearchServiceRef,
            getTimeAdjustUiServiceRef: safeDeps.getTimeAdjustUiServiceRef,
            getTabUiServiceRef: safeDeps.getTabUiServiceRef,
            getUiSettingsActionsServiceRef: safeDeps.getUiSettingsActionsServiceRef,
            t: safeDeps.gtvT,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getCurrentGroupZones: safeDeps.getCurrentGroupZones,
            isCurrentGroupUtcRowVisible: safeDeps.isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder: safeDeps.getCurrentGroupUtcRowOrder,
            getUTCRef: safeDeps.getUTCRef,
            resolveFixedTimeTimelineSourceDate: safeDeps.resolveFixedTimeTimelineSourceDate,
            applyFixedTimeSlotTimelineRatio: safeDeps.applyFixedTimeSlotTimelineRatio,
            getFixedTimeTimelineSlots: safeDeps.getFixedTimeTimelineSlots,
            getFixedTimeTimelineSlotCount: safeDeps.getFixedTimeTimelineSlotCount,
            getFixedTimeTimelineIndicatorToken: safeDeps.getFixedTimeTimelineIndicatorToken,
            getFixedTimeSlotTimelineLabel: safeDeps.getFixedTimeSlotTimelineLabel,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: safeDeps.getLocalPartsByTimezone,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getUTCDateFromLocalParts: safeDeps.getUTCDateFromLocalParts,
            clampNumber: safeDeps.clampNumber,
            pad: safeDeps.pad,
            getUpdateClocksRef: safeDeps.getUpdateClocksRef,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            getFixedTimeDisplayPartsEnabled: safeDeps.getFixedTimeDisplayPartsEnabled,
            getPatchedDisplayFormatOrderState: safeDeps.getPatchedDisplayFormatOrderState,
            getPatchedDisplayFormatEnabledState: safeDeps.getPatchedDisplayFormatEnabledState,
            sanitizeCopyFormatOrderForContext: safeDeps.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: safeDeps.sanitizeCopyFormatEnabledForContext,
            resolveFixedTimeSlotUtcDate: safeDeps.resolveFixedTimeSlotUtcDate,
            getFixedTimeTimelineIndicatorColor: safeDeps.getFixedTimeTimelineIndicatorColor,
            getFixedTimeSlotHeaderLabel: safeDeps.getFixedTimeSlotHeaderLabel,
            renameFixedTimeSlot: safeDeps.renameFixedTimeSlot,
            copyFixedTimeSlotColumn: safeDeps.copyFixedTimeSlotColumn,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            formatUtcOffsetLabel: safeDeps.formatUtcOffsetLabel,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getTimezoneOffset: safeDeps.getTimezoneOffset,
            buildFixedTimeDisplayPayloadAtUtc: safeDeps.buildFixedTimeDisplayPayloadAtUtc,
            bindCustomDatePickerForInput: safeDeps.bindCustomDatePickerForInput,
            buildFixedTimeCellInputValue: safeDeps.buildFixedTimeCellInputValue,
            applyFixedTimeSlotByTimezoneInput: safeDeps.applyFixedTimeSlotByTimezoneInput,
            copyFixedTimeCellByTimezone: safeDeps.copyFixedTimeCellByTimezone,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            switchMainTab: safeDeps.switchMainTab,
            populateUiScaleSelect: safeDeps.populateUiScaleSelect,
            populateDayNightHourSelect: safeDeps.populateDayNightHourSelect,
            applyUiScale: safeDeps.applyUiScale,
            setDayNightRange: safeDeps.setDayNightRange,
            setMultiRangeCount: safeDeps.setMultiRangeCount,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            getFixedTimeSlotCountForCurrentGroup: safeDeps.getFixedTimeSlotCountForCurrentGroup,
            setFixedTimeSlotCount: safeDeps.setFixedTimeSlotCount,
            refreshFixedTimeSlotCountControls: safeDeps.refreshFixedTimeSlotCountControls,
            setCurrentGroupFixedDate: safeDeps.setCurrentGroupFixedDate,
            getCurrentGroupFixedTimeShowLiveNow: safeDeps.getCurrentGroupFixedTimeShowLiveNow,
            setCurrentGroupFixedTimeShowLiveNow: safeDeps.setCurrentGroupFixedTimeShowLiveNow,
            sanitizeFixedDateValue: safeDeps.sanitizeFixedDateValue,
            getShowToastRef: safeDeps.getShowToastRef,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            addTimezone: safeDeps.addTimezone,
            createUniqueTimezoneId: safeDeps.createUniqueTimezoneId,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            activateFormatProfileForCurrentContext: safeDeps.activateFormatProfileForCurrentContext,
            getRenderListRef: safeDeps.getRenderListRef,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            getRenderTimelineFrameRef: safeDeps.getRenderTimelineFrameRef,
            resetDisplayFormatForActiveContext: safeDeps.resetDisplayFormatForActiveContext,
            resetCopyFormatForActiveContext: safeDeps.resetCopyFormatForActiveContext,
            applyCurrentGroupBaseTimezoneId: safeDeps.applyCurrentGroupBaseTimezoneId,
            copyAllTimezones: safeDeps.copyAllTimezones,
            saveTimezoneTableImage: safeDeps.saveTimezoneTableImage,
            saveMultiRangeTitlesImage: safeDeps.saveMultiRangeTitlesImage,
            applyTheme: safeDeps.applyTheme,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            localizeAutoGeneratedNamesForCurrentLanguage: safeDeps.localizeAutoGeneratedNamesForCurrentLanguage,
            applyVersionBranding: safeDeps.applyVersionBranding,
            refreshSelectWidths: safeDeps.refreshSelectWidths,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            updateRow: safeDeps.updateRow,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            getWindowRefOrNull: safeDeps.getWindowRefOrNull,
            getGlobalThisRefOrNull: safeDeps.getGlobalThisRefOrNull
        });
        const mainRuntimeCompositionServices = createMainRuntimeCompositionServices(
            mainRuntimeCompositionConfig
        );

        return Object.freeze({
            timelineFrameService: mainRuntimeCompositionServices.timelineFrameService,
            fixedTimeTableService: mainRuntimeCompositionServices.fixedTimeTableService,
            mainUiInitService: mainRuntimeCompositionServices.mainUiInitService,
            mainClockOrchestratorService: mainRuntimeCompositionServices.mainClockOrchestratorService
        });
    }

    globalObj.GTVMainRuntimeCompositionBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
