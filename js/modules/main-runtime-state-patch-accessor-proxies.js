(function initGtvMainRuntimeStatePatchAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainDirectStatePatchService = (typeof safeDeps.getMainDirectStatePatchService === "function")
            ? safeDeps.getMainDirectStatePatchService
            : (() => null);
        const getDirectStateSetters = (typeof safeDeps.getDirectStateSetters === "function")
            ? safeDeps.getDirectStateSetters
            : (() => ({}));
        const getNormalizeDayNightRangeValues = (typeof safeDeps.getNormalizeDayNightRangeValues === "function")
            ? safeDeps.getNormalizeDayNightRangeValues
            : (() => ((dayStartHour, nightStartHour) => ({ dayStartHour, nightStartHour })));
        const getDayStartHour = (typeof safeDeps.getDayStartHour === "function")
            ? safeDeps.getDayStartHour
            : (() => 6);
        const setDayStartHour = (typeof safeDeps.setDayStartHour === "function")
            ? safeDeps.setDayStartHour
            : (() => {});
        const getNightStartHour = (typeof safeDeps.getNightStartHour === "function")
            ? safeDeps.getNightStartHour
            : (() => 18);
        const setNightStartHour = (typeof safeDeps.setNightStartHour === "function")
            ? safeDeps.setNightStartHour
            : (() => {});
        const getSetIsRealtimeState = (typeof safeDeps.getSetIsRealtimeState === "function")
            ? safeDeps.getSetIsRealtimeState
            : (() => null);
        const getMainRuntimePatchedStateFallbackService = (
            typeof safeDeps.getMainRuntimePatchedStateFallbackService === "function"
        )
            ? safeDeps.getMainRuntimePatchedStateFallbackService
            : (() => null);
        const getRuntimeCurrentLangValue = (typeof safeDeps.getRuntimeCurrentLangValue === "function")
            ? safeDeps.getRuntimeCurrentLangValue
            : (() => "ko");
        const getCurrentMainTab = (typeof safeDeps.getCurrentMainTab === "function")
            ? safeDeps.getCurrentMainTab
            : (() => "live");
        const getSlotCount = (typeof safeDeps.getSlotCount === "function")
            ? safeDeps.getSlotCount
            : (() => 1);
        const getShowCopyFormat = (typeof safeDeps.getShowCopyFormat === "function")
            ? safeDeps.getShowCopyFormat
            : (() => false);
        const getShowTimeline = (typeof safeDeps.getShowTimeline === "function")
            ? safeDeps.getShowTimeline
            : (() => false);
        const getCurrentTheme = (typeof safeDeps.getCurrentTheme === "function")
            ? safeDeps.getCurrentTheme
            : (() => "auto");
        const getDisplayFormatOrder = (typeof safeDeps.getDisplayFormatOrder === "function")
            ? safeDeps.getDisplayFormatOrder
            : (() => []);
        const getDisplayFormatEnabled = (typeof safeDeps.getDisplayFormatEnabled === "function")
            ? safeDeps.getDisplayFormatEnabled
            : (() => ({}));
        const getDisplayTimePartsEnabled = (typeof safeDeps.getDisplayTimePartsEnabled === "function")
            ? safeDeps.getDisplayTimePartsEnabled
            : (() => ({}));
        const getCopyFormatOrder = (typeof safeDeps.getCopyFormatOrder === "function")
            ? safeDeps.getCopyFormatOrder
            : (() => []);
        const getCopyFormatEnabled = (typeof safeDeps.getCopyFormatEnabled === "function")
            ? safeDeps.getCopyFormatEnabled
            : (() => ({}));
        const getCopyTimePartsEnabled = (typeof safeDeps.getCopyTimePartsEnabled === "function")
            ? safeDeps.getCopyTimePartsEnabled
            : (() => ({}));
        const getActiveFormatProfileContext = (typeof safeDeps.getActiveFormatProfileContext === "function")
            ? safeDeps.getActiveFormatProfileContext
            : (() => "live");
        const getActiveGroupId = (typeof safeDeps.getActiveGroupId === "function")
            ? safeDeps.getActiveGroupId
            : (() => 0);
        const getMultiRangeCount = (typeof safeDeps.getMultiRangeCount === "function")
            ? safeDeps.getMultiRangeCount
            : (() => 1);
        const getMultiRanges = (typeof safeDeps.getMultiRanges === "function")
            ? safeDeps.getMultiRanges
            : (() => []);
        const getMultiRangeCollapsed = (typeof safeDeps.getMultiRangeCollapsed === "function")
            ? safeDeps.getMultiRangeCollapsed
            : (() => []);
        const getTimeAdjustDayStepBySlot = (typeof safeDeps.getTimeAdjustDayStepBySlot === "function")
            ? safeDeps.getTimeAdjustDayStepBySlot
            : (() => [1]);
        const getMultiRangeTitle = (typeof safeDeps.getMultiRangeTitle === "function")
            ? safeDeps.getMultiRangeTitle
            : (() => "Range");

        function applyDirectStatePatch(next = {}) {
            const patchService = getMainDirectStatePatchService();
            if (patchService && typeof patchService.applyDirectStatePatch === "function") {
                return patchService.applyDirectStatePatch(next);
            }
            if (!next || typeof next !== "object") return;
            const directStateSetters = getDirectStateSetters();
            Object.keys(directStateSetters).forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                const setter = directStateSetters[key];
                if (typeof setter !== "function") return;
                if (key === "showTimeline") {
                    setter(!!next.showTimeline);
                    return;
                }
                setter(next[key]);
            });
            if (
                Object.prototype.hasOwnProperty.call(next, "dayStartHour")
                || Object.prototype.hasOwnProperty.call(next, "nightStartHour")
            ) {
                const normalized = getNormalizeDayNightRangeValues()(getDayStartHour(), getNightStartHour());
                setDayStartHour(normalized.dayStartHour);
                setNightStartHour(normalized.nightStartHour);
            }
            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                const setIsRealtimeState = getSetIsRealtimeState();
                if (typeof setIsRealtimeState === "function") {
                    setIsRealtimeState(next.isRealtime);
                }
            }
        }

        function buildPatchedStateFallbackSnapshot() {
            const fallbackService = getMainRuntimePatchedStateFallbackService();
            if (
                fallbackService
                && typeof fallbackService.buildPatchedStateFallbackSnapshot === "function"
            ) {
                return fallbackService.buildPatchedStateFallbackSnapshot();
            }
            const dayNightRange = getNormalizeDayNightRangeValues()(getDayStartHour(), getNightStartHour());
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
            applyDirectStatePatch,
            buildPatchedStateFallbackSnapshot
        });
    }

    globalObj.GTVMainRuntimeStatePatchAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
