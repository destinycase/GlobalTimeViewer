(function initGtvMainRuntimeStateHelpers(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainSharedUtilsService = (typeof safeDeps.getMainSharedUtilsService === "function")
            ? safeDeps.getMainSharedUtilsService
            : (() => null);
        const getPatchedTimeAdjustDayStepBySlotState = (typeof safeDeps.getPatchedTimeAdjustDayStepBySlotState === "function")
            ? safeDeps.getPatchedTimeAdjustDayStepBySlotState
            : (() => []);
        const getPatchAppState = (typeof safeDeps.getPatchAppState === "function")
            ? safeDeps.getPatchAppState
            : (() => null);
        const getUpdateTimeAdjustPanel = (typeof safeDeps.getUpdateTimeAdjustPanel === "function")
            ? safeDeps.getUpdateTimeAdjustPanel
            : (() => null);
        const getTranslator = (typeof safeDeps.getTranslator === "function")
            ? safeDeps.getTranslator
            : (() => ((key) => String(key || "")));
        const getGroupContextStateService = (typeof safeDeps.getGroupContextStateService === "function")
            ? safeDeps.getGroupContextStateService
            : (() => null);
        const getTimezoneSearchService = (typeof safeDeps.getTimezoneSearchService === "function")
            ? safeDeps.getTimezoneSearchService
            : (() => null);
        const getPatchedMultiRangeCountState = (typeof safeDeps.getPatchedMultiRangeCountState === "function")
            ? safeDeps.getPatchedMultiRangeCountState
            : (() => 1);
        const getPatchedMultiRangesState = (typeof safeDeps.getPatchedMultiRangesState === "function")
            ? safeDeps.getPatchedMultiRangesState
            : (() => []);
        const getPatchedMultiRangeCollapsedState = (typeof safeDeps.getPatchedMultiRangeCollapsedState === "function")
            ? safeDeps.getPatchedMultiRangeCollapsedState
            : (() => []);
        const getPatchedArrayStateValue = (typeof safeDeps.getPatchedArrayStateValue === "function")
            ? safeDeps.getPatchedArrayStateValue
            : ((_key, fallbackValue = []) => fallbackValue);
        const getMultiRangeStartEditEnabledState = (typeof safeDeps.getMultiRangeStartEditEnabledState === "function")
            ? safeDeps.getMultiRangeStartEditEnabledState
            : (() => []);
        const getMultiRangeEndEditEnabledState = (typeof safeDeps.getMultiRangeEndEditEnabledState === "function")
            ? safeDeps.getMultiRangeEndEditEnabledState
            : (() => []);
        const getPatchedMultiRangeTitleState = (typeof safeDeps.getPatchedMultiRangeTitleState === "function")
            ? safeDeps.getPatchedMultiRangeTitleState
            : (() => "");
        const getPersistenceState = (typeof safeDeps.getPersistenceState === "function")
            ? safeDeps.getPersistenceState
            : (() => null);
        const getGroupsState = (typeof safeDeps.getGroupsState === "function")
            ? safeDeps.getGroupsState
            : (() => []);
        const getActiveGroupIdByMainTabState = (typeof safeDeps.getActiveGroupIdByMainTabState === "function")
            ? safeDeps.getActiveGroupIdByMainTabState
            : (() => ({}));
        const getPatchedActiveGroupIdState = (typeof safeDeps.getPatchedActiveGroupIdState === "function")
            ? safeDeps.getPatchedActiveGroupIdState
            : (() => 0);

        function getSharedUtilsService() {
            return getMainSharedUtilsService();
        }

        function parseDateTimeParts(val, inputMode) {
            const sharedUtilsService = getSharedUtilsService();
            if (!sharedUtilsService || typeof sharedUtilsService.parseDateTimeParts !== "function") {
                return null;
            }
            return sharedUtilsService.parseDateTimeParts(val, inputMode);
        }

        function getTimeAdjustDayStepBySlotSnapshot() {
            return getPatchedTimeAdjustDayStepBySlotState();
        }

        function patchPrimaryState(next = {}) {
            const patchAppState = getPatchAppState();
            if (typeof patchAppState !== "function") return;
            patchAppState(next);
        }

        function setTimeAdjustDayStepBySlotState(nextValues = []) {
            const safeValues = Array.isArray(nextValues) ? nextValues : [];
            patchPrimaryState({ timeAdjustDayStepBySlot: [...safeValues] });
        }

        function updateTimeAdjustPanelSafely() {
            const updateTimeAdjustPanel = getUpdateTimeAdjustPanel();
            if (typeof updateTimeAdjustPanel !== "function") return undefined;
            return updateTimeAdjustPanel();
        }

        function getUTCRef() {
            const t = getTranslator();
            return { id: "utc", type: "standard", zone: "UTC", name: t("utc_name") };
        }

        function getCurrentGroup() {
            const service = getGroupContextStateService();
            if (!service || typeof service.getCurrentGroup !== "function") return null;
            return service.getCurrentGroup();
        }

        function getCurrentGroupZones() {
            const service = getGroupContextStateService();
            if (!service || typeof service.getCurrentGroupZones !== "function") return [];
            return service.getCurrentGroupZones();
        }

        function getCurrentGroupBaseTimezoneId() {
            const service = getGroupContextStateService();
            if (!service || typeof service.getCurrentGroupBaseTimezoneId !== "function") return "utc";
            return service.getCurrentGroupBaseTimezoneId();
        }

        function getBaseTimezoneRef() {
            const service = getGroupContextStateService();
            if (!service || typeof service.getBaseTimezoneRef !== "function") return null;
            return service.getBaseTimezoneRef();
        }

        function ensureBaseTimezoneSelection() {
            const service = getGroupContextStateService();
            if (!service || typeof service.ensureBaseTimezoneSelection !== "function") return null;
            return service.ensureBaseTimezoneSelection();
        }

        function formatUtcOffsetLabel(totalMinutes = 0) {
            const safeMinutes = Number.isFinite(totalMinutes) ? totalMinutes : 0;
            const searchService = getTimezoneSearchService();
            if (searchService && typeof searchService.formatUtcOffsetLabel === "function") {
                return searchService.formatUtcOffsetLabel(safeMinutes);
            }
            const sign = safeMinutes >= 0 ? "+" : "-";
            const abs = Math.abs(safeMinutes);
            const hour = String(Math.floor(abs / 60)).padStart(2, "0");
            const minute = String(abs % 60).padStart(2, "0");
            return `UTC${sign}${hour}:${minute}`;
        }

        function normalizeCustomAbbr(value) {
            const trimmed = String(value || "").trim();
            if (!trimmed) {
                const t = getTranslator();
                return t("label_custom");
            }
            return trimmed.toUpperCase().slice(0, 12);
        }

        function getCurrentMultiRangeStateSnapshot() {
            return {
                multiRangeCount: getPatchedMultiRangeCountState(),
                multiRanges: getPatchedMultiRangesState(),
                multiRangeCollapsed: getPatchedMultiRangeCollapsedState(),
                multiRangeStartEditEnabled: getPatchedArrayStateValue("multiRangeStartEditEnabled", getMultiRangeStartEditEnabledState()),
                multiRangeEndEditEnabled: getPatchedArrayStateValue("multiRangeEndEditEnabled", getMultiRangeEndEditEnabledState()),
                multiRangeTitle: getPatchedMultiRangeTitleState()
            };
        }

        function getGroupsStateSnapshot() {
            const state = getPersistenceState();
            if (Array.isArray(state?.groups)) return state.groups;
            const fallbackGroups = getGroupsState();
            return Array.isArray(fallbackGroups) ? fallbackGroups : [];
        }

        function getActiveGroupIdByMainTabStateSnapshot() {
            const state = getPersistenceState();
            if (state?.activeGroupIdByMainTab && typeof state.activeGroupIdByMainTab === "object") {
                return state.activeGroupIdByMainTab;
            }
            const fallbackMap = getActiveGroupIdByMainTabState();
            return (fallbackMap && typeof fallbackMap === "object") ? fallbackMap : {};
        }

        function setCurrentMainTabState(nextTab) {
            patchPrimaryState({ currentMainTab: nextTab });
        }

        function setActiveGroupIdState(nextId) {
            patchPrimaryState({ activeGroupId: nextId });
        }

        function setActiveGroupIdByMainTabState(nextMap) {
            patchPrimaryState({ activeGroupIdByMainTab: nextMap });
        }

        function getActiveGroupNameSnapshot() {
            const safeGroups = getGroupsStateSnapshot();
            const safeActiveId = getPatchedActiveGroupIdState();
            return safeGroups[safeActiveId]?.name;
        }

        return Object.freeze({
            parseDateTimeParts,
            getTimeAdjustDayStepBySlotSnapshot,
            setTimeAdjustDayStepBySlotState,
            updateTimeAdjustPanelSafely,
            getUTCRef,
            getCurrentGroup,
            getCurrentGroupZones,
            getCurrentGroupBaseTimezoneId,
            getBaseTimezoneRef,
            ensureBaseTimezoneSelection,
            formatUtcOffsetLabel,
            normalizeCustomAbbr,
            getCurrentMultiRangeStateSnapshot,
            getGroupsStateSnapshot,
            getActiveGroupIdByMainTabStateSnapshot,
            patchPrimaryState,
            setCurrentMainTabState,
            setActiveGroupIdState,
            setActiveGroupIdByMainTabState,
            getActiveGroupNameSnapshot
        });
    }

    globalObj.GTVMainRuntimeStateHelpers = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
