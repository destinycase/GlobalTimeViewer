(function initGtvMainPatchedStateSelectors(globalObj) {
    "use strict";

    function asObject(value) {
        return (value && typeof value === "object") ? value : {};
    }

    function resolveFunction(safeDeps, name, fallback) {
        const candidate = safeDeps[name];
        return (typeof candidate === "function") ? candidate : fallback;
    }

    function createService(deps = {}) {
        const safeDeps = asObject(deps);
        const getPatchedStateValue = resolveFunction(safeDeps, "getPatchedStateValue", (_key, fallbackValue) => fallbackValue);
        const getPatchedIntegerStateValue = resolveFunction(
            safeDeps,
            "getPatchedIntegerStateValue",
            (_key, fallbackValue = 0) => {
                const parsed = Number(fallbackValue);
                if (!Number.isFinite(parsed)) return 0;
                return Math.trunc(parsed);
            }
        );
        const getPatchedBooleanStateValue = resolveFunction(
            safeDeps,
            "getPatchedBooleanStateValue",
            (_key, fallbackValue = false) => !!fallbackValue
        );
        const getPatchedStringStateValue = resolveFunction(
            safeDeps,
            "getPatchedStringStateValue",
            (_key, fallbackValue = "") => (typeof fallbackValue === "string" ? fallbackValue : "")
        );
        const getPatchedArrayStateValue = resolveFunction(
            safeDeps,
            "getPatchedArrayStateValue",
            (_key, fallbackValue = []) => (Array.isArray(fallbackValue) ? fallbackValue : [])
        );
        const getPatchedObjectStateValue = resolveFunction(
            safeDeps,
            "getPatchedObjectStateValue",
            (_key, fallbackValue = {}) => (
                fallbackValue && typeof fallbackValue === "object" && !Array.isArray(fallbackValue)
                    ? fallbackValue
                    : {}
            )
        );
        const patchAppState = resolveFunction(safeDeps, "patchAppState", () => {});
        const getFallbackState = resolveFunction(safeDeps, "getFallbackState", () => ({}));

        function getFallbackValue(key, fallbackValue) {
            const snapshot = getFallbackState();
            if (snapshot && typeof snapshot === "object" && Object.prototype.hasOwnProperty.call(snapshot, key)) {
                return snapshot[key];
            }
            return fallbackValue;
        }

        function getPatchedMainTabState() {
            return getPatchedStringStateValue("currentMainTab", getFallbackValue("currentMainTab", "live"));
        }

        function getPatchedSlotCountState() {
            const value = getPatchedIntegerStateValue("slotCount", getFallbackValue("slotCount", 1));
            return Math.max(1, value);
        }

        function setPatchedSlotCountState(next) {
            const parsed = Number(next);
            if (!Number.isFinite(parsed)) return;
            patchAppState({ slotCount: Math.max(1, Math.trunc(parsed)) });
        }

        function getPatchedShowCopyFormatState() {
            return getPatchedBooleanStateValue("showCopyFormat", !!getFallbackValue("showCopyFormat", false));
        }

        function setPatchedShowCopyFormatState(next) {
            patchAppState({ showCopyFormat: !!next });
        }

        function getPatchedShowTimelineState() {
            return getPatchedBooleanStateValue("showTimeline", !!getFallbackValue("showTimeline", false));
        }

        function setPatchedShowTimelineState(next) {
            patchAppState({ showTimeline: !!next });
        }

        function getPatchedCurrentThemeState() {
            return getPatchedStringStateValue("currentTheme", getFallbackValue("currentTheme", "dark"));
        }

        function getPatchedCurrentLangState() {
            return getPatchedStringStateValue("currentLang", getFallbackValue("currentLang", "ko"));
        }

        function getPatchedDisplayFormatOrderState() {
            return getPatchedArrayStateValue("displayFormatOrder", getFallbackValue("displayFormatOrder", []));
        }

        function getPatchedDisplayFormatEnabledState() {
            return getPatchedObjectStateValue("displayFormatEnabled", getFallbackValue("displayFormatEnabled", {}));
        }

        function getPatchedDisplayTimePartsEnabledState() {
            return getPatchedObjectStateValue("displayTimePartsEnabled", getFallbackValue("displayTimePartsEnabled", {}));
        }

        function getPatchedCopyFormatOrderState() {
            return getPatchedArrayStateValue("copyFormatOrder", getFallbackValue("copyFormatOrder", []));
        }

        function getPatchedCopyFormatEnabledState() {
            return getPatchedObjectStateValue("copyFormatEnabled", getFallbackValue("copyFormatEnabled", {}));
        }

        function getPatchedCopyTimePartsEnabledState() {
            return getPatchedObjectStateValue("copyTimePartsEnabled", getFallbackValue("copyTimePartsEnabled", {}));
        }

        function getPatchedActiveFormatProfileContextState() {
            return getPatchedStringStateValue(
                "activeFormatProfileContext",
                getFallbackValue("activeFormatProfileContext", "live")
            );
        }

        function getPatchedActiveGroupIdState() {
            const value = getPatchedIntegerStateValue("activeGroupId", getFallbackValue("activeGroupId", 0));
            return Math.max(0, value);
        }

        function getPatchedMultiRangeCountState() {
            const value = getPatchedIntegerStateValue("multiRangeCount", getFallbackValue("multiRangeCount", 1));
            return Math.max(1, value);
        }

        function getPatchedMultiRangesState() {
            return getPatchedArrayStateValue("multiRanges", getFallbackValue("multiRanges", []));
        }

        function getPatchedMultiRangeCollapsedState() {
            return getPatchedArrayStateValue("multiRangeCollapsed", getFallbackValue("multiRangeCollapsed", []));
        }

        function getPatchedTimeAdjustDayStepBySlotState() {
            return getPatchedArrayStateValue(
                "timeAdjustDayStepBySlot",
                getFallbackValue("timeAdjustDayStepBySlot", [])
            );
        }

        function getPatchedMultiRangeTitleState() {
            return getPatchedStringStateValue("multiRangeTitle", getFallbackValue("multiRangeTitle", ""));
        }

        return Object.freeze({
            getPatchedStateValue,
            getPatchedIntegerStateValue,
            getPatchedBooleanStateValue,
            getPatchedStringStateValue,
            getPatchedArrayStateValue,
            getPatchedObjectStateValue,
            getPatchedMainTabState,
            getPatchedSlotCountState,
            setPatchedSlotCountState,
            getPatchedShowCopyFormatState,
            setPatchedShowCopyFormatState,
            getPatchedShowTimelineState,
            setPatchedShowTimelineState,
            getPatchedCurrentThemeState,
            getPatchedCurrentLangState,
            getPatchedDisplayFormatOrderState,
            getPatchedDisplayFormatEnabledState,
            getPatchedDisplayTimePartsEnabledState,
            getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState,
            getPatchedActiveFormatProfileContextState,
            getPatchedActiveGroupIdState,
            getPatchedMultiRangeCountState,
            getPatchedMultiRangesState,
            getPatchedMultiRangeCollapsedState,
            getPatchedTimeAdjustDayStepBySlotState,
            getPatchedMultiRangeTitleState
        });
    }

    globalObj.GTVMainPatchedStateSelectors = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
