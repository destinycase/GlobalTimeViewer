(function initGtvMainRuntimeServiceBridgeAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainRuntimeServiceBridgeHelpersService = (
            typeof safeDeps.getMainRuntimeServiceBridgeHelpersService === "function"
        )
            ? safeDeps.getMainRuntimeServiceBridgeHelpersService
            : (() => null);
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

        function warnMissingServiceMethod(serviceName, methodName) {
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.warnMissingServiceMethod === "function") {
                return runtimeService.warnMissingServiceMethod(serviceName, methodName);
            }
            const bridgeService = getMainServiceMethodBridgeService();
            if (bridgeService && typeof bridgeService.warnMissingServiceMethod === "function") {
                return bridgeService.warnMissingServiceMethod(serviceName, methodName);
            }
            logWarn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
        }

        function showMissingFeatureToastOnce(featureKey = "") {
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.showMissingFeatureToastOnce === "function") {
                return runtimeService.showMissingFeatureToastOnce(featureKey);
            }
            const key = String(featureKey || "").trim();
            if (!key) return;
            const messageKey = "toast_required_feature_module_missing";
            const localized = getTranslator()(messageKey);
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
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.getServiceMethod === "function") {
                return runtimeService.getServiceMethod(serviceName, serviceRef, methodName, options);
            }
            const bridgeService = getMainServiceMethodBridgeService();
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
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.callServiceMethod === "function") {
                return runtimeService.callServiceMethod(serviceName, serviceRef, methodName, args, options);
            }
            const method = getServiceMethod(serviceName, serviceRef, methodName, options);
            if (!method) return options.fallback;
            return method(...args);
        }

        function savePersistenceSafely(...args) {
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.savePersistenceSafely === "function") {
                return runtimeService.savePersistenceSafely(...args);
            }
            return callServiceMethod(
                "persistenceService",
                getPersistenceService(),
                "savePersistence",
                args
            );
        }

        function renderMultiRangesSafely() {
            const runtimeService = getMainRuntimeServiceBridgeHelpersService();
            if (runtimeService && typeof runtimeService.renderMultiRangesSafely === "function") {
                return runtimeService.renderMultiRangesSafely();
            }
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

    globalObj.GTVMainRuntimeServiceBridgeAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
