import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-bridge-proxy.js");

function loadMainImageExportBridgeProxyModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-image-export-bridge-proxy.js" });
    return sandbox.window.GTVMainImageExportBridgeProxy
        || sandbox.GTVMainImageExportBridgeProxy
        || sandbox.globalThis.GTVMainImageExportBridgeProxy;
}

describe("GTV main image export bridge proxy module", () => {
    it("delegates to image export bridge service and preserves fallback defaults", async () => {
        const moduleApi = loadMainImageExportBridgeProxyModule();
        const calls = [];
        const proxy = moduleApi.createService({
            getImageExportBridgeService: () => ({
                collectDocumentCssText: () => "css",
                cloneTableForImageExport: (tableEl) => ({ tableEl }),
                loadImageElement: (src) => `img:${src}`,
                getActiveTableExportContext: () => ({ table: "t", headerSelector: "h", rowSelector: "r" }),
                renderTimezoneTableToPngDataUrl: async () => "data:image/png;base64,aaa",
                saveMultiRangeSingleImage: async (rangeIdx) => {
                    calls.push(rangeIdx);
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
        expect(proxy.loadImageElement("src")).toBe("img:src");
        expect(proxy.getActiveTableExportContext().rowSelector).toBe("r");
        expect(await proxy.renderTimezoneTableToPngDataUrl()).toBe("data:image/png;base64,aaa");
        await proxy.saveMultiRangeSingleImage(3);
        expect(calls).toEqual([3]);
        expect(proxy.getImageExportDeps()).toEqual({ ok: true });
    });

    it("returns fallback values and throws expected errors when bridge service is missing", async () => {
        const moduleApi = loadMainImageExportBridgeProxyModule();
        const proxy = moduleApi.createService({
            getImageExportBridgeService: () => null
        });

        expect(proxy.collectDocumentCssText()).toBe("");
        expect(proxy.cloneTableForImageExport("table")).toBe(null);
        expect(proxy.getActiveTableExportContext()).toEqual({
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        });
        expect(proxy.getImageExportDeps()).toEqual({});

        await expect(proxy.renderTimezoneTableToPngDataUrl()).rejects.toThrow("Timezone table renderer unavailable");
        await expect(proxy.renderElementWithForeignObjectToPngDataUrl({})).rejects.toThrow("Foreign-object renderer unavailable");
    });
});
