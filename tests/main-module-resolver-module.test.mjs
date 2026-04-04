import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-module-resolver.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainModuleResolver() {
    const windowRef = {};
    const globalPatches = { window: windowRef, console };
    const keys = ["window", "console", "GTVMainModuleResolver", ...Object.keys(globalPatches)];
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

    return {
        moduleApi: globalThis.window?.GTVMainModuleResolver || globalThis.GTVMainModuleResolver,
        windowRef
    };
}

describe("GTV main module resolver", () => {
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

    it("resolves module map with required API checks", () => {
        const { moduleApi, windowRef } = loadMainModuleResolver();
        windowRef.GTVFoo = { createService: () => ({ ok: true }) };
        windowRef.GTVBar = { value: 10 };

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
        const { moduleApi, windowRef } = loadMainModuleResolver();
        windowRef.GTVBad = {};
        expect(() => moduleApi.resolveModules({
            BAD: { globalName: "GTVBad", errorLabel: "GTVBad", requiredMethod: "createService" }
        })).toThrow("Missing required module API: GTVBad.createService");
    });

    it("throws validate message for malformed module shape", () => {
        const { moduleApi, windowRef } = loadMainModuleResolver();
        windowRef.GTVTimezoneData = { TZ_DATABASE: null, ZONE_MAP: null };
        expect(() => moduleApi.resolveModules({
            TZ: {
                globalName: "GTVTimezoneData",
                errorLabel: "GTVTimezoneData",
                validate: (moduleApi) => Array.isArray(moduleApi?.TZ_DATABASE) && !!moduleApi?.ZONE_MAP,
                errorMessage: "Missing required module API: GTVTimezoneData"
            }
        })).toThrow("Missing required module API: GTVTimezoneData");
    });

    it("exposes createService and supports rootRef override", () => {
        const { moduleApi } = loadMainModuleResolver();
        const rootRef = {
            GTVScoped: {
                createService: () => ({ ok: true })
            }
        };
        const service = moduleApi.createService({ rootRef });
        const resolved = service.resolveModule("GTVScoped", {
            errorLabel: "GTVScoped",
            requiredMethod: "createService"
        });

        expect(Object.isFrozen(service)).toBe(true);
        expect(typeof resolved.createService).toBe("function");
    });
});
