(function initGtvMainRuntimeHostAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainRuntimeHostUtilsService = (typeof safeDeps.getMainRuntimeHostUtilsService === "function")
            ? safeDeps.getMainRuntimeHostUtilsService
            : (() => null);

        function invokeRuntimeHostUtils(methodName, args = []) {
            const service = getMainRuntimeHostUtilsService();
            if (!service || typeof service[methodName] !== "function") {
                throw new Error(`Missing required module API: mainRuntimeHostUtilsService.${methodName}`);
            }
            return service[methodName](...args);
        }

        function applyVersionBranding() { return invokeRuntimeHostUtils("applyVersionBranding"); }
        function createCanvasSafely() { return invokeRuntimeHostUtils("createCanvasSafely"); }
        function getRandomUUIDSafely() { return invokeRuntimeHostUtils("getRandomUUIDSafely"); }
        function getDocumentRefOrNull() { return invokeRuntimeHostUtils("getDocumentRefOrNull"); }
        function getWindowRefOrNull() { return invokeRuntimeHostUtils("getWindowRefOrNull"); }
        function getLocationRefOrNull() { return invokeRuntimeHostUtils("getLocationRefOrNull"); }
        function getGlobalThisRefOrNull() { return invokeRuntimeHostUtils("getGlobalThisRefOrNull"); }
        function getLuxonGlobalRef() { return invokeRuntimeHostUtils("getLuxonGlobalRef"); }
        function getComputedStyleSafely(target) {
            return invokeRuntimeHostUtils("getComputedStyleSafely", [target]);
        }
        function getRuntimeNowMs() { return invokeRuntimeHostUtils("getRuntimeNowMs"); }
        function setRuntimeInterval(cb, ms) {
            return invokeRuntimeHostUtils("setRuntimeInterval", [cb, ms]);
        }
        function clearRuntimeInterval(id) {
            return invokeRuntimeHostUtils("clearRuntimeInterval", [id]);
        }
        function deferDynamicCall(getFn) {
            return invokeRuntimeHostUtils("deferDynamicCall", [getFn]);
        }

        return Object.freeze({
            applyVersionBranding,
            createCanvasSafely,
            getRandomUUIDSafely,
            getDocumentRefOrNull,
            getWindowRefOrNull,
            getLocationRefOrNull,
            getGlobalThisRefOrNull,
            getLuxonGlobalRef,
            getComputedStyleSafely,
            getRuntimeNowMs,
            setRuntimeInterval,
            clearRuntimeInterval,
            deferDynamicCall
        });
    }

    globalObj.GTVMainRuntimeHostAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
