import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-persistence-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadAppPersistenceStateModule(options = {}) {
    const globalPatches = { console };
    if (!options.noWindow) {
        globalPatches.window = {};
    }
    const keys = ["window", "console", "GTVAppPersistenceState", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVAppPersistenceState || globalThis.GTVAppPersistenceState;
}

describe("GTV app persistence state module", () => {
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

    it("getPersistenceState syncs profile context and returns snapshot", () => {
        const module = loadAppPersistenceStateModule();
        let syncCount = 0;
        const state = {
            groups: [{ name: "G1" }],
            activeGroupId: 0,
            currentMainTab: "live",
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
            timeAdjustDayStepBySlot: [1, 1],
            multiRangeCount: 1,
            multiRangeTitle: "",
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: [],
            isRealtime: true,
            currentTheme: "dark",
            currentLang: "ko"
        };
        const service = module.createService({
            getState: () => state,
            syncActiveFormatProfileFromState: () => {
                syncCount += 1;
            }
        });

        const snapshot = service.getPersistenceState();
        expect(syncCount).toBe(1);
        expect(snapshot.currentMainTab).toBe("live");
        expect(snapshot.isRealtime).toBe(true);
    });

    it("setPersistenceState updates state and reapplies format profile context", () => {
        const module = loadAppPersistenceStateModule();
        const state = {
            groups: [{ name: "G1" }],
            activeGroupId: 0,
            currentMainTab: "live",
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
            formatProfiles: { live: { copyFormatOrder: [] } },
            activeFormatProfileContext: "live",
            timeAdjustDayStepBySlot: [1, 1],
            multiRangeCount: 1,
            multiRangeTitle: "",
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: [],
            isRealtime: true,
            currentTheme: "dark",
            currentLang: "ko"
        };
        let realtime = true;
        let ensureCount = 0;
        let applied = null;
        const service = module.createService({
            getState: () => state,
            setState: (patch) => Object.assign(state, patch),
            setIsRealtimeState: (next) => {
                realtime = !!next;
                state.isRealtime = realtime;
            },
            ensureFormatProfiles: () => {
                ensureCount += 1;
            },
            getCurrentFormatProfileState: () => ({ }),
            resolveFormatProfileContext: () => "live",
            applyFormatProfileState: (profile, context) => {
                applied = { profile, context };
            }
        });

        service.setPersistenceState({
            showTimeline: 1,
            currentLang: "en",
            isRealtime: false
        });

        expect(state.showTimeline).toBe(true);
        expect(state.currentLang).toBe("en");
        expect(realtime).toBe(false);
        expect(ensureCount).toBe(1);
        expect(applied.context).toBe("live");
    });

    it("setPersistenceState ignores non-object input and does not call setters", () => {
        const module = loadAppPersistenceStateModule();
        let setStateCount = 0;
        let realtimeCount = 0;
        const service = module.createService({
            setState: () => {
                setStateCount += 1;
            },
            setIsRealtimeState: () => {
                realtimeCount += 1;
            }
        });

        service.setPersistenceState(null);
        service.setPersistenceState(123);

        expect(setStateCount).toBe(0);
        expect(realtimeCount).toBe(0);
    });

    it("setPersistenceState applies realtime-only update and inherited keys are ignored", () => {
        const module = loadAppPersistenceStateModule();
        const state = {
            currentMainTab: "live",
            slotCount: 1,
            formatProfiles: {},
            activeFormatProfileContext: "live"
        };
        const patchCalls = [];
        let realtime = true;
        const service = module.createService({
            getState: () => state,
            setState: (patch) => {
                patchCalls.push(patch);
                Object.assign(state, patch);
            },
            setIsRealtimeState: (next) => {
                realtime = !!next;
            },
            resolveFormatProfileContext: () => "live",
            getCurrentFormatProfileState: () => ({}),
            ensureFormatProfiles: () => { },
            applyFormatProfileState: () => { }
        });

        const inherited = { showTimeline: true };
        const next = Object.create(inherited);
        next.isRealtime = 0;

        service.setPersistenceState(next);

        expect(realtime).toBe(false);
        expect(patchCalls).toEqual([{ activeFormatProfileContext: "live" }]);
    });

    it("getPersistenceState falls back safely when dependencies throw or return non-object", () => {
        const module = loadAppPersistenceStateModule();
        const service = module.createService({
            syncActiveFormatProfileFromState: () => {
                throw new Error("sync failed");
            },
            getState: () => "not-an-object"
        });

        const snapshot = service.getPersistenceState();
        expect(snapshot.groups).toBe(undefined);
        expect(snapshot.currentLang).toBe(undefined);
        expect(snapshot.isRealtime).toBe(false);
    });

    it("supports globalThis export path and non-object deps fallback", () => {
        const module = loadAppPersistenceStateModule({ noWindow: true });
        const service = module.createService("invalid-deps");

        expect(service.getPersistenceState().isRealtime).toBe(false);
        expect(() => service.setPersistenceState({ showTimeline: 1 })).not.toThrow();
    });
});
