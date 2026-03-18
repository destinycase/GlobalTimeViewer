(function initGtvMainImageExportBridgeProxy(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getImageExportBridgeService = (typeof safeDeps.getImageExportBridgeService === "function")
            ? safeDeps.getImageExportBridgeService
            : (() => {
                if (!safeDeps.imageExportBridgeService || typeof safeDeps.imageExportBridgeService !== "object") return null;
                return safeDeps.imageExportBridgeService;
            });
        const getDefaultTableExportContext = (typeof safeDeps.getDefaultTableExportContext === "function")
            ? safeDeps.getDefaultTableExportContext
            : (() => ({
                table: null,
                headerSelector: "#table-head th",
                rowSelector: "#clocks-container tr.time-row"
            }));

        function getBridgeService() {
            const service = getImageExportBridgeService();
            if (!service || typeof service !== "object") return null;
            return service;
        }

        function collectDocumentCssText() {
            const service = getBridgeService();
            if (!service || typeof service.collectDocumentCssText !== "function") return "";
            return service.collectDocumentCssText();
        }

        function cloneTableForImageExport(tableEl) {
            const service = getBridgeService();
            if (!service || typeof service.cloneTableForImageExport !== "function") return null;
            return service.cloneTableForImageExport(tableEl);
        }

        function cloneMultiRangeBlockForImageExport(blockEl) {
            const service = getBridgeService();
            if (!service || typeof service.cloneMultiRangeBlockForImageExport !== "function") return null;
            return service.cloneMultiRangeBlockForImageExport(blockEl);
        }

        async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
            const service = getBridgeService();
            if (!service || typeof service.renderElementWithForeignObjectToPngDataUrl !== "function") {
                throw new Error("Foreign-object renderer unavailable");
            }
            return await service.renderElementWithForeignObjectToPngDataUrl(renderElement);
        }

        function loadImageElement(src) {
            const service = getBridgeService();
            if (!service || typeof service.loadImageElement !== "function") {
                return Promise.reject(new Error("Image loader unavailable"));
            }
            return service.loadImageElement(src);
        }

        async function waitForDocumentFontsReady() {
            const service = getBridgeService();
            if (!service || typeof service.waitForDocumentFontsReady !== "function") return;
            await service.waitForDocumentFontsReady();
        }

        function isDomExceptionLike(err) {
            const service = getBridgeService();
            if (!service || typeof service.isDomExceptionLike !== "function") return false;
            return service.isDomExceptionLike(err);
        }

        async function detectForeignObjectRendererSupport() {
            const service = getBridgeService();
            if (!service || typeof service.detectForeignObjectRendererSupport !== "function") return false;
            return await service.detectForeignObjectRendererSupport();
        }

        function extractTableCellText(cell) {
            const service = getBridgeService();
            if (!service || typeof service.extractTableCellText !== "function") return "";
            return service.extractTableCellText(cell);
        }

        function extractTableHeaderText(cell) {
            const service = getBridgeService();
            if (!service || typeof service.extractTableHeaderText !== "function") return "";
            return service.extractTableHeaderText(cell);
        }

        function getActiveTableExportContext() {
            const service = getBridgeService();
            if (!service || typeof service.getActiveTableExportContext !== "function") {
                return getDefaultTableExportContext();
            }
            return service.getActiveTableExportContext();
        }

        async function renderTimezoneTableFallbackDataUrl() {
            const service = getBridgeService();
            if (!service || typeof service.renderTimezoneTableFallbackDataUrl !== "function") {
                throw new Error("Timezone table fallback renderer unavailable");
            }
            return await service.renderTimezoneTableFallbackDataUrl();
        }

        async function renderTimezoneTableToPngDataUrl() {
            const service = getBridgeService();
            if (!service || typeof service.renderTimezoneTableToPngDataUrl !== "function") {
                throw new Error("Timezone table renderer unavailable");
            }
            return await service.renderTimezoneTableToPngDataUrl();
        }

        async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
            const service = getBridgeService();
            if (!service || typeof service.renderMultiRangesFallbackDataUrl !== "function") {
                throw new Error("Multi-range fallback renderer unavailable");
            }
            return await service.renderMultiRangesFallbackDataUrl(targetRangeIdx);
        }

        async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
            const service = getBridgeService();
            if (!service || typeof service.renderMultiRangesToPngDataUrl !== "function") {
                throw new Error("Multi-range renderer unavailable");
            }
            return await service.renderMultiRangesToPngDataUrl(targetRangeIdx);
        }

        async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
            const service = getBridgeService();
            if (!service || typeof service.renderMultiRangeSingleToPngDataUrl !== "function") {
                throw new Error("Multi-range single renderer unavailable");
            }
            return await service.renderMultiRangeSingleToPngDataUrl(rangeIdx);
        }

        async function renderMultiRangeTitlesToPngDataUrl() {
            const service = getBridgeService();
            if (!service || typeof service.renderMultiRangeTitlesToPngDataUrl !== "function") {
                throw new Error("Multi-range title renderer unavailable");
            }
            return await service.renderMultiRangeTitlesToPngDataUrl();
        }

        async function saveTimezoneTableImage() {
            const service = getBridgeService();
            if (!service || typeof service.saveTimezoneTableImage !== "function") return;
            return await service.saveTimezoneTableImage();
        }

        async function saveMultiRangeTitlesImage() {
            const service = getBridgeService();
            if (!service || typeof service.saveMultiRangeTitlesImage !== "function") return;
            return await service.saveMultiRangeTitlesImage();
        }

        async function saveMultiRangeSingleImage(rangeIdx) {
            const service = getBridgeService();
            if (!service || typeof service.saveMultiRangeSingleImage !== "function") return;
            return await service.saveMultiRangeSingleImage(rangeIdx);
        }

        function getImageExportDeps() {
            const service = getBridgeService();
            if (!service || typeof service.getImageExportDeps !== "function") return {};
            return service.getImageExportDeps();
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

    globalObj.GTVMainImageExportBridgeProxy = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
