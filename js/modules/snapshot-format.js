(function initGtvSnapshotFormat(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const defaultCopyTimePartsEnabled = (safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED === "object")
            ? safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED
            : Object.freeze({ dn: true, date: true, time: true, weekday: true });

        function callDep(name, fallback, ...args) {
            const fn = safeDeps[name];
            if (typeof fn !== "function") return fallback;
            try {
                return fn(...args);
            } catch (_err) {
                return fallback;
            }
        }

        function safePad(value) {
            return callDep("pad", String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0"), value);
        }

        function safeTimeServiceMethod(name, fallback, ...args) {
            const fn = safeDeps?.timeService?.[name];
            if (typeof fn !== "function") return fallback;
            try {
                return fn(...args);
            } catch (_err) {
                return fallback;
            }
        }

        function getDayNamesByLang() {
            const lang = callDep("getCurrentLang", "en");
            return safeDeps.I18N_DATA?.[lang]?.days || safeDeps.I18N_DATA?.en?.days || [];
        }

        function getTimezoneRefById(id) {
            if (!id) return null;
            if (id === "utc") return callDep("getUTCRef", null);
            const baseRef = callDep("getBaseTimezoneRef", null);
            if (baseRef?.id === id) return baseRef;
            const zones = callDep("getCurrentGroupZones", []);
            if (!Array.isArray(zones)) return null;
            return zones.find((zone) => zone?.id === id) || null;
        }

        function toValidDate(value, fallbackDate = null) {
            if (value instanceof Date && Number.isFinite(value.getTime())) {
                return new Date(value.getTime());
            }
            const parsed = new Date(value);
            if (Number.isFinite(parsed.getTime())) return parsed;
            if (fallbackDate instanceof Date && Number.isFinite(fallbackDate.getTime())) {
                return new Date(fallbackDate.getTime());
            }
            return null;
        }

        function formatOffsetLabel(totalMinutes = 0) {
            const safeTotalMinutes = Number.isFinite(totalMinutes) ? Math.trunc(totalMinutes) : 0;
            const sign = safeTotalMinutes >= 0 ? "+" : "-";
            const absMin = Math.abs(safeTotalMinutes);
            return `UTC${sign}${safePad(Math.floor(absMin / 60))}:${safePad(absMin % 60)}`;
        }

        function resolveSnapshotOffsetMinutes(tz, anchorDate, fixedDisplayOffsetMinutes = null) {
            if (tz?.type === "custom") return callDep("getCustomOffsetMinutes", 0, tz);
            if (Number.isFinite(fixedDisplayOffsetMinutes)) return Math.trunc(fixedDisplayOffsetMinutes);
            const dt = safeTimeServiceMethod("toDateTime", null, anchorDate, tz?.zone || "UTC");
            const offset = Number(dt?.offset);
            return Number.isFinite(offset) ? Math.trunc(offset) : 0;
        }

        function buildTimezoneComputedSnapshotForDates(tz, slotDates = [], options = {}) {
            if (!tz || typeof tz !== "object") return null;

            const fallbackDate = new Date();
            let safeDates = Array.isArray(slotDates)
                ? slotDates.map((date) => toValidDate(date, null)).filter(Boolean)
                : [];
            if (!safeDates.length) safeDates = [fallbackDate];

            const anchorDate = safeDates[0];
            const hasFixedOption = Object.prototype.hasOwnProperty.call(options || {}, "fixedDisplayOffsetMinutes");
            const fixedDisplayOffsetMinutes = hasFixedOption
                ? options.fixedDisplayOffsetMinutes
                : callDep("getFixedOffsetForDisplay", null, tz);
            const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");

            const zoneCodeMain = (tz.type === "custom")
                ? callDep("normalizeCustomAbbr", "", tz.abbr)
                : callDep("getZoneAbbreviation", "", tz, anchorDate);
            const offsetStr = formatOffsetLabel(resolveSnapshotOffsetMinutes(tz, anchorDate, fixedDisplayOffsetMinutes));
            const dayNamesByLang = getDayNamesByLang();

            const timeValues = [];
            const dateValues = [];
            const clockValues = [];
            const dayNameValues = [];
            const dayIndexes = [];
            const dayNightIconValues = [];

            safeDates.forEach((slotDate) => {
                const validDate = toValidDate(slotDate, fallbackDate) || fallbackDate;
                const effectiveOffset = tz.type === "custom" ? callDep("getCustomOffsetMinutes", 0, tz) : fixedDisplayOffsetMinutes;
                const parts = safeTimeServiceMethod("resolveLocalDateParts", null, validDate, zone, tz.id, effectiveOffset);
                if (!parts) return;

                const hour = Number.isFinite(parts?.H) ? Math.trunc(parts.H) : 0;
                const minute = Number.isFinite(parts?.min) ? Math.trunc(parts.min) : 0;
                const second = Number.isFinite(parts?.S) ? Math.trunc(parts.S) : 0;
                const year = Number.isFinite(parts?.Y) ? Math.trunc(parts.Y) : 1970;
                const month = Number.isFinite(parts?.M) ? Math.trunc(parts.M) : 1;
                const day = Number.isFinite(parts?.D) ? Math.trunc(parts.D) : 1;

                const timeStr = `${year}-${safePad(month)}-${safePad(day)} ${safePad(hour)}:${safePad(minute)}:${safePad(second)}`;
                const dateStr = `${year}-${safePad(month)}-${safePad(day)}`;
                const clockStr = `${safePad(hour)}:${safePad(minute)}:${safePad(second)}`;

                // 요일 계산 시 추가 시간대 변환 호출을 피하려고 로컬 달력 날짜 파트를 사용한다.
                const weekdayDate = new Date(Date.UTC(
                    Math.max(1, year),
                    Math.max(0, month - 1),
                    Math.max(1, day)
                ));
                const weekdayIndex = Number.isFinite(weekdayDate.getTime()) ? weekdayDate.getUTCDay() : 0;

                timeValues.push(timeStr);
                dateValues.push(dateStr);
                clockValues.push(clockStr);
                dayIndexes.push(weekdayIndex);
                dayNameValues.push(dayNamesByLang[weekdayIndex] || "");
                dayNightIconValues.push(hour >= 6 && hour <= 18 ? "DAY" : "NIGHT");
            });

            let periodDaysText = "";
            let periodTimeText = "";
            if (timeValues.length > 1) {
                const spanDays = callDep("getSignedInclusiveDaySpan", null, timeValues[0], timeValues[1]);
                const spanTime = callDep("getSignedDurationDayHourMinute", null, timeValues[0], timeValues[1]);
                periodDaysText = spanDays === null ? "" : `${spanDays}${callDep("t", "d", "unit_days_suffix")}`;
                periodTimeText = spanTime === null ? "" : spanTime;
            }

            return {
                timezone: zoneCodeMain,
                region: callDep("getZoneDisplayName", "", tz),
                offset: offsetStr,
                times: timeValues,
                dates: dateValues,
                clocks: clockValues,
                dayNames: dayNameValues,
                dayIndexes,
                dayNightIcons: dayNightIconValues,
                periodDays: periodDaysText,
                periodTime: periodTimeText
            };
        }

        function buildTimezoneComputedSnapshot(id) {
            const tz = getTimezoneRefById(id);
            if (!tz) return null;

            const globalTimes = callDep("getGlobalTimes", []);
            const anchorDate = globalTimes[0] instanceof Date ? globalTimes[0] : new Date();
            const effectiveSlotCount = callDep("isRealtime", false) ? 1 : callDep("getSlotCount", 1);
            const slotDates = Array.from({ length: effectiveSlotCount }, (_, idx) =>
                (globalTimes[idx] instanceof Date) ? globalTimes[idx] : anchorDate
            );

            return buildTimezoneComputedSnapshotForDates(tz, slotDates);
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safeParts = callDep("sanitizeTimePartsEnabled", defaultCopyTimePartsEnabled, timePartsEnabled, "copy");
            const dates = Array.isArray(snapshot.dates) ? snapshot.dates : [];
            const clocks = Array.isArray(snapshot.clocks) ? snapshot.clocks : [];
            const dayNames = Array.isArray(snapshot.dayNames) ? snapshot.dayNames : [];
            const dayNightIcons = Array.isArray(snapshot.dayNightIcons) ? snapshot.dayNightIcons : [];
            const slotSize = Math.max(dates.length, clocks.length, dayNames.length, dayNightIcons.length);
            const rendered = [];

            for (let i = 0; i < slotSize; i++) {
                const tokens = [];
                if (safeParts.dn && dayNightIcons[i]) tokens.push(dayNightIcons[i]);
                if (safeParts.date && dates[i]) tokens.push(dates[i]);
                if (safeParts.time && clocks[i]) tokens.push(clocks[i]);
                if (safeParts.weekday && dayNames[i]) tokens.push(`(${dayNames[i]})`);
                const merged = tokens.join(" ").trim();
                if (merged) rendered.push(merged);
            }

            return rendered.join(" ~ ");
        }

        function getCopyFieldText(snapshot, key, options = {}) {
            const { timePartsEnabled = defaultCopyTimePartsEnabled } = options;
            if (!snapshot) return "";
            if (key === "timezone") {
                const zoneCodeRaw = (snapshot.timezone || "").trim();
                if (!zoneCodeRaw) return "";
                return zoneCodeRaw.startsWith("[") ? zoneCodeRaw : `[${zoneCodeRaw}]`;
            }

            if (key === "region") {
                return (snapshot.region || "").trim();
            }

            if (key === "offset") {
                const offsetText = (snapshot.offset || "").trim();
                if (!offsetText) return "";
                return offsetText.startsWith("[") ? offsetText : `[${offsetText}]`;
            }

            if (key === "time") {
                return formatTimeTextByParts(snapshot, timePartsEnabled);
            }

            if (key === "period_days") {
                const periodText = (snapshot.periodDays || "").trim();
                if (!periodText || periodText === "-") return "";
                return `[${periodText}]`;
            }

            if (key === "period_time") {
                const periodTimeText = (snapshot.periodTime || "").trim();
                if (!periodTimeText || periodTimeText === "-") return "";
                return `[${periodTimeText}]`;
            }

            return "";
        }

        function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = defaultCopyTimePartsEnabled) {
            if (!snapshot) return "";
            const orderedParts = [];
            const safeOrder = callDep("sanitizeCopyFormatOrder", [], order);
            (Array.isArray(safeOrder) ? safeOrder : []).forEach((key) => {
                if (!enabled?.[key]) return;
                const value = getCopyFieldText(snapshot, key, { timePartsEnabled });
                if (value) orderedParts.push(value);
            });
            return orderedParts.join(" ").trim();
        }

        function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = defaultCopyTimePartsEnabled) {
            const rowId = typeof rowOrId === "string"
                ? rowOrId
                : String(rowOrId?.id || "").replace("tz-row-", "");
            if (!rowId) return "";

            const snapshot = buildTimezoneComputedSnapshot(rowId);
            if (!snapshot) return "";
            return formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
        }

        function getRowCopyText(rowOrId, options = {}) {
            const {
                order = [],
                enabled = {},
                timePartsEnabled = defaultCopyTimePartsEnabled
            } = options;
            return getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
        }

        return Object.freeze({
            getTimezoneRefById,
            buildTimezoneComputedSnapshotForDates,
            buildTimezoneComputedSnapshot,
            formatTimeTextByParts,
            getCopyFieldText,
            formatSnapshotText,
            getRowFormattedText,
            getRowCopyText
        });
    }

    globalObj.GTVSnapshotFormat = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
