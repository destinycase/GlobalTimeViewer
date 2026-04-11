(function initGtvFixedTimeActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof safeDeps.consoleError === "function") {
                safeDeps.consoleError(...args);
                return;
            }
            if (typeof globalObj?.console?.error === "function") {
                globalObj.console.error(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVFixedTimeActions] Dependency "${depName}" threw.`, err);
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
                "sanitizeCopyFormatOrderForContext",
                "getCopyFormatOrder",
                "sanitizeCopyFormatEnabledForContext",
                "getCopyFormatEnabled",
                "sanitizeTimePartsEnabledForContext",
                "getCopyTimePartsEnabled",
                "getFixedOffsetForDisplayAtDate",
                "buildTimezoneComputedSnapshotForDates",
                "formatSnapshotText",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getBaseTimezoneRef",
                "getGlobalTime",
                "resolveFixedTimeSlotUtcDate",
                "getRenderableTimezoneRows",
                "getFixedTimeSlotHeaderLabel",
                "writeClipboard",
                "showToast",
                "buildFixedTimeDisplayPayloadAtUtc",
                "parseDateTimeParts",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "pad",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "renderFixedTimeTab",
                "renderTimelineFrame",
                "savePersistence",
                "sanitizeFixedTimeValue",
                "getFixedTimeSlotCount",
                "setFixedTimeSlotCount",
                "refreshFixedTimeSlotCountControls"
            ])
        });

        function getRenderableTimezoneRowsSafe(baseRef) {
            return asArray(dep.getRenderableTimezoneRows(baseRef));
        }

        function translate(key) {
            const value = dep.t(key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            return Number.isFinite(parsed) ? parsed : fallback;
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function formatFixedTimePayloadText(payload, partsEnabled) {
            const safeParts = (partsEnabled && typeof partsEnabled === "object")
                ? partsEnabled
                : { dn: true, time: true, weekday: true };
            const tokens = [];
            if (safeParts.dn && payload?.dayNightGlyph) tokens.push(payload.dayNightGlyph);
            if (safeParts.time) tokens.push(payload?.clock || "--:--:--");
            if (safeParts.weekday && payload?.dayName) tokens.push(payload.dayName);
            if (!tokens.length) return "-";
            return tokens.join(" ");
        }

        function getFixedTimeCopyState() {
            const order = dep.sanitizeCopyFormatOrderForContext(dep.getCopyFormatOrder(), "fixed-time");
            const enabled = dep.sanitizeCopyFormatEnabledForContext(dep.getCopyFormatEnabled(), "copy", "fixed-time");
            const timePartsEnabled = dep.sanitizeTimePartsEnabledForContext(dep.getCopyTimePartsEnabled(), "copy", "fixed-time");
            return { order, enabled, timePartsEnabled };
        }

        function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
            if (!tz || !isValidDate(slotUtcDate)) return null;
            const fixedDisplayOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(tz, slotUtcDate);
            return dep.buildTimezoneComputedSnapshotForDates(
                tz,
                [slotUtcDate],
                { fixedDisplayOffsetMinutes }
            ) || null;
        }

        function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
            const safeCopyState = (copyState && typeof copyState === "object")
                ? copyState
                : getFixedTimeCopyState();
            const snapshot = buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate);
            if (!snapshot) return "";
            return dep.formatSnapshotText(
                snapshot,
                safeCopyState.order,
                safeCopyState.enabled,
                safeCopyState.timePartsEnabled
            ) || "";
        }

        function getFixedTimeSlotUtcDateByIndex(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return null;
            const group = dep.getCurrentGroup();
            if (!group) return null;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;
            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return null;
            const anchor = dep.getGlobalTime(0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = dep.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
            return isValidDate(slotUtcDate) ? slotUtcDate : null;
        }

        function getFixedTimePreviewCopyText() {
            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return "";
            const slotUtcDate = getFixedTimeSlotUtcDateByIndex(0);
            if (!isValidDate(slotUtcDate)) return "";
            return formatFixedTimeCopyTextForTimezoneSlot(baseRef, slotUtcDate);
        }

        function getAllFixedTimeRowsCopyText() {
            const group = dep.getCurrentGroup();
            const baseRef = dep.getBaseTimezoneRef();
            if (!group || !baseRef) return "";
            dep.ensureGroupFixedTimes(group);
            if (!Array.isArray(group.fixedTimes) || !group.fixedTimes.length) return "";

            const rows = [baseRef, ...getRenderableTimezoneRowsSafe(baseRef)];
            if (!rows.length) return "";

            const copyState = getFixedTimeCopyState();
            const sections = [];
            group.fixedTimes.forEach((slot, slotIdx) => {
                const slotUtcDate = getFixedTimeSlotUtcDateByIndex(slotIdx);
                if (!isValidDate(slotUtcDate)) return;
                const lines = rows
                    .map((tz) => formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState))
                    .filter(Boolean);
                if (!lines.length) return;
                const slotLabel = dep.getFixedTimeSlotHeaderLabel(slot, slotIdx, group.fixedTimes.length) || "";
                sections.push([`[${slotLabel}]`, ...lines].join("\n"));
            });

            return sections.join("\n\n").trim();
        }

        async function copyFixedTimeCellPayload(payload, partsEnabled) {
            const text = formatFixedTimePayloadText(payload, partsEnabled);
            if (!text) return;
            try {
                await dep.writeClipboard(text);
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyFixedTimeCellPayload failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
            const text = formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate);
            if (!text) return;
            try {
                await dep.writeClipboard(text);
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyFixedTimeCellByTimezone failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        function buildFixedTimeCellInputValue(utcDate, tz) {
            const payload = dep.buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
            return payload?.clock || "";
        }

        function buildFixedTimeCellTimeParts(rawValue) {
            const timeParts = dep.parseDateTimeParts(rawValue, "time");
            if (timeParts) {
                const [hour, minute, second] = timeParts;
                return { hour, minute, second };
            }
            const datetimeParts = dep.parseDateTimeParts(rawValue, "datetime");
            if (datetimeParts) {
                const [, , , hour, minute, second] = datetimeParts;
                return { hour, minute, second };
            }
            return null;
        }

        function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return false;
            if (!tz || typeof tz !== "object") return false;
            const timeParts = buildFixedTimeCellTimeParts(rawValue);
            if (!timeParts) {
                dep.showToast(translate("toast_invalid_date"));
                dep.renderFixedTimeTab();
                return false;
            }

            const safeAnchorDate = isValidDate(anchorUtcDate) ? anchorUtcDate : new Date();
            const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(tz, safeAnchorDate);
            const anchorLocal = dep.getLocalPartsByTimezone(safeAnchorDate, tz, fixedOffsetMinutes);
            const localParts = {
                year: anchorLocal.year,
                month: anchorLocal.month,
                day: anchorLocal.day,
                hour: timeParts.hour,
                minute: timeParts.minute,
                second: timeParts.second
            };
            const nextUtcDate = dep.getUTCDateFromLocalParts(localParts, tz, fixedOffsetMinutes);
            if (!isValidDate(nextUtcDate)) {
                dep.showToast(translate("toast_invalid_date"));
                dep.renderFixedTimeTab();
                return false;
            }

            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return false;
            const baseOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(baseRef, nextUtcDate);
            const baseLocal = dep.getLocalPartsByTimezone(nextUtcDate, baseRef, baseOffsetMinutes);
            const pad = dep.pad();
            const hourText = (typeof pad === "function") ? pad(baseLocal.hour) : String(baseLocal.hour).padStart(2, "0");
            const minuteText = (typeof pad === "function") ? pad(baseLocal.minute) : String(baseLocal.minute).padStart(2, "0");
            const nextSlotValue = `${hourText}:${minuteText}`;
            return updateFixedTimeSlotTime(slotIdx, nextSlotValue);
        }

        async function copyFixedTimeSlotColumn(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = dep.getCurrentGroup();
            if (!group) return;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;

            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return;
            const rows = [baseRef, ...getRenderableTimezoneRowsSafe(baseRef)];
            const anchor = dep.getGlobalTime(0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = dep.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
            if (!isValidDate(slotUtcDate)) return;

            const slotLabel = dep.getFixedTimeSlotHeaderLabel(slot, slotIdx, group.fixedTimes.length) || "";
            const copyState = getFixedTimeCopyState();
            const lines = rows
                .map((tz) => formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState))
                .filter(Boolean);

            if (!lines.length) return;
            const text = [`[${slotLabel}]`, ...lines].join("\n");
            try {
                await dep.writeClipboard(text);
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyFixedTimeSlotColumn failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        function renameFixedTimeSlot(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = dep.getCurrentGroup();
            if (!group) return;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;
            const defaultName = dep.getDefaultFixedTimeName();
            const currentName = dep.sanitizeFixedTimeName(slot.name, defaultName);
            const promptText = `${translate("btn_rename")} ${translate("th_fixed_time")}:`;
            const promptFn = (typeof globalObj.prompt === "function") ? globalObj.prompt.bind(globalObj) : null;
            if (typeof promptFn !== "function") return;
            const nextRaw = promptFn(promptText, currentName);
            if (nextRaw === null) return;
            slot.name = dep.sanitizeFixedTimeName(nextRaw, defaultName);
            dep.renderFixedTimeTab();
            dep.renderTimelineFrame();
            dep.savePersistence();
        }

        function updateFixedTimeSlotTime(slotIdx, rawValue) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return false;
            const group = dep.getCurrentGroup();
            if (!group) return false;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return false;
            const defaultValue = String(safeDeps.DEFAULT_FIXED_TIME_VALUE || "09:00");
            const fallbackValue = dep.sanitizeFixedTimeValue(slot.time, defaultValue);
            const nextValue = dep.sanitizeFixedTimeValue(rawValue, fallbackValue);
            if (slot.time === nextValue) return false;
            slot.time = nextValue;
            dep.renderFixedTimeTab();
            dep.renderTimelineFrame();
            dep.savePersistence();
            return true;
        }

        function addFixedTimeSlot() {
            const group = dep.getCurrentGroup();
            if (!group) return;
            const count = Number(dep.getFixedTimeSlotCount(group)) || 1;
            dep.setFixedTimeSlotCount(count + 1, { persist: true, rerender: true, showBoundaryToast: true });
        }

        function removeFixedTimeSlot(slotId) {
            const group = dep.getCurrentGroup();
            if (!group) return;
            dep.ensureGroupFixedTimes(group);
            const minCount = getNumberConstant("MIN_FIXED_TIME_SLOT_COUNT", 1);
            if ((group.fixedTimes?.length || 0) <= minCount) {
                dep.showToast(translate("toast_fixed_time_min"), { type: "info" });
                return;
            }
            const next = asArray(group.fixedTimes).filter((slot) => slot.id !== slotId);
            if (next.length === (group.fixedTimes?.length || 0)) return;
            group.fixedTimes = next;
            dep.refreshFixedTimeSlotCountControls();
            dep.renderFixedTimeTab();
            dep.renderTimelineFrame();
            dep.savePersistence();
        }

        return Object.freeze({
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
            copyFixedTimeSlotColumn,
            renameFixedTimeSlot,
            updateFixedTimeSlotTime,
            addFixedTimeSlot,
            removeFixedTimeSlot
        });
    }

    globalObj.GTVFixedTimeActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
