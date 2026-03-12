import { describe, expect, it } from "vitest";

import { createMainContext } from "./helpers/create-main-context.mjs";

describe("Global Time Viewer - Time Logic", () => {
    it("buildStrictUtcDateFromParts returns a valid Date for valid parts", () => {
        const { sandbox } = createMainContext();
        const result = sandbox.buildStrictUtcDateFromParts({
            year: 2024,
            month: 3,
            day: 7,
            hour: 15,
            minute: 30,
            second: 0
        });

        expect(result).toBeInstanceOf(Date);
        expect(result.getUTCFullYear()).toBe(2024);
        expect(result.getUTCMonth()).toBe(2);
        expect(result.getUTCDate()).toBe(7);
    });

    it("buildStrictUtcDateFromParts rejects invalid calendar dates", () => {
        const { sandbox } = createMainContext();
        const result = sandbox.buildStrictUtcDateFromParts({
            year: 2024,
            month: 2,
            day: 30,
            hour: 10,
            minute: 0,
            second: 0
        });
        expect(result).toBeNull();
    });

    it("handleTimeChange updates UTC slot when valid value is provided", () => {
        const { sandbox, run } = createMainContext();
        sandbox.showToast = () => {};
        sandbox.renderList = () => {};
        sandbox.updateClocks = () => {};

        run(`
            isRealtime = false;
            globalTimes = [new Date(Date.UTC(2024, 0, 1, 0, 0, 0)), new Date(Date.UTC(2024, 0, 1, 0, 0, 0))];
        `);

        sandbox.handleTimeChange("2024-05-20 10:00:00", "UTC", 0, null, "datetime");

        expect(run("globalTimes[0].toISOString()")).toBe("2024-05-20T10:00:00.000Z");
    });

    it("syncFollowingRangesByDuration keeps linked ranges chained by duration", () => {
        const { sandbox, run } = createMainContext();
        const baseStart = Date.UTC(2024, 0, 1, 0, 0, 0);

        run(`
            multiRanges = [
                { startUtcMs: ${baseStart}, endUtcMs: ${baseStart + 3600000} },
                { startUtcMs: ${baseStart + 3600000}, endUtcMs: ${baseStart + 7200000} },
                { startUtcMs: ${baseStart + 7200000}, endUtcMs: ${baseStart + 10800000} }
            ];
            multiRangeStartEditEnabled = [false, false, false];
            multiRangeEndEditEnabled = [true, true, true];
            multiRangeCount = 3;
        `);

        run(`multiRanges[0].endUtcMs = ${baseStart + 7200000};`);
        sandbox.syncFollowingRangesByDuration(0);

        expect(run("multiRanges[1].startUtcMs")).toBe(baseStart + 7200000);
        expect(run("multiRanges[1].endUtcMs")).toBe(baseStart + 10800000);
        expect(run("multiRanges[2].startUtcMs")).toBe(baseStart + 10800000);
    });
});
