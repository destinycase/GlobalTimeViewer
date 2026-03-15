(function initGtvTimeAdjustActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getGlobalTimesRef() {
            const value = invokeDep("getGlobalTimes");
            return Array.isArray(value) ? value : [];
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function sanitizeUtcMs(value, fallbackMs) {
            const viaDep = invokeDep("sanitizeUtcMs", value, fallbackMs);
            if (Number.isFinite(viaDep)) return Math.trunc(viaDep);
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return Math.trunc(parsed);
            const fallback = Number(fallbackMs);
            return Number.isFinite(fallback) ? Math.trunc(fallback) : Date.now();
        }

        function getAdjustedDayMs(slotIdx, direction) {
            const days = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            const safeDays = Number.isFinite(days) ? days : 1;
            const sign = direction < 0 ? -1 : 1;
            return sign * safeDays * 24 * 60 * 60 * 1000;
        }

        function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
            const safeBaseRef = (baseRef && typeof baseRef === "object") ? baseRef : null;
            if (safeBaseRef?.type === "custom") {
                return {
                    zone: "CUSTOM",
                    fixedOffsetMinutes: invokeDep("getCustomOffsetMinutes", safeBaseRef)
                };
            }

            const safeZone = (typeof safeBaseRef?.zone === "string" && safeBaseRef.zone.trim())
                ? safeBaseRef.zone
                : "UTC";
            const hasFixedOffsetValue = (
                fixedOffsetMinutes !== null
                && fixedOffsetMinutes !== undefined
                && !(typeof fixedOffsetMinutes === "string" && !fixedOffsetMinutes.trim())
            );
            const parsedOffset = hasFixedOffsetValue ? Number(fixedOffsetMinutes) : Number.NaN;
            return {
                zone: safeZone,
                fixedOffsetMinutes: Number.isFinite(parsedOffset) ? Math.trunc(parsedOffset) : null
            };
        }

        function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
            if (!isValidDate(baseDate)) return null;

            if (action === "now") return new Date();
            if (action === "set_zero_day" || action === "sync_prev_end") {
                if (slotIdx !== 1) return baseDate;
                const globalTimes = getGlobalTimesRef();
                const startDate = globalTimes[0];
                if (!isValidDate(startDate)) return null;
                return new Date(startDate.getTime());
            }

            if (!safeDeps.timeService || typeof safeDeps.timeService.adjustDate !== "function") return null;
            const customDays = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            const resolved = resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
            return safeDeps.timeService.adjustDate(
                baseDate,
                action,
                resolved.zone,
                resolved.fixedOffsetMinutes,
                Number.isFinite(customDays) ? customDays : 1
            );
        }

        function applyTimeAdjustAction(slotIdx, action) {
            if (invokeDep("isRealtime")) return;

            const globalTimes = getGlobalTimesRef();
            if (!Array.isArray(globalTimes) || !globalTimes.length) return;

            if (action === "now") {
                globalTimes[slotIdx] = new Date();
                invokeDep("updateClocks");
                return;
            }
            if (action === "set_zero_day" || action === "sync_prev_end") {
                if (slotIdx === 1 && isValidDate(globalTimes[0])) {
                    globalTimes[1] = new Date(globalTimes[0].getTime());
                    invokeDep("updateClocks");
                }
                return;
            }

            if (!safeDeps.timeService || typeof safeDeps.timeService.adjustDate !== "function") return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            const defaultFixedOffsetMinutes = invokeDep("getFixedOffsetForDisplay", baseRef);
            const { zone, fixedOffsetMinutes } = resolveTimeAdjustZoneAndOffset(baseRef, defaultFixedOffsetMinutes);
            const customDays = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            globalTimes[slotIdx] = safeDeps.timeService.adjustDate(
                globalTimes[slotIdx],
                action,
                zone,
                fixedOffsetMinutes,
                Number.isFinite(customDays) ? customDays : 1
            );
            invokeDep("updateClocks");
        }

        function resolveBulkDurationDelta(slotIdx, action) {
            switch (action) {
                case "plus_hour":
                    return 60 * 60 * 1000;
                case "minus_hour":
                    return -60 * 60 * 1000;
                case "plus_day":
                    return 24 * 60 * 60 * 1000;
                case "minus_day":
                    return -24 * 60 * 60 * 1000;
                case "plus_week":
                    return 7 * 24 * 60 * 60 * 1000;
                case "minus_week":
                    return -7 * 24 * 60 * 60 * 1000;
                case "plus_four_weeks":
                    return 28 * 24 * 60 * 60 * 1000;
                case "minus_four_weeks":
                    return -28 * 24 * 60 * 60 * 1000;
                case "plus_custom_days":
                    return getAdjustedDayMs(slotIdx, 1);
                case "minus_custom_days":
                    return getAdjustedDayMs(slotIdx, -1);
                default:
                    return null;
            }
        }

        function applyBulkRangeAllAction(slotIdx, action) {
            invokeDep("ensureMultiRangeState");
            const multiRanges = invokeDep("getMultiRanges");
            if (!Array.isArray(multiRanges) || !multiRanges.length) return;

            const baseDurations = multiRanges.map((range) => {
                const start = sanitizeUtcMs(range?.startUtcMs, Date.now());
                const end = sanitizeUtcMs(range?.endUtcMs, start);
                return end - start;
            });
            let nextDurations = [];

            if (action === "set_zero_day") {
                nextDurations = baseDurations.map(() => 0);
            } else {
                const deltaMs = resolveBulkDurationDelta(slotIdx, action);
                if (!Number.isFinite(deltaMs)) return;
                nextDurations = baseDurations.map((durationMs) => durationMs + deltaMs);
            }

            let cursor = sanitizeUtcMs(multiRanges[0]?.startUtcMs, Date.now());
            for (let idx = 0; idx < multiRanges.length; idx += 1) {
                const current = multiRanges[idx];
                if (!current || typeof current !== "object") continue;
                if (idx === 0 || invokeDep("isMultiRangeStartLinked", idx)) {
                    current.startUtcMs = cursor;
                } else {
                    current.startUtcMs = sanitizeUtcMs(current.startUtcMs, cursor);
                }
                current.endUtcMs = current.startUtcMs + (nextDurations[idx] ?? 0);
                cursor = current.endUtcMs;
            }

            if (invokeDep("isMultiTab")) invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
            if (!invokeDep("isMultiTab")) return;
            if (rangeIdx > 0 && slotIdx === 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx)) return;
            if (slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx)) return;

            invokeDep("ensureMultiRangeState");
            const multiRanges = invokeDep("getMultiRanges");
            if (!Array.isArray(multiRanges)) return;
            const range = multiRanges[rangeIdx];
            if (!range || typeof range !== "object") return;

            if (slotIdx === 0 && action === "sync_prev_end") {
                if (rangeIdx <= 0) return;
                const durationSnapshot = multiRanges.map((item) => {
                    const start = sanitizeUtcMs(item?.startUtcMs, Date.now());
                    const end = sanitizeUtcMs(item?.endUtcMs, start);
                    return end - start;
                });
                range.startUtcMs = sanitizeUtcMs(multiRanges[rangeIdx - 1]?.endUtcMs, range.startUtcMs);
                invokeDep("syncLinkedRangesFrom", rangeIdx, {
                    includeCurrent: true,
                    stopAtFirstUnlocked: true,
                    baseDurations: durationSnapshot
                });
            } else if (slotIdx === 1 && action === "set_zero_day") {
                range.endUtcMs = range.startUtcMs;
            } else {
                const baseRef = invokeDep("getBaseTimezoneRef");
                const anchorDate = new Date(sanitizeUtcMs(range.startUtcMs, Date.now()));
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, anchorDate);
                const baseDate = invokeDep("getMultiRangeSlotDate", rangeIdx, slotIdx);
                const nextUtcDate = getAdjustedUtcDateByAction(
                    baseDate,
                    action,
                    slotIdx,
                    baseRef,
                    fixedOffsetMinutes
                );
                if (!isValidDate(nextUtcDate)) return;
                invokeDep("setMultiRangeSlotDate", rangeIdx, slotIdx, nextUtcDate);
            }

            if (slotIdx === 1) {
                invokeDep("syncFollowingRangesByDuration", rangeIdx);
            } else if (rangeIdx === 0) {
                invokeDep("syncMultiRangeStartLinks", 1);
            }

            invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            resolveTimeAdjustZoneAndOffset,
            getAdjustedUtcDateByAction,
            applyTimeAdjustAction,
            applyBulkRangeAllAction,
            applyMultiRangeTimeAdjustAction
        });
    }

    globalObj.GTVTimeAdjustActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
