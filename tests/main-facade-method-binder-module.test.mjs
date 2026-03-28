import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-facade-method-binder.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFacadeMethodBinderModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFacadeMethodBinder", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFacadeMethodBinder || globalThis.GTVMainFacadeMethodBinder;
}

describe("GTV main facade method binder module", () => {
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

    it("derives service names from getter function names", () => {
        const moduleApi = loadMainFacadeMethodBinderModule();
        const service = moduleApi.createService();

        function getMainTimezoneFacadeServiceRef() {
            return {};
        }

        expect(service.deriveFacadeServiceName(getMainTimezoneFacadeServiceRef)).toBe("mainTimezoneFacadeService");
        expect(service.deriveFacadeServiceName(() => null, "fallback")).toBe("fallback");
        expect(service.deriveFacadeServiceName(null, "fallback")).toBe("fallback");
    });

    it("binds facade methods through callServiceMethod with inferred name", () => {
        const moduleApi = loadMainFacadeMethodBinderModule();
        const callServiceMethod = vi.fn(() => "ok");
        const facade = { ping: vi.fn(() => "pong") };
        function getSampleFacadeRef() {
            return facade;
        }
        const service = moduleApi.createService({
            callServiceMethod
        });

        const bound = service.bindFacadeMethod(getSampleFacadeRef, "ping");
        expect(bound(1, 2, 3)).toBe("ok");
        expect(callServiceMethod).toHaveBeenCalledWith(
            "sampleFacade",
            facade,
            "ping",
            [1, 2, 3],
            {}
        );
    });

    it("supports explicit serviceName override and safe fallback", () => {
        const moduleApi = loadMainFacadeMethodBinderModule();
        const callServiceMethod = vi.fn(() => "done");
        const service = moduleApi.createService({
            callServiceMethod
        });

        const bound = service.bindFacadeMethod(null, "missing", {
            serviceName: "customService",
            fallback: 10
        });
        expect(bound("x")).toBe("done");
        expect(callServiceMethod).toHaveBeenCalledWith(
            "customService",
            null,
            "missing",
            ["x"],
            { serviceName: "customService", fallback: 10 }
        );
    });
});
