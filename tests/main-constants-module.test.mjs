import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-constants.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainConstantsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainConstants", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainConstants || globalThis.GTVMainConstants;
}

describe("GTV main constants module", () => {
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

    it("exposes createService and keeps legacy direct access compatible", () => {
        const moduleApi = loadMainConstantsModule();
        const service = moduleApi.createService();

        expect(typeof moduleApi.createService).toBe("function");
        expect(Object.isFrozen(moduleApi)).toBe(true);
        expect(Object.isFrozen(service)).toBe(true);
        expect(service.MAIN_TABS).toEqual(moduleApi.MAIN_TABS);
        expect(service.DEFAULT_FIXED_TIME_VALUE).toBe(moduleApi.DEFAULT_FIXED_TIME_VALUE);
    });

    it("returns same immutable constants object regardless of deps", () => {
        const moduleApi = loadMainConstantsModule();
        const serviceA = moduleApi.createService();
        const serviceB = moduleApi.createService({ any: "value" });

        expect(serviceA).toBe(serviceB);
    });
});
