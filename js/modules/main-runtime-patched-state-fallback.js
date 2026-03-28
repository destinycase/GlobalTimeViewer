(function initGtvMainRuntimePatchedStateFallback(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getNormalizeDayNightRangeValues = (typeof safeDeps.getNormalizeDayNightRangeValues === "function")
            ? safeDeps.getNormalizeDayNightRangeValues
            : ((dayStartHour, nightStartHour) => ({ dayStartHour, nightStartHour }));
        const getRuntimeCurrentLangValue = (typeof safeDeps.getRuntimeCurrentLangValue === "function")
            ? safeDeps.getRuntimeCurrentLangValue
            : (() => "ko");

        const getCurrentMainTab = (typeof safeDeps.getCurrentMainTab === "function") ? safeDeps.getCurrentMainTab : (() => "live");
        const getSlotCount = (typeof safeDeps.getSlotCount === "function") ? safeDeps.getSlotCount : (() => 1);
        const getShowCopyFormat = (typeof safeDeps.getShowCopyFormat === "function") ? safeDeps.getShowCopyFormat : (() => false);
        const getShowTimeline = (typeof safeDeps.getShowTimeline === "function") ? safeDeps.getShowTimeline : (() => false);
        const getCurrentTheme = (typeof safeDeps.getCurrentTheme === "function") ? safeDeps.getCurrentTheme : (() => "dark");
        const getDayStartHour = (typeof safeDeps.getDayStartHour === "function") ? safeDeps.getDayStartHour : (() => 6);
        const getNightStartHour = (typeof safeDeps.getNightStartHour === "function") ? safeDeps.getNightStartHour : (() => 18);
        const getDisplayFormatOrder = (typeof safeDeps.getDisplayFormatOrder === "function") ? safeDeps.getDisplayFormatOrder : (() => []);
        const getDisplayFormatEnabled = (typeof safeDeps.getDisplayFormatEnabled === "function") ? safeDeps.getDisplayFormatEnabled : (() => ({}));
        const getDisplayTimePartsEnabled = (typeof safeDeps.getDisplayTimePartsEnabled === "function") ? safeDeps.getDisplayTimePartsEnabled : (() => ({}));
        const getCopyFormatOrder = (typeof safeDeps.getCopyFormatOrder === "function") ? safeDeps.getCopyFormatOrder : (() => []);
        const getCopyFormatEnabled = (typeof safeDeps.getCopyFormatEnabled === "function") ? safeDeps.getCopyFormatEnabled : (() => ({}));
        const getCopyTimePartsEnabled = (typeof safeDeps.getCopyTimePartsEnabled === "function") ? safeDeps.getCopyTimePartsEnabled : (() => ({}));
        const getActiveFormatProfileContext = (typeof safeDeps.getActiveFormatProfileContext === "function") ? safeDeps.getActiveFormatProfileContext : (() => "live");
        const getActiveGroupId = (typeof safeDeps.getActiveGroupId === "function") ? safeDeps.getActiveGroupId : (() => 0);
        const getMultiRangeCount = (typeof safeDeps.getMultiRangeCount === "function") ? safeDeps.getMultiRangeCount : (() => 1);
        const getMultiRanges = (typeof safeDeps.getMultiRanges === "function") ? safeDeps.getMultiRanges : (() => []);
        const getMultiRangeCollapsed = (typeof safeDeps.getMultiRangeCollapsed === "function") ? safeDeps.getMultiRangeCollapsed : (() => []);
        const getTimeAdjustDayStepBySlot = (typeof safeDeps.getTimeAdjustDayStepBySlot === "function") ? safeDeps.getTimeAdjustDayStepBySlot : (() => []);
        const getMultiRangeTitle = (typeof safeDeps.getMultiRangeTitle === "function") ? safeDeps.getMultiRangeTitle : (() => "Range");

        function buildPatchedStateFallbackSnapshot() {
            const dayNightRange = getNormalizeDayNightRangeValues(getDayStartHour(), getNightStartHour());
            return {
                currentMainTab: getCurrentMainTab(),
                slotCount: getSlotCount(),
                showCopyFormat: getShowCopyFormat(),
                showTimeline: getShowTimeline(),
                currentTheme: getCurrentTheme(),
                dayStartHour: dayNightRange.dayStartHour,
                nightStartHour: dayNightRange.nightStartHour,
                currentLang: getRuntimeCurrentLangValue(),
                displayFormatOrder: getDisplayFormatOrder(),
                displayFormatEnabled: getDisplayFormatEnabled(),
                displayTimePartsEnabled: getDisplayTimePartsEnabled(),
                copyFormatOrder: getCopyFormatOrder(),
                copyFormatEnabled: getCopyFormatEnabled(),
                copyTimePartsEnabled: getCopyTimePartsEnabled(),
                activeFormatProfileContext: getActiveFormatProfileContext(),
                activeGroupId: getActiveGroupId(),
                multiRangeCount: getMultiRangeCount(),
                multiRanges: getMultiRanges(),
                multiRangeCollapsed: getMultiRangeCollapsed(),
                timeAdjustDayStepBySlot: getTimeAdjustDayStepBySlot(),
                multiRangeTitle: getMultiRangeTitle()
            };
        }

        return Object.freeze({
            buildPatchedStateFallbackSnapshot
        });
    }

    globalObj.GTVMainRuntimePatchedStateFallback = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
