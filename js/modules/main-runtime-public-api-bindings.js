(function initGtvMainRuntimePublicApiBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getUiBridgeAccessorService = (typeof safeDeps.getUiBridgeAccessorService === "function")
            ? safeDeps.getUiBridgeAccessorService
            : (() => safeDeps.uiBridgeAccessorService);
        const getOperationAccessorService = (typeof safeDeps.getOperationAccessorService === "function")
            ? safeDeps.getOperationAccessorService
            : (() => safeDeps.operationAccessorService);
        const getBootstrapAccessorService = (typeof safeDeps.getBootstrapAccessorService === "function")
            ? safeDeps.getBootstrapAccessorService
            : (() => safeDeps.bootstrapAccessorService);
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => undefined);
        const defaultCopyTimePartsEnabled = safeDeps.defaultCopyTimePartsEnabled;

        const callUiMethod = (methodName, ...args) => (
            getUiBridgeAccessorService()[methodName](...args)
        );
        const callOperationMethod = (methodName, ...args) => (
            getOperationAccessorService()[methodName](...args)
        );
        const callBootstrapMethod = (methodName, ...args) => (
            getBootstrapAccessorService()[methodName](...args)
        );

        return Object.freeze({
            showFatalError: (err) => callUiMethod("showFatalError", err),
            initApp: async () => await callBootstrapMethod("initApp"),
            startBootstrapOnDomReady: (initFn) => callBootstrapMethod("startBootstrapOnDomReady", initFn),
            showToast: (message, options = {}) => callUiMethod("showToast", message, options),
            switchMainTab: (tab) => callUiMethod("switchMainTab", tab),
            refreshOptionToggleDividers: () => callUiMethod("refreshOptionToggleDividers"),
            getCopyFieldLabel: (key) => callUiMethod("getCopyFieldLabel", key),
            getTimePartLabel: (partKey) => callUiMethod("getTimePartLabel", partKey),
            getDisplayColumns: (effectiveSlotCount) => callUiMethod("getDisplayColumns", effectiveSlotCount),
            getDisplayTimeInputMode: () => callUiMethod("getDisplayTimeInputMode"),
            buildRowActionCells: (copyButtonTitle, removeButtonText, removeButtonTitle = "") => callUiMethod(
                "buildRowActionCells",
                copyButtonTitle,
                removeButtonText,
                removeButtonTitle
            ),
            renderList: () => callUiMethod("renderList"),
            renderTimelineFrame: () => callUiMethod("renderTimelineFrame"),
            resolveFixedTimeSlotUtcDate: (slot, baseRef, anchorDate = getGlobalTimeState(0)) => callUiMethod(
                "resolveFixedTimeSlotUtcDate",
                slot,
                baseRef,
                anchorDate
            ),
            getFixedTimeSlotHeaderLabel: (slot, slotIdx, slotCount = 1) => callUiMethod(
                "getFixedTimeSlotHeaderLabel",
                slot,
                slotIdx,
                slotCount
            ),
            renderFixedTimeTab: () => callUiMethod("renderFixedTimeTab"),
            updateClocks: () => callOperationMethod("updateClocks"),
            resolveLocalDatePartsByTimezoneAtDate: (timezone, utcDate, timezoneId = null) => callOperationMethod(
                "resolveLocalDatePartsByTimezoneAtDate",
                timezone,
                utcDate,
                timezoneId
            ),
            resolveLocalDatePartsByTimezone: (timezone, slotIdx, timezoneId = null) => callOperationMethod(
                "resolveLocalDatePartsByTimezone",
                timezone,
                slotIdx,
                timezoneId
            ),
            buildStrictUtcDateFromParts: (parts) => callOperationMethod("buildStrictUtcDateFromParts", parts),
            handleTimeChange: (val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") => (
                callOperationMethod("handleTimeChange", val, timezone, slotIdx, timezoneId, inputMode)
            ),
            handleMultiRangeTimeChange: (
                rangeIdx,
                val,
                timezone,
                slotIdx,
                timezoneId = null,
                inputMode = "datetime"
            ) => callOperationMethod(
                "handleMultiRangeTimeChange",
                rangeIdx,
                val,
                timezone,
                slotIdx,
                timezoneId,
                inputMode
            ),
            formatTimeTextByParts: (snapshot, timePartsEnabled) => callOperationMethod(
                "formatTimeTextByParts",
                snapshot,
                timePartsEnabled
            ),
            formatSnapshotText: (
                snapshot,
                order,
                enabled,
                timePartsEnabled = defaultCopyTimePartsEnabled
            ) => callOperationMethod(
                "formatSnapshotText",
                snapshot,
                order,
                enabled,
                timePartsEnabled
            ),
            initCalculators: () => callOperationMethod("initCalculators"),
            copyText: async (elementId, isInput = false) => await callOperationMethod("copyText", elementId, isInput),
            getPersistenceSnapshot: () => callOperationMethod("getPersistenceSnapshot"),
            sanitizeGroup: (group, idx, legacyMultiState = null) => callOperationMethod(
                "sanitizeGroup",
                group,
                idx,
                legacyMultiState
            ),
            loadPersistence: async () => await callOperationMethod("loadPersistence")
        });
    }

    globalObj.GTVMainRuntimePublicApiBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
