import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "service-bootstrap.js");

function loadServiceBootstrapModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/service-bootstrap.js" });
    return sandbox.window.GTVServiceBootstrap || sandbox.GTVServiceBootstrap || sandbox.globalThis.GTVServiceBootstrap;
}

describe("GTV service bootstrap module", () => {
    it("creates tab/group services via provided module APIs", () => {
        const module = loadServiceBootstrapModule();
        const bootstrap = module.createService({
            GTV_TAB_UI: { createService: (cfg) => ({ type: "tab-ui", cfg }) },
            GTV_TAB_ORCHESTRATOR: { createService: (cfg) => ({ type: "tab-orch", cfg }) },
            GTV_GROUP_STATE: { createService: (cfg) => ({ type: "group-state", cfg }) }
        });

        expect(bootstrap.createTabUiService({ a: 1 }).type).toBe("tab-ui");
        expect(bootstrap.createTabOrchestratorService({ b: 2 }).type).toBe("tab-orch");
        expect(bootstrap.createGroupStateService({ c: 3 }).type).toBe("group-state");
    });

    it("throws when required module api is missing", () => {
        const module = loadServiceBootstrapModule();
        const bootstrap = module.createService({
            GTV_TAB_UI: { createService: () => ({}) }
        });
        expect(() => bootstrap.createGroupStateService({})).toThrow();
    });
});
