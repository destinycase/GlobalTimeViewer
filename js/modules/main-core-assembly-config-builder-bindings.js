(function initGtvMainCoreAssemblyConfigBuilderBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { coreAssemblyConfigBuilderModule, ...forwardDeps } = safeDeps;
        if (
            !coreAssemblyConfigBuilderModule
            || typeof coreAssemblyConfigBuilderModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainCoreAssemblyConfigBuilder.createService");
        }

        const mainCoreAssemblyConfigBuilderService = coreAssemblyConfigBuilderModule.createService(forwardDeps);
        if (
            !mainCoreAssemblyConfigBuilderService
            || typeof mainCoreAssemblyConfigBuilderService !== "object"
            || typeof mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig !== "function"
        ) {
            throw new Error("Invalid main core assembly config builder service");
        }

        return Object.freeze({
            mainCoreAssemblyConfigBuilderService,
            buildMainCoreAssemblyConfig: mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig
        });
    }

    globalObj.GTVMainCoreAssemblyConfigBuilderBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
