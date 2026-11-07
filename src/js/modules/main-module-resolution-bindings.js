(function initGtvMainModuleResolutionBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { moduleResolverModule, moduleSpecModule } = safeDeps;

        if (!moduleResolverModule || typeof moduleResolverModule.resolveModules !== "function") {
            throw new Error("Missing required module API: GTVMainModuleResolver.resolveModules");
        }
        if (!moduleSpecModule || typeof moduleSpecModule.createSpecMap !== "function") {
            throw new Error("Missing required module API: GTVMainModuleSpec.createSpecMap");
        }

        function resolveModulesFromSpec() {
            return moduleResolverModule.resolveModules(moduleSpecModule.createSpecMap());
        }

        return Object.freeze({
            resolveModulesFromSpec
        });
    }

    globalObj.GTVMainModuleResolutionBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
