(function initGtvMainPersistenceSnapshotServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getState = (typeof safeDeps.getState === "function")
            ? safeDeps.getState
            : (() => ({}));
        const setState = (typeof safeDeps.setState === "function")
            ? safeDeps.setState
            : (() => { });
        const sanitizeMainTab = (typeof safeDeps.sanitizeMainTab === "function")
            ? safeDeps.sanitizeMainTab
            : ((tab) => String(tab || "live"));
        const syncActiveFormatProfileFromState = (typeof safeDeps.syncActiveFormatProfileFromState === "function")
            ? safeDeps.syncActiveFormatProfileFromState
            : (() => { });
        const syncCurrentMultiStateToActiveSubgroup = (typeof safeDeps.syncCurrentMultiStateToActiveSubgroup === "function")
            ? safeDeps.syncCurrentMultiStateToActiveSubgroup
            : (() => { });
        const normalizeGroupTabState = (typeof safeDeps.normalizeGroupTabState === "function")
            ? safeDeps.normalizeGroupTabState
            : (() => { });
        const ensureMultiRangeState = (typeof safeDeps.ensureMultiRangeState === "function")
            ? safeDeps.ensureMultiRangeState
            : (() => { });
        const getGroups = (typeof safeDeps.getGroups === "function")
            ? safeDeps.getGroups
            : (() => []);
        const ensureGroupFixedTimes = (typeof safeDeps.ensureGroupFixedTimes === "function")
            ? safeDeps.ensureGroupFixedTimes
            : (() => { });
        const ensureGroupMultiSubgroups = (typeof safeDeps.ensureGroupMultiSubgroups === "function")
            ? safeDeps.ensureGroupMultiSubgroups
            : (() => { });
        const sanitizeFormatProfiles = (typeof safeDeps.sanitizeFormatProfiles === "function")
            ? safeDeps.sanitizeFormatProfiles
            : ((profiles) => profiles || {});
        const getCurrentFormatProfileState = (typeof safeDeps.getCurrentFormatProfileState === "function")
            ? safeDeps.getCurrentFormatProfileState
            : (() => null);
        const getCurrentGroupBaseTimezoneId = (typeof safeDeps.getCurrentGroupBaseTimezoneId === "function")
            ? safeDeps.getCurrentGroupBaseTimezoneId
            : (() => "utc");
        const sanitizeCopyFormatOrder = (typeof safeDeps.sanitizeCopyFormatOrder === "function")
            ? safeDeps.sanitizeCopyFormatOrder
            : ((order) => Array.isArray(order) ? order : []);
        const sanitizeCopyFormatEnabled = (typeof safeDeps.sanitizeCopyFormatEnabled === "function")
            ? safeDeps.sanitizeCopyFormatEnabled
            : ((enabled) => (enabled && typeof enabled === "object") ? enabled : {});
        const sanitizeTimePartsEnabled = (typeof safeDeps.sanitizeTimePartsEnabled === "function")
            ? safeDeps.sanitizeTimePartsEnabled
            : ((parts) => (parts && typeof parts === "object") ? parts : {});
        const getTimeAdjustDayStep = (typeof safeDeps.getTimeAdjustDayStep === "function")
            ? safeDeps.getTimeAdjustDayStep
            : (() => 1);
        const sanitizeMultiRangeCount = (typeof safeDeps.sanitizeMultiRangeCount === "function")
            ? safeDeps.sanitizeMultiRangeCount
            : ((value) => {
                const parsed = Number(value);
                if (!Number.isFinite(parsed)) return 1;
                return Math.max(1, Math.trunc(parsed));
            });
        const sanitizeMultiRangeTitle = (typeof safeDeps.sanitizeMultiRangeTitle === "function")
            ? safeDeps.sanitizeMultiRangeTitle
            : ((value) => String(value || "").trim());
        const getCurrentMultiSubgroupName = (typeof safeDeps.getCurrentMultiSubgroupName === "function")
            ? safeDeps.getCurrentMultiSubgroupName
            : (() => "subgroup");
        const sanitizeUtcMs = (typeof safeDeps.sanitizeUtcMs === "function")
            ? safeDeps.sanitizeUtcMs
            : ((value, fallbackMs) => {
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : fallbackMs;
            });
        const now = (typeof safeDeps.now === "function")
            ? safeDeps.now
            : (() => Date.now());

        function getPersistenceSnapshot() {
            const before = getState() || {};

            const safeMainTab = sanitizeMainTab(before.currentMainTab);
            setState({ currentMainTab: safeMainTab });

            syncActiveFormatProfileFromState();
            syncCurrentMultiStateToActiveSubgroup();

            const afterSync = getState() || {};
            if (safeMainTab === "live" || safeMainTab === "fixed") {
                const mapped = (afterSync.activeGroupIdByMainTab && typeof afterSync.activeGroupIdByMainTab === "object")
                    ? { ...afterSync.activeGroupIdByMainTab }
                    : {};
                mapped[safeMainTab] = afterSync.activeGroupId;
                setState({ activeGroupIdByMainTab: mapped });
            }

            normalizeGroupTabState();
            ensureMultiRangeState();

            const groups = Array.isArray(getGroups()) ? getGroups() : [];
            groups.forEach((group) => {
                ensureGroupFixedTimes(group);
                ensureGroupMultiSubgroups(group);
            });

            const afterGroupSync = getState() || {};
            const nextFormatProfiles = sanitizeFormatProfiles(
                afterGroupSync.formatProfiles,
                getCurrentFormatProfileState()
            );
            setState({ formatProfiles: nextFormatProfiles });

            const state = getState() || {};
            const safeRanges = Array.isArray(state.multiRanges) ? state.multiRanges : [];
            const safeCollapsed = Array.isArray(state.multiRangeCollapsed) ? state.multiRangeCollapsed : [];
            const safeStartEditFlags = Array.isArray(state.multiRangeStartEditEnabled) ? state.multiRangeStartEditEnabled : [];
            const safeEndEditFlags = Array.isArray(state.multiRangeEndEditEnabled) ? state.multiRangeEndEditEnabled : [];

            return {
                groups,
                activeGroupId: state.activeGroupId,
                currentMainTab: state.currentMainTab,
                activeGroupIdByMainTab: state.activeGroupIdByMainTab,
                slotCount: state.slotCount,
                baseTimezoneId: getCurrentGroupBaseTimezoneId(),
                showCopyFormat: !!state.showCopyFormat,
                showTimeline: !!state.showTimeline,
                displayFormatOrder: sanitizeCopyFormatOrder(state.displayFormatOrder),
                displayFormatEnabled: sanitizeCopyFormatEnabled(state.displayFormatEnabled, "display"),
                displayTimePartsEnabled: sanitizeTimePartsEnabled(state.displayTimePartsEnabled, "display"),
                copyFormatOrder: sanitizeCopyFormatOrder(state.copyFormatOrder),
                copyFormatEnabled: sanitizeCopyFormatEnabled(state.copyFormatEnabled, "copy"),
                copyTimePartsEnabled: sanitizeTimePartsEnabled(state.copyTimePartsEnabled, "copy"),
                formatProfiles: nextFormatProfiles,
                activeFormatProfileContext: state.activeFormatProfileContext,
                timeAdjustDayStepBySlot: [
                    getTimeAdjustDayStep(0),
                    getTimeAdjustDayStep(1)
                ],
                multiRangeCount: sanitizeMultiRangeCount(state.multiRangeCount),
                multiRangeTitle: sanitizeMultiRangeTitle(getCurrentMultiSubgroupName()),
                multiRanges: safeRanges.map((range) => ({
                    startUtcMs: sanitizeUtcMs(range?.startUtcMs, now()),
                    endUtcMs: sanitizeUtcMs(range?.endUtcMs, now())
                })),
                multiRangeCollapsed: safeCollapsed.map((flag) => !!flag),
                multiRangeStartEditEnabled: safeStartEditFlags.map((flag) => !!flag),
                multiRangeEndEditEnabled: safeEndEditFlags.map((flag) => !!flag)
            };
        }

        return Object.freeze({
            getPersistenceSnapshot
        });
    }

    globalObj.GTVMainPersistenceSnapshotServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
