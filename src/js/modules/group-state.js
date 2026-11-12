(function initGtvGroupState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const timeZoneValidationCache = new Map();
        const maxTimeZoneValidationCacheSize = (() => {
            const parsed = Number.parseInt(safeDeps.MAX_TIMEZONE_VALIDATION_CACHE_SIZE, 10);
            if (!Number.isFinite(parsed) || parsed < 1) return 512;
            return Math.min(5000, Math.max(1, parsed));
        })();
        let generatedIdCounter = 0;

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVGroupState", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "createUniqueTimezoneId",
                "sanitizeTimezoneId",
                "normalizeCustomAbbr",
                "t",
                "normalizeZoneAbbreviation",
                "sanitizeBaseTimezoneId",
                "sanitizeUtcRowOrder",
                "sanitizeMultiSubgroupId",
                "sanitizeFixedTimes",
                "sanitizeFixedDateValue",
                "sanitizeFixedTimeShowLiveNow",
                "ensureGroupMultiSubgroups"
            ])
        });

        function createTimezoneId(prefix = "tz") {
            const fromDep = dep.createUniqueTimezoneId(prefix);
            if (typeof fromDep === "string" && fromDep.trim()) return fromDep.trim();
            generatedIdCounter += 1;
            return `${prefix}-${Date.now()}-${generatedIdCounter}`;
        }

        function isValidTimeZone(zoneName) {
            const normalized = (typeof zoneName === "string") ? zoneName.trim() : "";
            if (!normalized) return false;
            if (timeZoneValidationCache.has(normalized)) {
                return timeZoneValidationCache.get(normalized);
            }

            let valid = false;
            try {
                new Intl.DateTimeFormat("en-US", { timeZone: normalized }).format(new Date());
                valid = true;
            } catch (err) {
                valid = false;
            }

            while (timeZoneValidationCache.size >= maxTimeZoneValidationCacheSize) {
                const oldestKey = timeZoneValidationCache.keys().next().value;
                if (oldestKey === undefined) break;
                timeZoneValidationCache.delete(oldestKey);
            }
            timeZoneValidationCache.set(normalized, valid);
            return valid;
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

        // Before v3.11.1 the country list saved cities that observe daylight saving time as a fixed
        // standard or daylight variant (for example Los Angeles fixed at UTC-07:00 "PDT"). Such an
        // entry never shows [DST] and keeps the wrong offset for half of the year. A city entry
        // whose fixed offset equals the same city's January or July offset is turned back into a
        // rule-following entry. Offsets that match neither season are kept as they are; offset-list
        // entries (zone "UTC") are turned into fixed-offset custom entries by sanitizeGroup.
        function isLegacyFixedCityOffset(zoneName, fixedOffsetMinutes) {
            if (fixedOffsetMinutes === null || zoneName === "UTC") return false;
            const timeCore = globalObj?.GTVTimeCore || globalThis.GTVTimeCore;
            if (!timeCore || typeof timeCore.getZoneSeasonalOffsets !== "function") return false;
            return timeCore.getZoneSeasonalOffsets(zoneName, new Date()).includes(fixedOffsetMinutes);
        }

        function sanitizeTimezoneZone(zone) {
            if (!zone || typeof zone !== "object") return null;
            const zoneType = zone.type === "custom" ? "custom" : "standard";
            const requestedIdRaw = dep.sanitizeTimezoneId(zone.id);
            const requestedId = (typeof requestedIdRaw === "string") ? requestedIdRaw : "";
            const fallbackPrefix = zoneType === "custom" ? "tz-c" : "tz";
            const id = requestedId || createTimezoneId(fallbackPrefix);
            if (!id) return null;

            if (zoneType === "custom") {
                const offH = parseInt(zone.offH, 10);
                const offM = parseInt(zone.offM, 10);
                return {
                    id,
                    type: "custom",
                    abbr: String(dep.normalizeCustomAbbr(zone.abbr) || ""),
                    name: (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : String(dep.t("label_custom") || "Custom"),
                    offH: Number.isFinite(offH) ? Math.max(-14, Math.min(14, offH)) : 0,
                    offM: Number.isFinite(offM) ? Math.max(0, Math.min(59, Math.abs(offM))) : 0
                };
            }

            const timeZoneName = (typeof zone.zone === "string" && zone.zone.trim()) ? zone.zone : null;
            if (!timeZoneName || !isValidTimeZone(timeZoneName)) return null;
            const fallbackName = (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : timeZoneName;
            const parsedFixedOffsetMinutes = parseFixedOffsetMinutes(zone.fixedOffsetMinutes);
            const followsZoneRules = isLegacyFixedCityOffset(timeZoneName, parsedFixedOffsetMinutes);
            const fixedOffsetMinutes = followsZoneRules ? null : parsedFixedOffsetMinutes;
            const fixedAbbr = followsZoneRules ? "" : String(dep.normalizeZoneAbbreviation(zone.fixedAbbr) || "");
            return {
                id,
                type: "standard",
                zone: timeZoneName,
                name_ko: (typeof zone.name_ko === "string" && zone.name_ko.trim()) ? zone.name_ko : fallbackName,
                name_en: (typeof zone.name_en === "string" && zone.name_en.trim()) ? zone.name_en : fallbackName,
                fixedOffsetMinutes,
                fixedAbbr: fixedAbbr || ""
            };
        }

        function convertOffsetListZone(zone) {
            if (zone.type !== "standard" || zone.zone !== "UTC" || !zone.fixedOffsetMinutes) return zone;
            const timeCore = globalObj?.GTVTimeCore || globalThis.GTVTimeCore;
            const fields = timeCore && typeof timeCore.toCustomOffsetFields === "function"
                ? timeCore.toCustomOffsetFields(zone.fixedOffsetMinutes)
                : null;
            if (!fields) return zone;
            return {
                id: zone.id,
                type: "custom",
                abbr: String(dep.normalizeCustomAbbr(fields.abbr) || fields.abbr),
                name: `${fields.abbr} ${String(dep.t("standard_time_suffix") || "Standard Time")}`,
                offH: fields.offH,
                offM: fields.offM
            };
        }

        function sanitizeGroup(group, idx, legacyMultiState = null) {
            if (!group || typeof group !== "object") return null;

            // Up to v3.16.10 the standard time list saved its items as zone "UTC" plus a fixed offset,
            // which every screen treats as the UTC row, so they were never shown and were dropped
            // here. They become fixed-offset custom entries ("UTC+09:00") with the same id; a plain
            // UTC entry (offset 0 or none) still folds into the UTC row.
            const rawZones = Array.isArray(group.zones)
                ? group.zones.map(sanitizeTimezoneZone).filter(Boolean).map(convertOffsetListZone)
                : [];
            const zones = rawZones
                .filter((zone) => !(zone.type === "standard" && zone.zone === "UTC"))
                .map((zone) => ({ ...zone }));

            const seenZoneIds = new Set(["utc"]);
            zones.forEach((zone) => {
                const zoneIdRaw = dep.sanitizeTimezoneId(zone.id);
                let zoneId = (typeof zoneIdRaw === "string") ? zoneIdRaw : "";
                if (!zoneId || seenZoneIds.has(zoneId)) {
                    const prefix = zone.type === "custom" ? "tz-c" : "tz";
                    do {
                        zoneId = createTimezoneId(prefix);
                    } while (!zoneId || seenZoneIds.has(zoneId));
                }
                zone.id = zoneId;
                seenZoneIds.add(zoneId);
            });

            const defaultGroupLabel = String(dep.t("default_group_name") || "Group");
            const safeIndex = Number.isFinite(Number(idx)) ? Math.max(0, Math.trunc(Number(idx))) : 0;
            const name = (typeof group.name === "string" && group.name.trim()) ? group.name.trim() : `${defaultGroupLabel} ${safeIndex + 1}`;
            const requestedBaseTimezoneIdRaw = dep.sanitizeBaseTimezoneId(group.baseTimezoneId);
            let requestedBaseTimezoneId = (typeof requestedBaseTimezoneIdRaw === "string" && requestedBaseTimezoneIdRaw)
                ? requestedBaseTimezoneIdRaw
                : "utc";
            if (requestedBaseTimezoneId !== "utc") {
                const baseIsLegacyUtcZone = rawZones.some((zone) => zone.id === requestedBaseTimezoneId && zone.type === "standard" && zone.zone === "UTC");
                if (baseIsLegacyUtcZone) requestedBaseTimezoneId = "utc";
            }
            const isBaseTimezoneValid = requestedBaseTimezoneId === "utc" || zones.some((zone) => zone.id === requestedBaseTimezoneId);
            const hasLegacyUtcZone = rawZones.length !== zones.length;
            const showUtcRow = hasLegacyUtcZone ? true : (typeof group.showUtcRow === "boolean" ? group.showUtcRow : true);
            const utcRowOrder = dep.sanitizeUtcRowOrder(group.utcRowOrder) ?? 0;
            const rawMultiSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const multiSubgroups = rawMultiSubgroups.map((subgroup) => ({
                id: String(dep.sanitizeMultiSubgroupId(subgroup?.id) || ""),
                name: subgroup?.name,
                multiRangeCount: subgroup?.multiRangeCount,
                multiRanges: subgroup?.multiRanges,
                multiRangeCollapsed: subgroup?.multiRangeCollapsed,
                multiRangeStartEditEnabled: subgroup?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: subgroup?.multiRangeEndEditEnabled
            }));
            const activeMultiSubgroupId = String(dep.sanitizeMultiSubgroupId(group.activeMultiSubgroupId) || "");
            const fixedTimesRaw = dep.sanitizeFixedTimes(group.fixedTimes);
            const fixedTimes = Array.isArray(fixedTimesRaw) ? fixedTimesRaw : [];
            const fixedDateRaw = dep.sanitizeFixedDateValue(group.fixedDate, "");
            const fixedDate = (typeof fixedDateRaw === "string") ? fixedDateRaw : "";
            const fixedTimeShowLiveNowRaw = dep.sanitizeFixedTimeShowLiveNow(group.fixedTimeShowLiveNow, false);
            const fixedTimeShowLiveNow = (fixedTimeShowLiveNowRaw === undefined)
                ? !!group.fixedTimeShowLiveNow
                : !!fixedTimeShowLiveNowRaw;
            // Per-group day/night hours (optional). A group without them follows the shared value.
            const dayStartHourRaw = Number(group.dayStartHour);
            const nightStartHourRaw = Number(group.nightStartHour);
            const hasDayNight = Number.isInteger(dayStartHourRaw) && Number.isInteger(nightStartHourRaw)
                && dayStartHourRaw >= 0 && nightStartHourRaw <= 23 && nightStartHourRaw > dayStartHourRaw;
            const sanitizedGroup = {
                name,
                zones,
                baseTimezoneId: isBaseTimezoneValid ? requestedBaseTimezoneId : "utc",
                showUtcRow,
                utcRowOrder,
                fixedTimes,
                fixedDate,
                fixedTimeShowLiveNow,
                activeMultiSubgroupId,
                multiSubgroups
            };
            if (hasDayNight) {
                sanitizedGroup.dayStartHour = dayStartHourRaw;
                sanitizedGroup.nightStartHour = nightStartHourRaw;
            }

            const hasLegacyMultiState = group.multiRanges || group.multiRangeCount || group.multiRangeCollapsed || group.multiRangeStartEditEnabled || group.multiRangeEndEditEnabled;
            const groupLegacyMultiState = hasLegacyMultiState
                ? {
                    multiRangeCount: group.multiRangeCount,
                    multiRanges: group.multiRanges,
                    multiRangeCollapsed: group.multiRangeCollapsed,
                    multiRangeStartEditEnabled: group.multiRangeStartEditEnabled,
                    multiRangeEndEditEnabled: group.multiRangeEndEditEnabled,
                    multiRangeTitle: group.multiRangeTitle
                }
                : null;

            dep.ensureGroupMultiSubgroups(sanitizedGroup, { legacyMultiState: groupLegacyMultiState || legacyMultiState });
            return sanitizedGroup;
        }

        return Object.freeze({
            sanitizeTimezoneZone,
            isValidTimeZone,
            sanitizeGroup
        });
    }

    globalObj.GTVGroupState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
