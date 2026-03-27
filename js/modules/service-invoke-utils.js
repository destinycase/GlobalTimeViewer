(function initGtvServiceInvokeUtils(globalObj) {
    "use strict";

    function resolveService(getter) {
        if (typeof getter !== "function") return null;
        const service = getter();
        return (service && typeof service === "object") ? service : null;
    }

    function invokeServiceMethod(service, methodName, args = [], fallback = undefined) {
        if (!service || typeof service[methodName] !== "function") return fallback;
        return service[methodName](...args);
    }

    function invokeGetterMethod(getter, methodName, args = [], fallback = undefined) {
        return invokeServiceMethod(resolveService(getter), methodName, args, fallback);
    }

    function createGetterMethodInvoker(getter) {
        return (methodName, args = [], fallback = undefined) =>
            invokeGetterMethod(getter, methodName, args, fallback);
    }

    globalObj.GTVServiceInvokeUtils = Object.freeze({
        resolveService,
        invokeServiceMethod,
        invokeGetterMethod,
        createGetterMethodInvoker
    });
})(typeof window !== "undefined" ? window : globalThis);
