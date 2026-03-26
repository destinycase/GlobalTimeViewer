(function initGtvUiSettingsActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVUiSettingsActions] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function bindTransferControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const exportSettingsBtn = doc.getElementById("export-settings-btn");
            if (exportSettingsBtn?.addEventListener) {
                exportSettingsBtn.addEventListener("click", () => {
                    invokeDep("exportSettingsToJSON");
                });
            }

            const importSettingsBtn = doc.getElementById("import-settings-btn");
            const settingsImportFile = doc.getElementById("settings-import-file");
            if (importSettingsBtn?.addEventListener && settingsImportFile) {
                importSettingsBtn.addEventListener("click", () => {
                    settingsImportFile.value = "";
                    settingsImportFile.click?.();
                });
                settingsImportFile.addEventListener?.("change", (event) => {
                    invokeDep("handleSettingsImportFile", event);
                });
            }

            const groupImportFile = doc.getElementById("group-import-file");
            if (groupImportFile?.addEventListener) {
                groupImportFile.addEventListener("change", (event) => {
                    invokeDep("handleGroupImportFile", event);
                });
                groupImportFile.addEventListener("cancel", () => {
                    invokeDep("clearPendingGroupImport");
                });
            }

            const subgroupImportFile = doc.getElementById("subgroup-import-file");
            if (subgroupImportFile?.addEventListener) {
                subgroupImportFile.addEventListener("change", (event) => {
                    invokeDep("handleSubgroupImportFile", event);
                });
                subgroupImportFile.addEventListener("cancel", () => {
                    invokeDep("clearPendingSubgroupImport");
                });
            }
        }

        function bindResetControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const resetExceptGroupTzBtn = doc.getElementById("reset-except-group-tz-btn");
            if (resetExceptGroupTzBtn?.addEventListener) {
                resetExceptGroupTzBtn.addEventListener("click", () => {
                    invokeDep("resetExceptGroupsAndTimezones");
                });
            }

            const resetAllSettingsBtn = doc.getElementById("reset-all-settings-btn");
            if (resetAllSettingsBtn?.addEventListener) {
                resetAllSettingsBtn.addEventListener("click", () => {
                    invokeDep("resetAllSettings");
                });
            }
        }

        function bindAllControls() {
            bindTransferControls();
            bindResetControls();
        }

        return Object.freeze({
            bindTransferControls,
            bindResetControls,
            bindAllControls
        });
    }

    globalObj.GTVUiSettingsActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
