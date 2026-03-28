import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-ui-bridge-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "showFatalError",
    "showToast",
    "switchMainTab",
    "refreshOptionToggleDividers",
    "getCopyFieldLabel",
    "getTimePartLabel",
    "getDisplayColumns",
    "getDisplayTimeInputMode",
    "buildRowActionCells",
    "renderList",
    "renderTimelineFrame",
    "resolveFixedTimeSlotUtcDate",
    "getFixedTimeSlotHeaderLabel",
    "renderFixedTimeTab"
];

function loadMainRuntimeUiBridgeAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeUiBridgeAccessorBindings", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimeUiBridgeAccessorBindings
        || globalThis.GTVMainRuntimeUiBridgeAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime UI bridge accessor bindings module", () => {
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

    it("creates runtime UI bridge accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeUiBridgeAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeUiBridgeAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeUiBridgeAccessorProxiesModule,
            callServiceMethod: () => undefined
        });

        expect(runtimeUiBridgeAccessorProxiesModule.createService).toHaveBeenCalledWith({
            callServiceMethod: expect.any(Function)
        });
        expect(service.renderList).toBe(delegateService.renderList);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeUiBridgeAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeUiBridgeAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeUiBridgeAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime UI bridge accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeUiBridgeAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime UI bridge accessor proxies service");
    });
});
