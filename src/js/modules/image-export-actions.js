(function initGtvImageExportActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let boundImageExportService = null;

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof globalObj?.console?.warn === "function") {
                globalObj.console.warn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof safeDeps.consoleError === "function") {
                safeDeps.consoleError(...args);
                return;
            }
            if (typeof globalObj?.console?.error === "function") {
                globalObj.console.error(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function getWindowRef() {
            if (typeof safeDeps.getWindowRef === "function") {
                const injected = safeDeps.getWindowRef();
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getWindowRefOrNull === "function") {
                const injected = safeDeps.getWindowRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.windowRef && typeof safeDeps.windowRef === "object") return safeDeps.windowRef;
            if (safeDeps.window && typeof safeDeps.window === "object") return safeDeps.window;
            if (globalObj?.window && typeof globalObj.window === "object") return globalObj.window;
            if (typeof window === "object" && window) return window;
            return globalObj;
        }

        function getImageExportApi() {
            if (safeDeps.imageExportApi && typeof safeDeps.imageExportApi === "object") return safeDeps.imageExportApi;
            const windowRef = getWindowRef();
            if (windowRef && typeof windowRef.GTVImageExport === "object") return windowRef.GTVImageExport;
            return null;
        }

        function getImageExportDeps() {
            return {
                ...pickDeps([
                    "t",
                    "showToast",
                    "isMultiTab",
                    "ensureMultiRangeState",
                    "detectForeignObjectRendererSupport",
                    "renderTimezoneTableToPngDataUrl",
                    "renderTimezoneTableFallbackDataUrl",
                    "renderMultiRangesToPngDataUrl",
                    "renderMultiRangeSingleToPngDataUrl",
                    "renderMultiRangesFallbackDataUrl",
                    "renderMultiRangeTitlesToPngDataUrl",
                    "getTimezoneTableImageFilename",
                    "getMultiRangeTableImageFilename",
                    "getMultiRangeTitlesImageFilename",
                    "getMultiRanges",
                    "isDomExceptionLike",
                    "setCanUseForeignObjectRenderer"
                ])
            };
        }

        function getBoundImageExportService() {
            if (boundImageExportService) return boundImageExportService;
            const api = getImageExportApi();
            if (!api || typeof api.createService !== "function") return null;
            try {
                boundImageExportService = api.createService(getImageExportDeps());
            } catch (err) {
                logWarn("[GTVImageExportActions] Failed to create bound image export service.", err);
                boundImageExportService = null;
            }
            return boundImageExportService;
        }

        async function callImageExport(methodName, ...args) {
            const bound = getBoundImageExportService();
            if (bound && typeof bound[methodName] === "function") {
                return await bound[methodName](...args);
            }

            const api = getImageExportApi();
            if (api && typeof api[methodName] === "function") {
                return await api[methodName](getImageExportDeps(), ...args);
            }

            logError(`[GTVImageExportActions] Missing image export method: ${methodName}`);
            return undefined;
        }

        return Object.freeze({
            getImageExportDeps,
            saveTimezoneTableImage: () => callImageExport("saveTimezoneTableImage"),
            saveMultiRangeTitlesImage: () => callImageExport("saveMultiRangeTitlesImage"),
            saveMultiRangeAllImage: () => callImageExport("saveMultiRangeAllImage"),
            saveMultiRangeSingleImage: (rangeIdx) => callImageExport("saveMultiRangeSingleImage", rangeIdx)
        });
    }

    globalObj.GTVImageExportActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
