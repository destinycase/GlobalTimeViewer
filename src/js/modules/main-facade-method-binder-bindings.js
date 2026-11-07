(function initGtvMainFacadeMethodBinderBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { facadeMethodBinderModule, ...forwardDeps } = safeDeps;
        if (
            !facadeMethodBinderModule
            || typeof facadeMethodBinderModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainFacadeMethodBinder.createService");
        }

        const mainFacadeMethodBinderService = facadeMethodBinderModule.createService(forwardDeps);
        if (
            !mainFacadeMethodBinderService
            || typeof mainFacadeMethodBinderService !== "object"
            || typeof mainFacadeMethodBinderService.deriveFacadeServiceName !== "function"
            || typeof mainFacadeMethodBinderService.bindFacadeMethod !== "function"
        ) {
            throw new Error("Invalid main facade method binder service");
        }

        return Object.freeze({
            mainFacadeMethodBinderService,
            deriveFacadeServiceName: mainFacadeMethodBinderService.deriveFacadeServiceName,
            bindFacadeMethod: mainFacadeMethodBinderService.bindFacadeMethod
        });
    }

    globalObj.GTVMainFacadeMethodBinderBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
