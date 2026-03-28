import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-lang-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeLangStateModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeLangState", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeLangState || globalThis.GTVMainRuntimeLangState;
}

describe("GTV main runtime lang state module", () => {
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

    it("syncs realtime flag to global context", () => {
        const moduleApi = loadMainRuntimeLangStateModule();
        const host = {};
        const service = moduleApi.createService({
            globalRef: host,
            defaultLang: "ko"
        });

        expect(service.syncRealtimeFlagToGlobal(true)).toBe(true);
        expect(host.isRealtime).toBe(true);
        expect(service.syncRealtimeFlagToGlobal(0)).toBe(false);
        expect(host.isRealtime).toBe(false);
    });

    it("tracks runtime language with fallback behavior", () => {
        const moduleApi = loadMainRuntimeLangStateModule();
        const host = { currentLang: "en" };
        const service = moduleApi.createService({
            globalRef: host,
            defaultLang: "ko"
        });

        expect(service.getRuntimeCurrentLangValue()).toBe("en");
        host.currentLang = "";
        expect(service.getRuntimeCurrentLangValue()).toBe("en");
        expect(service.syncCurrentLang("ja")).toBe("ja");
        expect(host.currentLang).toBe("ja");
        expect(service.syncCurrentLang("   ")).toBe("ko");
        expect(host.currentLang).toBe("ko");
    });
});
