import path from "node:path";
import { createRequire } from "node:module";

import { DateTime } from "luxon";
import { afterEach, expect, test } from "vitest";

const require = createRequire(import.meta.url);
const TIME_CORE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "time-core.js");
const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "calculator-date-format.js");
const cleanups = [];

function loadDateFormat() {
    const previousTz = process.env.TZ;
    process.env.TZ = "UTC";
    [TIME_CORE_PATH, MODULE_PATH].forEach((modulePath) => {
        delete require.cache[require.resolve(modulePath)];
        require(modulePath);
    });
    cleanups.push(() => {
        [TIME_CORE_PATH, MODULE_PATH].forEach((modulePath) => delete require.cache[require.resolve(modulePath)]);
        delete globalThis.GTVCalculatorDateFormat;
        delete globalThis.GTVTimeCore;
        if (typeof previousTz === "string") process.env.TZ = previousTz;
        else delete process.env.TZ;
    });
    return globalThis.GTVCalculatorDateFormat.createService();
}

afterEach(() => {
    while (cleanups.length) cleanups.pop()();
});

const iso = (date) => (date ? date.toISOString() : null);

test("strict local and UTC builders reject impossible dates and keep years 0-99", () => {
    const f = loadDateFormat();
    expect(iso(f.buildValidatedLocalDate(2024, 2, 29, 10, 20, 30))).toBe("2024-02-29T10:20:30.000Z");
    expect(f.buildValidatedLocalDate(2025, 2, 29)).toBe(null);
    expect(f.buildValidatedLocalDate(2025, 1, 1, 24, 0, 0)).toBe(null);
    expect(iso(f.buildValidatedUtcDate("2026", "05", "10"))).toBe("2026-05-10T00:00:00.000Z");
    expect(f.buildValidatedUtcDate(2026, 4, 31)).toBe(null);
    expect(f.parseUtcDateOnlyString("0050-01-02").getUTCFullYear()).toBe(50);
});

test("date-only and datetime parsers accept only their exact formats", () => {
    const f = loadDateFormat();
    expect(iso(f.parseLocalDateOnlyString(" 2026-03-07 "))).toBe("2026-03-07T00:00:00.000Z");
    expect(f.parseLocalDateOnlyString("2026/03/07")).toBe(null);
    expect(iso(f.parseLocalDateTimeString("2026-03-07T23:00"))).toBe("2026-03-07T23:00:00.000Z");
    expect(iso(f.parseLocalDateTimeString("2026-03-07T23:00:05"))).toBe("2026-03-07T23:00:05.000Z");
    expect(f.parseLocalDateTimeString("2026-03-07 23:00")).toBe(null);
    expect(iso(f.parseUtcDateTimeString("2026-03-07T01:02"))).toBe("2026-03-07T01:02:00.000Z");
    expect(f.parseUtcDateTimeString("bad")).toBe(null);
    expect(iso(f.parseSqlDateTimeString("2026-03-07 01:02:03"))).toBe("2026-03-07T01:02:03.000Z");
    expect(f.parseSqlDateTimeString("2026-03-07T01:02:03")).toBe(null);
    expect(f.parseUtcDateOnlyString("")).toBe(null);
});

test("zoned ISO and RFC 2822 parsers require an explicit zone", () => {
    const f = loadDateFormat();
    expect(iso(f.parseZonedIsoString("2026-03-07T09:00:00+09:00"))).toBe("2026-03-07T00:00:00.000Z");
    expect(iso(f.parseZonedIsoString("2026-03-07T00:00Z"))).toBe("2026-03-07T00:00:00.000Z");
    expect(f.parseZonedIsoString("2026-03-07T00:00:00")).toBe(null);
    expect(iso(f.parseRfc2822String("Sat, 07 Mar 2026 09:00:00 +0900"))).toBe("2026-03-07T00:00:00.000Z");
    expect(f.parseRfc2822String("07/03/2026")).toBe(null);
});

