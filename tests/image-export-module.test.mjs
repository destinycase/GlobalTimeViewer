import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createDocumentStub() {
    const anchors = [];
    const body = {
        appended: [],
        appendChild(node) {
            this.appended.push(node);
            return node;
        }
    };

    return {
        anchors,
        body,
        createElement(tag) {
            if (tag !== "a") return {};
            const anchor = {
                href: "",
                download: "",
                clicked: false,
                removed: false,
                click() {
                    this.clicked = true;
                },
                remove() {
                    this.removed = true;
                }
            };
            anchors.push(anchor);
            return anchor;
        }
    };
}

function createApi({ documentStub = null, chromeStub = null } = {}) {
    const globalPatches = {
        window: globalThis,
        console
    };
    if (documentStub) globalPatches.document = documentStub;
    if (chromeStub) globalPatches.chrome = chromeStub;
    const keys = [
        "window",
        "console",
        "document",
        "chrome",
        "GTVImageExport",
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

    return globalThis.window?.GTVImageExport || globalThis.GTVImageExport;
}

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

test("downloadDataUrl uses anchor fallback when chrome API is unavailable", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    await api.downloadDataUrl("data:image/png;base64,AA", "sample.png");

    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].clicked).toBe(true);
    expect(doc.anchors[0].removed).toBe(true);
});

test("downloadDataUrl prefers chrome downloads API when available", async () => {
    const doc = createDocumentStub();
    const chromeStub = {
        runtime: {},
        downloads: {
            download(_payload, cb) {
                cb(1);
            }
        }
    };
    const api = createApi({ documentStub: doc, chromeStub });
    await api.downloadDataUrl("data:image/png;base64,AA", "sample.png");

    expect(doc.anchors.length).toBe(0);
});

test("downloadDataUrl falls back to anchor when chrome download fails", async () => {
    const doc = createDocumentStub();
    const chromeStub = {
        runtime: { lastError: { message: "fail" } },
        downloads: {
            download(_payload, cb) {
                cb(0);
            }
        }
    };
    const api = createApi({ documentStub: doc, chromeStub });
    await api.downloadDataUrl("data:image/png;base64,AA", "sample.png");

    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].clicked).toBe(true);
});

test("createService binds deps for timezone image export", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    let fallbackCalls = 0;
    const service = api.createService({
        isMultiTab: () => false,
        detectForeignObjectRendererSupport: async () => false,
        renderTimezoneTableFallbackDataUrl: async () => {
            fallbackCalls += 1;
            return "data:image/png;base64,BOUND";
        },
        getTimezoneTableImageFilename: () => "bound-image",
        showToast: () => { },
        t: (key) => key,
        isDomExceptionLike: () => false,
        setCanUseForeignObjectRenderer: () => { }
    });

    await service.saveTimezoneTableImage();

    expect(fallbackCalls).toBe(1);
    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].download).toBe("bound-image.png");
});

test("saveTimezoneTableImage handles missing deps safely", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    const originalError = console.error;
    console.error = () => { };
    try {
        await expect(api.saveTimezoneTableImage(undefined)).resolves.toBeUndefined();
    } finally {
        console.error = originalError;
    }
});

test("saveTimezoneTableImage uses combined multi-range renderer in multi tab", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    let multiRenderCalls = 0;
    let timezoneRenderCalls = 0;

    await api.saveTimezoneTableImage({
        isMultiTab: () => true,
        renderMultiRangesToPngDataUrl: async () => {
            multiRenderCalls += 1;
            return "data:image/png;base64,MULTI";
        },
        renderTimezoneTableToPngDataUrl: async () => {
            timezoneRenderCalls += 1;
            return "data:image/png;base64,TZ";
        },
        renderTimezoneTableFallbackDataUrl: async () => {
            timezoneRenderCalls += 1;
            return "data:image/png;base64,TZ_FALLBACK";
        },
        showToast: () => { },
        t: (key) => key
    });

    expect(multiRenderCalls).toBe(1);
    expect(timezoneRenderCalls).toBe(0);
    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].download).toMatch(/^GlobalTimeViewer_MultiRanges_All_\d+\.png$/);
});

