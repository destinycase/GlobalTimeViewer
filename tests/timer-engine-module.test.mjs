import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timer-engine.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadTimerEngineModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVTimerEngine", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTimerEngine || globalThis.GTVTimerEngine;
}

describe("GTV timer engine module", () => {
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

    it("runs realtime tick only when shouldTick allows", () => {
        const module = loadTimerEngineModule();
        let tickCount = 0;
        const service = module.createService({
            shouldTick: () => false,
            onTick: () => {
                tickCount += 1;
            }
        });

        expect(service.runRealtimeTick()).toBe(false);
        expect(tickCount).toBe(0);
    });

    it("starts and stops ticker using injected timer functions", () => {
        const module = loadTimerEngineModule();
        let scheduled = null;
        let cleared = null;
        const service = module.createService({
            setIntervalFn: (cb, ms) => {
                scheduled = { cb, ms };
                return 7;
            },
            clearIntervalFn: (id) => {
                cleared = id;
            }
        });

        const id = service.startRealtimeTicker({ intervalMs: 500 });
        expect(id).toBe(7);
        expect(service.isRealtimeTickerRunning()).toBe(true);
        expect(scheduled.ms).toBe(500);

        expect(service.stopRealtimeTicker()).toBe(true);
        expect(cleared).toBe(7);
        expect(service.isRealtimeTickerRunning()).toBe(false);
    });
});
