import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-lang-state-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeLangStateBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeLangStateBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeLangStateBindings || globalThis.GTVMainRuntimeLangStateBindings;
}

describe("GTV main runtime lang state bindings module", () => {
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

    it("creates runtime lang state bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeLangStateBindingsModule();
        const mainRuntimeLangStateService = {
            syncRealtimeFlagToGlobal: vi.fn(() => true),
            getRuntimeCurrentLangValue: vi.fn(() => "ko"),
            syncCurrentLang: vi.fn((next) => next)
        };
        const runtimeLangStateModule = {
            createService: vi.fn(() => mainRuntimeLangStateService)
        };

        const service = moduleApi.createService({
            runtimeLangStateModule,
            globalRef: {},
            defaultLang: "ko"
        });

        expect(runtimeLangStateModule.createService).toHaveBeenCalledWith({
            globalRef: {},
            defaultLang: "ko"
        });
        expect(service.mainRuntimeLangStateService).toBe(mainRuntimeLangStateService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeLangStateBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeLangState.createService"
        );
        expect(() => moduleApi.createService({
            runtimeLangStateModule: { createService: () => null }
        })).toThrow("Invalid main runtime lang state service");
    });
});
