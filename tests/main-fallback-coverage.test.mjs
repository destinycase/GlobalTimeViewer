import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MAIN_PATH = path.resolve(process.cwd(), "main.js");
const MAIN_CODE = fs.readFileSync(MAIN_PATH, "utf8");

function runMainWithSandbox({ withWindow = true, constantsDefined = true } = {}) {
    const mainAppStateVarsStub = {
        createService: () => ({
            initialState: {},
            createDirectStateSetters: () => ({})
        })
    };
    const mainCoreServiceAssemblyStub = {
        createService: () => ({
            mainServiceMethodBridgeService: null,
            mainDirectStatePatchService: null,
            mainAppStateBridgeService: null,
            mainSharedUtilsService: null,
            mainTimezoneFacadeService: null,
            mainTimezoneTableFacadeService: null,
            mainTimeAdjustFacadeService: null,
            mainFixedTimeTabFacadeService: null,
            mainMultiRangeTabFacadeService: null
        })
    };
    const sandbox = {
        console,
        setTimeout,
        clearTimeout,
        t: () => "Range"
    };
    if (withWindow) {
        sandbox.window = {};
        if (constantsDefined) sandbox.window.GTVMainConstants = {};
        sandbox.window.GTVMainAppStateVars = mainAppStateVarsStub;
        sandbox.window.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
    } else if (constantsDefined) {
        sandbox.GTVMainConstants = {};
        sandbox.GTVMainAppStateVars = mainAppStateVarsStub;
        sandbox.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
    }
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);

    try {
        vm.runInContext(MAIN_CODE, sandbox, { filename: "main.js" });
        return null;
    } catch (err) {
        return err;
    }
}

describe("main.js fallback coverage guards", () => {
    it("uses constant fallbacks in window context before resolver guard fails", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("supports globalThis constants path when window is absent", () => {
        const err = runMainWithSandbox({ withWindow: false, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("throws explicit error when constants module is missing", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: false });
        expect(String(err?.message || "")).toContain("Missing required module: GTVMainConstants");
    });
});
