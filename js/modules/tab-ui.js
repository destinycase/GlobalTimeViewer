(function initGtvTabUi(globalObj) {
    "use strict";

    function createService(deps) {
        function refreshOptionToggleDividers() {
            const optionRow = document.getElementById("control-option-row");
            if (!optionRow) return;
            const optionGroups = [...optionRow.querySelectorAll(".option-toggle-group")];
            optionGroups.forEach((group) => group.classList.remove("option-with-divider"));
            const visibleGroups = optionGroups.filter((group) => group.style.display !== "none");
            visibleGroups.forEach((group, idx) => {
                if (idx < visibleGroups.length - 1) group.classList.add("option-with-divider");
            });
        }

        function updateOptionRowVisibility() {
            const optionRow = document.getElementById("control-option-row");
            if (!optionRow) return;

            const extraTimeGroup = document.getElementById("toggle-extra-time")?.closest(".control-group");
            const copyFormatGroup = document.getElementById("toggle-copy-format")?.closest(".control-group");
            const timelineGroup = document.getElementById("toggle-timeline")?.closest(".control-group");
            const rangeCountGroup = document.getElementById("multi-range-count-group");
            const multiToolsRow = document.getElementById("multi-tools-row");
            const multiSubgroupRow = document.getElementById("multi-subgroup-row");
            const multiControlsFrame = document.getElementById("multi-controls-frame");
            const saveTableImageBtn = document.getElementById("save-table-image-btn");
            const saveTimelineImageBtn = document.getElementById("save-timeline-image-btn");
            const saveMultiRangeTitlesImageBtn = document.getElementById("save-multi-range-titles-image-btn");
            const saveMultiRangeByRangeImageBtn = document.getElementById("save-multi-range-by-range-image-btn");
            const isMulti = deps.isMultiTab();
            const isRealtime = deps.getIsRealtime();

            optionRow.style.display = "flex";
            if (extraTimeGroup) extraTimeGroup.style.display = (isRealtime || isMulti) ? "none" : "flex";
            if (copyFormatGroup) copyFormatGroup.style.display = "flex";
            if (timelineGroup) timelineGroup.style.display = isMulti ? "none" : "flex";
            if (rangeCountGroup) rangeCountGroup.style.display = isMulti ? "flex" : "none";
            if (multiControlsFrame) multiControlsFrame.style.display = isMulti ? "block" : "none";
            if (multiSubgroupRow) multiSubgroupRow.style.display = isMulti ? "flex" : "none";
            if (multiToolsRow) multiToolsRow.style.display = isMulti ? "flex" : "none";
            if (saveTableImageBtn) saveTableImageBtn.style.display = isMulti ? "none" : "";
            if (saveTimelineImageBtn) saveTimelineImageBtn.style.display = isMulti ? "none" : (deps.getShowTimeline() ? "inline-flex" : "none");
            if (saveMultiRangeTitlesImageBtn) saveMultiRangeTitlesImageBtn.style.display = isMulti ? "" : "none";
            if (saveMultiRangeByRangeImageBtn) saveMultiRangeByRangeImageBtn.style.display = isMulti ? "" : "none";
            deps.refreshMultiRangeControls();
            refreshOptionToggleDividers();
        }

        function switchMainTab(tab) {
            const nextTab = deps.sanitizeMainTab(tab);
            deps.hideFloatingTooltip();
            deps.syncCurrentMultiStateToActiveSubgroup();

            let currentMainTab = deps.getCurrentMainTab();
            let activeGroupId = deps.getActiveGroupId();
            const activeGroupIdByMainTab = {
                live: 0,
                fixed: 0,
                ...(deps.getActiveGroupIdByMainTab() || {})
            };

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupIdByMainTab[currentMainTab] = deps.clampGroupIndex(activeGroupId);
            }

            currentMainTab = nextTab;
            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = deps.clampGroupIndex(activeGroupIdByMainTab[currentMainTab]);
            } else {
                activeGroupId = deps.clampGroupIndex(activeGroupId);
            }

            deps.setCurrentMainTab(currentMainTab);
            deps.setActiveGroupId(activeGroupId);
            deps.setActiveGroupIdByMainTab(activeGroupIdByMainTab);
            deps.normalizeGroupTabState();

            document.querySelectorAll(".nav-item").forEach((btn) => {
                btn.classList.toggle("active", btn.dataset.tab === currentMainTab);
            });
            const isMulti = deps.isMultiTab();
            const isCalc = currentMainTab === "calc";
            document.getElementById("timezone-section")?.classList.toggle("active", !isCalc && !isMulti);
            document.getElementById("multi-range-section")?.classList.toggle("active", isMulti);
            document.getElementById("calc-section")?.classList.toggle("active", isCalc);
            const groupTabsContainer = document.getElementById("group-tabs-container");
            if (groupTabsContainer) groupTabsContainer.style.display = isCalc ? "none" : "flex";
            const topControlBar = document.getElementById("top-control-bar");
            if (topControlBar) topControlBar.style.display = isCalc ? "none" : "flex";

            deps.setIsRealtime(currentMainTab === "live");
            const isRealtime = deps.getIsRealtime();
            if (isRealtime && typeof deps.syncRealtimeNow === "function") {
                deps.syncRealtimeNow();
            }
            const extraTimeToggle = document.getElementById("toggle-extra-time");
            const copyFormatToggle = document.getElementById("toggle-copy-format");
            const timelineToggle = document.getElementById("toggle-timeline");

            const statusText = document.getElementById("status-text");
            if (statusText) {
                if (isRealtime) statusText.textContent = deps.t("status_sync");
                else if (isMulti) statusText.textContent = deps.t("status_multi");
                else statusText.textContent = deps.t("status_fixed");
            }

            if (extraTimeToggle) {
                extraTimeToggle.disabled = isRealtime || isMulti;
                if (isRealtime) extraTimeToggle.checked = false;
                else if (isMulti) extraTimeToggle.checked = true;
                else extraTimeToggle.checked = (deps.getSlotCount() > 1);
            }

            if (copyFormatToggle) {
                copyFormatToggle.checked = deps.getShowCopyFormat();
            }
            if (timelineToggle) {
                timelineToggle.checked = deps.getShowTimeline();
            }
            updateOptionRowVisibility();
            deps.renderTimelineFrame();

            if (isMulti) {
                deps.renderBaseTimeSelect();
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (isMulti) {
                deps.renderMultiRanges();
            } else {
                deps.renderList();
                deps.updateTimeAdjustPanel();
            }
            deps.renderCopyFormatControls();
            deps.savePersistence();
        }

        return Object.freeze({
            switchMainTab,
            updateOptionRowVisibility,
            refreshOptionToggleDividers
        });
    }

    globalObj.GTVTabUI = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
