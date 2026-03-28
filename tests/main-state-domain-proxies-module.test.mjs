import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainProxiesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainStateDomainProxies", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainProxies || globalThis.GTVMainStateDomainProxies;
}

describe("GTV main state domain proxies module", () => {
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

    it("delegates fixed-time helpers and tab predicates", () => {
        const moduleApi = loadMainStateDomainProxiesModule();
        const fixedTimeSlotUtilsService = {
            getDefaultFixedTimeName: vi.fn(() => "Slot"),
            getDefaultFixedDate: vi.fn(() => "2026-03-28"),
            getDefaultFixedTimes: vi.fn(() => []),
            sanitizeFixedTimeSlotCount: vi.fn((value) => Number(value)),
            createDefaultFixedTimeSlot: vi.fn((id) => ({ id })),
            sanitizeFixedTimeId: vi.fn((value) => String(value || "")),
            sanitizeFixedTimeName: vi.fn((value, fallback) => value || fallback),
            sanitizeFixedTimeValue: vi.fn((value, fallback) => value || fallback),
            sanitizeFixedDateValue: vi.fn((value, fallback) => value || fallback),
            sanitizeFixedTimeShowLiveNow: vi.fn((value) => !!value),
            getFixedDatePartsFromGroup: vi.fn(() => ({})),
            sanitizeFixedTimes: vi.fn((v) => v || []),
            ensureGroupFixedTimes: vi.fn((group) => group),
            createUniqueFixedTimeId: vi.fn(() => "ft-1")
        };
        const service = moduleApi.createService({
            fixedTimeSlotUtilsService,
            multiRangeStateService: {},
            fixedTimeStateService: {},
            uiPreferencesStateService: {},
            groupContextStateService: {},
            mainAppStateBridgeService: {},
            getPatchedMainTabState: () => "fixed-time",
            getCurrentGroup: () => ({ id: "g1" }),
            defaultFixedTimeValue: "09:00"
        });

        expect(service.isFixedTimeTab()).toBe(true);
        expect(service.isMultiTab()).toBe(false);
        expect(service.sanitizeFixedTimeName("", "Fallback")).toBe("Fallback");
        expect(service.sanitizeFixedTimeValue("", "11:00")).toBe("11:00");
        expect(service.createUniqueFixedTimeId()).toBe("ft-1");
    });

    it("delegates multi-range and fixed-time state actions", () => {
        const moduleApi = loadMainStateDomainProxiesModule();
        const multiRangeStateService = {
            sanitizeMultiRangeCount: vi.fn((value) => Number(value)),
            sanitizeMultiRangeTitle: vi.fn((value) => String(value || "")),
            getDefaultMultiRangeBounds: vi.fn(() => ({ startMs: 0, endMs: 1 })),
            sanitizeMultiRangeItem: vi.fn((raw) => raw),
            isMultiRangeStartEditEnabled: vi.fn(() => true),
            isMultiRangeEndEditEnabled: vi.fn(() => false),
            isMultiRangeStartLinked: vi.fn(() => true),
            ensureMultiRangeState: vi.fn(() => []),
            setMultiRangeStartEditEnabled: vi.fn(() => true),
            setMultiRangeEndEditEnabled: vi.fn(() => true),
            setAllMultiRangeStartEditEnabled: vi.fn(() => true),
            setAllMultiRangeEndEditEnabled: vi.fn(() => true),
            refreshMultiRangeControls: vi.fn(() => {}),
            syncMultiRangeStartLinks: vi.fn(() => {}),
            syncFollowingRangesByDuration: vi.fn(() => {}),
            syncLinkedRangesFrom: vi.fn(() => {}),
            setMultiRangeCount: vi.fn(() => {}),
            toggleMultiRangeCollapsed: vi.fn(() => {}),
            setMultiRangesCollapsedBelow: vi.fn(() => {}),
            getMultiRangeSlotDate: vi.fn(() => null),
            setMultiRangeSlotDate: vi.fn(() => {})
        };
        const fixedTimeStateService = {
            getFixedTimeSlotCount: vi.fn(() => 1),
            setCurrentGroupFixedDate: vi.fn(() => {}),
            setCurrentGroupFixedTimeShowLiveNow: vi.fn(() => {}),
            refreshFixedTimeSlotCountControls: vi.fn(() => {}),
            setFixedTimeSlotCount: vi.fn(() => {})
        };
        const service = moduleApi.createService({
            fixedTimeSlotUtilsService: {
                getDefaultFixedTimeName: () => "Slot",
                getDefaultFixedDate: () => "2026-03-28",
                getDefaultFixedTimes: () => [],
                sanitizeFixedTimeSlotCount: (value) => value,
                createDefaultFixedTimeSlot: () => ({}),
                sanitizeFixedTimeId: (value) => value,
                sanitizeFixedTimeName: (value) => value,
                sanitizeFixedTimeValue: (value) => value,
                sanitizeFixedDateValue: (value) => value,
                sanitizeFixedTimeShowLiveNow: (value) => value,
                getFixedDatePartsFromGroup: () => ({}),
                sanitizeFixedTimes: (value) => value,
                ensureGroupFixedTimes: (value) => value,
                createUniqueFixedTimeId: () => "ft-1"
            },
            multiRangeStateService,
            fixedTimeStateService,
            uiPreferencesStateService: {},
            groupContextStateService: {},
            mainAppStateBridgeService: {},
            getPatchedMainTabState: () => "multi",
            getCurrentGroup: () => ({ id: "g1" })
        });

        service.setMultiRangeCount(3);
        service.setCurrentGroupFixedDate("2026-03-28");

        expect(multiRangeStateService.setMultiRangeCount).toHaveBeenCalledWith(3, {});
        expect(fixedTimeStateService.setCurrentGroupFixedDate).toHaveBeenCalledWith("2026-03-28", {});
        expect(service.isMultiTab()).toBe(true);
    });

    it("delegates ui/group/persistence accessors", async () => {
        const moduleApi = loadMainStateDomainProxiesModule();
        const uiPreferencesStateService = {
            sanitizeUiScalePercent: vi.fn(() => 100),
            applyUiScale: vi.fn(async () => true),
            loadUiScalePreference: vi.fn(async () => 100),
            populateUiScaleSelect: vi.fn(() => {}),
            populateDayNightHourSelect: vi.fn(() => {}),
            setDayNightRange: vi.fn(() => {}),
            sanitizeTheme: vi.fn(() => "dark"),
            applyTheme: vi.fn(async () => true),
            loadThemePreference: vi.fn(async () => "dark"),
            setCurrentLang: vi.fn(() => {})
        };
        const groupContextStateService = {
            sanitizeMainTab: vi.fn(() => "live"),
            clampGroupIndex: vi.fn(() => 0),
            normalizeGroupTabState: vi.fn(() => ({}))
        };
        const mainAppStateBridgeService = {
            getPersistenceState: vi.fn(() => ({ groups: [] })),
            setPersistenceState: vi.fn(() => {})
        };
        const service = moduleApi.createService({
            fixedTimeSlotUtilsService: {
                getDefaultFixedTimeName: () => "Slot",
                getDefaultFixedDate: () => "2026-03-28",
                getDefaultFixedTimes: () => [],
                sanitizeFixedTimeSlotCount: (value) => value,
                createDefaultFixedTimeSlot: () => ({}),
                sanitizeFixedTimeId: (value) => value,
                sanitizeFixedTimeName: (value) => value,
                sanitizeFixedTimeValue: (value) => value,
                sanitizeFixedDateValue: (value) => value,
                sanitizeFixedTimeShowLiveNow: (value) => value,
                getFixedDatePartsFromGroup: () => ({}),
                sanitizeFixedTimes: (value) => value,
                ensureGroupFixedTimes: (value) => value,
                createUniqueFixedTimeId: () => "ft-1"
            },
            multiRangeStateService: {},
            fixedTimeStateService: {},
            uiPreferencesStateService,
            groupContextStateService,
            mainAppStateBridgeService,
            getCurrentGroup: () => null
        });

        await service.applyUiScale(95);
        await service.applyTheme("light");
        service.setPersistenceState({ currentTheme: "light" });

        expect(uiPreferencesStateService.applyUiScale).toHaveBeenCalledWith(95, true);
        expect(uiPreferencesStateService.applyTheme).toHaveBeenCalledWith("light", true);
        expect(mainAppStateBridgeService.setPersistenceState).toHaveBeenCalledWith({ currentTheme: "light" });
        expect(service.getPersistenceState()).toEqual({ groups: [] });
    });
});