for (const [label, luxonDT] of [["luxon", DateTime], ["fallback", null]]) {
    test(`ISO, SQL and RFC parsers agree with and without Luxon (${label})`, () => {
        const f = loadDateFormat();
        expect(iso(f.parseIsoLocalDateString("2026-03-07T10:00:00", luxonDT))).toBe("2026-03-07T10:00:00.000Z");
        expect(iso(f.parseIsoLocalDateString("2026-03-07T10:00:00-05:00", luxonDT))).toBe("2026-03-07T15:00:00.000Z");
        expect(iso(f.parseIsoLocalDateString("2026-03-07", luxonDT))).toBe("2026-03-07T00:00:00.000Z");
        expect(f.parseIsoLocalDateString("", luxonDT)).toBe(null);
        expect(f.parseIsoLocalDateString("03/07/2026", luxonDT)).toBe(null);
        expect(iso(f.parseIsoUtcDateString("2026-03-07T10:00", luxonDT))).toBe("2026-03-07T10:00:00.000Z");
        expect(iso(f.parseIsoUtcDateString("2026-03-07", luxonDT))).toBe("2026-03-07T00:00:00.000Z");
        expect(f.parseIsoUtcDateString("  ", luxonDT)).toBe(null);
        expect(iso(f.parseSqlDateWithLuxon("2026-03-07 10:11:12", luxonDT))).toBe("2026-03-07T10:11:12.000Z");
        expect(f.parseSqlDateWithLuxon("", luxonDT)).toBe(null);
        expect(iso(f.parseRfc2822DateWithLuxon("Sat, 07 Mar 2026 10:00:00 GMT", luxonDT))).toBe("2026-03-07T10:00:00.000Z");
        expect(f.parseRfc2822DateWithLuxon("", luxonDT)).toBe(null);
    });
}

test("toValidDate accepts dates, epoch numbers and supported strings only", () => {
    const f = loadDateFormat();
    const date = new Date("2026-03-07T00:00:00Z");
    const copy = f.toValidDate(date, DateTime);
    expect(copy).not.toBe(date);
    expect(iso(copy)).toBe(iso(date));
    expect(iso(f.toValidDate(1000, DateTime))).toBe("1970-01-01T00:00:01.000Z");
    expect(iso(f.toValidDate("2026-03-07 01:02:03", null))).toBe("2026-03-07T01:02:03.000Z");
    expect(f.toValidDate(Number.NaN, DateTime)).toBe(null);
    expect(f.toValidDate({}, DateTime)).toBe(null);
    expect(f.toValidDate("", DateTime)).toBe(null);
    expect(f.toValidDate(new Date("bad"), DateTime)).toBe(null);
});

test("formatters write local and UTC fields with the pad function", () => {
    const f = loadDateFormat();
    const date = new Date("2026-03-07T04:05:06Z");
    expect(f.formatDateOnly(date)).toBe("2026-03-07");
    expect(f.formatDateTimeForInput(date)).toBe("2026-03-07T04:05:06");
    expect(f.formatLocalDateTime(date)).toBe("2026-03-07 04:05:06");
    expect(f.formatUTCDateTime(date)).toBe("2026-03-07T04:05:06Z");
    expect(f.formatUTCDateOnlyStartOfDay(date)).toBe("2026-03-07 00:00:00");
    expect(f.formatDateOnly(date, (v) => `<${v}>`)).toBe("2026-<3>-<7>");
    expect(f.defaultPad2(-3)).toBe("00");
    expect(f.defaultPad2("x")).toBe("00");
    expect(f.isValidDateObject(date)).toBe(true);
    expect(f.isValidDateObject("2026-03-07")).toBe(false);
});

