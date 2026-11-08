import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "persistence-state-normalizer.js");

function loadNormalizer(deps = {}) {
    delete require.cache[require.resolve(MODULE_PATH)];
    require(MODULE_PATH);
    return globalThis.GTVPersistenceStateNormalizer.createService(deps);
}

afterEach(() => {
    delete require.cache[require.resolve(MODULE_PATH)];
    delete globalThis.GTVPersistenceStateNormalizer;
});

const zone = (id) => ({ id, name: id });

describe("GTV persistence state normalizer", () => {
    it("falls back to built-in sanitizers when no helpers are injected", () => {
        const n = loadNormalizer({ COPY_FORMAT_KEYS: [" iso ", "", 3, "rfc"] });
        expect(n.sanitizeCopyFormatOrder([" rfc ", 7, "iso"])).toEqual(["rfc", "iso"]);
        expect(n.sanitizeCopyFormatOrder("bad")).toEqual(["iso", "rfc"]);
        expect(n.sanitizeCopyFormatEnabled({ rfc: false })).toEqual({ iso: true, rfc: false });
        expect(n.sanitizeCopyFormatEnabled(null)).toEqual({ iso: true, rfc: true });
        expect(n.sanitizeTimePartsEnabled({ dn: true })).toEqual({ dn: true, date: true, time: true, weekday: false });
        expect(n.sanitizeTimePartsEnabled("x")).toEqual({ dn: false, date: true, time: true, weekday: false });
        expect(n.deriveTimePartsFromLegacyEnabled({})).toEqual({ dn: false, date: true, time: true, weekday: false });
        expect(n.sanitizeMultiStatePayload({})).toEqual({
            multiRangeCount: 1,
            multiRangeTitle: "",
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: []
        });
        expect(n.sanitizeMultiRangeTitle("Trip")).toBe("Trip");
        expect(n.sanitizeMultiRangeTitle(5)).toBe("");
        expect(n.sanitizeBaseTimezoneId("  Asia/Seoul ")).toBe("Asia/Seoul");
        expect(n.sanitizeBaseTimezoneId("   ")).toBe("utc");
        expect(n.sanitizeMainTab("calc")).toBe("calc");
        expect(n.sanitizeMainTab("settings")).toBe("live");
        expect(n.sanitizeTimeAdjustDayStep("7")).toBe(7);
        expect(n.sanitizeTimeAdjustDayStep("x")).toBe(1);
        expect(n.sanitizeFormatProfiles({}, {})).toBe(null);
    });

    it("sanitizes a group with the built-in rules", () => {
        const n = loadNormalizer();
        expect(n.sanitizeGroup(null, 0)).toBe(null);
        expect(n.sanitizeGroup({ name: "  ", zones: "x", utcRowOrder: "3", showUtcRow: false, fixedTimeShowLiveNow: 1 }, 1)).toEqual({
            name: "Group 2",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: false,
            utcRowOrder: 3,
            fixedDate: "",
            fixedTimeShowLiveNow: true,
            fixedTimes: []
        });
        expect(n.sanitizeGroup({ name: "Work", zones: [zone("Asia/Seoul")], fixedDate: "2026-11-08", fixedTimes: [{ id: 1 }] }, 0)).toMatchObject({
            name: "Work",
            utcRowOrder: 0,
            showUtcRow: true,
            fixedDate: "2026-11-08",
            fixedTimes: [{ id: 1 }]
        });
    });

    it("clamps indexes and day/night hours", () => {
        const n = loadNormalizer({ DEFAULT_DAY_START_HOUR: "30", DEFAULT_NIGHT_START_HOUR: "x" });
        expect(n.clampGroupIndex("5", 3)).toBe(2);
        expect(n.clampGroupIndex(-2, 3)).toBe(0);
        expect(n.clampGroupIndex("x", 3)).toBe(0);
        expect(n.clampGroupIndex(4, 0)).toBe(0);
        expect(n.getDefaultDayStartHour()).toBe(23);
        expect(n.getDefaultNightStartHour()).toBe(18);
        expect(n.sanitizeDayNightHour("x", "x")).toBe(0);
        expect(n.sanitizeDayNightHour("-4", 5)).toBe(0);
        expect(n.sanitizeDayNightHour(undefined, 9)).toBe(9);

        const d = loadNormalizer();
        expect(d.getDefaultDayStartHour()).toBe(6);
        expect(d.normalizeDayNightRange(8, 20)).toEqual({ dayStartHour: 8, nightStartHour: 20 });
        expect(d.normalizeDayNightRange(20, 8)).toEqual({ dayStartHour: 6, nightStartHour: 18 });
        expect(d.normalizeDayNightRange(undefined, undefined)).toEqual({ dayStartHour: 6, nightStartHour: 18 });
    });

    it("prefers injected helpers and ignores invalid helper results", () => {
        const n = loadNormalizer({
            COPY_FORMAT_KEYS: ["iso"],
            sanitizeCopyFormatOrder: (v) => (v === "use-helper" ? ["helper"] : null),
            sanitizeCopyFormatEnabled: (v, mode) => (v === "use-helper" ? { mode } : 0),
            sanitizeTimePartsEnabled: (v, mode) => (v === "use-helper" ? { mode } : null),
            deriveTimePartsFromLegacyEnabled: (v, mode) => (v === "use-helper" ? { derived: mode } : null),
            sanitizeMultiStatePayload: (raw) => (raw?.ok ? { multiRangeCount: 3 } : null),
            sanitizeMultiRangeTitle: (v) => (v === "use-helper" ? "Helper" : 1),
            sanitizeBaseTimezoneId: (v) => (v === "use-helper" ? "Europe/Paris" : " "),
            sanitizeMainTab: (v) => (v === "use-helper" ? "multi" : "nope"),
            sanitizeTimeAdjustDayStep: (v) => (v === "use-helper" ? "30" : "x"),
            sanitizeFormatProfiles: (profiles) => (profiles === "use-helper" ? { live: {} } : "bad"),
            sanitizeGroup: (group, idx) => ({ helperGroup: idx, group })
        });
        expect(n.sanitizeCopyFormatOrder("use-helper")).toEqual(["helper"]);
        expect(n.sanitizeCopyFormatOrder(["a"])).toEqual(["a"]);
        expect(n.sanitizeCopyFormatEnabled("use-helper", "copy")).toEqual({ mode: "copy" });
        expect(n.sanitizeCopyFormatEnabled(null)).toEqual({ iso: true });
        expect(n.sanitizeTimePartsEnabled("use-helper")).toEqual({ mode: "display" });
        expect(n.sanitizeTimePartsEnabled(null).date).toBe(true);
        expect(n.deriveTimePartsFromLegacyEnabled("use-helper", "copy")).toEqual({ derived: "copy" });
        expect(n.deriveTimePartsFromLegacyEnabled("other").time).toBe(true);
        expect(n.sanitizeMultiStatePayload({ ok: true })).toEqual({ multiRangeCount: 3 });
        expect(n.sanitizeMultiStatePayload({}).multiRangeCount).toBe(1);
        expect(n.sanitizeMultiRangeTitle("use-helper")).toBe("Helper");
        expect(n.sanitizeMultiRangeTitle("plain")).toBe("plain");
        expect(n.sanitizeBaseTimezoneId("use-helper")).toBe("Europe/Paris");
        expect(n.sanitizeBaseTimezoneId("Asia/Tokyo")).toBe("Asia/Tokyo");
        expect(n.sanitizeMainTab("use-helper")).toBe("multi");
        expect(n.sanitizeMainTab("fixed")).toBe("fixed");
        expect(n.sanitizeTimeAdjustDayStep("use-helper")).toBe(30);
        expect(n.sanitizeTimeAdjustDayStep(2)).toBe(2);
        expect(n.sanitizeFormatProfiles("use-helper")).toEqual({ live: {} });
        expect(n.sanitizeFormatProfiles("other")).toBe(null);
        expect(n.sanitizeGroup({ a: 1 }, 4)).toEqual({ helperGroup: 4, group: { a: 1 } });
    });

    it("builds default groups with injected defaults and translation", () => {
        const touched = [];
        const n = loadNormalizer({
            t: (key) => `t:${key}`,
            getDefaultFixedDate: () => "2026-01-02",
            getDefaultFixedTimes: () => [{ id: "slot" }],
            ensureGroupMultiSubgroupsSafe: (group) => touched.push(group.name)
        });
        expect(n.getDefaultGroups()).toEqual([{
            name: "t:default_group_name",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedDate: "2026-01-02",
            fixedTimeShowLiveNow: false,
            fixedTimes: [{ id: "slot" }]
        }]);
        expect(touched).toEqual(["t:default_group_name"]);
    });

    it("normalizes a legacy saved state: global base timezone, tab maps and copy formats", () => {
        const n = loadNormalizer({ COPY_FORMAT_KEYS: ["iso", "rfc"], MIN_MULTI_RANGE_COUNT: "2" });
        const state = n.normalizeParsedPersistenceState({
            groups: [
                { name: "A", zones: [zone("Asia/Seoul")] },
                { name: "B", zones: [zone("Europe/Paris")] },
                { name: "C", zones: [zone("Asia/Seoul")], baseTimezoneId: "Europe/Paris" },
                null
            ],
            baseTimezoneId: "Asia/Seoul",
            activeGroupId: 9,
            currentMainTab: "fixed",
            activeGroupIdByMainTab: { live: "1", fixed: "x" },
            slotCount: "5",
            showCopyFormat: 1,
            timeAdjustDayStepBySlot: ["3"],
            dayStartHour: 7,
            nightStartHour: 19,
            copyFormatOrder: ["rfc"],
            copyFormatEnabled: { rfc: false }
        });
        expect(state.groups.map((g) => [g.name, g.baseTimezoneId])).toEqual([
            ["A", "Asia/Seoul"],
            ["B", "utc"],
            ["C", "Europe/Paris"]
        ]);
        expect(state.activeGroupIdByMainTab).toEqual({ live: 1, fixed: 2 });
        expect(state.activeGroupId).toBe(2);
        expect(state.currentMainTab).toBe("fixed");
        expect(state.isRealtime).toBe(false);
        expect(state.slotCount).toBe(2);
        expect(state.showCopyFormat).toBe(true);
        expect(state.showTimeline).toBe(false);
        expect(state.timeAdjustDayStepBySlot).toEqual([3, 1]);
        expect([state.dayStartHour, state.nightStartHour]).toEqual([7, 19]);
        expect(state.displayFormatOrder).toEqual(["rfc"]);
        expect(state.displayFormatEnabled).toEqual({ iso: true, rfc: false });
        expect(state.copyFormatEnabled).toEqual({ iso: true, rfc: false });
        expect(state.displayTimePartsEnabled).toEqual({ dn: false, date: true, time: true, weekday: false });
        expect(state.multiRangeCount).toBe(2);
        expect(state).not.toHaveProperty("formatProfiles");
        expect(state).not.toHaveProperty("activeFormatProfileContext");
    });

    it("keeps explicit display settings, profiles and context; empty input gives defaults", () => {
        const n = loadNormalizer({
            COPY_FORMAT_KEYS: ["iso"],
            sanitizeFormatProfiles: (profiles, legacy) => ({ profiles, legacyOrder: legacy.displayFormatOrder })
        });
        const state = n.normalizeParsedPersistenceState({
            groups: [{ name: "Only", zones: [] }],
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0 },
            showTimeline: true,
            displayFormatOrder: ["iso"],
            displayFormatEnabled: { iso: false },
            displayTimePartsEnabled: { weekday: true },
            copyTimePartsEnabled: { dn: true },
            formatProfiles: { saved: true },
            activeFormatProfileContext: "fixed-time"
        });
        expect(state.isRealtime).toBe(true);
        expect(state.showTimeline).toBe(true);
        expect(state.displayFormatEnabled).toEqual({ iso: false });
        expect(state.displayTimePartsEnabled.weekday).toBe(true);
        expect(state.copyTimePartsEnabled.dn).toBe(true);
        expect(state.formatProfiles).toEqual({ profiles: { saved: true }, legacyOrder: ["iso"] });
        expect(state.activeFormatProfileContext).toBe("fixed-time");

        const empty = n.normalizeParsedPersistenceState(null);
        expect(empty.groups).toHaveLength(1);
        expect(empty.currentMainTab).toBe("live");
        expect(empty.activeGroupIdByMainTab).toEqual({ live: 0, fixed: 0 });
        expect(empty.slotCount).toBe(1);
    });

    it("builds an import snapshot with the active group's base timezone", () => {
        const n = loadNormalizer({
            sanitizeFormatProfiles: () => ({ live: {} })
        });
        const snapshot = n.normalizeImportedPayload({
            groups: [{ name: "X", zones: [], baseTimezoneId: "America/New_York" }],
            activeFormatProfileContext: "live"
        });
        expect(snapshot.baseTimezoneId).toBe("America/New_York");
        expect(snapshot.activeGroupId).toBe(0);
        expect(snapshot.formatProfiles).toEqual({ live: {} });
        expect(snapshot.activeFormatProfileContext).toBe("live");
        expect(snapshot.multiRanges).toEqual([]);

        const fallback = loadNormalizer().normalizeImportedPayload("not an object");
        expect(fallback.baseTimezoneId).toBe("utc");
        expect(fallback.groups).toHaveLength(1);
        expect(fallback).not.toHaveProperty("formatProfiles");
    });
});
