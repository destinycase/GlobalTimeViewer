import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-vars.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainAppStateVarsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainAppStateVars", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainAppStateVars || globalThis.GTVMainAppStateVars;
}

describe("GTV main app state vars module", () => {
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
    it("creates initial state from injected defaults", () => {
        const moduleApi = loadMainAppStateVarsModule();
        const service = moduleApi.createService({
            t: () => "RangeTitle",
            copyFormatKeys: ["date", "time"],
            defaultDisplayFormatEnabled: { date: true },
            defaultCopyFormatEnabled: { time: true },
            defaultDisplayTimePartsEnabled: { sec: false },
            defaultCopyTimePartsEnabled: { sec: true },
            defaultTimeAdjustDayStep: 3
        });

        expect(service.initialState.isRealtime).toBe(true);
        expect(service.initialState.displayFormatOrder).toEqual(["date", "time"]);
        expect(service.initialState.copyFormatEnabled).toEqual({ time: true });
        expect(service.initialState.timeAdjustDayStepBySlot).toEqual([3, 3]);
        expect(service.initialState.multiRangeTitle).toBe("RangeTitle");
    });

    it("creates direct state setters with coercion and safe no-op behavior", () => {
        const moduleApi = loadMainAppStateVarsModule();
        const service = moduleApi.createService();
        const state = {
            showTimeline: false,
            currentLang: "en"
        };
        const setters = service.createDirectStateSetters({
            showTimeline: (value) => { state.showTimeline = value; },
            currentLang: (value) => { state.currentLang = value; }
        });

        setters.showTimeline("truthy");
        setters.currentLang("ko");
        setters.groups([{ id: 1 }]);

        expect(state.showTimeline).toBe(true);
        expect(state.currentLang).toBe("ko");
    });

    it("invokes all direct setter handlers when provided", () => {
        const moduleApi = loadMainAppStateVarsModule();
        const service = moduleApi.createService();
        const calls = [];
        const handledKeys = [
            "groups",
            "activeGroupId",
            "currentMainTab",
            "activeGroupIdByMainTab",
            "slotCount",
            "showCopyFormat",
            "showTimeline",
            "displayFormatOrder",
            "displayFormatEnabled",
            "displayTimePartsEnabled",
            "copyFormatOrder",
            "copyFormatEnabled",
            "copyTimePartsEnabled",
            "formatProfiles",
            "activeFormatProfileContext",
            "timeAdjustDayStepBySlot",
            "multiRangeCount",
            "multiRangeTitle",
            "multiRanges",
            "multiRangeCollapsed",
            "multiRangeStartEditEnabled",
            "multiRangeEndEditEnabled",
            "currentTheme",
            "currentLang"
        ];

        const setterDeps = Object.fromEntries(
            handledKeys.map((key) => [
                key,
                (value) => {
                    calls.push([key, value]);
                }
            ])
        );

        const setters = service.createDirectStateSetters(setterDeps);

        setters.groups([{ id: 1 }]);
        setters.activeGroupId(2);
        setters.currentMainTab("fixed");
        setters.activeGroupIdByMainTab({ live: 1, fixed: 2 });
        setters.slotCount(3);
        setters.showCopyFormat(true);
        setters.showTimeline(0);
        setters.displayFormatOrder(["date"]);
        setters.displayFormatEnabled({ date: true });
        setters.displayTimePartsEnabled({ hour: true });
        setters.copyFormatOrder(["time"]);
        setters.copyFormatEnabled({ time: true });
        setters.copyTimePartsEnabled({ minute: true });
        setters.formatProfiles({ profileA: {} });
        setters.activeFormatProfileContext("multi");
        setters.timeAdjustDayStepBySlot([1, 2]);
        setters.multiRangeCount(4);
        setters.multiRangeTitle("Range X");
        setters.multiRanges([{ id: "r1" }]);
        setters.multiRangeCollapsed([false]);
        setters.multiRangeStartEditEnabled([true]);
        setters.multiRangeEndEditEnabled([false]);
        setters.currentTheme("light");
        setters.currentLang("ko");

        expect(calls.length).toBe(handledKeys.length);
        const calledKeys = calls.map(([key]) => key);
        expect(calledKeys).toEqual(handledKeys);
        expect(calls.find(([key]) => key === "showTimeline")?.[1]).toBe(false);
    });

    it("uses fallback defaults when deps are invalid", () => {
        const moduleApi = loadMainAppStateVarsModule();
        const service = moduleApi.createService({
            t: () => "",
            copyFormatKeys: "bad-keys",
            defaultDisplayFormatEnabled: null,
            defaultCopyFormatEnabled: 10,
            defaultDisplayTimePartsEnabled: "bad",
            defaultCopyTimePartsEnabled: undefined,
            defaultTimeAdjustDayStep: "invalid"
        });

        expect(service.initialState.displayFormatOrder).toEqual([]);
        expect(service.initialState.copyFormatOrder).toEqual([]);
        expect(service.initialState.displayFormatEnabled).toEqual({});
        expect(service.initialState.copyFormatEnabled).toEqual({});
        expect(service.initialState.displayTimePartsEnabled).toEqual({});
        expect(service.initialState.copyTimePartsEnabled).toEqual({});
        expect(service.initialState.timeAdjustDayStepBySlot).toEqual([1, 1]);
        expect(service.initialState.multiRangeTitle).toBe("Range");
    });

    it("handles non-object deps and setter maps without throwing", () => {
        const moduleApi = loadMainAppStateVarsModule();
        const service = moduleApi.createService(null);
        const setters = service.createDirectStateSetters(null);

        expect(Object.isFrozen(service)).toBe(true);
        expect(Object.isFrozen(setters)).toBe(true);
        expect(() => setters.showTimeline(1)).not.toThrow();
        expect(() => setters.groups([])).not.toThrow();
    });
});
