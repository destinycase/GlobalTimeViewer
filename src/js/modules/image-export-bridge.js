(function initGtvImageExportBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVImageExportBridge] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

        const dep = Object.freeze({
            ...pickSafeCallables([
                "getDefaultTableExportContext",
                "getImageCloneService",
                "getImageForeignRenderService",
                "getTableImageRenderService",
                "getMultiRangeImageRenderService",
                "getImageExportActionsService"
            ])
        });

        function getServiceFromDep(getter) {
            const service = getter();
            return (service && typeof service === "object") ? service : null;
        }

        function getDefaultTableExportContext() {
            const fallback = dep.getDefaultTableExportContext();
            if (!fallback || typeof fallback !== "object") {
                return {
                    table: null,
                    headerSelector: "#table-head th",
                    rowSelector: "#clocks-container tr.time-row"
                };
            }
            return fallback;
        }

        function getImageCloneService() {
            return getServiceFromDep(dep.getImageCloneService);
        }

        function getImageForeignRenderService() {
            return getServiceFromDep(dep.getImageForeignRenderService);
        }

        function getTableImageRenderService() {
            return getServiceFromDep(dep.getTableImageRenderService);
        }

        function getMultiRangeImageRenderService() {
            return getServiceFromDep(dep.getMultiRangeImageRenderService);
        }

        function getImageExportActionsService() {
            return getServiceFromDep(dep.getImageExportActionsService);
        }

        function collectDocumentCssText() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.collectDocumentCssText !== "function") return "";
            return svc.collectDocumentCssText();
        }

        function cloneTableForImageExport(tableEl) {
            const svc = getImageCloneService();
            if (!svc || typeof svc.cloneTableForImageExport !== "function") return null;
            return svc.cloneTableForImageExport(tableEl);
        }

        function cloneMultiRangeBlockForImageExport(blockEl) {
            const svc = getImageCloneService();
            if (!svc || typeof svc.cloneMultiRangeBlockForImageExport !== "function") return null;
            return svc.cloneMultiRangeBlockForImageExport(blockEl);
        }

        async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.renderElementWithForeignObjectToPngDataUrl !== "function") {
                throw new Error("Foreign-object renderer unavailable");
            }
            return await svc.renderElementWithForeignObjectToPngDataUrl(renderElement);
        }

        function loadImageElement(src) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.loadImageElement !== "function") {
                return Promise.reject(new Error("Image loader unavailable"));
            }
            return svc.loadImageElement(src);
        }

        async function waitForDocumentFontsReady() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.waitForDocumentFontsReady !== "function") return;
            await svc.waitForDocumentFontsReady();
        }

        function isDomExceptionLike(err) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.isDomExceptionLike !== "function") return false;
            return !!svc.isDomExceptionLike(err);
        }

        async function detectForeignObjectRendererSupport() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.detectForeignObjectRendererSupport !== "function") return false;
            return !!(await svc.detectForeignObjectRendererSupport());
        }

        function extractTableCellText(cell) {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.extractTableCellText !== "function") return "";
            return svc.extractTableCellText(cell);
        }

        function extractTableHeaderText(cell) {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.extractTableHeaderText !== "function") return "";
            return svc.extractTableHeaderText(cell);
        }

        function getActiveTableExportContext() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.getActiveTableExportContext !== "function") {
                return getDefaultTableExportContext();
            }
            return svc.getActiveTableExportContext();
        }

        async function renderTimezoneTableFallbackDataUrl() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.renderTimezoneTableFallbackDataUrl !== "function") {
                throw new Error("Timezone table fallback renderer unavailable");
            }
            return await svc.renderTimezoneTableFallbackDataUrl();
        }

        async function renderTimezoneTableToPngDataUrl() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.renderTimezoneTableToPngDataUrl !== "function") {
                throw new Error("Timezone table renderer unavailable");
            }
            return await svc.renderTimezoneTableToPngDataUrl();
        }

        async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangesFallbackDataUrl !== "function") {
                throw new Error("Multi-range fallback renderer unavailable");
            }
            return await svc.renderMultiRangesFallbackDataUrl(targetRangeIdx);
        }

        async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangesToPngDataUrl !== "function") {
                throw new Error("Multi-range renderer unavailable");
            }
            return await svc.renderMultiRangesToPngDataUrl(targetRangeIdx);
        }

        async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangeSingleToPngDataUrl !== "function") {
                throw new Error("Multi-range single renderer unavailable");
            }
            return await svc.renderMultiRangeSingleToPngDataUrl(rangeIdx);
        }

        async function renderMultiRangeTitlesToPngDataUrl() {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangeTitlesToPngDataUrl !== "function") {
                throw new Error("Multi-range title renderer unavailable");
            }
            return await svc.renderMultiRangeTitlesToPngDataUrl();
        }

        async function saveTimezoneTableImage() {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveTimezoneTableImage !== "function") return;
            return await svc.saveTimezoneTableImage();
        }

        async function saveMultiRangeTitlesImage() {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveMultiRangeTitlesImage !== "function") return;
            return await svc.saveMultiRangeTitlesImage();
        }

        async function saveMultiRangeSingleImage(rangeIdx) {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveMultiRangeSingleImage !== "function") return;
            return await svc.saveMultiRangeSingleImage(rangeIdx);
        }

        function getImageExportDeps() {
            const svc = getImageExportActionsService();
            if (svc && typeof svc.getImageExportDeps === "function") {
                return svc.getImageExportDeps();
            }
            return {};
        }

        return Object.freeze({
            collectDocumentCssText,
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl,
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl,
            saveTimezoneTableImage,
            saveMultiRangeTitlesImage,
            saveMultiRangeSingleImage,
            getImageExportDeps
        });
    }

    globalObj.GTVImageExportBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
