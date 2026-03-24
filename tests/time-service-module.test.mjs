import path from "node:path";
import { createRequire } from "node:module";

import { DateTime } from "luxon";
import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-service.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createService(deps = {}) {
    const globalPatches = {
        window: globalThis,
        console
    };
    const keys = ["window", "console", "GTVTimeService", ...Object.keys(globalPatches)];
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

    return (globalThis.window?.GTVTimeService || globalThis.GTVTimeService).createService(deps);
}

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

test("formatDuration renders Korean label correctly", () => {
    const service = createService({ luxon: { DateTime } });
    const startMs = Date.parse("2026-01-01T00:00:00Z");
    const endMs = Date.parse("2026-01-02T02:03:00Z");
    expect(service.formatDuration(startMs, endMs, "ko")).toBe("1일 2시간 3분");
});

test("getDaySpan returns null on invalid inputs", () => {
    const service = createService({ luxon: { DateTime } });
    expect(service.getDaySpan(null, "2026-01-01")).toBe(null);
    expect(service.getDaySpan("2026-01-01", undefined)).toBe(null);
    expect(service.getDaySpan("bad-value", "2026-01-01")).toBe(null);
});

test("fallback mode without luxon still shifts and converts custom offset times", () => {
    const service = createService({});
    const baseDate = new Date("2026-01-01T00:00:00Z");
    const shifted = service.shiftDate(baseDate, { days: 1 }, "CUSTOM", 540);
    expect(shifted.toISOString()).toBe("2026-01-02T00:00:00.000Z");

    const utcDate = service.fromLocalPartsToUtc(
        { year: 2026, month: 1, day: 1, hour: 9, minute: 0, second: 0 },
        "CUSTOM",
        540
    );
    expect(utcDate.toISOString()).toBe("2026-01-01T00:00:00.000Z");
});

test("adjustDate now action returns current Date object", () => {
    const service = createService({});
    const result = service.adjustDate(new Date("2026-01-01T00:00:00Z"), "now");
    expect(result instanceof Date).toBe(true);
    expect(Number.isFinite(result.getTime())).toBe(true);
});
