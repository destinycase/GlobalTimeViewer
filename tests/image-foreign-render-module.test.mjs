import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-foreign-render.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadImageForeignRenderModule(options = {}) {
    const globalPatches = {
        window: {},
        console: options.console || console
    };
    if (Object.prototype.hasOwnProperty.call(options, "document")) {
        globalPatches.document = options.document;
    }
    if (Object.prototype.hasOwnProperty.call(options, "URL")) {
        globalPatches.URL = options.URL;
    }
    if (Object.prototype.hasOwnProperty.call(options, "Blob")) {
        globalPatches.Blob = options.Blob;
    }
    if (Object.prototype.hasOwnProperty.call(options, "Image")) {
        globalPatches.Image = options.Image;
    }
    if (Object.prototype.hasOwnProperty.call(options, "DOMException")) {
        globalPatches.DOMException = options.DOMException;
    }
    if (Object.prototype.hasOwnProperty.call(options, "getComputedStyle")) {
        globalPatches.getComputedStyle = options.getComputedStyle;
    }
    const keys = [
        "window",
        "console",
        "document",
        "URL",
        "Blob",
        "Image",
        "DOMException",
        "getComputedStyle",
        "GTVImageForeignRender",
        ...Object.keys(globalPatches)
    ];
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

    return globalThis.window?.GTVImageForeignRender || globalThis.GTVImageForeignRender;
}

describe("GTV image foreign render module", () => {
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

    it("returns cached foreignObject support value without probing", async () => {
        const module = loadImageForeignRenderModule();
        const writes = [];
        const service = module.createService({
            getCanUseForeignObjectRenderer: () => true,
            setCanUseForeignObjectRenderer: (value) => writes.push(value)
        });

        await expect(service.detectForeignObjectRendererSupport()).resolves.toBe(true);
        expect(writes).toEqual([]);
    });

    it("marks unsupported when document createElement or Blob constructor is unavailable", async () => {
        const urlMock = {
            createObjectURL: () => "blob:mock",
            revokeObjectURL: () => {}
        };

        const noDocModule = loadImageForeignRenderModule({
            document: {},
            URL: urlMock,
            Blob: class FakeBlob {}
        });
        const noDocWrites = [];
        const noDocService = noDocModule.createService({
            getCanUseForeignObjectRenderer: () => null,
            setCanUseForeignObjectRenderer: (value) => noDocWrites.push(value)
        });
        await expect(noDocService.detectForeignObjectRendererSupport()).resolves.toBe(false);
        expect(noDocWrites).toEqual([false]);

        const noBlobModule = loadImageForeignRenderModule({
            document: { createElement: () => ({}) },
            URL: urlMock,
            Blob: undefined
        });
        const noBlobWrites = [];
        const noBlobService = noBlobModule.createService({
            getCanUseForeignObjectRenderer: () => null,
            setCanUseForeignObjectRenderer: (value) => noBlobWrites.push(value)
        });
        await expect(noBlobService.detectForeignObjectRendererSupport()).resolves.toBe(false);
        expect(noBlobWrites).toEqual([false]);
    });

    it("recognizes DOM-like exception names", () => {
        const module = loadImageForeignRenderModule();
        const service = module.createService({});

        class FakeDomError extends Error {}
        const domModule = loadImageForeignRenderModule({ DOMException: FakeDomError });
        const domService = domModule.createService({});

        expect(domService.isDomExceptionLike(new FakeDomError("dom"))).toBe(true);
        expect(service.isDomExceptionLike({ name: "SecurityError" })).toBe(true);
        expect(service.isDomExceptionLike({ name: "TypeError" })).toBe(false);
        expect(service.isDomExceptionLike(null)).toBe(false);
    });

    it("handles image constructor and font-ready fallback paths", async () => {
        const module = loadImageForeignRenderModule({ Image: undefined });
        const service = module.createService({});

        await expect(service.loadImageElement("data:image/png;base64,xx")).rejects.toThrow("Image constructor unavailable");

        const fontsModule = loadImageForeignRenderModule({
            document: {
                fonts: { ready: Promise.reject(new Error("font failure")) }
            }
        });
        const fontsService = fontsModule.createService({});
        await expect(fontsService.waitForDocumentFontsReady()).resolves.toBeUndefined();
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

    it("throws when DOM is unavailable for render", async () => {
        const module = loadImageForeignRenderModule({ document: null });
        const service = module.createService({});

        await expect(service.renderElementWithForeignObjectToPngDataUrl({})).rejects.toThrow("DOM unavailable");
    });

    it("collectDocumentCssText prefers injected getDocumentRefOrNull over global document", () => {
        const injectedDoc = {
            styleSheets: [
                {
                    cssRules: [
                        { cssText: ".from-injected { color: red; }" }
                    ]
                }
            ],
            querySelectorAll() {
                return [];
            },
            documentElement: {},
            body: {}
        };
        const module = loadImageForeignRenderModule({
            document: {
                styleSheets: [],
                querySelectorAll() {
                    return [];
                },
                documentElement: {},
                body: {}
            },
            getComputedStyle: () => ({
                getPropertyValue: () => "",
                backgroundColor: "#111111"
            })
        });
        const service = module.createService({
            getDocumentRefOrNull: () => injectedDoc
        });

        const cssText = service.collectDocumentCssText();

        expect(cssText).toContain(".from-injected");
    });
});
