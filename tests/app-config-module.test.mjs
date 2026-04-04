import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const APP_CONFIG_PATH = path.resolve(process.cwd(), "js", "modules", "app-config.js");
const PACKAGE_JSON_PATH = path.resolve(process.cwd(), "package.json");
const MANIFEST_PATH = path.resolve(process.cwd(), "manifest.json");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(APP_CONFIG_PATH);
const moduleCleanupStack = [];

function loadAppConfig() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVAppConfig", ...Object.keys(globalPatches)];
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
    require(APP_CONFIG_PATH);
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

    return globalThis.window?.GTVAppConfig || globalThis.GTVAppConfig;
}

describe("GTV app config module", () => {
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

    it("exposes immutable runtime config", () => {
        const config = loadAppConfig();
        expect(config).toBeTruthy();
        expect(config.VERSION).toBeTypeOf("string");
        expect(config.STORAGE_KEY).toBeTypeOf("string");
        expect(Object.isFrozen(config)).toBe(true);
    });

    it("exposes createService with immutable config payload", () => {
        const moduleApi = loadAppConfig();
        const config = moduleApi.createService();

        expect(typeof moduleApi.createService).toBe("function");
        expect(Object.isFrozen(config)).toBe(true);
        expect(config.VERSION).toBe(moduleApi.VERSION);
        expect(config.STORAGE_KEY).toBe(moduleApi.STORAGE_KEY);
    });

    it("keeps fallback migration keys within cleanup key list", () => {
        const config = loadAppConfig();
        const cleanupKeys = new Set(config.LEGACY_STORAGE_KEYS);
        expect(config.LEGACY_STORAGE_FALLBACK_KEYS.length).toBeGreaterThan(0);
        config.LEGACY_STORAGE_FALLBACK_KEYS.forEach((key) => {
            expect(cleanupKeys.has(key)).toBe(true);
        });
    });

    it("keeps version consistent with package and manifest", () => {
        const config = loadAppConfig();
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

        expect(config.VERSION).toBe(pkg.version);
        expect(config.VERSION).toBe(manifest.version);
        expect(config.VERSION).toBe(manifest.version_name);
    });
});
