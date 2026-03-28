(function initGtvMainPatchedStateAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainAppStateBridgeService = (typeof safeDeps.getMainAppStateBridgeService === "function")
            ? safeDeps.getMainAppStateBridgeService
            : (() => null);
        const getMainPatchedStateSelectorsService = (typeof safeDeps.getMainPatchedStateSelectorsService === "function")
            ? safeDeps.getMainPatchedStateSelectorsService
            : (() => null);

        function invokeMainAppStateBridge(methodName, args = []) {
            const service = getMainAppStateBridgeService();
            if (!service || typeof service[methodName] !== "function") {
                throw new Error(`Missing required module API: mainAppStateBridgeService.${methodName}`);
            }
            return service[methodName](...args);
        }

        function invokeMainPatchedStateSelectors(methodName, args = []) {
            const service = getMainPatchedStateSelectorsService();
            if (!service || typeof service[methodName] !== "function") {
                throw new Error(`Missing required module API: mainPatchedStateSelectorsService.${methodName}`);
            }
            return service[methodName](...args);
        }

        function getPatchedAppStateSnapshot() { return invokeMainAppStateBridge("getPatchedAppStateSnapshot"); }
        function patchAppState(next = {}) { return invokeMainAppStateBridge("patchAppState", [next]); }
        function getPatchedStateValue(key, fallbackValue) {
            return invokeMainAppStateBridge("getPatchedStateValue", [key, fallbackValue]);
        }
        function getPatchedIntegerStateValue(key, fallbackValue = 0) {
            return invokeMainAppStateBridge("getPatchedIntegerStateValue", [key, fallbackValue]);
        }
        function getPatchedBooleanStateValue(key, fallbackValue = false) {
            return invokeMainAppStateBridge("getPatchedBooleanStateValue", [key, fallbackValue]);
        }
        function getPatchedStringStateValue(key, fallbackValue = "") {
            return invokeMainAppStateBridge("getPatchedStringStateValue", [key, fallbackValue]);
        }
        function getPatchedArrayStateValue(key, fallbackValue = []) {
            return invokeMainAppStateBridge("getPatchedArrayStateValue", [key, fallbackValue]);
        }
        function getPatchedObjectStateValue(key, fallbackValue = {}) {
            return invokeMainAppStateBridge("getPatchedObjectStateValue", [key, fallbackValue]);
        }
        function getPatchedMainTabState() { return invokeMainPatchedStateSelectors("getPatchedMainTabState"); }
        function getPatchedSlotCountState() { return invokeMainPatchedStateSelectors("getPatchedSlotCountState"); }
        function setPatchedSlotCountState(next) {
            return invokeMainPatchedStateSelectors("setPatchedSlotCountState", [next]);
        }
        function getPatchedShowCopyFormatState() {
            return invokeMainPatchedStateSelectors("getPatchedShowCopyFormatState");
        }
        function setPatchedShowCopyFormatState(next) {
            return invokeMainPatchedStateSelectors("setPatchedShowCopyFormatState", [next]);
        }
        function getPatchedShowTimelineState() { return invokeMainPatchedStateSelectors("getPatchedShowTimelineState"); }
        function setPatchedShowTimelineState(next) {
            return invokeMainPatchedStateSelectors("setPatchedShowTimelineState", [next]);
        }
        function getPatchedCurrentThemeState() { return invokeMainPatchedStateSelectors("getPatchedCurrentThemeState"); }
        function getPatchedDayStartHourState() { return invokeMainPatchedStateSelectors("getPatchedDayStartHourState"); }
        function getPatchedNightStartHourState() {
            return invokeMainPatchedStateSelectors("getPatchedNightStartHourState");
        }
        function getPatchedCurrentLangState() { return invokeMainPatchedStateSelectors("getPatchedCurrentLangState"); }
        function getPatchedDisplayFormatOrderState() {
            return invokeMainPatchedStateSelectors("getPatchedDisplayFormatOrderState");
        }
        function getPatchedDisplayFormatEnabledState() {
            return invokeMainPatchedStateSelectors("getPatchedDisplayFormatEnabledState");
        }
        function getPatchedDisplayTimePartsEnabledState() {
            return invokeMainPatchedStateSelectors("getPatchedDisplayTimePartsEnabledState");
        }
        function getPatchedCopyFormatOrderState() {
            return invokeMainPatchedStateSelectors("getPatchedCopyFormatOrderState");
        }
        function getPatchedCopyFormatEnabledState() {
            return invokeMainPatchedStateSelectors("getPatchedCopyFormatEnabledState");
        }
        function getPatchedCopyTimePartsEnabledState() {
            return invokeMainPatchedStateSelectors("getPatchedCopyTimePartsEnabledState");
        }
        function getPatchedActiveFormatProfileContextState() {
            return invokeMainPatchedStateSelectors("getPatchedActiveFormatProfileContextState");
        }
        function getPatchedActiveGroupIdState() { return invokeMainPatchedStateSelectors("getPatchedActiveGroupIdState"); }
        function getPatchedMultiRangeCountState() {
            return invokeMainPatchedStateSelectors("getPatchedMultiRangeCountState");
        }
        function getPatchedMultiRangesState() { return invokeMainPatchedStateSelectors("getPatchedMultiRangesState"); }
        function getPatchedMultiRangeCollapsedState() {
            return invokeMainPatchedStateSelectors("getPatchedMultiRangeCollapsedState");
        }
        function getPatchedTimeAdjustDayStepBySlotState() {
            return invokeMainPatchedStateSelectors("getPatchedTimeAdjustDayStepBySlotState");
        }
        function getPatchedMultiRangeTitleState() {
            return invokeMainPatchedStateSelectors("getPatchedMultiRangeTitleState");
        }

        return Object.freeze({
            getPatchedAppStateSnapshot,
            patchAppState,
            getPatchedStateValue,
            getPatchedIntegerStateValue,
            getPatchedBooleanStateValue,
            getPatchedStringStateValue,
            getPatchedArrayStateValue,
            getPatchedObjectStateValue,
            getPatchedMainTabState,
            getPatchedSlotCountState,
            setPatchedSlotCountState,
            getPatchedShowCopyFormatState,
            setPatchedShowCopyFormatState,
            getPatchedShowTimelineState,
            setPatchedShowTimelineState,
            getPatchedCurrentThemeState,
            getPatchedDayStartHourState,
            getPatchedNightStartHourState,
            getPatchedCurrentLangState,
            getPatchedDisplayFormatOrderState,
            getPatchedDisplayFormatEnabledState,
            getPatchedDisplayTimePartsEnabledState,
            getPatchedCopyFormatOrderState,
            getPatchedCopyFormatEnabledState,
            getPatchedCopyTimePartsEnabledState,
            getPatchedActiveFormatProfileContextState,
            getPatchedActiveGroupIdState,
            getPatchedMultiRangeCountState,
            getPatchedMultiRangesState,
            getPatchedMultiRangeCollapsedState,
            getPatchedTimeAdjustDayStepBySlotState,
            getPatchedMultiRangeTitleState
        });
    }

    globalObj.GTVMainPatchedStateAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
