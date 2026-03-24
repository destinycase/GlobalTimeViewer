import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-input-mutations.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function parsePartsByMode(value, mode) {
    if (mode === "datetime") {
        const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
        return m ? m.slice(1).map(Number) : null;
    }
    if (mode === "date") {
        const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return m ? m.slice(1).map(Number) : null;
    }
    if (mode === "time") {
        const m = String(value).match(/^(\d{2}):(\d{2}):(\d{2})$/);
        return m ? m.slice(1).map(Number) : null;
    }
    return null;
}

function buildUtcDateFromParts(parts) {
    return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
}

function loadTimeInputMutationsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVTimeInputMutations", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTimeInputMutations || globalThis.GTVTimeInputMutations;
}

describe("GTV time input mutations module", () => {
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

    it("handleTimeChange applies UTC datetime directly", () => {
        const module = loadTimeInputMutationsModule();
        const globalTimes = [new Date(Date.UTC(2026, 0, 1, 0, 0, 0))];
        let updateCount = 0;
        const service = module.createService({
            isRealtime: () => false,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            getGlobalTime: (idx) => globalTimes[idx],
            setGlobalTime: (idx, value) => { globalTimes[idx] = value; },
            updateClocks: () => { updateCount += 1; },
            t: (key) => key,
            showToast: () => {}
        });

        service.handleTimeChange("2026-03-01 10:20:30", "UTC", 0, null, "datetime");
        expect(globalTimes[0].toISOString()).toBe("2026-03-01T10:20:30.000Z");
        expect(updateCount).toBe(1);
    });

    it("resolves local date parts for UTC, custom, fixed-offset, and fallback paths", () => {
        const module = loadTimeInputMutationsModule();
        const zones = [{ id: "zone-a" }];
        const reference = new Date(Date.UTC(2026, 2, 1, 23, 30, 0));
        const service = module.createService({
            getCurrentGroupZones: () => zones,
            getCustomOffsetMinutes: () => 120,
            getFixedOffsetForDisplayAtDate: () => 60,
            resolveLocalDateParts: () => ({ Y: 1999, M: 12, D: 31 }),
            getGlobalTime: () => reference
        });

        expect(service.resolveLocalDatePartsByTimezoneAtDate("UTC", reference)).toEqual({ Y: 2026, M: 3, D: 1 });
        expect(service.resolveLocalDatePartsByTimezoneAtDate("CUSTOM", reference, "zone-a")).toEqual({ Y: 2026, M: 3, D: 2 });
        expect(service.resolveLocalDatePartsByTimezoneAtDate("Asia/Seoul", reference, "zone-a")).toEqual({ Y: 2026, M: 3, D: 2 });
        expect(service.resolveLocalDatePartsByTimezone("Europe/Paris", 0, null)).toEqual({ Y: 1999, M: 12, D: 31 });
    });

    it("returns null for unresolved custom zone and invalid fallback date parts", () => {
        const module = loadTimeInputMutationsModule();
        const ref = new Date(Date.UTC(2026, 2, 1, 0, 0, 0));
        const service = module.createService({
            getCurrentGroupZones: () => [],
            resolveLocalDateParts: () => ({ Y: 2026, M: Number.NaN, D: 1 })
        });

        expect(service.resolveLocalDatePartsByTimezoneAtDate("CUSTOM", ref, "missing")).toBeNull();
        expect(service.resolveLocalDatePartsByTimezoneAtDate("Asia/Seoul", ref, null)).toBeNull();
    });

    it("buildStrictUtcDateFromParts returns null when dependency is absent or invalid", () => {
        const module = loadTimeInputMutationsModule();
        const noDepService = module.createService();
        expect(noDepService.buildStrictUtcDateFromParts({ year: 2026, month: 3, day: 1, hour: 0, minute: 0, second: 0 })).toBeNull();

        const invalidService = module.createService({
            buildStrictUtcDateFromParts: () => new Date("invalid-date")
        });
        expect(invalidService.buildStrictUtcDateFromParts({ year: 2026, month: 3, day: 1, hour: 0, minute: 0, second: 0 })).toBeNull();
    });

    it("handleTimeChange exits early for realtime mode and inputMode none", () => {
        const module = loadTimeInputMutationsModule();
        let parseCount = 0;
        const service = module.createService({
            isRealtime: () => true,
            parseDateTimeParts: () => {
                parseCount += 1;
                return null;
            }
        });

        service.handleTimeChange("2026-03-01 10:20:30", "UTC", 0, null, "datetime");
        service.handleTimeChange("2026-03-01 10:20:30", "UTC", 0, null, "none");
        expect(parseCount).toBe(0);
    });

    it("handleTimeChange shows invalid-date feedback when parsing fails", () => {
        const module = loadTimeInputMutationsModule();
        const toasts = [];
        let renderListCount = 0;
        const service = module.createService({
            isRealtime: () => false,
            parseDateTimeParts: () => null,
            t: (key) => `msg:${key}`,
            showToast: (msg) => toasts.push(msg),
            renderList: () => { renderListCount += 1; }
        });

        service.handleTimeChange("bad-value", "UTC", 0, null, "datetime");
        expect(toasts).toEqual(["msg:toast_invalid_date"]);
        expect(renderListCount).toBe(1);
    });

    it("handleTimeChange supports date/time modes and timezone offset fallback", () => {
        const module = loadTimeInputMutationsModule();
        const globalTimes = [new Date(Date.UTC(2026, 2, 2, 0, 0, 0))];
        let updateCount = 0;
        const service = module.createService({
            isRealtime: () => false,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            getGlobalTime: () => globalTimes[0],
            getTimezoneOffset: () => 180,
            setGlobalTime: (_idx, value) => { globalTimes[0] = value; },
            updateClocks: () => { updateCount += 1; },
            t: (key) => key,
            showToast: () => {}
        });

        service.handleTimeChange("2026-03-02", "UTC", 0, null, "date");
        expect(globalTimes[0].toISOString()).toBe("2026-03-02T00:00:00.000Z");

        service.handleTimeChange("04:05:06", "UTC", 0, null, "time");
        expect(globalTimes[0].toISOString()).toBe("2026-03-02T04:05:06.000Z");

        service.handleTimeChange("2026-03-03 12:00:00", "Asia/Seoul", 0, null, "datetime");
        expect(globalTimes[0].toISOString()).toBe("2026-03-03T09:00:00.000Z");
        expect(updateCount).toBe(3);
    });

    it("handleTimeChange handles custom offsets and invalid standard offsets", () => {
        const module = loadTimeInputMutationsModule();
        const zones = [{ id: "custom-1" }];
        const globalTimes = [new Date(Date.UTC(2026, 2, 1, 0, 0, 0))];
        let updateCount = 0;
        const service = module.createService({
            isRealtime: () => false,
            getCurrentGroupZones: () => zones,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            getCustomOffsetMinutes: () => 90,
            getFixedOffsetForDisplayAtDate: () => Number.NaN,
            getTimezoneOffset: () => Number.NaN,
            setGlobalTime: (_idx, value) => { globalTimes[0] = value; },
            updateClocks: () => { updateCount += 1; },
            t: (key) => key,
            showToast: () => {}
        });

        service.handleTimeChange("2026-03-03 12:00:00", "CUSTOM", 0, "custom-1", "datetime");
        expect(globalTimes[0].toISOString()).toBe("2026-03-03T10:30:00.000Z");
        expect(updateCount).toBe(1);

        service.handleTimeChange("2026-03-03 12:00:00", "Asia/Seoul", 0, null, "datetime");
        expect(updateCount).toBe(1);
    });

    it("handleMultiRangeTimeChange updates range end and persists", () => {
        const module = loadTimeInputMutationsModule();
        const baseStart = Date.UTC(2026, 2, 1, 0, 0, 0);
        const ranges = [{ startUtcMs: baseStart, endUtcMs: baseStart + 3600000 }];
        let renderCount = 0;
        let persistCount = 0;
        const service = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: (rangeIdx, slotIdx, nextDate) => {
                if (slotIdx === 0) ranges[rangeIdx].startUtcMs = nextDate.getTime();
                else ranges[rangeIdx].endUtcMs = nextDate.getTime();
            },
            syncFollowingRangesByDuration: () => {},
            syncMultiRangeStartLinks: () => {},
            renderMultiRanges: () => { renderCount += 1; },
            savePersistence: () => { persistCount += 1; },
            t: (key) => key,
            showToast: () => {}
        });

        service.handleMultiRangeTimeChange(0, "2026-03-01 02:00:00", "UTC", 1, null, "datetime");
        expect(ranges[0].endUtcMs).toBe(Date.UTC(2026, 2, 1, 2, 0, 0));
        expect(renderCount).toBe(1);
        expect(persistCount).toBe(1);
    });

    it("handleMultiRangeTimeChange respects guard conditions and inputMode none", () => {
        const module = loadTimeInputMutationsModule();
        const ranges = [{ startUtcMs: Date.UTC(2026, 2, 1, 0, 0, 0), endUtcMs: Date.UTC(2026, 2, 1, 1, 0, 0) }];
        let setCount = 0;

        const notMultiTabService = module.createService({
            isMultiTab: () => false,
            setMultiRangeSlotDate: () => { setCount += 1; }
        });
        notMultiTabService.handleMultiRangeTimeChange(0, "2026-03-01 01:00:00", "UTC", 1, null, "datetime");

        const startDisabledService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => false,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: () => { setCount += 1; },
            renderMultiRanges: () => {},
            savePersistence: () => {}
        });
        startDisabledService.handleMultiRangeTimeChange(1, "2026-03-01 01:00:00", "UTC", 0, null, "datetime");

        const endDisabledService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => false,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: () => { setCount += 1; },
            renderMultiRanges: () => {},
            savePersistence: () => {}
        });
        endDisabledService.handleMultiRangeTimeChange(0, "2026-03-01 01:00:00", "UTC", 1, null, "datetime");

        const noRangeService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ({ bad: true }),
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: () => { setCount += 1; },
            renderMultiRanges: () => {},
            savePersistence: () => {}
        });
        noRangeService.handleMultiRangeTimeChange(0, "2026-03-01 01:00:00", "UTC", 1, null, "datetime");

        const noneModeService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: () => { setCount += 1; },
            renderMultiRanges: () => {},
            savePersistence: () => {}
        });
        noneModeService.handleMultiRangeTimeChange(0, "2026-03-01 01:00:00", "UTC", 1, null, "none");

        expect(setCount).toBe(0);
    });

    it("handleMultiRangeTimeChange renders invalid feedback and syncs start links", () => {
        const module = loadTimeInputMutationsModule();
        const ranges = [{ startUtcMs: Date.UTC(2026, 2, 1, 0, 0, 0), endUtcMs: Date.UTC(2026, 2, 1, 1, 0, 0) }];
        let renderCount = 0;
        const toasts = [];
        let startLinkSyncCount = 0;

        const invalidService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: () => null,
            t: (key) => key,
            showToast: (msg) => toasts.push(msg),
            renderMultiRanges: () => { renderCount += 1; }
        });
        invalidService.handleMultiRangeTimeChange(0, "bad", "UTC", 0, null, "datetime");

        const validStartService = module.createService({
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => ranges,
            parseDateTimeParts: parsePartsByMode,
            buildStrictUtcDateFromParts: buildUtcDateFromParts,
            setMultiRangeSlotDate: (rangeIdx, slotIdx, nextDate) => {
                if (slotIdx === 0) ranges[rangeIdx].startUtcMs = nextDate.getTime();
            },
            syncMultiRangeStartLinks: () => { startLinkSyncCount += 1; },
            syncFollowingRangesByDuration: () => {},
            renderMultiRanges: () => { renderCount += 1; },
            savePersistence: () => {}
        });
        validStartService.handleMultiRangeTimeChange(0, "2026-03-01 03:00:00", "UTC", 0, null, "datetime");

        expect(toasts).toEqual(["toast_invalid_date"]);
        expect(renderCount).toBe(2);
        expect(startLinkSyncCount).toBe(1);
        expect(ranges[0].startUtcMs).toBe(Date.UTC(2026, 2, 1, 3, 0, 0));
    });
});
