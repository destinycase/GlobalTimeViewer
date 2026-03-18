import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-runtime-services.js");

function loadMainImageRuntimeServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-image-runtime-services.js" });
    return sandbox.window.GTVMainImageRuntimeServices || sandbox.GTVMainImageRuntimeServices || sandbox.globalThis.GTVMainImageRuntimeServices;
}

describe("GTV main image runtime services module", () => {
    it("creates image runtime services and wires bridge/table dependencies", () => {
        const moduleApi = loadMainImageRuntimeServicesModule();
        const docRef = { id: "doc" };
        let cloneConfig = null;
        let foreignConfig = null;
        let bridgeConfig = null;
        let tableConfig = null;
        let multiConfig = null;
        let imageExportActionsCalls = 0;

        const services = moduleApi.createService({
            GTV_IMAGE_CLONE: {
                createService: (cfg) => {
                    cloneConfig = cfg;
                    return { id: "clone" };
                }
            },
            GTV_IMAGE_FOREIGN_RENDER: {
                createService: (cfg) => {
                    foreignConfig = cfg;
                    return { id: "foreign" };
                }
            },
            GTV_IMAGE_EXPORT_BRIDGE: {
                createService: (cfg) => {
                    bridgeConfig = cfg;
                    return { id: "bridge" };
                }
            },
            GTV_TABLE_IMAGE_RENDER: {
                createService: (cfg) => {
                    tableConfig = cfg;
                    return {
                        id: "table-render",
                        extractTableCellText: (cell) => `table:${String(cell)}`
                    };
                }
            },
            GTV_MULTI_RANGE_IMAGE_RENDER: {
                createService: (cfg) => {
                    multiConfig = cfg;
                    return { id: "multi-render" };
                }
            },
            TABLE_IMAGE_EXPORT_WIDTH: 1400,
            EXPORT_MONO_FONT_FAMILY: "monospace",
            document: docRef,
            getCanUseForeignObjectRenderer: () => true,
            setCanUseForeignObjectRenderer: () => {},
            getImageExportActionsService: () => {
                imageExportActionsCalls += 1;
                return { id: "actions" };
            },
            getDefaultTableExportContext: () => ({
                table: null,
                headerSelector: "h",
                rowSelector: "r"
            }),
            isFixedTimeTab: () => false,
            waitForDocumentFontsReady: async () => {},
            prepareExportCanvas: () => ({ canvas: {}, ctx: {} }),
            drawExportCellText: () => {},
            cloneTableForImageExport: () => ({}),
            renderElementWithForeignObjectToPngDataUrl: async () => "data:image/png;base64,abc",
            t: (key) => key,
            ensureMultiRangeState: () => {},
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getMultiRanges: () => [],
            getMultiRangeTitleText: () => "Range 1",
            cloneMultiRangeBlockForImageExport: () => ({}),
            extractTableCellText: () => "fallback"
        });

        expect(services.imageCloneService.id).toBe("clone");
        expect(services.imageForeignRenderService.id).toBe("foreign");
        expect(services.imageExportBridgeService.id).toBe("bridge");
        expect(services.tableImageRenderService.id).toBe("table-render");
        expect(services.multiRangeImageRenderService.id).toBe("multi-render");

        expect(cloneConfig.document).toBe(docRef);
        expect(foreignConfig.TABLE_IMAGE_EXPORT_WIDTH).toBe(1400);
        expect(typeof tableConfig.waitForDocumentFontsReady).toBe("function");

        expect(bridgeConfig.getImageCloneService().id).toBe("clone");
        expect(bridgeConfig.getImageForeignRenderService().id).toBe("foreign");
        expect(bridgeConfig.getTableImageRenderService().id).toBe("table-render");
        expect(bridgeConfig.getMultiRangeImageRenderService().id).toBe("multi-render");
        expect(bridgeConfig.getImageExportActionsService().id).toBe("actions");
        expect(imageExportActionsCalls).toBe(1);

        expect(multiConfig.extractTableCellText("cell")).toBe("table:cell");
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainImageRuntimeServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVImageClone.createService");
    });
});
