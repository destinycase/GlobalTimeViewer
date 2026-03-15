import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-state-patcher.js");

function loadAppStatePatcherModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/app-state-patcher.js" });
    return sandbox.window.GTVAppStatePatcher || sandbox.GTVAppStatePatcher || sandbox.globalThis.GTVAppStatePatcher;
}

describe("GTV app state patcher module", () => {
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
