(function initGtvMainFacadeMethodBinder(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);

        function deriveFacadeServiceName(getFacade, fallbackName = "facadeService") {
            if (typeof getFacade !== "function") return fallbackName;
            const getterName = (typeof getFacade.name === "string") ? getFacade.name.trim() : "";
            if (!getterName) return fallbackName;

            const withoutGetPrefix = getterName.startsWith("get")
                ? getterName.slice(3)
                : getterName;
            const withoutRefSuffix = withoutGetPrefix.endsWith("Ref")
                ? withoutGetPrefix.slice(0, -3)
                : withoutGetPrefix;
            if (!withoutRefSuffix) return fallbackName;

            return withoutRefSuffix.charAt(0).toLowerCase() + withoutRefSuffix.slice(1);
        }

        function bindFacadeMethod(getFacade, methodName, options = {}) {
            const safeOptions = (options && typeof options === "object") ? options : {};
            const serviceName = String(
                safeOptions.serviceName || deriveFacadeServiceName(getFacade)
            ).trim() || "facadeService";

            return (...args) => callServiceMethod(
                serviceName,
                (typeof getFacade === "function") ? getFacade() : null,
                methodName,
                args,
                safeOptions
            );
        }

        return Object.freeze({
            deriveFacadeServiceName,
            bindFacadeMethod
        });
    }

    globalObj.GTVMainFacadeMethodBinder = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
