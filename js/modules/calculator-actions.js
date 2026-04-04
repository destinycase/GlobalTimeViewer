(function initGtvCalculatorActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function toSafeCallable(depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (_err) {
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            t: toSafeCallable(safeDeps.t),
            showToast: toSafeCallable(safeDeps.showToast)
        });

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof safeDeps.consoleError === "function") {
                safeDeps.consoleError(...args);
                return;
            }
            if (typeof globalObj?.console?.error === "function") {
                globalObj.console.error(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function getWindowRef() {
            if (typeof safeDeps.getWindowRef === "function") {
                const injected = safeDeps.getWindowRef();
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getWindowRefOrNull === "function") {
                const injected = safeDeps.getWindowRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.windowRef && typeof safeDeps.windowRef === "object") return safeDeps.windowRef;
            if (safeDeps.window && typeof safeDeps.window === "object") return safeDeps.window;
            if (globalObj?.window && typeof globalObj.window === "object") return globalObj.window;
            if (typeof window === "object" && window) return window;
            return globalObj;
        }

        function getCalculatorApi() {
            if (safeDeps.GTV_CALCULATOR && typeof safeDeps.GTV_CALCULATOR === "object") {
                return safeDeps.GTV_CALCULATOR;
            }
            const windowRef = getWindowRef();
            if (windowRef && typeof windowRef.GTVCalculator === "object") {
                return windowRef.GTVCalculator;
            }
            return null;
        }

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef.getElementById === "function") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document.getElementById === "function") {
                return globalObj.document;
            }
            if (typeof document === "object" && document && typeof document.getElementById === "function") {
                return document;
            }
            return null;
        }

        function getElementById(id) {
            if (typeof safeDeps.getElementById === "function") return safeDeps.getElementById(id);
            return getDocumentRef()?.getElementById(id) ?? null;
        }

        function getPeriodResultIdsSet() {
            const ids = safeDeps.PERIOD_RESULT_IDS;
            if (ids && typeof ids.has === "function") return ids;
            return null;
        }

        function getNavigatorRef() {
            if (typeof safeDeps.getNavigatorRef === "function") {
                const injected = safeDeps.getNavigatorRef();
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getNavigatorRefOrNull === "function") {
                const injected = safeDeps.getNavigatorRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.navigatorRef && typeof safeDeps.navigatorRef === "object") return safeDeps.navigatorRef;
            if (safeDeps.navigator && typeof safeDeps.navigator === "object") return safeDeps.navigator;
            if (globalObj?.navigator && typeof globalObj.navigator === "object") return globalObj.navigator;
            if (typeof navigator === "object" && navigator) return navigator;
            return null;
        }

        async function writeClipboard(text) {
            if (typeof safeDeps.writeClipboard === "function") {
                return await safeDeps.writeClipboard(text);
            }
            const navigatorRef = getNavigatorRef();
            const clipboard = navigatorRef?.clipboard ?? null;
            if (!clipboard || typeof clipboard.writeText !== "function") {
                throw new Error("Clipboard API unavailable");
            }
            return await clipboard.writeText(text);
        }

        function translate(key) {
            const value = dep.t(key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function showToastMessage(message, options = {}) {
            dep.showToast(message, options);
        }

        async function copyText(elementId, isInput = false) {
            const el = getElementById(elementId);
            if (!el) return;

            const sourceText = isInput ? (el.value || "") : (el.textContent || "");
            let text = String(sourceText).trim();
            const periodResultIds = getPeriodResultIdsSet();
            if (!isInput && periodResultIds && periodResultIds.has(elementId)) {
                const matchedNumber = text.match(/-?\d+(\.\d+)?/);
                text = matchedNumber ? matchedNumber[0] : "";
            }
            if (!text) return;

            try {
                await writeClipboard(text);
                showToastMessage(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyText failed:", err);
                showToastMessage(translate("toast_copy_failed"), { type: "error" });
            }
        }

        function initCalculators() {
            const api = getCalculatorApi();
            if (!api || typeof api.initCalculators !== "function") {
                logError("Missing required module API: GTVCalculator.initCalculators");
                return;
            }
            api.initCalculators({
                t: (key) => translate(key),
                copyText
            });
        }

        return Object.freeze({
            initCalculators,
            copyText
        });
    }

    globalObj.GTVCalculatorActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
