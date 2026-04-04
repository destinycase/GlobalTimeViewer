(function initGtvMainModuleResolver(globalObj) {
    "use strict";

    function buildMissingError(label, requiredMethod = "") {
        if (requiredMethod) {
            return `Missing required module API: ${label}.${requiredMethod}`;
        }
        return `Missing required module: ${label}`;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getRootObject() {
            if (safeDeps.rootRef && typeof safeDeps.rootRef === "object") return safeDeps.rootRef;
            if (safeDeps.windowRef && typeof safeDeps.windowRef === "object") return safeDeps.windowRef;
            if (typeof window !== "undefined" && window) return window;
            if (typeof globalThis !== "undefined" && globalThis) return globalThis;
            return globalObj || {};
        }

        function resolveModule(globalName, options = {}) {
            const root = getRootObject();
            const safeName = (typeof globalName === "string") ? globalName.trim() : "";
            const safeOptions = (options && typeof options === "object") ? options : {};
            const errorLabel = (typeof safeOptions.errorLabel === "string" && safeOptions.errorLabel.trim())
                ? safeOptions.errorLabel.trim()
                : safeName;
            const requiredMethod = (typeof safeOptions.requiredMethod === "string" && safeOptions.requiredMethod.trim())
                ? safeOptions.requiredMethod.trim()
                : "";
            const isOptional = !!safeOptions.optional;
            const resolved = root[safeName];

            if (resolved === undefined || resolved === null) {
                if (isOptional) return null;
                throw new Error(buildMissingError(errorLabel, requiredMethod));
            }

            if (requiredMethod && typeof resolved[requiredMethod] !== "function") {
                throw new Error(buildMissingError(errorLabel, requiredMethod));
            }

            if (typeof safeOptions.validate === "function") {
                const isValid = !!safeOptions.validate(resolved);
                if (!isValid) {
                    throw new Error(
                        (typeof safeOptions.errorMessage === "string" && safeOptions.errorMessage.trim())
                            ? safeOptions.errorMessage.trim()
                            : buildMissingError(errorLabel, requiredMethod)
                    );
                }
            }

            return resolved;
        }

        function resolveModules(specMap = {}) {
            const safeSpecMap = (specMap && typeof specMap === "object") ? specMap : {};
            const resolvedModules = {};
            Object.keys(safeSpecMap).forEach((key) => {
                const rawSpec = safeSpecMap[key];
                const safeSpec = (rawSpec && typeof rawSpec === "object") ? rawSpec : {};
                const globalName = (typeof safeSpec.globalName === "string" && safeSpec.globalName.trim())
                    ? safeSpec.globalName.trim()
                    : key;
                resolvedModules[key] = resolveModule(globalName, safeSpec);
            });
            return Object.freeze(resolvedModules);
        }

        return Object.freeze({
            resolveModule,
            resolveModules
        });
    }

    const defaultService = createService();

    globalObj.GTVMainModuleResolver = Object.freeze({
        createService,
        resolveModule: defaultService.resolveModule,
        resolveModules: defaultService.resolveModules
    });
})(typeof window !== "undefined" ? window : globalThis);
