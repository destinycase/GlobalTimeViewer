(function initGtvMainRuntimeLangStateBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeLangStateModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeLangStateModule
            || typeof runtimeLangStateModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeLangState.createService");
        }

        const mainRuntimeLangStateService = runtimeLangStateModule.createService(forwardDeps);
        if (
            !mainRuntimeLangStateService
            || typeof mainRuntimeLangStateService !== "object"
            || typeof mainRuntimeLangStateService.syncRealtimeFlagToGlobal !== "function"
            || typeof mainRuntimeLangStateService.getRuntimeCurrentLangValue !== "function"
            || typeof mainRuntimeLangStateService.syncCurrentLang !== "function"
        ) {
            throw new Error("Invalid main runtime lang state service");
        }

        return Object.freeze({
            mainRuntimeLangStateService
        });
    }

    globalObj.GTVMainRuntimeLangStateBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
