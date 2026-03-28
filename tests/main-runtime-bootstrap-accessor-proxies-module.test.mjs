import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-bootstrap-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeBootstrapAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeBootstrapAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeBootstrapAccessorProxies
        || globalThis.GTVMainRuntimeBootstrapAccessorProxies
    );
}

describe("GTV main runtime bootstrap accessor proxies module", () => {
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

    it("delegates initApp and DOMContentLoaded registration with runtime services", async () => {
        const moduleApi = loadMainRuntimeBootstrapAccessorProxiesModule();
        const initApp = vi.fn(async () => "boot-ok");
        const addEventListener = vi.fn();
        const service = moduleApi.createService({
            getMainAppBootstrapService: () => ({ initApp }),
            getDocumentRefOrNull: () => ({
                readyState: "loading",
                addEventListener
            })
        });

        await expect(service.initApp()).resolves.toBe("boot-ok");
        expect(initApp).toHaveBeenCalledTimes(1);

        const onReady = vi.fn();
        expect(service.startBootstrapOnDomReady(onReady)).toBeUndefined();
        expect(addEventListener).toHaveBeenCalledWith("DOMContentLoaded", onReady);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("runs immediately when document is unavailable or already ready", async () => {
        const moduleApi = loadMainRuntimeBootstrapAccessorProxiesModule();
        const service = moduleApi.createService({
            getDocumentRefOrNull: () => null
        });

        const runInit = vi.fn(() => "immediate");
        expect(service.startBootstrapOnDomReady(runInit)).toBe("immediate");
        await expect(service.initApp()).resolves.toBeUndefined();
    });
});
