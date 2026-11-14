(function initGtvFixedTimeCore(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVFixedTimeCore", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "getCurrentLang",
                "getDayNightMarkerByHour",
                "sanitizeFixedTimeValue",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getFixedTimeOpenedAt",
                "getUTCDateFromLocalParts",
                "sanitizeTimePartsEnabledForContext",
                "getDisplayTimePartsEnabled",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "t"
            ])
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

            // The slots fall on the base timezone's date at the moment the tab was opened.
            const openedAt = dep.getFixedTimeOpenedAt();
            const safeAnchor = isValidDate(openedAt) ? openedAt : (isValidDate(anchorDate) ? anchorDate : new Date());
            try {
                const baseOffset = dep.getFixedOffsetForDisplayAtDate(baseRef, safeAnchor);
                const baseLocal = dep.getLocalPartsByTimezone(safeAnchor, baseRef, baseOffset);
                const utcDate = dep.getUTCDateFromLocalParts({
                    year: baseLocal.year,
                    month: baseLocal.month,
                    day: baseLocal.day,
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

        // DST is marked only for rule-following city zones (not custom/UTC, no fixed offset).
        function isFixedTimeDaylightTime(tz, fixedOffsetMinutes, utcDate) {
            if (!tz || tz.type === "custom" || Number.isFinite(fixedOffsetMinutes)) return false;
            const zone = (typeof tz.zone === "string") ? tz.zone.trim() : "";
            if (!zone || zone === "UTC") return false;
            const timeCore = globalObj?.GTVTimeCore || globalThis.GTVTimeCore;
            if (!timeCore || typeof timeCore.isZoneInDaylightTime !== "function") return false;
            return timeCore.isZoneInDaylightTime(zone, utcDate) === true;
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
                    weekdayIndex,
                    isDst: isFixedTimeDaylightTime(tz, fixedOffsetMinutes, utcDate)
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
                weekday: !!safe?.weekday,
                dst: !!safe?.dst
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
