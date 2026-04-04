(function initGtvTabUi(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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
            return (typeof document === "object" && document) ? document : null;
        }

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
                    logWarn(`[GTVTabUI] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            sanitizeMainTab: toSafeCallable("sanitizeMainTab", safeDeps.sanitizeMainTab),
            clampGroupIndex: toSafeCallable("clampGroupIndex", safeDeps.clampGroupIndex),
            isMultiTab: toSafeCallable("isMultiTab", safeDeps.isMultiTab),
            isFixedTimeTab: toSafeCallable("isFixedTimeTab", safeDeps.isFixedTimeTab),
            getIsRealtime: toSafeCallable("getIsRealtime", safeDeps.getIsRealtime),
            getShowCopyFormat: toSafeCallable("getShowCopyFormat", safeDeps.getShowCopyFormat),
            getShowTimeline: toSafeCallable("getShowTimeline", safeDeps.getShowTimeline),
            refreshMultiRangeControls: toSafeCallable("refreshMultiRangeControls", safeDeps.refreshMultiRangeControls),
            hideFloatingTooltip: toSafeCallable("hideFloatingTooltip", safeDeps.hideFloatingTooltip),
            syncCurrentMultiStateToActiveSubgroup: toSafeCallable("syncCurrentMultiStateToActiveSubgroup", safeDeps.syncCurrentMultiStateToActiveSubgroup),
            getCurrentMainTab: toSafeCallable("getCurrentMainTab", safeDeps.getCurrentMainTab),
            getActiveGroupId: toSafeCallable("getActiveGroupId", safeDeps.getActiveGroupId),
            getActiveGroupIdByMainTab: toSafeCallable("getActiveGroupIdByMainTab", safeDeps.getActiveGroupIdByMainTab),
            setCurrentMainTab: toSafeCallable("setCurrentMainTab", safeDeps.setCurrentMainTab),
            setActiveGroupId: toSafeCallable("setActiveGroupId", safeDeps.setActiveGroupId),
            setActiveGroupIdByMainTab: toSafeCallable("setActiveGroupIdByMainTab", safeDeps.setActiveGroupIdByMainTab),
            normalizeGroupTabState: toSafeCallable("normalizeGroupTabState", safeDeps.normalizeGroupTabState),
            setIsRealtime: toSafeCallable("setIsRealtime", safeDeps.setIsRealtime),
            syncRealtimeNow: toSafeCallable("syncRealtimeNow", safeDeps.syncRealtimeNow),
            getSlotCount: toSafeCallable("getSlotCount", safeDeps.getSlotCount),
            renderTimelineFrame: toSafeCallable("renderTimelineFrame", safeDeps.renderTimelineFrame),
            renderBaseTimeSelect: toSafeCallable("renderBaseTimeSelect", safeDeps.renderBaseTimeSelect),
            loadCurrentMultiStateFromActiveSubgroup: toSafeCallable("loadCurrentMultiStateFromActiveSubgroup", safeDeps.loadCurrentMultiStateFromActiveSubgroup),
            renderGroups: toSafeCallable("renderGroups", safeDeps.renderGroups),
            renderMultiSubgroups: toSafeCallable("renderMultiSubgroups", safeDeps.renderMultiSubgroups),
            renderMultiRanges: toSafeCallable("renderMultiRanges", safeDeps.renderMultiRanges),
            renderFixedTimeTab: toSafeCallable("renderFixedTimeTab", safeDeps.renderFixedTimeTab),
            updateTimeAdjustPanel: toSafeCallable("updateTimeAdjustPanel", safeDeps.updateTimeAdjustPanel),
            renderList: toSafeCallable("renderList", safeDeps.renderList),
            renderCopyFormatControls: toSafeCallable("renderCopyFormatControls", safeDeps.renderCopyFormatControls),
            savePersistence: toSafeCallable("savePersistence", safeDeps.savePersistence)
        });

        function getBooleanDep(resolver, fallback = false) {
            const value = resolver();
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
            const nextTab = dep.sanitizeMainTab(tab);
            if (typeof nextTab === "string" && nextTab.trim()) return nextTab;
            return getMainTab(tab);
        }

        function clampGroupIndex(index) {
            const clamped = dep.clampGroupIndex(index);
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
            const isMulti = getBooleanDep(dep.isMultiTab);
            const isFixedTime = getBooleanDep(dep.isFixedTimeTab);
            const isRealtime = getBooleanDep(dep.getIsRealtime);

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
            if (!getBooleanDep(dep.getShowCopyFormat) && copyFormatRow) setElementDisplay(copyFormatRow, "none");
            dep.refreshMultiRangeControls();
            refreshOptionToggleDividers();
        }

        function switchMainTab(tab) {
            const doc = getDocumentRef();
            const nextTab = sanitizeMainTab(tab);
            dep.hideFloatingTooltip();
            dep.syncCurrentMultiStateToActiveSubgroup();

            let currentMainTab = getMainTab(dep.getCurrentMainTab());
            let activeGroupId = clampGroupIndex(dep.getActiveGroupId());
            const rawActiveGroupIdByMainTab = dep.getActiveGroupIdByMainTab();
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

            dep.setCurrentMainTab(currentMainTab);
            dep.setActiveGroupId(activeGroupId);
            dep.setActiveGroupIdByMainTab(activeGroupIdByMainTab);
            dep.normalizeGroupTabState();

            if (doc && typeof doc.querySelectorAll === "function") {
                const navButtons = Array.from(doc.querySelectorAll(".nav-item") || []);
                navButtons.forEach((btn) => {
                    toggleClass(btn, "active", btn?.dataset?.tab === currentMainTab);
                });
            }
            const isMulti = getBooleanDep(dep.isMultiTab);
            const isCalc = currentMainTab === "calc";
            const isFixedTime = getBooleanDep(dep.isFixedTimeTab);
            toggleClass(doc?.getElementById?.("timezone-section"), "active", !isCalc && !isMulti && !isFixedTime);
            toggleClass(doc?.getElementById?.("fixed-time-section"), "active", isFixedTime);
            toggleClass(doc?.getElementById?.("multi-range-section"), "active", isMulti);
            toggleClass(doc?.getElementById?.("calc-section"), "active", isCalc);
            const groupTabsContainer = doc?.getElementById?.("group-tabs-container");
            if (groupTabsContainer) groupTabsContainer.style.display = isCalc ? "none" : "flex";
            const topControlBar = doc?.getElementById?.("top-control-bar");
            if (topControlBar) topControlBar.style.display = isCalc ? "none" : "flex";

            dep.setIsRealtime(currentMainTab === "live");
            const isRealtime = getBooleanDep(dep.getIsRealtime);
            if (isRealtime) {
                dep.syncRealtimeNow();
            }
            const extraTimeToggle = doc?.getElementById?.("toggle-extra-time");
            const copyFormatToggle = doc?.getElementById?.("toggle-copy-format");
            const timelineToggle = doc?.getElementById?.("toggle-timeline");

            if (extraTimeToggle) {
                extraTimeToggle.disabled = isRealtime || isMulti || isFixedTime;
                if (isRealtime) extraTimeToggle.checked = false;
                else if (isFixedTime) extraTimeToggle.checked = false;
                else if (isMulti) extraTimeToggle.checked = true;
                else extraTimeToggle.checked = (Number(dep.getSlotCount()) > 1);
            }

            if (copyFormatToggle) {
                copyFormatToggle.checked = getBooleanDep(dep.getShowCopyFormat);
            }
            if (timelineToggle) {
                timelineToggle.checked = getBooleanDep(dep.getShowTimeline);
            }
            updateOptionRowVisibility();
            dep.renderTimelineFrame();

            if (isMulti) {
                dep.renderBaseTimeSelect();
                dep.loadCurrentMultiStateFromActiveSubgroup();
            }
            dep.renderGroups();
            dep.renderMultiSubgroups();
            if (isMulti) {
                dep.renderMultiRanges();
            } else if (isFixedTime) {
                dep.renderFixedTimeTab();
                dep.updateTimeAdjustPanel();
            } else {
                dep.renderList();
                dep.updateTimeAdjustPanel();
            }
            dep.renderCopyFormatControls();
            dep.savePersistence();
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
