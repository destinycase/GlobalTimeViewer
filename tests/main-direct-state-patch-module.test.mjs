import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-direct-state-patch.js");

function loadMainDirectStatePatchModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-direct-state-patch.js" });
    return sandbox.window.GTVMainDirectStatePatch
        || sandbox.GTVMainDirectStatePatch
        || sandbox.globalThis.GTVMainDirectStatePatch;
}

describe("GTV main direct state patch module", () => {
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
