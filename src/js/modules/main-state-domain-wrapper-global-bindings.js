(function initGtvMainStateDomainWrapperGlobalBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getGlobalRoot = (typeof safeDeps.getGlobalRoot === "function")
            ? safeDeps.getGlobalRoot
            : (() => ((typeof window !== "undefined" && window) ? window : globalThis));

        function applyBindings(sourceBindings, options = {}) {
            const source = (sourceBindings && typeof sourceBindings === "object") ? sourceBindings : {};
            const safeOptions = (options && typeof options === "object") ? options : {};
            const excludeKeys = Array.isArray(safeOptions.excludeKeys) ? safeOptions.excludeKeys : [];
            const excluded = new Set(excludeKeys.map((key) => String(key)));
            const globalRoot = getGlobalRoot();
            if (!globalRoot || (typeof globalRoot !== "object" && typeof globalRoot !== "function")) {
                return 0;
            }

            let appliedCount = 0;
            for (const [key, value] of Object.entries(source)) {
                if (excluded.has(key)) continue;
                try {
                    globalRoot[key] = value;
                    appliedCount += 1;
                } catch (_error) {
                    // no-op in read-only global contexts (tests/sandboxes)
                }
            }
            return appliedCount;
        }

        return Object.freeze({
            applyBindings
        });
    }

    globalObj.GTVMainStateDomainWrapperGlobalBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
