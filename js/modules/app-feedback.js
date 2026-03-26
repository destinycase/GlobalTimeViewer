(function initGtvAppFeedback(globalObj) {
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

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            return (typeof document === "object" && document) ? document : null;
        }

        function getLocationRef() {
            if (safeDeps.location && typeof safeDeps.location.reload === "function") {
                return safeDeps.location;
            }
            return (typeof location === "object" && typeof location.reload === "function") ? location : null;
        }

        function getConfirmFn() {
            if (typeof safeDeps.confirmFn === "function") return safeDeps.confirmFn;
            if (typeof confirm === "function") return confirm;
            return null;
        }

        function logFatalError(err) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError("FATAL ERROR during app initialization:", err);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error("FATAL ERROR during app initialization:", err);
            }
        }

        function getResetConfirmMessage() {
            const translated = invokeDep("t", "confirm_reset_all_settings");
            if (typeof translated === "string" && translated.trim()) return translated;
            return "Reset all settings?";
        }

        let boundResetButton = null;
        let boundResetHandler = null;

        function bindFatalResetButtonHandler(resetBtn) {
            if (!resetBtn || typeof resetBtn !== "object") return;

            const nextHandler = async () => {
                const confirmFn = getConfirmFn();
                const confirmMsg = getResetConfirmMessage();
                if (confirmFn && !confirmFn(confirmMsg)) return;
                if (typeof safeDeps.resetAllSettings === "function") {
                    await safeDeps.resetAllSettings();
                }
                const locationRef = getLocationRef();
                if (locationRef) locationRef.reload();
            };

            if (typeof resetBtn.addEventListener === "function") {
                if (
                    boundResetButton
                    && boundResetButton !== resetBtn
                    && typeof boundResetButton.removeEventListener === "function"
                    && typeof boundResetHandler === "function"
                ) {
                    boundResetButton.removeEventListener("click", boundResetHandler);
                }
                if (typeof boundResetHandler === "function" && typeof resetBtn.removeEventListener === "function") {
                    resetBtn.removeEventListener("click", boundResetHandler);
                }
                boundResetButton = resetBtn;
                boundResetHandler = nextHandler;
                resetBtn.addEventListener("click", boundResetHandler);
                return;
            }

            resetBtn.onclick = nextHandler;
        }

        function showFatalError(err) {
            logFatalError(err);
            const doc = getDocumentRef();
            if (!doc) return;
            const banner = doc.getElementById("fatal-error-banner");
            if (!banner) return;

            banner.style.display = "flex";
            const resetBtn = doc.getElementById("fatal-error-reset-btn");
            if (!resetBtn) return;
            bindFatalResetButtonHandler(resetBtn);
        }

        function showToast(message, options = {}) {
            const doc = getDocumentRef();
            if (!doc) return;
            const container = doc.getElementById("toast-container");
            if (!container) return;
            const text = (typeof message === "string") ? message.trim() : "";
            if (!text) return;

            const safeType = (typeof options.type === "string" && options.type.trim())
                ? options.type.trim().toLowerCase()
                : "info";
            const toastType = ["success", "error", "info", "loading"].includes(safeType) ? safeType : "info";
            const parsedDuration = Number.parseInt(options.duration, 10);
            const duration = Number.isFinite(parsedDuration) ? Math.max(400, parsedDuration) : 3000;
            const iconMap = {
                success: "OK",
                error: "!",
                info: "i",
                loading: "..."
            };
            const iconText = (typeof options.icon === "string" && options.icon.trim())
                ? options.icon.trim()
                : iconMap[toastType];

            const toast = doc.createElement("div");
            toast.className = `toast ${toastType}`;

            const iconEl = doc.createElement("span");
            iconEl.className = "toast-icon";
            iconEl.textContent = iconText;

            const textEl = doc.createElement("span");
            textEl.className = "toast-text";
            textEl.textContent = text;

            toast.appendChild(iconEl);
            toast.appendChild(textEl);

            container.appendChild(toast);

            const dismiss = () => {
                if (toast.isConnected === false) return;
                toast.classList.add("out");
                if (typeof setTimeout === "function") {
                    setTimeout(() => toast.remove(), 500);
                } else {
                    toast.remove();
                }
            };

            if (typeof setTimeout === "function") {
                setTimeout(dismiss, duration);
            }
            return { dismiss, element: toast };
        }

        return Object.freeze({
            showFatalError,
            showToast
        });
    }

    globalObj.GTVAppFeedback = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
