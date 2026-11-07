(function initGtvMainRuntimeCompositionBootstrap(globalObj) {
    "use strict";

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickAliasedDeps(aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = safeDeps[aliasMap[targetKey]];
            });
            return resolved;
        }

        const mainCompositionConfigBuilderService = requireObject(
            safeDeps.mainCompositionConfigBuilderService,
            "mainCompositionConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildRuntimeCompositionConfig = requireFunction(
            mainCompositionConfigBuilderService.buildRuntimeCompositionConfig,
            "mainCompositionConfigBuilderService.buildRuntimeCompositionConfig"
        );
        const createMainRuntimeCompositionServices = requireFunction(
            mainCoreServices.createMainRuntimeCompositionServices,
            "mainCoreServices.createMainRuntimeCompositionServices"
        );

        const mainRuntimeCompositionConfig = buildRuntimeCompositionConfig({
            ...safeDeps,
            ...pickAliasedDeps({
                "t": "gtvT"
            })
        });
        const mainRuntimeCompositionServices = createMainRuntimeCompositionServices(
            mainRuntimeCompositionConfig
        );

        return Object.freeze({
            timelineFrameService: mainRuntimeCompositionServices.timelineFrameService,
            fixedTimeTableService: mainRuntimeCompositionServices.fixedTimeTableService,
            mainUiInitService: mainRuntimeCompositionServices.mainUiInitService,
            mainClockOrchestratorService: mainRuntimeCompositionServices.mainClockOrchestratorService
        });
    }

    globalObj.GTVMainRuntimeCompositionBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
