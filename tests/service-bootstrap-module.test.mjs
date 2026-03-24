import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "service-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadServiceBootstrapModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVServiceBootstrap", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVServiceBootstrap || globalThis.GTVServiceBootstrap;
}

describe("GTV service bootstrap module", () => {
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
