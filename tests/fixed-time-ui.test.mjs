import { expect, test } from "vitest";

import { createMainContext } from "./helpers/create-main-context.mjs";

function seedGroupWithFixedTimes(run, fixedTimes = [], fixedDate = "") {
    run(`
        groups = [{
            name: "Team A",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedDate: ${JSON.stringify(fixedDate)},
            fixedTimes: ${JSON.stringify(fixedTimes)},
            activeMultiSubgroupId: "subgroup-0",
            multiSubgroups: [{
                id: "subgroup-0",
                name: "S1",
                multiRangeCount: 1,
                multiRanges: [{ startUtcMs: Date.UTC(2026, 2, 7, 0, 0, 0), endUtcMs: Date.UTC(2026, 2, 7, 1, 0, 0) }],
                multiRangeCollapsed: [false],
                multiRangeStartEditEnabled: [true],
                multiRangeEndEditEnabled: [true]
            }]
        }];
        activeGroupId = 0;
        currentMainTab = "live";
        activeGroupIdByMainTab = { live: 0, fixed: 0 };
    `);
}

test("fixed-time slot count clamps to 1..5 and emits boundary toasts", () => {
    const { sandbox, run } = createMainContext();
    seedGroupWithFixedTimes(run, []);
    run("renderFixedTimeTab = function() {}; renderTimelineFrame = function() {};");

    const toastKeys = [];
    sandbox.showToast = (message) => { toastKeys.push(String(message)); };

    sandbox.setFixedTimeSlotCount(5, { persist: false, rerender: false, showBoundaryToast: true });
    expect(run("groups[0].fixedTimes.length")).toBe(5);

    sandbox.setFixedTimeSlotCount(6, { persist: false, rerender: false, showBoundaryToast: true });
    expect(run("groups[0].fixedTimes.length")).toBe(5);
    expect(toastKeys).toContain("toast_fixed_time_max");

    sandbox.setFixedTimeSlotCount(0, { persist: false, rerender: false, showBoundaryToast: true });
    expect(run("groups[0].fixedTimes.length")).toBe(1);
    expect(toastKeys).toContain("toast_fixed_time_min");
});

test("fixed-time slot remove action respects minimum slot count", () => {
    const { sandbox, run } = createMainContext();
    seedGroupWithFixedTimes(run, [
        { id: "ft-1", name: "Standup", time: "09:00" },
        { id: "ft-2", name: "Release", time: "17:00" }
    ]);
    run("renderFixedTimeTab = function() {}; renderTimelineFrame = function() {};");
    const toastKeys = [];
    sandbox.showToast = (message) => { toastKeys.push(String(message)); };

    sandbox.removeFixedTimeSlot("ft-1");
    expect(run("groups[0].fixedTimes.length")).toBe(1);
    expect(run("groups[0].fixedTimes[0].id")).toBe("ft-2");

    sandbox.removeFixedTimeSlot("ft-2");
    expect(run("groups[0].fixedTimes.length")).toBe(1);
    expect(toastKeys).toContain("toast_fixed_time_min");
});

test("fixed-time UTC resolution follows selected base timezone", () => {
    const { sandbox, run } = createMainContext();
    run("if (Array.isArray(groups) && groups[0]) { groups[0].fixedDate = \"\"; }");
    const slot = { id: "ft-1", name: "Daily", time: "09:00" };
    const anchorDate = new Date("2026-03-07T00:00:00.000Z");
    const utcBase = { id: "utc", type: "standard", zone: "UTC", name_ko: "UTC", name_en: "UTC" };
    const seoulBase = { id: "tz-seoul", type: "standard", zone: "Asia/Seoul", name_ko: "Korea", name_en: "Korea" };

    const utcBased = sandbox.resolveFixedTimeSlotUtcDate(slot, utcBase, anchorDate);
    const seoulBased = sandbox.resolveFixedTimeSlotUtcDate(slot, seoulBase, anchorDate);

    expect(utcBased.toISOString()).toBe("2026-03-07T09:00:00.000Z");
    expect(seoulBased.toISOString()).toBe("2026-03-07T00:00:00.000Z");
});

test("fixed-time display for other timezone changes when base timezone changes", () => {
    const { sandbox, run } = createMainContext();
    run("if (Array.isArray(groups) && groups[0]) { groups[0].fixedDate = \"\"; }");
    const slot = { id: "ft-1", name: "Daily", time: "09:00" };
    const anchorDate = new Date("2026-03-07T00:00:00.000Z");
    const utcBase = { id: "utc", type: "standard", zone: "UTC", name_ko: "UTC", name_en: "UTC" };
    const seoulBase = { id: "tz-seoul", type: "standard", zone: "Asia/Seoul", name_ko: "Korea", name_en: "Korea" };
    const tokyo = { id: "tz-tokyo", type: "standard", zone: "Asia/Tokyo", name_ko: "Japan", name_en: "Japan" };

    const utcBasedUtcDate = sandbox.resolveFixedTimeSlotUtcDate(slot, utcBase, anchorDate);
    const seoulBasedUtcDate = sandbox.resolveFixedTimeSlotUtcDate(slot, seoulBase, anchorDate);

    const tokyoFromUtcBase = sandbox.formatFixedTimeForTimezoneAtUtc(utcBasedUtcDate, tokyo);
    const tokyoFromSeoulBase = sandbox.formatFixedTimeForTimezoneAtUtc(seoulBasedUtcDate, tokyo);

    expect(tokyoFromUtcBase).toBe("18:00:00");
    expect(tokyoFromSeoulBase).toBe("09:00:00");
});

test("fixed-time UTC resolution uses group fixedDate when provided", () => {
    const { sandbox, run } = createMainContext();
    seedGroupWithFixedTimes(run, [{ id: "ft-1", name: "Daily", time: "09:00" }], "2026-03-10");

    const slot = run("groups[0].fixedTimes[0]");
    const baseRef = { id: "utc", type: "standard", zone: "UTC", name_ko: "UTC", name_en: "UTC" };
    const anchorDate = new Date("2026-03-07T00:00:00.000Z");
    const result = sandbox.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);

    expect(result.toISOString()).toBe("2026-03-10T09:00:00.000Z");
});

test("fixed-time slot header label supports custom names and default numbering", () => {
    const { sandbox } = createMainContext();
    const custom = sandbox.getFixedTimeSlotHeaderLabel({ name: "Release" }, 0, 3);
    const fallback = sandbox.getFixedTimeSlotHeaderLabel({ name: "" }, 1, 3);

    expect(custom).toBe("Release");
    expect(fallback).toBe("th_fixed_time 2");
});
