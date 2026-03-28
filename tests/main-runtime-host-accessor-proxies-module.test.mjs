import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-host-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeHostAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeHostAccessorProxies", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeHostAccessorProxies || globalThis.GTVMainRuntimeHostAccessorProxies;
}

describe("GTV main runtime host accessor proxies module", () => {
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

    it("delegates host util methods to runtime host service", () => {
        const moduleApi = loadMainRuntimeHostAccessorProxiesModule();
        const delegateService = {
            applyVersionBranding: vi.fn(() => undefined),
            createCanvasSafely: vi.fn(() => ({ tag: "canvas" })),
            getRandomUUIDSafely: vi.fn(() => "uuid"),
            getDocumentRefOrNull: vi.fn(() => ({ nodeType: 9 })),
            getWindowRefOrNull: vi.fn(() => ({ name: "window" })),
            getLocationRefOrNull: vi.fn(() => ({ href: "https://example.com" })),
            getGlobalThisRefOrNull: vi.fn(() => globalThis),
            getLuxonGlobalRef: vi.fn(() => ({ DateTime: {} })),
            getComputedStyleSafely: vi.fn(() => ({ width: "0px" })),
            getRuntimeNowMs: vi.fn(() => 123),
            setRuntimeInterval: vi.fn(() => 5),
            clearRuntimeInterval: vi.fn(() => undefined),
            deferDynamicCall: vi.fn((getFn) => getFn())
        };
        const service = moduleApi.createService({
            getMainRuntimeHostUtilsService: () => delegateService
        });

        expect(service.createCanvasSafely()).toEqual({ tag: "canvas" });
        expect(service.getRandomUUIDSafely()).toBe("uuid");
        expect(service.getRuntimeNowMs()).toBe(123);
        expect(service.setRuntimeInterval(() => {}, 1000)).toBe(5);
        expect(service.deferDynamicCall(() => "ok")).toBe("ok");
        service.applyVersionBranding();
        service.clearRuntimeInterval(5);
        expect(delegateService.applyVersionBranding).toHaveBeenCalled();
        expect(delegateService.clearRuntimeInterval).toHaveBeenCalledWith(5);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors when delegated service methods are missing", () => {
        const moduleApi = loadMainRuntimeHostAccessorProxiesModule();
        const service = moduleApi.createService({});

        expect(() => service.applyVersionBranding()).toThrow(
            "Missing required module API: mainRuntimeHostUtilsService.applyVersionBranding"
        );
        expect(() => service.getRuntimeNowMs()).toThrow(
            "Missing required module API: mainRuntimeHostUtilsService.getRuntimeNowMs"
        );
    });
});
