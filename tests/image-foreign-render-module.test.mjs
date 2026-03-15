import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-foreign-render.js");

function loadImageForeignRenderModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console: options.console || console
    };
    if (Object.prototype.hasOwnProperty.call(options, "document")) {
        sandbox.document = options.document;
    }
    if (Object.prototype.hasOwnProperty.call(options, "URL")) {
        sandbox.URL = options.URL;
    }
    if (Object.prototype.hasOwnProperty.call(options, "Blob")) {
        sandbox.Blob = options.Blob;
    }
    if (Object.prototype.hasOwnProperty.call(options, "Image")) {
        sandbox.Image = options.Image;
    }
    if (Object.prototype.hasOwnProperty.call(options, "DOMException")) {
        sandbox.DOMException = options.DOMException;
    }
    if (Object.prototype.hasOwnProperty.call(options, "getComputedStyle")) {
        sandbox.getComputedStyle = options.getComputedStyle;
    }
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/image-foreign-render.js" });
    return sandbox.window.GTVImageForeignRender || sandbox.GTVImageForeignRender || sandbox.globalThis.GTVImageForeignRender;
}

describe("GTV image foreign render module", () => {
    it("returns empty css text when document is unavailable", () => {
        const module = loadImageForeignRenderModule();
        const service = module.createService({});

        expect(service.collectDocumentCssText()).toBe("");
    });

    it("detects unsupported foreignObject renderer when URL API is unavailable", async () => {
        const module = loadImageForeignRenderModule({ URL: undefined });
        const writes = [];
        const service = module.createService({
            getCanUseForeignObjectRenderer: () => null,
            setCanUseForeignObjectRenderer: (value) => {
                writes.push(value);
            }
        });

        const supported = await service.detectForeignObjectRendererSupport();

        expect(supported).toBe(false);
        expect(writes).toEqual([false]);
    });

    it("recognizes DOM-like exception names", () => {
        const module = loadImageForeignRenderModule();
        const service = module.createService({});

        expect(service.isDomExceptionLike({ name: "SecurityError" })).toBe(true);
        expect(service.isDomExceptionLike({ name: "TypeError" })).toBe(false);
    });

    it("throws when render target is missing", async () => {
        const module = loadImageForeignRenderModule({
            document: {
                createElement() {
                    return {};
                }
            }
        });
        const service = module.createService({});

        await expect(service.renderElementWithForeignObjectToPngDataUrl(null)).rejects.toThrow("Render element not found");
    });
});

