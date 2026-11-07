(function initGtvMainCompositionConfigBuilderBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { compositionConfigBuilderModule, ...forwardDeps } = safeDeps;
        if (
            !compositionConfigBuilderModule
            || typeof compositionConfigBuilderModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainCompositionConfigBuilder.createService");
        }

        const mainCompositionConfigBuilderService = compositionConfigBuilderModule.createService(forwardDeps);
        if (
            !mainCompositionConfigBuilderService
            || typeof mainCompositionConfigBuilderService !== "object"
            || typeof mainCompositionConfigBuilderService.buildPersistenceCompositionConfig !== "function"
            || typeof mainCompositionConfigBuilderService.buildRuntimeCompositionConfig !== "function"
        ) {
            throw new Error("Invalid main composition config builder service");
        }

        return Object.freeze({
            mainCompositionConfigBuilderService,
            buildPersistenceCompositionConfig: mainCompositionConfigBuilderService.buildPersistenceCompositionConfig,
            buildRuntimeCompositionConfig: mainCompositionConfigBuilderService.buildRuntimeCompositionConfig
        });
    }

    globalObj.GTVMainCompositionConfigBuilderBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
