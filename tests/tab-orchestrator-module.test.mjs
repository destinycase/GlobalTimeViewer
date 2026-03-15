import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-orchestrator.js");

function loadTabOrchestratorModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/tab-orchestrator.js" });
    return sandbox.window.GTVTabOrchestrator || sandbox.GTVTabOrchestrator || sandbox.globalThis.GTVTabOrchestrator;
}

describe("GTV tab orchestrator module", () => {
    it("switchMainTab syncs profile context then delegates to tab UI", () => {
        const module = loadTabOrchestratorModule();
        const calls = [];
        const service = module.createService({
            sanitizeMainTab: (tab) => tab === "x" ? "live" : tab,
            syncActiveFormatProfileFromState: () => calls.push("sync"),
            resolveFormatProfileContext: (tab, slotCount) => {
                calls.push(`resolve:${tab}:${slotCount}`);
                return `${tab}-ctx`;
            },
            activateFormatProfileContext: (ctx, opts) => calls.push(`activate:${ctx}:${!!opts?.syncCurrent}`),
            getSlotCount: () => 2,
            switchMainTabUi: (tab) => {
                calls.push(`switch:${tab}`);
                return "ok";
            }
        });

        const result = service.switchMainTab("x");
        expect(result).toBe("ok");
        expect(calls).toEqual([
            "sync",
            "resolve:live:2",
            "activate:live-ctx:false",
            "switch:live"
        ]);
    });

    it("refreshOptionToggleDividers delegates to tab UI layer", () => {
        const module = loadTabOrchestratorModule();
        let called = 0;
        const service = module.createService({
            refreshOptionToggleDividersUi: () => {
                called += 1;
            }
        });
        service.refreshOptionToggleDividers();
        expect(called).toBe(1);
    });
});
