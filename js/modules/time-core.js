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

    function buildStrictUtcDateFromParts(parts) {
        const year = parseInt(parts?.year, 10);
        const month = parseInt(parts?.month, 10);
        const day = parseInt(parts?.day, 10);
        const hour = parseInt(parts?.hour, 10);
        const minute = parseInt(parts?.minute, 10);
        const second = parseInt(parts?.second, 10);
        if (!Number.isInteger(year)) return null;
        if (!Number.isInteger(month) || month < 1 || month > 12) return null;
        if (!Number.isInteger(day) || day < 1 || day > 31) return null;
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
        if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
        if (!Number.isInteger(second) || second < 0 || second > 59) return null;

        const candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
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

    function getCustomOffsetMinutes(tz) {
        const offH = Number.isFinite(parseInt(tz?.offH, 10)) ? parseInt(tz.offH, 10) : 0;
        const offM = Number.isFinite(parseInt(tz?.offM, 10)) ? Math.abs(parseInt(tz.offM, 10)) : 0;
        const minuteSign = offH < 0 ? -1 : 1;
        return (offH * 60) + (minuteSign * offM);
    }

    const api = Object.freeze({
        sanitizeTimezoneId,
        sanitizeBaseTimezoneId,
        sanitizeUtcRowOrder,
        sanitizeUtcMs,
        buildStrictUtcDateFromParts,
        pad,
        getCustomOffsetMinutes,
        clampNumber
    });

    globalObj.GTVTimeCore = api;
})(typeof window !== "undefined" ? window : globalThis);
