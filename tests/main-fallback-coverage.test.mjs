import path from "node:path";
import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

const MAIN_PATH = path.resolve(process.cwd(), "main.js");
const require = createRequire(import.meta.url);
const MAIN_ID = require.resolve(MAIN_PATH);

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
    const globalPatches = {
        console,
        setTimeout,
        clearTimeout,
        t: () => "Range"
    };
    if (withWindow) {
        const windowRef = {};
        if (constantsDefined) windowRef.GTVMainConstants = {};
        windowRef.GTVMainAppStateVars = mainAppStateVarsStub;
        windowRef.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
        globalPatches.window = windowRef;
    } else if (constantsDefined) {
        globalPatches.GTVMainConstants = {};
        globalPatches.GTVMainAppStateVars = mainAppStateVarsStub;
        globalPatches.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
    }
    const keys = [
        "window",
        "console",
        "setTimeout",
        "clearTimeout",
        "t",
        "GTVMainConstants",
        "GTVMainAppStateVars",
        "GTVMainCoreServiceAssembly",
        ...Object.keys(globalPatches)
    ];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    try {
        Object.entries(globalPatches).forEach(([key, value]) => {
            globalThis[key] = value;
        });
        delete require.cache[MAIN_ID];
        require(MAIN_PATH);
        return null;
    } catch (err) {
        return err;
    } finally {
        delete require.cache[MAIN_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
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
