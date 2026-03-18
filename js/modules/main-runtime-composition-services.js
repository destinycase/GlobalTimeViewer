(function initGtvMainRuntimeCompositionServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const mainUiRuntimeApi = requireCreateServiceModule(
            safeDeps.GTV_MAIN_UI_RUNTIME_SERVICES,
            "GTVMainUiRuntimeServices"
        );
        const mainClockOrchestratorApi = requireCreateServiceModule(
            safeDeps.GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
            "GTVMainClockOrchestratorServices"
        );

        const moduleDeps = (safeDeps.moduleDeps && typeof safeDeps.moduleDeps === "object")
            ? safeDeps.moduleDeps
            : {};
        const timelineConfig = (safeDeps.timelineConfig && typeof safeDeps.timelineConfig === "object")
            ? safeDeps.timelineConfig
            : {};
        const state = (safeDeps.state && typeof safeDeps.state === "object")
            ? safeDeps.state
            : {};
        const actions = (safeDeps.actions && typeof safeDeps.actions === "object")
            ? safeDeps.actions
            : {};
        const services = (safeDeps.services && typeof safeDeps.services === "object")
            ? safeDeps.services
            : {};
        const environment = (safeDeps.environment && typeof safeDeps.environment === "object")
            ? safeDeps.environment
            : {};

        function getService(name) {
            const getter = services[name];
            if (typeof getter !== "function") return null;
            const value = getter();
            return (value && typeof value === "object") ? value : null;
        }

        const mainUiRuntimeServices = mainUiRuntimeApi.createService({
            GTV_TIMELINE_FRAME: moduleDeps.GTV_TIMELINE_FRAME,
            GTV_FIXED_TIME_TABLE: moduleDeps.GTV_FIXED_TIME_TABLE,
            GTV_MAIN_UI_INIT: moduleDeps.GTV_MAIN_UI_INIT,
            TIMELINE_TOTAL_HOURS: timelineConfig.TIMELINE_TOTAL_HOURS,
            TIMELINE_TOTAL_SECONDS: timelineConfig.TIMELINE_TOTAL_SECONDS,
            requestUiFrame: timelineConfig.requestUiFrame,
            cancelUiFrame: timelineConfig.cancelUiFrame,
            t: actions.t,
            getCurrentMainTab: state.getCurrentMainTab,
            isMultiTab: actions.isMultiTab,
            isFixedTimeTab: actions.isFixedTimeTab,
            getIsRealtime: state.getIsRealtime,
            getSlotCount: state.getSlotCount,
            getGlobalTime: state.getGlobalTime,
            setGlobalTime: state.setGlobalTime,
            getBaseTimezoneRef: actions.getBaseTimezoneRef,
            getCurrentGroupZones: actions.getCurrentGroupZones,
            isCurrentGroupUtcRowVisible: actions.isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder: actions.getCurrentGroupUtcRowOrder,
            getUTCRef: actions.getUTCRef,
            resolveFixedTimeTimelineSourceDate: actions.resolveFixedTimeTimelineSourceDate,
            applyFixedTimeSlotTimelineRatio: actions.applyFixedTimeSlotTimelineRatio,
            getFixedTimeTimelineSlots: actions.getFixedTimeTimelineSlots,
            getFixedTimeTimelineSlotCount: actions.getFixedTimeTimelineSlotCount,
            getFixedTimeTimelineIndicatorToken: actions.getFixedTimeTimelineIndicatorToken,
            getFixedTimeSlotTimelineLabel: actions.getFixedTimeSlotTimelineLabel,
            getZoneDisplayName: actions.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: actions.getZoneDisplayNameForUiAtDate,
            getFixedOffsetForDisplayAtDate: actions.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: actions.getLocalPartsByTimezone,
            getUTCDateFromLocalParts: actions.getUTCDateFromLocalParts,
            clampNumber: actions.clampNumber,
            pad: actions.pad,
            getCurrentLang: state.getCurrentLang,
            getCurrentTheme: state.getCurrentTheme,
            updateClocks: actions.updateClocks,
            savePersistence: () => {
                const persistenceService = getService("getPersistenceService");
                if (persistenceService && typeof persistenceService.savePersistence === "function") {
                    persistenceService.savePersistence();
                }
            },
            getTimelineFrameElement: () => {
                const documentRef = (typeof environment.getDocumentRef === "function")
                    ? environment.getDocumentRef()
                    : null;
                if (!documentRef || typeof documentRef.getElementById !== "function") return null;
                return documentRef.getElementById("timeline-frame");
            },
            getCurrentGroup: actions.getCurrentGroup,
            ensureGroupFixedTimes: actions.ensureGroupFixedTimes,
            getFixedTimeDisplayPartsEnabled: actions.getFixedTimeDisplayPartsEnabled,
            getDisplayFormatOrder: actions.getDisplayFormatOrder,
            getDisplayFormatEnabled: actions.getDisplayFormatEnabled,
            sanitizeCopyFormatOrderForContext: actions.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: actions.sanitizeCopyFormatEnabledForContext,
            getRenderableTimezoneRows: (baseRef) => {
                const tableRenderService = getService("getTableRenderService");
                if (!tableRenderService || typeof tableRenderService.getRenderableTimezoneRows !== "function") {
                    return [];
                }
                return tableRenderService.getRenderableTimezoneRows(baseRef);
            },
            resolveFixedTimeSlotUtcDate: actions.resolveFixedTimeSlotUtcDate,
            getFixedTimeTimelineIndicatorColor: actions.getFixedTimeTimelineIndicatorColor,
            getFixedTimeSlotHeaderLabel: actions.getFixedTimeSlotHeaderLabel,
            renameFixedTimeSlot: actions.renameFixedTimeSlot,
            copyFixedTimeSlotColumn: actions.copyFixedTimeSlotColumn,
            getZoneAbbreviation: actions.getZoneAbbreviation,
            formatUtcOffsetLabel: actions.formatUtcOffsetLabel,
            getCustomOffsetMinutes: actions.getCustomOffsetMinutes,
            getTimezoneOffset: actions.getTimezoneOffset,
            buildFixedTimeDisplayPayloadAtUtc: actions.buildFixedTimeDisplayPayloadAtUtc,
            bindCustomDatePickerForInput: actions.bindCustomDatePickerForInput,
            buildFixedTimeCellInputValue: actions.buildFixedTimeCellInputValue,
            applyFixedTimeSlotByTimezoneInput: actions.applyFixedTimeSlotByTimezoneInput,
            copyFixedTimeCellByTimezone: actions.copyFixedTimeCellByTimezone,
            upgradeNativeTitleTooltips: actions.upgradeNativeTitleTooltips,
            switchMainTab: actions.switchMainTab,
            populateUiScaleSelect: actions.populateUiScaleSelect,
            getUiScale: state.getUiScale,
            applyUiScale: actions.applyUiScale,
            getMultiRangeCount: state.getMultiRangeCount,
            setMultiRangeCount: actions.setMultiRangeCount,
            refreshMultiRangeControls: actions.refreshMultiRangeControls,
            getFixedTimeSlotCountForCurrentGroup: actions.getFixedTimeSlotCountForCurrentGroup,
            setFixedTimeSlotCount: actions.setFixedTimeSlotCount,
            refreshFixedTimeSlotCountControls: actions.refreshFixedTimeSlotCountControls,
            setCurrentGroupFixedDate: actions.setCurrentGroupFixedDate,
            sanitizeFixedDateValue: actions.sanitizeFixedDateValue,
            showToast: actions.showToast,
            normalizeCustomAbbr: actions.normalizeCustomAbbr,
            addTimezone: actions.addTimezone,
            createUniqueTimezoneId: actions.createUniqueTimezoneId,
            syncActiveFormatProfileFromState: actions.syncActiveFormatProfileFromState,
            getSlotCountState: state.getSlotCountState,
            setSlotCount: state.setSlotCount,
            activateFormatProfileForCurrentContext: actions.activateFormatProfileForCurrentContext,
            renderList: actions.renderList,
            renderCopyFormatControls: () => {
                const formatControlsService = getService("getFormatControlsService");
                if (formatControlsService && typeof formatControlsService.renderCopyFormatControls === "function") {
                    formatControlsService.renderCopyFormatControls();
                }
            },
            updateCopyFormatPreview: actions.updateCopyFormatPreview,
            getShowCopyFormat: state.getShowCopyFormat,
            setShowCopyFormat: state.setShowCopyFormat,
            getShowTimeline: state.getShowTimeline,
            setShowTimeline: state.setShowTimeline,
            renderTimelineFrame: actions.renderTimelineFrame,
            resetDisplayFormatForActiveContext: actions.resetDisplayFormatForActiveContext,
            resetCopyFormatForActiveContext: actions.resetCopyFormatForActiveContext,
            applyCurrentGroupBaseTimezoneId: actions.applyCurrentGroupBaseTimezoneId,
            addGroup: () => {
                const groupTabsService = getService("getGroupTabsService");
                if (groupTabsService && typeof groupTabsService.addGroup === "function") {
                    groupTabsService.addGroup();
                }
            },
            addMultiSubgroup: () => {
                const groupTabsService = getService("getGroupTabsService");
                if (groupTabsService && typeof groupTabsService.addMultiSubgroup === "function") {
                    groupTabsService.addMultiSubgroup();
                }
            },
            copyAllTimezones: actions.copyAllTimezones,
            saveTimezoneTableImage: actions.saveTimezoneTableImage,
            saveMultiRangeTitlesImage: actions.saveMultiRangeTitlesImage,
            getUiSettingsActionsService: services.getUiSettingsActionsService,
            getCurrentThemeState: state.getCurrentTheme,
            applyTheme: actions.applyTheme,
            refreshCalculator: () => {
                const windowRef = (typeof environment.getWindowRef === "function")
                    ? environment.getWindowRef()
                    : null;
                if (windowRef && typeof windowRef.__gtvCalcRefresh === "function") {
                    windowRef.__gtvCalcRefresh();
                }
            },
            getCurrentLangState: state.getCurrentLang,
            hideFloatingTooltip: actions.hideFloatingTooltip,
            setLanguage: (lang) => {
                const globalThisRef = (typeof environment.getGlobalThisRef === "function")
                    ? environment.getGlobalThisRef()
                    : null;
                const languageFn = (globalThisRef && typeof globalThisRef.setLanguage === "function")
                    ? globalThisRef.setLanguage
                    : null;
                if (languageFn) languageFn(lang);
            },
            localizeAutoGeneratedNamesForCurrentLanguage: actions.localizeAutoGeneratedNamesForCurrentLanguage,
            applyVersionBranding: actions.applyVersionBranding,
            updateTZDropdown: () => {
                const timezoneSearchService = getService("getTimezoneSearchService");
                if (timezoneSearchService && typeof timezoneSearchService.updateTZDropdown === "function") {
                    timezoneSearchService.updateTZDropdown();
                }
            },
            renderGroups: () => {
                const groupTabsService = getService("getGroupTabsService");
                if (groupTabsService && typeof groupTabsService.renderGroups === "function") {
                    groupTabsService.renderGroups();
                }
            },
            renderMultiSubgroups: () => {
                const groupTabsService = getService("getGroupTabsService");
                if (groupTabsService && typeof groupTabsService.renderMultiSubgroups === "function") {
                    groupTabsService.renderMultiSubgroups();
                }
            },
            updateTimeAdjustPanel: () => {
                const timeAdjustUiService = getService("getTimeAdjustUiService");
                if (timeAdjustUiService && typeof timeAdjustUiService.updateTimeAdjustPanel === "function") {
                    timeAdjustUiService.updateTimeAdjustPanel();
                }
            },
            refreshSelectWidths: actions.refreshSelectWidths,
            renderBaseTimeSelect: actions.renderBaseTimeSelect,
            updateOptionRowVisibility: () => {
                const tabUiService = getService("getTabUiService");
                if (tabUiService && typeof tabUiService.updateOptionRowVisibility === "function") {
                    tabUiService.updateOptionRowVisibility();
                }
            }
        });

        const mainClockOrchestratorService = mainClockOrchestratorApi.createService({
            isFixedTimeTab: actions.isFixedTimeTab,
            renderFixedTimeTab: actions.renderFixedTimeTab,
            renderTimelineFrame: actions.renderTimelineFrame,
            isMultiTab: actions.isMultiTab,
            renderMultiRanges: () => {
                const multiRangeRenderService = getService("getMultiRangeRenderService");
                if (multiRangeRenderService && typeof multiRangeRenderService.renderMultiRanges === "function") {
                    multiRangeRenderService.renderMultiRanges();
                }
            },
            getBaseTimezoneRef: actions.getBaseTimezoneRef,
            getUTCRef: actions.getUTCRef,
            updateRow: actions.updateRow,
            getCurrentGroupZones: actions.getCurrentGroupZones,
            isShowCopyFormat: state.getShowCopyFormat,
            updateCopyFormatPreview: actions.updateCopyFormatPreview
        });

        return Object.freeze({
            mainUiRuntimeServices,
            timelineFrameService: mainUiRuntimeServices?.timelineFrameService ?? null,
            fixedTimeTableService: mainUiRuntimeServices?.fixedTimeTableService ?? null,
            mainUiInitService: mainUiRuntimeServices?.mainUiInitService ?? null,
            mainClockOrchestratorService
        });
    }

    globalObj.GTVMainRuntimeCompositionServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
