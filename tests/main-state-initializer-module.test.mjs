import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-initializer.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateInitializerModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainStateInitializer", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateInitializer || globalThis.GTVMainStateInitializer;
}

describe("GTV main state initializer module", () => {
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

    it("derives fallback state from defaults and translator", () => {
        const moduleApi = loadMainStateInitializerModule();
        const service = moduleApi.createService();
        const state = service.deriveInitialState({
            initialMainState: {},
            copyFormatKeys: ["time", "date"],
            defaults: {
                defaultDisplayFormatEnabled: { time: true },
                defaultCopyFormatEnabled: { date: true },
                defaultDisplayTimePartsEnabled: { ampm: true },
                defaultCopyTimePartsEnabled: { ampm: false },
                defaultTimeAdjustDayStep: 2,
                defaultDayStartHour: 7,
                defaultNightStartHour: 19,
                defaultMultiRangeTitle: "Range"
            },
            normalizeDayNightRangeValues: (day, night) => ({
                dayStartHour: Number.isFinite(Number(day)) ? Number(day) : 7,
                nightStartHour: Number.isFinite(Number(night)) ? Number(night) : 19
            }),
            t: () => "Translated Range"
        });

        expect(state.displayFormatOrder).toEqual(["time", "date"]);
        expect(state.copyFormatOrder).toEqual(["time", "date"]);
        expect(state.timeAdjustDayStepBySlot).toEqual([2, 2]);
        expect(state.multiRangeTitle).toBe("Translated Range");
        expect(state.dayStartHour).toBe(7);
        expect(state.nightStartHour).toBe(19);
        expect(state.activeGroupIdByMainTab).toEqual({ live: 0, fixed: 0 });
    });

    it("keeps provided initial values and clones mutable containers", () => {
        const moduleApi = loadMainStateInitializerModule();
        const service = moduleApi.createService();
        const initial = {
            isRealtime: false,
            globalTimes: [new Date("2026-01-01T00:00:00Z")],
            slotCount: 3,
            uiScale: 1.25,
            displayFormatOrder: ["date"],
            displayFormatEnabled: { date: false },
            copyFormatOrder: ["time"],
            copyFormatEnabled: { time: true },
            displayTimePartsEnabled: { ampm: false },
            copyTimePartsEnabled: { ampm: true },
            formatProfiles: { live: {} },
            activeFormatProfileContext: "fixed",
            timeAdjustDayStepBySlot: [9, 10],
            multiRangeCount: 4,
            multiRangeTitle: "Custom",
            multiRanges: [1],
            multiRangeCollapsed: [true],
            multiRangeStartEditEnabled: [false],
            multiRangeEndEditEnabled: [true],
            currentMainTab: "fixed",
            activeGroupIdByMainTab: { fixed: 2 },
            currentTheme: "light",
            dayStartHour: 8,
            nightStartHour: 20,
            canUseForeignObjectRenderer: true,
            fixedTimeIdSeed: 99,
            groups: [{ id: 1 }],
            activeGroupId: 2
        };

        const state = service.deriveInitialState({
            initialMainState: initial,
            copyFormatKeys: ["time"],
            defaults: {}
        });

        expect(state.isRealtime).toBe(false);
        expect(state.slotCount).toBe(3);
        expect(state.uiScale).toBe(1.25);
        expect(state.currentMainTab).toBe("fixed");
        expect(state.currentTheme).toBe("light");
        expect(state.dayStartHour).toBe(8);
        expect(state.nightStartHour).toBe(20);
        expect(state.fixedTimeIdSeed).toBe(99);
        expect(state.activeGroupId).toBe(2);
        expect(state.displayFormatOrder).toEqual(["date"]);
        expect(state.copyFormatOrder).toEqual(["time"]);
        expect(state.multiRanges).toEqual([1]);
        expect(state.groups).toEqual([{ id: 1 }]);
        expect(state.displayFormatOrder).not.toBe(initial.displayFormatOrder);
        expect(state.groups).not.toBe(initial.groups);
    });
});
