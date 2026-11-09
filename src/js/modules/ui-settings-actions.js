(function initGtvUiSettingsActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVUiSettingsActions", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "exportSettingsToJSON",
                "handleSettingsImportFile",
                "handleGroupImportFile",
                "clearPendingGroupImport",
                "handleSubgroupImportFile",
                "clearPendingSubgroupImport",
                "resetExceptGroupsAndTimezones",
                "resetAllSettings"
            ])
        });

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (globalObj?.document && typeof globalObj.document === "object") return globalObj.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function bindTransferControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const exportSettingsBtn = doc.getElementById("export-settings-btn");
            if (exportSettingsBtn?.addEventListener) {
                exportSettingsBtn.addEventListener("click", () => {
                    dep.exportSettingsToJSON();
                });
            }

            const importSettingsBtn = doc.getElementById("import-settings-btn");
            const settingsImportFile = doc.getElementById("settings-import-file");
            if (importSettingsBtn?.addEventListener && settingsImportFile) {
                importSettingsBtn.addEventListener("click", () => {
                    settingsImportFile.value = "";
                    settingsImportFile.click?.();
                });
                settingsImportFile.addEventListener?.("change", async (event) => {
                    const imported = await dep.handleSettingsImportFile(event);
                    if (imported === true) closeSettingsDialog();
                });
            }

            const groupImportFile = doc.getElementById("group-import-file");
            if (groupImportFile?.addEventListener) {
                groupImportFile.addEventListener("change", (event) => {
                    dep.handleGroupImportFile(event);
                });
                groupImportFile.addEventListener("cancel", () => {
                    dep.clearPendingGroupImport();
                });
            }

            const subgroupImportFile = doc.getElementById("subgroup-import-file");
            if (subgroupImportFile?.addEventListener) {
                subgroupImportFile.addEventListener("change", (event) => {
                    dep.handleSubgroupImportFile(event);
                });
                subgroupImportFile.addEventListener("cancel", () => {
                    dep.clearPendingSubgroupImport();
                });
            }
        }

        function bindResetControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const resetExceptGroupTzBtn = doc.getElementById("reset-except-group-tz-btn");
            if (resetExceptGroupTzBtn?.addEventListener) {
                resetExceptGroupTzBtn.addEventListener("click", async () => {
                    const done = await dep.resetExceptGroupsAndTimezones();
                    if (done === true) closeSettingsDialog();
                });
            }

            const resetAllSettingsBtn = doc.getElementById("reset-all-settings-btn");
            if (resetAllSettingsBtn?.addEventListener) {
                resetAllSettingsBtn.addEventListener("click", async () => {
                    const done = await dep.resetAllSettings();
                    if (done === true) closeSettingsDialog();
                });
            }
        }

        // Settings and help popups opened from the sidebar icon buttons. A popup closes with its
        // close button, a click on the dimmed background or Esc, and focus returns to the button
        // that opened it. Esc is left to a confirm/prompt dialog shown above the popup.
        const APP_DIALOGS = [
            { openId: "open-settings-btn", overlayId: "settings-overlay", closeId: "close-settings-btn" },
            { openId: "open-help-btn", overlayId: "help-overlay", closeId: "close-help-btn" }
        ];

        let lastDialogOpener = null;

        function isOverlayOpen(overlay) {
            return !!overlay && overlay.style?.display === "flex";
        }

        function closeDialog(overlay) {
            if (!isOverlayOpen(overlay)) return;
            overlay.style.display = "none";
            const opener = lastDialogOpener;
            lastDialogOpener = null;
            if (typeof opener?.focus === "function") opener.focus();
        }

        // Called after a confirmed reset or a successful import so the result is visible.
        function closeSettingsDialog() {
            const doc = getDocumentRef();
            closeDialog(doc?.getElementById?.("settings-overlay"));
        }

        function bindDialogControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const openDialog = (overlay, opener) => {
                APP_DIALOGS.forEach(({ overlayId }) => {
                    const other = doc.getElementById(overlayId);
                    if (other && other !== overlay && other.style) other.style.display = "none";
                });
                lastDialogOpener = opener || null;
                overlay.style.display = "flex";
                // Focus the panel itself so keyboard users start inside the popup without the
                // close button's tooltip popping up.
                const panel = overlay.querySelector?.(".app-dialog");
                if (typeof panel?.focus === "function") panel.focus({ preventScroll: true });
            };

            const entries = APP_DIALOGS.map(({ openId, overlayId, closeId }) => ({
                openButton: doc.getElementById(openId),
                overlay: doc.getElementById(overlayId),
                closeButton: doc.getElementById(closeId)
            })).filter((entry) => entry.overlay && entry.overlay.style);

            entries.forEach(({ openButton, overlay, closeButton }) => {
                openButton?.addEventListener?.("click", () => openDialog(overlay, openButton));
                closeButton?.addEventListener?.("click", () => closeDialog(overlay));
                overlay.addEventListener?.("click", (event) => {
                    if (event?.target === overlay) closeDialog(overlay);
                });
            });

            if (!entries.length) return;
            doc.addEventListener?.("keydown", (event) => {
                if (event?.key !== "Escape") return;
                const open = entries.find(({ overlay }) => isOverlayOpen(overlay));
                if (!open) return;
                const otherOverlays = Array.from(doc.querySelectorAll?.(".overlay:not(.app-dialog-overlay)") || []);
                if (otherOverlays.some((overlay) => isOverlayOpen(overlay))) return;
                closeDialog(open.overlay);
            });
        }

        function bindAllControls() {
            bindTransferControls();
            bindResetControls();
            bindDialogControls();
        }

        return Object.freeze({
            bindTransferControls,
            bindResetControls,
            bindDialogControls,
            bindAllControls
        });
    }

    globalObj.GTVUiSettingsActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
