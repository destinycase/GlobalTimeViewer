(function initGtvMainRuntimeBootstrapAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainAppBootstrapService = (typeof safeDeps.getMainAppBootstrapService === "function")
            ? safeDeps.getMainAppBootstrapService
            : (() => null);
        const getDocumentRefOrNull = (typeof safeDeps.getDocumentRefOrNull === "function")
            ? safeDeps.getDocumentRefOrNull
            : (() => ((typeof document === "object" && document) ? document : null));

        async function initApp() {
            const mainAppBootstrapService = getMainAppBootstrapService();
            if (
                !mainAppBootstrapService
                || typeof mainAppBootstrapService.initApp !== "function"
            ) {
                return undefined;
            }
            return await mainAppBootstrapService.initApp();
        }

        function startBootstrapOnDomReady(initFn = initApp) {
            const runInit = (typeof initFn === "function") ? initFn : initApp;
            const documentRef = getDocumentRefOrNull();
            if (
                documentRef
                && typeof documentRef === "object"
                && documentRef.readyState === "loading"
                && typeof documentRef.addEventListener === "function"
            ) {
                documentRef.addEventListener("DOMContentLoaded", runInit);
                return undefined;
            }
            return runInit();
        }

        return Object.freeze({
            initApp,
            startBootstrapOnDomReady
        });
    }

    globalObj.GTVMainRuntimeBootstrapAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
