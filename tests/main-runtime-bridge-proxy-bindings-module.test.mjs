import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-bridge-proxy-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeBridgeProxyBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeBridgeProxyBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeBridgeProxyBindings || globalThis.GTVMainRuntimeBridgeProxyBindings;
}

describe("GTV main runtime bridge proxy bindings module", () => {
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

    it("creates runtime bridge proxy bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeBridgeProxyBindingsModule();
        const runtimeBridgeProxiesService = {
            getSignedInclusiveDaySpan: vi.fn(() => 1),
            escapeHtmlViaSharedUtils: vi.fn((value) => String(value))
        };
        const runtimeBridgeProxiesModule = {
            createService: vi.fn(() => runtimeBridgeProxiesService)
        };

        const service = moduleApi.createService({
            runtimeBridgeProxiesModule,
            callServiceMethod: () => undefined
        });

        expect(runtimeBridgeProxiesModule.createService).toHaveBeenCalledWith({
            callServiceMethod: expect.any(Function)
        });
        expect(service.mainRuntimeBridgeProxiesService).toBe(runtimeBridgeProxiesService);
        expect(service.getSignedInclusiveDaySpan()).toBe(1);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeBridgeProxyBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeBridgeProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeBridgeProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime bridge proxies service");
    });
});
