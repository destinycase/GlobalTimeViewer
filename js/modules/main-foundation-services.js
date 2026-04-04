(function initGtvMainFoundationServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function resolveWindowRef(explicitWindowRef = null, fallbackWindow = null) {
        if (explicitWindowRef && typeof explicitWindowRef === "object") return explicitWindowRef;
        if (fallbackWindow && typeof fallbackWindow === "object") return fallbackWindow;
        if (globalObj?.window && typeof globalObj.window === "object") return globalObj.window;
        if (typeof window === "object" && window) return window;
        if (globalObj && typeof globalObj === "object") return globalObj;
        return null;
    }

    function resolveDocumentRef(explicitDocumentRef = null, explicitDocument = null, windowRef = null) {
        if (explicitDocumentRef && typeof explicitDocumentRef.getElementById === "function") return explicitDocumentRef;
        if (explicitDocument && typeof explicitDocument.getElementById === "function") return explicitDocument;
        if (windowRef?.document && typeof windowRef.document.getElementById === "function") return windowRef.document;
        if (globalObj?.document && typeof globalObj.document.getElementById === "function") return globalObj.document;
        if (typeof document === "object" && document && typeof document.getElementById === "function") return document;
        return null;
    }

    function resolveLocationRef(explicitLocationRef = null, explicitLocation = null, windowRef = null) {
        if (explicitLocationRef && typeof explicitLocationRef === "object") return explicitLocationRef;
        if (explicitLocation && typeof explicitLocation === "object") return explicitLocation;
        if (windowRef?.location && typeof windowRef.location === "object") return windowRef.location;
        if (globalObj?.location && typeof globalObj.location === "object") return globalObj.location;
        if (typeof location === "object" && location) return location;
        return null;
    }

    function resolveNavigatorRef(explicitNavigatorRef = null, explicitNavigator = null, windowRef = null) {
        if (explicitNavigatorRef && typeof explicitNavigatorRef === "object") return explicitNavigatorRef;
        if (explicitNavigator && typeof explicitNavigator === "object") return explicitNavigator;
        if (windowRef?.navigator && typeof windowRef.navigator === "object") return windowRef.navigator;
        if (globalObj?.navigator && typeof globalObj.navigator === "object") return globalObj.navigator;
        if (typeof navigator === "object" && navigator) return navigator;
        return null;
    }

    function resolveClipboardRef(navigatorRef = null) {
        if (!navigatorRef || typeof navigatorRef !== "object") return null;
        return navigatorRef.clipboard || null;
    }

    function resolvePromptRef(explicitPrompt = null, windowRef = null) {
        if (typeof explicitPrompt === "function") return explicitPrompt;
        if (windowRef && typeof windowRef.prompt === "function") {
            return windowRef.prompt.bind(windowRef);
        }
        if (typeof globalObj?.prompt === "function") {
            return globalObj.prompt.bind(globalObj);
        }
        if (typeof prompt === "function") return prompt.bind(globalThis);
        if (typeof window === "object" && window && typeof window.prompt === "function") {
            return window.prompt.bind(window);
        }
        return null;
    }

    function resolveConfirmRef(explicitConfirm = null, windowRef = null) {
        if (typeof explicitConfirm === "function") return explicitConfirm;
        if (windowRef && typeof windowRef.confirm === "function") {
            return windowRef.confirm.bind(windowRef);
        }
        if (typeof globalObj?.confirm === "function") {
            return globalObj.confirm.bind(globalObj);
        }
        if (typeof confirm === "function") {
            return confirm.bind(globalThis);
        }
        return null;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const serviceBootstrapApi = requireCreateServiceModule(safeDeps.GTV_SERVICE_BOOTSTRAP, "GTVServiceBootstrap");
        const persistenceBundleApi = requireCreateServiceModule(safeDeps.GTV_PERSISTENCE_SERVICE_BUNDLE, "GTVPersistenceServiceBundle");
        const mainUiUtilsApi = requireCreateServiceModule(safeDeps.GTV_MAIN_UI_UTILS, "GTVMainUiUtils");
        const appFeedbackApi = requireCreateServiceModule(safeDeps.GTV_APP_FEEDBACK, "GTVAppFeedback");
        const calculatorActionsApi = requireCreateServiceModule(safeDeps.GTV_CALCULATOR_ACTIONS, "GTVCalculatorActions");

        const serviceBootstrap = serviceBootstrapApi.createService({
            GTV_TAB_UI: safeDeps.GTV_TAB_UI,
            GTV_TAB_ORCHESTRATOR: safeDeps.GTV_TAB_ORCHESTRATOR,
            GTV_GROUP_STATE: safeDeps.GTV_GROUP_STATE
        });
        const persistenceServiceBundleFactory = persistenceBundleApi.createService({
            GTV_STATE_PERSISTENCE: safeDeps.GTV_STATE_PERSISTENCE,
            GTV_SETTINGS_IO: safeDeps.GTV_SETTINGS_IO,
            GTV_DATA_TRANSFER: safeDeps.GTV_DATA_TRANSFER,
            GTV_UI_SETTINGS_ACTIONS: safeDeps.GTV_UI_SETTINGS_ACTIONS
        });

        const mainUiUtilsService = mainUiUtilsApi.createService();
        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const windowRef = resolveWindowRef(
            (typeof safeDeps.getWindowRef === "function") ? safeDeps.getWindowRef() : safeDeps.windowRef,
            safeDeps.window
        );
        const fallbackConfirmFn = resolveConfirmRef(safeDeps.confirm, windowRef);
        const confirmFn = (typeof safeDeps.confirmFn === "function")
            ? safeDeps.confirmFn
            : ((message) => {
                if (typeof fallbackConfirmFn === "function") {
                    return fallbackConfirmFn(message);
                }
                return true;
            });
        const promptOverride = (typeof safeDeps.promptFn === "function")
            ? safeDeps.promptFn
            : null;
        const fallbackPromptFn = promptOverride || resolvePromptRef(safeDeps.prompt, windowRef);
        const documentRef = Object.prototype.hasOwnProperty.call(safeDeps, "documentRef")
            ? safeDeps.documentRef
            : resolveDocumentRef(
                (typeof safeDeps.getDocumentRef === "function")
                    ? safeDeps.getDocumentRef()
                    : ((typeof safeDeps.getDocumentRefOrNull === "function")
                        ? safeDeps.getDocumentRefOrNull()
                        : null),
                safeDeps.document,
                windowRef
            );
        const locationRef = Object.prototype.hasOwnProperty.call(safeDeps, "locationRef")
            ? safeDeps.locationRef
            : resolveLocationRef(
                (typeof safeDeps.getLocationRef === "function")
                    ? safeDeps.getLocationRef()
                    : ((typeof safeDeps.getLocationRefOrNull === "function")
                        ? safeDeps.getLocationRefOrNull()
                        : null),
                safeDeps.location,
                windowRef
            );
        const navigatorRef = Object.prototype.hasOwnProperty.call(safeDeps, "navigatorRef")
            ? safeDeps.navigatorRef
            : resolveNavigatorRef(
                (typeof safeDeps.getNavigatorRef === "function")
                    ? safeDeps.getNavigatorRef()
                    : ((typeof safeDeps.getNavigatorRefOrNull === "function")
                        ? safeDeps.getNavigatorRefOrNull()
                        : null),
                safeDeps.navigator,
                windowRef
            );
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
        const writeClipboard = (typeof safeDeps.writeClipboard === "function")
            ? safeDeps.writeClipboard
            : (async (text) => {
                const clipboard = resolveClipboardRef(navigatorRef);
                if (!clipboard || typeof clipboard.writeText !== "function") {
                    throw new Error("Clipboard API unavailable");
                }
                return await clipboard.writeText(text);
            });
        const getElementById = (typeof safeDeps.getElementById === "function")
            ? safeDeps.getElementById
            : ((id) => {
                if (!documentRef || typeof documentRef.getElementById !== "function") return null;
                return documentRef.getElementById(id);
            });
        const t = (typeof safeDeps.t === "function") ? safeDeps.t : ((key) => key);
        const showToast = (typeof safeDeps.showToast === "function") ? safeDeps.showToast : (() => {});
        const periodResultIds = safeDeps.PERIOD_RESULT_IDS instanceof Set
            ? safeDeps.PERIOD_RESULT_IDS
            : new Set();
        let activePromptResolver = null;
        let activePromptCleanup = null;

        async function promptFn(message, defaultValue = "") {
            if (promptOverride) {
                return await promptOverride(message, defaultValue);
            }
            const overlay = documentRef?.getElementById?.("app-prompt-overlay");
            const title = documentRef?.getElementById?.("app-prompt-title");
            const input = documentRef?.getElementById?.("app-prompt-input");
            const confirmBtn = documentRef?.getElementById?.("app-prompt-confirm");
            const cancelBtn = documentRef?.getElementById?.("app-prompt-cancel");
            const closeBtn = documentRef?.getElementById?.("app-prompt-close");

            const canUseCustomPrompt = (
                overlay
                && title
                && input
                && confirmBtn
                && cancelBtn
                && closeBtn
                && typeof overlay.addEventListener === "function"
                && typeof overlay.removeEventListener === "function"
                && typeof input.addEventListener === "function"
                && typeof input.removeEventListener === "function"
                && typeof confirmBtn.addEventListener === "function"
                && typeof confirmBtn.removeEventListener === "function"
                && typeof cancelBtn.addEventListener === "function"
                && typeof cancelBtn.removeEventListener === "function"
                && typeof closeBtn.addEventListener === "function"
                && typeof closeBtn.removeEventListener === "function"
            );
            if (!canUseCustomPrompt) {
                if (typeof fallbackPromptFn !== "function") return null;
                return await fallbackPromptFn(message, defaultValue);
            }

            if (typeof activePromptCleanup === "function") {
                activePromptCleanup();
                activePromptCleanup = null;
            }
            if (typeof activePromptResolver === "function") {
                activePromptResolver(null);
                activePromptResolver = null;
            }

            return await new Promise((resolve) => {
                let settled = false;
                activePromptResolver = resolve;

                const cleanup = () => {
                    overlay.removeEventListener("click", handleOverlayClick);
                    confirmBtn.removeEventListener("click", handleConfirmClick);
                    cancelBtn.removeEventListener("click", handleCancelClick);
                    closeBtn.removeEventListener("click", handleCancelClick);
                    input.removeEventListener("keydown", handleInputKeydown);
                    overlay.style.display = "none";
                    activePromptCleanup = null;
                    activePromptResolver = null;
                };

                const finalize = (value) => {
                    if (settled) return;
                    settled = true;
                    cleanup();
                    resolve(value);
                };

                const handleConfirmClick = () => finalize(String(input.value || ""));
                const handleCancelClick = () => finalize(null);
                const handleOverlayClick = (event) => {
                    if (event?.target === overlay) {
                        finalize(null);
                    }
                };
                const handleInputKeydown = (event) => {
                    if (event?.key === "Enter") {
                        event.preventDefault?.();
                        finalize(String(input.value || ""));
                        return;
                    }
                    if (event?.key === "Escape") {
                        event.preventDefault?.();
                        finalize(null);
                    }
                };

                activePromptCleanup = cleanup;
                title.textContent = String(message || "");
                input.value = String(defaultValue ?? "");
                confirmBtn.textContent = t("btn_confirm");
                cancelBtn.textContent = t("btn_cancel");
                closeBtn.setAttribute?.("aria-label", t("btn_cancel"));
                overlay.style.display = "flex";

                overlay.addEventListener("click", handleOverlayClick);
                confirmBtn.addEventListener("click", handleConfirmClick);
                cancelBtn.addEventListener("click", handleCancelClick);
                closeBtn.addEventListener("click", handleCancelClick);
                input.addEventListener("keydown", handleInputKeydown);

                const focusInput = () => {
                    input.focus?.();
                    input.select?.();
                };
                if (windowRef && typeof windowRef.setTimeout === "function") {
                    windowRef.setTimeout(focusInput, 0);
                } else if (typeof globalObj?.setTimeout === "function") {
                    globalObj.setTimeout(focusInput, 0);
                } else if (typeof setTimeout === "function") {
                    setTimeout(focusInput, 0);
                } else {
                    focusInput();
                }
            });
        }

        const appFeedbackService = appFeedbackApi.createService({
            t,
            resetAllSettings: async () => {
                const persistenceService = getPersistenceService();
                if (persistenceService && typeof persistenceService.resetAllSettings === "function") {
                    await persistenceService.resetAllSettings();
                }
            },
            confirmFn,
            locationRef,
            documentRef,
            location: locationRef,
            document: documentRef,
            logError: (...args) => logger(...args)
        });

        const calculatorActionsService = calculatorActionsApi.createService({
            GTV_CALCULATOR: safeDeps.GTV_CALCULATOR || null,
            PERIOD_RESULT_IDS: periodResultIds,
            t: (...args) => t(...args),
            showToast: (...args) => showToast(...args),
            getElementById: (id) => getElementById(id),
            writeClipboard: async (text) => await writeClipboard(text),
            logError: (...args) => logger(...args)
        });

        return Object.freeze({
            serviceBootstrap,
            persistenceServiceBundleFactory,
            mainUiUtilsService,
            appFeedbackService,
            calculatorActionsService,
            confirmFn,
            promptFn,
            setCustomTooltip: mainUiUtilsService.setCustomTooltip,
            upgradeNativeTitleTooltips: mainUiUtilsService.upgradeNativeTitleTooltips,
            hideFloatingTooltip: mainUiUtilsService.hideFloatingTooltip,
            bindFloatingTooltipEvents: mainUiUtilsService.bindFloatingTooltipEvents,
            clearDragGhost: mainUiUtilsService.clearDragGhost,
            createDragGhostFromRow: mainUiUtilsService.createDragGhostFromRow
        });
    }

    globalObj.GTVMainFoundationServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
