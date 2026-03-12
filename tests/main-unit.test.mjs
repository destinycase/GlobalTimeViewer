import { expect, test } from "vitest";

import { createMainContext } from "./helpers/create-main-context.mjs";

test("sanitizeTimezoneId normalizes reserved or empty ids", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.sanitizeTimezoneId(" utc ")).toBe("");
    expect(sandbox.sanitizeTimezoneId("UTC")).toBe("");
    expect(sandbox.sanitizeTimezoneId("tz-001")).toBe("tz-001");
    expect(sandbox.sanitizeTimezoneId("")).toBe("");
    expect(sandbox.sanitizeTimezoneId(null)).toBe("");
});

test("sanitizeBaseTimezoneId normalizes utc and empty values", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.sanitizeBaseTimezoneId(" utc ")).toBe("utc");
    expect(sandbox.sanitizeBaseTimezoneId("")).toBe("utc");
    expect(sandbox.sanitizeBaseTimezoneId("tz-main")).toBe("tz-main");
});

test("buildStrictUtcDateFromParts accepts valid UTC date parts", () => {
    const { sandbox } = createMainContext();
    const result = sandbox.buildStrictUtcDateFromParts({
        year: 2024,
        month: 2,
        day: 29,
        hour: 23,
        minute: 59,
        second: 59
    });
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2024-02-29T23:59:59.000Z");
});

test("buildStrictUtcDateFromParts rejects overflow/invalid date parts", () => {
    const { sandbox } = createMainContext();
    expect(
        sandbox.buildStrictUtcDateFromParts({
            year: 2026,
            month: 2,
            day: 31,
            hour: 10,
            minute: 0,
            second: 0
        })
    ).toBe(null);
    expect(
        sandbox.buildStrictUtcDateFromParts({
            year: 2026,
            month: 1,
            day: 1,
            hour: 24,
            minute: 0,
            second: 0
        })
    ).toBe(null);
});

test("getCustomOffsetMinutes preserves sign for negative hour offsets", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.getCustomOffsetMinutes({ offH: -9, offM: 30 })).toBe(-570);
    expect(sandbox.getCustomOffsetMinutes({ offH: 0, offM: 30 })).toBe(30);
});

test("handleTimeChange rejects invalid datetime input without mutating state", () => {
    const { sandbox, run } = createMainContext();
    let toasts = 0;
    let renderCalls = 0;
    sandbox.showToast = () => { toasts += 1; };
    sandbox.renderList = () => { renderCalls += 1; };
    sandbox.updateClocks = () => { };

    run(`
        isRealtime = false;
        globalTimes = [new Date(Date.UTC(2026, 0, 1, 0, 0, 0)), new Date(Date.UTC(2026, 0, 1, 0, 0, 0))];
    `);

    sandbox.handleTimeChange("2026-02-31 10:00:00", "UTC", 0, null, "datetime");

    expect(run("globalTimes[0].toISOString()")).toBe("2026-01-01T00:00:00.000Z");
    expect(toasts).toBe(1);
    expect(renderCalls).toBe(1);
});

test("handleTimeChange applies valid UTC datetime input", () => {
    const { sandbox, run } = createMainContext();
    let updateCalls = 0;
    sandbox.showToast = () => { };
    sandbox.renderList = () => { };
    sandbox.updateClocks = () => { updateCalls += 1; };

    run(`
        isRealtime = false;
        globalTimes = [new Date(Date.UTC(2026, 0, 1, 0, 0, 0)), new Date(Date.UTC(2026, 0, 1, 0, 0, 0))];
    `);

    sandbox.handleTimeChange("2026-02-28 10:20:30", "UTC", 0, null, "datetime");

    expect(run("globalTimes[0].toISOString()")).toBe("2026-02-28T10:20:30.000Z");
    expect(updateCalls).toBe(1);
});

