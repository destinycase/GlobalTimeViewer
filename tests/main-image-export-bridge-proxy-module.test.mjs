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
