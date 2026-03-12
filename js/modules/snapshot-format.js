(function initGtvSnapshotFormat(globalObj) {
    "use strict";

    function createService(deps) {
        function getDayNamesByLang() {
            const lang = deps.getCurrentLang();
            return deps.I18N_DATA?.[lang]?.days || deps.I18N_DATA?.en?.days || [];
        }

        function getTimezoneRefById(id) {
            if (!id) return null;
            if (id === "utc") return deps.getUTCRef();
            const baseRef = deps.getBaseTimezoneRef();
            if (baseRef.id === id) return baseRef;
            return deps.getCurrentGroupZones().find((zone) => zone.id === id) || null;
        }

        function buildTimezoneComputedSnapshot(id) {
            const tz = getTimezoneRefById(id);
            if (!tz) return null;

            const globalTimes = deps.getGlobalTimes();
            const anchorDate = globalTimes[0] instanceof Date ? globalTimes[0] : new Date();

            let zoneCodeMain = "";
            let offsetStr = "";
            const fixedDisplayOffsetMinutes = deps.getFixedOffsetForDisplay(tz);

            if (tz.type === "custom") {
                zoneCodeMain = deps.normalizeCustomAbbr(tz.abbr);
                const offsetMin = deps.getCustomOffsetMinutes(tz);
                const sign = offsetMin >= 0 ? "+" : "-";
                const absMin = Math.abs(offsetMin);
                const absHour = Math.floor(absMin / 60);
                const minPart = absMin % 60;
                offsetStr = `UTC${sign}${deps.pad(absHour)}:${deps.pad(minPart)}`;
            } else {
                zoneCodeMain = deps.getZoneAbbreviation(tz, anchorDate);
                if (Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
                    const absMin = Math.abs(fixedDisplayOffsetMinutes);
                    const absHour = Math.floor(absMin / 60);
                    const minPart = absMin % 60;
                    offsetStr = `UTC${sign}${deps.pad(absHour)}:${deps.pad(minPart)}`;
                } else {
                    const offFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
                    const partsArr = offFmt.formatToParts(anchorDate);
                    const offVal = partsArr.find((part) => part.type === "timeZoneName")?.value || "GMT+0";
                    const matched = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
                    if (matched) {
                        const sign = offVal.includes("+") ? "+" : "-";
                        offsetStr = `UTC${sign}${deps.pad(matched[1])}:${deps.pad(matched[2] || 0)}`;
                    } else {
                        offsetStr = "UTC+00:00";
                    }
                }
            }

            const dayNamesByLang = getDayNamesByLang();
            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            const timeValues = [];
            const dateValues = [];
            const clockValues = [];
            const dayNameValues = [];
            const dayNightIconValues = [];

            for (let i = 0; i < effectiveSlotCount; i++) {
                const slotDate = globalTimes[i] instanceof Date ? globalTimes[i] : anchorDate;
                if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const offsetMin = tz.type === "custom" ? deps.getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
                    const shifted = new Date(slotDate.getTime() + (offsetMin * 60000));
                    const timeStr = `${shifted.getUTCFullYear()}-${deps.pad(shifted.getUTCMonth() + 1)}-${deps.pad(shifted.getUTCDate())} ${deps.pad(shifted.getUTCHours())}:${deps.pad(shifted.getUTCMinutes())}:${deps.pad(shifted.getUTCSeconds())}`;
                    const dateStr = timeStr.split(" ")[0];
                    const dayStr = dayNamesByLang[shifted.getUTCDay()] || "";
                    const clockStr = timeStr.split(" ")[1] || "";
                    const dayNightIcon = shifted.getUTCHours() >= 6 && shifted.getUTCHours() <= 18 ? "DAY" : "NIGHT";
                    timeValues.push(timeStr);
                    dateValues.push(dateStr);
                    clockValues.push(clockStr);
                    dayNameValues.push(dayStr);
                    dayNightIconValues.push(dayNightIcon);
                    continue;
                }

                const fmt = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz.zone,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    weekday: "short",
                    hour12: false
                });
                const parts = fmt.formatToParts(slotDate);
                const get = (type) => parts.find((part) => part.type === type)?.value || "";
                const hour = parseInt(get("hour"), 10);
                const weekday = get("weekday");
                const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
                const weekdayIdx = weekdayMap[weekday];
                const safeHour = hour === 24 ? 0 : hour;
                const timeStr = `${get("year")}-${deps.pad(get("month"))}-${deps.pad(get("day"))} ${deps.pad(safeHour)}:${deps.pad(get("minute"))}:${deps.pad(get("second"))}`;
                const dayStr = Number.isInteger(weekdayIdx) ? (dayNamesByLang[weekdayIdx] || "") : "";
                const dateStr = timeStr.split(" ")[0];
                const clockStr = timeStr.split(" ")[1] || "";
                const dayNightIcon = safeHour >= 6 && safeHour <= 18 ? "DAY" : "NIGHT";
                timeValues.push(timeStr);
                dateValues.push(dateStr);
                clockValues.push(clockStr);
                dayNameValues.push(dayStr);
                dayNightIconValues.push(dayNightIcon);
            }

            let periodDaysText = "";
            let periodTimeText = "";
            if (effectiveSlotCount > 1 && timeValues.length > 1) {
                const spanDays = deps.getSignedInclusiveDaySpan(timeValues[0], timeValues[1]);
                const spanTime = deps.getSignedDurationDayHourMinute(timeValues[0], timeValues[1]);
                periodDaysText = spanDays === null ? "" : `${spanDays}${deps.t("unit_days_suffix")}`;
                periodTimeText = spanTime === null ? "" : spanTime;
            }

            return {
                timezone: zoneCodeMain,
                region: deps.getZoneDisplayName(tz),
                offset: offsetStr,
                times: timeValues,
                dates: dateValues,
                clocks: clockValues,
                dayNames: dayNameValues,
                dayNightIcons: dayNightIconValues,
                periodDays: periodDaysText,
                periodTime: periodTimeText
            };
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safeParts = deps.sanitizeTimePartsEnabled(timePartsEnabled, "copy");
            const dates = Array.isArray(snapshot.dates) ? snapshot.dates : [];
            const clocks = Array.isArray(snapshot.clocks) ? snapshot.clocks : [];
            const dayNames = Array.isArray(snapshot.dayNames) ? snapshot.dayNames : [];
            const dayNightIcons = Array.isArray(snapshot.dayNightIcons) ? snapshot.dayNightIcons : [];
            const slotSize = Math.max(dates.length, clocks.length, dayNames.length, dayNightIcons.length);
            const rendered = [];

            for (let i = 0; i < slotSize; i++) {
                const tokens = [];
                if (safeParts.dn && dayNightIcons[i]) tokens.push(dayNightIcons[i]);
                if (safeParts.date && dates[i]) tokens.push(dates[i]);
                if (safeParts.time && clocks[i]) tokens.push(clocks[i]);
                if (safeParts.weekday && dayNames[i]) tokens.push(`(${dayNames[i]})`);
                const merged = tokens.join(" ").trim();
                if (merged) rendered.push(merged);
            }

            return rendered.join(" ~ ");
        }

        function getCopyFieldText(snapshot, key, options = {}) {
            const { timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED } = options;
            if (!snapshot) return "";
            if (key === "timezone") {
                const zoneCodeRaw = (snapshot.timezone || "").trim();
                if (!zoneCodeRaw) return "";
                return zoneCodeRaw.startsWith("[") ? zoneCodeRaw : `[${zoneCodeRaw}]`;
            }

            if (key === "region") {
                return (snapshot.region || "").trim();
            }

            if (key === "offset") {
                const offsetText = (snapshot.offset || "").trim();
                if (!offsetText) return "";
                return offsetText.startsWith("[") ? offsetText : `[${offsetText}]`;
            }

            if (key === "time") {
                return formatTimeTextByParts(snapshot, timePartsEnabled);
            }

            if (key === "period_days") {
                const periodText = (snapshot.periodDays || "").trim();
                if (!periodText || periodText === "-") return "";
                return `[${periodText}]`;
            }

            if (key === "period_time") {
                const periodTimeText = (snapshot.periodTime || "").trim();
                if (!periodTimeText || periodTimeText === "-") return "";
                return `[${periodTimeText}]`;
            }

            return "";
        }

        function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED) {
            if (!snapshot) return "";
            const orderedParts = [];
            deps.sanitizeCopyFormatOrder(order).forEach((key) => {
                if (!enabled?.[key]) return;
                const value = getCopyFieldText(snapshot, key, { timePartsEnabled });
                if (value) orderedParts.push(value);
            });
            return orderedParts.join(" ").trim();
        }

        function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED) {
            const rowId = typeof rowOrId === "string"
                ? rowOrId
                : String(rowOrId?.id || "").replace("tz-row-", "");
            if (!rowId) return "";

            const snapshot = buildTimezoneComputedSnapshot(rowId);
            if (!snapshot) return "";
            return formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
        }

        function getRowCopyText(rowOrId, options = {}) {
            const {
                order = [],
                enabled = {},
                timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED
            } = options;
            return getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
        }

        return Object.freeze({
            getTimezoneRefById,
            buildTimezoneComputedSnapshot,
            formatTimeTextByParts,
            getCopyFieldText,
            formatSnapshotText,
            getRowFormattedText,
            getRowCopyText
        });
    }

    globalObj.GTVSnapshotFormat = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
