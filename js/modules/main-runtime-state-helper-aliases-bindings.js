(function initGtvMainRuntimeStateHelperAliasesBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeStateHelperAliasesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeStateHelperAliasesModule
            || typeof runtimeStateHelperAliasesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeStateHelperAliases.createService");
        }

        const mainRuntimeStateHelperAliasesService = runtimeStateHelperAliasesModule.createService(forwardDeps);
        if (!mainRuntimeStateHelperAliasesService || typeof mainRuntimeStateHelperAliasesService !== "object") {
            throw new Error("Invalid main runtime state helper aliases service");
        }

        return Object.freeze({
            ...mainRuntimeStateHelperAliasesService
        });
    }

    globalObj.GTVMainRuntimeStateHelperAliasesBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
