(function initGtvMainRuntimeLangState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const globalRef = (safeDeps.globalRef && typeof safeDeps.globalRef === "object")
            ? safeDeps.globalRef
            : ((typeof window !== "undefined" && window) ? window : globalThis);
        const defaultLang = String(safeDeps.defaultLang || "ko").trim() || "ko";
        let currentLang = defaultLang;

        function syncRealtimeFlagToGlobal(value) {
            try {
                globalRef.isRealtime = !!value;
            } catch (_error) {
                // noop: non-writable global in sandbox/test environments
            }
            return !!value;
        }

        function getRuntimeCurrentLangValue() {
            const runtimeLang = (typeof globalRef.currentLang === "string" && globalRef.currentLang.trim())
                ? globalRef.currentLang
                : "";
            if (runtimeLang) {
                currentLang = runtimeLang;
                return runtimeLang;
            }
            return (typeof currentLang === "string" && currentLang.trim()) ? currentLang : defaultLang;
        }

        function syncCurrentLang(next) {
            const normalized = String(next ?? "").trim() || defaultLang;
            currentLang = normalized;
            try {
                globalRef.currentLang = normalized;
            } catch (_error) {
                // noop: non-writable global in sandbox/test environments
            }
            return currentLang;
        }

        return Object.freeze({
            syncRealtimeFlagToGlobal,
            getRuntimeCurrentLangValue,
            syncCurrentLang
        });
    }

    globalObj.GTVMainRuntimeLangState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
