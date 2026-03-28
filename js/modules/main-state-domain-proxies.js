(function initGtvMainStateDomainProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const fixedTimeSlotUtilsService = safeDeps.fixedTimeSlotUtilsService;
        const multiRangeStateService = safeDeps.multiRangeStateService;
        const fixedTimeStateService = safeDeps.fixedTimeStateService;
        const uiPreferencesStateService = safeDeps.uiPreferencesStateService;
        const groupContextStateService = safeDeps.groupContextStateService;
        const mainAppStateBridgeService = safeDeps.mainAppStateBridgeService;
        const getPatchedMainTabState = (typeof safeDeps.getPatchedMainTabState === "function")
            ? safeDeps.getPatchedMainTabState
            : (() => "live");
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const defaultFixedTimeValue = String(safeDeps.defaultFixedTimeValue || "09:00");

        function getDefaultFixedTimeName() { return fixedTimeSlotUtilsService.getDefaultFixedTimeName(); }
        function getDefaultFixedDate(anchorDate = new Date()) { return fixedTimeSlotUtilsService.getDefaultFixedDate(anchorDate); }
        function getDefaultFixedTimes() { return fixedTimeSlotUtilsService.getDefaultFixedTimes(); }
        function sanitizeFixedTimeSlotCount(value) { return fixedTimeSlotUtilsService.sanitizeFixedTimeSlotCount(value); }
        function createDefaultFixedTimeSlot(id = "") { return fixedTimeSlotUtilsService.createDefaultFixedTimeSlot(id); }
        function sanitizeFixedTimeId(value) { return fixedTimeSlotUtilsService.sanitizeFixedTimeId(value); }
        function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
            return fixedTimeSlotUtilsService.sanitizeFixedTimeName(value, fallback);
        }
        function sanitizeFixedTimeValue(value, fallback = defaultFixedTimeValue) {
            return fixedTimeSlotUtilsService.sanitizeFixedTimeValue(value, fallback);
        }
        function sanitizeFixedDateValue(value, fallback = "") { return fixedTimeSlotUtilsService.sanitizeFixedDateValue(value, fallback); }
        function sanitizeFixedTimeShowLiveNow(value, fallback = false) {
            return fixedTimeSlotUtilsService.sanitizeFixedTimeShowLiveNow(value, fallback);
        }
        function getFixedDatePartsFromGroup(group = getCurrentGroup()) { return fixedTimeSlotUtilsService.getFixedDatePartsFromGroup(group); }
        function sanitizeFixedTimes(rawFixedTimes) { return fixedTimeSlotUtilsService.sanitizeFixedTimes(rawFixedTimes); }
        function ensureGroupFixedTimes(group) { return fixedTimeSlotUtilsService.ensureGroupFixedTimes(group); }
        function createUniqueFixedTimeId(group = getCurrentGroup()) { return fixedTimeSlotUtilsService.createUniqueFixedTimeId(group); }
        function isFixedTimeTab() { return getPatchedMainTabState() === "fixed-time"; }
        function isMultiTab() { return getPatchedMainTabState() === "multi"; }
        function sanitizeMultiRangeCount(value) { return multiRangeStateService.sanitizeMultiRangeCount(value); }
        function sanitizeMultiRangeTitle(value) { return multiRangeStateService.sanitizeMultiRangeTitle(value); }
        function getDefaultMultiRangeBounds() { return multiRangeStateService.getDefaultMultiRangeBounds(); }
        function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
            return multiRangeStateService.sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs);
        }
        function isMultiRangeStartEditEnabled(rangeIdx) { return multiRangeStateService.isMultiRangeStartEditEnabled(rangeIdx); }
        function isMultiRangeEndEditEnabled(rangeIdx) { return multiRangeStateService.isMultiRangeEndEditEnabled(rangeIdx); }
        function isMultiRangeStartLinked(rangeIdx) { return multiRangeStateService.isMultiRangeStartLinked(rangeIdx); }
        function ensureMultiRangeState() { return multiRangeStateService.ensureMultiRangeState(); }
        function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
            return multiRangeStateService.setMultiRangeStartEditEnabled(rangeIdx, enabled, options);
        }
        function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
            return multiRangeStateService.setMultiRangeEndEditEnabled(rangeIdx, enabled, options);
        }
        function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
            return multiRangeStateService.setAllMultiRangeStartEditEnabled(enabled, options);
        }
        function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
            return multiRangeStateService.setAllMultiRangeEndEditEnabled(enabled, options);
        }
        function refreshMultiRangeControls() { return multiRangeStateService.refreshMultiRangeControls(); }
        function syncMultiRangeStartLinks(startIdx = 1) { return multiRangeStateService.syncMultiRangeStartLinks(startIdx); }
        function syncFollowingRangesByDuration(changedRangeIdx) { return multiRangeStateService.syncFollowingRangesByDuration(changedRangeIdx); }
        function syncLinkedRangesFrom(rangeIdx, options = {}) { return multiRangeStateService.syncLinkedRangesFrom(rangeIdx, options); }
        function setMultiRangeCount(value, options = {}) { return multiRangeStateService.setMultiRangeCount(value, options); }
        function getFixedTimeSlotCount(group = getCurrentGroup()) { return fixedTimeStateService.getFixedTimeSlotCount(group); }
        function setCurrentGroupFixedDate(rawValue, options = {}) { return fixedTimeStateService.setCurrentGroupFixedDate(rawValue, options); }
        function setCurrentGroupFixedTimeShowLiveNow(enabled, options = {}) {
            return fixedTimeStateService.setCurrentGroupFixedTimeShowLiveNow(enabled, options);
        }
        function refreshFixedTimeSlotCountControls() { return fixedTimeStateService.refreshFixedTimeSlotCountControls(); }
        function setFixedTimeSlotCount(value, options = {}) { return fixedTimeStateService.setFixedTimeSlotCount(value, options); }
        function toggleMultiRangeCollapsed(rangeIdx) { return multiRangeStateService.toggleMultiRangeCollapsed(rangeIdx); }
        function setMultiRangesCollapsedBelow(rangeIdx, collapsed) { return multiRangeStateService.setMultiRangesCollapsedBelow(rangeIdx, collapsed); }
        function getMultiRangeSlotDate(rangeIdx, slotIdx) { return multiRangeStateService.getMultiRangeSlotDate(rangeIdx, slotIdx); }
        function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) { return multiRangeStateService.setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate); }
        function sanitizeUiScalePercent(value) { return uiPreferencesStateService.sanitizeUiScalePercent(value); }
        function applyUiScale(scalePercent, persist = true) { return uiPreferencesStateService.applyUiScale(scalePercent, persist); }
        function loadUiScalePreference() { return uiPreferencesStateService.loadUiScalePreference(); }
        function populateUiScaleSelect(selectEl) { return uiPreferencesStateService.populateUiScaleSelect(selectEl); }
        function populateDayNightHourSelect(selectEl) { return uiPreferencesStateService.populateDayNightHourSelect(selectEl); }
        function setDayNightRange(dayStartHourValue, nightStartHourValue, options = {}) {
            return uiPreferencesStateService.setDayNightRange(dayStartHourValue, nightStartHourValue, options);
        }
        function sanitizeTheme(theme) { return uiPreferencesStateService.sanitizeTheme(theme); }
        function applyTheme(theme, persist = true) { return uiPreferencesStateService.applyTheme(theme, persist); }
        function loadThemePreference() { return uiPreferencesStateService.loadThemePreference(); }
        function setCurrentLang(lang) { return uiPreferencesStateService.setCurrentLang(lang); }
        function sanitizeMainTab(tab) { return groupContextStateService.sanitizeMainTab(tab); }
        function clampGroupIndex(index) { return groupContextStateService.clampGroupIndex(index); }
        function normalizeGroupTabState() { return groupContextStateService.normalizeGroupTabState(); }
        function getPersistenceState() { return mainAppStateBridgeService.getPersistenceState(); }
        function setPersistenceState(next = {}) { return mainAppStateBridgeService.setPersistenceState(next); }

        return Object.freeze({
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

    globalObj.GTVMainStateDomainProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
