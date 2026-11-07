(function initGtvMainRuntimeLocalStateAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainRuntimeLocalStateHelpersService = (
            typeof safeDeps.getMainRuntimeLocalStateHelpersService === "function"
        )
            ? safeDeps.getMainRuntimeLocalStateHelpersService
            : (() => null);
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
            : ((value, fallback) => (
                Number.isFinite(Number(value))
                    ? Number(value)
                    : Number(fallback)
            ));
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
        const getFormatProfileAllowedTimePartKeys = (
            typeof safeDeps.getFormatProfileAllowedTimePartKeys === "function"
        )
            ? safeDeps.getFormatProfileAllowedTimePartKeys
            : (() => []);
        const getPatchedActiveFormatProfileContextState = (
            typeof safeDeps.getPatchedActiveFormatProfileContextState === "function"
        )
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
        const getTimeAdjustDayStepBySlotSnapshot = (
            typeof safeDeps.getTimeAdjustDayStepBySlotSnapshot === "function"
        )
            ? safeDeps.getTimeAdjustDayStepBySlotSnapshot
            : (() => []);

        function callRuntimeLocalStateHelpers(methodName, args = [], fallbackFn = null) {
            const service = getMainRuntimeLocalStateHelpersService();
            if (service && typeof service[methodName] === "function") {
                return service[methodName](...args);
            }
            return (typeof fallbackFn === "function") ? fallbackFn() : undefined;
        }

        function setMultiRangeState(next = {}) {
            return callRuntimeLocalStateHelpers("setMultiRangeState", [next], () => {
                if (!next || typeof next !== "object") return;
                const patchAppState = getPatchAppState();
                if (typeof patchAppState !== "function") return;
                patchAppState(next);
            });
        }

        function getNextFixedTimeSeed() {
            return callRuntimeLocalStateHelpers("getNextFixedTimeSeed", [], () => {
                const nextSeed = getFixedTimeIdSeed() + 1;
                setFixedTimeIdSeed(nextSeed);
                return nextSeed;
            });
        }

        function setUiPreferencesState(next = {}) {
            return callRuntimeLocalStateHelpers("setUiPreferencesState", [next], () => {
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
            });
        }

        function getBaseTimeSnapshot() {
            return callRuntimeLocalStateHelpers("getBaseTimeSnapshot", [], () => getGlobalTimeState(0));
        }

        function getFixedTimeSlotCountForGroupRef(group) {
            return callRuntimeLocalStateHelpers(
                "getFixedTimeSlotCountForGroupRef",
                [group],
                () => getFixedTimeSlotCount(group)
            );
        }

        function confirmRuntime(message) {
            return callRuntimeLocalStateHelpers("confirmRuntime", [message], () => getConfirm(message));
        }

        function getActiveCopyFormatKeysForCurrentContext() {
            return callRuntimeLocalStateHelpers("getActiveCopyFormatKeysForCurrentContext", [], () => (
                getFormatProfileAllowedKeys(getPatchedActiveFormatProfileContextState())
            ));
        }

        function getActiveTimePartKeysForCurrentContext() {
            return callRuntimeLocalStateHelpers("getActiveTimePartKeysForCurrentContext", [], () => (
                getFormatProfileAllowedTimePartKeys(getPatchedActiveFormatProfileContextState())
            ));
        }

        function getCurrentUiScalePercent() {
            return callRuntimeLocalStateHelpers("getCurrentUiScalePercent", [], () => (
                Math.round(getUiScaleState() * 100)
            ));
        }

        function getFixedTimeSlotCountForCurrentGroup() {
            return callRuntimeLocalStateHelpers("getFixedTimeSlotCountForCurrentGroup", [], () => (
                getFixedTimeSlotCount(getCurrentGroup())
            ));
        }

        function getCurrentGroupFixedTimeShowLiveNow() {
            return callRuntimeLocalStateHelpers("getCurrentGroupFixedTimeShowLiveNow", [], () => {
                const group = getCurrentGroup();
                if (!group) return false;
                const fixedTimeStateService = getFixedTimeStateService();
                if (
                    !fixedTimeStateService
                    || typeof fixedTimeStateService.getCurrentGroupFixedTimeShowLiveNow !== "function"
                ) {
                    return !!group.fixedTimeShowLiveNow;
                }
                return !!fixedTimeStateService.getCurrentGroupFixedTimeShowLiveNow(group);
            });
        }

        function shouldRunRealtimeTick() {
            return callRuntimeLocalStateHelpers("shouldRunRealtimeTick", [], () => {
                if (getIsRealtimeState()) return true;
                if (!isFixedTimeTab()) return false;
                return getCurrentGroupFixedTimeShowLiveNow();
            });
        }

        function getTimeAdjustDayStepValue(slotIdx) {
            return callRuntimeLocalStateHelpers("getTimeAdjustDayStepValue", [slotIdx], () => (
                getTimeAdjustDayStepBySlotSnapshot()[slotIdx]
            ));
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

    globalObj.GTVMainRuntimeLocalStateAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
