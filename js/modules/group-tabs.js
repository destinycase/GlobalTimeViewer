(function initGtvGroupTabs(globalObj) {
    "use strict";

    function createService(deps) {
        const confirmFn = (typeof deps.confirmFn === "function")
            ? deps.confirmFn
            : ((message) => {
                if (typeof confirm === "function") return confirm(message);
                return true;
            });

        function getState() {
            const state = (typeof deps.getState === "function") ? deps.getState() : null;
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
            if (typeof deps.setState !== "function") return;
            deps.setState(next);
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
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else if (typeof deps.isFixedTimeTab === "function" && deps.isFixedTimeTab()) {
                deps.renderFixedTimeTab();
            } else {
                deps.renderList();
            }
            if (typeof deps.renderTimelineFrame === "function") {
                deps.renderTimelineFrame();
            }
        }

        function activateGroupTab(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            if (safeIdx === state.activeGroupId) return;
            deps.syncCurrentMultiStateToActiveSubgroup();
            setState({ activeGroupId: safeIdx });
            deps.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        function addGroup() {
            const name = prompt(deps.t("prompt_new_group"), deps.t("default_group_name"));
            if (!name) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const nextGroup = {
                name: name.trim(),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof deps.getDefaultFixedDate === "function")
                    ? deps.getDefaultFixedDate()
                    : "",
                fixedTimes: (typeof deps.getDefaultFixedTimes === "function")
                    ? deps.getDefaultFixedTimes()
                    : []
            };
            deps.ensureGroupMultiSubgroups(nextGroup);

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

            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        function renameGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const group = groups[safeIdx];
            if (!group) return;
            const newName = prompt(deps.t("prompt_rename_group"), group.name);
            if (!newName || !newName.trim()) return;
            group.name = newName.trim();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            deps.showToast(deps.t("toast_name_changed"));
        }

        function deleteGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (groups.length <= 1) {
                deps.showToast(deps.t("toast_group_min"));
                return;
            }
            if (!confirmFn(deps.t("confirm_delete_group"))) return;

            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const currentActiveGroupId = clampGroupIndexByLength(state.activeGroupId, groups.length);
            deps.syncCurrentMultiStateToActiveSubgroup();
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
            deps.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
            deps.showToast(deps.t("toast_group_deleted"));
        }

        function activateMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            if (!group.multiSubgroups.some((subgroup) => subgroup.id === subgroupId)) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            group.activeMultiSubgroupId = subgroupId;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
        }

        function addMultiSubgroup() {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);

            const defaultName = deps.getDefaultMultiSubgroupName(group.multiSubgroups.length);
            const nextName = prompt(deps.t("prompt_new_subgroup"), defaultName);
            if (!nextName || !nextName.trim()) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const subgroup = deps.createMultiSubgroupState(nextName, group.multiSubgroups.length, null);
            group.multiSubgroups.push(subgroup);
            group.activeMultiSubgroupId = subgroup.id;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
        }

        function renameMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            const subgroup = group.multiSubgroups.find((item) => item.id === subgroupId);
            if (!subgroup) return;

            const nextName = prompt(deps.t("prompt_rename_subgroup"), subgroup.name);
            if (!nextName || !nextName.trim()) return;
            subgroup.name = deps.sanitizeMultiSubgroupName(nextName, subgroup.name);
            setState({ multiRangeTitle: deps.sanitizeMultiRangeTitle(subgroup.name) });
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
            deps.showToast(deps.t("toast_subgroup_name_changed"));
        }

        function deleteMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            if (group.multiSubgroups.length <= 1) {
                deps.showToast(deps.t("toast_subgroup_min"));
                return;
            }
            if (!confirmFn(deps.t("confirm_delete_subgroup"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const removeIdx = group.multiSubgroups.findIndex((item) => item.id === subgroupId);
            if (removeIdx < 0) return;
            group.multiSubgroups.splice(removeIdx, 1);
            if (!group.multiSubgroups.length) {
                group.multiSubgroups.push(deps.createMultiSubgroupState(deps.getDefaultMultiSubgroupName(0), 0, null));
            }
            group.activeMultiSubgroupId = group.multiSubgroups[Math.max(0, removeIdx - 1)]?.id || group.multiSubgroups[0].id;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
            deps.showToast(deps.t("toast_subgroup_deleted"));
        }

        function renderGroups() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("group-tabs-container");
            const addBtn = document.getElementById("add-group-btn");
            if (!container || !addBtn) return;

            const state = getState();
            const { groups, activeGroupId } = state;
            container.textContent = "";

            getStateGroups(state).forEach((group, idx) => {
                deps.ensureGroupMultiSubgroups(group);
                const btn = document.createElement("div");
                btn.className = `group-tab ${idx === activeGroupId ? "active" : ""}`;
                btn.setAttribute("role", "button");
                btn.tabIndex = 0;

                const label = document.createElement("span");
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
                    if (target instanceof Element && target.closest(".group-edit-btn, .group-export-btn, .group-import-btn, .group-del-btn")) return;
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

                const editBtn = document.createElement("button");
                editBtn.className = "group-edit-btn";
                editBtn.textContent = "✎";
                deps.setCustomTooltip(editBtn, deps.t("tooltip_edit"));
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    renameGroup(idx);
                };

                const exportBtn = document.createElement("button");
                exportBtn.className = "group-export-btn";
                exportBtn.textContent = "⤒";
                deps.setCustomTooltip(exportBtn, deps.t("tooltip_group_export"));
                exportBtn.onclick = (e) => {
                    e.stopPropagation();
                    deps.exportGroupToJSON(idx);
                };

                const importBtn = document.createElement("button");
                importBtn.className = "group-import-btn";
                importBtn.textContent = "⤓";
                deps.setCustomTooltip(importBtn, deps.t("tooltip_group_import"));
                importBtn.onclick = (e) => {
                    e.stopPropagation();
                    deps.triggerGroupImportFor(idx);
                };

                const delBtn = document.createElement("button");
                delBtn.className = "group-del-btn";
                delBtn.textContent = "✕";
                deps.setCustomTooltip(delBtn, deps.t("tooltip_delete"));
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
            deps.upgradeNativeTitleTooltips(container);
        }

        function renderMultiSubgroups() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("multi-subgroup-tabs-container");
            const addBtn = document.getElementById("add-multi-subgroup-btn");
            if (!container || !addBtn) return;

            if (!deps.isMultiTab()) {
                container.style.display = "none";
                return;
            }

            const group = deps.getCurrentGroup();
            if (!group) {
                container.textContent = "";
                container.appendChild(addBtn);
                container.style.display = "flex";
                return;
            }

            const state = getState();
            deps.ensureGroupMultiSubgroups(group);
            container.textContent = "";
            group.multiSubgroups.forEach((subgroup) => {
                const tab = document.createElement("div");
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

                const label = document.createElement("span");
                label.className = "multi-subgroup-name-label";
                label.textContent = subgroup.name;
                tab.appendChild(label);

                if (isActive) {
                    const editBtn = document.createElement("button");
                    editBtn.className = "multi-subgroup-edit-btn";
                    editBtn.type = "button";
                    editBtn.textContent = "✎";
                    deps.setCustomTooltip(editBtn, deps.t("tooltip_subgroup_edit"));
                    editBtn.onclick = (e) => {
                        e.stopPropagation();
                        renameMultiSubgroup(subgroup.id);
                    };

                    const exportBtn = document.createElement("button");
                    exportBtn.className = "multi-subgroup-export-btn";
                    exportBtn.type = "button";
                    exportBtn.textContent = "⤒";
                    deps.setCustomTooltip(exportBtn, deps.t("tooltip_subgroup_export"));
                    exportBtn.onclick = (e) => {
                        e.stopPropagation();
                        deps.exportSubgroupToJSON(state.activeGroupId, subgroup.id);
                    };

                    const importBtn = document.createElement("button");
                    importBtn.className = "multi-subgroup-import-btn";
                    importBtn.type = "button";
                    importBtn.textContent = "⤓";
                    deps.setCustomTooltip(importBtn, deps.t("tooltip_subgroup_import"));
                    importBtn.onclick = (e) => {
                        e.stopPropagation();
                        deps.triggerSubgroupImportFor(state.activeGroupId, subgroup.id);
                    };

                    const delBtn = document.createElement("button");
                    delBtn.className = "multi-subgroup-del-btn";
                    delBtn.type = "button";
                    delBtn.textContent = "✕";
                    deps.setCustomTooltip(delBtn, deps.t("tooltip_subgroup_delete"));
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
            deps.upgradeNativeTitleTooltips(container);
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
