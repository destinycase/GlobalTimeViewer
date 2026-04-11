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

        const timelineFrameApi = requireCreateServiceModule(safeDeps.GTV_TIMELINE_FRAME, "GTVTimelineFrame");
        const fixedTimeTableApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_TABLE, "GTVFixedTimeTable");
        const mainUiInitApi = requireCreateServiceModule(safeDeps.GTV_MAIN_UI_INIT, "GTVMainUiInit");

        const timelineFrameService = timelineFrameApi.createService({
            ...pickDeps([
                "TIMELINE_TOTAL_HOURS",
                "TIMELINE_TOTAL_SECONDS",
                "requestUiFrame",
                "cancelUiFrame",
                "t",
                "getCurrentMainTab",
                "getShowTimeline",
                "isMultiTab",
                "isFixedTimeTab",
                "getIsRealtime",
                "getSlotCount",
                "getGlobalTime",
                "setGlobalTime",
                "getBaseTimezoneRef",
                "getCurrentGroupZones",
                "isCurrentGroupUtcRowVisible",
                "getCurrentGroupUtcRowOrder",
                "getUTCRef",
                "resolveFixedTimeTimelineSourceDate",
                "applyFixedTimeSlotTimelineRatio",
                "getFixedTimeTimelineSlots",
                "getFixedTimeTimelineSlotCount",
                "getFixedTimeTimelineIndicatorToken",
                "getCurrentGroupFixedTimeShowLiveNow",
                "getFixedTimeSlotTimelineLabel",
                "getZoneDisplayName",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getDayNightMarkerByHour",
                "getUTCDateFromLocalParts",
                "clampNumber",
                "pad",
                "getCurrentLang",
                "getCurrentTheme",
                "updateClocks",
                "savePersistence",
                "getTimelineFrameElement"
            ])
        });

        const fixedTimeTableService = fixedTimeTableApi.createService({
            ...pickDeps([
                "t",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getFixedTimeDisplayPartsEnabled",
                "getDisplayFormatOrder",
                "getDisplayFormatEnabled",
                "sanitizeCopyFormatOrderForContext",
                "sanitizeCopyFormatEnabledForContext",
                "getBaseTimezoneRef",
                "getRenderableTimezoneRows",
                "getGlobalTime",
                "resolveFixedTimeSlotUtcDate",
                "getFixedTimeTimelineIndicatorColor",
                "getFixedTimeSlotHeaderLabel",
                "renameFixedTimeSlot",
                "copyFixedTimeSlotColumn",
                "updateClocks",
                "getZoneAbbreviation",
                "getZoneDisplayName",
                "getZoneDisplayNameForUiAtDate",
                "formatUtcOffsetLabel",
                "getCustomOffsetMinutes",
                "getFixedOffsetForDisplayAtDate",
                "getTimezoneOffset",
                "buildFixedTimeDisplayPayloadAtUtc",
                "bindCustomDatePickerForInput",
                "buildFixedTimeCellInputValue",
                "applyFixedTimeSlotByTimezoneInput",
                "copyFixedTimeCellByTimezone",
                "upgradeNativeTitleTooltips"
            ])
        });

        const getUiSettingsActionsService = (typeof safeDeps.getUiSettingsActionsService === "function")
            ? safeDeps.getUiSettingsActionsService
            : (() => null);
        const mainUiInitService = mainUiInitApi.createService({
            ...pickDeps([
                "t",
                "switchMainTab",
                "populateUiScaleSelect",
                "populateDayNightHourSelect",
                "getUiScale",
                "getDayStartHour",
                "getNightStartHour",
                "setDayNightRange",
                "applyUiScale",
                "getMultiRangeCount",
                "setMultiRangeCount",
                "refreshMultiRangeControls",
                "getFixedTimeSlotCountForCurrentGroup",
                "setFixedTimeSlotCount",
                "refreshFixedTimeSlotCountControls",
                "bindCustomDatePickerForInput",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "setCurrentGroupFixedDate",
                "getCurrentGroupFixedTimeShowLiveNow",
                "setCurrentGroupFixedTimeShowLiveNow",
                "sanitizeFixedDateValue",
                "showToast",
                "normalizeCustomAbbr",
                "addTimezone",
                "createUniqueTimezoneId",
                "syncActiveFormatProfileFromState"
            ]),
            ...pickAliasedDeps({
                "getSlotCount": "getSlotCountState"
            }),
            ...pickDeps([
                "setSlotCount",
                "activateFormatProfileForCurrentContext",
                "renderList",
                "renderCopyFormatControls",
                "updateCopyFormatPreview",
                "savePersistence",
                "getShowCopyFormat",
                "setShowCopyFormat",
                "getShowTimeline",
                "setShowTimeline",
                "renderTimelineFrame",
                "resetDisplayFormatForActiveContext",
                "resetCopyFormatForActiveContext",
                "applyCurrentGroupBaseTimezoneId",
                "addGroup",
                "addMultiSubgroup",
                "copyAllTimezones",
                "saveTimezoneTableImage",
                "saveMultiRangeTitlesImage"
            ]),
            bindTransferControls: () => {
                const uiSettingsActionsService = getUiSettingsActionsService();
                if (!uiSettingsActionsService || typeof uiSettingsActionsService.bindTransferControls !== "function") return;
                uiSettingsActionsService.bindTransferControls();
            },
            ...pickAliasedDeps({
                "getCurrentTheme": "getCurrentThemeState"
            }),
            ...pickDeps([
                "applyTheme",
                "refreshCalculator"
            ]),
            ...pickAliasedDeps({
                "getCurrentLang": "getCurrentLangState"
            }),
            ...pickDeps([
                "hideFloatingTooltip",
                "setLanguage",
                "localizeAutoGeneratedNamesForCurrentLanguage",
                "applyVersionBranding",
                "updateTZDropdown",
                "renderGroups",
                "renderMultiSubgroups",
                "updateTimeAdjustPanel",
                "refreshSelectWidths"
            ]),
            bindResetControls: () => {
                const uiSettingsActionsService = getUiSettingsActionsService();
                if (!uiSettingsActionsService || typeof uiSettingsActionsService.bindResetControls !== "function") return;
                uiSettingsActionsService.bindResetControls();
            },
            ...pickDeps([
                "renderBaseTimeSelect",
                "updateOptionRowVisibility",
                "upgradeNativeTitleTooltips"
            ])
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
