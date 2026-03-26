import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-persistence-snapshot-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainPersistenceSnapshotServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainPersistenceSnapshotServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainPersistenceSnapshotServices || globalThis.GTVMainPersistenceSnapshotServices;
}

describe("GTV main persistence snapshot services module", () => {
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
    it("builds normalized persistence snapshot and updates derived state", () => {
        const moduleApi = loadMainPersistenceSnapshotServicesModule();
        const state = {
            groups: [{ id: 0 }],
            activeGroupId: 2,
            currentMainTab: "invalid-tab",
            activeGroupIdByMainTab: { live: 0, fixed: 1 },
            slotCount: 2,
            showCopyFormat: true,
            showTimeline: true,
            displayFormatOrder: ["timezone"],
            displayFormatEnabled: { timezone: true },
            displayTimePartsEnabled: { time: true },
            copyFormatOrder: ["offset"],
            copyFormatEnabled: { offset: true },
            copyTimePartsEnabled: { date: true },
            formatProfiles: { legacy: true },
            activeFormatProfileContext: "live",
            multiRangeCount: 2,
            multiRanges: [{ startUtcMs: NaN, endUtcMs: 200 }],
            multiRangeCollapsed: [0],
            multiRangeStartEditEnabled: [1],
            multiRangeEndEditEnabled: [0],
            dayStartHour: 7,
            nightStartHour: 20
        };
        let fixedTimesEnsureCount = 0;
        let subgroupEnsureCount = 0;
        const service = moduleApi.createService({
            getState: () => state,
            setState: (next) => Object.assign(state, next),
            sanitizeMainTab: () => "live",
            syncActiveFormatProfileFromState: () => { },
            syncCurrentMultiStateToActiveSubgroup: () => { },
            normalizeGroupTabState: () => { },
            ensureMultiRangeState: () => { },
            getGroups: () => state.groups,
            ensureGroupFixedTimes: () => { fixedTimesEnsureCount += 1; },
            ensureGroupMultiSubgroups: () => { subgroupEnsureCount += 1; },
            sanitizeFormatProfiles: () => ({ live: { ok: true } }),
            getCurrentFormatProfileState: () => ({ profile: "live" }),
            getCurrentGroupBaseTimezoneId: () => "tz-base",
            sanitizeCopyFormatOrder: (order) => order,
            sanitizeCopyFormatEnabled: (enabled) => enabled,
            sanitizeTimePartsEnabled: (parts) => parts,
            getTimeAdjustDayStep: (idx) => idx + 1,
            sanitizeMultiRangeCount: (value) => value,
            sanitizeMultiRangeTitle: (value) => `title:${value}`,
            getCurrentMultiSubgroupName: () => "Subgroup 1",
            sanitizeUtcMs: (value, fallbackMs) => (Number.isFinite(value) ? value : fallbackMs),
            now: () => 123,
            DEFAULT_DAY_START_HOUR: 6,
            DEFAULT_NIGHT_START_HOUR: 18,
            sanitizeDayNightHour: (value, fallbackHour) => {
                const parsed = Number.parseInt(value, 10);
                return Number.isFinite(parsed) ? parsed : fallbackHour;
            }
        });

        const snapshot = service.getPersistenceSnapshot();

        expect(state.currentMainTab).toBe("live");
        expect(state.activeGroupIdByMainTab.live).toBe(2);
        expect(state.formatProfiles).toEqual({ live: { ok: true } });
        expect(snapshot.baseTimezoneId).toBe("tz-base");
        expect(snapshot.timeAdjustDayStepBySlot).toEqual([1, 2]);
        expect(snapshot.multiRangeTitle).toBe("title:Subgroup 1");
        expect(snapshot.multiRanges[0]).toEqual({ startUtcMs: 123, endUtcMs: 200 });
        expect(snapshot.multiRangeCollapsed).toEqual([false]);
        expect(snapshot.multiRangeStartEditEnabled).toEqual([true]);
        expect(snapshot.multiRangeEndEditEnabled).toEqual([false]);
        expect(snapshot.dayStartHour).toBe(7);
        expect(snapshot.nightStartHour).toBe(20);
        expect(fixedTimesEnsureCount).toBe(1);
        expect(subgroupEnsureCount).toBe(1);
    });

    it("does not override tab mapping for non live/fixed tabs", () => {
        const moduleApi = loadMainPersistenceSnapshotServicesModule();
        const state = {
            groups: [],
            activeGroupId: 1,
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: false,
            showTimeline: false,
            displayFormatOrder: [],
            displayFormatEnabled: {},
            displayTimePartsEnabled: {},
            copyFormatOrder: [],
            copyFormatEnabled: {},
            copyTimePartsEnabled: {},
            formatProfiles: {},
            activeFormatProfileContext: "live",
            multiRangeCount: 1,
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: []
        };
        const service = moduleApi.createService({
            getState: () => state,
            setState: (next) => Object.assign(state, next),
            sanitizeMainTab: (tab) => tab,
            syncActiveFormatProfileFromState: () => { },
            syncCurrentMultiStateToActiveSubgroup: () => { },
            normalizeGroupTabState: () => { },
            ensureMultiRangeState: () => { },
            getGroups: () => [],
            ensureGroupFixedTimes: () => { },
            ensureGroupMultiSubgroups: () => { },
            sanitizeFormatProfiles: (profiles) => profiles,
            getCurrentFormatProfileState: () => ({}),
            getCurrentGroupBaseTimezoneId: () => "utc",
            sanitizeCopyFormatOrder: (order) => order,
            sanitizeCopyFormatEnabled: (enabled) => enabled,
            sanitizeTimePartsEnabled: (parts) => parts,
            getTimeAdjustDayStep: () => 1,
            sanitizeMultiRangeCount: (value) => value,
            sanitizeMultiRangeTitle: (value) => value,
            getCurrentMultiSubgroupName: () => "",
            sanitizeUtcMs: (value) => value,
            now: () => 0
        });

        service.getPersistenceSnapshot();

        expect(state.activeGroupIdByMainTab).toEqual({ live: 0, fixed: 0 });
    });

    it("falls back safely when dependencies are missing", () => {
        const moduleApi = loadMainPersistenceSnapshotServicesModule();
        const service = moduleApi.createService(null);

        const snapshot = service.getPersistenceSnapshot();

        expect(snapshot.groups).toEqual([]);
        expect(snapshot.baseTimezoneId).toBe("utc");
        expect(snapshot.displayFormatOrder).toEqual([]);
        expect(snapshot.copyFormatOrder).toEqual([]);
        expect(snapshot.displayFormatEnabled).toEqual({});
        expect(snapshot.copyFormatEnabled).toEqual({});
        expect(snapshot.displayTimePartsEnabled).toEqual({});
        expect(snapshot.copyTimePartsEnabled).toEqual({});
        expect(snapshot.timeAdjustDayStepBySlot).toEqual([1, 1]);
        expect(snapshot.multiRangeCount).toBe(1);
        expect(snapshot.multiRangeTitle).toBe("subgroup");
        expect(snapshot.multiRanges).toEqual([]);
        expect(snapshot.multiRangeCollapsed).toEqual([]);
        expect(snapshot.multiRangeStartEditEnabled).toEqual([]);
        expect(snapshot.multiRangeEndEditEnabled).toEqual([]);
        expect(snapshot.dayStartHour).toBe(6);
        expect(snapshot.nightStartHour).toBe(18);
    });

    it("normalizes invalid state shapes through default sanitizers", () => {
        const moduleApi = loadMainPersistenceSnapshotServicesModule();
        const state = {
            groups: [{ id: "g-1" }],
            activeGroupId: 7,
            currentMainTab: "fixed",
            activeGroupIdByMainTab: "bad-shape",
            slotCount: 2,
            showCopyFormat: 1,
            showTimeline: 0,
            displayFormatOrder: "bad-order",
            displayFormatEnabled: null,
            displayTimePartsEnabled: null,
            copyFormatOrder: null,
            copyFormatEnabled: null,
            copyTimePartsEnabled: null,
            formatProfiles: null,
            activeFormatProfileContext: "fixed",
            multiRangeCount: "2.9",
            multiRanges: [
                { startUtcMs: Number.NaN, endUtcMs: 200 },
                { startUtcMs: 100, endUtcMs: Number.NaN }
            ],
            multiRangeCollapsed: [0, 1],
            multiRangeStartEditEnabled: [0, 1],
            multiRangeEndEditEnabled: [1, 0],
            dayStartHour: 22,
            nightStartHour: 5
        };
        const service = moduleApi.createService({
            getState: () => state,
            setState: (next) => Object.assign(state, next),
            getGroups: () => "not-array",
            now: () => 777
        });

        const snapshot = service.getPersistenceSnapshot();

        expect(state.activeGroupIdByMainTab).toEqual({ fixed: 7 });
        expect(state.formatProfiles).toEqual({});
        expect(snapshot.groups).toEqual([]);
        expect(snapshot.showCopyFormat).toBe(true);
        expect(snapshot.showTimeline).toBe(false);
        expect(snapshot.displayFormatOrder).toEqual([]);
        expect(snapshot.displayFormatEnabled).toEqual({});
        expect(snapshot.displayTimePartsEnabled).toEqual({});
        expect(snapshot.copyFormatOrder).toEqual([]);
        expect(snapshot.copyFormatEnabled).toEqual({});
        expect(snapshot.copyTimePartsEnabled).toEqual({});
        expect(snapshot.multiRangeCount).toBe(2);
        expect(snapshot.multiRanges).toEqual([
            { startUtcMs: 777, endUtcMs: 200 },
            { startUtcMs: 100, endUtcMs: 777 }
        ]);
        expect(snapshot.multiRangeCollapsed).toEqual([false, true]);
        expect(snapshot.multiRangeStartEditEnabled).toEqual([false, true]);
        expect(snapshot.multiRangeEndEditEnabled).toEqual([true, false]);
        expect(snapshot.dayStartHour).toBe(6);
        expect(snapshot.nightStartHour).toBe(18);
    });
});
