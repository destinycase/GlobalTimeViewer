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
