import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-vars.js");

function loadMainAppStateVarsModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-app-state-vars.js" });
    return sandbox.window.GTVMainAppStateVars
        || sandbox.GTVMainAppStateVars
        || sandbox.globalThis.GTVMainAppStateVars;
}

describe("GTV main app state vars module", () => {
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
