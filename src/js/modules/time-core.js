(function initGtvTimeCore(globalObj) {
    "use strict";

    function sanitizeTimezoneId(value) {
        const raw = (typeof value === "string") ? value.trim() : "";
        if (!raw) return "";
        if (raw.toLowerCase() === "utc") return "";
        return raw;
    }

    function sanitizeBaseTimezoneId(value) {
        const raw = (typeof value === "string") ? value.trim() : "";
        if (!raw) return "utc";
        if (raw.toLowerCase() === "utc") return "utc";
        return raw;
    }

    function sanitizeUtcRowOrder(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed < 0) return 0;
        return parsed;
    }

    function sanitizeUtcMs(value, fallbackMs) {
        const asNumber = Number(value);
        if (Number.isFinite(asNumber)) return asNumber;
        if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
        return fallbackMs;
    }

    function isLeapYear(year) {
        if (!Number.isInteger(year)) return false;
        if (year % 400 === 0) return true;
        if (year % 100 === 0) return false;
        return year % 4 === 0;
    }

    function getMaxDayOfMonth(year, month) {
        if (!Number.isInteger(month) || month < 1 || month > 12) return 31;
        if (month === 2) return isLeapYear(year) ? 29 : 28;
        if ([4, 6, 9, 11].includes(month)) return 30;
        return 31;
    }

    function buildStrictUtcDateFromParts(parts) {
        const year = parseInt(parts?.year, 10);
        const month = parseInt(parts?.month, 10);
        const day = parseInt(parts?.day, 10);
        const hour = parseInt(parts?.hour, 10);
        const minute = parseInt(parts?.minute, 10);
        const second = parseInt(parts?.second, 10);
        if (!Number.isInteger(year)) return null;
        if (!Number.isInteger(month) || month < 1 || month > 12) return null;
        if (!Number.isInteger(day) || day < 1 || day > getMaxDayOfMonth(year, month)) return null;
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
        if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
        if (!Number.isInteger(second) || second < 0 || second > 59) return null;

        // Date.UTC remaps years 0–99 to 1900–1999; setUTCFullYear keeps the entered year.
        const candidate = new Date(0);
        candidate.setUTCFullYear(year, month - 1, day);
        candidate.setUTCHours(hour, minute, second, 0);
        if (!Number.isFinite(candidate.getTime())) return null;
        if (candidate.getUTCFullYear() !== year) return null;
        if ((candidate.getUTCMonth() + 1) !== month) return null;
        if (candidate.getUTCDate() !== day) return null;
        if (candidate.getUTCHours() !== hour) return null;
        if (candidate.getUTCMinutes() !== minute) return null;
        if (candidate.getUTCSeconds() !== second) return null;
        return candidate;
    }

    function pad(v) {
        return String(Math.max(0, Math.trunc(v))).padStart(2, "0");
    }

    function clampNumber(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // A whole-minute UTC offset as custom timezone fields: "UTC+09:00" abbreviation and the
    // signed hour plus minutes that getCustomOffsetMinutes reads back. Offsets between -1 and 0
    // hours cannot be written as offH/offM and return null.
    function toCustomOffsetFields(offsetMinutes) {
        const minutes = Math.trunc(Number(offsetMinutes));
        if (!Number.isFinite(minutes) || Math.abs(minutes) > 14 * 60) return null;
        if (minutes < 0 && minutes > -60) return null;
        const sign = minutes < 0 ? -1 : 1;
        const absMinutes = Math.abs(minutes);
        const hours = Math.floor(absMinutes / 60);
        const rest = absMinutes % 60;
        const label = `UTC${sign < 0 ? "-" : "+"}${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
        return { abbr: label, offH: sign * hours, offM: rest };
    }

    function getCustomOffsetMinutes(tz) {
        const offH = Number.isFinite(parseInt(tz?.offH, 10)) ? parseInt(tz.offH, 10) : 0;
        const offM = Number.isFinite(parseInt(tz?.offM, 10)) ? Math.abs(parseInt(tz.offM, 10)) : 0;
        const minuteSign = offH < 0 ? -1 : 1;
        return (offH * 60) + (minuteSign * offM);
    }

    // UTC offset (minutes) of an IANA zone at a moment, or null when it cannot be computed.
    function getZoneOffsetMinutes(zoneName, date) {
        if (typeof zoneName !== "string" || !zoneName.trim()) return null;
        if (!(date instanceof Date) || !Number.isFinite(date.getTime())) return null;
        try {
            const parts = new Intl.DateTimeFormat("en-US", {
                timeZone: zoneName,
                hourCycle: "h23",
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            }).formatToParts(date).reduce((acc, part) => {
                acc[part.type] = Number(part.value);
                return acc;
            }, {});
            const minuteStartMs = date.getTime() - (date.getTime() % 60000);
            const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
            const offset = Math.round((localAsUtc - minuteStartMs) / 60000);
            return Number.isFinite(offset) ? offset : null;
        } catch (_err) {
            return null;
        }
    }

    // January and July offsets of the date's year; the smaller one is standard time.
    function getZoneSeasonalOffsets(zoneName, date) {
        const year = (date instanceof Date && Number.isFinite(date.getTime())) ? date.getUTCFullYear() : new Date().getUTCFullYear();
        return [
            getZoneOffsetMinutes(zoneName, new Date(Date.UTC(year, 0, 1, 12, 0, 0))),
            getZoneOffsetMinutes(zoneName, new Date(Date.UTC(year, 6, 1, 12, 0, 0)))
        ];
    }

    // True when the zone is on daylight saving time at the moment (offset above its standard offset).
    function isZoneInDaylightTime(zoneName, date) {
        if (zoneName === "UTC") return false;
        const current = getZoneOffsetMinutes(zoneName, date);
        const [jan, jul] = getZoneSeasonalOffsets(zoneName, date);
        if (current === null || jan === null || jul === null || jan === jul) return false;
        return current !== Math.min(jan, jul);
    }

    function createService(_deps = {}) {
        return Object.freeze({
            sanitizeTimezoneId,
            sanitizeBaseTimezoneId,
            sanitizeUtcRowOrder,
            sanitizeUtcMs,
            buildStrictUtcDateFromParts,
            pad,
            getCustomOffsetMinutes,
            toCustomOffsetFields,
            clampNumber,
            getZoneOffsetMinutes,
            getZoneSeasonalOffsets,
            isZoneInDaylightTime
        });
    }

    const defaultService = createService();

    globalObj.GTVTimeCore = Object.freeze({
        createService,
        sanitizeTimezoneId: defaultService.sanitizeTimezoneId,
        sanitizeBaseTimezoneId: defaultService.sanitizeBaseTimezoneId,
        sanitizeUtcRowOrder: defaultService.sanitizeUtcRowOrder,
        sanitizeUtcMs: defaultService.sanitizeUtcMs,
        buildStrictUtcDateFromParts: defaultService.buildStrictUtcDateFromParts,
        pad: defaultService.pad,
        getCustomOffsetMinutes: defaultService.getCustomOffsetMinutes,
        toCustomOffsetFields: defaultService.toCustomOffsetFields,
        clampNumber: defaultService.clampNumber,
        getZoneOffsetMinutes: defaultService.getZoneOffsetMinutes,
        getZoneSeasonalOffsets: defaultService.getZoneSeasonalOffsets,
        isZoneInDaylightTime: defaultService.isZoneInDaylightTime
    });
})(typeof window !== "undefined" ? window : globalThis);
