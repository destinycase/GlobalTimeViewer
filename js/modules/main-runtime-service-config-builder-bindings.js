(function initGtvMainRuntimeServiceConfigBuilderBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeServiceConfigBuilderModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeServiceConfigBuilderModule
            || typeof runtimeServiceConfigBuilderModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeServiceConfigBuilder.createService");
        }

        const mainRuntimeServiceConfigBuilderService = runtimeServiceConfigBuilderModule.createService(forwardDeps);
        if (
            !mainRuntimeServiceConfigBuilderService
            || typeof mainRuntimeServiceConfigBuilderService !== "object"
            || typeof mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig !== "function"
        ) {
            throw new Error("Invalid main runtime service config builder service");
        }

        return Object.freeze({
            mainRuntimeServiceConfigBuilderService,
            ...mainRuntimeServiceConfigBuilderService
        });
    }

    globalObj.GTVMainRuntimeServiceConfigBuilderBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
