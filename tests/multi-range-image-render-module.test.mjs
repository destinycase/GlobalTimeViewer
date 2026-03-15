import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-image-render.js");

function loadMultiRangeImageRenderModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
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
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-range-image-render.js" });
    return sandbox.window.GTVMultiRangeImageRender || sandbox.GTVMultiRangeImageRender || sandbox.globalThis.GTVMultiRangeImageRender;
}

describe("GTV multi-range image render module", () => {
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

