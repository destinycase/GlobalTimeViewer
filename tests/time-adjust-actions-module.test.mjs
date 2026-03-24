import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-actions.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadTimeAdjustActionsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVTimeAdjustActions", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTimeAdjustActions || globalThis.GTVTimeAdjustActions;
}

describe("GTV time adjust actions module", () => {
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

    it("resolveTimeAdjustZoneAndOffset keeps null offset as null (does not coerce to zero)", () => {
        const module = loadTimeAdjustActionsModule();
        const service = module.createService({});
        const resolved = service.resolveTimeAdjustZoneAndOffset(
            { type: "standard", zone: "America/New_York" },
            null
        );
        expect(resolved).toEqual({
            zone: "America/New_York",
            fixedOffsetMinutes: null
        });
    });

    it("applyTimeAdjustAction updates target slot and triggers clock update", () => {
        const module = loadTimeAdjustActionsModule();
        const globalTimes = [new Date(Date.UTC(2026, 0, 1, 0, 0, 0))];
        let updateCount = 0;
        const service = module.createService({
            isRealtime: () => false,
            getGlobalTimes: () => globalTimes,
            getBaseTimezoneRef: () => ({ type: "standard", zone: "Asia/Seoul" }),
            getFixedOffsetForDisplay: () => 540,
            getTimeAdjustDayStep: () => 1,
            timeService: {
                adjustDate: (date) => new Date(date.getTime() + 60 * 60 * 1000)
            },
            updateClocks: () => { updateCount += 1; }
        });

        service.applyTimeAdjustAction(0, "plus_hour");
        expect(globalTimes[0].toISOString()).toBe("2026-01-01T01:00:00.000Z");
        expect(updateCount).toBe(1);
    });

    it("applyTimeAdjustAction midnight follows base timezone when fixed offset is null", () => {
        const module = loadTimeAdjustActionsModule();
        const globalTimes = [new Date(Date.UTC(2026, 6, 1, 12, 34, 56))];
        const service = module.createService({
            isRealtime: () => false,
            getGlobalTimes: () => globalTimes,
            getBaseTimezoneRef: () => ({ type: "standard", zone: "America/New_York" }),
            getFixedOffsetForDisplay: () => null,
            getTimeAdjustDayStep: () => 1,
            timeService: {
                adjustDate: (date, action, zone, fixedOffsetMinutes) => {
                    expect(action).toBe("midnight");
                    expect(zone).toBe("America/New_York");
                    expect(fixedOffsetMinutes).toBeNull();
                    return new Date(Date.UTC(2026, 6, 1, 4, 0, 0));
                }
            },
            updateClocks: () => {}
        });

        service.applyTimeAdjustAction(0, "midnight");
        expect(globalTimes[0].toISOString()).toBe("2026-07-01T04:00:00.000Z");
    });

    it("applyBulkRangeAllAction zeroes durations and keeps linked starts continuous", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [
            { startUtcMs: 1000, endUtcMs: 5000 },
            { startUtcMs: 10000, endUtcMs: 16000 }
        ];
        let renderCount = 0;
        let persistCount = 0;
        const service = module.createService({
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            isMultiRangeStartLinked: (idx) => idx === 1,
            isMultiTab: () => true,
            renderMultiRanges: () => { renderCount += 1; },
            savePersistence: () => { persistCount += 1; }
        });

        service.applyBulkRangeAllAction(1, "set_zero_day");
        expect(ranges[0].startUtcMs).toBe(1000);
        expect(ranges[0].endUtcMs).toBe(1000);
        expect(ranges[1].startUtcMs).toBe(1000);
        expect(ranges[1].endUtcMs).toBe(1000);
        expect(renderCount).toBe(1);
        expect(persistCount).toBe(1);
    });

    it("applyMultiRangeTimeAdjustAction set_zero_day syncs followers and persists", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [{ startUtcMs: 2500, endUtcMs: 9000 }];
        let syncFollowingCount = 0;
        let renderCount = 0;
        let persistCount = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            syncFollowingRangesByDuration: () => { syncFollowingCount += 1; },
            syncMultiRangeStartLinks: () => {},
            renderMultiRanges: () => { renderCount += 1; },
            savePersistence: () => { persistCount += 1; }
        });

        service.applyMultiRangeTimeAdjustAction(0, 1, "set_zero_day");
        expect(ranges[0].endUtcMs).toBe(2500);
        expect(syncFollowingCount).toBe(1);
        expect(renderCount).toBe(1);
        expect(persistCount).toBe(1);
    });
});
