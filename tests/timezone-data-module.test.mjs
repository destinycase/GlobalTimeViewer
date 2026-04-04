import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-data.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadTimezoneDataModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVTimezoneData", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTimezoneData || globalThis.GTVTimezoneData;
}

describe("GTV timezone data module", () => {
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

    it("exposes createService and keeps static data accessible", () => {
        const moduleApi = loadTimezoneDataModule();
        const service = moduleApi.createService();

        expect(typeof moduleApi.createService).toBe("function");
        expect(Object.isFrozen(moduleApi)).toBe(true);
        expect(Object.isFrozen(service)).toBe(true);
        expect(service.TZ_DATABASE).toBe(moduleApi.TZ_DATABASE);
        expect(service.ZONE_MAP).toBe(moduleApi.ZONE_MAP);
        expect(Array.isArray(service.TZ_DATABASE)).toBe(true);
        expect(service.ZONE_MAP["Asia/Seoul"]).toBeDefined();
    });
});
