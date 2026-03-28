(function initGtvMainCoreServiceBindings(globalObj) {
    "use strict";

    const CORE_SERVICE_KEYS = Object.freeze([
        "mainServiceMethodBridgeService",
        "mainDirectStatePatchService",
        "mainAppStateBridgeService",
        "mainPatchedStateSelectorsService",
        "mainSharedUtilsService",
        "mainTimezoneRuntimeBridgeService",
        "mainTimezoneRuntimeService",
        "mainTimezoneFacadeService",
        "mainBaseTimezoneService",
        "mainTimezoneMutationService",
        "mainTimezoneTableFacadeService",
        "mainTimeAdjustFacadeService",
        "mainFixedTimeTabFacadeService",
        "mainFixedTimeFacadeService",
        "mainTimelineFacadeService",
        "mainMultiRangeTabFacadeService",
        "mainGroupLocalizationServices",
        "mainOrchestrationFlowServices"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const mainCoreServices = safeDeps.mainCoreServices;
        if (!mainCoreServices || typeof mainCoreServices !== "object") {
            throw new Error("Missing dependency: mainCoreServices");
        }

        const bindings = {};
        CORE_SERVICE_KEYS.forEach((serviceKey) => {
            bindings[serviceKey] = mainCoreServices[serviceKey];
        });

        return Object.freeze(bindings);
    }

    globalObj.GTVMainCoreServiceBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
