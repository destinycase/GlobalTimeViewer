import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-test-helpers.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTestHelpersModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTestHelpers", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTestHelpers || globalThis.GTVMainTestHelpers;
}

describe("GTV main test helpers module", () => {
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

    it("resolves and invokes functions with validated hook names", () => {
        const moduleApi = loadMainTestHelpersModule();
        const values = {
            run: (...args) => args.join("-"),
            value: 42
        };
        const service = moduleApi.createService({
            resolveValue: (key) => values[key] ?? null,
            isEnabled: () => false
        });

        expect(service.normalizeHookName("run")).toBe("run");
        expect(service.normalizeHookName("bad-name")).toBe("");
        expect(typeof service.resolve("run")).toBe("function");
        expect(service.resolve("unknown")).toBeNull();
        expect(service.resolve("bad-name")).toBeNull();
        expect(service.invoke("run", "a", "b")).toBe("a-b");
        expect(service.invoke("value")).toBe(undefined);
    });

    it("installs guarded test hooks only when enabled", () => {
        const moduleApi = loadMainTestHelpersModule();
        const host = {};
        const values = { sample: () => "ok" };
        const service = moduleApi.createService({
            getGlobalRef: () => host,
            resolveValue: (key) => values[key] ?? null,
            isEnabled: () => true
        });

        expect(service.install()).toBe(true);
        expect(typeof host.__GTVMainTestHooks.resolve).toBe("function");
        expect(host.__GTVMainTestHooks.resolve("sample")).toBe(values.sample);
        expect(host.__GTVMainTestHooks.invoke("sample")).toBe("ok");
    });
});
