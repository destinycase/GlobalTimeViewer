(function initGtvMainRuntimeLocalStateHelpers(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const getPatchAppState = (typeof safeDeps.getPatchAppState === "function")
            ? safeDeps.getPatchAppState
            : (() => null);
        const getFixedTimeIdSeed = (typeof safeDeps.getFixedTimeIdSeed === "function")
            ? safeDeps.getFixedTimeIdSeed
            : (() => 0);
        const setFixedTimeIdSeed = (typeof safeDeps.setFixedTimeIdSeed === "function")
            ? safeDeps.setFixedTimeIdSeed
            : (() => {});

        const getUiScale = (typeof safeDeps.getUiScale === "function")
            ? safeDeps.getUiScale
            : (() => 1);
        const setUiScale = (typeof safeDeps.setUiScale === "function")
            ? safeDeps.setUiScale
            : (() => {});
        const setCurrentTheme = (typeof safeDeps.setCurrentTheme === "function")
            ? safeDeps.setCurrentTheme
            : (() => {});

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

        const sanitizeDayNightHourValue = (typeof safeDeps.sanitizeDayNightHourValue === "function")
            ? safeDeps.sanitizeDayNightHourValue
            : ((value) => Number.isFinite(Number(value)) ? Number(value) : 0);
        const normalizeDayNightRangeValues = (typeof safeDeps.normalizeDayNightRangeValues === "function")
            ? safeDeps.normalizeDayNightRangeValues
            : ((dayStartHour, nightStartHour) => ({ dayStartHour, nightStartHour }));
        const syncCurrentLang = (typeof safeDeps.syncCurrentLang === "function")
            ? safeDeps.syncCurrentLang
            : (() => {});

        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => new Date());
        const getFixedTimeSlotCount = (typeof safeDeps.getFixedTimeSlotCount === "function")
            ? safeDeps.getFixedTimeSlotCount
            : (() => 1);
        const getConfirm = (typeof safeDeps.getConfirm === "function")
            ? safeDeps.getConfirm
            : (() => true);

        const getFormatProfileAllowedKeys = (typeof safeDeps.getFormatProfileAllowedKeys === "function")
            ? safeDeps.getFormatProfileAllowedKeys
            : (() => []);
        const getFormatProfileAllowedTimePartKeys = (typeof safeDeps.getFormatProfileAllowedTimePartKeys === "function")
            ? safeDeps.getFormatProfileAllowedTimePartKeys
            : (() => []);
        const getPatchedActiveFormatProfileContextState = (typeof safeDeps.getPatchedActiveFormatProfileContextState === "function")
            ? safeDeps.getPatchedActiveFormatProfileContextState
            : (() => "live");
        const getUiScaleState = (typeof safeDeps.getUiScaleState === "function")
            ? safeDeps.getUiScaleState
            : (() => Number(getUiScale()) || 1);

        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const getFixedTimeStateService = (typeof safeDeps.getFixedTimeStateService === "function")
            ? safeDeps.getFixedTimeStateService
            : (() => null);
        const getIsRealtimeState = (typeof safeDeps.getIsRealtimeState === "function")
            ? safeDeps.getIsRealtimeState
            : (() => false);
        const isFixedTimeTab = (typeof safeDeps.isFixedTimeTab === "function")
            ? safeDeps.isFixedTimeTab
            : (() => false);
        const getTimeAdjustDayStepBySlotSnapshot = (typeof safeDeps.getTimeAdjustDayStepBySlotSnapshot === "function")
            ? safeDeps.getTimeAdjustDayStepBySlotSnapshot
            : (() => []);

        function setMultiRangeState(next = {}) {
            if (!next || typeof next !== "object") return;
            const patchAppState = getPatchAppState();
            if (typeof patchAppState !== "function") return;
            patchAppState(next);
        }

        function getNextFixedTimeSeed() {
            const nextSeed = Number(getFixedTimeIdSeed()) + 1;
            setFixedTimeIdSeed(nextSeed);
            return nextSeed;
        }

        function setUiPreferencesState(next = {}) {
            if (!next || typeof next !== "object") return;
            if (Object.prototype.hasOwnProperty.call(next, "uiScale")) setUiScale(next.uiScale);
            if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) setCurrentTheme(next.currentTheme);
            if (Object.prototype.hasOwnProperty.call(next, "dayStartHour")) {
                setDayStartHour(sanitizeDayNightHourValue(next.dayStartHour, getDayStartHour()));
            }
            if (Object.prototype.hasOwnProperty.call(next, "nightStartHour")) {
                setNightStartHour(sanitizeDayNightHourValue(next.nightStartHour, getNightStartHour()));
            }
            if (
                Object.prototype.hasOwnProperty.call(next, "dayStartHour")
                || Object.prototype.hasOwnProperty.call(next, "nightStartHour")
            ) {
                const normalized = normalizeDayNightRangeValues(getDayStartHour(), getNightStartHour());
                setDayStartHour(normalized.dayStartHour);
                setNightStartHour(normalized.nightStartHour);
            }
            if (Object.prototype.hasOwnProperty.call(next, "currentLang")) syncCurrentLang(next.currentLang);
        }

        function getBaseTimeSnapshot() {
            return getGlobalTimeState(0);
        }

        function getFixedTimeSlotCountForGroupRef(group) {
            return getFixedTimeSlotCount(group);
        }

        function confirmRuntime(message) {
            return getConfirm(message);
        }

        function getActiveCopyFormatKeysForCurrentContext() {
            return getFormatProfileAllowedKeys(getPatchedActiveFormatProfileContextState());
        }

        function getActiveTimePartKeysForCurrentContext() {
            return getFormatProfileAllowedTimePartKeys(getPatchedActiveFormatProfileContextState());
        }

        function getCurrentUiScalePercent() {
            return Math.round(getUiScaleState() * 100);
        }

        function getFixedTimeSlotCountForCurrentGroup() {
            return getFixedTimeSlotCount(getCurrentGroup());
        }

        function getCurrentGroupFixedTimeShowLiveNow() {
            const group = getCurrentGroup();
            if (!group) return false;
            const fixedTimeStateService = getFixedTimeStateService();
            if (!fixedTimeStateService || typeof fixedTimeStateService.getCurrentGroupFixedTimeShowLiveNow !== "function") {
                return !!group.fixedTimeShowLiveNow;
            }
            return !!fixedTimeStateService.getCurrentGroupFixedTimeShowLiveNow(group);
        }

        function shouldRunRealtimeTick() {
            if (getIsRealtimeState()) return true;
            if (!isFixedTimeTab()) return false;
            return getCurrentGroupFixedTimeShowLiveNow();
        }

        function getTimeAdjustDayStepValue(slotIdx) {
            return getTimeAdjustDayStepBySlotSnapshot()[slotIdx];
        }

        return Object.freeze({
            setMultiRangeState,
            getNextFixedTimeSeed,
            setUiPreferencesState,
            getBaseTimeSnapshot,
            getFixedTimeSlotCountForGroupRef,
            confirmRuntime,
            getActiveCopyFormatKeysForCurrentContext,
            getActiveTimePartKeysForCurrentContext,
            getCurrentUiScalePercent,
            getFixedTimeSlotCountForCurrentGroup,
            getCurrentGroupFixedTimeShowLiveNow,
            shouldRunRealtimeTick,
            getTimeAdjustDayStepValue
        });
    }

    globalObj.GTVMainRuntimeLocalStateHelpers = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
