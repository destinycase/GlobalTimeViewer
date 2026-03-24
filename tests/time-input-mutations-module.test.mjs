import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-input-mutations.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

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
            parseDateTimeParts: (value, mode) => {
                if (mode !== "datetime") return null;
                const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
                return m ? m.slice(1).map(Number) : null;
            },
            buildStrictUtcDateFromParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
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
            parseDateTimeParts: (value, mode) => {
                if (mode !== "datetime") return null;
                const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
                return m ? m.slice(1).map(Number) : null;
            },
            buildStrictUtcDateFromParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
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
});
