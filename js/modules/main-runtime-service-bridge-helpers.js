(function initGtvMainRuntimeServiceBridgeHelpers(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainServiceMethodBridgeService = (typeof safeDeps.getMainServiceMethodBridgeService === "function")
            ? safeDeps.getMainServiceMethodBridgeService
            : (() => null);
        const getAppFeedbackService = (typeof safeDeps.getAppFeedbackService === "function")
            ? safeDeps.getAppFeedbackService
            : (() => null);
        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const getMainMultiRangeTabFacadeService = (typeof safeDeps.getMainMultiRangeTabFacadeService === "function")
            ? safeDeps.getMainMultiRangeTabFacadeService
            : (() => null);
        const getTranslator = (typeof safeDeps.getTranslator === "function")
            ? safeDeps.getTranslator
            : (() => ((key) => String(key ?? "")));
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
        const warnFallback = (typeof safeDeps.warnFallback === "function")
            ? safeDeps.warnFallback
            : ((serviceName, methodName) => {
                logWarn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
            });

        function getBridgeService() {
            const bridgeService = getMainServiceMethodBridgeService();
            return (bridgeService && typeof bridgeService === "object") ? bridgeService : null;
        }

        function warnMissingServiceMethod(serviceName, methodName) {
            const bridgeService = getBridgeService();
            if (bridgeService && typeof bridgeService.warnMissingServiceMethod === "function") {
                return bridgeService.warnMissingServiceMethod(serviceName, methodName);
            }
            return warnFallback(serviceName, methodName);
        }

        function showMissingFeatureToastOnce(featureKey = "") {
            const key = String(featureKey || "").trim();
            if (!key) return;
            const messageKey = "toast_required_feature_module_missing";
            const t = getTranslator();
            const localized = t(messageKey);
            const message = (typeof localized === "string" && localized !== messageKey)
                ? localized
                : "A required feature module is unavailable. Refresh and try again.";
            callServiceMethod(
                "appFeedbackService",
                getAppFeedbackService(),
                "showToast",
                [message, { type: "warning" }]
            );
        }

        function getServiceMethod(serviceName, serviceRef, methodName, options = {}) {
            const bridgeService = getBridgeService();
            if (bridgeService && typeof bridgeService.getServiceMethod === "function") {
                return bridgeService.getServiceMethod(serviceName, serviceRef, methodName, options);
            }
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName].bind(serviceRef);
            }
            warnMissingServiceMethod(serviceName, methodName);
            if (options.toastOnMissing) {
                showMissingFeatureToastOnce(options.featureKey || `${serviceName}.${methodName}`);
            }
            return null;
        }

        function callServiceMethod(serviceName, serviceRef, methodName, args = [], options = {}) {
            const bridgeService = getBridgeService();
            if (bridgeService && typeof bridgeService.callServiceMethod === "function") {
                return bridgeService.callServiceMethod(serviceName, serviceRef, methodName, args, options);
            }
            const method = getServiceMethod(serviceName, serviceRef, methodName, options);
            if (!method) return options.fallback;
            return method(...args);
        }

        function savePersistenceSafely(...args) {
            return callServiceMethod(
                "persistenceService",
                getPersistenceService(),
                "savePersistence",
                args
            );
        }

        function renderMultiRangesSafely() {
            return callServiceMethod(
                "mainMultiRangeTabFacadeService",
                getMainMultiRangeTabFacadeService(),
                "renderMultiRanges",
                [],
                { fallback: undefined }
            );
        }

        return Object.freeze({
            warnMissingServiceMethod,
            showMissingFeatureToastOnce,
            getServiceMethod,
            callServiceMethod,
            savePersistenceSafely,
            renderMultiRangesSafely
        });
    }

    globalObj.GTVMainRuntimeServiceBridgeHelpers = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
