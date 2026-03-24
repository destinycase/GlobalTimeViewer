import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-image-render.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMultiRangeImageRenderModule(options = {}) {
    const globalPatches = {
        window: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement() {
                return {};
            },
            documentElement: {},
            body: {}
        },
        getComputedStyle: options.getComputedStyle || (() => ({
            getPropertyValue: () => "",
            backgroundColor: "#0f172a"
        })),
        console: options.console || console
    };
    const keys = ["window", "document", "getComputedStyle", "console", "GTVMultiRangeImageRender", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMultiRangeImageRender || globalThis.GTVMultiRangeImageRender;
}

describe("GTV multi-range image render module", () => {
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

    it("fallback renderer throws when multi-range container is missing", async () => {
        const module = loadMultiRangeImageRenderModule();
        const service = module.createService({
            waitForDocumentFontsReady: async () => { }
        });

        await expect(service.renderMultiRangesFallbackDataUrl()).rejects.toThrow("Multi-range container not found");
    });

    it("combined renderer delegates to fallback path", async () => {
        const module = loadMultiRangeImageRenderModule();
        const service = module.createService({
            waitForDocumentFontsReady: async () => { }
        });

        await expect(service.renderMultiRangesToPngDataUrl()).rejects.toThrow("Multi-range container not found");
    });

    it("single renderer delegates to combined renderer", async () => {
        const module = loadMultiRangeImageRenderModule();
        const service = module.createService({
            waitForDocumentFontsReady: async () => { }
        });

        await expect(service.renderMultiRangeSingleToPngDataUrl(0)).rejects.toThrow("Multi-range container not found");
    });

    it("title renderer produces image data from range titles", async () => {
        const module = loadMultiRangeImageRenderModule({
            document: {
                getElementById() {
                    return null;
                },
                createElement(tag) {
                    if (tag !== "canvas") return {};
                    return {
                        getContext() {
                            return {
                                font: "",
                                measureText(value) {
                                    return { width: String(value || "").length * 8 };
                                }
                            };
                        }
                    };
                },
                documentElement: {},
                body: {}
            }
        });
        const ctxStub = {
            fillStyle: "",
            strokeStyle: "",
            lineWidth: 1,
            fillRect() { },
            strokeRect() { }
        };
        const service = module.createService({
            EXPORT_MONO_FONT_FAMILY: "monospace",
            t: (key) => key,
            waitForDocumentFontsReady: async () => { },
            ensureMultiRangeState: () => { },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getMultiRanges: () => [{}, {}],
            getMultiRangeTitleText: (idx) => `Range ${idx + 1}`,
            prepareExportCanvas: () => ({
                canvas: {
                    toDataURL() {
                        return "data:image/png;base64,TITLES";
                    }
                },
                ctx: ctxStub
            }),
            drawExportCellText: () => { }
        });

        const dataUrl = await service.renderMultiRangeTitlesToPngDataUrl();

        expect(dataUrl).toBe("data:image/png;base64,TITLES");
    });
});
