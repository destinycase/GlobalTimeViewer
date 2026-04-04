import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "service-invoke-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadServiceInvokeUtilsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVServiceInvokeUtils", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
}

describe("GTV service invoke utils module", () => {
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

    it("resolves service from getter and invokes methods with fallback", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const service = {
            add: (a, b) => a + b
        };

        expect(moduleApi.resolveService(() => service)).toBe(service);
        expect(moduleApi.resolveService(null)).toBeNull();
        expect(moduleApi.invokeServiceMethod(service, "add", [2, 3], -1)).toBe(5);
        expect(moduleApi.invokeServiceMethod(service, "missingMethod", [2, 3], -1)).toBe(-1);
        expect(moduleApi.invokeGetterMethod(() => service, "add", [7, 8], -1)).toBe(15);
        expect(moduleApi.invokeGetterMethod(() => null, "add", [7, 8], -1)).toBe(-1);
    });

    it("exposes createService and returns a frozen service api", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const serviceApi = moduleApi.createService();
        const service = {
            add: (a, b) => a + b
        };

        expect(Object.isFrozen(serviceApi)).toBe(true);
        expect(serviceApi.invokeGetterMethod(() => service, "add", [1, 2], -1)).toBe(3);
    });

    it("creates an invoker bound to a getter", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const service = {
            uppercase: (value) => String(value).toUpperCase()
        };
        const invoke = moduleApi.createGetterMethodInvoker(() => service);

        expect(invoke("uppercase", ["abc"], "fallback")).toBe("ABC");
        expect(invoke("missing", ["abc"], "fallback")).toBe("fallback");
    });
});
