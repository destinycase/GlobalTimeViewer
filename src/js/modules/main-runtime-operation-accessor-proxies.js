(function initGtvMainRuntimeOperationAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMainOrchestrationFlowServices = (
            typeof safeDeps.getMainOrchestrationFlowServices === "function"
        )
            ? safeDeps.getMainOrchestrationFlowServices
            : (() => null);
        const getTimeInputMutationsService = (typeof safeDeps.getTimeInputMutationsService === "function")
            ? safeDeps.getTimeInputMutationsService
            : (() => null);
        const getSnapshotFormatService = (typeof safeDeps.getSnapshotFormatService === "function")
            ? safeDeps.getSnapshotFormatService
            : (() => null);
        const getCalculatorActionsService = (typeof safeDeps.getCalculatorActionsService === "function")
            ? safeDeps.getCalculatorActionsService
            : (() => null);
        const getGroupStateService = (typeof safeDeps.getGroupStateService === "function")
            ? safeDeps.getGroupStateService
            : (() => null);
        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const defaultCopyTimePartsEnabled = Object.prototype.hasOwnProperty.call(safeDeps, "defaultCopyTimePartsEnabled")
            ? safeDeps.defaultCopyTimePartsEnabled
            : {};

        function updateClocks() {
            return getMainOrchestrationFlowServices().updateClocks();
        }

        function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
            return getTimeInputMutationsService().resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId);
        }

        function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
            return getTimeInputMutationsService().resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
        }

        function buildStrictUtcDateFromParts(parts) {
            return getTimeInputMutationsService().buildStrictUtcDateFromParts(parts);
        }

        function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            return getTimeInputMutationsService().handleTimeChange(val, timezone, slotIdx, timezoneId, inputMode);
        }

        function handleMultiRangeTimeChange(
            rangeIdx,
            val,
            timezone,
            slotIdx,
            timezoneId = null,
            inputMode = "datetime"
        ) {
            return getTimeInputMutationsService().handleMultiRangeTimeChange(
                rangeIdx,
                val,
                timezone,
                slotIdx,
                timezoneId,
                inputMode
            );
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
            const safeTimeParts = (timePartsEnabled === undefined) ? defaultCopyTimePartsEnabled : timePartsEnabled;
            return getSnapshotFormatService().formatTimeTextByParts(safeSnapshot, safeTimeParts);
        }

        function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = defaultCopyTimePartsEnabled) {
            const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
            return getSnapshotFormatService().formatSnapshotText(safeSnapshot, order, enabled, timePartsEnabled);
        }

        function initCalculators() {
            return callServiceMethod(
                "calculatorActionsService",
                getCalculatorActionsService(),
                "initCalculators",
                []
            );
        }

        async function copyText(elementId, isInput = false) {
            return await callServiceMethod(
                "calculatorActionsService",
                getCalculatorActionsService(),
                "copyText",
                [elementId, isInput],
                { toastOnMissing: true, featureKey: "calculator-copy" }
            );
        }

        function getPersistenceSnapshot() {
            return getMainOrchestrationFlowServices().getPersistenceSnapshot();
        }

        function sanitizeGroup(group, idx, legacyMultiState = null) {
            if (!group || typeof group !== "object") return null;
            const safeIdx = Number.isInteger(idx) && idx >= 0 ? idx : 0;
            return callServiceMethod(
                "groupStateService",
                getGroupStateService(),
                "sanitizeGroup",
                [group, safeIdx, legacyMultiState],
                { fallback: null }
            );
        }

        async function loadPersistence() {
            return await getPersistenceService().loadPersistence();
        }

        return Object.freeze({
            updateClocks,
            resolveLocalDatePartsByTimezoneAtDate,
            resolveLocalDatePartsByTimezone,
            buildStrictUtcDateFromParts,
            handleTimeChange,
            handleMultiRangeTimeChange,
            formatTimeTextByParts,
            formatSnapshotText,
            initCalculators,
            copyText,
            getPersistenceSnapshot,
            sanitizeGroup,
            loadPersistence
        });
    }

    globalObj.GTVMainRuntimeOperationAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
