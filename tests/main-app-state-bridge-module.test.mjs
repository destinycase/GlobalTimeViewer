import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainAppStateBridgeModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainAppStateBridge", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainAppStateBridge || globalThis.GTVMainAppStateBridge;
}

function createCallServiceMethod() {
    return (serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main app state bridge module", () => {
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
    it("uses fallback patch when state services are missing", () => {
        const moduleApi = loadMainAppStateBridgeModule();
        const patches = [];
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getAppStatePatcherService: () => null,
            getAppPersistenceStateService: () => null,
            applyDirectStatePatch: (next) => { patches.push(next); }
        });

        expect(service.getPersistenceState()).toEqual({});
        service.setPersistenceState({ slotCount: 2 });
        expect(patches).toHaveLength(1);
        expect(patches[0].slotCount).toBe(2);

        service.patchAppState({ showTimeline: true });
        expect(patches).toHaveLength(2);
        expect(patches[1].showTimeline).toBe(true);

        expect(service.getPatchedIntegerStateValue("slotCount", 3)).toBe(3);
        expect(service.getPatchedBooleanStateValue("showTimeline", true)).toBe(true);
        expect(service.getPatchedStringStateValue("currentMainTab", "live")).toBe("live");
        expect(service.getPatchedArrayStateValue("multiRanges", [1, 2])).toEqual([1, 2]);
        expect(service.getPatchedObjectStateValue("displayFormatEnabled", { time: true })).toEqual({ time: true });
    });

    it("delegates reads and writes to state services when available", () => {
        const moduleApi = loadMainAppStateBridgeModule();
        const calls = [];
        const stateSnapshot = {
            slotCount: "2",
            showTimeline: 1,
            currentMainTab: "fixed",
            multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
            displayFormatEnabled: { time: true }
        };
        const appStatePatcherService = {
            getStateSnapshot: () => stateSnapshot,
            applyStatePatch: (next) => {
                calls.push(["patch", next]);
                return "patched";
            }
        };
        const appPersistenceStateService = {
            getPersistenceState: () => ({ groups: [] }),
            setPersistenceState: (next) => {
                calls.push(["persist", next]);
                return "persisted";
            }
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getAppStatePatcherService: () => appStatePatcherService,
            getAppPersistenceStateService: () => appPersistenceStateService,
            applyDirectStatePatch: () => {
                throw new Error("fallback should not be used");
            }
        });

        expect(service.getPersistenceState()).toEqual({ groups: [] });
        expect(service.setPersistenceState({ currentMainTab: "fixed" })).toBe("persisted");
        expect(service.patchAppState({ showTimeline: true })).toBe("patched");
        expect(calls).toEqual([
            ["persist", { currentMainTab: "fixed" }],
            ["patch", { showTimeline: true }]
        ]);

        expect(service.getPatchedIntegerStateValue("slotCount", 0)).toBe(2);
        expect(service.getPatchedBooleanStateValue("showTimeline", false)).toBe(true);
        expect(service.getPatchedStringStateValue("currentMainTab", "live")).toBe("fixed");
        expect(service.getPatchedArrayStateValue("multiRanges", [])).toEqual(stateSnapshot.multiRanges);
        expect(service.getPatchedObjectStateValue("displayFormatEnabled", {})).toEqual({ time: true });
    });
});
