(function initGtvCalculatorDateFormat(globalObj) {
    "use strict";

    // Strict date parsing and formatting shared by the calculator tools.

    function defaultPad2(value) {
        return String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0");
    }

    const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
    const LOCAL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
    const SQL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
    const ISO_WITH_EXPLICIT_ZONE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/i;
    const RFC2822_PATTERN = /^(?:[A-Za-z]{3},\s*)?\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}(?::\d{2})?\s+(?:[A-Za-z]{1,5}|[+-]\d{4})$/;

    function isValidDateObject(value) {
        return value instanceof Date && !Number.isNaN(value.getTime());
    }

    function buildValidatedLocalDate(year, month, day, hour = 0, minute = 0, second = 0) {
        const y = Number(year);
        const m = Number(month);
        const d = Number(day);
        const h = Number(hour);
        const min = Number(minute);
        const sec = Number(second);
        const built = new Date(y, m - 1, d, h, min, sec, 0);
        if (Number.isNaN(built.getTime())) return null;
        if (
            built.getFullYear() !== y ||
            built.getMonth() !== m - 1 ||
            built.getDate() !== d ||
            built.getHours() !== h ||
            built.getMinutes() !== min ||
            built.getSeconds() !== sec
        ) {
            return null;
        }
        return built;
    }

    // Strict UTC date validation is shared with the rest of the app through GTVTimeCore.
    function buildValidatedUtcDate(year, month, day, hour = 0, minute = 0, second = 0) {
        const timeCore = globalObj?.GTVTimeCore;
        if (!timeCore || typeof timeCore.buildStrictUtcDateFromParts !== "function") return null;
        return timeCore.buildStrictUtcDateFromParts({ year, month, day, hour, minute, second });
    }

    function parseLocalDateOnlyString(raw) {
        const matched = String(raw || "").trim().match(DATE_ONLY_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(matched[1], matched[2], matched[3]);
    }

    function parseLocalDateTimeString(raw) {
        const matched = String(raw || "").trim().match(LOCAL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6] || 0
        );
    }

    function parseUtcDateTimeString(raw) {
        const matched = String(raw || "").trim().match(LOCAL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedUtcDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6] || 0
        );
    }

    function parseUtcDateOnlyString(raw) {
        const matched = String(raw || "").trim().match(DATE_ONLY_PATTERN);
        if (!matched) return null;
        return buildValidatedUtcDate(matched[1], matched[2], matched[3]);
    }

    function parseSqlDateTimeString(raw) {
        const matched = String(raw || "").trim().match(SQL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6]
        );
    }

    function parseZonedIsoString(raw) {
        const normalized = String(raw || "").trim();
        if (!ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized)) return null;
        const epochMs = Date.parse(normalized);
        return Number.isFinite(epochMs) ? new Date(epochMs) : null;
    }

    function parseRfc2822String(raw) {
        const normalized = String(raw || "").trim();
        if (!RFC2822_PATTERN.test(normalized)) return null;
        const epochMs = Date.parse(normalized);
        return Number.isFinite(epochMs) ? new Date(epochMs) : null;
    }

    function parseIsoLocalDateString(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;
        const hasExplicitZone = ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized);

        if (luxonDT && typeof luxonDT.fromISO === "function") {
            const parsed = hasExplicitZone
                ? luxonDT.fromISO(normalized, { setZone: true })
                : luxonDT.fromISO(normalized, { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseZonedIsoString(normalized)
            || parseLocalDateTimeString(normalized)
            || parseLocalDateOnlyString(normalized);
    }

    function parseIsoUtcDateString(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;
        const hasExplicitZone = ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized);

        if (luxonDT && typeof luxonDT.fromISO === "function") {
            const parsed = hasExplicitZone
                ? luxonDT.fromISO(normalized, { setZone: true })
                : luxonDT.fromISO(normalized, { zone: "utc" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseZonedIsoString(normalized)
            || parseUtcDateTimeString(normalized)
            || parseUtcDateOnlyString(normalized);
    }

    function parseSqlDateWithLuxon(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;

        if (luxonDT && typeof luxonDT.fromSQL === "function") {
            const parsed = luxonDT.fromSQL(normalized, { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }
        if (luxonDT && typeof luxonDT.fromFormat === "function") {
            const parsed = luxonDT.fromFormat(normalized, "yyyy-LL-dd HH:mm:ss", { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseSqlDateTimeString(normalized);
    }

    function parseRfc2822DateWithLuxon(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;

        if (luxonDT && typeof luxonDT.fromRFC2822 === "function") {
            const parsed = luxonDT.fromRFC2822(normalized, { setZone: true });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseRfc2822String(normalized);
    }

    function toValidDate(value, luxonDT) {
        if (!value) return null;
        if (isValidDateObject(value)) return new Date(value.getTime());
        if (typeof value === "number" && Number.isFinite(value)) {
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        if (typeof value !== "string") return null;
        return parseIsoLocalDateString(value, luxonDT)
            || parseSqlDateWithLuxon(value, luxonDT)
            || parseRfc2822DateWithLuxon(value, luxonDT);
    }

    function formatDateOnly(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        return `${year}-${month}-${day}`;
    }

    function formatDateTimeForInput(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        const hour = padFn(dateObj.getHours());
        const minute = padFn(dateObj.getMinutes());
        const second = padFn(dateObj.getSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    function formatLocalDateTime(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        const hour = padFn(dateObj.getHours());
        const minute = padFn(dateObj.getMinutes());
        const second = padFn(dateObj.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    function formatUTCDateTime(dateObj, padFn = defaultPad2) {
        const year = dateObj.getUTCFullYear();
        const month = padFn(dateObj.getUTCMonth() + 1);
        const day = padFn(dateObj.getUTCDate());
        const hour = padFn(dateObj.getUTCHours());
        const minute = padFn(dateObj.getUTCMinutes());
        const second = padFn(dateObj.getUTCSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    function formatUTCDateOnlyStartOfDay(dateObj, padFn = defaultPad2) {
        const year = dateObj.getUTCFullYear();
        const month = padFn(dateObj.getUTCMonth() + 1);
        const day = padFn(dateObj.getUTCDate());
        return `${year}-${month}-${day} 00:00:00`;
    }


    function createService(_deps = {}) {
        return Object.freeze({
            isValidDateObject,
            buildValidatedLocalDate,
            buildValidatedUtcDate,
            parseLocalDateOnlyString,
            parseLocalDateTimeString,
            parseUtcDateTimeString,
            parseUtcDateOnlyString,
            parseSqlDateTimeString,
            parseZonedIsoString,
            parseRfc2822String,
            parseIsoLocalDateString,
            parseIsoUtcDateString,
            parseSqlDateWithLuxon,
            parseRfc2822DateWithLuxon,
            toValidDate,
            formatDateOnly,
            formatDateTimeForInput,
            formatLocalDateTime,
            formatUTCDateTime,
            formatUTCDateOnlyStartOfDay,
            defaultPad2
        });
    }

    const defaultService = createService();

    globalObj.GTVCalculatorDateFormat = Object.freeze({
        createService,
        isValidDateObject: defaultService.isValidDateObject,
        buildValidatedLocalDate: defaultService.buildValidatedLocalDate,
        buildValidatedUtcDate: defaultService.buildValidatedUtcDate,
        parseLocalDateOnlyString: defaultService.parseLocalDateOnlyString,
        parseLocalDateTimeString: defaultService.parseLocalDateTimeString,
        parseUtcDateTimeString: defaultService.parseUtcDateTimeString,
        parseUtcDateOnlyString: defaultService.parseUtcDateOnlyString,
        parseSqlDateTimeString: defaultService.parseSqlDateTimeString,
        parseZonedIsoString: defaultService.parseZonedIsoString,
        parseRfc2822String: defaultService.parseRfc2822String,
        parseIsoLocalDateString: defaultService.parseIsoLocalDateString,
        parseIsoUtcDateString: defaultService.parseIsoUtcDateString,
        parseSqlDateWithLuxon: defaultService.parseSqlDateWithLuxon,
        parseRfc2822DateWithLuxon: defaultService.parseRfc2822DateWithLuxon,
        toValidDate: defaultService.toValidDate,
        formatDateOnly: defaultService.formatDateOnly,
        formatDateTimeForInput: defaultService.formatDateTimeForInput,
        formatLocalDateTime: defaultService.formatLocalDateTime,
        formatUTCDateTime: defaultService.formatUTCDateTime,
        formatUTCDateOnlyStartOfDay: defaultService.formatUTCDateOnlyStartOfDay,
        defaultPad2: defaultService.defaultPad2
    });
})(typeof window !== "undefined" ? window : globalThis);
