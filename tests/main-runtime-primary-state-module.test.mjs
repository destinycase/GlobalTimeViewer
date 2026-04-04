import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-primary-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePrimaryStateModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePrimaryState", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimePrimaryState || globalThis.GTVMainRuntimePrimaryState;
}

describe("GTV main runtime primary state module", () => {
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

    it("syncs realtime state to global bridge", () => {
        const moduleApi = loadMainRuntimePrimaryStateModule();
        let realtime = false;
        const syncRealtimeFlagToGlobal = vi.fn();
        const service = moduleApi.createService({
            getIsRealtime: () => realtime,
            setIsRealtime: (next) => { realtime = !!next; },
            syncRealtimeFlagToGlobal
        });

        expect(service.getIsRealtimeState()).toBe(false);
        expect(service.setIsRealtimeState(1)).toBe(true);
        expect(service.getIsRealtimeState()).toBe(true);
        expect(syncRealtimeFlagToGlobal).toHaveBeenCalledWith(true);
    });

    it("handles global time slot access and mutation safely", () => {
        const moduleApi = loadMainRuntimePrimaryStateModule();
        let globalTimes = [new Date("2026-03-28T00:00:00.000Z")];
        const service = moduleApi.createService({
            getGlobalTimes: () => globalTimes,
            setGlobalTimes: (next) => { globalTimes = next; }
        });

        const second = new Date("2026-03-28T09:00:00.000Z");
        expect(service.getGlobalTimeState(0).toISOString()).toBe("2026-03-28T00:00:00.000Z");
        expect(service.setGlobalTimeState(1, second)).toBe(second);
        expect(service.getGlobalTimesState()).toHaveLength(2);
        expect(service.getGlobalTimeState(1).toISOString()).toBe("2026-03-28T09:00:00.000Z");
    });

    it("returns finite ui scale or default fallback", () => {
        const moduleApi = loadMainRuntimePrimaryStateModule();
        const withScale = moduleApi.createService({ getUiScale: () => "1.25" });
        const fallback = moduleApi.createService({ getUiScale: () => "bad" });

        expect(withScale.getUiScaleState()).toBe(1.25);
        expect(fallback.getUiScaleState()).toBe(1);
    });
});
