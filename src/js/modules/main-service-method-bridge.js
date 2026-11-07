(function initGtvMainServiceMethodBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const logWarn = (typeof safeDeps.logWarn === "function")
            ? safeDeps.logWarn
            : (typeof safeDeps.consoleWarn === "function")
                ? safeDeps.consoleWarn
                : ((...args) => {
                    if (typeof globalObj?.console?.warn === "function") {
                        globalObj.console.warn(...args);
                        return;
                    }
                    if (typeof console === "object" && console && typeof console.warn === "function") {
                        console.warn(...args);
                    }
                });
        const onWarnMissingMethod = (typeof safeDeps.onWarnMissingMethod === "function")
            ? safeDeps.onWarnMissingMethod
            : ((serviceName, methodName) => {
                logWarn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
            });
        const onMissingFeature = (typeof safeDeps.onMissingFeature === "function")
            ? safeDeps.onMissingFeature
            : (() => {});

        const missingServiceMethodWarnings = new Set();
        const missingFeatureWarnings = new Set();

        function warnMissingServiceMethod(serviceName, methodName) {
            const key = `${serviceName}.${methodName}`;
            if (missingServiceMethodWarnings.has(key)) return;
            missingServiceMethodWarnings.add(key);
            onWarnMissingMethod(serviceName, methodName);
        }

        function notifyMissingFeature(featureKey = "") {
            const key = String(featureKey || "").trim();
            if (!key) return;
            if (missingFeatureWarnings.has(key)) return;
            missingFeatureWarnings.add(key);
            onMissingFeature(key);
        }

        function getServiceMethod(serviceName, serviceRef, methodName, options = {}) {
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName].bind(serviceRef);
            }
            warnMissingServiceMethod(serviceName, methodName);
            if (options.toastOnMissing) {
                notifyMissingFeature(options.featureKey || `${serviceName}.${methodName}`);
            }
            return null;
        }

        function callServiceMethod(serviceName, serviceRef, methodName, args = [], options = {}) {
            const method = getServiceMethod(serviceName, serviceRef, methodName, options);
            if (!method) return options.fallback;
            return method(...args);
        }

        return Object.freeze({
            warnMissingServiceMethod,
            notifyMissingFeature,
            getServiceMethod,
            callServiceMethod
        });
    }

    globalObj.GTVMainServiceMethodBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
