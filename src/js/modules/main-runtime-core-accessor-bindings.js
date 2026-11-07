(function initGtvMainRuntimeCoreAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "syncRealtimeFlagToGlobal",
        "getRuntimeCurrentLangValue",
        "syncCurrentLang",
        "sanitizeDayNightHourValue",
        "normalizeDayNightRangeValues",
        "assertRequiredServices"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeCoreAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeCoreAccessorProxiesModule
            || typeof runtimeCoreAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeCoreAccessorProxies.createService");
        }

        const mainRuntimeCoreAccessorProxiesService = (
            runtimeCoreAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeCoreAccessorProxiesService
            || typeof mainRuntimeCoreAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime core accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeCoreAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime core accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeCoreAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeCoreAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
