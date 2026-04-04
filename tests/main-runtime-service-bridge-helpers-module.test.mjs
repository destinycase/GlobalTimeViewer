import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-bridge-helpers.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeServiceBridgeHelpersModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeServiceBridgeHelpers", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeServiceBridgeHelpers || globalThis.GTVMainRuntimeServiceBridgeHelpers;
}

describe("GTV main runtime service bridge helpers module", () => {
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

    it("delegates warning and method lookup/call to main bridge service", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelpersModule();
        const bridgeService = {
            warnMissingServiceMethod: vi.fn(),
            getServiceMethod: vi.fn(() => () => "ok"),
            callServiceMethod: vi.fn(() => "called")
        };
        const service = moduleApi.createService({
            getMainServiceMethodBridgeService: () => bridgeService
        });

        expect(service.getServiceMethod("svc", {}, "fn")()).toBe("ok");
        expect(service.callServiceMethod("svc", {}, "fn", [])).toBe("called");
        service.warnMissingServiceMethod("svc", "fn");
        expect(bridgeService.warnMissingServiceMethod).toHaveBeenCalledWith("svc", "fn");
    });

    it("shows localized missing-feature toast in fallback mode", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelpersModule();
        const showToast = vi.fn();
        const service = moduleApi.createService({
            getTranslator: () => ((key) => (key === "toast_required_feature_module_missing" ? "Missing feature" : key)),
            getAppFeedbackService: () => ({ showToast }),
            warnFallback: vi.fn()
        });

        service.showMissingFeatureToastOnce("missing.feature");

        expect(showToast).toHaveBeenCalledWith("Missing feature", { type: "warning" });
    });

    it("saves persistence and renders multi ranges with fallback return", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelpersModule();
        const savePersistence = vi.fn(() => "saved");
        const renderMultiRanges = vi.fn(() => "rendered");
        const service = moduleApi.createService({
            getPersistenceService: () => ({ savePersistence }),
            getMainMultiRangeTabFacadeService: () => ({ renderMultiRanges }),
            warnFallback: vi.fn()
        });

        expect(service.savePersistenceSafely(1, 2)).toBe("saved");
        expect(service.renderMultiRangesSafely()).toBe("rendered");

        const fallbackService = moduleApi.createService();
        expect(fallbackService.renderMultiRangesSafely()).toBe(undefined);
    });

    it("uses injected consoleWarn fallback when bridge warn method is unavailable", () => {
        const moduleApi = loadMainRuntimeServiceBridgeHelpersModule();
        const warned = [];
        const service = moduleApi.createService({
            getMainServiceMethodBridgeService: () => null,
            consoleWarn: (...args) => warned.push(args)
        });

        service.warnMissingServiceMethod("svc", "missing");

        expect(warned).toHaveLength(1);
        expect(String(warned[0][0])).toContain("svc.missing");
    });
});
