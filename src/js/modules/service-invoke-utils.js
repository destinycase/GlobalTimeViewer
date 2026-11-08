(function initGtvServiceInvokeUtils(globalObj) {
    "use strict";

    function resolveService(getter) {
        if (typeof getter !== "function") return null;
        const service = getter();
        return (service && typeof service === "object") ? service : null;
    }

    function invokeServiceMethod(service, methodName, args = [], fallback = undefined) {
        if (!service || typeof service[methodName] !== "function") return fallback;
        return service[methodName](...args);
    }

    function invokeGetterMethod(getter, methodName, args = [], fallback = undefined) {
        return invokeServiceMethod(resolveService(getter), methodName, args, fallback);
    }

    function createGetterMethodInvoker(getter) {
        return (methodName, args = [], fallback = undefined) =>
            invokeGetterMethod(getter, methodName, args, fallback);
    }

    const LOGGER_DEP_KEYS = Object.freeze({
        warn: ["logWarn", "consoleWarn"],
        error: ["logError", "consoleError"]
    });

    /**
     * Returns a log function for a module's dependency bag. Order: injected
     * logWarn/logError, injected consoleWarn/consoleError, the host's console, the global console.
     */
    function createDependencyLogger(deps = {}, level = "warn", hostRef = globalObj) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const isError = level === "error";
        const [primaryKey, consoleKey] = isError ? LOGGER_DEP_KEYS.error : LOGGER_DEP_KEYS.warn;
        const writeConsole = (consoleRef, args) => {
            if (!consoleRef || typeof consoleRef !== "object") return false;
            if (isError && typeof consoleRef.error === "function") {
                consoleRef.error(...args);
                return true;
            }
            if (!isError && typeof consoleRef.warn === "function") {
                consoleRef.warn(...args);
                return true;
            }
            return false;
        };
        return (...args) => {
            if (typeof safeDeps[primaryKey] === "function") {
                safeDeps[primaryKey](...args);
                return;
            }
            if (typeof safeDeps[consoleKey] === "function") {
                safeDeps[consoleKey](...args);
                return;
            }
            if (writeConsole(hostRef?.console, args)) return;
            writeConsole(typeof console === "object" ? console : null, args);
        };
    }

    /**
     * Returns toSafeCallable(depName, depFn): a missing dependency becomes a no-op and a
     * throwing one is logged as `[moduleTag] Dependency "<name>" threw.` and returns undefined.
     */
    function createSafeCallableFactory(moduleTag, log) {
        const safeLog = (typeof log === "function") ? log : () => {};
        return function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    safeLog(`[${moduleTag}] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        };
    }

    function pickSafeCallables(deps, keys, toSafeCallable) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        return (Array.isArray(keys) ? keys : []).reduce((acc, key) => {
            acc[key] = toSafeCallable(key, safeDeps[key]);
            return acc;
        }, {});
    }

    /**
     * Creates a service from a module API and checks the methods the caller relies on.
     * Replaces the former single-module *-bindings wrappers and keeps their error messages:
     * `Missing required module API: <moduleName>.createService` and the given invalidMessage.
     */
    function createRequiredModuleService(moduleApi, moduleName, deps, requiredMethods = [], invalidMessage = "") {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${moduleName}.createService`);
        }
        const service = moduleApi.createService(deps);
        if (
            !service
            || typeof service !== "object"
            || (Array.isArray(requiredMethods) ? requiredMethods : []).some((name) => typeof service[name] !== "function")
        ) {
            throw new Error(invalidMessage || `Invalid ${moduleName} service`);
        }
        return service;
    }

    /**
     * Returns a frozen object with one function per method name. Each call looks the service up
     * through getService at call time (the service may be created later) and throws
     * `Missing required module API: <serviceLabel>.<methodName>` when the method is missing.
     * Replaces the former single-service *-accessor-proxies modules.
     */
    function createLateBoundForwarders(getService, serviceLabel, methodNames = []) {
        const resolve = (typeof getService === "function") ? getService : (() => null);
        const forwarders = {};
        (Array.isArray(methodNames) ? methodNames : []).forEach((methodName) => {
            forwarders[methodName] = (...args) => {
                const service = resolve();
                if (!service || typeof service[methodName] !== "function") {
                    throw new Error(`Missing required module API: ${serviceLabel}.${methodName}`);
                }
                return service[methodName](...args);
            };
        });
        return Object.freeze(forwarders);
    }

    function createService(_deps = {}) {
        return Object.freeze({
            resolveService,
            invokeServiceMethod,
            invokeGetterMethod,
            createGetterMethodInvoker,
            createDependencyLogger,
            createSafeCallableFactory,
            pickSafeCallables,
            createRequiredModuleService,
            createLateBoundForwarders
        });
    }

    const defaultService = createService();

    globalObj.GTVServiceInvokeUtils = Object.freeze({
        createService,
        resolveService: defaultService.resolveService,
        invokeServiceMethod: defaultService.invokeServiceMethod,
        invokeGetterMethod: defaultService.invokeGetterMethod,
        createGetterMethodInvoker: defaultService.createGetterMethodInvoker,
        createDependencyLogger: defaultService.createDependencyLogger,
        createSafeCallableFactory: defaultService.createSafeCallableFactory,
        pickSafeCallables: defaultService.pickSafeCallables,
        createRequiredModuleService: defaultService.createRequiredModuleService,
        createLateBoundForwarders: defaultService.createLateBoundForwarders
    });
})(typeof window !== "undefined" ? window : globalThis);
