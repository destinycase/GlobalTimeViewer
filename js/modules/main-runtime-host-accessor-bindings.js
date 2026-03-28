(function initGtvMainRuntimeHostAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "applyVersionBranding",
        "createCanvasSafely",
        "getRandomUUIDSafely",
        "getDocumentRefOrNull",
        "getWindowRefOrNull",
        "getLocationRefOrNull",
        "getGlobalThisRefOrNull",
        "getLuxonGlobalRef",
        "getComputedStyleSafely",
        "getRuntimeNowMs",
        "setRuntimeInterval",
        "clearRuntimeInterval",
        "deferDynamicCall"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeHostAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeHostAccessorProxiesModule
            || typeof runtimeHostAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeHostAccessorProxies.createService");
        }

        const mainRuntimeHostAccessorProxiesService = runtimeHostAccessorProxiesModule.createService(forwardDeps);
        if (!mainRuntimeHostAccessorProxiesService || typeof mainRuntimeHostAccessorProxiesService !== "object") {
            throw new Error("Invalid main runtime host accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeHostAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime host accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeHostAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeHostAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