test("sanitizeGroup repairs duplicate/reserved timezone ids", () => {
    const { sandbox } = createMainContext();
    const imported = {
        name: "Imported Group",
        zones: [
            { id: "dup", type: "standard", zone: "Asia/Seoul", name_ko: "KR", name_en: "KR" },
            { id: "dup", type: "standard", zone: "Europe/London", name_ko: "UK", name_en: "UK" },
            { id: "utc", type: "standard", zone: "Asia/Tokyo", name_ko: "JP", name_en: "JP" },
            { id: "", type: "custom", abbr: "X", name: "X", offH: 9, offM: 0 }
        ],
        baseTimezoneId: "dup",
        showUtcRow: true,
        utcRowOrder: 0
    };

    const sanitized = sandbox.sanitizeGroup(imported, 0, null);
    const ids = sanitized.zones.map((zone) => zone.id);

    expect(ids.length).toBe(4);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.includes("utc")).toBe(false);
    expect(ids.every((id) => typeof id === "string" && id.trim())).toBe(true);
    expect(sanitized.baseTimezoneId).toBe("dup");
});

test("sanitizeGroup falls back base timezone to utc when missing", () => {
    const { sandbox } = createMainContext();
    const imported = {
        name: "No Base Match",
        zones: [
            { id: "tz-1", type: "standard", zone: "Asia/Seoul", name_ko: "KR", name_en: "KR" }
        ],
        baseTimezoneId: "missing-id",
        showUtcRow: true,
        utcRowOrder: 0
    };

    const sanitized = sandbox.sanitizeGroup(imported, 0, null);
    expect(sanitized.baseTimezoneId).toBe("utc");
});

test("sanitizeGroup preserves null fixedOffsetMinutes for dynamic standard zones", () => {
    const { sandbox } = createMainContext();
    const imported = {
        name: "Keep Dynamic Offset",
        zones: [
            { id: "tz-1", type: "standard", zone: "Asia/Seoul", name_ko: "KR", name_en: "KR", fixedOffsetMinutes: null }
        ],
        baseTimezoneId: "tz-1",
        showUtcRow: true,
        utcRowOrder: 0
    };

    const sanitized = sandbox.sanitizeGroup(imported, 0, null);
    expect(sanitized.zones[0].fixedOffsetMinutes).toBe(null);
});

test("getFixedOffsetForDisplayAtDate treats null/blank as no fixed offset", () => {
    const { sandbox } = createMainContext();
    const anchorDate = new Date(Date.UTC(2026, 2, 7, 0, 0, 0));

    expect(
        sandbox.getFixedOffsetForDisplayAtDate(
            { type: "standard", zone: "Asia/Seoul", fixedOffsetMinutes: null },
            anchorDate
        )
    ).toBe(null);

    expect(
        sandbox.getFixedOffsetForDisplayAtDate(
            { type: "standard", zone: "Asia/Seoul", fixedOffsetMinutes: "" },
            anchorDate
        )
    ).toBe(null);

    expect(
        sandbox.getFixedOffsetForDisplayAtDate(
            { type: "standard", zone: "UTC", fixedOffsetMinutes: 540 },
            anchorDate
        )
    ).toBe(null);

    expect(
        sandbox.getFixedOffsetForDisplayAtDate(
            { type: "standard", zone: "Asia/Seoul", fixedOffsetMinutes: 0 },
            anchorDate
        )
    ).toBe(0);
});

test("formatUtcOffsetLabel returns signed padded UTC offset labels", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.formatUtcOffsetLabel(0)).toBe("UTC+00:00");
    expect(sandbox.formatUtcOffsetLabel(-330)).toBe("UTC-05:30");
    expect(sandbox.formatUtcOffsetLabel(570)).toBe("UTC+09:30");
});

