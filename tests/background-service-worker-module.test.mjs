import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "background.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

let restoreGlobals = null;

function installGlobalScaffold() {
    const keys = ["chrome"];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    return () => {
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    };
}

function loadBackgroundModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
}

describe("background service worker module", () => {
    beforeEach(() => {
        restoreGlobals = installGlobalScaffold();
    });

    afterEach(() => {
        delete require.cache[MODULE_ID];
        vi.restoreAllMocks();
        if (typeof restoreGlobals === "function") restoreGlobals();
    });

    it("registers click listener and opens extension tab", async () => {
        let clickHandler = null;
        const addListener = vi.fn((handler) => {
            clickHandler = handler;
        });
        const create = vi.fn().mockResolvedValue({ id: 1 });
        const setBadgeText = vi.fn().mockResolvedValue(undefined);
        globalThis.chrome = {
            action: {
                onClicked: { addListener },
                setBadgeText
            },
            tabs: { create },
            runtime: { getURL: (pathValue) => `chrome-extension://test/${pathValue}` }
        };

        loadBackgroundModule();

        expect(addListener).toHaveBeenCalledTimes(1);
        expect(typeof clickHandler).toBe("function");

        clickHandler();
        await Promise.resolve();

        expect(create).toHaveBeenCalledWith({
            url: "chrome-extension://test/index.html"
        });
        expect(setBadgeText).toHaveBeenCalledWith({ text: "" });
    });

    it("logs a structured error when tab creation fails", async () => {
        let clickHandler = null;
        const addListener = vi.fn((handler) => {
            clickHandler = handler;
        });
        const create = vi.fn().mockRejectedValue(new Error("blocked"));
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const setBadgeText = vi.fn().mockResolvedValue(undefined);
        const setBadgeBackgroundColor = vi.fn().mockResolvedValue(undefined);
        const setTitle = vi.fn().mockResolvedValue(undefined);
        globalThis.chrome = {
            action: {
                onClicked: { addListener },
                setBadgeText,
                setBadgeBackgroundColor,
                setTitle
            },
            tabs: { create },
            runtime: { getURL: (pathValue) => `chrome-extension://test/${pathValue}` }
        };

        loadBackgroundModule();
        clickHandler();
        await Promise.resolve();
        await Promise.resolve();

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("[GTV-BG] Failed to open extension tab"),
            expect.objectContaining({
                message: "blocked"
            })
        );
        expect(setBadgeText).toHaveBeenCalledWith({ text: "ERR" });
        expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#D93025" });
    });

    it("logs when chrome action API is unavailable", () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        globalThis.chrome = {};

        loadBackgroundModule();

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("[GTV-BG] chrome.action.onClicked API is unavailable")
        );
    });
});
