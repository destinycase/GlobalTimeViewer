(function initGtvMainUiRuntimeServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const timelineFrameApi = requireCreateServiceModule(safeDeps.GTV_TIMELINE_FRAME, "GTVTimelineFrame");
        const fixedTimeTableApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_TABLE, "GTVFixedTimeTable");
        const mainUiInitApi = requireCreateServiceModule(safeDeps.GTV_MAIN_UI_INIT, "GTVMainUiInit");

        const timelineFrameService = timelineFrameApi.createService({
            TIMELINE_TOTAL_HOURS: safeDeps.TIMELINE_TOTAL_HOURS,
            TIMELINE_TOTAL_SECONDS: safeDeps.TIMELINE_TOTAL_SECONDS,
            requestUiFrame: safeDeps.requestUiFrame,
            cancelUiFrame: safeDeps.cancelUiFrame,
            t: safeDeps.t,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            getShowTimeline: safeDeps.getShowTimeline,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getIsRealtime: safeDeps.getIsRealtime,
            getSlotCount: safeDeps.getSlotCount,
            getGlobalTime: safeDeps.getGlobalTime,
            setGlobalTime: safeDeps.setGlobalTime,
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
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: safeDeps.getLocalPartsByTimezone,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getUTCDateFromLocalParts: safeDeps.getUTCDateFromLocalParts,
            clampNumber: safeDeps.clampNumber,
            pad: safeDeps.pad,
            getCurrentLang: safeDeps.getCurrentLang,
            getCurrentTheme: safeDeps.getCurrentTheme,
            updateClocks: safeDeps.updateClocks,
            savePersistence: safeDeps.savePersistence,
            getTimelineFrameElement: safeDeps.getTimelineFrameElement
        });

        const fixedTimeTableService = fixedTimeTableApi.createService({
            t: safeDeps.t,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            getFixedTimeDisplayPartsEnabled: safeDeps.getFixedTimeDisplayPartsEnabled,
            getDisplayFormatOrder: safeDeps.getDisplayFormatOrder,
            getDisplayFormatEnabled: safeDeps.getDisplayFormatEnabled,
            sanitizeCopyFormatOrderForContext: safeDeps.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: safeDeps.sanitizeCopyFormatEnabledForContext,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getRenderableTimezoneRows: safeDeps.getRenderableTimezoneRows,
            getGlobalTime: safeDeps.getGlobalTime,
            resolveFixedTimeSlotUtcDate: safeDeps.resolveFixedTimeSlotUtcDate,
            getFixedTimeTimelineIndicatorColor: safeDeps.getFixedTimeTimelineIndicatorColor,
            getFixedTimeSlotHeaderLabel: safeDeps.getFixedTimeSlotHeaderLabel,
            renameFixedTimeSlot: safeDeps.renameFixedTimeSlot,
            copyFixedTimeSlotColumn: safeDeps.copyFixedTimeSlotColumn,
            updateClocks: safeDeps.updateClocks,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            formatUtcOffsetLabel: safeDeps.formatUtcOffsetLabel,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getTimezoneOffset: safeDeps.getTimezoneOffset,
            buildFixedTimeDisplayPayloadAtUtc: safeDeps.buildFixedTimeDisplayPayloadAtUtc,
            bindCustomDatePickerForInput: safeDeps.bindCustomDatePickerForInput,
            buildFixedTimeCellInputValue: safeDeps.buildFixedTimeCellInputValue,
            applyFixedTimeSlotByTimezoneInput: safeDeps.applyFixedTimeSlotByTimezoneInput,
            copyFixedTimeCellByTimezone: safeDeps.copyFixedTimeCellByTimezone,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips
        });

        const getUiSettingsActionsService = (typeof safeDeps.getUiSettingsActionsService === "function")
            ? safeDeps.getUiSettingsActionsService
            : (() => null);
        const mainUiInitService = mainUiInitApi.createService({
            t: safeDeps.t,
            switchMainTab: safeDeps.switchMainTab,
            populateUiScaleSelect: safeDeps.populateUiScaleSelect,
            populateDayNightHourSelect: safeDeps.populateDayNightHourSelect,
            getUiScale: safeDeps.getUiScale,
            getDayStartHour: safeDeps.getDayStartHour,
            getNightStartHour: safeDeps.getNightStartHour,
            setDayNightRange: safeDeps.setDayNightRange,
            applyUiScale: safeDeps.applyUiScale,
            getMultiRangeCount: safeDeps.getMultiRangeCount,
            setMultiRangeCount: safeDeps.setMultiRangeCount,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            getFixedTimeSlotCountForCurrentGroup: safeDeps.getFixedTimeSlotCountForCurrentGroup,
            setFixedTimeSlotCount: safeDeps.setFixedTimeSlotCount,
            refreshFixedTimeSlotCountControls: safeDeps.refreshFixedTimeSlotCountControls,
            bindCustomDatePickerForInput: safeDeps.bindCustomDatePickerForInput,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            setCurrentGroupFixedDate: safeDeps.setCurrentGroupFixedDate,
            getCurrentGroupFixedTimeShowLiveNow: safeDeps.getCurrentGroupFixedTimeShowLiveNow,
            setCurrentGroupFixedTimeShowLiveNow: safeDeps.setCurrentGroupFixedTimeShowLiveNow,
            sanitizeFixedDateValue: safeDeps.sanitizeFixedDateValue,
            showToast: safeDeps.showToast,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            addTimezone: safeDeps.addTimezone,
            createUniqueTimezoneId: safeDeps.createUniqueTimezoneId,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            getSlotCount: safeDeps.getSlotCountState,
            setSlotCount: safeDeps.setSlotCount,
            activateFormatProfileForCurrentContext: safeDeps.activateFormatProfileForCurrentContext,
            renderList: safeDeps.renderList,
            renderCopyFormatControls: safeDeps.renderCopyFormatControls,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            savePersistence: safeDeps.savePersistence,
            getShowCopyFormat: safeDeps.getShowCopyFormat,
            setShowCopyFormat: safeDeps.setShowCopyFormat,
            getShowTimeline: safeDeps.getShowTimeline,
            setShowTimeline: safeDeps.setShowTimeline,
            renderTimelineFrame: safeDeps.renderTimelineFrame,
            resetDisplayFormatForActiveContext: safeDeps.resetDisplayFormatForActiveContext,
            resetCopyFormatForActiveContext: safeDeps.resetCopyFormatForActiveContext,
            applyCurrentGroupBaseTimezoneId: safeDeps.applyCurrentGroupBaseTimezoneId,
            addGroup: safeDeps.addGroup,
            addMultiSubgroup: safeDeps.addMultiSubgroup,
            copyAllTimezones: safeDeps.copyAllTimezones,
            saveTimezoneTableImage: safeDeps.saveTimezoneTableImage,
            saveMultiRangeTitlesImage: safeDeps.saveMultiRangeTitlesImage,
            bindTransferControls: () => {
                const uiSettingsActionsService = getUiSettingsActionsService();
                if (!uiSettingsActionsService || typeof uiSettingsActionsService.bindTransferControls !== "function") return;
                uiSettingsActionsService.bindTransferControls();
            },
            getCurrentTheme: safeDeps.getCurrentThemeState,
            applyTheme: safeDeps.applyTheme,
            refreshCalculator: safeDeps.refreshCalculator,
            getCurrentLang: safeDeps.getCurrentLangState,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            setLanguage: safeDeps.setLanguage,
            localizeAutoGeneratedNamesForCurrentLanguage: safeDeps.localizeAutoGeneratedNamesForCurrentLanguage,
            applyVersionBranding: safeDeps.applyVersionBranding,
            updateTZDropdown: safeDeps.updateTZDropdown,
            renderGroups: safeDeps.renderGroups,
            renderMultiSubgroups: safeDeps.renderMultiSubgroups,
            updateTimeAdjustPanel: safeDeps.updateTimeAdjustPanel,
            refreshSelectWidths: safeDeps.refreshSelectWidths,
            bindResetControls: () => {
                const uiSettingsActionsService = getUiSettingsActionsService();
                if (!uiSettingsActionsService || typeof uiSettingsActionsService.bindResetControls !== "function") return;
                uiSettingsActionsService.bindResetControls();
            },
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            updateOptionRowVisibility: safeDeps.updateOptionRowVisibility,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips
        });

        return Object.freeze({
            timelineFrameService,
            fixedTimeTableService,
            mainUiInitService
        });
    }

    globalObj.GTVMainUiRuntimeServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
