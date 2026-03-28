import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-bridge-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeServiceBridgeAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeServiceBridgeAccessorProxies", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimeServiceBridgeAccessorProxies
        || globalThis.GTVMainRuntimeServiceBridgeAccessorProxies
    );
}

describe("GTV main runtime service bridge accessor proxies module", () => {
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

    it("delegates methods to runtime service bridge helpers when available", () => {
        const moduleApi = loadMainRuntimeServiceBridgeAccessorProxiesModule();
        const runtimeService = {
            warnMissingServiceMethod: vi.fn(),
            showMissingFeatureToastOnce: vi.fn(),
            getServiceMethod: vi.fn(() => null),
            callServiceMethod: vi.fn(() => "ok"),
            savePersistenceSafely: vi.fn(() => "saved"),
            renderMultiRangesSafely: vi.fn(() => "rendered")
        };
        const service = moduleApi.createService({
            getMainRuntimeServiceBridgeHelpersService: () => runtimeService
        });

        service.warnMissingServiceMethod("svc", "m");
        service.showMissingFeatureToastOnce("f");
        expect(service.callServiceMethod("svc", {}, "m")).toBe("ok");
        expect(service.savePersistenceSafely("a")).toBe("saved");
        expect(service.renderMultiRangesSafely()).toBe("rendered");
        expect(runtimeService.warnMissingServiceMethod).toHaveBeenCalledWith("svc", "m");
        expect(runtimeService.showMissingFeatureToastOnce).toHaveBeenCalledWith("f");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("falls back to bridge/service-ref behavior when runtime helper is unavailable", () => {
        const moduleApi = loadMainRuntimeServiceBridgeAccessorProxiesModule();
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const showToast = vi.fn();
        const directService = {
            ping: vi.fn(() => "pong")
        };
        const service = moduleApi.createService({
            getMainServiceMethodBridgeService: () => null,
            getAppFeedbackService: () => ({ showToast }),
            getPersistenceService: () => ({ savePersistence: vi.fn(() => "saved") }),
            getMainMultiRangeTabFacadeService: () => ({ renderMultiRanges: vi.fn(() => undefined) }),
            getTranslator: () => (key) => key
        });

        expect(service.getServiceMethod("directService", directService, "ping")).toBeTypeOf("function");
        expect(service.callServiceMethod("directService", directService, "ping")).toBe("pong");
        expect(service.callServiceMethod("missing", {}, "none", [], { fallback: 123 })).toBe(123);
        service.showMissingFeatureToastOnce("missing.feature");
        expect(showToast).toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