for (const [label, luxonDT] of [["luxon", DateTime], ["fallback", null]]) {
    test(`ISO and RFC 2822 parsers reject impossible calendar dates instead of rolling over (${label})`, () => {
        const f = loadDateFormat();
        expect(f.parseIsoUtcDateString("2023-02-29T00:00:00Z", luxonDT)).toBe(null);
        expect(f.parseIsoUtcDateString("2023-04-31T00:00:00Z", luxonDT)).toBe(null);
        expect(f.parseIsoLocalDateString("2023-02-29T10:00:00+09:00", luxonDT)).toBe(null);
        expect(f.parseRfc2822DateWithLuxon("Wed, 29 Feb 2023 00:00:00 GMT", luxonDT)).toBe(null);
        expect(f.parseRfc2822DateWithLuxon("Mon, 31 Apr 2023 10:00:00 +0900", luxonDT)).toBe(null);
        expect(f.parseRfc2822DateWithLuxon("Wed, 01 Xyz 2023 00:00:00 GMT", luxonDT)).toBe(null);

        expect(iso(f.parseIsoUtcDateString("2024-02-29T00:00:00Z", luxonDT))).toBe("2024-02-29T00:00:00.000Z");
        expect(iso(f.parseIsoLocalDateString("2023-03-01T10:00:00+09:00", luxonDT))).toBe("2023-03-01T01:00:00.000Z");
        expect(iso(f.parseRfc2822DateWithLuxon("Thu, 29 Feb 2024 00:00:00 GMT", luxonDT))).toBe("2024-02-29T00:00:00.000Z");
        expect(iso(f.parseZonedIsoString("2026-03-07T00:00:00.250Z"))).toBe("2026-03-07T00:00:00.250Z");
    });
}

test("toValidDate treats 0 as the Unix epoch and only empty values as no date", () => {
    const f = loadDateFormat();
    expect(iso(f.toValidDate(0, DateTime))).toBe("1970-01-01T00:00:00.000Z");
    expect(f.toValidDate(null, DateTime)).toBe(null);
    expect(f.toValidDate(undefined, DateTime)).toBe(null);
    expect(f.toValidDate("", DateTime)).toBe(null);
    expect(f.toValidDate(false, DateTime)).toBe(null);
    expect(f.toValidDate(true, DateTime)).toBe(null);
});

test("local dates accept years 0-99 like the UTC builder", () => {
    const f = loadDateFormat();
    expect(f.parseLocalDateOnlyString("0050-01-02").getFullYear()).toBe(50);
    expect(f.buildValidatedLocalDate(0, 2, 29).getMonth()).toBe(1);
    expect(f.buildValidatedLocalDate(99, 12, 31, 23, 59, 59).getFullYear()).toBe(99);
    expect(f.buildValidatedLocalDate(1, 2, 29)).toBe(null);
    expect(f.parseLocalDateTimeString("0050-01-02T10:00").getFullYear()).toBe(50);
});

for (const [label, luxonDT] of [["luxon", DateTime], ["fallback", null]]) {
    test(`ISO parsers accept the same standard forms with and without Luxon (${label})`, () => {
        const f = loadDateFormat();
        for (const refused of ["2023-02-28T24:00:00Z", "2024-060", "2024-W09-4", "20240229T000000Z", "2024-02-29T10", "2024-02", "2024", "2024-02-29T25:00:00Z"]) {
            expect(f.parseIsoUtcDateString(refused, luxonDT)).toBe(null);
            expect(f.parseIsoLocalDateString(refused, luxonDT)).toBe(null);
        }
        expect(iso(f.parseIsoUtcDateString("2024-02-29", luxonDT))).toBe("2024-02-29T00:00:00.000Z");
        expect(iso(f.parseIsoUtcDateString("2024-02-29T10:30", luxonDT))).toBe("2024-02-29T10:30:00.000Z");
        expect(iso(f.parseIsoUtcDateString("2024-02-29T10:30:15.250+09:00", luxonDT))).toBe("2024-02-29T01:30:15.250Z");
        expect(iso(f.parseIsoLocalDateString("2024-02-29T10:30:15Z", luxonDT))).toBe("2024-02-29T10:30:15.000Z");
    });
}
