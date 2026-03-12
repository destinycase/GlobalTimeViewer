(function initGtvGroupState(globalObj) {
    "use strict";

    function createService(deps) {
        const timeZoneValidationCache = new Map();

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

            timeZoneValidationCache.set(normalized, valid);
            return valid;
        }

        function sanitizeTimezoneZone(zone) {
            if (!zone || typeof zone !== "object") return null;
            const zoneType = zone.type === "custom" ? "custom" : "standard";
            const requestedId = deps.sanitizeTimezoneId(zone.id);
            const fallbackPrefix = zoneType === "custom" ? "tz-c" : "tz";
            const id = requestedId || deps.createUniqueTimezoneId(fallbackPrefix);
            if (!id) return null;

            if (zoneType === "custom") {
                const offH = parseInt(zone.offH, 10);
                const offM = parseInt(zone.offM, 10);
                return {
                    id,
                    type: "custom",
                    abbr: deps.normalizeCustomAbbr(zone.abbr),
                    name: (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : deps.t("label_custom"),
                    offH: Number.isFinite(offH) ? Math.max(-14, Math.min(14, offH)) : 0,
                    offM: Number.isFinite(offM) ? Math.max(0, Math.min(59, Math.abs(offM))) : 0
                };
            }

            const timeZoneName = (typeof zone.zone === "string" && zone.zone.trim()) ? zone.zone : null;
            if (!timeZoneName || !isValidTimeZone(timeZoneName)) return null;
            const fallbackName = (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : timeZoneName;
            const rawFixedOffset = zone.fixedOffsetMinutes;
            const hasFixedOffsetValue = (
                rawFixedOffset !== null
                && rawFixedOffset !== undefined
                && !(typeof rawFixedOffset === "string" && !rawFixedOffset.trim())
            );
            const parsedFixedOffset = hasFixedOffsetValue ? Number(rawFixedOffset) : NaN;
            const fixedOffsetMinutes = Number.isFinite(parsedFixedOffset)
                ? Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsedFixedOffset)))
                : null;
            const fixedAbbr = deps.normalizeZoneAbbreviation(zone.fixedAbbr);
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
                let zoneId = deps.sanitizeTimezoneId(zone.id);
                if (!zoneId || seenZoneIds.has(zoneId)) {
                    const prefix = zone.type === "custom" ? "tz-c" : "tz";
                    do {
                        zoneId = deps.createUniqueTimezoneId(prefix);
                    } while (!zoneId || seenZoneIds.has(zoneId));
                }
                zone.id = zoneId;
                seenZoneIds.add(zoneId);
            });

            const name = (typeof group.name === "string" && group.name.trim()) ? group.name.trim() : `${deps.t("default_group_name")} ${idx + 1}`;
            let requestedBaseTimezoneId = deps.sanitizeBaseTimezoneId(group.baseTimezoneId);
            if (requestedBaseTimezoneId !== "utc") {
                const baseIsLegacyUtcZone = rawZones.some((zone) => zone.id === requestedBaseTimezoneId && zone.type === "standard" && zone.zone === "UTC");
                if (baseIsLegacyUtcZone) requestedBaseTimezoneId = "utc";
            }
            const isBaseTimezoneValid = requestedBaseTimezoneId === "utc" || zones.some((zone) => zone.id === requestedBaseTimezoneId);
            const hasLegacyUtcZone = rawZones.length !== zones.length;
            const showUtcRow = hasLegacyUtcZone ? true : (typeof group.showUtcRow === "boolean" ? group.showUtcRow : true);
            const utcRowOrder = deps.sanitizeUtcRowOrder(group.utcRowOrder);
            const rawMultiSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const multiSubgroups = rawMultiSubgroups.map((subgroup) => ({
                id: deps.sanitizeMultiSubgroupId(subgroup?.id),
                name: subgroup?.name,
                multiRangeCount: subgroup?.multiRangeCount,
                multiRanges: subgroup?.multiRanges,
                multiRangeCollapsed: subgroup?.multiRangeCollapsed,
                multiRangeStartEditEnabled: subgroup?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: subgroup?.multiRangeEndEditEnabled
            }));
            const activeMultiSubgroupId = deps.sanitizeMultiSubgroupId(group.activeMultiSubgroupId);
            const sanitizedGroup = {
                name,
                zones,
                baseTimezoneId: isBaseTimezoneValid ? requestedBaseTimezoneId : "utc",
                showUtcRow,
                utcRowOrder,
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

            deps.ensureGroupMultiSubgroups(sanitizedGroup, { legacyMultiState: groupLegacyMultiState || legacyMultiState });
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
