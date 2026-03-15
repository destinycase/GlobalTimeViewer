import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-bridge.js");

function loadImageExportBridgeModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/image-export-bridge.js" });
    return sandbox.window.GTVImageExportBridge || sandbox.GTVImageExportBridge || sandbox.globalThis.GTVImageExportBridge;
}

describe("GTV image export bridge module", () => {
    it("delegates bridge calls to underlying services", async () => {
        const module = loadImageExportBridgeModule();
        const service = module.createService({
            getImageCloneService: () => ({
                cloneTableForImageExport: () => "table-clone",
                cloneMultiRangeBlockForImageExport: () => "block-clone"
            }),
            getImageForeignRenderService: () => ({
                collectDocumentCssText: () => "body{}",
                renderElementWithForeignObjectToPngDataUrl: async () => "data:image/png;base64,FO",
                loadImageElement: async () => ({ ok: true }),
                waitForDocumentFontsReady: async () => {},
                isDomExceptionLike: (err) => !!err,
                detectForeignObjectRendererSupport: async () => true
            }),
            getTableImageRenderService: () => ({
                extractTableCellText: () => "cell",
                extractTableHeaderText: () => "head",
                getActiveTableExportContext: () => ({ table: { id: 1 }, headerSelector: "h", rowSelector: "r" }),
                renderTimezoneTableFallbackDataUrl: async () => "fallback",
                renderTimezoneTableToPngDataUrl: async () => "timezone"
            }),
            getMultiRangeImageRenderService: () => ({
                renderMultiRangesFallbackDataUrl: async (idx) => `mr-fallback:${idx}`,
                renderMultiRangesToPngDataUrl: async (idx) => `mr:${idx}`,
                renderMultiRangeSingleToPngDataUrl: async (idx) => `single:${idx}`,
                renderMultiRangeTitlesToPngDataUrl: async () => "titles"
            }),
            getImageExportActionsService: () => ({
                saveTimezoneTableImage: async () => "saved-tz",
                saveMultiRangeTitlesImage: async () => "saved-titles",
                saveMultiRangeSingleImage: async (idx) => `saved-single:${idx}`,
                getImageExportDeps: () => ({ a: 1 })
            })
        });

        expect(service.collectDocumentCssText()).toBe("body{}");
        expect(service.cloneTableForImageExport({})).toBe("table-clone");
        expect(service.cloneMultiRangeBlockForImageExport({})).toBe("block-clone");
        await expect(service.renderElementWithForeignObjectToPngDataUrl({})).resolves.toBe("data:image/png;base64,FO");
        await expect(service.loadImageElement("x")).resolves.toEqual({ ok: true });
        await expect(service.detectForeignObjectRendererSupport()).resolves.toBe(true);
        expect(service.isDomExceptionLike(new Error("x"))).toBe(true);
        expect(service.extractTableCellText({})).toBe("cell");
        expect(service.extractTableHeaderText({})).toBe("head");
        expect(service.getActiveTableExportContext()).toEqual({ table: { id: 1 }, headerSelector: "h", rowSelector: "r" });
        await expect(service.renderTimezoneTableFallbackDataUrl()).resolves.toBe("fallback");
        await expect(service.renderTimezoneTableToPngDataUrl()).resolves.toBe("timezone");
        await expect(service.renderMultiRangesFallbackDataUrl(3)).resolves.toBe("mr-fallback:3");
        await expect(service.renderMultiRangesToPngDataUrl(2)).resolves.toBe("mr:2");
        await expect(service.renderMultiRangeSingleToPngDataUrl(1)).resolves.toBe("single:1");
        await expect(service.renderMultiRangeTitlesToPngDataUrl()).resolves.toBe("titles");
        await expect(service.saveTimezoneTableImage()).resolves.toBe("saved-tz");
        await expect(service.saveMultiRangeTitlesImage()).resolves.toBe("saved-titles");
        await expect(service.saveMultiRangeSingleImage(7)).resolves.toBe("saved-single:7");
        expect(service.getImageExportDeps()).toEqual({ a: 1 });
    });

    it("uses fallback behavior when services are unavailable", async () => {
        const module = loadImageExportBridgeModule();
        const service = module.createService({
            getDefaultTableExportContext: () => ({
                table: null,
                headerSelector: "#h",
                rowSelector: "#r"
            })
        });

        expect(service.collectDocumentCssText()).toBe("");
        expect(service.cloneTableForImageExport({})).toBeNull();
        expect(service.cloneMultiRangeBlockForImageExport({})).toBeNull();
        expect(service.extractTableCellText({})).toBe("");
        expect(service.extractTableHeaderText({})).toBe("");
        expect(service.getActiveTableExportContext()).toEqual({
            table: null,
            headerSelector: "#h",
            rowSelector: "#r"
        });
        expect(service.getImageExportDeps()).toEqual({});
        await expect(service.loadImageElement("x")).rejects.toThrow("Image loader unavailable");
        await expect(service.renderTimezoneTableToPngDataUrl()).rejects.toThrow("Timezone table renderer unavailable");
        await expect(service.renderMultiRangesToPngDataUrl()).rejects.toThrow("Multi-range renderer unavailable");
    });
});
