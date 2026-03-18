(function initGtvDataTransfer(globalObj) {
    "use strict";

    function createService(deps) {
        let pendingGroupImportIndex = null;
        let pendingSubgroupImportTarget = null;

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

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
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
            const groupImportFile = document.getElementById("group-import-file");
            if (!groupImportFile) return;
            pendingGroupImportIndex = safeIdx;
            groupImportFile.value = "";
            groupImportFile.click();
        }

        async function handleGroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                pendingGroupImportIndex = null;
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
                pendingGroupImportIndex = null;
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

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
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

            const subgroupImportFile = document.getElementById("subgroup-import-file");
            if (!subgroupImportFile) return;
            pendingSubgroupImportTarget = { groupIdx: safeGroupIdx, subgroupId: targetSubgroupId };
            subgroupImportFile.value = "";
            subgroupImportFile.click();
        }

        async function handleSubgroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                pendingSubgroupImportTarget = null;
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
                pendingSubgroupImportTarget = null;
                if (input) input.value = "";
            }
        }

        function exportSettingsToJSON() {
            try {
                const fileName = getSettingsExportFileName();
                const currentLang = deps.getCurrentLang();
                const exportPayload = {
                    app: "GlobalTimeViewer",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    data: deps.getPersistenceSnapshot(),
                    preferences: {
                        theme: deps.sanitizeTheme(deps.getCurrentTheme()),
                        language: deps.I18N_DATA[currentLang] ? currentLang : "ko",
                        uiScale: deps.getCurrentUiScalePercent()
                    }
                };

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
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
            handleGroupImportFile,
            exportSubgroupToJSON,
            triggerSubgroupImportFor,
            handleSubgroupImportFile,
            exportSettingsToJSON,
            handleSettingsImportFile
        });
    }

    globalObj.GTVDataTransfer = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
