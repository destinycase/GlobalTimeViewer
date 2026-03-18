import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-module-resolver.js");

function loadMainModuleResolver() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-module-resolver.js" });
    return {
        moduleApi: sandbox.window.GTVMainModuleResolver || sandbox.GTVMainModuleResolver || sandbox.globalThis.GTVMainModuleResolver,
        sandbox
    };
}

describe("GTV main module resolver", () => {
    it("resolves module map with required API checks", () => {
        const { moduleApi, sandbox } = loadMainModuleResolver();
        sandbox.window.GTVFoo = { createService: () => ({ ok: true }) };
        sandbox.window.GTVBar = { value: 10 };

        const resolved = moduleApi.resolveModules({
            FOO: { globalName: "GTVFoo", errorLabel: "GTVFoo", requiredMethod: "createService" },
            BAR: { globalName: "GTVBar", errorLabel: "GTVBar" }
        });

        expect(typeof resolved.FOO.createService).toBe("function");
        expect(resolved.BAR.value).toBe(10);
    });

    it("returns null for optional missing modules", () => {
        const { moduleApi } = loadMainModuleResolver();
        const resolved = moduleApi.resolveModules({
            OPT: { globalName: "GTVMissing", errorLabel: "GTVMissing", optional: true }
        });
        expect(resolved.OPT).toBe(null);
    });

    it("throws for missing required module APIs", () => {
        const { moduleApi, sandbox } = loadMainModuleResolver();
        sandbox.window.GTVBad = {};
        expect(() => moduleApi.resolveModules({
            BAD: { globalName: "GTVBad", errorLabel: "GTVBad", requiredMethod: "createService" }
        })).toThrow("Missing required module API: GTVBad.createService");
    });

    it("throws validate message for malformed module shape", () => {
        const { moduleApi, sandbox } = loadMainModuleResolver();
        sandbox.window.GTVTimezoneData = { TZ_DATABASE: null, ZONE_MAP: null };
        expect(() => moduleApi.resolveModules({
            TZ: {
                globalName: "GTVTimezoneData",
                errorLabel: "GTVTimezoneData",
                validate: (moduleApi) => Array.isArray(moduleApi?.TZ_DATABASE) && !!moduleApi?.ZONE_MAP,
                errorMessage: "Missing required module API: GTVTimezoneData"
            }
        })).toThrow("Missing required module API: GTVTimezoneData");
    });
});
