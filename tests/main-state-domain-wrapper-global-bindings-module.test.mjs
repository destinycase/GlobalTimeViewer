import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-wrapper-global-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainWrapperGlobalBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateDomainWrapperGlobalBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainWrapperGlobalBindings || globalThis.GTVMainStateDomainWrapperGlobalBindings;
}

describe("GTV main state domain wrapper global bindings module", () => {
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

    it("applies bindings to global root while respecting excluded keys", () => {
        const moduleApi = loadMainStateDomainWrapperGlobalBindingsModule();
        const globalRoot = {};
        const service = moduleApi.createService({
            getGlobalRoot: () => globalRoot
        });
        const count = service.applyBindings({
            keepA: 1,
            keepB: 2,
            skipC: 3
        }, {
            excludeKeys: ["skipC"]
        });

        expect(count).toBe(2);
        expect(globalRoot.keepA).toBe(1);
        expect(globalRoot.keepB).toBe(2);
        expect(globalRoot.skipC).toBeUndefined();
    });

    it("ignores write failures in read-only contexts and returns applied count", () => {
        const moduleApi = loadMainStateDomainWrapperGlobalBindingsModule();
        const globalRoot = {};
        Object.defineProperty(globalRoot, "readonly", {
            value: "fixed",
            writable: false,
            configurable: true,
            enumerable: true
        });
        const service = moduleApi.createService({
            getGlobalRoot: () => globalRoot
        });

        const count = service.applyBindings({
            readonly: "next",
            normal: "ok"
        });

        expect(count).toBe(1);
        expect(globalRoot.readonly).toBe("fixed");
        expect(globalRoot.normal).toBe("ok");
    });
});
