import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helper-aliases-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelperAliasesBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperAliasesBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeStateHelperAliasesBindings || globalThis.GTVMainRuntimeStateHelperAliasesBindings;
}

describe("GTV main runtime state helper aliases bindings module", () => {
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

    it("creates runtime state helper alias bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeStateHelperAliasesBindingsModule();
        const delegateService = {
            parseDateTimePartsViaRuntimeStateHelpers: vi.fn()
        };
        const runtimeStateHelperAliasesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeStateHelperAliasesModule,
            getMainSharedUtilsService: () => ({})
        });

        expect(runtimeStateHelperAliasesModule.createService).toHaveBeenCalledWith({
            getMainSharedUtilsService: expect.any(Function)
        });
        expect(service.parseDateTimePartsViaRuntimeStateHelpers).toBe(delegateService.parseDateTimePartsViaRuntimeStateHelpers);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeStateHelperAliasesBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeStateHelperAliases.createService"
        );
        expect(() => moduleApi.createService({
            runtimeStateHelperAliasesModule: { createService: () => null }
        })).toThrow("Invalid main runtime state helper aliases service");
    });
});