test("createStandardTimezoneFromSelectableEntry builds fixed standard timezone payload", () => {
    const { sandbox } = createMainContext();
    const result = sandbox.createStandardTimezoneFromSelectableEntry({
        kind: "standard_list",
        zone: "Asia/Seoul",
        abbr: "gmt+9",
        fixedOffsetMinutes: 540
    });

    expect(result).toMatchObject({
        type: "standard",
        zone: "Asia/Seoul",
        name_ko: "UTC+09:00 표준시",
        name_en: "UTC+09:00 Standard Time",
        fixedAbbr: "GMT+9",
        fixedOffsetMinutes: 540
    });
    expect(result.id).toMatch(/^tz-/);
});

test("getZoneDisplayName localizes standard IANA timezone", () => {
    const { sandbox, run } = createMainContext();

    // The environment already defined TZ_DATABASE via main.js, so we only need to redefine the getter.
    run(`
        getLocalizedTZLabel = function(tzData) {
            if (currentLang === "en") return tzData.name_en + " - " + tzData.city_en;
            return tzData.name + " - " + tzData.city;
        };
    `);

    // South Korea is already in TZ_DATABASE, we just need to pass an object representing it.
    const tzSeoul = { type: "standard", zone: "Asia/Seoul", name_ko: "Past KR", name_en: "Past EN" };

    run(`currentLang = "ko";`);
    expect(sandbox.getZoneDisplayName(tzSeoul)).toBe("대한민국 - 서울");

    run(`currentLang = "en";`);
    expect(sandbox.getZoneDisplayName(tzSeoul)).toBe("South Korea - Seoul");
});

test("getZoneDisplayName localizes fixed offset standard time", () => {
    const { sandbox, run } = createMainContext();

    run(`
        formatUtcOffsetLabel = function(totalMinutes) {
            const sign = totalMinutes >= 0 ? "+" : "-";
            const abs = Math.abs(totalMinutes);
            const hh = String(Math.floor(abs / 60)).padStart(2, "0");
            const mm = String(abs % 60).padStart(2, "0");
            return "UTC" + sign + hh + ":" + mm;
        };
    `);

    const tzFixed = { type: "standard", zone: "UTC", fixedAbbr: "GMT+9", fixedOffsetMinutes: 540, name_ko: "UTC+09:00 표준시" };

    // Evaluate inside the sandbox setting the variable directly
    run(`var testTzFixed = ${JSON.stringify(tzFixed)};`);

    run(`currentLang = "ko";`);
    expect(run(`getZoneDisplayName(testTzFixed)`)).toBe("UTC+09:00 표준시");

    run(`currentLang = "en";`);
    expect(run(`getZoneDisplayName(testTzFixed)`)).toBe("UTC+09:00 Standard Time");
});

test("getZoneDisplayName falls back to stored name for custom and unknown types", () => {
    const { sandbox, run } = createMainContext();

    // Custom timezones have only one user-defined name and shouldn't change across languages
    const tzCustom = { type: "custom", zone: "", abbr: "MYTZ", name_ko: "내 커스텀", name_en: "My Custom" };

    run(`var testTzCustom = ${JSON.stringify(tzCustom)};`);

    run(`currentLang = "ko";`);
    expect(run(`getZoneDisplayName(testTzCustom)`)).toBe("내 커스텀");

    run(`currentLang = "en";`);
    expect(run(`getZoneDisplayName(testTzCustom)`)).toBe("내 커스텀"); // Always prefers name_ko/name as it's user-entered
});


test("formatSnapshotText respects copy order and enabled flags", () => {
    const { sandbox } = createMainContext();
    const snapshot = {
        timezone: "KST",
        region: "Seoul",
        offset: "UTC+09:00",
        dates: ["2026-03-07"],
        clocks: ["09:30:00"],
        dayNames: ["Sat"],
        dayNightIcons: ["DAY"],
        periodDays: "",
        periodTime: ""
    };

    const text = sandbox.formatSnapshotText(
        snapshot,
        ["timezone", "offset", "time", "region"],
        { timezone: true, offset: true, time: true, region: false },
        { dn: false, date: true, time: true, weekday: false }
    );

    expect(text).toBe("[KST] [UTC+09:00] 2026-03-07 09:30:00");
});

