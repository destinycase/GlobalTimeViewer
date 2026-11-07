(function initGtvMainImageExportNamingProxy(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getImageExportNamingService = (typeof safeDeps.getImageExportNamingService === "function")
            ? safeDeps.getImageExportNamingService
            : (() => {
                if (!safeDeps.imageExportNamingService || typeof safeDeps.imageExportNamingService !== "object") return null;
                return safeDeps.imageExportNamingService;
            });

        function getNamingService() {
            const service = getImageExportNamingService();
            if (!service || typeof service !== "object") return null;
            return service;
        }

        function sanitizeFilenamePart(value) {
            const service = getNamingService();
            if (service && typeof service.sanitizeFilenamePart === "function") {
                return service.sanitizeFilenamePart(value);
            }
            return String(value || "")
                .replace(/[\\/:*?"<>|]/g, "")
                .replace(/\s+/g, " ")
                .trim();
        }

        function formatDateTimeByTimezone(date, tz) {
            const service = getNamingService();
            if (service && typeof service.formatDateTimeByTimezone === "function") {
                return service.formatDateTimeByTimezone(date, tz);
            }

            const pad = (typeof safeDeps.pad === "function")
                ? safeDeps.pad
                : ((value) => String(value).padStart(2, "0"));
            if (tz?.type === "custom") {
                const offsetMin = (typeof safeDeps.getCustomOffsetMinutes === "function")
                    ? safeDeps.getCustomOffsetMinutes(tz)
                    : 0;
                const shifted = new Date(date.getTime() + (offsetMin * 60000));
                return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
            }

            const timeService = safeDeps.timeService;
            if (!timeService || typeof timeService.resolveLocalDateParts !== "function") {
                return "";
            }
            const localParts = timeService.resolveLocalDateParts(date, tz?.zone || "UTC", tz?.id, null);
            return `${localParts.Y}-${pad(localParts.M)}-${pad(localParts.D)} ${pad(localParts.H)}:${pad(localParts.min)}:${pad(localParts.S)}`;
        }

        function getTimezoneTableImageFilename() {
            const service = getNamingService();
            if (service && typeof service.getTimezoneTableImageFilename === "function") {
                return service.getTimezoneTableImageFilename();
            }

            const baseRef = (typeof safeDeps.getBaseTimezoneRef === "function")
                ? safeDeps.getBaseTimezoneRef()
                : null;
            const groups = (typeof safeDeps.getGroups === "function")
                ? safeDeps.getGroups()
                : [];
            const activeGroupId = (typeof safeDeps.getActiveGroupId === "function")
                ? safeDeps.getActiveGroupId()
                : 0;
            const translate = (typeof safeDeps.t === "function")
                ? safeDeps.t
                : ((key) => key);
            const getZoneAbbreviation = (typeof safeDeps.getZoneAbbreviation === "function")
                ? safeDeps.getZoneAbbreviation
                : (() => "UTC");
            const getBaseTime = (typeof safeDeps.getBaseTime === "function")
                ? safeDeps.getBaseTime
                : (() => new Date());

            const groupName = sanitizeFilenamePart(groups?.[activeGroupId]?.name || translate("default_group_name")) || "Group";
            const baseAbbr = sanitizeFilenamePart(getZoneAbbreviation(baseRef) || "UTC") || "UTC";
            const baseDateTime = formatDateTimeByTimezone(getBaseTime(), baseRef).trim();
            const match = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            const timePart = sanitizeFilenamePart(
                match ? `${match[1]} ${match[2]}${match[3]}${match[4]}` : baseDateTime.replace(/:/g, "")
            ) || "time";
            return `${groupName}_${baseAbbr}_${timePart}`;
        }

        function getMultiRangeTableImageFilename(rangeIdx) {
            const service = getNamingService();
            if (service && typeof service.getMultiRangeTableImageFilename === "function") {
                return service.getMultiRangeTableImageFilename(rangeIdx);
            }
            const sanitizeMultiSubgroupName = (typeof safeDeps.sanitizeMultiSubgroupName === "function")
                ? safeDeps.sanitizeMultiSubgroupName
                : ((value) => value || "subgroup");
            const getCurrentMultiSubgroupName = (typeof safeDeps.getCurrentMultiSubgroupName === "function")
                ? safeDeps.getCurrentMultiSubgroupName
                : (() => "subgroup");
            const baseName = getTimezoneTableImageFilename();
            const subgroupName = sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup");
            const rangeLabel = sanitizeFilenamePart(`${subgroupName} ${rangeIdx + 1}`) || `range_${rangeIdx + 1}`;
            return `${baseName}_${rangeLabel}.png`;
        }

        function getMultiRangeTitlesImageFilename() {
            const service = getNamingService();
            if (service && typeof service.getMultiRangeTitlesImageFilename === "function") {
                return service.getMultiRangeTitlesImageFilename();
            }
            const sanitizeMultiSubgroupName = (typeof safeDeps.sanitizeMultiSubgroupName === "function")
                ? safeDeps.sanitizeMultiSubgroupName
                : ((value) => value || "subgroup");
            const getCurrentMultiSubgroupName = (typeof safeDeps.getCurrentMultiSubgroupName === "function")
                ? safeDeps.getCurrentMultiSubgroupName
                : (() => "subgroup");
            const baseName = getTimezoneTableImageFilename();
            const titleLabel = sanitizeFilenamePart(
                sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup")
            ) || "range";
            return `${baseName}_${titleLabel}_titles.png`;
        }

        return Object.freeze({
            sanitizeFilenamePart,
            formatDateTimeByTimezone,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename
        });
    }

    globalObj.GTVMainImageExportNamingProxy = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
