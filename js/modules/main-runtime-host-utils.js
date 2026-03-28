(function initGtvMainRuntimeHostUtils(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const appDisplayName = String(safeDeps.appDisplayName || "Global Time Viewer");
        const version = String(safeDeps.version || "");
        const getGlobalRef = (typeof safeDeps.getGlobalRef === "function")
            ? safeDeps.getGlobalRef
            : (() => ((typeof window !== "undefined" && window) ? window : globalThis));
        const getDocumentRef = (typeof safeDeps.getDocumentRef === "function")
            ? safeDeps.getDocumentRef
            : (() => ((typeof document === "object" && document) ? document : null));
        const getWindowRef = (typeof safeDeps.getWindowRef === "function")
            ? safeDeps.getWindowRef
            : (() => ((typeof window === "object" && window) ? window : null));
        const getLocationRef = (typeof safeDeps.getLocationRef === "function")
            ? safeDeps.getLocationRef
            : (() => ((typeof location === "object" && location) ? location : null));
        const getGlobalThisRef = (typeof safeDeps.getGlobalThisRef === "function")
            ? safeDeps.getGlobalThisRef
            : (() => ((typeof globalThis === "object" && globalThis) ? globalThis : null));
        const getCryptoRef = (typeof safeDeps.getCryptoRef === "function")
            ? safeDeps.getCryptoRef
            : (() => ((typeof crypto !== "undefined" && crypto) ? crypto : null));
        const nowFn = (typeof safeDeps.nowFn === "function")
            ? safeDeps.nowFn
            : (() => Date.now());
        const setIntervalFn = (typeof safeDeps.setIntervalFn === "function")
            ? safeDeps.setIntervalFn
            : ((cb, ms) => setInterval(cb, ms));
        const clearIntervalFn = (typeof safeDeps.clearIntervalFn === "function")
            ? safeDeps.clearIntervalFn
            : ((id) => clearInterval(id));

        function applyVersionBranding() {
            const documentRef = getDocumentRef();
            if (!documentRef) return;
            const titleText = `${appDisplayName} v${version}`;
            documentRef.title = titleText;
            const badge = (typeof documentRef.getElementById === "function")
                ? documentRef.getElementById("version-badge")
                : null;
            if (badge) badge.textContent = `ver ${version}`;
            const logoTitle = (typeof documentRef.querySelector === "function")
                ? documentRef.querySelector(".logo-text h1")
                : null;
            if (logoTitle) logoTitle.textContent = appDisplayName;
        }

        function createCanvasSafely() {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") {
                return null;
            }
            return documentRef.createElement("canvas");
        }

        function getRandomUUIDSafely() {
            const cryptoRef = getCryptoRef();
            if (cryptoRef && typeof cryptoRef.randomUUID === "function") {
                return cryptoRef.randomUUID();
            }
            return "";
        }

        function getDocumentRefOrNull() {
            return getDocumentRef();
        }

        function getWindowRefOrNull() {
            return getWindowRef();
        }

        function getLocationRefOrNull() {
            return getLocationRef();
        }

        function getGlobalThisRefOrNull() {
            return getGlobalThisRef();
        }

        function getLuxonGlobalRef() {
            const globalRef = getGlobalRef();
            return globalRef ? globalRef.luxon : undefined;
        }

        function getComputedStyleSafely(target) {
            const globalRef = getGlobalRef();
            if (globalRef && typeof globalRef.getComputedStyle === "function") {
                try {
                    return globalRef.getComputedStyle(target);
                } catch (_error) {
                    // noop: fallback below
                }
            }
            return {
                fontStyle: "",
                fontWeight: "",
                fontSize: "14px",
                fontFamily: "sans-serif"
            };
        }

        function getRuntimeNowMs() {
            return nowFn();
        }

        function setRuntimeInterval(cb, ms) {
            if (typeof cb !== "function") return null;
            return setIntervalFn(cb, ms);
        }

        function clearRuntimeInterval(id) {
            if (id === null || id === undefined) return;
            clearIntervalFn(id);
        }

        function deferDynamicCall(getFn) {
            return (...args) => getFn()(...args);
        }

        return Object.freeze({
            applyVersionBranding,
            createCanvasSafely,
            getRandomUUIDSafely,
            getDocumentRefOrNull,
            getWindowRefOrNull,
            getLocationRefOrNull,
            getGlobalThisRefOrNull,
            getLuxonGlobalRef,
            getComputedStyleSafely,
            getRuntimeNowMs,
            setRuntimeInterval,
            clearRuntimeInterval,
            deferDynamicCall
        });
    }

    globalObj.GTVMainRuntimeHostUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
