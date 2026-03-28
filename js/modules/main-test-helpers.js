(function initGtvMainTestHelpers(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getGlobalRef = (typeof safeDeps.getGlobalRef === "function")
            ? safeDeps.getGlobalRef
            : (() => ((typeof window !== "undefined" && window) ? window : globalThis));
        const resolveValue = (typeof safeDeps.resolveValue === "function")
            ? safeDeps.resolveValue
            : ((key) => {
                const globalRef = getGlobalRef();
                if (!globalRef || typeof globalRef !== "object") return null;
                return Object.prototype.hasOwnProperty.call(globalRef, key) ? globalRef[key] : null;
            });
        const isEnabled = (typeof safeDeps.isEnabled === "function")
            ? safeDeps.isEnabled
            : (() => {
                const globalRef = getGlobalRef();
                return !!globalRef?.__GTV_ENABLE_MAIN_TEST_HOOKS__;
            });

        function normalizeHookName(name) {
            const key = String(name || "");
            if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return "";
            return key;
        }

        function resolve(name) {
            const key = normalizeHookName(name);
            if (!key) return null;
            try {
                const value = resolveValue(key);
                return value === undefined ? null : value;
            } catch (_err) {
                return null;
            }
        }

        function invoke(name, ...args) {
            const candidate = resolve(name);
            if (typeof candidate !== "function") return undefined;
            return candidate(...args);
        }

        function install() {
            const globalRef = getGlobalRef();
            if (!globalRef || typeof globalRef !== "object") return false;
            if (!isEnabled()) return false;
            globalRef.__GTVMainTestHooks = Object.freeze({
                resolve,
                invoke
            });
            return true;
        }

        return Object.freeze({
            normalizeHookName,
            resolve,
            invoke,
            install
        });
    }

    globalObj.GTVMainTestHelpers = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
