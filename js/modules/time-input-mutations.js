(function initGtvTimeInputMutations(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function getCurrentGroupZones() {
            const zones = invokeDep("getCurrentGroupZones");
            return Array.isArray(zones) ? zones : [];
        }

        function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
            const sourceDate = isValidDate(utcDate) ? utcDate : new Date();

            if (timezone === "UTC") {
                return {
                    Y: sourceDate.getUTCFullYear(),
                    M: sourceDate.getUTCMonth() + 1,
                    D: sourceDate.getUTCDate()
                };
            }

            if (timezone === "CUSTOM") {
                const currentZones = getCurrentGroupZones();
                let tz = null;
                if (timezoneId) {
                    tz = currentZones.find((z) => z && z.id === timezoneId) || null;
                }
                if (!tz) return null;
                const shifted = new Date(sourceDate.getTime() + (invokeDep("getCustomOffsetMinutes", tz) * 60000));
                return {
                    Y: shifted.getUTCFullYear(),
                    M: shifted.getUTCMonth() + 1,
                    D: shifted.getUTCDate()
                };
            }

            if (timezoneId) {
                const zoneRef = getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null;
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", zoneRef, sourceDate);
                if (Number.isFinite(fixedOffsetMinutes)) {
                    const shifted = new Date(sourceDate.getTime() + (fixedOffsetMinutes * 60000));
                    return {
                        Y: shifted.getUTCFullYear(),
                        M: shifted.getUTCMonth() + 1,
                        D: shifted.getUTCDate()
                    };
                }
            }

            const parts = invokeDep("resolveLocalDateParts", sourceDate, timezone, timezoneId, null);
            if (!parts || typeof parts !== "object") return null;
            if (!Number.isFinite(parts.Y) || !Number.isFinite(parts.M) || !Number.isFinite(parts.D)) return null;
            return { Y: parts.Y, M: parts.M, D: parts.D };
        }

        function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
            return resolveLocalDatePartsByTimezoneAtDate(
                timezone,
                invokeDep("getGlobalTime", slotIdx),
                timezoneId
            );
        }

        function buildStrictUtcDateFromParts(parts) {
            const date = invokeDep("buildStrictUtcDateFromParts", parts);
            return isValidDate(date) ? date : null;
        }

        function showInvalidDateFeedback(isMultiRange = false) {
            invokeDep("showToast", invokeDep("t", "toast_invalid_date"));
            if (isMultiRange) {
                invokeDep("renderMultiRanges");
            } else {
                invokeDep("renderList");
            }
        }

        function parseLocalInputParts(val, timezone, slotIdx, timezoneId, inputMode, baseDateResolver = null) {
            const parts = invokeDep("parseDateTimeParts", val, inputMode);
            if (!parts) return null;

            let Y = 0;
            let M = 0;
            let D = 0;
            let H = 0;
            let min = 0;
            let S = 0;
            if (inputMode === "datetime") {
                [Y, M, D, H, min, S] = parts;
            } else if (inputMode === "date") {
                [Y, M, D] = parts;
            } else if (inputMode === "time") {
                const baseDate = (typeof baseDateResolver === "function") ? baseDateResolver() : null;
                const baseDateParts = isValidDate(baseDate)
                    ? resolveLocalDatePartsByTimezoneAtDate(timezone, baseDate, timezoneId)
                    : resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
                if (!baseDateParts) return null;
                ({ Y, M, D } = baseDateParts);
                [H, min, S] = parts;
            }

            return buildStrictUtcDateFromParts({
                year: Y,
                month: M,
                day: D,
                hour: H,
                minute: min,
                second: S
            });
        }

        function resolveUtcDateForZone(tempUTC, timezone, timezoneId = null, offsetAnchor = null) {
            if (!isValidDate(tempUTC)) return null;
            if (timezone === "UTC") return tempUTC;

            if (timezone === "CUSTOM") {
                const tz = getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null;
                if (!tz) return null;
                const offsetMs = invokeDep("getCustomOffsetMinutes", tz) * 60000;
                return new Date(tempUTC.getTime() - offsetMs);
            }

            const zoneRef = timezoneId
                ? (getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null)
                : null;
            const anchorDate = isValidDate(offsetAnchor) ? offsetAnchor : tempUTC;
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", zoneRef, anchorDate);
            const offsetMinutes = Number.isFinite(fixedOffsetMinutes)
                ? fixedOffsetMinutes
                : invokeDep("getTimezoneOffset", timezone, tempUTC);
            if (!Number.isFinite(offsetMinutes)) return null;
            return new Date(tempUTC.getTime() - (offsetMinutes * 60000));
        }

        function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (invokeDep("isRealtime")) return;
            if (inputMode === "none") return;

            const tempUTC = parseLocalInputParts(val, timezone, slotIdx, timezoneId, inputMode);
            if (!tempUTC) {
                showInvalidDateFeedback(false);
                return;
            }

            const utcDate = resolveUtcDateForZone(
                tempUTC,
                timezone,
                timezoneId,
                invokeDep("getGlobalTime", 0)
            );
            if (!isValidDate(utcDate)) return;
            invokeDep("setGlobalTime", slotIdx, utcDate);
            invokeDep("updateClocks");
        }

        function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (!invokeDep("isMultiTab")) return;
            if (rangeIdx > 0 && slotIdx === 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx)) return;
            if (slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx)) return;

            invokeDep("ensureMultiRangeState");
            const ranges = invokeDep("getMultiRanges");
            const safeRanges = Array.isArray(ranges) ? ranges : [];
            const range = safeRanges[rangeIdx];
            if (!range) return;
            if (inputMode === "none") return;

            const tempUTC = parseLocalInputParts(
                val,
                timezone,
                slotIdx,
                timezoneId,
                inputMode,
                () => invokeDep("getMultiRangeSlotDate", rangeIdx, slotIdx)
            );
            if (!tempUTC) {
                showInvalidDateFeedback(true);
                return;
            }

            const utcDate = resolveUtcDateForZone(
                tempUTC,
                timezone,
                timezoneId,
                new Date(range.startUtcMs)
            );
            if (!isValidDate(utcDate)) return;
            invokeDep("setMultiRangeSlotDate", rangeIdx, slotIdx, utcDate);

            if (slotIdx === 1) {
                invokeDep("syncFollowingRangesByDuration", rangeIdx);
            } else if (rangeIdx === 0) {
                invokeDep("syncMultiRangeStartLinks", 1);
            }

            invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            resolveLocalDatePartsByTimezoneAtDate,
            resolveLocalDatePartsByTimezone,
            buildStrictUtcDateFromParts,
            handleTimeChange,
            handleMultiRangeTimeChange
        });
    }

    globalObj.GTVTimeInputMutations = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