test("formatTimeTextByParts composes multi-slot text with separators", () => {
    const { sandbox } = createMainContext();
    const text = sandbox.formatTimeTextByParts(
        {
            dates: ["2026-03-07", "2026-03-07"],
            clocks: ["09:30:00", "21:30:00"],
            dayNames: ["Sat", "Sat"],
            dayNightIcons: ["DAY", "NIGHT"]
        },
        { dn: true, date: false, time: true, weekday: true }
    );

    expect(text).toBe("DAY 09:30:00 (Sat) ~ NIGHT 21:30:00 (Sat)");
});

test("getDisplayTimeInputMode follows date/time toggle state", () => {
    const { run, sandbox } = createMainContext();

    run(`displayTimePartsEnabled = { dn: false, date: true, time: true, weekday: false };`);
    expect(sandbox.getDisplayTimeInputMode()).toBe("datetime");

    run(`displayTimePartsEnabled = { dn: false, date: true, time: false, weekday: false };`);
    expect(sandbox.getDisplayTimeInputMode()).toBe("date");

    run(`displayTimePartsEnabled = { dn: false, date: false, time: false, weekday: false };`);
    expect(sandbox.getDisplayTimeInputMode()).toBe("none");
});

test("getDisplayColumns expands time columns and guards period columns by slot count", () => {
    const { run, sandbox } = createMainContext();
    run(`
        displayFormatOrder = ["timezone", "time", "period_days", "period_time", "region"];
        displayFormatEnabled = {
            timezone: true,
            region: true,
            offset: false,
            time: true,
            period_days: true,
            period_time: true
        };
    `);

    expect(sandbox.getDisplayColumns(1)).toEqual(["timezone", "time_main", "region"]);
    expect(sandbox.getDisplayColumns(2)).toEqual(["timezone", "time_main", "time_extra", "period_days", "period_time", "region"]);
});

test("formatRangeDurationText localizes output for ko/en and keeps sign", () => {
    const { sandbox, run } = createMainContext();
    const startMs = Date.UTC(2026, 2, 7, 0, 0, 0);
    const endMs = Date.UTC(2026, 2, 8, 1, 30, 0);

    run(`currentLang = "ko";`);
    expect(sandbox.formatRangeDurationText(startMs, endMs)).toBe("1\uC77C 1\uC2DC\uAC04 30\uBD84");
    expect(sandbox.formatRangeDurationText(endMs, startMs)).toBe("-1\uC77C 1\uC2DC\uAC04 30\uBD84");

    run(`currentLang = "en";`);
    expect(sandbox.formatRangeDurationText(startMs, endMs)).toBe("1d 1h 30m");
    expect(sandbox.formatRangeDurationText(endMs, startMs)).toBe("-1d 1h 30m");
});

test("buildTimezoneComputedSnapshotForRange returns two-slot snapshot for UTC", () => {
    const { sandbox, run } = createMainContext();
    run(`currentLang = "ko";`);
    const snapshot = sandbox.buildTimezoneComputedSnapshotForRange(
        { id: "utc", type: "standard", zone: "UTC", name: "UTC" },
        new Date(Date.UTC(2026, 2, 7, 0, 0, 0)),
        new Date(Date.UTC(2026, 2, 7, 12, 30, 0))
    );

    expect(snapshot).toMatchObject({
        timezone: "UTC",
        region: "utc_name",
        offset: "UTC+00:00",
        periodDays: "1unit_days_suffix",
        periodTime: "0\uC77C 12\uC2DC\uAC04 30\uBD84"
    });
    expect(snapshot.times).toEqual(["2026-03-07 00:00:00", "2026-03-07 12:30:00"]);
    expect(snapshot.dayNightIcons).toEqual(["NIGHT", "DAY"]);
});