test("saveTimezoneTableImage uses timezone fallback renderer when foreign object is unavailable", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    let primaryCalls = 0;
    let fallbackCalls = 0;

    await api.saveTimezoneTableImage({
        isMultiTab: () => false,
        detectForeignObjectRendererSupport: async () => false,
        renderTimezoneTableToPngDataUrl: async () => {
            primaryCalls += 1;
            return "data:image/png;base64,PRIMARY";
        },
        renderTimezoneTableFallbackDataUrl: async () => {
            fallbackCalls += 1;
            return "data:image/png;base64,FALLBACK";
        },
        getTimezoneTableImageFilename: () => "tab-image",
        showToast: () => { },
        t: (key) => key,
        isDomExceptionLike: () => false,
        setCanUseForeignObjectRenderer: () => { }
    });

    expect(primaryCalls).toBe(0);
    expect(fallbackCalls).toBe(1);
    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].download).toBe("tab-image.png");
});

test("saveTimezoneTableImage falls back after primary renderer DOM-like error", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    const setRendererSupportCalls = [];
    let fallbackCalls = 0;

    await api.saveTimezoneTableImage({
        isMultiTab: () => false,
        detectForeignObjectRendererSupport: async () => true,
        renderTimezoneTableToPngDataUrl: async () => {
            throw new Error("primary renderer failed");
        },
        renderTimezoneTableFallbackDataUrl: async () => {
            fallbackCalls += 1;
            return "data:image/png;base64,FALLBACK";
        },
        getTimezoneTableImageFilename: () => "tab-image",
        showToast: () => { },
        t: (key) => key,
        isDomExceptionLike: () => true,
        setCanUseForeignObjectRenderer: (value) => {
            setRendererSupportCalls.push(value);
        }
    });

    expect(fallbackCalls).toBe(1);
    expect(setRendererSupportCalls).toEqual([false]);
    expect(doc.anchors.length).toBe(1);
});

test("saveMultiRangeTitlesImage is no-op outside multi tab", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    let renderCalls = 0;

    await api.saveMultiRangeTitlesImage({
        isMultiTab: () => false,
        renderMultiRangeTitlesToPngDataUrl: async () => {
            renderCalls += 1;
            return "data:image/png;base64,TITLES";
        },
        showToast: () => { },
        t: (key) => key
    });

    expect(renderCalls).toBe(0);
    expect(doc.anchors.length).toBe(0);
});

test("saveMultiRangeTitlesImage saves one titles image in multi tab", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    let ensureCalls = 0;

    await api.saveMultiRangeTitlesImage({
        isMultiTab: () => true,
        ensureMultiRangeState: () => {
            ensureCalls += 1;
        },
        renderMultiRangeTitlesToPngDataUrl: async () => "data:image/png;base64,TITLES",
        getMultiRangeTitlesImageFilename: () => "titles-all.png",
        showToast: () => { },
        t: (key) => key
    });

    expect(ensureCalls).toBe(1);
    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].download).toBe("titles-all.png");
});

test("saveMultiRangeSingleImage uses provided range index", async () => {
    const doc = createDocumentStub();
    const api = createApi({ documentStub: doc });
    const observedRangeIndexes = [];

    await api.saveMultiRangeSingleImage({
        renderMultiRangeSingleToPngDataUrl: async (rangeIdx) => {
            observedRangeIndexes.push(rangeIdx);
            return "data:image/png;base64,SINGLE";
        },
        showToast: () => { },
        t: (key) => key
    }, 3);

    expect(observedRangeIndexes).toEqual([3]);
    expect(doc.anchors.length).toBe(1);
    expect(doc.anchors[0].download).toMatch(/^GlobalTimeViewer_MultiRange_Range_4_\d+\.png$/);
});
