(function initGtvAppFeedback(globalObj) {
    "use strict";

    const BOOTSTRAP_ERROR_LOG_KEY = "GTV_BOOTSTRAP_ERRORS";
    const MAX_BOOTSTRAP_ERROR_LOGS = 10;

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const boundClickHandlers = new WeakMap();
        const logger = (typeof safeDeps.logError === "function")
            ? safeDeps.logError
            : (typeof safeDeps.consoleError === "function")
                ? safeDeps.consoleError
            : ((...args) => {
                if (typeof globalObj?.console?.error === "function") {
                    globalObj.console.error(...args);
                    return;
                }
                if (typeof console === "object" && console && typeof console.error === "function") {
                    console.error(...args);
                }
            });

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
            t: toSafeCallable(safeDeps.t)
        });

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
            return (typeof document === "object" && document) ? document : null;
        }

        function getLocationRef() {
            if (typeof safeDeps.getLocationRef === "function") {
                const injected = safeDeps.getLocationRef();
                if (injected && typeof injected.reload === "function") return injected;
            }
            if (typeof safeDeps.getLocationRefOrNull === "function") {
                const injected = safeDeps.getLocationRefOrNull();
                if (injected && typeof injected.reload === "function") return injected;
            }
            if (safeDeps.locationRef && typeof safeDeps.locationRef.reload === "function") {
                return safeDeps.locationRef;
            }
            if (safeDeps.location && typeof safeDeps.location.reload === "function") {
                return safeDeps.location;
            }
            if (globalObj?.location && typeof globalObj.location.reload === "function") {
                return globalObj.location;
            }
            return (typeof location === "object" && typeof location.reload === "function") ? location : null;
        }

        function getStorageRef() {
            if (
                safeDeps.storageRef
                && typeof safeDeps.storageRef.getItem === "function"
                && typeof safeDeps.storageRef.setItem === "function"
            ) {
                return safeDeps.storageRef;
            }
            if (
                safeDeps.storage
                && typeof safeDeps.storage.getItem === "function"
                && typeof safeDeps.storage.setItem === "function"
            ) {
                return safeDeps.storage;
            }
            if (
                globalObj?.localStorage
                && typeof globalObj.localStorage.getItem === "function"
                && typeof globalObj.localStorage.setItem === "function"
            ) {
                return globalObj.localStorage;
            }
            if (
                typeof localStorage === "object"
                && localStorage
                && typeof localStorage.getItem === "function"
                && typeof localStorage.setItem === "function"
            ) {
                return localStorage;
            }
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
            if (safeDeps.navigatorRef && typeof safeDeps.navigatorRef === "object") {
                return safeDeps.navigatorRef;
            }
            if (safeDeps.navigator && typeof safeDeps.navigator === "object") {
                return safeDeps.navigator;
            }
            if (globalObj?.navigator && typeof globalObj.navigator === "object") {
                return globalObj.navigator;
            }
            return (typeof navigator === "object" && navigator) ? navigator : null;
        }

        function translate(key, fallbackText = "") {
            const translated = dep.t(key);
            if (typeof translated === "string" && translated.trim()) return translated;
            return String(fallbackText || key || "");
        }

        function getUserAgent() {
            const navigatorRef = getNavigatorRef();
            if (typeof navigatorRef?.userAgent === "string") return navigatorRef.userAgent;
            return "";
        }

        async function writeClipboardText(text) {
            if (typeof safeDeps.writeClipboard === "function") {
                return await safeDeps.writeClipboard(text);
            }
            const clipboard = getNavigatorRef()?.clipboard;
            if (clipboard && typeof clipboard.writeText === "function") {
                return await clipboard.writeText(text);
            }
            throw new Error("Clipboard API unavailable");
        }

        function logFatalError(err, errorRecord = null) {
            logger("FATAL ERROR during app initialization:", err, ...(errorRecord ? [errorRecord] : []));
        }

        function classifyFatalErrorType(err) {
            const message = String(err?.message || "").toLowerCase();
            if (message.includes("missing required module") || message.includes("missing required services")) {
                return "module_load";
            }
            if (message.includes("storage") || message.includes("persist") || message.includes("quota")) {
                return "persistence";
            }
            if (message.includes("state")) {
                return "state_init";
            }
            return "unknown";
        }

        function getFatalErrorDescKey(type) {
            switch (type) {
                case "module_load":
                    return "error_fatal_desc_module_load";
                case "persistence":
                    return "error_fatal_desc_persistence";
                case "state_init":
                    return "error_fatal_desc_state";
                default:
                    return "error_fatal_desc";
            }
        }

        function createFatalErrorCode(type) {
            const safeType = String(type || "unknown")
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 12) || "UNKNOWN";
            const timestampToken = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
            const randomToken = Math.random().toString(36).slice(2, 8).toUpperCase();
            return `GTV-${safeType}-${timestampToken}-${randomToken}`;
        }

        function buildFatalErrorRecord(err) {
            const errorObj = (err && typeof err === "object") ? err : new Error(String(err || "Unknown error"));
            const type = classifyFatalErrorType(errorObj);
            const message = (typeof errorObj.message === "string" && errorObj.message.trim())
                ? errorObj.message.trim()
                : "Unknown error";
            return {
                errorCode: createFatalErrorCode(type),
                type,
                message,
                name: (typeof errorObj.name === "string" && errorObj.name) ? errorObj.name : "Error",
                stack: (typeof errorObj.stack === "string") ? errorObj.stack : "",
                timestamp: new Date().toISOString(),
                userAgent: getUserAgent()
            };
        }

        function storeFatalErrorRecord(errorRecord) {
            const storageRef = getStorageRef();
            if (!storageRef || !errorRecord || typeof errorRecord !== "object") return;

            try {
                const raw = storageRef.getItem(BOOTSTRAP_ERROR_LOG_KEY);
                const parsed = JSON.parse(raw || "[]");
                const logs = Array.isArray(parsed) ? parsed : [];
                logs.push(errorRecord);
                const trimmed = logs.slice(-MAX_BOOTSTRAP_ERROR_LOGS);
                storageRef.setItem(BOOTSTRAP_ERROR_LOG_KEY, JSON.stringify(trimmed));
            } catch (_storageErr) {
                // Ignore storage failures and continue with UI fallback.
            }
        }

        function setLocalizedText(element, key, fallbackText) {
            if (!element || typeof element !== "object") return;
            if (typeof key === "string" && key) {
                if (typeof element.setAttribute === "function") {
                    element.setAttribute("data-i18n", key);
                }
                const translated = translate(key, "");
                if (translated) {
                    element.textContent = translated;
                    return;
                }
            }
            element.textContent = String(fallbackText || "");
        }

        function bindClickHandler(button, handler) {
            if (!button || typeof button !== "object" || typeof handler !== "function") return;
            if (typeof button.addEventListener === "function") {
                const prevHandler = boundClickHandlers.get(button);
                if (typeof prevHandler === "function" && typeof button.removeEventListener === "function") {
                    button.removeEventListener("click", prevHandler);
                }
                boundClickHandlers.set(button, handler);
                button.addEventListener("click", handler);
                return;
            }
            button.onclick = handler;
        }

        function bindFatalResetButtonHandler(resetBtn) {
            bindClickHandler(resetBtn, async () => {
                if (typeof safeDeps.resetAllSettings === "function") {
                    const resetResult = await safeDeps.resetAllSettings();
                    if (resetResult === false) return;
                }
                const locationRef = getLocationRef();
                if (locationRef) locationRef.reload();
            });
        }

        function bindFatalRetryButtonHandler(retryBtn) {
            bindClickHandler(retryBtn, () => {
                const locationRef = getLocationRef();
                if (locationRef) locationRef.reload();
            });
        }

        function bindFatalCopyButtonHandler(copyBtn, errorCode) {
            bindClickHandler(copyBtn, async () => {
                try {
                    await writeClipboardText(String(errorCode || ""));
                    showToast(translate("toast_error_code_copied", "Error code copied."), { type: "success" });
                } catch (_err) {
                    // Clipboard can be unavailable in restricted contexts.
                }
            });
        }

        function showFatalError(err) {
            const errorRecord = buildFatalErrorRecord(err);
            logFatalError(err, errorRecord);
            storeFatalErrorRecord(errorRecord);

            const doc = getDocumentRef();
            if (!doc) return;

            const banner = doc.getElementById("fatal-error-banner");
            if (!banner) return;
            banner.style.display = "flex";

            const titleEl = doc.getElementById("fatal-error-title");
            setLocalizedText(titleEl, "error_fatal_title", "Application Initialization Failed");

            const descEl = doc.getElementById("fatal-error-desc");
            const descKey = getFatalErrorDescKey(errorRecord.type);
            setLocalizedText(descEl, descKey, "An error occurred while loading data.");

            const codeWrapEl = doc.getElementById("fatal-error-code-wrap");
            const codeEl = doc.getElementById("fatal-error-code");
            if (codeEl) codeEl.textContent = errorRecord.errorCode;
            if (codeWrapEl && codeEl && codeEl.textContent) {
                codeWrapEl.style.display = "flex";
            }

            const detailsEl = doc.getElementById("fatal-error-details-content");
            if (detailsEl) {
                detailsEl.textContent = JSON.stringify({
                    errorCode: errorRecord.errorCode,
                    type: errorRecord.type,
                    message: errorRecord.message,
                    timestamp: errorRecord.timestamp
                }, null, 2);
            }

            const retryBtn = doc.getElementById("fatal-error-retry-btn");
            bindFatalRetryButtonHandler(retryBtn);

            const resetBtn = doc.getElementById("fatal-error-reset-btn");
            bindFatalResetButtonHandler(resetBtn);

            const copyBtn = doc.getElementById("fatal-error-copy-btn");
            bindFatalCopyButtonHandler(copyBtn, errorRecord.errorCode);
        }

        function showToast(message, options = {}) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return;
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
