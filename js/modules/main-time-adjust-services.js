(function initGtvMainTimeAdjustServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        function pickAliasedDeps(aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = safeDeps[aliasMap[targetKey]];
            });
            return resolved;
        }

        const timeAdjustUiApi = requireCreateServiceModule(safeDeps.GTV_TIME_ADJUST_UI, "GTVTimeAdjustUI");
        const multiBulkToolsApi = requireCreateServiceModule(safeDeps.GTV_MULTI_BULK_TOOLS, "GTVMultiBulkTools");
        const timeAdjustActionsApi = requireCreateServiceModule(safeDeps.GTV_TIME_ADJUST_ACTIONS, "GTVTimeAdjustActions");

        const timeAdjustUiService = timeAdjustUiApi.createService({
            ...pickDeps([
                "MIN_TIME_ADJUST_DAY_STEP",
                "MAX_TIME_ADJUST_DAY_STEP",
                "DEFAULT_TIME_ADJUST_DAY_STEP",
                "t",
                "savePersistence",
                "applyTimeAdjustAction",
                "getCurrentMainTab",
                "isRealtime",
                "getSlotCount",
                "getTimeAdjustDayStepValue",
                "setTimeAdjustDayStepValue",
                "upgradeNativeTitleTooltips"
            ])
        });

        const multiBulkToolsService = multiBulkToolsApi.createService({
            ...pickDeps([
                "t",
                "getMultiRangeCount"
            ]),
            renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
            createTimeAdjustActionButton: (labelKey, slotIdx, action, onAction = null, disabled = false) =>
                timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled),
            createTimeAdjustDivider: () => timeAdjustUiService.createTimeAdjustDivider(),
            ...pickDeps([
                "applyBulkRangeAllAction",
                "applyFirstRangeStartAdjustAction",
                "setAllMultiRangeStartEditEnabled",
                "setAllMultiRangeEndEditEnabled",
                "upgradeNativeTitleTooltips"
            ])
        });

        const timeAdjustActionsService = timeAdjustActionsApi.createService({
            ...pickDeps([
                "isRealtime",
                "getGlobalTimes",
                "updateClocks",
                "getBaseTimezoneRef",
                "getFixedOffsetForDisplay",
                "getFixedOffsetForDisplayAtDate",
                "getCustomOffsetMinutes",
                "getTimeAdjustDayStep",
                "timeService",
                "sanitizeUtcMs",
                "ensureMultiRangeState",
                "getMultiRanges",
                "isMultiRangeStartLinked",
                "isMultiTab",
                "renderMultiRanges"
            ]),
            ...pickAliasedDeps({
                "savePersistence": "savePersistenceForce"
            }),
            ...pickDeps([
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "syncLinkedRangesFrom",
                "getMultiRangeSlotDate",
                "setMultiRangeSlotDate",
                "syncFollowingRangesByDuration",
                "syncMultiRangeStartLinks"
            ])
        });

        return Object.freeze({
            timeAdjustUiService,
            multiBulkToolsService,
            timeAdjustActionsService
        });
    }

    globalObj.GTVMainTimeAdjustServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