test("buildRowActionCells uses clipboard icon entity for copy buttons", () => {
    const { sandbox } = createMainContext();
    const html = sandbox.buildRowActionCells("copy", "X", "remove");
    expect(html).toContain("&#128203;");
});

test("applySnapshotToRow renders day/night glyphs instead of raw labels", () => {
    const { sandbox } = createMainContext();
    const dn0 = { textContent: "", title: "" };
    const dn1 = { textContent: "", title: "" };

    const row = {
        querySelector() {
            return null;
        },
        querySelectorAll(selector) {
            if (selector === '.dn-slot-0') return [dn0];
            if (selector === '.dn-slot-1') return [dn1];
            return [];
        }
    };

    sandbox.applySnapshotToRow(row, {
        timezone: "UTC",
        region: "utc_name",
        offset: "UTC+00:00",
        times: ["2026-03-07 06:00:00", "2026-03-07 20:00:00"],
        dates: ["2026-03-07", "2026-03-07"],
        clocks: ["06:00:00", "20:00:00"],
        dayNames: ["Sat", "Sat"],
        dayIndexes: [6, 6],
        dayNightIcons: ["DAY", "NIGHT"],
        periodDays: "1unit_days_suffix",
        periodTime: "0d 14h 0m"
    });

    expect(dn0.textContent).toBe("\u2600\uFE0F");
    expect(dn1.textContent).toBe("🌙");
    expect(dn0.title).toBe("dn_day");
    expect(dn1.title).toBe("dn_night");
});

test("copyMultiRangeRow copies one row snapshot to clipboard", async () => {
    const { sandbox, run } = createMainContext();
    let copiedText = "";
    sandbox.navigator.clipboard.writeText = async (text) => {
        copiedText = text;
    };

    run(`
        groups = [{
            name: "G",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
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
        multiRangeCount = 1;
        multiRanges = [{ startUtcMs: Date.UTC(2026, 2, 7, 0, 0, 0), endUtcMs: Date.UTC(2026, 2, 7, 1, 0, 0) }];
        multiRangeCollapsed = [false];
        multiRangeStartEditEnabled = [true];
        multiRangeEndEditEnabled = [true];
        copyFormatOrder = ["timezone", "time"];
        copyFormatEnabled = { timezone: true, region: false, offset: false, time: true, period_days: false, period_time: false };
        copyTimePartsEnabled = { dn: false, date: true, time: true, weekday: false };
    `);

    await sandbox.copyMultiRangeRow(0, "utc");

    expect(copiedText).toContain("[UTC]");
});

test("copyAllMultiRangeTimezones copies all ranges and rows", async () => {
    const { sandbox, run } = createMainContext();
    let copiedText = "";
    sandbox.navigator.clipboard.writeText = async (text) => {
        copiedText = text;
    };
    sandbox.showToast = () => { };

    run(`
        groups = [{
            name: "G",
            zones: [{ id: "tz-1", type: "standard", zone: "Asia/Seoul", name_ko: "KR", name_en: "KR", fixedAbbr: "KST", fixedOffsetMinutes: 540 }],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
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
        multiRangeCount = 1;
        multiRanges = [{ startUtcMs: Date.UTC(2026, 2, 7, 0, 0, 0), endUtcMs: Date.UTC(2026, 2, 7, 1, 0, 0) }];
        multiRangeCollapsed = [false];
        multiRangeStartEditEnabled = [true];
        multiRangeEndEditEnabled = [true];
        copyFormatOrder = ["timezone"];
        copyFormatEnabled = { timezone: true, region: false, offset: false, time: false, period_days: false, period_time: false };
        copyTimePartsEnabled = { dn: false, date: true, time: true, weekday: false };
    `);

    await sandbox.copyAllMultiRangeTimezones();

    expect(copiedText).toContain("#1 -");
    expect(copiedText).toContain("[UTC]");
    expect(copiedText).toContain("[KST]");
});

