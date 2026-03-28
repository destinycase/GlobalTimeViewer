import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-bootstrap-guard.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainBootstrapGuardModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainBootstrapGuard", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainBootstrapGuard || globalThis.GTVMainBootstrapGuard;
}

describe("GTV main bootstrap guard module", () => {
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

    it("throws when required bootstrap service methods are missing", () => {
        const moduleApi = loadMainBootstrapGuardModule();
        const services = {
            persistenceService: { loadPersistence() {} },
            mainUiInitService: {}
        };
        const service = moduleApi.createService({
            resolveServiceRef: (serviceName) => services[serviceName] ?? null,
            getServiceMethod: (_serviceName, serviceRef, methodName) => {
                if (serviceRef && typeof serviceRef[methodName] === "function") {
                    return serviceRef[methodName].bind(serviceRef);
                }
                return null;
            },
            requiredSpecs: [
                { serviceName: "persistenceService", methodName: "loadPersistence" },
                { serviceName: "mainUiInitService", methodName: "initUI" }
            ]
        });

        expect(() => service.assertRequiredServices()).toThrow(
            "[GTV] Missing required services at bootstrap: mainUiInitService.initUI"
        );
    });

    it("asserts once and skips repeat checks after success", () => {
        const moduleApi = loadMainBootstrapGuardModule();
        const services = {
            persistenceService: {
                loadPersistence() {},
                savePersistence() {}
            }
        };
        const getServiceMethod = vi.fn((_serviceName, serviceRef, methodName) => {
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName].bind(serviceRef);
            }
            return null;
        });
        const service = moduleApi.createService({
            resolveServiceRef: (serviceName) => services[serviceName] ?? null,
            getServiceMethod,
            requiredSpecs: [
                { serviceName: "persistenceService", methodName: "loadPersistence" },
                { serviceName: "persistenceService", methodName: "savePersistence" }
            ]
        });

        service.assertRequiredServices();
        service.assertRequiredServices();

        expect(getServiceMethod).toHaveBeenCalledTimes(2);
    });

    it("resolves service refs from serviceGetters when resolveServiceRef is omitted", () => {
        const moduleApi = loadMainBootstrapGuardModule();
        const services = {
            persistenceService: {
                loadPersistence() {}
            }
        };
        const getServiceMethod = vi.fn((_serviceName, serviceRef, methodName) => {
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName].bind(serviceRef);
            }
            return null;
        });
        const service = moduleApi.createService({
            serviceGetters: {
                persistenceService: () => services.persistenceService
            },
            getServiceMethod,
            requiredSpecs: [
                { serviceName: "persistenceService", methodName: "loadPersistence" }
            ]
        });

        expect(() => service.assertRequiredServices()).not.toThrow();
        expect(getServiceMethod).toHaveBeenCalledWith(
            "persistenceService",
            services.persistenceService,
            "loadPersistence",
            { toastOnMissing: false }
        );
    });
});
