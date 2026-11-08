import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "service-invoke-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadServiceInvokeUtilsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVServiceInvokeUtils", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
}

describe("GTV service invoke utils module", () => {
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

    it("resolves service from getter and invokes methods with fallback", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const service = {
            add: (a, b) => a + b
        };

        expect(moduleApi.resolveService(() => service)).toBe(service);
        expect(moduleApi.resolveService(null)).toBeNull();
        expect(moduleApi.invokeServiceMethod(service, "add", [2, 3], -1)).toBe(5);
        expect(moduleApi.invokeServiceMethod(service, "missingMethod", [2, 3], -1)).toBe(-1);
        expect(moduleApi.invokeGetterMethod(() => service, "add", [7, 8], -1)).toBe(15);
        expect(moduleApi.invokeGetterMethod(() => null, "add", [7, 8], -1)).toBe(-1);
    });

    it("exposes createService and returns a frozen service api", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const serviceApi = moduleApi.createService();
        const service = {
            add: (a, b) => a + b
        };

        expect(Object.isFrozen(serviceApi)).toBe(true);
        expect(serviceApi.invokeGetterMethod(() => service, "add", [1, 2], -1)).toBe(3);
    });

    it("creates an invoker bound to a getter", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const service = {
            uppercase: (value) => String(value).toUpperCase()
        };
        const invoke = moduleApi.createGetterMethodInvoker(() => service);

        expect(invoke("uppercase", ["abc"], "fallback")).toBe("ABC");
        expect(invoke("missing", ["abc"], "fallback")).toBe("fallback");
    });

    it("dependency logger prefers injected loggers, then host console, then global console", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const calls = [];
        moduleApi.createDependencyLogger({ logWarn: (...a) => calls.push(["logWarn", ...a]), consoleWarn: () => calls.push(["consoleWarn"]) })("w1");
        moduleApi.createDependencyLogger({ consoleWarn: (...a) => calls.push(["consoleWarn", ...a]) })("w2");
        moduleApi.createDependencyLogger({ logError: (...a) => calls.push(["logError", ...a]) }, "error")("e1");
        moduleApi.createDependencyLogger({ consoleError: (...a) => calls.push(["consoleError", ...a]) }, "error")("e2");
        const host = { console: { warn: (...a) => calls.push(["hostWarn", ...a]), error: (...a) => calls.push(["hostError", ...a]) } };
        moduleApi.createDependencyLogger({}, "warn", host)("w3");
        moduleApi.createDependencyLogger(null, "error", host)("e3");
        expect(calls).toEqual([
            ["logWarn", "w1"],
            ["consoleWarn", "w2"],
            ["logError", "e1"],
            ["consoleError", "e2"],
            ["hostWarn", "w3"],
            ["hostError", "e3"]
        ]);
    });

    it("createRequiredModuleService validates the module API and required methods", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const received = [];
        const goodModule = { createService: (deps) => { received.push(deps); return { run: () => 1, stop: () => 2 }; } };
        const service = moduleApi.createRequiredModuleService(goodModule, "GTVGood", { a: 1 }, ["run", "stop"], "bad");
        expect(service.run()).toBe(1);
        expect(received).toEqual([{ a: 1 }]);
        expect(() => moduleApi.createRequiredModuleService(null, "GTVMissing", {}, [], "bad"))
            .toThrow("Missing required module API: GTVMissing.createService");
        expect(() => moduleApi.createRequiredModuleService({ createService: () => ({ run: () => 1 }) }, "GTVPartial", {}, ["run", "stop"], "Invalid partial"))
            .toThrow("Invalid partial");
        expect(() => moduleApi.createRequiredModuleService({ createService: () => null }, "GTVNull", {}))
            .toThrow("Invalid GTVNull service");
    });

    it("late-bound forwarders resolve the service per call and name the missing method", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        let service = null;
        const forwarders = moduleApi.createLateBoundForwarders(() => service, "exampleService", ["sum", "echo"]);
        expect(Object.isFrozen(forwarders)).toBe(true);
        expect(Object.keys(forwarders)).toEqual(["sum", "echo"]);
        expect(() => forwarders.sum(1, 2)).toThrow("Missing required module API: exampleService.sum");
        service = { sum: (a, b = 10) => a + b, echo: (...args) => args };
        expect(forwarders.sum(1, 2)).toBe(3);
        expect(forwarders.sum(1)).toBe(11);
        expect(forwarders.echo("a", "b")).toEqual(["a", "b"]);
        service = { sum: 3 };
        expect(() => forwarders.echo()).toThrow("Missing required module API: exampleService.echo");
        expect(() => forwarders.sum()).toThrow("Missing required module API: exampleService.sum");
        expect(() => moduleApi.createLateBoundForwarders(null, "noGetter", ["x"]).x())
            .toThrow("Missing required module API: noGetter.x");
        expect(moduleApi.createLateBoundForwarders(() => service, "empty")).toEqual({});
    });

    it("safe callables no-op for missing deps and log thrown errors with the module tag", () => {
        const moduleApi = loadServiceInvokeUtilsModule();
        const logs = [];
        const toSafeCallable = moduleApi.createSafeCallableFactory("GTVExample", (...a) => logs.push(a));
        const boom = new Error("boom");
        const picked = moduleApi.pickSafeCallables({
            ok: (x) => x * 2,
            bad: () => { throw boom; },
            notFn: 3
        }, ["ok", "bad", "notFn", "missing"], toSafeCallable);

        expect(picked.ok(4)).toBe(8);
        expect(picked.bad()).toBeUndefined();
        expect(picked.notFn()).toBeUndefined();
        expect(picked.missing()).toBeUndefined();
        expect(logs).toEqual([['[GTVExample] Dependency "bad" threw.', boom]]);
        expect(moduleApi.pickSafeCallables(null, null, toSafeCallable)).toEqual({});
    });
});
