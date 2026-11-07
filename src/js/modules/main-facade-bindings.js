(function initGtvMainFacadeBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const bindFacadeMethod = (typeof safeDeps.bindFacadeMethod === "function")
            ? safeDeps.bindFacadeMethod
            : (() => () => undefined);

        function bindMap(getFacade, methodNames = []) {
            return methodNames.reduce((acc, methodName) => {
                acc[methodName] = bindFacadeMethod(getFacade, methodName);
                return acc;
            }, {});
        }

        const timezoneFacadeBindings = bindMap(
            safeDeps.getMainTimezoneFacadeServiceRef,
            [
                "getUtcMinuteCacheKey",
                "setCappedRuntimeCache",
                "getBetterAbbr",
                "isTimeZoneInDST",
                "getTimezoneOffset",
                "getFixedOffsetForDisplayAtDate",
                "getFixedOffsetForDisplay",
                "getLocalizedTZLabel",
                "getZoneDisplayName",
                "sanitizeTimezoneId",
                "sanitizeBaseTimezoneId",
                "setCurrentGroupBaseTimezoneId",
                "applyCurrentGroupBaseTimezoneId",
                "getUsedTimezoneIds",
                "createUniqueTimezoneId",
                "getNextTimezoneIdSeed"
            ]
        );

        const timeAdjustFacadeBindings = bindMap(
            safeDeps.getMainTimeAdjustFacadeServiceRef,
            [
                "getTimeAdjustDayStep",
                "setTimeAdjustDayStep",
                "updateTimeAdjustPanel",
                "renderTimeAdjustSet",
                "attachTimeAdjustToggleLabel",
                "renderMultiBulkToolSets",
                "sanitizeTimeAdjustDayStep",
                "resolveTimeAdjustZoneAndOffset",
                "applyTimeAdjustAction",
                "getAdjustedUtcDateByAction",
                "applyBulkRangeAllAction",
                "applyMultiRangeTimeAdjustAction"
            ]
        );

        const timezoneTableFacadeBindings = bindMap(
            safeDeps.getMainTimezoneTableFacadeServiceRef,
            [
                "createStandardTimezoneFromSelectableEntry",
                "addTimezone",
                "removeTimezone",
                "updateCopyFormatPreview",
                "copyAllTimezones"
            ]
        );

        const timelineFacadeBindings = bindMap(
            safeDeps.getMainTimelineFacadeServiceRef,
            [
                "isTimelineSupportedTab",
                "shouldRenderTimeline",
                "resolveFixedTimeTimelineSourceDate",
                "applyFixedTimeSlotTimelineRatio",
                "getFixedTimeTimelineSlots",
                "getFixedTimeTimelineSlotCount",
                "getFixedTimeTimelineIndicatorToken",
                "getFixedTimeSlotTimelineLabel",
                "getFixedTimeTimelineIndicatorColor",
                "stopTimelineDrag",
                "normalizeDayNightMarker",
                "getDayNightGlyph",
                "applyTimelineRatioToSlot",
                "getTimelineIndicatorLabel",
                "getTimelinePanelCount"
            ]
        );

        const fixedTimeFacadeBindings = bindMap(
            safeDeps.getMainFixedTimeFacadeServiceRef,
            [
                "getFixedTimeSlotParts",
                "formatFixedTimeForTimezoneAtUtc",
                "getFixedTimeDisplayPartsEnabled",
                "getLocalizedWeekdayNameByIndex",
                "buildFixedTimeDisplayPayloadAtUtc",
                "formatFixedTimePayloadText",
                "getFixedTimeCopyState",
                "buildFixedTimeSnapshotForTimezoneSlot",
                "formatFixedTimeCopyTextForTimezoneSlot",
                "getFixedTimeSlotUtcDateByIndex",
                "getFixedTimePreviewCopyText",
                "getAllFixedTimeRowsCopyText",
                "copyFixedTimeCellPayload",
                "copyFixedTimeCellByTimezone",
                "buildFixedTimeCellInputValue",
                "buildFixedTimeCellTimeParts",
                "applyFixedTimeSlotByTimezoneInput",
                "bindCustomDatePickerForInput",
                "copyFixedTimeSlotColumn",
                "renameFixedTimeSlot",
                "updateFixedTimeSlotTime",
                "addFixedTimeSlot",
                "removeFixedTimeSlot"
            ]
        );

        const fixedTimeTabFacadeBindings = bindMap(
            safeDeps.getMainFixedTimeTabFacadeServiceRef,
            [
                "renderFixedTimeControls",
                "getFixedTimeSlotLayoutMetrics",
                "getFixedTimeDisplayColumns",
                "getFixedTimeOffsetTextAtDate",
                "renderFixedTimeTable"
            ]
        );

        const multiRangeTabFacadeBindings = bindMap(
            safeDeps.getMainMultiRangeTabFacadeServiceRef,
            [
                "buildTimezoneComputedSnapshotForRange",
                "applySnapshotToRow",
                "formatRangeDurationText",
                "copyMultiRangeRow",
                "copyAllMultiRangeTimezones"
            ]
        );

        return Object.freeze({
            ...timezoneFacadeBindings,
            ...timeAdjustFacadeBindings,
            ...timezoneTableFacadeBindings,
            ...timelineFacadeBindings,
            ...fixedTimeFacadeBindings,
            ...fixedTimeTabFacadeBindings,
            ...multiRangeTabFacadeBindings
        });
    }

    globalObj.GTVMainFacadeBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
