import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-table-image-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeTableImageBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeTableImageBootstrap", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return (
        globalThis.window?.GTVMainRuntimeTableImageBootstrap
        || globalThis.GTVMainRuntimeTableImageBootstrap
    );
}

describe("GTV main runtime table-image bootstrap module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });

    it("builds table/image runtime services using builder and core factories", () => {
        const moduleApi = loadMainRuntimeTableImageBootstrapModule();
        const buildTimeInputMutationsConfig = vi.fn(() => ({ kind: "time-input-config" }));
        const buildMainRowOrderConfig = vi.fn(() => ({ kind: "row-order-config" }));
        const buildMainRowViewConfig = vi.fn(() => ({ kind: "row-view-config" }));
        const buildTableRenderConfig = vi.fn(() => ({ kind: "table-render-config" }));
        const buildMainImageExportBridgeProxyConfig = vi.fn(() => ({ kind: "image-bridge-config" }));
        const buildMainImageRuntimeServicesConfig = vi.fn(() => ({ kind: "image-runtime-config" }));

        const createTimeInputMutationsService = vi.fn(() => ({ name: "time-input-service" }));
        const createMainRowOrderServices = vi.fn(() => ({
            bindRowContainerDragAndDrop: () => "bind-dnd",
            initDragAndDrop: () => "init-dnd",
            captureReorderableRowRects: () => "capture-rects",
            animateReorderTransition: () => "animate-reorder",
            getAfter: () => "after-row",
            saveOrderForContainer: () => "save-container-order",
            saveOrder: () => "save-order"
        }));
        const createMainRowViewServices = vi.fn(() => ({
            updateRow: () => "row-updated"
        }));
        const createTableRenderService = vi.fn(() => ({ name: "table-render-service" }));
        const createMainImageExportBridgeProxy = vi.fn(() => ({
            collectDocumentCssText: () => "css",
            cloneTableForImageExport: () => "clone-table",
            cloneMultiRangeBlockForImageExport: () => "clone-range",
            renderElementWithForeignObjectToPngDataUrl: async () => "png-url",
            loadImageElement: async () => ({ width: 1 }),
            waitForDocumentFontsReady: async () => undefined,
            isDomExceptionLike: () => false,
            detectForeignObjectRendererSupport: async () => true,
            extractTableCellText: () => "cell",
            extractTableHeaderText: () => "header",
            getActiveTableExportContext: () => ({ table: true }),
            renderTimezoneTableFallbackDataUrl: async () => "fallback-table",
            renderTimezoneTableToPngDataUrl: async () => "table",
            renderMultiRangesFallbackDataUrl: async () => "fallback-ranges",
            renderMultiRangesToPngDataUrl: async () => "ranges",
            renderMultiRangeSingleToPngDataUrl: async () => "single-range",
            renderMultiRangeTitlesToPngDataUrl: async () => "range-titles",
            saveTimezoneTableImage: async () => undefined,
            saveMultiRangeTitlesImage: async () => undefined,
            saveMultiRangeSingleImage: async () => undefined,
            getImageExportDeps: () => ({ deps: true })
        }));
        const createMainImageRuntimeServices = vi.fn(() => ({
            imageCloneService: { name: "clone-service" },
            imageForeignRenderService: { name: "foreign-render-service" },
            imageExportBridgeService: { name: "image-bridge-service" },
            tableImageRenderService: { name: "table-image-render-service" },
            multiRangeImageRenderService: { name: "multi-range-image-render-service" }
        }));

        const service = moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {
                buildTimeInputMutationsConfig,
                buildMainRowOrderConfig,
                buildMainRowViewConfig,
                buildTableRenderConfig,
                buildMainImageExportBridgeProxyConfig,
                buildMainImageRuntimeServicesConfig
            },
            mainCoreServices: {
                createTimeInputMutationsService,
                createMainRowOrderServices,
                createMainRowViewServices,
                createTableRenderService,
                createMainImageExportBridgeProxy,
                createMainImageRuntimeServices
            }
        });

        expect(buildTimeInputMutationsConfig).toHaveBeenCalledTimes(1);
        expect(buildMainRowOrderConfig).toHaveBeenCalledTimes(1);
        expect(buildMainRowViewConfig).toHaveBeenCalledTimes(1);
        expect(buildTableRenderConfig).toHaveBeenCalledTimes(1);
        expect(buildMainImageExportBridgeProxyConfig).toHaveBeenCalledTimes(1);
        expect(buildMainImageRuntimeServicesConfig).toHaveBeenCalledTimes(1);

        expect(createTimeInputMutationsService).toHaveBeenCalledWith({ kind: "time-input-config" });
        expect(createMainRowOrderServices).toHaveBeenCalledWith({ kind: "row-order-config" });
        expect(createMainRowViewServices).toHaveBeenCalledWith({ kind: "row-view-config" });
        expect(createTableRenderService).toHaveBeenCalledWith({ kind: "table-render-config" });
        expect(createMainImageExportBridgeProxy).toHaveBeenCalledWith({ kind: "image-bridge-config" });
        expect(createMainImageRuntimeServices).toHaveBeenCalledWith({ kind: "image-runtime-config" });

        expect(service.timeInputMutationsService).toEqual({ name: "time-input-service" });
        expect(service.tableRenderService).toEqual({ name: "table-render-service" });
        expect(service.imageExportBridgeService).toEqual({ name: "image-bridge-service" });
        expect(service.multiRangeImageRenderService).toEqual({ name: "multi-range-image-render-service" });
        expect(typeof service.saveOrder).toBe("function");
        expect(typeof service.saveTimezoneTableImage).toBe("function");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors when required contracts are missing", () => {
        const moduleApi = loadMainRuntimeTableImageBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService.buildTimeInputMutationsConfig"
        );
    });
});
