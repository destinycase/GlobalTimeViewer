(function initGtvMainAppStateVarsBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { appStateVarsModule, ...forwardDeps } = safeDeps;
        if (
            !appStateVarsModule
            || typeof appStateVarsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainAppStateVars.createService");
        }

        const mainAppStateVarsService = appStateVarsModule.createService(forwardDeps);
        if (
            !mainAppStateVarsService
            || typeof mainAppStateVarsService !== "object"
            || typeof mainAppStateVarsService.createDirectStateSetters !== "function"
        ) {
            throw new Error("Invalid main app state vars service");
        }

        return Object.freeze({
            mainAppStateVarsService
        });
    }

    globalObj.GTVMainAppStateVarsBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
