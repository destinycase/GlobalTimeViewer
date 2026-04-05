(function initGtvMainTimezoneRuntimeServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const maxRuntimeCacheSize = Number.isFinite(Number(safeDeps.maxRuntimeCacheSize))
            ? Math.max(1, Math.trunc(Number(safeDeps.maxRuntimeCacheSize)))
            : 4096;
        const timezoneOffsetCache = (safeDeps.timezoneOffsetCache instanceof Map)
            ? safeDeps.timezoneOffsetCache
            : new Map();
        const timezoneDstCache = (safeDeps.timezoneDstCache instanceof Map)
            ? safeDeps.timezoneDstCache
            : new Map();
        const zoneAbbrCache = (safeDeps.zoneAbbrCache instanceof Map)
            ? safeDeps.zoneAbbrCache
            : new Map();
        const getBaseTime = (typeof safeDeps.getBaseTime === "function")
            ? safeDeps.getBaseTime
            : (() => new Date());
        const getZoneMap = (typeof safeDeps.getZoneMap === "function")
            ? safeDeps.getZoneMap
            : (() => (safeDeps.zoneMap && typeof safeDeps.zoneMap === "object") ? safeDeps.zoneMap : {});
        const getTzDatabase = (typeof safeDeps.getTzDatabase === "function")
            ? safeDeps.getTzDatabase
            : (() => (Array.isArray(safeDeps.tzDatabase) ? safeDeps.tzDatabase : []));
        const getTimeService = (typeof safeDeps.getTimeService === "function")
            ? safeDeps.getTimeService
            : (() => null);
        const normalizeCustomAbbr = (typeof safeDeps.normalizeCustomAbbr === "function")
            ? safeDeps.normalizeCustomAbbr
            : ((value) => String(value || "").trim().toUpperCase());
        const getTimezoneSearchService = (typeof safeDeps.getTimezoneSearchService === "function")
            ? safeDeps.getTimezoneSearchService
            : (() => null);
        const formatUtcOffsetLabel = (typeof safeDeps.formatUtcOffsetLabel === "function")
            ? safeDeps.formatUtcOffsetLabel
            : ((value) => String(value || ""));
        const getCurrentLang = (typeof safeDeps.getCurrentLang === "function")
            ? safeDeps.getCurrentLang
            : (() => "en");
        const t = (typeof safeDeps.t === "function")
            ? safeDeps.t
            : ((key) => String(key || ""));
        const resolveLocalizedTZLabel = (typeof safeDeps.resolveLocalizedTZLabel === "function")
            ? safeDeps.resolveLocalizedTZLabel
            : null;

        function getUtcMinuteCacheKey(date) {
            const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
            return [
                safeDate.getUTCFullYear(),
                safeDate.getUTCMonth(),
                safeDate.getUTCDate(),
                safeDate.getUTCHours(),
                safeDate.getUTCMinutes()
            ].join(":");
        }

        function setCappedRuntimeCache(cache, key, value) {
            if (!(cache instanceof Map)) return;
            if (cache.size >= maxRuntimeCacheSize) {
                const oldestKey = cache.keys().next().value;
                if (oldestKey !== undefined) cache.delete(oldestKey);
            }
            cache.set(key, value);
        }

        function parseFixedOffsetMinutes(rawValue) {
            if (rawValue === null || rawValue === undefined) return null;
            if (typeof rawValue === "string") {
                if (!rawValue.trim()) return null;
                const parsedString = Number(rawValue);
                if (!Number.isFinite(parsedString)) return null;
                return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsedString)));
            }
            if (typeof rawValue === "number") {
                if (!Number.isFinite(rawValue)) return null;
                return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(rawValue)));
            }
            return null;
        }

        function resolveTimezoneOffsetViaIntl(zone, date) {
            const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
            const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
            try {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: safeZone,
                    hour12: false,
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
                if (typeof formatter.formatToParts !== "function") return Number.NaN;
                const partMap = {};
                formatter.formatToParts(safeDate).forEach((part) => {
                    if (part && typeof part.type === "string") {
                        partMap[part.type] = part.value;
                    }
                });
                const year = Number(partMap.year);
                const month = Number(partMap.month);
                const day = Number(partMap.day);
                let hour = Number(partMap.hour);
                const minute = Number(partMap.minute);
                const second = Number(partMap.second);
                if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return Number.NaN;
                if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(second)) return Number.NaN;
                if (hour === 24) hour = 0;
                const asUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
                const diffMinutes = Math.round((asUtcMs - safeDate.getTime()) / 60000);
                return Number.isFinite(diffMinutes) ? diffMinutes : Number.NaN;
            } catch (_) {
                return Number.NaN;
            }
        }

        function isTimeZoneInDST(zone, date) {
            const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
            const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
            const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
            if (timezoneDstCache.has(cacheKey)) return timezoneDstCache.get(cacheKey);

            let inDst = false;
            try {
                const year = safeDate.getUTCFullYear();
                const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
                const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
                const janOffset = Number(getTimezoneOffset(safeZone, jan));
                const julOffset = Number(getTimezoneOffset(safeZone, jul));
                const currentOffset = Number(getTimezoneOffset(safeZone, safeDate));
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset) || !Number.isFinite(currentOffset)) {
                    throw new Error("Timezone offset unavailable");
                }
                const standardOffset = Math.min(janOffset, julOffset);
                inDst = currentOffset !== standardOffset;
            } catch (_) {
                inDst = false;
            }
            setCappedRuntimeCache(timezoneDstCache, cacheKey, inDst);
            return inDst;
        }

        function getBetterAbbr(zone, date) {
            if (zone === "UTC") return "UTC";
            const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
            const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
            const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
            if (zoneAbbrCache.has(cacheKey)) return zoneAbbrCache.get(cacheKey);

            let abbr = "";
            const zoneMap = getZoneMap();
            const mapping = zoneMap[safeZone];
            if (mapping) {
                const mappedAbbr = (typeof mapping === "string")
                    ? mapping
                    : (isTimeZoneInDST(safeZone, safeDate) ? mapping[1] : mapping[0]);
                abbr = String(mappedAbbr || "").replace("GMT", "UTC");
                setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
                return abbr;
            }

            const timeService = getTimeService();
            try {
                if (!timeService || typeof timeService.toDateTime !== "function") throw new Error("Time service unavailable");
                abbr = (timeService.toDateTime(safeDate).setZone(safeZone).offsetNameShort || "").replace("GMT", "UTC");
            } catch (_) {
                abbr = "";
            }
            setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
            return abbr;
        }

        function getTimezoneOffset(zone, date) {
            const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
            const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
            const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
            if (timezoneOffsetCache.has(cacheKey)) return timezoneOffsetCache.get(cacheKey);

            let offset = Number.NaN;
            const timeService = getTimeService();
            try {
                if (!timeService || typeof timeService.toDateTime !== "function") throw new Error("Time service unavailable");
                const candidate = Number(timeService.toDateTime(safeDate).setZone(safeZone).offset);
                offset = Number.isFinite(candidate) ? Math.trunc(candidate) : Number.NaN;
            } catch (_) {
                offset = Number.NaN;
            }
            if (!Number.isFinite(offset)) {
                offset = resolveTimezoneOffsetViaIntl(safeZone, safeDate);
            }
            if (Number.isFinite(offset)) {
                const normalized = Math.trunc(offset);
                setCappedRuntimeCache(timezoneOffsetCache, cacheKey, normalized);
                return normalized;
            }
            return Number.NaN;
        }

        function getZoneAbbreviation(tz, date = getBaseTime()) {
            if (!tz) return "";
            if (tz.zone === "UTC") return "UTC";
            if (tz.type === "custom") return normalizeCustomAbbr(tz.abbr);

            const timezoneSearchService = getTimezoneSearchService();
            const fixedAbbr = (timezoneSearchService && typeof timezoneSearchService.normalizeZoneAbbreviation === "function")
                ? timezoneSearchService.normalizeZoneAbbreviation(tz.fixedAbbr)
                : "";
            if (fixedAbbr) return fixedAbbr;
            return getBetterAbbr(tz.zone, date);
        }

        function getFixedOffsetForDisplayAtDate(tz, _anchorDate) {
            if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
            return parseFixedOffsetMinutes(tz.fixedOffsetMinutes);
        }

        function getFixedOffsetForDisplay(tz) {
            return getFixedOffsetForDisplayAtDate(tz, getBaseTime());
        }

        function getLocalizedTZLabel(tzData) {
            const lang = getCurrentLang();
            if (lang === "en") return `${tzData.name_en} - ${tzData.city_en}`;
            return `${tzData.name} - ${tzData.city}`;
        }

        function getZoneDisplayName(tz) {
            if (!tz) return "";
            const lang = getCurrentLang();

            if (tz.type === "custom") {
                return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
            }

            const parsedFixedOffsetMinutes = parseFixedOffsetMinutes(tz.fixedOffsetMinutes);
            if (parsedFixedOffsetMinutes !== null) {
                const nameFallback = tz.name_ko || tz.name || tz.name_en || "";
                const lowerName = String(nameFallback).toLowerCase();
                if (lowerName.includes("standard time") || nameFallback.includes("\uD45C\uC900\uC2DC")) {
                    const offsetLabel = formatUtcOffsetLabel(parsedFixedOffsetMinutes);
                    return lang === "en"
                        ? `${offsetLabel} Standard Time`
                        : `${offsetLabel} \uD45C\uC900\uC2DC`;
                }
            }

            if (tz.zone === "UTC") return t("utc_name");

            if (tz.zone && tz.zone !== "UTC") {
                const tzDatabase = getTzDatabase();
                const dbEntry = tzDatabase.find((entry) => entry.zone === tz.zone);
                if (dbEntry) {
                    if (resolveLocalizedTZLabel) {
                        return resolveLocalizedTZLabel(dbEntry);
                    }
                    return getLocalizedTZLabel(dbEntry);
                }
            }

            if (lang === "en") return tz.name_en || tz.name || tz.name_ko || tz.zone || "";
            return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
        }

        function hasFixedOffsetMinutes(tz) {
            return parseFixedOffsetMinutes(tz?.fixedOffsetMinutes) !== null;
        }

        function canDisplayDstBadge(tz) {
            if (!tz || typeof tz !== "object") return false;
            if (tz.type !== "standard") return false;
            if (hasFixedOffsetMinutes(tz)) return false;
            const zone = (typeof tz.zone === "string") ? tz.zone.trim() : "";
            if (!zone || zone === "UTC") return false;
            return true;
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate = getBaseTime()) {
            const baseName = String(getZoneDisplayName(tz) || "").trim();
            if (!baseName) return "";
            if (!canDisplayDstBadge(tz)) return baseName;

            const safeDate = (anchorDate instanceof Date && Number.isFinite(anchorDate.getTime()))
                ? anchorDate
                : getBaseTime();
            const inDst = isTimeZoneInDST(tz.zone, safeDate);
            if (!inDst) return baseName.replace(/\s*\[DST\]\s*$/i, "").trim();

            const normalizedBaseName = baseName.replace(/\s*\[DST\]\s*$/i, "").trim();
            return `${normalizedBaseName} [DST]`;
        }

        return Object.freeze({
            getUtcMinuteCacheKey,
            setCappedRuntimeCache,
            getZoneAbbreviation,
            getBetterAbbr,
            isTimeZoneInDST,
            getTimezoneOffset,
            getFixedOffsetForDisplayAtDate,
            getFixedOffsetForDisplay,
            getLocalizedTZLabel,
            getZoneDisplayName,
            getZoneDisplayNameForUiAtDate
        });
    }

    globalObj.GTVMainTimezoneRuntimeServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
