(function initGtvMainFacadeBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const facadeBindingsModule = safeDeps.facadeBindingsModule;
        if (!facadeBindingsModule || typeof facadeBindingsModule.createService !== "function") {
            throw new Error("Missing required module API: GTVMainFacadeBindings.createService");
        }

        const bindFacadeMethod = safeDeps.bindFacadeMethod;
        if (typeof bindFacadeMethod !== "function") {
            throw new Error("Missing dependency: bindFacadeMethod");
        }

        const getTimeCoreRef = (typeof safeDeps.getTimeCoreRef === "function")
            ? safeDeps.getTimeCoreRef
            : (() => null);
        const getMainFoundationServicesRef = (typeof safeDeps.getMainFoundationServicesRef === "function")
            ? safeDeps.getMainFoundationServicesRef
            : (() => null);

        const sanitizeUtcRowOrderViaTimeCore = bindFacadeMethod(getTimeCoreRef, "sanitizeUtcRowOrder");
        const sanitizeUtcMsViaTimeCore = bindFacadeMethod(getTimeCoreRef, "sanitizeUtcMs");
        const confirmFnViaMainFoundation = bindFacadeMethod(getMainFoundationServicesRef, "confirmFn");
        const promptFnViaMainFoundation = bindFacadeMethod(getMainFoundationServicesRef, "promptFn");

        const facadeBindings = facadeBindingsModule.createService({
            bindFacadeMethod,
            getMainTimezoneFacadeServiceRef: safeDeps.getMainTimezoneFacadeServiceRef,
            getMainTimeAdjustFacadeServiceRef: safeDeps.getMainTimeAdjustFacadeServiceRef,
            getMainTimezoneTableFacadeServiceRef: safeDeps.getMainTimezoneTableFacadeServiceRef,
            getMainTimelineFacadeServiceRef: safeDeps.getMainTimelineFacadeServiceRef,
            getMainFixedTimeFacadeServiceRef: safeDeps.getMainFixedTimeFacadeServiceRef,
            getMainFixedTimeTabFacadeServiceRef: safeDeps.getMainFixedTimeTabFacadeServiceRef,
            getMainMultiRangeTabFacadeServiceRef: safeDeps.getMainMultiRangeTabFacadeServiceRef
        });

        if (!facadeBindings || typeof facadeBindings !== "object") {
            throw new Error("Invalid facade bindings result");
        }

        return Object.freeze({
            sanitizeUtcRowOrderViaTimeCore,
            sanitizeUtcMsViaTimeCore,
            confirmFnViaMainFoundation,
            promptFnViaMainFoundation,
            ...facadeBindings
        });
    }

    globalObj.GTVMainFacadeBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
