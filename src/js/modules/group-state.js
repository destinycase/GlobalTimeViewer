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
                    logWarn(`[GTVGroupState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

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
            const fixedOffsetMinutes = parseFixedOffsetMinutes(zone.fixedOffsetMinutes);
            const fixedAbbr = String(dep.normalizeZoneAbbreviation(zone.fixedAbbr) || "");
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

        function sanitizeGroup(group, idx, legacyMultiState = null) {
            if (!group || typeof group !== "object") return null;

            const rawZones = Array.isArray(group.zones) ? group.zones.map(sanitizeTimezoneZone).filter(Boolean) : [];
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
