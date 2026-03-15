/**
 * GTVTimeService Module
 * Provides high-level time manipulation and state management using Luxon.
 */
(function initGtvTimeService(globalObj) {
    "use strict";

    function createService(deps) {
        const DateTime = deps?.luxon?.DateTime;

        function hasLuxonDateTime() {
            return !!DateTime
                && typeof DateTime.fromJSDate === "function"
                && typeof DateTime.fromISO === "function"
                && typeof DateTime.fromMillis === "function"
                && typeof DateTime.fromObject === "function";
        }

        function toDateObject(value) {
            if (value instanceof Date && Number.isFinite(value.getTime())) return new Date(value.getTime());
            const parsed = new Date(value);
            if (Number.isFinite(parsed.getTime())) return parsed;
            return new Date();
        }

        function getCustomOffsetMinutes(fixedOffsetMinutes) {
            return Number.isFinite(fixedOffsetMinutes) ? Math.trunc(fixedOffsetMinutes) : 0;
        }

        function toOffsetShiftedDate(date, offsetMinutes) {
            const safeDate = toDateObject(date);
            return new Date(safeDate.getTime() + (offsetMinutes * 60000));
        }

        function fromOffsetShiftedDate(date, offsetMinutes) {
            const safeDate = toDateObject(date);
            return new Date(safeDate.getTime() - (offsetMinutes * 60000));
        }

        function toFallbackDateTime(date, zone = "UTC", fixedOffsetMinutes = null) {
            const safeDate = toDateObject(date);
            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            const offset = useCustomOffset ? getCustomOffsetMinutes(fixedOffsetMinutes) : 0;
            const shifted = toOffsetShiftedDate(safeDate, offset);
            const jsWeekday = shifted.getUTCDay();
            const luxonWeekday = jsWeekday === 0 ? 7 : jsWeekday;
            return {
                year: shifted.getUTCFullYear(),
                month: shifted.getUTCMonth() + 1,
                day: shifted.getUTCDate(),
                hour: shifted.getUTCHours(),
                minute: shifted.getUTCMinutes(),
                second: shifted.getUTCSeconds(),
                offset,
                weekday: luxonWeekday,
                toJSDate() {
                    return new Date(safeDate.getTime());
                }
            };
        }

        function toValidInt(value, fallback = 0) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
        }

        function applyDeltaToDate(date, delta = {}) {
            const next = new Date(toDateObject(date).getTime());
            if (delta.hours) next.setUTCHours(next.getUTCHours() + toValidInt(delta.hours, 0));
            if (delta.days) next.setUTCDate(next.getUTCDate() + toValidInt(delta.days, 0));
            if (delta.weeks) next.setUTCDate(next.getUTCDate() + (toValidInt(delta.weeks, 0) * 7));
            return next;
        }

        /**
         * Converts a JS Date to a Luxon DateTime in the specified timezone.
         */
        function toDateTime(date, zone = "UTC", fixedOffsetMinutes = null) {
            if (hasLuxonDateTime()) {
                const safeDate = toDateObject(date);
                let dt = DateTime.fromJSDate(safeDate);
                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return dt.toUTC().plus({ minutes: offset });
                }
                try {
                    return dt.setZone(zone || "UTC");
                } catch (_err) {
                    return dt.setZone("UTC");
                }
            }
            return toFallbackDateTime(date, zone, fixedOffsetMinutes);
        }

        /**
         * Resolves local date parts (Y, M, D) for a given timezone.
         */
        function resolveLocalDateParts(date, zone, timezoneId = null, fixedOffsetMinutes = null) {
            const dt = toDateTime(date, zone, fixedOffsetMinutes);
            return {
                Y: Number.isFinite(dt?.year) ? dt.year : 1970,
                M: Number.isFinite(dt?.month) ? dt.month : 1,
                D: Number.isFinite(dt?.day) ? dt.day : 1,
                H: Number.isFinite(dt?.hour) ? dt.hour : 0,
                min: Number.isFinite(dt?.minute) ? dt.minute : 0,
                S: Number.isFinite(dt?.second) ? dt.second : 0
            };
        }

        /**
         * Shifts a date by the specified period.
         */
        function shiftDate(date, delta = {}, zone = "UTC", fixedOffsetMinutes = null) {
            if (hasLuxonDateTime()) {
                let dt = toDateTime(date, zone, fixedOffsetMinutes);
                if (delta.hours) dt = dt.plus({ hours: toValidInt(delta.hours, 0) });
                if (delta.days) dt = dt.plus({ days: toValidInt(delta.days, 0) });
                if (delta.weeks) dt = dt.plus({ weeks: toValidInt(delta.weeks, 0) });

                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return dt.minus({ minutes: offset }).toJSDate();
                }
                return dt.toJSDate();
            }

            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            if (useCustomOffset) {
                const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                const shifted = toOffsetShiftedDate(date, offset);
                const moved = applyDeltaToDate(shifted, delta);
                return fromOffsetShiftedDate(moved, offset);
            }
            return applyDeltaToDate(date, delta);
        }

        /**
         * Calculates the signed day span between two date strings (YYYY-MM-DD).
         */
        function getDaySpan(startStr, endStr) {
            const startIso = (typeof startStr === "string") ? startStr.split(" ")[0] : "";
            const endIso = (typeof endStr === "string") ? endStr.split(" ")[0] : "";
            if (!startIso || !endIso) return null;

            if (hasLuxonDateTime()) {
                const start = DateTime.fromISO(startIso);
                const end = DateTime.fromISO(endIso);
                if (!start.isValid || !end.isValid) return null;
                const diff = end.diff(start, "days").days;
                return (diff >= 0 ? 1 : -1) * (Math.abs(Math.floor(diff)) + 1);
            }

            const start = new Date(`${startIso}T00:00:00Z`);
            const end = new Date(`${endIso}T00:00:00Z`);
            if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null;
            const diff = (end.getTime() - start.getTime()) / 86400000;
            return (diff >= 0 ? 1 : -1) * (Math.abs(Math.floor(diff)) + 1);
        }

        /**
         * Formats duration between two dates.
         */
        function formatDuration(startMs, endMs, lang = "en") {
            const safeStartMs = Number(startMs);
            const safeEndMs = Number(endMs);
            if (!Number.isFinite(safeStartMs) || !Number.isFinite(safeEndMs)) return "";

            const sign = safeEndMs < safeStartMs ? "-" : "";
            let d = 0;
            let h = 0;
            let m = 0;

            if (hasLuxonDateTime()) {
                const start = DateTime.fromMillis(safeStartMs);
                const end = DateTime.fromMillis(safeEndMs);
                const diff = end.diff(start, ["days", "hours", "minutes"]).toObject();
                d = Math.abs(Math.floor(diff.days || 0));
                h = Math.abs(Math.floor(diff.hours || 0));
                m = Math.abs(Math.floor(diff.minutes || 0));
            } else {
                const totalMinutes = Math.floor(Math.abs(safeEndMs - safeStartMs) / 60000);
                d = Math.floor(totalMinutes / (24 * 60));
                h = Math.floor((totalMinutes % (24 * 60)) / 60);
                m = totalMinutes % 60;
            }

            if (lang === "ko") {
                return `${sign}${d}\uC77C ${h}\uC2DC\uAC04 ${m}\uBD84`;
            }
            return `${sign}${d}d ${h}h ${m}m`;
        }

        /**
         * Adjusts a date based on specific actions (midnight, sharp_hour, etc.)
         */
        function adjustDate(date, action, zone = "UTC", fixedOffsetMinutes = null, customDays = 1) {
            if (action === "now") return new Date();

            const safeCustomDays = Math.max(0, Math.abs(toValidInt(customDays, 1)));
            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            const offset = getCustomOffsetMinutes(fixedOffsetMinutes);

            if (hasLuxonDateTime()) {
                let dt = toDateTime(date, zone, fixedOffsetMinutes);
                switch (action) {
                    case "midnight":
                        dt = dt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
                        break;
                    case "sharp_hour":
                        dt = dt.set({ minute: 0, second: 0, millisecond: 0 });
                        break;
                    case "plus_hour":
                        dt = dt.plus({ hours: 1 });
                        break;
                    case "minus_hour":
                        dt = dt.minus({ hours: 1 });
                        break;
                    case "plus_day":
                        dt = dt.plus({ days: 1 });
                        break;
                    case "minus_day":
                        dt = dt.minus({ days: 1 });
                        break;
                    case "plus_week":
                        dt = dt.plus({ weeks: 1 });
                        break;
                    case "minus_week":
                        dt = dt.minus({ weeks: 1 });
                        break;
                    case "plus_four_weeks":
                        dt = dt.plus({ weeks: 4 });
                        break;
                    case "minus_four_weeks":
                        dt = dt.minus({ weeks: 4 });
                        break;
                    case "plus_custom_days":
                        dt = dt.plus({ days: safeCustomDays });
                        break;
                    case "minus_custom_days":
                        dt = dt.minus({ days: safeCustomDays });
                        break;
                    default:
                        return toDateObject(date);
                }

                if (useCustomOffset) {
                    return dt.minus({ minutes: offset }).toJSDate();
                }
                return dt.toJSDate();
            }

            const shifted = useCustomOffset ? toOffsetShiftedDate(date, offset) : toDateObject(date);
            switch (action) {
                case "midnight":
                    shifted.setUTCHours(0, 0, 0, 0);
                    break;
                case "sharp_hour":
                    shifted.setUTCMinutes(0, 0, 0);
                    break;
                case "plus_hour":
                    shifted.setUTCHours(shifted.getUTCHours() + 1);
                    break;
                case "minus_hour":
                    shifted.setUTCHours(shifted.getUTCHours() - 1);
                    break;
                case "plus_day":
                    shifted.setUTCDate(shifted.getUTCDate() + 1);
                    break;
                case "minus_day":
                    shifted.setUTCDate(shifted.getUTCDate() - 1);
                    break;
                case "plus_week":
                    shifted.setUTCDate(shifted.getUTCDate() + 7);
                    break;
                case "minus_week":
                    shifted.setUTCDate(shifted.getUTCDate() - 7);
                    break;
                case "plus_four_weeks":
                    shifted.setUTCDate(shifted.getUTCDate() + 28);
                    break;
                case "minus_four_weeks":
                    shifted.setUTCDate(shifted.getUTCDate() - 28);
                    break;
                case "plus_custom_days":
                    shifted.setUTCDate(shifted.getUTCDate() + safeCustomDays);
                    break;
                case "minus_custom_days":
                    shifted.setUTCDate(shifted.getUTCDate() - safeCustomDays);
                    break;
                default:
                    return toDateObject(date);
            }

            return useCustomOffset ? fromOffsetShiftedDate(shifted, offset) : shifted;
        }

        /**
         * Converts local date/time parts to UTC JS Date.
         * @param {{year, month, day, hour, minute, second}} parts local time parts
         * @param {string} zone IANA zone name or "UTC"/"CUSTOM"
         * @param {number|null} fixedOffsetMinutes fixed offset in minutes when using CUSTOM
         */
        function fromLocalPartsToUtc(parts, zone = "UTC", fixedOffsetMinutes = null) {
            const safeParts = {
                year: toValidInt(parts?.year, 1970),
                month: Math.min(12, Math.max(1, toValidInt(parts?.month, 1))),
                day: Math.min(31, Math.max(1, toValidInt(parts?.day, 1))),
                hour: Math.min(23, Math.max(0, toValidInt(parts?.hour, 0))),
                minute: Math.min(59, Math.max(0, toValidInt(parts?.minute, 0))),
                second: Math.min(59, Math.max(0, toValidInt(parts?.second, 0)))
            };

            if (hasLuxonDateTime()) {
                if (!zone || zone === "UTC") {
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).toJSDate();
                }
                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).minus({ minutes: offset }).toJSDate();
                }
                try {
                    return DateTime.fromObject(safeParts, { zone }).toUTC().toJSDate();
                } catch (_err) {
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).toJSDate();
                }
            }

            const utcMs = Date.UTC(
                safeParts.year,
                safeParts.month - 1,
                safeParts.day,
                safeParts.hour,
                safeParts.minute,
                safeParts.second
            );
            if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                return new Date(utcMs - (offset * 60000));
            }
            return new Date(utcMs);
        }

        return Object.freeze({
            toDateTime,
            resolveLocalDateParts,
            shiftDate,
            adjustDate,
            getDaySpan,
            formatDuration,
            fromLocalPartsToUtc
        });
    }

    globalObj.GTVTimeService = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
