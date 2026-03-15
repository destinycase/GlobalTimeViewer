import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-core.js");
const moduleCode = fs.readFileSync(MODULE_PATH, "utf8");

function createApi() {
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
    vm.runInContext(moduleCode, sandbox, { filename: "js/modules/time-core.js" });
    return sandbox.GTVTimeCore;
}

test("sanitizeTimezoneId and sanitizeBaseTimezoneId normalize UTC aliases", () => {
    const api = createApi();
    expect(api.sanitizeTimezoneId(" UTC ")).toBe("");
    expect(api.sanitizeTimezoneId("Asia/Seoul")).toBe("Asia/Seoul");
    expect(api.sanitizeBaseTimezoneId(" UTC ")).toBe("utc");
    expect(api.sanitizeBaseTimezoneId("")).toBe("utc");
});

test("buildStrictUtcDateFromParts accepts exact UTC parts and rejects overflow", () => {
    const api = createApi();
    const ok = api.buildStrictUtcDateFromParts({
        year: 2024,
        month: 2,
        day: 29,
        hour: 23,
        minute: 59,
        second: 59
    });
    const bad = api.buildStrictUtcDateFromParts({
        year: 2026,
        month: 2,
        day: 31,
        hour: 12,
        minute: 0,
        second: 0
    });

    expect(ok).toBeInstanceOf(Date);
    expect(ok.toISOString()).toBe("2024-02-29T23:59:59.000Z");
    expect(bad).toBe(null);
});

test("sanitizeUtcMs prefers numeric/date values and falls back when invalid", () => {
    const api = createApi();
    expect(api.sanitizeUtcMs("1700000000000", 1)).toBe(1700000000000);
    expect(api.sanitizeUtcMs(new Date("2026-03-07T00:00:00Z"), 1)).toBe(Date.parse("2026-03-07T00:00:00Z"));
    expect(api.sanitizeUtcMs("not-a-number", 123)).toBe(123);
});

test("getCustomOffsetMinutes preserves sign semantics and pad/clamp helpers work", () => {
    const api = createApi();
    expect(api.getCustomOffsetMinutes({ offH: -9, offM: 30 })).toBe(-570);
    expect(api.getCustomOffsetMinutes({ offH: 0, offM: 30 })).toBe(30);
    expect(api.pad(7)).toBe("07");
    expect(api.clampNumber(15, 0, 10)).toBe(10);
});
