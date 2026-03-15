(function initGtvServiceBootstrap(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function resolveModuleApi(moduleName) {
            const api = safeDeps[moduleName];
            if (!api || typeof api.createService !== "function") {
                throw new Error(`Missing required module API: ${moduleName}.createService`);
            }
            return api;
        }

        function createTabUiService(config = {}) {
            const api = resolveModuleApi("GTV_TAB_UI");
            return api.createService(config);
        }

        function createTabOrchestratorService(config = {}) {
            const api = resolveModuleApi("GTV_TAB_ORCHESTRATOR");
            return api.createService(config);
        }

        function createGroupStateService(config = {}) {
            const api = resolveModuleApi("GTV_GROUP_STATE");
            return api.createService(config);
        }

        return Object.freeze({
            createTabUiService,
            createTabOrchestratorService,
            createGroupStateService
        });
    }

    globalObj.GTVServiceBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
