import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const APP_CONFIG_PATH = path.resolve(process.cwd(), "js", "modules", "app-config.js");
const PACKAGE_JSON_PATH = path.resolve(process.cwd(), "package.json");
const MANIFEST_PATH = path.resolve(process.cwd(), "manifest.json");

function loadAppConfig() {
    const code = fs.readFileSync(APP_CONFIG_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {}
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/app-config.js" });
    return sandbox.window.GTVAppConfig || sandbox.GTVAppConfig || sandbox.globalThis.GTVAppConfig;
}

describe("GTV app config module", () => {
    it("exposes immutable runtime config", () => {
        const config = loadAppConfig();
        expect(config).toBeTruthy();
        expect(config.VERSION).toBeTypeOf("string");
        expect(config.STORAGE_KEY).toBeTypeOf("string");
        expect(Object.isFrozen(config)).toBe(true);
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
