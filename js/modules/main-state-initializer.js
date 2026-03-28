(function initGtvMainStateInitializer(globalObj) {
    "use strict";

    function cloneArray(value, fallback = []) {
        return Array.isArray(value) ? [...value] : [...fallback];
    }

    function cloneObject(value, fallback = {}) {
        return (value && typeof value === "object") ? { ...value } : { ...fallback };
    }

    function toFiniteNumber(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function createService() {
        function deriveInitialState(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            const initialMainState = (d.initialMainState && typeof d.initialMainState === "object")
                ? d.initialMainState
                : {};
            const defaults = (d.defaults && typeof d.defaults === "object")
                ? d.defaults
                : {};
            const copyFormatKeys = Array.isArray(d.copyFormatKeys) ? d.copyFormatKeys : [];
            const t = (typeof d.t === "function") ? d.t : ((key) => key);
            const normalizeDayNightRangeValues = (typeof d.normalizeDayNightRangeValues === "function")
                ? d.normalizeDayNightRangeValues
                : ((dayStartHourInput, nightStartHourInput) => ({
                    dayStartHour: toFiniteNumber(dayStartHourInput, toFiniteNumber(defaults.defaultDayStartHour, 6)),
                    nightStartHour: toFiniteNumber(nightStartHourInput, toFiniteNumber(defaults.defaultNightStartHour, 18))
                }));
            const initialDayNightRange = normalizeDayNightRangeValues(
                initialMainState.dayStartHour,
                initialMainState.nightStartHour
            );
            const defaultTimeAdjustDayStep = toFiniteNumber(defaults.defaultTimeAdjustDayStep, 1);
            const defaultMultiRangeTitle = String(defaults.defaultMultiRangeTitle || "Range");

            return {
                isRealtime: !!initialMainState.isRealtime,
                globalTimes: cloneArray(initialMainState.globalTimes, [new Date(), new Date()]),
                slotCount: toFiniteNumber(initialMainState.slotCount, 1),
                uiScale: toFiniteNumber(initialMainState.uiScale, 1.0),
                showCopyFormat: !!initialMainState.showCopyFormat,
                showTimeline: !!initialMainState.showTimeline,
                displayFormatOrder: cloneArray(initialMainState.displayFormatOrder, copyFormatKeys),
                displayFormatEnabled: cloneObject(initialMainState.displayFormatEnabled, defaults.defaultDisplayFormatEnabled),
                copyFormatOrder: cloneArray(initialMainState.copyFormatOrder, copyFormatKeys),
                copyFormatEnabled: cloneObject(initialMainState.copyFormatEnabled, defaults.defaultCopyFormatEnabled),
                displayTimePartsEnabled: cloneObject(
                    initialMainState.displayTimePartsEnabled,
                    defaults.defaultDisplayTimePartsEnabled
                ),
                copyTimePartsEnabled: cloneObject(
                    initialMainState.copyTimePartsEnabled,
                    defaults.defaultCopyTimePartsEnabled
                ),
                formatProfiles: (initialMainState.formatProfiles && typeof initialMainState.formatProfiles === "object")
                    ? initialMainState.formatProfiles
                    : {},
                activeFormatProfileContext: String(initialMainState.activeFormatProfileContext || "live"),
                timeAdjustDayStepBySlot: cloneArray(
                    initialMainState.timeAdjustDayStepBySlot,
                    [defaultTimeAdjustDayStep, defaultTimeAdjustDayStep]
                ),
                multiRangeCount: toFiniteNumber(initialMainState.multiRangeCount, 1),
                multiRangeTitle: String(
                    initialMainState.multiRangeTitle
                    || t("placeholder_range_title")
                    || defaultMultiRangeTitle
                ),
                multiRanges: cloneArray(initialMainState.multiRanges),
                multiRangeCollapsed: cloneArray(initialMainState.multiRangeCollapsed),
                multiRangeStartEditEnabled: cloneArray(initialMainState.multiRangeStartEditEnabled),
                multiRangeEndEditEnabled: cloneArray(initialMainState.multiRangeEndEditEnabled),
                currentMainTab: String(initialMainState.currentMainTab || "live"),
                activeGroupIdByMainTab: (
                    initialMainState.activeGroupIdByMainTab
                    && typeof initialMainState.activeGroupIdByMainTab === "object"
                ) ? { ...initialMainState.activeGroupIdByMainTab } : { live: 0, fixed: 0 },
                currentTheme: String(initialMainState.currentTheme || "dark"),
                dayStartHour: initialDayNightRange.dayStartHour,
                nightStartHour: initialDayNightRange.nightStartHour,
                canUseForeignObjectRenderer: Object.prototype.hasOwnProperty.call(initialMainState, "canUseForeignObjectRenderer")
                    ? initialMainState.canUseForeignObjectRenderer
                    : null,
                fixedTimeIdSeed: toFiniteNumber(initialMainState.fixedTimeIdSeed, 0),
                groups: cloneArray(initialMainState.groups),
                activeGroupId: initialMainState.activeGroupId ?? 0
            };
        }

        return Object.freeze({
            deriveInitialState
        });
    }

    globalObj.GTVMainStateInitializer = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
