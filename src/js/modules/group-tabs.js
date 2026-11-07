(function initGtvGroupTabs(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const confirmFn = (typeof safeDeps.confirmFn === "function")
            ? safeDeps.confirmFn
            : ((message) => {
                if (typeof safeDeps.confirm === "function") return safeDeps.confirm(message);
                if (typeof globalObj?.confirm === "function") return globalObj.confirm(message);
                if (typeof confirm === "function") return confirm(message);
                return true;
            });
        const promptFn = (typeof safeDeps.promptFn === "function")
            ? safeDeps.promptFn
            : (async (message, defaultValue = "") => {
                if (typeof safeDeps.prompt === "function") return safeDeps.prompt(message, defaultValue);
                if (typeof globalObj?.prompt === "function") return globalObj.prompt(message, defaultValue);
                if (typeof prompt === "function") return prompt(message, defaultValue);
                return null;
            });

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
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
                    logWarn(`[GTVGroupTabs] Dependency "${depName}" threw.`, err);
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
                "t",
                "isMultiTab",
                "isFixedTimeTab",
                "getCurrentGroup",
                "getState",
                "setState",
                "renderBaseTimeSelect",
                "renderMultiRanges",
                "renderFixedTimeTab",
                "renderList",
                "renderTimelineFrame",
                "syncCurrentMultiStateToActiveSubgroup",
                "normalizeGroupTabState",
                "loadCurrentMultiStateFromActiveSubgroup",
                "savePersistence",
                "ensureGroupMultiSubgroups",
                "showToast",
                "getDefaultMultiSubgroupName",
                "createMultiSubgroupState",
                "sanitizeMultiSubgroupName",
                "sanitizeMultiRangeTitle",
                "getMultiRangeTitle",
                "hideFloatingTooltip",
                "setCustomTooltip",
                "exportGroupToJSON",
                "triggerGroupImportFor",
                "upgradeNativeTitleTooltips",
                "exportSubgroupToJSON",
                "triggerSubgroupImportFor"
            ])
        });

        function ensureGroupMultiSubgroupsSafe(group) {
            return dep.ensureGroupMultiSubgroups(group);
        }

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document === "object") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document === "object") {
                return globalObj.document;
            }
            return (typeof document === "object" && document) ? document : null;
        }

        function isElementInstance(value) {
            const ElementCtor = globalObj?.Element || globalThis?.Element;
            return typeof ElementCtor === "function" && value instanceof ElementCtor;
        }

        function translate(key) {
            const translated = dep.t(key);
            return (typeof translated === "string" && translated) ? translated : String(key || "");
        }

        function isMultiTab() {
            return !!dep.isMultiTab();
        }

        function isFixedTimeTab() {
            return !!dep.isFixedTimeTab();
        }

        function getCurrentGroup() {
            const group = dep.getCurrentGroup();
            return (group && typeof group === "object") ? group : null;
        }

        function getState() {
            const state = dep.getState();
            return (state && typeof state === "object") ? state : {};
        }

        function getStateGroups(state = getState()) {
            return Array.isArray(state.groups) ? state.groups : [];
        }

        function clampGroupIndexByLength(index, length) {
            const max = Math.max(0, (Number.isFinite(length) ? length : 0) - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), max);
        }

        function setState(next) {
            if (!next || typeof next !== "object") return;
            dep.setState(next);
        }

        async function requestPromptValue(message, defaultValue = "") {
            try {
                return await promptFn(message, defaultValue);
            } catch (_error) {
                return null;
            }
        }

        function syncActiveGroupIdByCurrentTab() {
            const state = getState();
            if (state.currentMainTab !== "live" && state.currentMainTab !== "fixed") return;
            const nextMap = {
                ...(state.activeGroupIdByMainTab || { live: 0, fixed: 0 }),
                [state.currentMainTab]: state.activeGroupId
            };
            setState({ activeGroupIdByMainTab: nextMap });
        }

        function rerenderActiveTabBody() {
            if (isMultiTab()) {
                dep.renderBaseTimeSelect();
                dep.renderMultiRanges();
            } else if (isFixedTimeTab()) {
                dep.renderFixedTimeTab();
            } else {
                dep.renderList();
            }
            dep.renderTimelineFrame();
        }

        function activateGroupTab(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            if (safeIdx === state.activeGroupId) return;
            dep.syncCurrentMultiStateToActiveSubgroup();
            setState({ activeGroupId: safeIdx });
            dep.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        async function addGroup() {
            const rawName = await requestPromptValue(translate("prompt_new_group"), translate("default_group_name"));
            if (typeof rawName !== "string" || !rawName.trim()) return;
            const name = rawName.trim();

            dep.syncCurrentMultiStateToActiveSubgroup();
            const nextGroup = {
                name,
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof safeDeps.getDefaultFixedDate === "function")
                    ? safeDeps.getDefaultFixedDate()
                    : "",
                fixedTimeShowLiveNow: false,
                fixedTimes: (typeof safeDeps.getDefaultFixedTimes === "function")
                    ? safeDeps.getDefaultFixedTimes()
                    : []
            };
            ensureGroupMultiSubgroupsSafe(nextGroup);

            const state = getState();
            const currentGroups = getStateGroups(state);
            const nextGroups = [...currentGroups, nextGroup];
            const nextActiveGroupId = nextGroups.length - 1;
            setState({
                groups: nextGroups,
                activeGroupId: nextActiveGroupId
            });

            if (state.currentMainTab === "live" || state.currentMainTab === "fixed") {
                const nextMap = {
                    ...(state.activeGroupIdByMainTab || { live: 0, fixed: 0 }),
                    [state.currentMainTab]: nextActiveGroupId
                };
                setState({ activeGroupIdByMainTab: nextMap });
            }

            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        async function renameGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const group = groups[safeIdx];
            if (!group) return;
            const nextRawName = await requestPromptValue(translate("prompt_rename_group"), group.name);
            if (typeof nextRawName !== "string" || !nextRawName.trim()) return;
            group.name = nextRawName.trim();
            dep.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            dep.showToast(translate("toast_name_changed"));
        }

        function deleteGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (groups.length <= 1) {
                dep.showToast(translate("toast_group_min"));
                return;
            }
            if (!confirmFn(translate("confirm_delete_group"))) return;

            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const currentActiveGroupId = clampGroupIndexByLength(state.activeGroupId, groups.length);
            dep.syncCurrentMultiStateToActiveSubgroup();
            const nextGroups = [...groups];
            nextGroups.splice(safeIdx, 1);

            let nextActiveGroupId = currentActiveGroupId;
            if (safeIdx < currentActiveGroupId) {
                nextActiveGroupId = currentActiveGroupId - 1;
            } else if (safeIdx === currentActiveGroupId) {
                nextActiveGroupId = Math.max(0, currentActiveGroupId - 1);
            }
            nextActiveGroupId = clampGroupIndexByLength(nextActiveGroupId, nextGroups.length);
            setState({
                groups: nextGroups,
                activeGroupId: nextActiveGroupId
            });
            dep.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
            dep.showToast(translate("toast_group_deleted"));
        }

        function activateMultiSubgroup(subgroupId) {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupMultiSubgroupsSafe(group);
            if (!group.multiSubgroups.some((subgroup) => subgroup.id === subgroupId)) return;

            dep.syncCurrentMultiStateToActiveSubgroup();
            group.activeMultiSubgroupId = subgroupId;
            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderMultiSubgroups();
            if (isMultiTab()) dep.renderMultiRanges();
        }

        async function addMultiSubgroup() {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupMultiSubgroupsSafe(group);

            const defaultName = dep.getDefaultMultiSubgroupName(group.multiSubgroups.length);
            const nextName = await requestPromptValue(translate("prompt_new_subgroup"), defaultName);
            if (typeof nextName !== "string" || !nextName.trim()) return;

            dep.syncCurrentMultiStateToActiveSubgroup();
            const subgroup = dep.createMultiSubgroupState(nextName, group.multiSubgroups.length, null);
            if (!subgroup || typeof subgroup !== "object") return;
            group.multiSubgroups.push(subgroup);
            group.activeMultiSubgroupId = subgroup.id;
            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderMultiSubgroups();
            if (isMultiTab()) dep.renderMultiRanges();
        }

        async function renameMultiSubgroup(subgroupId) {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupMultiSubgroupsSafe(group);
            const subgroup = group.multiSubgroups.find((item) => item.id === subgroupId);
            if (!subgroup) return;

            const nextName = await requestPromptValue(translate("prompt_rename_subgroup"), subgroup.name);
            if (typeof nextName !== "string" || !nextName.trim()) return;
            subgroup.name = dep.sanitizeMultiSubgroupName(nextName, subgroup.name) || subgroup.name;
            setState({ multiRangeTitle: dep.sanitizeMultiRangeTitle(subgroup.name) || subgroup.name });
            dep.savePersistence();
            renderMultiSubgroups();
            if (isMultiTab()) dep.renderMultiRanges();
            dep.showToast(translate("toast_subgroup_name_changed"));
        }

        function deleteMultiSubgroup(subgroupId) {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupMultiSubgroupsSafe(group);
            if (group.multiSubgroups.length <= 1) {
                dep.showToast(translate("toast_subgroup_min"));
                return;
            }
            if (!confirmFn(translate("confirm_delete_subgroup"))) return;

            dep.syncCurrentMultiStateToActiveSubgroup();
            const removeIdx = group.multiSubgroups.findIndex((item) => item.id === subgroupId);
            if (removeIdx < 0) return;
            group.multiSubgroups.splice(removeIdx, 1);
            if (!group.multiSubgroups.length) {
                const fallbackSubgroup = dep.createMultiSubgroupState(dep.getDefaultMultiSubgroupName(0), 0, null);
                if (fallbackSubgroup && typeof fallbackSubgroup === "object") {
                    group.multiSubgroups.push(fallbackSubgroup);
                }
            }
            if (!group.multiSubgroups.length) return;
            group.activeMultiSubgroupId = group.multiSubgroups[Math.max(0, removeIdx - 1)]?.id || group.multiSubgroups[0].id;
            dep.loadCurrentMultiStateFromActiveSubgroup();
            dep.savePersistence();
            renderMultiSubgroups();
            if (isMultiTab()) dep.renderMultiRanges();
            dep.showToast(translate("toast_subgroup_deleted"));
        }

        function renderGroups() {
            dep.hideFloatingTooltip();
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function" || typeof documentRef.createElement !== "function") return;
            const container = documentRef.getElementById("group-tabs-container");
            const addBtn = documentRef.getElementById("add-group-btn");
            if (!container || !addBtn) return;

            const state = getState();
            const { activeGroupId } = state;
            container.textContent = "";

            getStateGroups(state).forEach((group, idx) => {
                ensureGroupMultiSubgroupsSafe(group);
                const btn = documentRef.createElement("div");
                btn.className = `group-tab ${idx === activeGroupId ? "active" : ""}`;
                btn.setAttribute("role", "button");
                btn.tabIndex = 0;

                const label = documentRef.createElement("span");
                label.className = "group-name-label";
                label.textContent = group.name;
                let pointerDownX = 0;
                let pointerDownY = 0;
                btn.addEventListener("pointerdown", (e) => {
                    if (e.button !== 0) return;
                    pointerDownX = e.clientX;
                    pointerDownY = e.clientY;
                });
                btn.addEventListener("pointerup", (e) => {
                    if (e.button !== 0) return;
                    const target = e.target;
                    if (isElementInstance(target) && target.closest(".group-edit-btn, .group-export-btn, .group-import-btn, .group-del-btn")) return;
                    const deltaX = Math.abs(e.clientX - pointerDownX);
                    const deltaY = Math.abs(e.clientY - pointerDownY);
                    if (deltaX > 8 || deltaY > 8) return;
                    activateGroupTab(idx);
                });
                btn.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    activateGroupTab(idx);
                });

                const editBtn = documentRef.createElement("button");
                editBtn.className = "group-edit-btn";
                editBtn.textContent = "✎";
                dep.setCustomTooltip(editBtn, translate("tooltip_edit"));
                editBtn.onclick = async (e) => {
                    e.stopPropagation();
                    await renameGroup(idx);
                };

                const exportBtn = documentRef.createElement("button");
                exportBtn.className = "group-export-btn";
                exportBtn.textContent = "⤒";
                dep.setCustomTooltip(exportBtn, translate("tooltip_group_export"));
                exportBtn.onclick = (e) => {
                    e.stopPropagation();
                    dep.exportGroupToJSON(idx);
                };

                const importBtn = documentRef.createElement("button");
                importBtn.className = "group-import-btn";
                importBtn.textContent = "⤓";
                dep.setCustomTooltip(importBtn, translate("tooltip_group_import"));
                importBtn.onclick = (e) => {
                    e.stopPropagation();
                    dep.triggerGroupImportFor(idx);
                };

                const delBtn = documentRef.createElement("button");
                delBtn.className = "group-del-btn";
                delBtn.textContent = "✕";
                dep.setCustomTooltip(delBtn, translate("tooltip_delete"));
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteGroup(idx);
                };

                btn.appendChild(label);
                if (idx === activeGroupId) {
                    btn.appendChild(editBtn);
                    btn.appendChild(exportBtn);
                    btn.appendChild(importBtn);
                    btn.appendChild(delBtn);
                }
                container.appendChild(btn);
            });

            container.appendChild(addBtn);
            dep.upgradeNativeTitleTooltips(container);
        }

        function renderMultiSubgroups() {
            dep.hideFloatingTooltip();
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function" || typeof documentRef.createElement !== "function") return;
            const container = documentRef.getElementById("multi-subgroup-tabs-container");
            const addBtn = documentRef.getElementById("add-multi-subgroup-btn");
            if (!container || !addBtn) return;

            if (!isMultiTab()) {
                container.style.display = "none";
                return;
            }

            const group = getCurrentGroup();
            if (!group) {
                container.textContent = "";
                container.appendChild(addBtn);
                container.style.display = "flex";
                return;
            }

            const state = getState();
            ensureGroupMultiSubgroupsSafe(group);
            container.textContent = "";
            group.multiSubgroups.forEach((subgroup) => {
                const tab = documentRef.createElement("div");
                const isActive = subgroup.id === group.activeMultiSubgroupId;
                tab.className = `multi-subgroup-tab ${isActive ? "active" : ""}`;
                tab.setAttribute("role", "button");
                tab.tabIndex = 0;
                tab.addEventListener("click", () => activateMultiSubgroup(subgroup.id));
                tab.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    activateMultiSubgroup(subgroup.id);
                });

                const label = documentRef.createElement("span");
                label.className = "multi-subgroup-name-label";
                label.textContent = subgroup.name;
                tab.appendChild(label);

                if (isActive) {
                    const editBtn = documentRef.createElement("button");
                    editBtn.className = "multi-subgroup-edit-btn";
                    editBtn.type = "button";
                    editBtn.textContent = "✎";
                    dep.setCustomTooltip(editBtn, translate("tooltip_subgroup_edit"));
                    editBtn.onclick = async (e) => {
                        e.stopPropagation();
                        await renameMultiSubgroup(subgroup.id);
                    };

                    const exportBtn = documentRef.createElement("button");
                    exportBtn.className = "multi-subgroup-export-btn";
                    exportBtn.type = "button";
                    exportBtn.textContent = "⤒";
                    dep.setCustomTooltip(exportBtn, translate("tooltip_subgroup_export"));
                    exportBtn.onclick = (e) => {
                        e.stopPropagation();
                        dep.exportSubgroupToJSON(state.activeGroupId, subgroup.id);
                    };

                    const importBtn = documentRef.createElement("button");
                    importBtn.className = "multi-subgroup-import-btn";
                    importBtn.type = "button";
                    importBtn.textContent = "⤓";
                    dep.setCustomTooltip(importBtn, translate("tooltip_subgroup_import"));
                    importBtn.onclick = (e) => {
                        e.stopPropagation();
                        dep.triggerSubgroupImportFor(state.activeGroupId, subgroup.id);
                    };

                    const delBtn = documentRef.createElement("button");
                    delBtn.className = "multi-subgroup-del-btn";
                    delBtn.type = "button";
                    delBtn.textContent = "✕";
                    dep.setCustomTooltip(delBtn, translate("tooltip_subgroup_delete"));
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteMultiSubgroup(subgroup.id);
                    };
                    tab.appendChild(editBtn);
                    tab.appendChild(exportBtn);
                    tab.appendChild(importBtn);
                    tab.appendChild(delBtn);
                }

                container.appendChild(tab);
            });

            container.appendChild(addBtn);
            container.style.display = "flex";
            dep.upgradeNativeTitleTooltips(container);
        }

        return Object.freeze({
            activateGroupTab,
            addGroup,
            renameGroup,
            activateMultiSubgroup,
            addMultiSubgroup,
            renameMultiSubgroup,
            deleteMultiSubgroup,
            renderGroups,
            renderMultiSubgroups
        });
    }

    globalObj.GTVGroupTabs = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
