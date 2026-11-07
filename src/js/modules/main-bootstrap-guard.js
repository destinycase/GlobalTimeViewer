(function initGtvMainBootstrapGuard(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const serviceGetters = (safeDeps.serviceGetters && typeof safeDeps.serviceGetters === "object")
            ? safeDeps.serviceGetters
            : null;
        const resolveServiceRef = (typeof safeDeps.resolveServiceRef === "function")
            ? safeDeps.resolveServiceRef
            : ((serviceName) => {
                if (!serviceGetters) return null;
                const key = String(serviceName || "");
                const resolver = serviceGetters[key];
                if (typeof resolver !== "function") return null;
                return resolver();
            });
        const getServiceMethod = (typeof safeDeps.getServiceMethod === "function")
            ? safeDeps.getServiceMethod
            : (() => null);
        const requiredSpecsRaw = Array.isArray(safeDeps.requiredSpecs)
            ? safeDeps.requiredSpecs
            : [];
        const errorPrefix = (typeof safeDeps.errorPrefix === "string" && safeDeps.errorPrefix.trim())
            ? safeDeps.errorPrefix
            : "[GTV] Missing required services at bootstrap: ";

        const requiredSpecs = requiredSpecsRaw
            .map((spec) => {
                if (!spec || typeof spec !== "object") return null;
                const serviceName = String(spec.serviceName || "").trim();
                const methodName = String(spec.methodName || "").trim();
                if (!serviceName || !methodName) return null;
                return { serviceName, methodName };
            })
            .filter(Boolean);

        let requiredServicesAsserted = false;

        function assertRequiredServices() {
            if (requiredServicesAsserted) return;
            const missing = [];
            requiredSpecs.forEach((spec) => {
                const serviceRef = resolveServiceRef(spec.serviceName);
                const method = getServiceMethod(
                    spec.serviceName,
                    serviceRef,
                    spec.methodName,
                    { toastOnMissing: false }
                );
                if (typeof method !== "function") {
                    missing.push(`${spec.serviceName}.${spec.methodName}`);
                }
            });
            if (missing.length) {
                throw new Error(`${errorPrefix}${missing.join(", ")}`);
            }
            requiredServicesAsserted = true;
        }

        function resetAssertion() {
            requiredServicesAsserted = false;
        }

        function getRequiredSpecs() {
            return requiredSpecs.map((spec) => ({ ...spec }));
        }

        return Object.freeze({
            assertRequiredServices,
            resetAssertion,
            getRequiredSpecs
        });
    }

    globalObj.GTVMainBootstrapGuard = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
