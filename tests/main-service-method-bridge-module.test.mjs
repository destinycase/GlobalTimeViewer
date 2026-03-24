import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-service-method-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainServiceMethodBridgeModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainServiceMethodBridge", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainServiceMethodBridge || globalThis.GTVMainServiceMethodBridge;
}

describe("GTV main service method bridge module", () => {
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
    it("deduplicates missing method warnings and missing feature notifications", () => {
        const moduleApi = loadMainServiceMethodBridgeModule();
        const warned = [];
        const missingFeatures = [];
        const service = moduleApi.createService({
            onWarnMissingMethod: (serviceName, methodName) => {
                warned.push(`${serviceName}.${methodName}`);
            },
            onMissingFeature: (featureKey) => {
                missingFeatures.push(featureKey);
            }
        });

        expect(service.getServiceMethod("a", null, "b", { toastOnMissing: true })).toBe(null);
        expect(service.getServiceMethod("a", null, "b", { toastOnMissing: true })).toBe(null);

        expect(warned).toEqual(["a.b"]);
        expect(missingFeatures).toEqual(["a.b"]);
    });

    it("binds and calls service methods with fallback support", () => {
        const moduleApi = loadMainServiceMethodBridgeModule();
        const service = moduleApi.createService();
        const target = {
            value: 3,
            sum(delta) {
                return this.value + delta;
            }
        };

        expect(service.callServiceMethod("target", target, "sum", [2])).toBe(5);
        expect(service.callServiceMethod("target", target, "missing", [2], { fallback: 7 })).toBe(7);
    });
});
