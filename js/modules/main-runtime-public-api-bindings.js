(function initGtvMainRuntimePublicApiBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const resolveGetter = (getterName, fallbackServiceName) => (
            (typeof safeDeps[getterName] === "function")
                ? safeDeps[getterName]
                : (() => safeDeps[fallbackServiceName])
        );
        const createMethodCaller = (accessorGetter) => (methodName, ...args) => (
            accessorGetter()[methodName](...args)
        );
        const createSyncMethod = (callMethod, methodName) => (...args) => (
            callMethod(methodName, ...args)
        );
        const createAsyncMethod = (callMethod, methodName) => async (...args) => (
            await callMethod(methodName, ...args)
        );
        const applyDefaultArgs = (args, defaultArgsByIndex) => {
            if (!defaultArgsByIndex || typeof defaultArgsByIndex !== "object") {
                return args;
            }
            const resolvedArgs = [...args];
            Object.keys(defaultArgsByIndex).forEach((indexKey) => {
                const index = Number(indexKey);
                if (Number.isNaN(index) || typeof resolvedArgs[index] !== "undefined") {
                    return;
                }
                const defaultValue = defaultArgsByIndex[index];
                resolvedArgs[index] = (typeof defaultValue === "function")
                    ? defaultValue()
                    : defaultValue;
            });
            return resolvedArgs;
        };
        const createMethodWrapper = (callMethod, methodName, defaultArgsByIndex = null) => (...args) => (
            callMethod(methodName, ...applyDefaultArgs(args, defaultArgsByIndex))
        );

        const getUiBridgeAccessorService = resolveGetter("getUiBridgeAccessorService", "uiBridgeAccessorService");
        const getOperationAccessorService = resolveGetter("getOperationAccessorService", "operationAccessorService");
        const getBootstrapAccessorService = resolveGetter("getBootstrapAccessorService", "bootstrapAccessorService");
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => undefined);
        const defaultCopyTimePartsEnabled = safeDeps.defaultCopyTimePartsEnabled;

        const callUiMethod = createMethodCaller(getUiBridgeAccessorService);
        const callOperationMethod = createMethodCaller(getOperationAccessorService);
        const callBootstrapMethod = createMethodCaller(getBootstrapAccessorService);
        const callUi = (methodName) => createSyncMethod(callUiMethod, methodName);
        const callUiWithDefaults = (methodName, defaultArgsByIndex) => (
            createMethodWrapper(callUiMethod, methodName, defaultArgsByIndex)
        );
        const callOperation = (methodName) => createSyncMethod(callOperationMethod, methodName);
        const callOperationWithDefaults = (methodName, defaultArgsByIndex) => (
            createMethodWrapper(callOperationMethod, methodName, defaultArgsByIndex)
        );
        const callOperationAsync = (methodName) => createAsyncMethod(callOperationMethod, methodName);
        const callBootstrap = (methodName) => createSyncMethod(callBootstrapMethod, methodName);
        const callBootstrapAsync = (methodName) => createAsyncMethod(callBootstrapMethod, methodName);

        return Object.freeze({
            showFatalError: callUi("showFatalError"),
            initApp: callBootstrapAsync("initApp"),
            startBootstrapOnDomReady: callBootstrap("startBootstrapOnDomReady"),
            showToast: callUiWithDefaults("showToast", { 1: () => ({}) }),
            switchMainTab: callUi("switchMainTab"),
            refreshOptionToggleDividers: callUi("refreshOptionToggleDividers"),
            getCopyFieldLabel: callUi("getCopyFieldLabel"),
            getTimePartLabel: callUi("getTimePartLabel"),
            getDisplayColumns: callUi("getDisplayColumns"),
            getDisplayTimeInputMode: callUi("getDisplayTimeInputMode"),
            buildRowActionCells: callUiWithDefaults("buildRowActionCells", { 2: "" }),
            renderList: callUi("renderList"),
            renderTimelineFrame: callUi("renderTimelineFrame"),
            resolveFixedTimeSlotUtcDate: callUiWithDefaults("resolveFixedTimeSlotUtcDate", {
                2: () => getGlobalTimeState(0)
            }),
            getFixedTimeSlotHeaderLabel: callUiWithDefaults("getFixedTimeSlotHeaderLabel", { 2: 1 }),
            renderFixedTimeTab: callUiWithDefaults("renderFixedTimeTab", { 0: false }),
            updateClocks: callOperation("updateClocks"),
            resolveLocalDatePartsByTimezoneAtDate: callOperationWithDefaults(
                "resolveLocalDatePartsByTimezoneAtDate",
                { 2: null }
            ),
            resolveLocalDatePartsByTimezone: callOperationWithDefaults(
                "resolveLocalDatePartsByTimezone",
                { 2: null }
            ),
            buildStrictUtcDateFromParts: callOperation("buildStrictUtcDateFromParts"),
            handleTimeChange: callOperationWithDefaults("handleTimeChange", {
                3: null,
                4: "datetime"
            }),
            handleMultiRangeTimeChange: callOperationWithDefaults("handleMultiRangeTimeChange", {
                4: null,
                5: "datetime"
            }),
            formatTimeTextByParts: callOperation("formatTimeTextByParts"),
            formatSnapshotText: callOperationWithDefaults("formatSnapshotText", {
                3: () => defaultCopyTimePartsEnabled
            }),
            initCalculators: callOperation("initCalculators"),
            copyText: callOperationAsync("copyText"),
            getPersistenceSnapshot: callOperation("getPersistenceSnapshot"),
            sanitizeGroup: callOperationWithDefaults("sanitizeGroup", { 2: null }),
            loadPersistence: callOperationAsync("loadPersistence")
        });
    }

    globalObj.GTVMainRuntimePublicApiBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
