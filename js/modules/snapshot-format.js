(function initGtvSnapshotFormat(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const defaultCopyTimePartsEnabled = (safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED === "object")
            ? safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED
            : Object.freeze({ dn: true, date: true, time: true, weekday: true });

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
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
                    logWarn(`[GTVSnapshotFormat] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            pad: toSafeCallable("pad", safeDeps.pad),
            getCurrentLang: toSafeCallable("getCurrentLang", safeDeps.getCurrentLang),
            getDayNightMarkerByHour: toSafeCallable("getDayNightMarkerByHour", safeDeps.getDayNightMarkerByHour),
            getUTCRef: toSafeCallable("getUTCRef", safeDeps.getUTCRef),
            getBaseTimezoneRef: toSafeCallable("getBaseTimezoneRef", safeDeps.getBaseTimezoneRef),
            getCurrentGroupZones: toSafeCallable("getCurrentGroupZones", safeDeps.getCurrentGroupZones),
            getCustomOffsetMinutes: toSafeCallable("getCustomOffsetMinutes", safeDeps.getCustomOffsetMinutes),
            getFixedOffsetForDisplay: toSafeCallable("getFixedOffsetForDisplay", safeDeps.getFixedOffsetForDisplay),
            normalizeCustomAbbr: toSafeCallable("normalizeCustomAbbr", safeDeps.normalizeCustomAbbr),
            getZoneAbbreviation: toSafeCallable("getZoneAbbreviation", safeDeps.getZoneAbbreviation),
            getSignedInclusiveDaySpan: toSafeCallable("getSignedInclusiveDaySpan", safeDeps.getSignedInclusiveDaySpan),
            getSignedDurationDayHourMinute: toSafeCallable("getSignedDurationDayHourMinute", safeDeps.getSignedDurationDayHourMinute),
            t: toSafeCallable("t", safeDeps.t),
            getZoneDisplayName: toSafeCallable("getZoneDisplayName", safeDeps.getZoneDisplayName),
            getGlobalTimes: toSafeCallable("getGlobalTimes", safeDeps.getGlobalTimes),
            isRealtime: toSafeCallable("isRealtime", safeDeps.isRealtime),
            getSlotCount: toSafeCallable("getSlotCount", safeDeps.getSlotCount),
            sanitizeTimePartsEnabled: toSafeCallable("sanitizeTimePartsEnabled", safeDeps.sanitizeTimePartsEnabled),
            sanitizeCopyFormatOrder: toSafeCallable("sanitizeCopyFormatOrder", safeDeps.sanitizeCopyFormatOrder)
        });

        const timeDep = Object.freeze({
            toDateTime: toSafeCallable("timeService.toDateTime", safeDeps?.timeService?.toDateTime),
            resolveLocalDateParts: toSafeCallable("timeService.resolveLocalDateParts", safeDeps?.timeService?.resolveLocalDateParts)
        });

        function safePad(value) {
            const fallback = String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0");
            const padded = dep.pad(value);
            return (typeof padded === "string" && padded) ? padded : fallback;
        }

        function getDayNamesByLang() {
            const langRaw = dep.getCurrentLang();
            const lang = (typeof langRaw === "string" && langRaw.trim()) ? langRaw.trim() : "en";
            return safeDeps.I18N_DATA?.[lang]?.days || safeDeps.I18N_DATA?.en?.days || [];
        }

        function normalizeDayNightMarker(marker) {
            const raw = String(marker || "").trim().toUpperCase();
            if (raw === "DAY") return "DAY";
            if (raw === "NIGHT" || raw === "MOON") return "NIGHT";
            return "";
        }

        function resolveDayNightMarkerByHour(hour) {
            const marker = dep.getDayNightMarkerByHour(hour);
            const normalized = normalizeDayNightMarker(marker);
            if (normalized) return normalized;
            const numericHour = Number.parseInt(hour, 10);
            const safeHour = ((Number.isFinite(numericHour) ? numericHour : 0) % 24 + 24) % 24;
            return (safeHour >= 6 && safeHour < 18) ? "DAY" : "NIGHT";
        }

        function computeWeekdayIndexFromYmd(year, month, day) {
            const safeYear = Number.isFinite(year) ? Math.trunc(year) : 1970;
            const safeMonth = Number.isFinite(month) ? Math.trunc(month) : 1;
            const safeDay = Number.isFinite(day) ? Math.trunc(day) : 1;
            if (safeMonth < 1 || safeMonth > 12) return 0;
            if (safeDay < 1 || safeDay > 31) return 0;

            // Tomohiko Sakamoto algorithm (0=Sunday ... 6=Saturday).
            const monthOffsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
            let adjustedYear = safeYear;
            if (safeMonth < 3) adjustedYear -= 1;
            const weekday = (
                adjustedYear
                + Math.floor(adjustedYear / 4)
                - Math.floor(adjustedYear / 100)
                + Math.floor(adjustedYear / 400)
                + monthOffsets[safeMonth - 1]
                + safeDay
            ) % 7;
            return (weekday + 7) % 7;
        }

        function getTimezoneRefById(id) {
            if (!id) return null;
            if (id === "utc") return dep.getUTCRef() || null;
            const baseRef = dep.getBaseTimezoneRef() || null;
            if (baseRef?.id === id) return baseRef;
            const zones = dep.getCurrentGroupZones();
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
            if (tz?.type === "custom") {
                const customOffset = Number(dep.getCustomOffsetMinutes(tz));
                return Number.isFinite(customOffset) ? Math.trunc(customOffset) : 0;
            }
            if (Number.isFinite(fixedDisplayOffsetMinutes)) return Math.trunc(fixedDisplayOffsetMinutes);
            const dt = timeDep.toDateTime(anchorDate, tz?.zone || "UTC");
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
                : dep.getFixedOffsetForDisplay(tz);
            const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");

            const zoneCodeMain = (tz.type === "custom")
                ? String(dep.normalizeCustomAbbr(tz.abbr) || "")
                : String(dep.getZoneAbbreviation(tz, anchorDate) || "");
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
                const effectiveOffset = tz.type === "custom"
                    ? (Number(dep.getCustomOffsetMinutes(tz)) || 0)
                    : fixedDisplayOffsetMinutes;
                const parts = timeDep.resolveLocalDateParts(validDate, zone, tz.id, effectiveOffset);
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
                const weekdayIndex = computeWeekdayIndexFromYmd(year, month, day);

                timeValues.push(timeStr);
                dateValues.push(dateStr);
                clockValues.push(clockStr);
                dayIndexes.push(weekdayIndex);
                dayNameValues.push(dayNamesByLang[weekdayIndex] || "");
                dayNightIconValues.push(resolveDayNightMarkerByHour(hour));
            });

            let periodDaysText = "";
            let periodTimeText = "";
            if (timeValues.length > 1) {
                const spanDays = dep.getSignedInclusiveDaySpan(timeValues[0], timeValues[1]);
                const spanTime = dep.getSignedDurationDayHourMinute(timeValues[0], timeValues[1]);
                const daySuffix = String(dep.t("unit_days_suffix") || "d");
                periodDaysText = spanDays === null || spanDays === undefined ? "" : `${spanDays}${daySuffix}`;
                periodTimeText = spanTime === null ? "" : spanTime;
            }

            return {
                timezone: zoneCodeMain,
                region: String(dep.getZoneDisplayName(tz) || ""),
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

            const globalTimesRaw = dep.getGlobalTimes();
            const globalTimes = Array.isArray(globalTimesRaw) ? globalTimesRaw : [];
            const anchorDate = globalTimes[0] instanceof Date ? globalTimes[0] : new Date();
            const rawSlotCount = Number(dep.getSlotCount());
            const effectiveSlotCount = dep.isRealtime() ? 1 : (Number.isFinite(rawSlotCount) ? Math.max(1, rawSlotCount) : 1);
            const slotDates = Array.from({ length: effectiveSlotCount }, (_, idx) =>
                (globalTimes[idx] instanceof Date) ? globalTimes[idx] : anchorDate
            );

            return buildTimezoneComputedSnapshotForDates(tz, slotDates);
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safePartsRaw = dep.sanitizeTimePartsEnabled(timePartsEnabled, "copy");
            const safeParts = (safePartsRaw && typeof safePartsRaw === "object")
                ? safePartsRaw
                : defaultCopyTimePartsEnabled;
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
            const safeOrderRaw = dep.sanitizeCopyFormatOrder(order);
            const safeOrder = Array.isArray(safeOrderRaw) ? safeOrderRaw : [];
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
