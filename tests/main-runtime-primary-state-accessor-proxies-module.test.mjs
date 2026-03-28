import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-primary-state-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePrimaryStateAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePrimaryStateAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimePrimaryStateAccessorProxies
        || globalThis.GTVMainRuntimePrimaryStateAccessorProxies
    );
}

describe("GTV main runtime primary state accessor proxies module", () => {
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

    it("delegates primary state methods to runtime service", () => {
        const moduleApi = loadMainRuntimePrimaryStateAccessorProxiesModule();
        const delegateService = {
            setIsRealtimeState: vi.fn(() => false),
            getIsRealtimeState: vi.fn(() => true),
            getGlobalTimesState: vi.fn(() => [new Date("2026-03-29T00:00:00.000Z")]),
            getGlobalTimeState: vi.fn(() => new Date("2026-03-29T01:00:00.000Z")),
            setGlobalTimeState: vi.fn(() => new Date("2026-03-29T02:00:00.000Z")),
            getUiScaleState: vi.fn(() => 1.25)
        };
        const service = moduleApi.createService({
            getMainRuntimePrimaryStateService: () => delegateService
        });

        expect(service.setIsRealtimeState(true)).toBe(false);
        expect(service.getIsRealtimeState()).toBe(true);
        expect(service.getGlobalTimesState()).toHaveLength(1);
        expect(service.getGlobalTimeState(0).toISOString()).toBe("2026-03-29T01:00:00.000Z");
        expect(service.setGlobalTimeState(0, new Date("2026-03-29T02:00:00.000Z")).toISOString()).toBe("2026-03-29T02:00:00.000Z");
        expect(service.getUiScaleState()).toBe(1.25);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("uses fallback behavior when runtime service is unavailable", () => {
        const moduleApi = loadMainRuntimePrimaryStateAccessorProxiesModule();
        let isRealtime = false;
        let globalTimes = [];
        let uiScale = "invalid";
        const syncRealtimeFlagToGlobal = vi.fn();
        const service = moduleApi.createService({
            getIsRealtime: () => isRealtime,
            setIsRealtime: (next) => { isRealtime = next; },
            syncRealtimeFlagToGlobal,
            getGlobalTimes: () => globalTimes,
            setGlobalTimes: (next) => { globalTimes = next; },
            getUiScale: () => uiScale
        });

        expect(service.setIsRealtimeState(1)).toBe(true);
        expect(isRealtime).toBe(true);
        expect(syncRealtimeFlagToGlobal).toHaveBeenCalledWith(true);

        const storedDate = new Date("2026-03-29T03:00:00.000Z");
        expect(service.setGlobalTimeState(1, storedDate)).toBe(storedDate);
        expect(service.getGlobalTimesState()[1]).toBe(storedDate);
        expect(service.getGlobalTimeState(1)).toBe(storedDate);
        expect(service.getUiScaleState()).toBe(1);

        uiScale = 1.1;
        expect(service.getUiScaleState()).toBe(1.1);
    });
});
