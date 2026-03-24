import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-state-patcher.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadAppStatePatcherModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVAppStatePatcher", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVAppStatePatcher || globalThis.GTVAppStatePatcher;
}

describe("GTV app state patcher module", () => {
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

    it("returns snapshot and applies patch using mapped setters", () => {
        const module = loadAppStatePatcherModule();
        const state = {
            slotCount: 1,
            showTimeline: false,
            currentLang: "ko",
            isRealtime: true
        };
        let realtime = true;
        const patcher = module.createService({
            getStateSource: () => state,
            stateSetters: {
                slotCount: (value) => { state.slotCount = value; },
                showTimeline: (value) => { state.showTimeline = value; },
                currentLang: (value) => { state.currentLang = value; }
            },
            setIsRealtimeState: (value) => { realtime = !!value; }
        });

        const snapshot = patcher.getStateSnapshot();
        expect(snapshot.slotCount).toBe(1);
        expect(snapshot.showTimeline).toBe(false);
        expect(snapshot.isRealtime).toBe(true);

        patcher.applyStatePatch({
            slotCount: 2,
            showTimeline: 1,
            currentLang: "en",
            isRealtime: false
        });

        expect(state.slotCount).toBe(2);
        expect(state.showTimeline).toBe(true);
        expect(state.currentLang).toBe("en");
        expect(realtime).toBe(false);
    });
});
