import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCoreAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreAccessorProxies
        || globalThis.GTVMainRuntimeCoreAccessorProxies
    );
}

describe("GTV main runtime core accessor proxies module", () => {
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

    it("delegates runtime core wrappers when underlying services are available", () => {
        const moduleApi = loadMainRuntimeCoreAccessorProxiesModule();
        const syncRealtimeFlagToGlobal = vi.fn(() => true);
        const getRuntimeCurrentLangValue = vi.fn(() => "ko");
        const syncCurrentLang = vi.fn(() => "en");
        const sanitizeDayNightHourValue = vi.fn(() => 5);
        const normalizeDayNightRangeValues = vi.fn(() => ({ dayStartHour: 6, nightStartHour: 18 }));
        const assertRequiredServices = vi.fn(() => "ok");

        const service = moduleApi.createService({
            getMainRuntimeLangStateService: () => ({
                syncRealtimeFlagToGlobal,
                getRuntimeCurrentLangValue,
                syncCurrentLang
            }),
            getMainDayNightRangeUtilsService: () => ({
                sanitizeDayNightHourValue,
                normalizeDayNightRangeValues
            }),
            getMainBootstrapGuardService: () => ({
                assertRequiredServices
            })
        });

        expect(service.syncRealtimeFlagToGlobal(1)).toBe(true);
        expect(syncRealtimeFlagToGlobal).toHaveBeenCalledWith(1);
        expect(service.getRuntimeCurrentLangValue()).toBe("ko");
        expect(service.syncCurrentLang("en")).toBe("en");
        expect(service.sanitizeDayNightHourValue(29, 6)).toBe(5);
        expect(service.normalizeDayNightRangeValues(7, 19)).toEqual({ dayStartHour: 6, nightStartHour: 18 });
        expect(service.assertRequiredServices()).toBe("ok");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("uses local fallback behavior when delegated services are unavailable", () => {
        const moduleApi = loadMainRuntimeCoreAccessorProxiesModule();
        const globalRef = {};
        const service = moduleApi.createService({
            getGlobalRef: () => globalRef,
            defaultLang: "en",
            defaultDayStartHour: 7,
            defaultNightStartHour: 19
        });

        expect(service.syncRealtimeFlagToGlobal("yes")).toBe(true);
        expect(globalRef.isRealtime).toBe(true);
        expect(service.getRuntimeCurrentLangValue()).toBe("en");
        expect(service.syncCurrentLang("  ko ")).toBe("ko");
        expect(globalRef.currentLang).toBe("ko");
        expect(service.sanitizeDayNightHourValue("bad", 8)).toBe(8);
        expect(service.normalizeDayNightRangeValues("bad", 25)).toEqual({
            dayStartHour: 7,
            nightStartHour: 1
        });
        expect(service.assertRequiredServices()).toBeUndefined();
    });
});
