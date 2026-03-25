import { expect, test } from "vitest";

import { createMainContext } from "./helpers/create-main-context.mjs";

test("core/time-change: ignores manual input while realtime mode is enabled", () => {
    const { sandbox, run } = createMainContext();
    let updateCalls = 0;
    sandbox.updateClocks = () => { updateCalls += 1; };

    run(`
        isRealtime = true;
        globalTimes = [new Date(Date.UTC(2026, 2, 7, 0, 0, 0)), new Date(Date.UTC(2026, 2, 7, 1, 0, 0))];
    `);

    sandbox.handleTimeChange("2026-03-07 09:30:00", "UTC", 0, null, "datetime");

    expect(run("globalTimes[0].toISOString()")).toBe("2026-03-07T00:00:00.000Z");
    expect(updateCalls).toBe(0);
});

test("core/time-change: converts custom timezone datetime input to UTC using selected row offset", () => {
    const { sandbox, run } = createMainContext();
    let updateCalls = 0;
    sandbox.updateClocks = () => { updateCalls += 1; };

    run(`
        isRealtime = false;
        currentMainTab = "live";
        activeGroupId = 0;
        activeGroupIdByMainTab = { live: 0, fixed: 0 };
        groups = [{
            name: "G",
            zones: [{
                id: "tz-custom",
                type: "custom",
                abbr: "KST",
                name: "KST",
                offH: 9,
                offM: 0
            }],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }],
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
        globalTimes = [new Date(Date.UTC(2026, 2, 6, 12, 0, 0)), new Date(Date.UTC(2026, 2, 6, 12, 0, 0))];
    `);

    sandbox.handleTimeChange("2026-03-07 09:00:00", "CUSTOM", 0, "tz-custom", "datetime");

    expect(run("globalTimes[0].toISOString()")).toBe("2026-03-07T00:00:00.000Z");
    expect(updateCalls).toBe(1);
});

test("core/group-tab: switching tabs restores active group per tab and toggles realtime", () => {
    const { sandbox, run } = createMainContext();

    run(`
        groups = [
            { name: "Live Group", zones: [], baseTimezoneId: "utc", showUtcRow: true, utcRowOrder: 0 },
            { name: "Fixed Group", zones: [], baseTimezoneId: "utc", showUtcRow: true, utcRowOrder: 0 }
        ];
        activeGroupId = 1;
        activeGroupIdByMainTab = { live: 1, fixed: 0 };
        currentMainTab = "live";
        isRealtime = true;
        slotCount = 1;
    `);

    sandbox.switchMainTab("fixed");

    expect(run("currentMainTab")).toBe("fixed");
    expect(run("activeGroupId")).toBe(0);
    expect(run("isRealtime")).toBe(false);

    run("activeGroupId = 0;");
    sandbox.switchMainTab("live");

    expect(run("currentMainTab")).toBe("live");
    expect(run("activeGroupId")).toBe(1);
    expect(run("activeGroupIdByMainTab.fixed")).toBe(0);
    expect(run("isRealtime")).toBe(true);
});

test("core/persistence: loadPersistence hydrates current storage snapshot including fixed-time state", async () => {
    const { run } = createMainContext();
    const payload = {
        groups: [{
            name: "Imported Snapshot",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedDate: "2026-03-08",
            fixedTimes: [{ id: "ft-1", name: "Slot A", time: "12:30" }]
        }],
        activeGroupId: 0,
        currentMainTab: "fixed-time",
        activeGroupIdByMainTab: { live: 0, fixed: 0 },
        slotCount: 1,
        showCopyFormat: false,
        showTimeline: true
    };

    run(`localStorage.setItem(STORAGE_KEY, ${JSON.stringify(JSON.stringify(payload))});`);
    await run("loadPersistence()");

    expect(run("groups[0].name")).toBe("Imported Snapshot");
    expect(run("groups[0].fixedDate")).toBe("2026-03-08");
    expect(run("groups[0].fixedTimes.length")).toBe(1);
    expect(run("groups[0].fixedTimes[0].time")).toBe("12:30");
    expect(run("currentMainTab")).toBe("fixed-time");
    expect(run("showTimeline")).toBe(true);
});

test("core/fixed-time: setFixedTimeSlotCount grows and shrinks slots while preserving valid state", () => {
    const { sandbox, run } = createMainContext();

    run(`
        groups = [{
            name: "Fixed Group",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedDate: "",
            fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }],
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
        activeGroupIdByMainTab = { live: 0, fixed: 0 };
        currentMainTab = "fixed-time";
    `);

    expect(sandbox.setFixedTimeSlotCount(3, { persist: false, rerender: false })).toBe(true);
    expect(run("groups[0].fixedTimes.length")).toBe(3);
    expect(run("new Set(groups[0].fixedTimes.map((slot) => slot.id)).size")).toBe(3);

    expect(sandbox.setFixedTimeSlotCount(1, { persist: false, rerender: false })).toBe(true);
    expect(run("groups[0].fixedTimes.length")).toBe(1);
    expect(run("groups[0].fixedTimes[0].id")).toBe("ft-1");
});

test("core/fixed-time: setCurrentGroupFixedDate supports non-rerender/non-persist update path", () => {
    const { sandbox, run } = createMainContext();
    let renderFixedCalls = 0;
    let renderTimelineCalls = 0;
    let saveCalls = 0;
    sandbox.renderFixedTimeTab = () => { renderFixedCalls += 1; };
    sandbox.renderTimelineFrame = () => { renderTimelineCalls += 1; };
    sandbox.savePersistenceSafely = () => { saveCalls += 1; };

    run(`
        groups = [{
            name: "Fixed Group",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedDate: "2026-03-07",
            fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }]
        }];
        activeGroupId = 0;
        currentMainTab = "fixed-time";
    `);

    expect(sandbox.setCurrentGroupFixedDate("2026-03-08", { rerender: false, persist: false })).toBe(true);
    expect(run("groups[0].fixedDate")).toBe("2026-03-08");
    expect(renderFixedCalls).toBe(0);
    expect(renderTimelineCalls).toBe(0);
    expect(saveCalls).toBe(0);
    expect(sandbox.setCurrentGroupFixedDate("2026-03-08", { rerender: false, persist: false })).toBe(false);
});