test("updateCopyFormatPreview shows dash when copy format panel is hidden", () => {
    const { sandbox, run } = createMainContext();
    const preview = {
        textContent: "",
        classList: {
            isEmpty: false,
            toggle(_cls, value) {
                this.isEmpty = !!value;
            }
        }
    };
    sandbox.document.getElementById = (id) => (id === "copy-format-preview" ? preview : null);

    run(`showCopyFormat = false;`);
    sandbox.updateCopyFormatPreview();

    expect(preview.textContent).toBe("-");
    expect(preview.classList.isEmpty).toBe(true);
});

test("copyAllTimezones copies visible rows in non-multi mode", async () => {
    const { sandbox, run } = createMainContext();
    let copiedText = "";
    sandbox.navigator.clipboard.writeText = async (text) => {
        copiedText = text;
    };
    sandbox.document.querySelectorAll = (selector) => {
        if (selector === "#clocks-container .time-row") {
            return [{ id: "tz-row-utc" }];
        }
        return [];
    };

    run(`
        groups = [{
            name: "G",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
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
        copyFormatOrder = ["timezone"];
        copyFormatEnabled = { timezone: true, region: false, offset: false, time: false, period_days: false, period_time: false };
        copyTimePartsEnabled = { dn: false, date: true, time: true, weekday: false };
    `);

    await sandbox.copyAllTimezones();
    expect(copiedText).toContain("[UTC]");
});

test("sanitizeTimeAdjustDayStep clamps to configured bounds", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.sanitizeTimeAdjustDayStep("abc")).toBe(1);
    expect(sandbox.sanitizeTimeAdjustDayStep(0)).toBe(1);
    expect(sandbox.sanitizeTimeAdjustDayStep(999999)).toBe(36500);
});

test("setTimeAdjustDayStep updates slot state with normalization", () => {
    const { sandbox, run } = createMainContext();
    run(`timeAdjustDayStepBySlot = [1, 1];`);
    expect(sandbox.setTimeAdjustDayStep(1, 7)).toBe(7);
    expect(sandbox.getTimeAdjustDayStep(1)).toBe(7);
    expect(sandbox.setTimeAdjustDayStep(1, -3)).toBe(1);
    expect(sandbox.getTimeAdjustDayStep(1)).toBe(1);
});

test("getCopyFieldLabel maps keys to i18n label keys", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.getCopyFieldLabel("timezone")).toBe("copy_field_timezone");
    expect(sandbox.getCopyFieldLabel("period_time")).toBe("copy_field_period_time");
});

test("getTimePartLabel maps time part keys to i18n label keys", () => {
    const { sandbox } = createMainContext();
    expect(sandbox.getTimePartLabel("dn")).toBe("copy_time_part_dn");
    expect(sandbox.getTimePartLabel("weekday")).toBe("copy_time_part_weekday");
});

test("refreshOptionToggleDividers adds divider class except last visible group", () => {
    const { sandbox } = createMainContext();
    const makeGroup = (display) => ({
        style: { display },
        classList: {
            classes: new Set(),
            add(cls) { this.classes.add(cls); },
            remove(cls) { this.classes.delete(cls); },
            contains(cls) { return this.classes.has(cls); }
        }
    });
    const groups = [makeGroup("flex"), makeGroup("none"), makeGroup("flex")];
    const optionRow = {
        querySelectorAll() { return groups; }
    };
    sandbox.document.getElementById = (id) => (id === "control-option-row" ? optionRow : null);

    sandbox.refreshOptionToggleDividers();

    expect(groups[0].classList.contains("option-with-divider")).toBe(true);
    expect(groups[2].classList.contains("option-with-divider")).toBe(false);
});

test("switchMainTab updates realtime flag when moving from live to fixed", () => {
    const { sandbox, run } = createMainContext();
    const optionRow = {
        style: {},
        querySelectorAll() { return []; }
    };
    sandbox.document.getElementById = (id) => (id === "control-option-row" ? optionRow : null);
    sandbox.document.querySelectorAll = (selector) => {
        if (selector === ".nav-item") return [];
        if (selector === ".option-toggle-group") return [];
        return [];
    };

    run(`
        groups = [{
            name: "G",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
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
        currentMainTab = "live";
        isRealtime = true;
    `);

    sandbox.switchMainTab("fixed");

    expect(run("currentMainTab")).toBe("fixed");
    expect(run("isRealtime")).toBe(false);
});

