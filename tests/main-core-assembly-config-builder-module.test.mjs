import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-core-assembly-config-builder.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCoreAssemblyConfigBuilderModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainCoreAssemblyConfigBuilder", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCoreAssemblyConfigBuilder || globalThis.GTVMainCoreAssemblyConfigBuilder;
}

describe("GTV main core assembly config builder module", () => {
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

    it("builds main core assembly config with expected facade/deferred bindings", () => {
        const moduleApi = loadMainCoreAssemblyConfigBuilderModule();
        const builder = moduleApi.createService();
        const warnSpy = vi.fn();
        const missingFeatureSpy = vi.fn();
        const deps = {
            consoleWarn: warnSpy,
            showMissingFeatureToastOnce: missingFeatureSpy,
            bindFacadeMethod: (getter, methodName) => (...args) => getter()[methodName](...args),
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getMainTimezoneFacadeServiceRef: () => ({
                getLocalizedTZLabel: () => "tz-label",
                sanitizeTimezoneId: () => "tz-id",
                getNextTimezoneIdSeed: () => 17,
                sanitizeBaseTimezoneId: () => "base-id"
            }),
            getTimeCoreRef: () => ({
                sanitizeUtcRowOrder: () => [1, 0],
                sanitizeUtcMs: () => 123,
                pad: () => "09"
            }),
            getPersistenceServiceRef: () => ({
                getStorageValue: () => "value",
                setStorageValue: () => true
            }),
            getShowToastRef: () => (message) => `toast:${message}`,
            getRenderListRef: () => () => "render-list",
            getRenderTimelineFrameRef: () => () => "render-timeline",
            getUpdateClocksRef: () => () => "update-clocks",
            getLuxonGlobalRef: () => ({ DateTime: {} })
        };

        const config = builder.buildMainCoreAssemblyConfig(deps);

        expect(config.resolveLocalizedTZLabel()).toBe("tz-label");
        expect(config.sanitizeTimezoneId()).toBe("tz-id");
        expect(config.getNextTimezoneIdSeed()).toBe(17);
        expect(config.sanitizeBaseTimezoneId()).toBe("base-id");
        expect(config.sanitizeUtcRowOrder()).toEqual([1, 0]);
        expect(config.sanitizeUtcMs()).toBe(123);
        expect(config.pad()).toBe("09");
        expect(config.getStorageValue()).toBe("value");
        expect(config.setStorageValue()).toBe(true);
        expect(config.showToast("ok")).toBe("toast:ok");
        expect(config.renderList()).toBe("render-list");
        expect(config.renderTimelineFrame()).toBe("render-timeline");
        expect(config.updateClocks()).toBe("update-clocks");
        expect(config.luxon).toEqual({ DateTime: {} });

        config.onWarnMissingMethod("svc", "method");
        config.onMissingFeature("feature-x");
        expect(warnSpy).toHaveBeenCalledWith("[GTV] svc.method is unavailable. Fallback path will be used.");
        expect(missingFeatureSpy).toHaveBeenCalledWith("feature-x");
    });

    it("builds foundation config with runtime refs resolved", () => {
        const moduleApi = loadMainCoreAssemblyConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            gtvT: (key) => `t:${key}`,
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getShowToastRef: () => (message) => `toast:${message}`,
            getPersistenceServiceRef: () => ({ id: "persistence" }),
            confirmRuntime: () => true,
            getLocationRefOrNull: () => ({ href: "about:blank" }),
            getDocumentRefOrNull: () => ({ title: "doc" }),
            consoleError: vi.fn()
        };

        const config = builder.buildMainFoundationConfig(deps);

        expect(config.t("hello")).toBe("t:hello");
        expect(config.showToast("warn")).toBe("toast:warn");
        expect(config.getPersistenceService()).toEqual({ id: "persistence" });
        expect(config.confirmFn()).toBe(true);
        expect(config.locationRef).toEqual({ href: "about:blank" });
        expect(config.documentRef).toEqual({ title: "doc" });
        expect(typeof config.logError).toBe("function");
    });
});
