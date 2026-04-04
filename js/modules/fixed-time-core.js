(function initGtvFixedTimeCore(globalObj) {
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

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVFixedTimeCore] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getCurrentLang: toSafeCallable("getCurrentLang", safeDeps.getCurrentLang),
            getDayNightMarkerByHour: toSafeCallable("getDayNightMarkerByHour", safeDeps.getDayNightMarkerByHour),
            sanitizeFixedTimeValue: toSafeCallable("sanitizeFixedTimeValue", safeDeps.sanitizeFixedTimeValue),
            getFixedOffsetForDisplayAtDate: toSafeCallable("getFixedOffsetForDisplayAtDate", safeDeps.getFixedOffsetForDisplayAtDate),
            getLocalPartsByTimezone: toSafeCallable("getLocalPartsByTimezone", safeDeps.getLocalPartsByTimezone),
            getFixedDateParts: toSafeCallable("getFixedDateParts", safeDeps.getFixedDateParts),
            getUTCDateFromLocalParts: toSafeCallable("getUTCDateFromLocalParts", safeDeps.getUTCDateFromLocalParts),
            sanitizeTimePartsEnabledForContext: toSafeCallable("sanitizeTimePartsEnabledForContext", safeDeps.sanitizeTimePartsEnabledForContext),
            getDisplayTimePartsEnabled: toSafeCallable("getDisplayTimePartsEnabled", safeDeps.getDisplayTimePartsEnabled),
            getDefaultFixedTimeName: toSafeCallable("getDefaultFixedTimeName", safeDeps.getDefaultFixedTimeName),
            sanitizeFixedTimeName: toSafeCallable("sanitizeFixedTimeName", safeDeps.sanitizeFixedTimeName),
            t: toSafeCallable("t", safeDeps.t)
        });

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function pad2(value) {
            const padFn = safeDeps.pad;
            if (typeof padFn === "function") return padFn(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function getCurrentLang() {
            const lang = dep.getCurrentLang();
            return (typeof lang === "string" && lang) ? lang : "en";
        }

        function normalizeDayNightMarker(marker) {
            const raw = String(marker || "").trim();
            if (!raw) return "";
            const normalized = raw.toUpperCase();
            if (normalized === "DAY" || raw === "\u2600\uFE0F") return "DAY";
            if (normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") return "NIGHT";
            return "";
        }

        function getDayNightGlyph(marker) {
            const normalized = normalizeDayNightMarker(marker);
            if (normalized === "DAY") return "\u2600\uFE0F";
            if (normalized === "NIGHT") return "\uD83C\uDF19";
            return String(marker || "");
        }

        function getLocalizedWeekdayNameByIndex(weekdayIndex) {
            const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object")
                ? safeDeps.I18N_DATA
                : {};
            const days = i18nData[getCurrentLang()]?.days || i18nData.en?.days || [];
            return days[weekdayIndex] || "";
        }

        function resolveDayNightMarkerByHour(hour) {
            const marker = dep.getDayNightMarkerByHour(hour);
            const normalized = normalizeDayNightMarker(marker);
            if (normalized) return normalized;
            const numericHour = Number.parseInt(hour, 10);
            const safeHour = ((Number.isFinite(numericHour) ? numericHour : 0) % 24 + 24) % 24;
            return (safeHour >= 6 && safeHour < 18) ? "DAY" : "NIGHT";
        }

        function getFixedTimeSlotParts(slot) {
            const defaultValue = String(safeDeps.DEFAULT_FIXED_TIME_VALUE || "09:00");
            const safeTime = dep.sanitizeFixedTimeValue(slot?.time, defaultValue) || defaultValue;
            const [hourText, minuteText] = String(safeTime).split(":");
            const hour = parseInt(hourText, 10);
            const minute = parseInt(minuteText, 10);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
            return { hour, minute };
        }

        function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = new Date()) {
            if (!slot || !baseRef) return null;
            const slotParts = getFixedTimeSlotParts(slot);
            if (!slotParts) return null;

            const safeAnchor = isValidDate(anchorDate) ? anchorDate : new Date();
            try {
                const baseOffset = dep.getFixedOffsetForDisplayAtDate(baseRef, safeAnchor);
                const baseLocal = dep.getLocalPartsByTimezone(safeAnchor, baseRef, baseOffset);
                const fixedDateParts = dep.getFixedDateParts();
                const year = Number.isFinite(fixedDateParts?.year) ? fixedDateParts.year : baseLocal.year;
                const month = Number.isFinite(fixedDateParts?.month) ? fixedDateParts.month : baseLocal.month;
                const day = Number.isFinite(fixedDateParts?.day) ? fixedDateParts.day : baseLocal.day;
                const utcDate = dep.getUTCDateFromLocalParts({
                    year,
                    month,
                    day,
                    hour: slotParts.hour,
                    minute: slotParts.minute,
                    second: 0
                }, baseRef, baseOffset);
                if (!isValidDate(utcDate)) return null;
                return utcDate;
            } catch (_err) {
                return null;
            }
        }

        function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
            if (!isValidDate(utcDate) || !tz) return null;
            try {
                const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(tz, utcDate);
                const localParts = dep.getLocalPartsByTimezone(utcDate, tz, fixedOffsetMinutes);
                const weekdayIndex = new Date(Date.UTC(
                    localParts.year,
                    Math.max(0, localParts.month - 1),
                    localParts.day
                )).getUTCDay();
                const dayNightMarker = resolveDayNightMarkerByHour(localParts.hour);
                return {
                    clock: `${pad2(localParts.hour)}:${pad2(localParts.minute)}:${pad2(localParts.second)}`,
                    dayNightMarker,
                    dayNightGlyph: getDayNightGlyph(dayNightMarker),
                    dayName: getLocalizedWeekdayNameByIndex(weekdayIndex),
                    weekdayIndex
                };
            } catch (_err) {
                return null;
            }
        }

        function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
            const payload = buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
            return payload ? payload.clock : "--:--:--";
        }

        function getFixedTimeDisplayPartsEnabled() {
            const safe = dep.sanitizeTimePartsEnabledForContext(
                dep.getDisplayTimePartsEnabled(),
                "display",
                "fixed-time"
            );
            return {
                dn: !!safe?.dn,
                time: !!safe?.time,
                weekday: !!safe?.weekday
            };
        }

        function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
            const defaultName = dep.getDefaultFixedTimeName();
            const safeName = dep.sanitizeFixedTimeName(slot?.name, defaultName);
            const fixedLabel = String(dep.t("th_fixed_time") || "Fixed Time");
            if (safeName === defaultName && slotCount > 1) {
                return `${fixedLabel} ${slotIdx + 1}`;
            }
            return safeName || `${fixedLabel} ${slotIdx + 1}`;
        }

        function getFixedTimeTimelineIndicatorColor(slotIdx) {
            const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
            return palette[slotIdx % palette.length];
        }

        return Object.freeze({
            normalizeDayNightMarker,
            getDayNightGlyph,
            getLocalizedWeekdayNameByIndex,
            getFixedTimeSlotParts,
            resolveFixedTimeSlotUtcDate,
            formatFixedTimeForTimezoneAtUtc,
            getFixedTimeDisplayPartsEnabled,
            buildFixedTimeDisplayPayloadAtUtc,
            getFixedTimeSlotHeaderLabel,
            getFixedTimeTimelineIndicatorColor
        });
    }

    globalObj.GTVFixedTimeCore = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
