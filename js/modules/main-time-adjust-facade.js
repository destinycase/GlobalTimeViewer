(function initGtvMainTimeAdjustFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getTimeAdjustUiService = (typeof safeDeps.getTimeAdjustUiService === "function")
            ? safeDeps.getTimeAdjustUiService
            : (() => null);
        const getTimeAdjustActionsService = (typeof safeDeps.getTimeAdjustActionsService === "function")
            ? safeDeps.getTimeAdjustActionsService
            : (() => null);
        const getMultiBulkToolsService = (typeof safeDeps.getMultiBulkToolsService === "function")
            ? safeDeps.getMultiBulkToolsService
            : (() => null);
        const getTimeAdjustDayStepBySlotSnapshot = (typeof safeDeps.getTimeAdjustDayStepBySlotSnapshot === "function")
            ? safeDeps.getTimeAdjustDayStepBySlotSnapshot
            : (() => []);
        const setTimeAdjustDayStepBySlotState = (typeof safeDeps.setTimeAdjustDayStepBySlotState === "function")
            ? safeDeps.setTimeAdjustDayStepBySlotState
            : (() => {});

        const defaultTimeAdjustDayStep = Number.isFinite(Number(safeDeps.defaultTimeAdjustDayStep))
            ? Math.trunc(Number(safeDeps.defaultTimeAdjustDayStep))
            : 1;
        const minTimeAdjustDayStep = Number.isFinite(Number(safeDeps.minTimeAdjustDayStep))
            ? Math.trunc(Number(safeDeps.minTimeAdjustDayStep))
            : 1;
        const maxTimeAdjustDayStep = Number.isFinite(Number(safeDeps.maxTimeAdjustDayStep))
            ? Math.trunc(Number(safeDeps.maxTimeAdjustDayStep))
            : 36500;
        const fallbackToken = Symbol("GTV_TIME_ADJUST_FACADE_FALLBACK");

        function callTimeAdjustUiMethodOrFallback(methodName, args = [], fallbackFactory = null) {
            const result = callServiceMethod(
                "timeAdjustUiService",
                getTimeAdjustUiService(),
                methodName,
                args,
                { fallback: fallbackToken }
            );
            if (result !== fallbackToken) return result;
            if (typeof fallbackFactory === "function") return fallbackFactory();
            return fallbackFactory;
        }

        function getTimeAdjustDayStep(slotIdx) {
            return callTimeAdjustUiMethodOrFallback(
                "getTimeAdjustDayStep",
                [slotIdx],
                () => {
                    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
                    const daySteps = getTimeAdjustDayStepBySlotSnapshot();
                    return daySteps[idx] || defaultTimeAdjustDayStep;
                }
            );
        }

        function setTimeAdjustDayStep(slotIdx, value) {
            return callTimeAdjustUiMethodOrFallback(
                "setTimeAdjustDayStep",
                [slotIdx, value],
                () => {
                    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
                    const daySteps = [...getTimeAdjustDayStepBySlotSnapshot()];
                    daySteps[idx] = value;
                    setTimeAdjustDayStepBySlotState(daySteps);
                }
            );
        }

        function updateTimeAdjustPanel() {
            return callTimeAdjustUiMethodOrFallback("updateTimeAdjustPanel", []);
        }

        function sanitizeTimeAdjustDayStep(value) {
            const safeValue = Number.isFinite(Number(value)) ? value : defaultTimeAdjustDayStep;
            return callTimeAdjustUiMethodOrFallback(
                "sanitizeTimeAdjustDayStep",
                [safeValue],
                () => {
                    const parsed = Number(safeValue);
                    if (!Number.isFinite(parsed)) return defaultTimeAdjustDayStep;
                    return Math.min(maxTimeAdjustDayStep, Math.max(minTimeAdjustDayStep, Math.trunc(parsed)));
                }
            );
        }

        function renderTimeAdjustSet(slotIdx, options = {}) {
            return callTimeAdjustUiMethodOrFallback("renderTimeAdjustSet", [slotIdx, options], null);
        }

        function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
            return callTimeAdjustUiMethodOrFallback(
                "attachTimeAdjustToggleLabel",
                [setEl, checked, text, onChange],
                undefined
            );
        }

        function renderMultiBulkToolSets() {
            return callServiceMethod(
                "multiBulkToolsService",
                getMultiBulkToolsService(),
                "renderMultiBulkToolSets",
                [],
                { fallback: null }
            );
        }

        function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
            return callServiceMethod(
                "timeAdjustActionsService",
                getTimeAdjustActionsService(),
                "resolveTimeAdjustZoneAndOffset",
                [baseRef, fixedOffsetMinutes],
                { fallback: { zone: "UTC", fixedOffsetMinutes: null } }
            );
        }

        function applyTimeAdjustAction(slotIdx, action) {
            return callServiceMethod(
                "timeAdjustActionsService",
                getTimeAdjustActionsService(),
                "applyTimeAdjustAction",
                [slotIdx, action],
                { toastOnMissing: true, featureKey: "time-adjust" }
            );
        }

        function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
            return callServiceMethod(
                "timeAdjustActionsService",
                getTimeAdjustActionsService(),
                "getAdjustedUtcDateByAction",
                [baseDate, action, slotIdx, baseRef, fixedOffsetMinutes],
                { fallback: null }
            );
        }

        function applyBulkRangeAllAction(slotIdx, action) {
            return callServiceMethod(
                "timeAdjustActionsService",
                getTimeAdjustActionsService(),
                "applyBulkRangeAllAction",
                [slotIdx, action],
                { toastOnMissing: true, featureKey: "time-adjust-bulk" }
            );
        }

        function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
            return callServiceMethod(
                "timeAdjustActionsService",
                getTimeAdjustActionsService(),
                "applyMultiRangeTimeAdjustAction",
                [rangeIdx, slotIdx, action],
                { toastOnMissing: true, featureKey: "time-adjust-multi-range" }
            );
        }

        return Object.freeze({
            getTimeAdjustDayStep,
            setTimeAdjustDayStep,
            updateTimeAdjustPanel,
            sanitizeTimeAdjustDayStep,
            renderTimeAdjustSet,
            attachTimeAdjustToggleLabel,
            renderMultiBulkToolSets,
            resolveTimeAdjustZoneAndOffset,
            applyTimeAdjustAction,
            getAdjustedUtcDateByAction,
            applyBulkRangeAllAction,
            applyMultiRangeTimeAdjustAction
        });
    }

    globalObj.GTVMainTimeAdjustFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
