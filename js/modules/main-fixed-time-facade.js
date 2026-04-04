(function initGtvMainFixedTimeFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        function resolveFunction(candidate, fallbackFn) {
            if (typeof candidate === "function") return candidate;
            return fallbackFn;
        }

        const callServiceMethod = resolveFunction(safeDeps.callServiceMethod, () => undefined);
        const getFixedTimeCoreService = resolveFunction(safeDeps.getFixedTimeCoreService, () => null);
        const getFixedTimeActionsService = resolveFunction(safeDeps.getFixedTimeActionsService, () => null);
        const getCopyFormatOrderState = resolveFunction(safeDeps.getCopyFormatOrderState, () => []);
        const getCopyFormatEnabledState = resolveFunction(safeDeps.getCopyFormatEnabledState, () => ({}));
        const getCopyTimePartsEnabledState = resolveFunction(safeDeps.getCopyTimePartsEnabledState, () => ({}));
        const sanitizeCopyFormatOrderForContext = resolveFunction(
            safeDeps.sanitizeCopyFormatOrderForContext,
            (value) => Array.isArray(value) ? [...value] : []
        );
        const sanitizeCopyFormatEnabledForContext = resolveFunction(
            safeDeps.sanitizeCopyFormatEnabledForContext,
            (value) => (value && typeof value === "object") ? { ...value } : {}
        );
        const sanitizeTimePartsEnabledForContext = resolveFunction(
            safeDeps.sanitizeTimePartsEnabledForContext,
            (value) => (value && typeof value === "object") ? { ...value } : {}
        );
        const logWarn = resolveFunction(
            safeDeps.logWarn,
            (...args) => {
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
        );
        const getWindowRef = resolveFunction(
            safeDeps.getWindowRef,
            () => {
                if (safeDeps.windowRef && typeof safeDeps.windowRef === "object") return safeDeps.windowRef;
                if (safeDeps.window && typeof safeDeps.window === "object") return safeDeps.window;
                if (globalObj?.window && typeof globalObj.window === "object") return globalObj.window;
                if (typeof window === "object" && window) return window;
                if (globalObj && typeof globalObj === "object") return globalObj;
                return null;
            }
        );
        const getDocumentRef = resolveFunction(
            safeDeps.getDocumentRef,
            () => {
                if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
                if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
                const safeWindow = getWindowRef();
                if (safeWindow?.document && typeof safeWindow.document === "object") return safeWindow.document;
                if (globalObj?.document && typeof globalObj.document === "object") return globalObj.document;
                if (typeof document === "object" && document) return document;
                return null;
            }
        );
        const t = resolveFunction(safeDeps.t, (key) => String(key || ""));

        function getFixedTimeSlotParts(slot) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getFixedTimeSlotParts",
                [slot],
                { fallback: null }
            );
        }

        function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = new Date()) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "resolveFixedTimeSlotUtcDate",
                [slot, baseRef, anchorDate],
                { fallback: null }
            );
        }

        function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "formatFixedTimeForTimezoneAtUtc",
                [utcDate, tz],
                { fallback: "--:--:--" }
            );
        }

        function getFixedTimeDisplayPartsEnabled() {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getFixedTimeDisplayPartsEnabled",
                [],
                { fallback: { dn: true, time: true, weekday: true } }
            );
        }

        function getLocalizedWeekdayNameByIndex(weekdayIndex) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getLocalizedWeekdayNameByIndex",
                [weekdayIndex],
                { fallback: "" }
            );
        }

        function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "buildFixedTimeDisplayPayloadAtUtc",
                [utcDate, tz],
                { fallback: null }
            );
        }

        function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getFixedTimeSlotHeaderLabel",
                [slot, slotIdx, slotCount],
                { fallback: `${t("th_fixed_time")} ${slotIdx + 1}` }
            );
        }

        function formatFixedTimePayloadText(payload, partsEnabled) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "formatFixedTimePayloadText",
                [payload, partsEnabled],
                { fallback: "-" }
            );
        }

        function getFixedTimeCopyState() {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "getFixedTimeCopyState",
                [],
                {
                    fallback: {
                        order: sanitizeCopyFormatOrderForContext(getCopyFormatOrderState(), "fixed-time"),
                        enabled: sanitizeCopyFormatEnabledForContext(getCopyFormatEnabledState(), "copy", "fixed-time"),
                        timePartsEnabled: sanitizeTimePartsEnabledForContext(
                            getCopyTimePartsEnabledState(),
                            "copy",
                            "fixed-time"
                        )
                    }
                }
            );
        }

        function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "buildFixedTimeSnapshotForTimezoneSlot",
                [tz, slotUtcDate],
                { fallback: null }
            );
        }

        function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "formatFixedTimeCopyTextForTimezoneSlot",
                [tz, slotUtcDate, copyState],
                { fallback: "" }
            );
        }

        function getFixedTimeSlotUtcDateByIndex(slotIdx) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "getFixedTimeSlotUtcDateByIndex",
                [slotIdx],
                { fallback: null }
            );
        }

        function getFixedTimePreviewCopyText() {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "getFixedTimePreviewCopyText",
                [],
                { fallback: "" }
            );
        }

        function getAllFixedTimeRowsCopyText() {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "getAllFixedTimeRowsCopyText",
                [],
                { fallback: "" }
            );
        }

        async function copyFixedTimeCellPayload(payload, partsEnabled) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "copyFixedTimeCellPayload",
                [payload, partsEnabled],
                { toastOnMissing: true, featureKey: "fixed-time-copy-cell" }
            );
        }

        async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "copyFixedTimeCellByTimezone",
                [tz, slotUtcDate],
                { toastOnMissing: true, featureKey: "fixed-time-copy-timezone" }
            );
        }

        function buildFixedTimeCellInputValue(utcDate, tz) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "buildFixedTimeCellInputValue",
                [utcDate, tz],
                { fallback: "" }
            );
        }

        function buildFixedTimeCellTimeParts(rawValue) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "buildFixedTimeCellTimeParts",
                [rawValue],
                { fallback: null }
            );
        }

        function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "applyFixedTimeSlotByTimezoneInput",
                [slotIdx, tz, rawValue, anchorUtcDate],
                { fallback: false, toastOnMissing: true, featureKey: "fixed-time-apply-input" }
            );
        }

        function bindCustomDatePickerForInput(input, triggerBtn, options = {}) {
            const safeWindow = getWindowRef();
            const safeDocument = getDocumentRef();
            const CustomDatePickerCtor = safeWindow?.CustomDatePicker;
            if (!CustomDatePickerCtor) {
                logWarn("CustomDatePicker module is unavailable. Date picker binding is skipped.");
                return;
            }

            const preserveValue = !!options?.preserveValue;
            const pickerType = (options?.type === "date" || options?.type === "time" || options?.type === "datetime")
                ? options.type
                : "datetime";
            const preservedInputValue = preserveValue ? String(input.value || "") : "";

            if (input._cdp && typeof input._cdp.destroy === "function") {
                input._cdp.destroy();
            }

            input._cdp = new CustomDatePickerCtor(input, {
                type: pickerType,
                lang: safeDocument?.documentElement?.lang || "en",
                theme: safeDocument?.documentElement?.getAttribute?.("data-theme") || "dark",
                triggerElement: triggerBtn || null
            });

            if (preserveValue) {
                input.value = preservedInputValue;
            }
        }

        async function copyFixedTimeSlotColumn(slotIdx) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "copyFixedTimeSlotColumn",
                [slotIdx],
                { toastOnMissing: true, featureKey: "fixed-time-copy-column" }
            );
        }

        function renameFixedTimeSlot(slotIdx) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "renameFixedTimeSlot",
                [slotIdx],
                { toastOnMissing: true, featureKey: "fixed-time-rename-slot" }
            );
        }

        function updateFixedTimeSlotTime(slotIdx, rawValue) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "updateFixedTimeSlotTime",
                [slotIdx, rawValue],
                { fallback: false, toastOnMissing: true, featureKey: "fixed-time-update-slot" }
            );
        }

        function addFixedTimeSlot() {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "addFixedTimeSlot",
                [],
                { toastOnMissing: true, featureKey: "fixed-time-add-slot" }
            );
        }

        function removeFixedTimeSlot(slotId) {
            return callServiceMethod(
                "fixedTimeActionsService",
                getFixedTimeActionsService(),
                "removeFixedTimeSlot",
                [slotId],
                { toastOnMissing: true, featureKey: "fixed-time-remove-slot" }
            );
        }

        return Object.freeze({
            getFixedTimeSlotParts,
            resolveFixedTimeSlotUtcDate,
            formatFixedTimeForTimezoneAtUtc,
            getFixedTimeDisplayPartsEnabled,
            getLocalizedWeekdayNameByIndex,
            buildFixedTimeDisplayPayloadAtUtc,
            getFixedTimeSlotHeaderLabel,
            formatFixedTimePayloadText,
            getFixedTimeCopyState,
            buildFixedTimeSnapshotForTimezoneSlot,
            formatFixedTimeCopyTextForTimezoneSlot,
            getFixedTimeSlotUtcDateByIndex,
            getFixedTimePreviewCopyText,
            getAllFixedTimeRowsCopyText,
            copyFixedTimeCellPayload,
            copyFixedTimeCellByTimezone,
            buildFixedTimeCellInputValue,
            buildFixedTimeCellTimeParts,
            applyFixedTimeSlotByTimezoneInput,
            bindCustomDatePickerForInput,
            copyFixedTimeSlotColumn,
            renameFixedTimeSlot,
            updateFixedTimeSlotTime,
            addFixedTimeSlot,
            removeFixedTimeSlot
        });
    }

    globalObj.GTVMainFixedTimeFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
