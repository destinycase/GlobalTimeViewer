import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-direct-state-patch.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainDirectStatePatchModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainDirectStatePatch", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainDirectStatePatch || globalThis.GTVMainDirectStatePatch;
}

describe("GTV main direct state patch module", () => {
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
    it("applies default patch keys and normalizes showTimeline/isRealtime", () => {
        const moduleApi = loadMainDirectStatePatchModule();
        const state = {
            slotCount: 1,
            showTimeline: false,
            currentMainTab: "live",
            isRealtime: true
        };
        const service = moduleApi.createService({
            stateSetters: {
                slotCount: (value) => { state.slotCount = value; },
                showTimeline: (value) => { state.showTimeline = value; },
                currentMainTab: (value) => { state.currentMainTab = value; }
            },
            setIsRealtimeState: (value) => { state.isRealtime = !!value; }
        });

        service.applyDirectStatePatch({
            slotCount: 2,
            showTimeline: "truthy",
            currentMainTab: "fixed",
            isRealtime: 0
        });

        expect(state.slotCount).toBe(2);
        expect(state.showTimeline).toBe(true);
        expect(state.currentMainTab).toBe("fixed");
        expect(state.isRealtime).toBe(false);
    });

    it("supports custom patch key lists", () => {
        const moduleApi = loadMainDirectStatePatchModule();
        const state = { allowed: 0, blocked: 0 };
        const service = moduleApi.createService({
            patchKeys: ["allowed"],
            stateSetters: {
                allowed: (value) => { state.allowed = value; },
                blocked: (value) => { state.blocked = value; }
            }
        });

        service.applyDirectStatePatch({ allowed: 1, blocked: 1 });
        expect(state.allowed).toBe(1);
        expect(state.blocked).toBe(0);
        expect(service.getPatchKeys()).toEqual(["allowed"]);
    });
});
