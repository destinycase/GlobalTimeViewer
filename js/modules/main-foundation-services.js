(function initGtvMainFoundationServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function resolveDocumentRef() {
        return (typeof document === "object" && document) ? document : null;
    }

    function resolveLocationRef() {
        return (typeof location === "object" && location) ? location : null;
    }

    function resolveClipboardRef() {
        if (typeof navigator !== "object" || !navigator) return null;
        return navigator.clipboard || null;
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
        const confirmFn = (typeof safeDeps.confirmFn === "function")
            ? safeDeps.confirmFn
            : ((message) => confirm(message));
        const documentRef = Object.prototype.hasOwnProperty.call(safeDeps, "documentRef")
            ? safeDeps.documentRef
            : resolveDocumentRef();
        const locationRef = Object.prototype.hasOwnProperty.call(safeDeps, "locationRef")
            ? safeDeps.locationRef
            : resolveLocationRef();
        const logger = (typeof safeDeps.logError === "function")
            ? safeDeps.logError
            : ((...args) => console.error(...args));
        const writeClipboard = (typeof safeDeps.writeClipboard === "function")
            ? safeDeps.writeClipboard
            : (async (text) => {
                const clipboard = resolveClipboardRef();
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

        const appFeedbackService = appFeedbackApi.createService({
            t,
            resetAllSettings: async () => {
                const persistenceService = getPersistenceService();
                if (persistenceService && typeof persistenceService.resetAllSettings === "function") {
                    await persistenceService.resetAllSettings();
                }
            },
            confirmFn,
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
