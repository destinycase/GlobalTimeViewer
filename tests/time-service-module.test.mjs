import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { DateTime } from "luxon";
import { expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-service.js");
const moduleCode = fs.readFileSync(MODULE_PATH, "utf8");

function createService(deps = {}) {
    const sandbox = {
        console,
        Date,
        Math,
        Number,
        String,
        Object,
        Array,
        parseInt
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(moduleCode, sandbox, { filename: "js/modules/time-service.js" });
    return sandbox.GTVTimeService.createService(deps);
}

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
