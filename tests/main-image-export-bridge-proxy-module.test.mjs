import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-bridge-proxy.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainImageExportBridgeProxyModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainImageExportBridgeProxy", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainImageExportBridgeProxy || globalThis.GTVMainImageExportBridgeProxy;
}

describe("GTV main image export bridge proxy module", () => {
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
    it("delegates to bridge methods across sync and async wrappers", async () => {
        const moduleApi = loadMainImageExportBridgeProxyModule();
        const calls = [];
        const proxy = moduleApi.createService({
            getImageExportBridgeService: () => ({
                collectDocumentCssText: () => "css",
                cloneTableForImageExport: (tableEl) => ({ tableEl }),
                cloneMultiRangeBlockForImageExport: (blockEl) => ({ blockEl }),
                renderElementWithForeignObjectToPngDataUrl: async (renderElement) => `fo:${renderElement?.id || "none"}`,
                loadImageElement: (src) => Promise.resolve(`img:${src}`),
                waitForDocumentFontsReady: async () => {
                    calls.push("fonts");
                },
                isDomExceptionLike: (err) => err?.name === "DOMException",
                detectForeignObjectRendererSupport: async () => true,
                extractTableCellText: (cell) => `cell:${String(cell || "")}`,
                extractTableHeaderText: (cell) => `head:${String(cell || "")}`,
                getActiveTableExportContext: () => ({ table: "t", headerSelector: "h", rowSelector: "r" }),
                renderTimezoneTableFallbackDataUrl: async () => "tz-fallback",
                renderTimezoneTableToPngDataUrl: async () => "data:image/png;base64,aaa",
                renderMultiRangesFallbackDataUrl: async (targetRangeIdx) => `multi-fallback:${targetRangeIdx}`,
                renderMultiRangesToPngDataUrl: async (targetRangeIdx) => `multi:${targetRangeIdx}`,
                renderMultiRangeSingleToPngDataUrl: async (rangeIdx) => `single:${rangeIdx}`,
                renderMultiRangeTitlesToPngDataUrl: async () => "titles",
                saveTimezoneTableImage: async () => {
                    calls.push("save-tz");
                    return "saved-tz";
                },
                saveMultiRangeTitlesImage: async () => {
                    calls.push("save-titles");
                    return "saved-titles";
                },
                saveMultiRangeSingleImage: async (rangeIdx) => {
                    calls.push(`save-single:${rangeIdx}`);
                    return `saved-single:${rangeIdx}`;
                },
                getImageExportDeps: () => ({ ok: true })
            }),
            getDefaultTableExportContext: () => ({
                table: null,
                headerSelector: "#default-h",
                rowSelector: "#default-r"
            })
        });

        expect(proxy.collectDocumentCssText()).toBe("css");
        expect(proxy.cloneTableForImageExport("table").tableEl).toBe("table");
        expect(proxy.cloneMultiRangeBlockForImageExport("block").blockEl).toBe("block");
        expect(await proxy.renderElementWithForeignObjectToPngDataUrl({ id: "target" })).toBe("fo:target");
        expect(await proxy.loadImageElement("src")).toBe("img:src");
        await expect(proxy.waitForDocumentFontsReady()).resolves.toBeUndefined();
        expect(proxy.isDomExceptionLike({ name: "DOMException" })).toBe(true);
        expect(await proxy.detectForeignObjectRendererSupport()).toBe(true);
        expect(proxy.extractTableCellText("A1")).toBe("cell:A1");
        expect(proxy.extractTableHeaderText("H1")).toBe("head:H1");
        expect(proxy.getActiveTableExportContext().rowSelector).toBe("r");
        expect(await proxy.renderTimezoneTableFallbackDataUrl()).toBe("tz-fallback");
        expect(await proxy.renderTimezoneTableToPngDataUrl()).toBe("data:image/png;base64,aaa");
        expect(await proxy.renderMultiRangesFallbackDataUrl(2)).toBe("multi-fallback:2");
        expect(await proxy.renderMultiRangesToPngDataUrl(4)).toBe("multi:4");
        expect(await proxy.renderMultiRangeSingleToPngDataUrl(5)).toBe("single:5");
        expect(await proxy.renderMultiRangeTitlesToPngDataUrl()).toBe("titles");
        expect(await proxy.saveTimezoneTableImage()).toBe("saved-tz");
        expect(await proxy.saveMultiRangeTitlesImage()).toBe("saved-titles");
        expect(await proxy.saveMultiRangeSingleImage(3)).toBe("saved-single:3");
        expect(calls).toEqual(["fonts", "save-tz", "save-titles", "save-single:3"]);
        expect(proxy.getImageExportDeps()).toEqual({ ok: true });
    });

    it("falls back to imageExportBridgeService object and custom default table context", async () => {
        const moduleApi = loadMainImageExportBridgeProxyModule();
        const proxy = moduleApi.createService({
            imageExportBridgeService: {
                collectDocumentCssText: () => "from-object"
            },
            getDefaultTableExportContext: () => ({
                table: "fallback-table",
                headerSelector: "#h",
                rowSelector: "#r"
            })
        });

        expect(proxy.collectDocumentCssText()).toBe("from-object");
        expect(proxy.getActiveTableExportContext()).toEqual({
            table: "fallback-table",
            headerSelector: "#h",
            rowSelector: "#r"
        });
        await expect(proxy.saveTimezoneTableImage()).resolves.toBeUndefined();
        await expect(proxy.saveMultiRangeTitlesImage()).resolves.toBeUndefined();
        await expect(proxy.saveMultiRangeSingleImage(9)).resolves.toBeUndefined();
    });

    it("returns fallback values and throws expected errors when bridge service is missing", async () => {
        const moduleApi = loadMainImageExportBridgeProxyModule();
        const proxy = moduleApi.createService({
            getImageExportBridgeService: () => null
        });

        expect(proxy.collectDocumentCssText()).toBe("");
        expect(proxy.cloneTableForImageExport("table")).toBe(null);
        expect(proxy.cloneMultiRangeBlockForImageExport("block")).toBe(null);
        expect(proxy.extractTableCellText("A1")).toBe("");
        expect(proxy.extractTableHeaderText("H1")).toBe("");
        expect(proxy.isDomExceptionLike({ name: "DOMException" })).toBe(false);
        expect(await proxy.detectForeignObjectRendererSupport()).toBe(false);
        expect(proxy.getActiveTableExportContext()).toEqual({
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        });
        expect(proxy.getImageExportDeps()).toEqual({});

        await expect(proxy.waitForDocumentFontsReady()).resolves.toBeUndefined();
        await expect(proxy.loadImageElement("src")).rejects.toThrow("Image loader unavailable");
        await expect(proxy.renderTimezoneTableFallbackDataUrl()).rejects.toThrow("Timezone table fallback renderer unavailable");
        await expect(proxy.renderTimezoneTableToPngDataUrl()).rejects.toThrow("Timezone table renderer unavailable");
        await expect(proxy.renderMultiRangesFallbackDataUrl(1)).rejects.toThrow("Multi-range fallback renderer unavailable");
        await expect(proxy.renderMultiRangesToPngDataUrl(1)).rejects.toThrow("Multi-range renderer unavailable");
        await expect(proxy.renderMultiRangeSingleToPngDataUrl(1)).rejects.toThrow("Multi-range single renderer unavailable");
        await expect(proxy.renderMultiRangeTitlesToPngDataUrl()).rejects.toThrow("Multi-range title renderer unavailable");
        await expect(proxy.renderElementWithForeignObjectToPngDataUrl({})).rejects.toThrow("Foreign-object renderer unavailable");
        await expect(proxy.saveTimezoneTableImage()).resolves.toBeUndefined();
        await expect(proxy.saveMultiRangeTitlesImage()).resolves.toBeUndefined();
        await expect(proxy.saveMultiRangeSingleImage(1)).resolves.toBeUndefined();
    });
});
