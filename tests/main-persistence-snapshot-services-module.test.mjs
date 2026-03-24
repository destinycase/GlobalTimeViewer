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
            multiRangeEndEditEnabled: [0]
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
            now: () => 123
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
});
