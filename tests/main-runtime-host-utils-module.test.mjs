import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-host-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeHostUtilsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeHostUtils", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeHostUtils || globalThis.GTVMainRuntimeHostUtils;
}

describe("GTV main runtime host utils module", () => {
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

    it("applies version branding and exposes runtime references", () => {
        const moduleApi = loadMainRuntimeHostUtilsModule();
        const badge = { textContent: "" };
        const title = { textContent: "" };
        const documentRef = {
            title: "",
            getElementById: (id) => (id === "version-badge" ? badge : null),
            querySelector: (selector) => (selector === ".logo-text h1" ? title : null)
        };
        const globalRef = { luxon: { DateTime: {} } };
        const service = moduleApi.createService({
            appDisplayName: "Global Time Viewer",
            version: "3.12.3",
            getDocumentRef: () => documentRef,
            getWindowRef: () => ({ id: "window" }),
            getLocationRef: () => ({ href: "about:blank" }),
            getGlobalThisRef: () => ({ id: "global" }),
            getGlobalRef: () => globalRef
        });

        service.applyVersionBranding();

        expect(documentRef.title).toBe("Global Time Viewer v3.12.3");
        expect(badge.textContent).toBe("ver 3.12.3");
        expect(title.textContent).toBe("Global Time Viewer");
        expect(service.getDocumentRefOrNull()).toBe(documentRef);
        expect(service.getWindowRefOrNull()).toEqual({ id: "window" });
        expect(service.getLocationRefOrNull()).toEqual({ href: "about:blank" });
        expect(service.getGlobalThisRefOrNull()).toEqual({ id: "global" });
        expect(service.getLuxonGlobalRef()).toBe(globalRef.luxon);
    });

    it("handles style, timer, uuid, and deferred call helpers", () => {
        const moduleApi = loadMainRuntimeHostUtilsModule();
        const setIntervalFn = vi.fn(() => 77);
        const clearIntervalFn = vi.fn();
        const service = moduleApi.createService({
            getGlobalRef: () => ({
                getComputedStyle: () => {
                    throw new Error("style unavailable");
                }
            }),
            getCryptoRef: () => ({
                randomUUID: () => "uuid-1"
            }),
            nowFn: () => 12345,
            setIntervalFn,
            clearIntervalFn
        });

        expect(service.getComputedStyleSafely({})).toEqual({
            fontStyle: "",
            fontWeight: "",
            fontSize: "14px",
            fontFamily: "sans-serif"
        });
        expect(service.getRandomUUIDSafely()).toBe("uuid-1");
        expect(service.getRuntimeNowMs()).toBe(12345);
        expect(service.setRuntimeInterval(() => {}, 1000)).toBe(77);
        service.clearRuntimeInterval(77);
        expect(setIntervalFn).toHaveBeenCalledTimes(1);
        expect(clearIntervalFn).toHaveBeenCalledWith(77);

        const deferred = service.deferDynamicCall(() => (a, b) => `${a}-${b}`);
        expect(deferred("A", "B")).toBe("A-B");
    });
});
