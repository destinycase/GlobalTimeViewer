import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-shared-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainSharedUtilsModule({ withWindow = true } = {}) {
    const globalPatches = withWindow ? { window: {}, console } : { console };
    const keys = ["window", "console", "GTVMainSharedUtils", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainSharedUtils
        || globalThis.GTVMainSharedUtils;
}

describe("GTV main shared utils module", () => {
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

    it("parses datetime-like input consistently", () => {
        const moduleApi = loadMainSharedUtilsModule();
        const service = moduleApi.createService();

        expect(service.parseDateTimeParts("2026-03-20 01:02:03", "datetime")).toEqual([2026, 3, 20, 1, 2, 3]);
        expect(service.parseDateTimeParts("2026-03-20", "date")).toEqual([2026, 3, 20]);
        expect(service.parseDateTimeParts("01:02:03", "time")).toEqual([1, 2, 3]);
        expect(service.parseDateTimeParts("bad", "datetime")).toBe(null);
        expect(Number.isNaN(service.parseLocalDateTimeToUtcMs("bad"))).toBe(true);
        expect(service.parseLocalDateTimeToUtcMs("2026-03-20 01:02:03")).toBe(Date.UTC(2026, 2, 20, 1, 2, 3));
        expect(service.escapeHtml("<div>'A' & \"B\"</div>")).toBe("&lt;div&gt;&#39;A&#39; &amp; &quot;B&quot;&lt;/div&gt;");
    });

    it("prepares export canvas and draws text with expected alignment", () => {
        const moduleApi = loadMainSharedUtilsModule();
        const calls = [];
        const ctx = {
            scale: (x, y) => { calls.push(["scale", x, y]); },
            fillRect: (x, y, w, h) => { calls.push(["fillRect", x, y, w, h]); },
            save: () => { calls.push(["save"]); },
            beginPath: () => { calls.push(["beginPath"]); },
            rect: (x, y, w, h) => { calls.push(["rect", x, y, w, h]); },
            clip: () => { calls.push(["clip"]); },
            fillText: (text, x, y) => { calls.push(["fillText", text, x, y]); },
            restore: () => { calls.push(["restore"]); },
            textAlign: "left",
            textBaseline: "",
            fillStyle: "",
            font: ""
        };
        const canvas = {
            width: 0,
            height: 0,
            getContext: () => ctx
        };

        const service = moduleApi.createService({
            tableImageExportWidth: 1000,
            createCanvas: () => canvas
        });
        const target = service.prepareExportCanvas(500, 250, "#000");
        expect(target.targetWidth).toBe(1000);
        expect(target.targetHeight).toBe(500);
        expect(canvas.width).toBe(1000);
        expect(canvas.height).toBe(500);

        service.drawExportCellText(ctx, "ABC", 10, 20, 100, 30, { align: "center", clip: true });
        expect(calls.some((entry) => entry[0] === "fillText" && entry[1] === "ABC")).toBe(true);
        expect(calls.some((entry) => entry[0] === "clip")).toBe(true);
    });

    it("covers default dependency paths when globals are minimal", () => {
        const moduleApi = loadMainSharedUtilsModule({ withWindow: false });
        const service = moduleApi.createService();
        const ctx = {
            save() { },
            beginPath() { },
            rect() { },
            clip() { },
            fillText() { },
            restore() { },
            fillStyle: "",
            font: "",
            textAlign: "",
            textBaseline: ""
        };

        service.drawExportCellText(ctx, "X", 0, 0, 10, 10);
        expect(service.parseDateTimeParts("", "date")).toBe(null);
        expect(() => service.prepareExportCanvas(100, 50, "#000")).toThrow("Canvas element unavailable");
    });
});
