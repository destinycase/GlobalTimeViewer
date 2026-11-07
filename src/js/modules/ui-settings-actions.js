(function initGtvUiSettingsActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof globalObj?.console?.warn === "function") {
                globalObj.console.warn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVUiSettingsActions] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

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
                settingsImportFile.addEventListener?.("change", (event) => {
                    dep.handleSettingsImportFile(event);
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
                resetExceptGroupTzBtn.addEventListener("click", () => {
                    dep.resetExceptGroupsAndTimezones();
                });
            }

            const resetAllSettingsBtn = doc.getElementById("reset-all-settings-btn");
            if (resetAllSettingsBtn?.addEventListener) {
                resetAllSettingsBtn.addEventListener("click", () => {
                    dep.resetAllSettings();
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
