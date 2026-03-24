import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-orchestrator.js");

function loadTabOrchestratorModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { globalThis: {}, console };
    if (!options.noWindow) {
        sandbox.window = {};
    }
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/tab-orchestrator.js" });
    return sandbox.window?.GTVTabOrchestrator || sandbox.GTVTabOrchestrator || sandbox.globalThis.GTVTabOrchestrator;
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

    it("returns undefined safely when dependencies are missing", () => {
        const module = loadTabOrchestratorModule();
        const service = module.createService(null);

        expect(service.switchMainTab("live")).toBe(undefined);
        expect(service.refreshOptionToggleDividers()).toBe(undefined);
    });

    it("swallows dependency exceptions and keeps switch flow resilient", () => {
        const module = loadTabOrchestratorModule();
        const receivedTabs = [];
        const service = module.createService({
            sanitizeMainTab: () => {
                throw new Error("sanitize failed");
            },
            switchMainTabUi: (tab) => {
                receivedTabs.push(tab);
                return "never";
            }
        });

        expect(service.switchMainTab("live")).toBe("never");
        expect(receivedTabs).toEqual([undefined]);
    });

    it("continues switch flow when context resolver throws and keeps undefined context", () => {
        const module = loadTabOrchestratorModule();
        const calls = [];
        const service = module.createService({
            sanitizeMainTab: (tab) => tab,
            getSlotCount: () => 1,
            resolveFormatProfileContext: () => {
                throw new Error("resolve failed");
            },
            activateFormatProfileContext: (ctx, opts) => {
                calls.push({ ctx, syncCurrent: opts?.syncCurrent });
            },
            switchMainTabUi: () => "ok"
        });

        expect(service.switchMainTab("live")).toBe("ok");
        expect(calls).toEqual([{ ctx: undefined, syncCurrent: false }]);
    });

    it("returns undefined when tab UI switch hook throws", () => {
        const module = loadTabOrchestratorModule();
        const service = module.createService({
            sanitizeMainTab: (tab) => tab,
            switchMainTabUi: () => {
                throw new Error("ui failed");
            }
        });

        expect(service.switchMainTab("fixed")).toBe(undefined);
    });

    it("returns undefined when divider UI hook throws", () => {
        const module = loadTabOrchestratorModule();
        const service = module.createService({
            refreshOptionToggleDividersUi: () => {
                throw new Error("divider failed");
            }
        });

        expect(service.refreshOptionToggleDividers()).toBe(undefined);
    });

    it("supports globalThis export path when window is unavailable", () => {
        const module = loadTabOrchestratorModule({ noWindow: true });
        const service = module.createService("not-an-object");

        expect(service.switchMainTab("live")).toBe(undefined);
        expect(service.refreshOptionToggleDividers()).toBe(undefined);
    });
});
