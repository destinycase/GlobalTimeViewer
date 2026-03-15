(function initGtvCalculatorActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function getCalculatorApi() {
            if (safeDeps.GTV_CALCULATOR && typeof safeDeps.GTV_CALCULATOR === "object") {
                return safeDeps.GTV_CALCULATOR;
            }
            if (globalObj && typeof globalObj.GTVCalculator === "object") {
                return globalObj.GTVCalculator;
            }
            return null;
        }

        function getElementById(id) {
            if (typeof safeDeps.getElementById === "function") return safeDeps.getElementById(id);
            if (typeof document === "object" && document && typeof document.getElementById === "function") {
                return document.getElementById(id);
            }
            return null;
        }

        function getPeriodResultIdsSet() {
            const ids = safeDeps.PERIOD_RESULT_IDS;
            if (ids && typeof ids.has === "function") return ids;
            return null;
        }

        async function writeClipboard(text) {
            if (typeof safeDeps.writeClipboard === "function") {
                return await safeDeps.writeClipboard(text);
            }
            const clipboard = (typeof navigator === "object" && navigator && navigator.clipboard) ? navigator.clipboard : null;
            if (!clipboard || typeof clipboard.writeText !== "function") {
                throw new Error("Clipboard API unavailable");
            }
            return await clipboard.writeText(text);
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function showToastMessage(message, options = {}) {
            invokeDep("showToast", message, options);
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
