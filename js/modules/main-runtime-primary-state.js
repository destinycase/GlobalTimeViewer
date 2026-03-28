(function initGtvMainRuntimePrimaryState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getIsRealtime = (typeof safeDeps.getIsRealtime === "function")
            ? safeDeps.getIsRealtime
            : (() => false);
        const setIsRealtime = (typeof safeDeps.setIsRealtime === "function")
            ? safeDeps.setIsRealtime
            : (() => {});
        const syncRealtimeFlagToGlobal = (typeof safeDeps.syncRealtimeFlagToGlobal === "function")
            ? safeDeps.syncRealtimeFlagToGlobal
            : (() => {});
        const getGlobalTimes = (typeof safeDeps.getGlobalTimes === "function")
            ? safeDeps.getGlobalTimes
            : (() => []);
        const setGlobalTimes = (typeof safeDeps.setGlobalTimes === "function")
            ? safeDeps.setGlobalTimes
            : (() => {});
        const getUiScale = (typeof safeDeps.getUiScale === "function")
            ? safeDeps.getUiScale
            : (() => 1);

        function setIsRealtimeState(next) {
            const safeValue = !!next;
            setIsRealtime(safeValue);
            syncRealtimeFlagToGlobal(safeValue);
            return safeValue;
        }

        function getIsRealtimeState() {
            return !!getIsRealtime();
        }

        function getGlobalTimesState() {
            const times = getGlobalTimes();
            return Array.isArray(times) ? times : [];
        }

        function getGlobalTimeState(slotIdx = 0) {
            const parsedIndex = Number(slotIdx);
            const safeSlotIdx = Number.isFinite(parsedIndex) ? Math.max(0, Math.trunc(parsedIndex)) : 0;
            const times = getGlobalTimesState();
            const candidate = times[safeSlotIdx];
            return (candidate instanceof Date && Number.isFinite(candidate.getTime())) ? candidate : new Date();
        }

        function setGlobalTimeState(slotIdx, value) {
            const parsedIndex = Number(slotIdx);
            const safeSlotIdx = Number.isFinite(parsedIndex) ? Math.max(0, Math.trunc(parsedIndex)) : 0;
            const safeValue = (value instanceof Date && Number.isFinite(value.getTime())) ? value : new Date();
            const currentTimes = getGlobalTimes();
            const nextTimes = Array.isArray(currentTimes) ? currentTimes : [];
            nextTimes[safeSlotIdx] = safeValue;
            setGlobalTimes(nextTimes);
            return safeValue;
        }

        function getUiScaleState() {
            const parsed = Number(getUiScale());
            return Number.isFinite(parsed) ? parsed : 1;
        }

        return Object.freeze({
            setIsRealtimeState,
            getIsRealtimeState,
            getGlobalTimesState,
            getGlobalTimeState,
            setGlobalTimeState,
            getUiScaleState
        });
    }

    globalObj.GTVMainRuntimePrimaryState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
