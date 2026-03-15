import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timer-engine.js");

function loadTimerEngineModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/timer-engine.js" });
    return sandbox.window.GTVTimerEngine || sandbox.GTVTimerEngine || sandbox.globalThis.GTVTimerEngine;
}

describe("GTV timer engine module", () => {
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
