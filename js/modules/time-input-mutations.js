(function initGtvTimeInputMutations(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function toSafeCallable(depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (_err) {
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getCurrentGroupZones: toSafeCallable(safeDeps.getCurrentGroupZones),
            getCustomOffsetMinutes: toSafeCallable(safeDeps.getCustomOffsetMinutes),
            getFixedOffsetForDisplayAtDate: toSafeCallable(safeDeps.getFixedOffsetForDisplayAtDate),
            resolveLocalDateParts: toSafeCallable(safeDeps.resolveLocalDateParts),
            getGlobalTime: toSafeCallable(safeDeps.getGlobalTime),
            buildStrictUtcDateFromParts: toSafeCallable(safeDeps.buildStrictUtcDateFromParts),
            showToast: toSafeCallable(safeDeps.showToast),
            t: toSafeCallable(safeDeps.t),
            renderMultiRanges: toSafeCallable(safeDeps.renderMultiRanges),
            renderList: toSafeCallable(safeDeps.renderList),
            parseDateTimeParts: toSafeCallable(safeDeps.parseDateTimeParts),
            getTimezoneOffset: toSafeCallable(safeDeps.getTimezoneOffset),
            isRealtime: toSafeCallable(safeDeps.isRealtime),
            setGlobalTime: toSafeCallable(safeDeps.setGlobalTime),
            updateClocks: toSafeCallable(safeDeps.updateClocks),
            isMultiTab: toSafeCallable(safeDeps.isMultiTab),
            isMultiRangeStartEditEnabled: toSafeCallable(safeDeps.isMultiRangeStartEditEnabled),
            isMultiRangeEndEditEnabled: toSafeCallable(safeDeps.isMultiRangeEndEditEnabled),
            ensureMultiRangeState: toSafeCallable(safeDeps.ensureMultiRangeState),
            getMultiRanges: toSafeCallable(safeDeps.getMultiRanges),
            getMultiRangeSlotDate: toSafeCallable(safeDeps.getMultiRangeSlotDate),
            setMultiRangeSlotDate: toSafeCallable(safeDeps.setMultiRangeSlotDate),
            syncFollowingRangesByDuration: toSafeCallable(safeDeps.syncFollowingRangesByDuration),
            syncMultiRangeStartLinks: toSafeCallable(safeDeps.syncMultiRangeStartLinks),
            savePersistence: toSafeCallable(safeDeps.savePersistence)
        });

        function translate(key) {
            const translated = dep.t(key);
            return (typeof translated === "string" && translated) ? translated : String(key || "");
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function getCurrentGroupZones() {
            const zones = dep.getCurrentGroupZones();
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
                const shifted = new Date(sourceDate.getTime() + (dep.getCustomOffsetMinutes(tz) * 60000));
                return {
                    Y: shifted.getUTCFullYear(),
                    M: shifted.getUTCMonth() + 1,
                    D: shifted.getUTCDate()
                };
            }

            if (timezoneId) {
                const zoneRef = getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null;
                const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(zoneRef, sourceDate);
                if (Number.isFinite(fixedOffsetMinutes)) {
                    const shifted = new Date(sourceDate.getTime() + (fixedOffsetMinutes * 60000));
                    return {
                        Y: shifted.getUTCFullYear(),
                        M: shifted.getUTCMonth() + 1,
                        D: shifted.getUTCDate()
                    };
                }
            }

            const parts = dep.resolveLocalDateParts(sourceDate, timezone, timezoneId, null);
            if (!parts || typeof parts !== "object") return null;
            if (!Number.isFinite(parts.Y) || !Number.isFinite(parts.M) || !Number.isFinite(parts.D)) return null;
            return { Y: parts.Y, M: parts.M, D: parts.D };
        }

        function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
            return resolveLocalDatePartsByTimezoneAtDate(
                timezone,
                dep.getGlobalTime(slotIdx),
                timezoneId
            );
        }

        function buildStrictUtcDateFromParts(parts) {
            const date = dep.buildStrictUtcDateFromParts(parts);
            return isValidDate(date) ? date : null;
        }

        function showInvalidDateFeedback(isMultiRange = false) {
            dep.showToast(translate("toast_invalid_date"));
            if (isMultiRange) {
                dep.renderMultiRanges();
            } else {
                dep.renderList();
            }
        }

        function parseLocalInputParts(val, timezone, slotIdx, timezoneId, inputMode, baseDateResolver = null) {
            const parts = dep.parseDateTimeParts(val, inputMode);
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
                const offsetMs = dep.getCustomOffsetMinutes(tz) * 60000;
                return new Date(tempUTC.getTime() - offsetMs);
            }

            const zoneRef = timezoneId
                ? (getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null)
                : null;
            const anchorDate = isValidDate(offsetAnchor) ? offsetAnchor : tempUTC;
            const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(zoneRef, anchorDate);
            const offsetMinutes = Number.isFinite(fixedOffsetMinutes)
                ? fixedOffsetMinutes
                : dep.getTimezoneOffset(timezone, tempUTC);
            if (!Number.isFinite(offsetMinutes)) return null;
            return new Date(tempUTC.getTime() - (offsetMinutes * 60000));
        }

        function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (dep.isRealtime()) return;
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
                dep.getGlobalTime(0)
            );
            if (!isValidDate(utcDate)) return;
            dep.setGlobalTime(slotIdx, utcDate);
            dep.updateClocks();
        }

        function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (!dep.isMultiTab()) return;
            if (rangeIdx > 0 && slotIdx === 0 && !dep.isMultiRangeStartEditEnabled(rangeIdx)) return;
            if (slotIdx === 1 && !dep.isMultiRangeEndEditEnabled(rangeIdx)) return;

            dep.ensureMultiRangeState();
            const ranges = dep.getMultiRanges();
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
                () => dep.getMultiRangeSlotDate(rangeIdx, slotIdx)
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
            dep.setMultiRangeSlotDate(rangeIdx, slotIdx, utcDate);

            if (slotIdx === 1) {
                dep.syncFollowingRangesByDuration(rangeIdx);
            } else if (rangeIdx === 0) {
                dep.syncMultiRangeStartLinks(1);
            }

            dep.renderMultiRanges();
            dep.savePersistence();
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
