(function initGtvMainFoundationServiceBindings(globalObj) {
    "use strict";

    const FOUNDATION_SERVICE_KEYS = Object.freeze([
        "serviceBootstrap",
        "persistenceServiceBundleFactory",
        "mainUiUtilsService",
        "appFeedbackService",
        "calculatorActionsService",
        "setCustomTooltip",
        "upgradeNativeTitleTooltips",
        "hideFloatingTooltip",
        "bindFloatingTooltipEvents",
        "clearDragGhost",
        "createDragGhostFromRow"
    ]);

    const CORE_DOMAIN_SERVICE_KEYS = Object.freeze([
        "groupContextStateService",
        "formatProfileStateService",
        "multiRangeStateService",
        "fixedTimeSlotUtilsService",
        "fixedTimeStateService",
        "uiPreferencesStateService",
        "timerEngineService",
        "timeService"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const mainFoundationServices = safeDeps.mainFoundationServices;
        const mainCoreServices = safeDeps.mainCoreServices;

        if (!mainFoundationServices || typeof mainFoundationServices !== "object") {
            throw new Error("Missing dependency: mainFoundationServices");
        }
        if (!mainCoreServices || typeof mainCoreServices !== "object") {
            throw new Error("Missing dependency: mainCoreServices");
        }

        const bindings = {};
        FOUNDATION_SERVICE_KEYS.forEach((serviceKey) => {
            bindings[serviceKey] = mainFoundationServices[serviceKey];
        });
        CORE_DOMAIN_SERVICE_KEYS.forEach((serviceKey) => {
            bindings[serviceKey] = mainCoreServices[serviceKey];
        });

        return Object.freeze(bindings);
    }

    globalObj.GTVMainFoundationServiceBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
