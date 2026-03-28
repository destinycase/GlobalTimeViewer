(function initGtvMainStateDomainWrapperBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainStateDomainProxiesService = (typeof safeDeps.getMainStateDomainProxiesService === "function")
            ? safeDeps.getMainStateDomainProxiesService
            : (() => null);
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const defaultFixedTimeValue = String(safeDeps.defaultFixedTimeValue || "09:00");

        function invokeStateDomainProxy(methodName, args = []) {
            const service = getMainStateDomainProxiesService();
            if (!service || typeof service[methodName] !== "function") {
                throw new Error(`Main state domain proxy service is unavailable: ${methodName}`);
            }
            return service[methodName](...args);
        }

        function getDefaultFixedTimeName() { return invokeStateDomainProxy("getDefaultFixedTimeName"); }
        function getDefaultFixedDate(anchorDate = new Date()) { return invokeStateDomainProxy("getDefaultFixedDate", [anchorDate]); }
        function getDefaultFixedTimes() { return invokeStateDomainProxy("getDefaultFixedTimes"); }
        function sanitizeFixedTimeSlotCount(value) { return invokeStateDomainProxy("sanitizeFixedTimeSlotCount", [value]); }
        function createDefaultFixedTimeSlot(id = "") { return invokeStateDomainProxy("createDefaultFixedTimeSlot", [id]); }
        function sanitizeFixedTimeId(value) { return invokeStateDomainProxy("sanitizeFixedTimeId", [value]); }
        function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
            return invokeStateDomainProxy("sanitizeFixedTimeName", [value, fallback]);
        }
        function sanitizeFixedTimeValue(value, fallback = defaultFixedTimeValue) {
            return invokeStateDomainProxy("sanitizeFixedTimeValue", [value, fallback]);
        }
        function sanitizeFixedDateValue(value, fallback = "") { return invokeStateDomainProxy("sanitizeFixedDateValue", [value, fallback]); }
        function sanitizeFixedTimeShowLiveNow(value, fallback = false) {
            return invokeStateDomainProxy("sanitizeFixedTimeShowLiveNow", [value, fallback]);
        }
        function getFixedDatePartsFromGroup(group = getCurrentGroup()) { return invokeStateDomainProxy("getFixedDatePartsFromGroup", [group]); }
        function sanitizeFixedTimes(rawFixedTimes) { return invokeStateDomainProxy("sanitizeFixedTimes", [rawFixedTimes]); }
        function ensureGroupFixedTimes(group) { return invokeStateDomainProxy("ensureGroupFixedTimes", [group]); }
        function createUniqueFixedTimeId(group = getCurrentGroup()) { return invokeStateDomainProxy("createUniqueFixedTimeId", [group]); }
        function isFixedTimeTab() { return invokeStateDomainProxy("isFixedTimeTab"); }
        function isMultiTab() { return invokeStateDomainProxy("isMultiTab"); }
        function sanitizeMultiRangeCount(value) { return invokeStateDomainProxy("sanitizeMultiRangeCount", [value]); }
        function sanitizeMultiRangeTitle(value) { return invokeStateDomainProxy("sanitizeMultiRangeTitle", [value]); }
        function getDefaultMultiRangeBounds() { return invokeStateDomainProxy("getDefaultMultiRangeBounds"); }
        function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
            return invokeStateDomainProxy("sanitizeMultiRangeItem", [rawRange, fallbackStartMs, fallbackEndMs]);
        }
        function isMultiRangeStartEditEnabled(rangeIdx) { return invokeStateDomainProxy("isMultiRangeStartEditEnabled", [rangeIdx]); }
        function isMultiRangeEndEditEnabled(rangeIdx) { return invokeStateDomainProxy("isMultiRangeEndEditEnabled", [rangeIdx]); }
        function isMultiRangeStartLinked(rangeIdx) { return invokeStateDomainProxy("isMultiRangeStartLinked", [rangeIdx]); }
        function ensureMultiRangeState() { return invokeStateDomainProxy("ensureMultiRangeState"); }
        function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
            return invokeStateDomainProxy("setMultiRangeStartEditEnabled", [rangeIdx, enabled, options]);
        }
        function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
            return invokeStateDomainProxy("setMultiRangeEndEditEnabled", [rangeIdx, enabled, options]);
        }
        function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
            return invokeStateDomainProxy("setAllMultiRangeStartEditEnabled", [enabled, options]);
        }
        function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
            return invokeStateDomainProxy("setAllMultiRangeEndEditEnabled", [enabled, options]);
        }
        function refreshMultiRangeControls() { return invokeStateDomainProxy("refreshMultiRangeControls"); }
        function syncMultiRangeStartLinks(startIdx = 1) { return invokeStateDomainProxy("syncMultiRangeStartLinks", [startIdx]); }
        function syncFollowingRangesByDuration(changedRangeIdx) { return invokeStateDomainProxy("syncFollowingRangesByDuration", [changedRangeIdx]); }
        function syncLinkedRangesFrom(rangeIdx, options = {}) {
            return invokeStateDomainProxy("syncLinkedRangesFrom", [rangeIdx, options]);
        }
        function setMultiRangeCount(value, options = {}) { return invokeStateDomainProxy("setMultiRangeCount", [value, options]); }
        function getFixedTimeSlotCount(group = getCurrentGroup()) { return invokeStateDomainProxy("getFixedTimeSlotCount", [group]); }
        function setCurrentGroupFixedDate(rawValue, options = {}) {
            return invokeStateDomainProxy("setCurrentGroupFixedDate", [rawValue, options]);
        }
        function setCurrentGroupFixedTimeShowLiveNow(enabled, options = {}) {
            return invokeStateDomainProxy("setCurrentGroupFixedTimeShowLiveNow", [enabled, options]);
        }
        function refreshFixedTimeSlotCountControls() { return invokeStateDomainProxy("refreshFixedTimeSlotCountControls"); }
        function setFixedTimeSlotCount(value, options = {}) { return invokeStateDomainProxy("setFixedTimeSlotCount", [value, options]); }
        function toggleMultiRangeCollapsed(rangeIdx) { return invokeStateDomainProxy("toggleMultiRangeCollapsed", [rangeIdx]); }
        function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
            return invokeStateDomainProxy("setMultiRangesCollapsedBelow", [rangeIdx, collapsed]);
        }
        function getMultiRangeSlotDate(rangeIdx, slotIdx) { return invokeStateDomainProxy("getMultiRangeSlotDate", [rangeIdx, slotIdx]); }
        function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
            return invokeStateDomainProxy("setMultiRangeSlotDate", [rangeIdx, slotIdx, nextDate]);
        }
        function sanitizeUiScalePercent(value) { return invokeStateDomainProxy("sanitizeUiScalePercent", [value]); }
        function applyUiScale(scalePercent, persist = true) { return invokeStateDomainProxy("applyUiScale", [scalePercent, persist]); }
        function loadUiScalePreference() { return invokeStateDomainProxy("loadUiScalePreference"); }
        function populateUiScaleSelect(selectEl) { return invokeStateDomainProxy("populateUiScaleSelect", [selectEl]); }
        function populateDayNightHourSelect(selectEl) { return invokeStateDomainProxy("populateDayNightHourSelect", [selectEl]); }
        function setDayNightRange(dayStartHourValue, nightStartHourValue, options = {}) {
            return invokeStateDomainProxy("setDayNightRange", [dayStartHourValue, nightStartHourValue, options]);
        }
        function sanitizeTheme(theme) { return invokeStateDomainProxy("sanitizeTheme", [theme]); }
        function applyTheme(theme, persist = true) { return invokeStateDomainProxy("applyTheme", [theme, persist]); }
        function loadThemePreference() { return invokeStateDomainProxy("loadThemePreference"); }
        function setCurrentLang(lang) { return invokeStateDomainProxy("setCurrentLang", [lang]); }
        function sanitizeMainTab(tab) { return invokeStateDomainProxy("sanitizeMainTab", [tab]); }
        function clampGroupIndex(index) { return invokeStateDomainProxy("clampGroupIndex", [index]); }
        function normalizeGroupTabState() { return invokeStateDomainProxy("normalizeGroupTabState"); }
        function getPersistenceState() { return invokeStateDomainProxy("getPersistenceState"); }
        function setPersistenceState(next = {}) { return invokeStateDomainProxy("setPersistenceState", [next]); }

        return Object.freeze({
            invokeStateDomainProxy,
            getDefaultFixedTimeName,
            getDefaultFixedDate,
            getDefaultFixedTimes,
            sanitizeFixedTimeSlotCount,
            createDefaultFixedTimeSlot,
            sanitizeFixedTimeId,
            sanitizeFixedTimeName,
            sanitizeFixedTimeValue,
            sanitizeFixedDateValue,
            sanitizeFixedTimeShowLiveNow,
            getFixedDatePartsFromGroup,
            sanitizeFixedTimes,
            ensureGroupFixedTimes,
            createUniqueFixedTimeId,
            isFixedTimeTab,
            isMultiTab,
            sanitizeMultiRangeCount,
            sanitizeMultiRangeTitle,
            getDefaultMultiRangeBounds,
            sanitizeMultiRangeItem,
            isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled,
            isMultiRangeStartLinked,
            ensureMultiRangeState,
            setMultiRangeStartEditEnabled,
            setMultiRangeEndEditEnabled,
            setAllMultiRangeStartEditEnabled,
            setAllMultiRangeEndEditEnabled,
            refreshMultiRangeControls,
            syncMultiRangeStartLinks,
            syncFollowingRangesByDuration,
            syncLinkedRangesFrom,
            setMultiRangeCount,
            getFixedTimeSlotCount,
            setCurrentGroupFixedDate,
            setCurrentGroupFixedTimeShowLiveNow,
            refreshFixedTimeSlotCountControls,
            setFixedTimeSlotCount,
            toggleMultiRangeCollapsed,
            setMultiRangesCollapsedBelow,
            getMultiRangeSlotDate,
            setMultiRangeSlotDate,
            sanitizeUiScalePercent,
            applyUiScale,
            loadUiScalePreference,
            populateUiScaleSelect,
            populateDayNightHourSelect,
            setDayNightRange,
            sanitizeTheme,
            applyTheme,
            loadThemePreference,
            setCurrentLang,
            sanitizeMainTab,
            clampGroupIndex,
            normalizeGroupTabState,
            getPersistenceState,
            setPersistenceState
        });
    }

    globalObj.GTVMainStateDomainWrapperBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
