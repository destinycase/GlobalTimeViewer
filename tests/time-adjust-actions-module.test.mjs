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

    it("resolveTimeAdjustZoneAndOffset uses custom timezone offset resolver", () => {
        const module = loadTimeAdjustActionsModule();
        const service = module.createService({
            getCustomOffsetMinutes: () => 330
        });

        expect(service.resolveTimeAdjustZoneAndOffset({ type: "custom" }, 0)).toEqual({
            zone: "CUSTOM",
            fixedOffsetMinutes: 330
        });
    });

    it("getAdjustedUtcDateByAction handles now and sync actions", () => {
        const module = loadTimeAdjustActionsModule();
        const slot0Date = new Date(Date.UTC(2026, 0, 1, 1, 0, 0));
        const service = module.createService({
            getGlobalTimes: () => [slot0Date]
        });
        const base = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));

        const nowDate = service.getAdjustedUtcDateByAction(base, "now", 0, { zone: "UTC" }, 0);
        const syncDate = service.getAdjustedUtcDateByAction(base, "sync_prev_end", 1, { zone: "UTC" }, 0);
        const unchanged = service.getAdjustedUtcDateByAction(base, "sync_prev_end", 0, { zone: "UTC" }, 0);

        expect(nowDate instanceof Date).toBe(true);
        expect(syncDate?.getTime()).toBe(slot0Date.getTime());
        expect(unchanged).toBe(base);
    });

    it("applyTimeAdjustAction supports now and set_zero_day branches", () => {
        const module = loadTimeAdjustActionsModule();
        const globalTimes = [
            new Date(Date.UTC(2026, 0, 1, 3, 0, 0)),
            new Date(Date.UTC(2026, 0, 2, 7, 0, 0))
        ];
        let updateCalls = 0;
        const service = module.createService({
            isRealtime: () => false,
            getGlobalTimes: () => globalTimes,
            updateClocks: () => { updateCalls += 1; }
        });

        service.applyTimeAdjustAction(0, "now");
        service.applyTimeAdjustAction(1, "set_zero_day");

        expect(globalTimes[0] instanceof Date).toBe(true);
        expect(globalTimes[1]?.getTime()).toBe(globalTimes[0]?.getTime());
        expect(updateCalls).toBe(2);
    });

    it("applyBulkRangeAllAction applies custom day deltas and preserves unlocked starts", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [
            { startUtcMs: 1000, endUtcMs: 2000 },
            { startUtcMs: 5000, endUtcMs: 7000 }
        ];
        let saveCalls = 0;
        const service = module.createService({
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            getTimeAdjustDayStep: () => 2,
            isMultiRangeStartLinked: () => false,
            isMultiTab: () => false,
            savePersistence: () => { saveCalls += 1; }
        });

        service.applyBulkRangeAllAction(1, "plus_custom_days");

        expect(ranges[0].startUtcMs).toBe(1000);
        expect(ranges[0].endUtcMs).toBe(172802000);
        expect(ranges[1].startUtcMs).toBe(5000);
        expect(ranges[1].endUtcMs).toBe(172807000);
        expect(saveCalls).toBe(1);
    });

    it("applyMultiRangeTimeAdjustAction sync_prev_end links range chain from previous end", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [
            { startUtcMs: 1000, endUtcMs: 2000 },
            { startUtcMs: 5000, endUtcMs: 9000 }
        ];
        let syncLinkedCalls = 0;
        let renderCalls = 0;
        let saveCalls = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            syncLinkedRangesFrom: (_idx, options) => {
                syncLinkedCalls += 1;
                expect(options?.includeCurrent).toBe(true);
                expect(options?.stopAtFirstUnlocked).toBe(true);
                expect(Array.isArray(options?.baseDurations)).toBe(true);
            },
            syncMultiRangeStartLinks: () => { },
            renderMultiRanges: () => { renderCalls += 1; },
            savePersistence: () => { saveCalls += 1; }
        });

        service.applyMultiRangeTimeAdjustAction(1, 0, "sync_prev_end");

        expect(ranges[1].startUtcMs).toBe(2000);
        expect(syncLinkedCalls).toBe(1);
        expect(renderCalls).toBe(1);
        expect(saveCalls).toBe(1);
    });

    it("applyMultiRangeTimeAdjustAction no-ops when editing is disabled", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [{ startUtcMs: 1000, endUtcMs: 3000 }];
        let renderCalls = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => false,
            isMultiRangeEndEditEnabled: () => false,
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            renderMultiRanges: () => { renderCalls += 1; },
            savePersistence: () => { }
        });

        service.applyMultiRangeTimeAdjustAction(0, 1, "plus_hour");

        expect(ranges[0].endUtcMs).toBe(3000);
        expect(renderCalls).toBe(0);
    });

    it("createService with invalid deps remains safe on public methods", () => {
        const module = loadTimeAdjustActionsModule();
        const service = module.createService(null);

        expect(service.resolveTimeAdjustZoneAndOffset(undefined, "")).toEqual({
            zone: "UTC",
            fixedOffsetMinutes: null
        });
        expect(service.getAdjustedUtcDateByAction(null, "plus_hour", 0, null, null)).toBe(null);
        expect(() => service.applyTimeAdjustAction(0, "plus_hour")).not.toThrow();
    });

    it("applyBulkRangeAllAction handles all duration action variants", () => {
        const module = loadTimeAdjustActionsModule();
        const actions = [
            "plus_hour",
            "minus_hour",
            "plus_day",
            "minus_day",
            "plus_week",
            "minus_week",
            "plus_four_weeks",
            "minus_four_weeks",
            "plus_custom_days",
            "minus_custom_days"
        ];

        actions.forEach((action) => {
            const ranges = [
                { startUtcMs: 1000, endUtcMs: 4000 },
                { startUtcMs: 7000, endUtcMs: 10000 }
            ];
            const service = module.createService({
                ensureMultiRangeState: () => { },
                getMultiRanges: () => ranges,
                getTimeAdjustDayStep: () => 3,
                isMultiRangeStartLinked: () => true,
                isMultiTab: () => true,
                renderMultiRanges: () => { },
                savePersistence: () => { }
            });

            expect(() => service.applyBulkRangeAllAction(0, action)).not.toThrow();
            expect(Number.isFinite(ranges[0].endUtcMs)).toBe(true);
            expect(Number.isFinite(ranges[1].endUtcMs)).toBe(true);
        });
    });

    it("applyBulkRangeAllAction exits for invalid action and empty ranges", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [{ startUtcMs: 1000, endUtcMs: 2000 }];
        let saveCalls = 0;
        const service = module.createService({
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            savePersistence: () => { saveCalls += 1; }
        });

        service.applyBulkRangeAllAction(0, "unknown_action");
        expect(ranges[0].endUtcMs).toBe(2000);
        expect(saveCalls).toBe(0);

        const emptyService = module.createService({
            ensureMultiRangeState: () => { },
            getMultiRanges: () => [],
            savePersistence: () => { saveCalls += 1; }
        });
        emptyService.applyBulkRangeAllAction(0, "plus_hour");
        expect(saveCalls).toBe(0);
    });

    it("applyMultiRangeTimeAdjustAction slot-0 regular actions sync start links", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [{ startUtcMs: 1000, endUtcMs: 2000 }];
        let setSlotCalls = 0;
        let syncStartLinkCalls = 0;
        let renderCalls = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            getBaseTimezoneRef: () => ({ type: "standard", zone: "UTC" }),
            getFixedOffsetForDisplayAtDate: () => 0,
            getMultiRangeSlotDate: () => new Date(Date.UTC(2026, 0, 1, 0, 0, 0)),
            timeService: {
                adjustDate: () => new Date(Date.UTC(2026, 0, 1, 1, 0, 0))
            },
            setMultiRangeSlotDate: () => { setSlotCalls += 1; },
            syncFollowingRangesByDuration: () => { },
            syncMultiRangeStartLinks: () => { syncStartLinkCalls += 1; },
            renderMultiRanges: () => { renderCalls += 1; },
            savePersistence: () => { }
        });

        service.applyMultiRangeTimeAdjustAction(0, 0, "plus_hour");

        expect(setSlotCalls).toBe(1);
        expect(syncStartLinkCalls).toBe(1);
        expect(renderCalls).toBe(1);
    });

    it("applyMultiRangeTimeAdjustAction exits when adjusted date is invalid", () => {
        const module = loadTimeAdjustActionsModule();
        const ranges = [{ startUtcMs: 1000, endUtcMs: 2000 }];
        let renderCalls = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => { },
            getMultiRanges: () => ranges,
            getBaseTimezoneRef: () => ({ type: "standard", zone: "UTC" }),
            getFixedOffsetForDisplayAtDate: () => 0,
            getMultiRangeSlotDate: () => null,
            setMultiRangeSlotDate: () => { throw new Error("should not run"); },
            renderMultiRanges: () => { renderCalls += 1; },
            savePersistence: () => { }
        });

        service.applyMultiRangeTimeAdjustAction(0, 0, "plus_hour");

        expect(renderCalls).toBe(0);
    });
});
