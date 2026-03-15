(function initGtvFixedTimeActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeActions] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
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
            const order = invokeDep("sanitizeCopyFormatOrderForContext", invokeDep("getCopyFormatOrder"), "fixed-time");
            const enabled = invokeDep("sanitizeCopyFormatEnabledForContext", invokeDep("getCopyFormatEnabled"), "copy", "fixed-time");
            const timePartsEnabled = invokeDep("sanitizeTimePartsEnabledForContext", invokeDep("getCopyTimePartsEnabled"), "copy", "fixed-time");
            return { order, enabled, timePartsEnabled };
        }

        function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
            if (!tz || !isValidDate(slotUtcDate)) return null;
            const fixedDisplayOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, slotUtcDate);
            return invokeDep(
                "buildTimezoneComputedSnapshotForDates",
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
            return invokeDep(
                "formatSnapshotText",
                snapshot,
                safeCopyState.order,
                safeCopyState.enabled,
                safeCopyState.timePartsEnabled
            ) || "";
        }

        function getFixedTimeSlotUtcDateByIndex(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return null;
            const group = invokeDep("getCurrentGroup");
            if (!group) return null;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return null;
            const anchor = invokeDep("getGlobalTime", 0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate);
            return isValidDate(slotUtcDate) ? slotUtcDate : null;
        }

        function getFixedTimePreviewCopyText() {
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return "";
            const slotUtcDate = getFixedTimeSlotUtcDateByIndex(0);
            if (!isValidDate(slotUtcDate)) return "";
            return formatFixedTimeCopyTextForTimezoneSlot(baseRef, slotUtcDate);
        }

        function getAllFixedTimeRowsCopyText() {
            const group = invokeDep("getCurrentGroup");
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!group || !baseRef) return "";
            invokeDep("ensureGroupFixedTimes", group);
            if (!Array.isArray(group.fixedTimes) || !group.fixedTimes.length) return "";

            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
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
                const slotLabel = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, group.fixedTimes.length) || "";
                sections.push([`[${slotLabel}]`, ...lines].join("\n"));
            });

            return sections.join("\n\n").trim();
        }

        async function copyFixedTimeCellPayload(payload, partsEnabled) {
            const text = formatFixedTimePayloadText(payload, partsEnabled);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeCellPayload failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
            const text = formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeCellByTimezone failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        function buildFixedTimeCellInputValue(utcDate, tz) {
            const payload = invokeDep("buildFixedTimeDisplayPayloadAtUtc", utcDate, tz);
            return payload?.clock || "";
        }

        function buildFixedTimeCellTimeParts(rawValue) {
            const timeParts = invokeDep("parseDateTimeParts", rawValue, "time");
            if (timeParts) {
                const [hour, minute, second] = timeParts;
                return { hour, minute, second };
            }
            const datetimeParts = invokeDep("parseDateTimeParts", rawValue, "datetime");
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
                invokeDep("showToast", translate("toast_invalid_date"));
                invokeDep("renderFixedTimeTab");
                return false;
            }

            const safeAnchorDate = isValidDate(anchorUtcDate) ? anchorUtcDate : new Date();
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, safeAnchorDate);
            const anchorLocal = invokeDep("getLocalPartsByTimezone", safeAnchorDate, tz, fixedOffsetMinutes);
            const localParts = {
                year: anchorLocal.year,
                month: anchorLocal.month,
                day: anchorLocal.day,
                hour: timeParts.hour,
                minute: timeParts.minute,
                second: timeParts.second
            };
            const nextUtcDate = invokeDep("getUTCDateFromLocalParts", localParts, tz, fixedOffsetMinutes);
            if (!isValidDate(nextUtcDate)) {
                invokeDep("showToast", translate("toast_invalid_date"));
                invokeDep("renderFixedTimeTab");
                return false;
            }

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return false;
            const baseOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, nextUtcDate);
            const baseLocal = invokeDep("getLocalPartsByTimezone", nextUtcDate, baseRef, baseOffsetMinutes);
            const pad = invokeDep("pad");
            const hourText = (typeof pad === "function") ? pad(baseLocal.hour) : String(baseLocal.hour).padStart(2, "0");
            const minuteText = (typeof pad === "function") ? pad(baseLocal.minute) : String(baseLocal.minute).padStart(2, "0");
            const nextSlotValue = `${hourText}:${minuteText}`;
            return updateFixedTimeSlotTime(slotIdx, nextSlotValue);
        }

        async function copyFixedTimeSlotColumn(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
            const anchor = invokeDep("getGlobalTime", 0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate);
            if (!isValidDate(slotUtcDate)) return;

            const slotLabel = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, group.fixedTimes.length) || "";
            const copyState = getFixedTimeCopyState();
            const lines = rows
                .map((tz) => formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState))
                .filter(Boolean);

            if (!lines.length) return;
            const text = [`[${slotLabel}]`, ...lines].join("\n");
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeSlotColumn failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        function renameFixedTimeSlot(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;
            const defaultName = invokeDep("getDefaultFixedTimeName");
            const currentName = invokeDep("sanitizeFixedTimeName", slot.name, defaultName);
            const promptText = `${translate("btn_rename")} ${translate("th_fixed_time")}:`;
            const promptFn = (typeof globalObj.prompt === "function") ? globalObj.prompt.bind(globalObj) : null;
            if (typeof promptFn !== "function") return;
            const nextRaw = promptFn(promptText, currentName);
            if (nextRaw === null) return;
            slot.name = invokeDep("sanitizeFixedTimeName", nextRaw, defaultName);
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
        }

        function updateFixedTimeSlotTime(slotIdx, rawValue) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return false;
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return false;
            const defaultValue = String(safeDeps.DEFAULT_FIXED_TIME_VALUE || "09:00");
            const fallbackValue = invokeDep("sanitizeFixedTimeValue", slot.time, defaultValue);
            const nextValue = invokeDep("sanitizeFixedTimeValue", rawValue, fallbackValue);
            if (slot.time === nextValue) return false;
            slot.time = nextValue;
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
            return true;
        }

        function addFixedTimeSlot() {
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            const count = Number(invokeDep("getFixedTimeSlotCount", group)) || 1;
            invokeDep("setFixedTimeSlotCount", count + 1, { persist: true, rerender: true, showBoundaryToast: true });
        }

        function removeFixedTimeSlot(slotId) {
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const minCount = getNumberConstant("MIN_FIXED_TIME_SLOT_COUNT", 1);
            if ((group.fixedTimes?.length || 0) <= minCount) {
                invokeDep("showToast", translate("toast_fixed_time_min"), { type: "info" });
                return;
            }
            const next = asArray(group.fixedTimes).filter((slot) => slot.id !== slotId);
            if (next.length === (group.fixedTimes?.length || 0)) return;
            group.fixedTimes = next;
            invokeDep("refreshFixedTimeSlotCountControls");
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
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

