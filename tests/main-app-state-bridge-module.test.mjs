import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-bridge.js");

function loadMainAppStateBridgeModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-app-state-bridge.js" });
    return sandbox.window.GTVMainAppStateBridge
        || sandbox.GTVMainAppStateBridge
        || sandbox.globalThis.GTVMainAppStateBridge;
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