test("shouldRenderTimeline follows tab and toggle state", () => {
    const { sandbox, run } = createMainContext();

    run(`showTimeline = true; currentMainTab = "live";`);
    expect(sandbox.shouldRenderTimeline()).toBe(true);

    run(`currentMainTab = "fixed";`);
    expect(sandbox.shouldRenderTimeline()).toBe(true);

    run(`currentMainTab = "multi";`);
    expect(sandbox.shouldRenderTimeline()).toBe(false);

    run(`currentMainTab = "calc";`);
    expect(sandbox.shouldRenderTimeline()).toBe(false);

    run(`showTimeline = false; currentMainTab = "live";`);
    expect(sandbox.shouldRenderTimeline()).toBe(false);
});

test("persistence snapshot includes showTimeline flag", () => {
    const { sandbox, run } = createMainContext();
    run(`showTimeline = true;`);
    const snapshot = sandbox.getPersistenceSnapshot();
    expect(snapshot.showTimeline).toBe(true);
});

test("setPersistenceState applies showTimeline updates", () => {
    const { run } = createMainContext();
    run(`setPersistenceState({ showTimeline: true });`);
    expect(run("showTimeline")).toBe(true);
    run(`setPersistenceState({ showTimeline: false });`);
    expect(run("showTimeline")).toBe(false);
});

test("loadPersistence accepts recent legacy fallback key payloads", () => {
    const { run } = createMainContext();
    const payload = {
        groups: [{
            name: "Legacy Recent",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0
        }],
        activeGroupId: 0,
        currentMainTab: "live",
        activeGroupIdByMainTab: { live: 0, fixed: 0 },
        slotCount: 1,
        showCopyFormat: false,
        showTimeline: false
    };
    run(`localStorage.setItem("GTV_v320_Data", ${JSON.stringify(JSON.stringify(payload))});`);
    run("loadPersistence();");
    expect(run("groups[0].name")).toBe("Legacy Recent");
});

test("loadPersistence ignores legacy keys older than fallback cutoff", () => {
    const { run } = createMainContext();
    const payload = {
        groups: [{
            name: "Legacy Too Old",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0
        }],
        activeGroupId: 0,
        currentMainTab: "live",
        activeGroupIdByMainTab: { live: 0, fixed: 0 },
        slotCount: 1,
        showCopyFormat: false,
        showTimeline: false
    };
    run(`localStorage.setItem("GTV_v310_Data", ${JSON.stringify(JSON.stringify(payload))});`);
    run("loadPersistence();");
    expect(run("groups[0].name")).toBe("default_group_name");
});

test("timezone image export prefers primary renderer when timeline is visible", async () => {
    const { sandbox } = createMainContext();
    let primaryCalls = 0;
    let fallbackCalls = 0;

    await sandbox.window.GTVImageExport.saveTimezoneTableImage({
        isMultiTab: () => false,
        detectForeignObjectRendererSupport: async () => false,
        isTimelineVisible: () => true,
        renderTimezoneTableToPngDataUrl: async () => {
            primaryCalls += 1;
            return "data:image/png;base64,AAA";
        },
        renderTimezoneTableFallbackDataUrl: async () => {
            fallbackCalls += 1;
            return "data:image/png;base64,BBB";
        },
        getTimezoneTableImageFilename: () => "timeline-test",
        showToast: () => { },
        t: (key) => key,
        isDomExceptionLike: () => false,
        setCanUseForeignObjectRenderer: () => { }
    });

    expect(primaryCalls).toBe(1);
    expect(fallbackCalls).toBe(0);
});
