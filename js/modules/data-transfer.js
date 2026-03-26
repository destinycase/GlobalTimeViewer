(function initGtvDataTransfer(globalObj) {
    "use strict";

    function createService(deps) {
        let pendingGroupImportIndex = null;
        let pendingSubgroupImportTarget = null;
        const filePickerFocusSettleMs = Number.isFinite(Number(deps.FILE_PICKER_FOCUS_SETTLE_MS))
            ? Math.max(0, Math.trunc(Number(deps.FILE_PICKER_FOCUS_SETTLE_MS)))
            : 50;

        function getWindowRef() {
            if (
                deps.window
                && typeof deps.window.addEventListener === "function"
                && typeof deps.window.removeEventListener === "function"
            ) {
                return deps.window;
            }
            if (
                typeof window === "object"
                && window
                && typeof window.addEventListener === "function"
                && typeof window.removeEventListener === "function"
            ) {
                return window;
            }
            return null;
        }

        function getDocumentRef() {
            if (deps.document && typeof deps.document === "object") {
                return deps.document;
            }
            const win = getWindowRef();
            if (win?.document && typeof win.document === "object") {
                return win.document;
            }
            if (typeof document === "object" && document) {
                return document;
            }
            return null;
        }

        function triggerJsonDownload(fileName, payload) {
            const doc = getDocumentRef();
            if (
                !doc
                || typeof doc.createElement !== "function"
                || !doc.body
                || typeof doc.body.appendChild !== "function"
            ) {
                throw new Error("Document download API unavailable");
            }

            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            try {
                const anchor = doc.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                doc.body.appendChild(anchor);
                if (typeof anchor.click === "function") {
                    anchor.click();
                }
                if (typeof anchor.remove === "function") {
                    anchor.remove();
                } else if (anchor.parentNode && typeof anchor.parentNode.removeChild === "function") {
                    anchor.parentNode.removeChild(anchor);
                }
            } finally {
                URL.revokeObjectURL(url);
            }
        }

        function clearPendingGroupImport() {
            pendingGroupImportIndex = null;
        }

        function clearPendingSubgroupImport() {
            pendingSubgroupImportTarget = null;
        }

        function schedulePendingImportResetOnDialogClose(fileInput, clearPendingFn) {
            const win = getWindowRef();
            if (!win || typeof clearPendingFn !== "function") return;
            let timerId = null;
            const cleanup = () => {
                win.removeEventListener("focus", onFocus, true);
                if (timerId !== null) {
                    clearTimeout(timerId);
                    timerId = null;
                }
            };
            const onFocus = () => {
                timerId = setTimeout(() => {
                    timerId = null;
                    const hasSelectedFile = Number(fileInput?.files?.length) > 0;
                    if (!hasSelectedFile) clearPendingFn();
                    cleanup();
                }, filePickerFocusSettleMs);
            };
            win.addEventListener("focus", onFocus, true);
        }

        async function ensurePersistenceSaved() {
            const ok = await deps.savePersistence();
            if (ok) return true;
            const err = new Error("Persistence save failed");
            err.code = "PERSISTENCE_WRITE_FAILED";
            throw err;
        }

        function getSettingsExportFileName() {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            return `GlobalTimeViewer_settings_${stamp}.json`;
        }

        function getGroupExportFileName(groupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeName = deps.sanitizeFilenamePart(groupName || "") || "group";
            return `GlobalTimeViewer_group_${safeName}_${stamp}.json`;
        }

        function getSubgroupExportFileName(groupName = "", subgroupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeGroupName = deps.sanitizeFilenamePart(groupName || "") || "group";
            const safeSubgroupName = deps.sanitizeFilenamePart(subgroupName || "") || "subgroup";
            return `GlobalTimeViewer_subgroup_${safeGroupName}_${safeSubgroupName}_${stamp}.json`;
        }

        function isValidGroupImportSource(source) {
            if (!source || typeof source !== "object") return false;
            if (typeof source.name !== "string" || !source.name.trim()) return false;
            if (!Array.isArray(source.zones)) return false;
            return true;
        }

        function isValidSubgroupImportSource(source) {
            if (!source || typeof source !== "object") return false;
            if (typeof source.name !== "string" || !source.name.trim()) return false;
            if (!Array.isArray(source.multiRanges) || !source.multiRanges.length) return false;
            const count = parseInt(source.multiRangeCount, 10);
            if (!Number.isFinite(count) || count < deps.MIN_MULTI_RANGE_COUNT) return false;
            return true;
        }

        async function applyImportedGroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const rootType = (importedRoot && typeof importedRoot === "object" && typeof importedRoot.type === "string")
                ? importedRoot.type.trim().toLowerCase()
                : "";
            if (rootType && rootType !== "group") {
                throw new Error("Invalid group payload type");
            }
            const source = (importedRoot && typeof importedRoot === "object" && importedRoot.group && typeof importedRoot.group === "object")
                ? importedRoot.group
                : importedRoot;
            if (!isValidGroupImportSource(source)) {
                throw new Error("Invalid group payload");
            }

            const safeIdx = Math.min(Math.max(parseInt(targetGroupIdx, 10) || 0, 0), groups.length - 1);
            const sanitized = deps.sanitizeGroup(source, safeIdx, null);
            if (!sanitized) {
                throw new Error("Invalid group payload");
            }
            deps.ensureGroupMultiSubgroups(sanitized);
            deps.syncCurrentMultiStateToActiveSubgroup();
            groups[safeIdx] = sanitized;

            if (deps.getActiveGroupId() === safeIdx) {
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            await ensurePersistenceSaved();
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else {
                deps.renderList();
            }
        }

        async function applyImportedSubgroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId(), targetSubgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const rootType = (importedRoot && typeof importedRoot === "object" && typeof importedRoot.type === "string")
                ? importedRoot.type.trim().toLowerCase()
                : "";
            if (rootType && rootType !== "subgroup") {
                throw new Error("Invalid subgroup payload type");
            }
            const source = (importedRoot && typeof importedRoot === "object" && importedRoot.subgroup && typeof importedRoot.subgroup === "object")
                ? importedRoot.subgroup
                : importedRoot;
            if (!isValidSubgroupImportSource(source)) {
                throw new Error("Invalid subgroup payload");
            }

            const safeGroupIdx = Math.min(Math.max(parseInt(targetGroupIdx, 10) || 0, 0), groups.length - 1);
            const targetGroup = groups[safeGroupIdx];
            if (!targetGroup) {
                throw new Error("Invalid subgroup target group");
            }
            deps.ensureGroupMultiSubgroups(targetGroup);
            const normalizedSubgroupId = deps.sanitizeMultiSubgroupId(targetSubgroupId) || targetGroup.activeMultiSubgroupId;
            const targetSubgroup = targetGroup.multiSubgroups.find((item) => item.id === normalizedSubgroupId);
            if (!targetSubgroup) {
                throw new Error("Invalid subgroup target");
            }

            const normalizedState = deps.sanitizeMultiStatePayload(source, null);
            deps.syncCurrentMultiStateToActiveSubgroup();
            targetSubgroup.name = deps.sanitizeMultiSubgroupName(source.name, targetSubgroup.name || deps.getDefaultMultiSubgroupName(0));
            targetSubgroup.multiRangeCount = normalizedState.multiRangeCount;
            targetSubgroup.multiRanges = normalizedState.multiRanges;
            targetSubgroup.multiRangeCollapsed = normalizedState.multiRangeCollapsed;
            targetSubgroup.multiRangeStartEditEnabled = normalizedState.multiRangeStartEditEnabled;
            targetSubgroup.multiRangeEndEditEnabled = normalizedState.multiRangeEndEditEnabled;

            if (deps.getActiveGroupId() === safeGroupIdx && targetGroup.activeMultiSubgroupId === targetSubgroup.id) {
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            await ensurePersistenceSaved();
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else {
                deps.renderList();
            }
        }

        function exportGroupToJSON(groupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            try {
                deps.syncCurrentMultiStateToActiveSubgroup();
                const safeIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
                const sourceGroup = groups[safeIdx];
                if (!sourceGroup) return;
                deps.ensureGroupMultiSubgroups(sourceGroup);

                const groupPayload = {
                    name: sourceGroup.name,
                    zones: sourceGroup.zones,
                    baseTimezoneId: sourceGroup.baseTimezoneId,
                    showUtcRow: sourceGroup.showUtcRow,
                    utcRowOrder: sourceGroup.utcRowOrder,
                    fixedDate: sourceGroup.fixedDate,
                    fixedTimes: sourceGroup.fixedTimes,
                    activeMultiSubgroupId: sourceGroup.activeMultiSubgroupId,
                    multiSubgroups: sourceGroup.multiSubgroups
                };
                const fileName = getGroupExportFileName(sourceGroup.name);
                const exportPayload = {
                    app: "GlobalTimeViewer",
                    type: "group",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    group: JSON.parse(JSON.stringify(groupPayload))
                };

                triggerJsonDownload(fileName, exportPayload);
                deps.showToast(deps.tFormat("toast_group_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportGroupToJSON failed:", err);
                deps.showToast(deps.t("toast_group_export_failed"));
            }
        }

        function triggerGroupImportFor(groupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const safeIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            const groupImportFile = getDocumentRef()?.getElementById?.("group-import-file");
            if (!groupImportFile) return;
            pendingGroupImportIndex = safeIdx;
            groupImportFile.value = "";
            schedulePendingImportResetOnDialogClose(groupImportFile, clearPendingGroupImport);
            groupImportFile.click();
        }

        async function handleGroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                clearPendingGroupImport();
                if (input) input.value = "";
                return;
            }

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                await applyImportedGroupSettings(parsed, pendingGroupImportIndex ?? deps.getActiveGroupId());
                deps.showToast(deps.tFormat("toast_group_import_success", { filename: file.name || getGroupExportFileName("group") }));
            } catch (err) {
                console.error("handleGroupImportFile failed:", err);
                if (err.message === "Invalid group payload" || err.message === "Invalid group payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                    deps.showToast(deps.t("toast_storage_save_failed"));
                } else {
                    deps.showToast(deps.t("toast_group_import_failed"));
                }
            } finally {
                clearPendingGroupImport();
                if (input) input.value = "";
            }
        }

        function exportSubgroupToJSON(groupIdx = deps.getActiveGroupId(), subgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            try {
                deps.syncCurrentMultiStateToActiveSubgroup();
                const safeGroupIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
                const sourceGroup = groups[safeGroupIdx];
                if (!sourceGroup) return;
                deps.ensureGroupMultiSubgroups(sourceGroup);

                const targetSubgroupId = deps.sanitizeMultiSubgroupId(subgroupId) || sourceGroup.activeMultiSubgroupId;
                const sourceSubgroup = sourceGroup.multiSubgroups.find((item) => item.id === targetSubgroupId) || sourceGroup.multiSubgroups[0];
                if (!sourceSubgroup) return;

                const subgroupPayload = {
                    name: sourceSubgroup.name,
                    multiRangeCount: sourceSubgroup.multiRangeCount,
                    multiRanges: sourceSubgroup.multiRanges,
                    multiRangeCollapsed: sourceSubgroup.multiRangeCollapsed,
                    multiRangeStartEditEnabled: sourceSubgroup.multiRangeStartEditEnabled,
                    multiRangeEndEditEnabled: sourceSubgroup.multiRangeEndEditEnabled
                };
                const fileName = getSubgroupExportFileName(sourceGroup.name, sourceSubgroup.name);
                const exportPayload = {
                    app: "GlobalTimeViewer",
                    type: "subgroup",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    groupName: sourceGroup.name,
                    subgroup: JSON.parse(JSON.stringify(subgroupPayload))
                };

                triggerJsonDownload(fileName, exportPayload);
                deps.showToast(deps.tFormat("toast_subgroup_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportSubgroupToJSON failed:", err);
                deps.showToast(deps.t("toast_subgroup_export_failed"));
            }
        }

        function triggerSubgroupImportFor(groupIdx = deps.getActiveGroupId(), subgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const safeGroupIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            const group = groups[safeGroupIdx];
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            const targetSubgroupId = deps.sanitizeMultiSubgroupId(subgroupId) || group.activeMultiSubgroupId;
            const exists = group.multiSubgroups.some((item) => item.id === targetSubgroupId);
            if (!exists) return;

            const subgroupImportFile = getDocumentRef()?.getElementById?.("subgroup-import-file");
            if (!subgroupImportFile) return;
            pendingSubgroupImportTarget = { groupIdx: safeGroupIdx, subgroupId: targetSubgroupId };
            subgroupImportFile.value = "";
            schedulePendingImportResetOnDialogClose(subgroupImportFile, clearPendingSubgroupImport);
            subgroupImportFile.click();
        }

        async function handleSubgroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                clearPendingSubgroupImport();
                if (input) input.value = "";
                return;
            }

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                const target = pendingSubgroupImportTarget || { groupIdx: deps.getActiveGroupId(), subgroupId: deps.getCurrentMultiSubgroup()?.id || "" };
                await applyImportedSubgroupSettings(parsed, target.groupIdx, target.subgroupId);
                deps.showToast(deps.tFormat("toast_subgroup_import_success", { filename: file.name || getSubgroupExportFileName("group", "subgroup") }));
            } catch (err) {
                console.error("handleSubgroupImportFile failed:", err);
                if (err.message === "Invalid subgroup payload" || err.message === "Invalid subgroup payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                    deps.showToast(deps.t("toast_storage_save_failed"));
                } else {
                    deps.showToast(deps.t("toast_subgroup_import_failed"));
                }
            } finally {
                clearPendingSubgroupImport();
                if (input) input.value = "";
            }
        }

        function exportSettingsToJSON() {
            try {
                const fileName = getSettingsExportFileName();
                const currentLang = deps.getCurrentLang();
                const snapshot = deps.getPersistenceSnapshot();
                const parsedDayStartHour = Number.parseInt(
                    (typeof deps.getDayStartHour === "function")
                        ? deps.getDayStartHour()
                        : snapshot?.dayStartHour,
                    10
                );
                const parsedNightStartHour = Number.parseInt(
                    (typeof deps.getNightStartHour === "function")
                        ? deps.getNightStartHour()
                        : snapshot?.nightStartHour,
                    10
                );
                const defaultDayStartHour = Number.parseInt(deps.DEFAULT_DAY_START_HOUR, 10);
                const defaultNightStartHour = Number.parseInt(deps.DEFAULT_NIGHT_START_HOUR, 10);
                const dayStartHour = Math.min(
                    23,
                    Math.max(
                        0,
                        Number.isFinite(parsedDayStartHour)
                            ? parsedDayStartHour
                            : (Number.isFinite(defaultDayStartHour) ? defaultDayStartHour : 6)
                    )
                );
                const nightStartHour = Math.min(
                    23,
                    Math.max(
                        0,
                        Number.isFinite(parsedNightStartHour)
                            ? parsedNightStartHour
                            : (Number.isFinite(defaultNightStartHour) ? defaultNightStartHour : 18)
                    )
                );
                const normalizedDayNightRange = (nightStartHour <= dayStartHour)
                    ? {
                        dayStartHour: Number.isFinite(defaultDayStartHour) ? Math.min(23, Math.max(0, defaultDayStartHour)) : 6,
                        nightStartHour: Number.isFinite(defaultNightStartHour) ? Math.min(23, Math.max(0, defaultNightStartHour)) : 18
                    }
                    : { dayStartHour, nightStartHour };
                const exportPayload = {
                    app: "GlobalTimeViewer",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    data: snapshot,
                    preferences: {
                        theme: deps.sanitizeTheme(deps.getCurrentTheme()),
                        language: deps.I18N_DATA[currentLang] ? currentLang : "ko",
                        uiScale: deps.getCurrentUiScalePercent(),
                        dayStartHour: normalizedDayNightRange.dayStartHour,
                        nightStartHour: normalizedDayNightRange.nightStartHour
                    }
                };

                triggerJsonDownload(fileName, exportPayload);
                deps.showToast(deps.tFormat("toast_settings_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportSettingsToJSON failed:", err);
                deps.showToast(deps.t("toast_settings_export_failed"));
            }
        }

        async function handleSettingsImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) return;

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                await deps.applyImportedSettings(parsed);
                deps.showToast(deps.tFormat("toast_settings_import_success", { filename: file.name || getSettingsExportFileName() }));
            } catch (err) {
                console.error("handleSettingsImportFile failed:", err);
                if (err.message === "Invalid settings payload" || err.message === "Invalid settings payload: groups is required") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else {
                    const cause = (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") ? err.cause : err;
                    if (deps.isQuotaExceededError(cause)) {
                        deps.showToast(deps.t("toast_storage_quota_exceeded"));
                    } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                        deps.showToast(deps.t("toast_storage_save_failed"));
                    } else {
                        deps.showToast(deps.t("toast_settings_import_failed"));
                    }
                }
            } finally {
                if (input) input.value = "";
            }
        }

        return Object.freeze({
            getSettingsExportFileName,
            getGroupExportFileName,
            getSubgroupExportFileName,
            exportGroupToJSON,
            triggerGroupImportFor,
            clearPendingGroupImport,
            handleGroupImportFile,
            exportSubgroupToJSON,
            triggerSubgroupImportFor,
            clearPendingSubgroupImport,
            handleSubgroupImportFile,
            exportSettingsToJSON,
            handleSettingsImportFile
        });
    }

    globalObj.GTVDataTransfer = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
