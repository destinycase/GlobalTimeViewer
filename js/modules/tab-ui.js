(function initGtvTabUi(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTabUI] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getBooleanDep(name, fallback = false) {
            const value = invokeDep(name);
            if (value === undefined) return !!fallback;
            return !!value;
        }

        function getMainTab(value) {
            if (value === "live" || value === "fixed" || value === "multi" || value === "calc" || value === "fixed-time") {
                return value;
            }
            return "live";
        }

        function sanitizeMainTab(tab) {
            const nextTab = invokeDep("sanitizeMainTab", tab);
            if (typeof nextTab === "string" && nextTab.trim()) return nextTab;
            return getMainTab(tab);
        }

        function clampGroupIndex(index) {
            const clamped = invokeDep("clampGroupIndex", index);
            const numeric = Number(clamped);
            if (Number.isFinite(numeric)) return numeric;
            const parsed = Number(index);
            if (Number.isFinite(parsed)) return Math.max(0, parsed);
            return 0;
        }

        function toggleClass(el, className, enabled) {
            if (!el || typeof el !== "object") return;
            if (!el.classList || typeof el.classList.toggle !== "function") return;
            el.classList.toggle(className, !!enabled);
        }

        function getElementDisplay(el) {
            const display = el?.style?.display;
            return (typeof display === "string") ? display : "";
        }

        function setElementDisplay(el, value) {
            if (!el || typeof el !== "object") return;
            if (!el.style || typeof el.style !== "object") return;
            el.style.display = value;
        }

        function refreshOptionToggleDividers() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const optionRow = doc.getElementById("control-option-row");
            if (!optionRow || typeof optionRow.querySelectorAll !== "function") return;
            const optionGroups = Array.from(optionRow.querySelectorAll(".option-toggle-group") || []);
            optionGroups.forEach((group) => {
                if (group?.classList && typeof group.classList.remove === "function") {
                    group.classList.remove("option-with-divider");
                }
            });
            const visibleGroups = optionGroups.filter((group) => getElementDisplay(group) !== "none");
            visibleGroups.forEach((group, idx) => {
                if (idx < visibleGroups.length - 1 && group?.classList && typeof group.classList.add === "function") {
                    group.classList.add("option-with-divider");
                }
            });
        }

        function updateOptionRowVisibility() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const optionRow = doc.getElementById("control-option-row");
            if (!optionRow) return;

            const extraTimeGroup = doc.getElementById("toggle-extra-time")?.closest?.(".control-group");
            const copyFormatGroup = doc.getElementById("toggle-copy-format")?.closest?.(".control-group");
            const timelineGroup = doc.getElementById("toggle-timeline")?.closest?.(".control-group");
            const copyFormatRow = doc.getElementById("copy-format-row");
            const fixedTimeSlotCountGroup = doc.getElementById("fixed-time-slot-count-group");
            const fixedTimeDateGroup = doc.getElementById("fixed-time-date-group");
            const rangeCountGroup = doc.getElementById("multi-range-count-group");
            const multiToolsRow = doc.getElementById("multi-tools-row");
            const multiSubgroupRow = doc.getElementById("multi-subgroup-row");
            const multiControlsFrame = doc.getElementById("multi-controls-frame");
            const saveTableImageBtn = doc.getElementById("save-table-image-btn");
            const saveMultiRangeTitlesImageBtn = doc.getElementById("save-multi-range-titles-image-btn");
            const isMulti = getBooleanDep("isMultiTab");
            const isFixedTime = getBooleanDep("isFixedTimeTab");
            const isRealtime = getBooleanDep("getIsRealtime");

            setElementDisplay(optionRow, "flex");
            setElementDisplay(extraTimeGroup, (isRealtime || isMulti || isFixedTime) ? "none" : "flex");
            setElementDisplay(copyFormatGroup, "flex");
            setElementDisplay(timelineGroup, isMulti ? "none" : "flex");
            setElementDisplay(fixedTimeSlotCountGroup, isFixedTime ? "flex" : "none");
            setElementDisplay(fixedTimeDateGroup, isFixedTime ? "flex" : "none");
            setElementDisplay(rangeCountGroup, isMulti ? "flex" : "none");
            setElementDisplay(multiControlsFrame, isMulti ? "block" : "none");
            setElementDisplay(multiSubgroupRow, isMulti ? "flex" : "none");
            setElementDisplay(multiToolsRow, isMulti ? "flex" : "none");
            setElementDisplay(saveTableImageBtn, "");
            setElementDisplay(saveMultiRangeTitlesImageBtn, isMulti ? "" : "none");
            if (!getBooleanDep("getShowCopyFormat") && copyFormatRow) setElementDisplay(copyFormatRow, "none");
            invokeDep("refreshMultiRangeControls");
            refreshOptionToggleDividers();
        }

        function switchMainTab(tab) {
            const doc = getDocumentRef();
            const nextTab = sanitizeMainTab(tab);
            invokeDep("hideFloatingTooltip");
            invokeDep("syncCurrentMultiStateToActiveSubgroup");

            let currentMainTab = getMainTab(invokeDep("getCurrentMainTab"));
            let activeGroupId = clampGroupIndex(invokeDep("getActiveGroupId"));
            const rawActiveGroupIdByMainTab = invokeDep("getActiveGroupIdByMainTab");
            const activeGroupIdByMainTab = {
                live: 0,
                fixed: 0,
                ...((rawActiveGroupIdByMainTab && typeof rawActiveGroupIdByMainTab === "object")
                    ? rawActiveGroupIdByMainTab
                    : {})
            };

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupIdByMainTab[currentMainTab] = clampGroupIndex(activeGroupId);
            }

            currentMainTab = nextTab;
            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = clampGroupIndex(activeGroupIdByMainTab[currentMainTab]);
            } else {
                activeGroupId = clampGroupIndex(activeGroupId);
            }

            invokeDep("setCurrentMainTab", currentMainTab);
            invokeDep("setActiveGroupId", activeGroupId);
            invokeDep("setActiveGroupIdByMainTab", activeGroupIdByMainTab);
            invokeDep("normalizeGroupTabState");

            if (doc && typeof doc.querySelectorAll === "function") {
                const navButtons = Array.from(doc.querySelectorAll(".nav-item") || []);
                navButtons.forEach((btn) => {
                    toggleClass(btn, "active", btn?.dataset?.tab === currentMainTab);
                });
            }
            const isMulti = getBooleanDep("isMultiTab");
            const isCalc = currentMainTab === "calc";
            const isFixedTime = getBooleanDep("isFixedTimeTab");
            toggleClass(doc?.getElementById?.("timezone-section"), "active", !isCalc && !isMulti && !isFixedTime);
            toggleClass(doc?.getElementById?.("fixed-time-section"), "active", isFixedTime);
            toggleClass(doc?.getElementById?.("multi-range-section"), "active", isMulti);
            toggleClass(doc?.getElementById?.("calc-section"), "active", isCalc);
            const groupTabsContainer = doc?.getElementById?.("group-tabs-container");
            if (groupTabsContainer) groupTabsContainer.style.display = isCalc ? "none" : "flex";
            const topControlBar = doc?.getElementById?.("top-control-bar");
            if (topControlBar) topControlBar.style.display = isCalc ? "none" : "flex";

            invokeDep("setIsRealtime", currentMainTab === "live");
            const isRealtime = getBooleanDep("getIsRealtime");
            if (isRealtime) {
                invokeDep("syncRealtimeNow");
            }
            const extraTimeToggle = doc?.getElementById?.("toggle-extra-time");
            const copyFormatToggle = doc?.getElementById?.("toggle-copy-format");
            const timelineToggle = doc?.getElementById?.("toggle-timeline");

            if (extraTimeToggle) {
                extraTimeToggle.disabled = isRealtime || isMulti || isFixedTime;
                if (isRealtime) extraTimeToggle.checked = false;
                else if (isFixedTime) extraTimeToggle.checked = false;
                else if (isMulti) extraTimeToggle.checked = true;
                else extraTimeToggle.checked = (Number(invokeDep("getSlotCount")) > 1);
            }

            if (copyFormatToggle) {
                copyFormatToggle.checked = getBooleanDep("getShowCopyFormat");
            }
            if (timelineToggle) {
                timelineToggle.checked = getBooleanDep("getShowTimeline");
            }
            updateOptionRowVisibility();
            invokeDep("renderTimelineFrame");

            if (isMulti) {
                invokeDep("renderBaseTimeSelect");
                invokeDep("loadCurrentMultiStateFromActiveSubgroup");
            }
            invokeDep("renderGroups");
            invokeDep("renderMultiSubgroups");
            if (isMulti) {
                invokeDep("renderMultiRanges");
            } else if (isFixedTime) {
                invokeDep("renderFixedTimeTab");
                invokeDep("updateTimeAdjustPanel");
            } else {
                invokeDep("renderList");
                invokeDep("updateTimeAdjustPanel");
            }
            invokeDep("renderCopyFormatControls");
            invokeDep("savePersistence");
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
