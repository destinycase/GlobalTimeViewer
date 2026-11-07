(function initGtvImageExportNaming(globalObj) {
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
                    logWarn(`[GTVImageExportNaming] Dependency "${depName}" threw.`, err);
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
                "getCustomOffsetMinutes",
                "getBaseTimezoneRef",
                "getActiveGroupName",
                "t",
                "getZoneAbbreviation",
                "getBaseTime",
                "sanitizeMultiSubgroupName",
                "getCurrentMultiSubgroupName"
            ])
        });

        function pad2(value) {
            const depPad = safeDeps.pad;
            const n = Number(value);
            if (typeof depPad === "function") {
                try {
                    return String(depPad(n));
                } catch (_err) {
                    // 의존 패딩 함수 실패 시 로컬 패딩으로 대체한다.
                }
            }
            return String(Number.isFinite(n) ? n : 0).padStart(2, "0");
        }

        function sanitizeFilenamePart(value) {
            return String(value || "")
                .replace(/[\\/:*?"<>|]/g, "")
                .replace(/\s+/g, " ")
                .trim();
        }

        function resolveDate(value) {
            if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
            const parsed = new Date(value);
            if (!Number.isNaN(parsed.getTime())) return parsed;
            return new Date();
        }

        function formatDateTimeByTimezone(date, tz) {
            const targetDate = resolveDate(date);
            const safeTimezone = (tz && typeof tz === "object") ? tz : {};

            if (safeTimezone.type === "custom") {
                const offsetMinRaw = dep.getCustomOffsetMinutes(safeTimezone);
                const offsetMin = Number.isFinite(Number(offsetMinRaw)) ? Number(offsetMinRaw) : 0;
                const shifted = new Date(targetDate.getTime() + (offsetMin * 60000));
                return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())} ${pad2(shifted.getUTCHours())}:${pad2(shifted.getUTCMinutes())}:${pad2(shifted.getUTCSeconds())}`;
            }

            const timeService = safeDeps.timeService;
            if (timeService && typeof timeService.resolveLocalDateParts === "function") {
                const p = timeService.resolveLocalDateParts(targetDate, safeTimezone.zone || "UTC", safeTimezone.id, null);
                if (p && Number.isFinite(Number(p.Y))) {
                    return `${p.Y}-${pad2(p.M)}-${pad2(p.D)} ${pad2(p.H)}:${pad2(p.min)}:${pad2(p.S)}`;
                }
            }

            return `${targetDate.getUTCFullYear()}-${pad2(targetDate.getUTCMonth() + 1)}-${pad2(targetDate.getUTCDate())} ${pad2(targetDate.getUTCHours())}:${pad2(targetDate.getUTCMinutes())}:${pad2(targetDate.getUTCSeconds())}`;
        }

        function getTimezoneTableImageFilename() {
            const baseRef = dep.getBaseTimezoneRef() || { type: "standard", zone: "UTC", id: "utc" };
            const groupName =
                sanitizeFilenamePart(dep.getActiveGroupName() || dep.t("default_group_name")) || "Group";
            const baseAbbr = sanitizeFilenamePart(dep.getZoneAbbreviation(baseRef) || "UTC") || "UTC";
            const baseDateTime = formatDateTimeByTimezone(dep.getBaseTime(), baseRef).trim();
            const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            const timePart =
                sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

            return `${groupName}_${baseAbbr}_${timePart}`;
        }

        function getSanitizedSubgroupName() {
            const subgroupName = dep.sanitizeMultiSubgroupName(dep.getCurrentMultiSubgroupName(), "subgroup");
            return sanitizeFilenamePart(subgroupName || "") || "subgroup";
        }

        function getMultiRangeTableImageFilename(rangeIdx) {
            const baseName = getTimezoneTableImageFilename();
            const safeRangeIdx = Number.isInteger(rangeIdx) && rangeIdx >= 0 ? rangeIdx : 0;
            const rangeLabel = sanitizeFilenamePart(`${getSanitizedSubgroupName()} ${safeRangeIdx + 1}`) || `range_${safeRangeIdx + 1}`;
            return `${baseName}_${rangeLabel}.png`;
        }

        function getMultiRangeTitlesImageFilename() {
            const baseName = getTimezoneTableImageFilename();
            const titleLabel = getSanitizedSubgroupName() || "range";
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

    globalObj.GTVImageExportNaming = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
