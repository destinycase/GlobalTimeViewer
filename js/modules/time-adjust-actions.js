(function initGtvTimeAdjustActions(globalObj) {
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
            getGlobalTimes: toSafeCallable(safeDeps.getGlobalTimes),
            sanitizeUtcMs: toSafeCallable(safeDeps.sanitizeUtcMs),
            getTimeAdjustDayStep: toSafeCallable(safeDeps.getTimeAdjustDayStep),
            getCustomOffsetMinutes: toSafeCallable(safeDeps.getCustomOffsetMinutes),
            isRealtime: toSafeCallable(safeDeps.isRealtime),
            updateClocks: toSafeCallable(safeDeps.updateClocks),
            getBaseTimezoneRef: toSafeCallable(safeDeps.getBaseTimezoneRef),
            getFixedOffsetForDisplay: toSafeCallable(safeDeps.getFixedOffsetForDisplay),
            ensureMultiRangeState: toSafeCallable(safeDeps.ensureMultiRangeState),
            getMultiRanges: toSafeCallable(safeDeps.getMultiRanges),
            isMultiRangeStartLinked: toSafeCallable(safeDeps.isMultiRangeStartLinked),
            isMultiTab: toSafeCallable(safeDeps.isMultiTab),
            renderMultiRanges: toSafeCallable(safeDeps.renderMultiRanges),
            savePersistence: toSafeCallable(safeDeps.savePersistence),
            isMultiRangeStartEditEnabled: toSafeCallable(safeDeps.isMultiRangeStartEditEnabled),
            isMultiRangeEndEditEnabled: toSafeCallable(safeDeps.isMultiRangeEndEditEnabled),
            syncLinkedRangesFrom: toSafeCallable(safeDeps.syncLinkedRangesFrom),
            getFixedOffsetForDisplayAtDate: toSafeCallable(safeDeps.getFixedOffsetForDisplayAtDate),
            getMultiRangeSlotDate: toSafeCallable(safeDeps.getMultiRangeSlotDate),
            setMultiRangeSlotDate: toSafeCallable(safeDeps.setMultiRangeSlotDate),
            syncFollowingRangesByDuration: toSafeCallable(safeDeps.syncFollowingRangesByDuration),
            syncMultiRangeStartLinks: toSafeCallable(safeDeps.syncMultiRangeStartLinks)
        });

        function shouldRenderMultiRanges() {
            return !!dep.isMultiTab();
        }

        function getGlobalTimesRef() {
            const value = dep.getGlobalTimes();
            return Array.isArray(value) ? value : [];
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function sanitizeUtcMs(value, fallbackMs) {
            const viaDep = dep.sanitizeUtcMs(value, fallbackMs);
            if (Number.isFinite(viaDep)) return Math.trunc(viaDep);
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return Math.trunc(parsed);
            const fallback = Number(fallbackMs);
            return Number.isFinite(fallback) ? Math.trunc(fallback) : Date.now();
        }

        function getAdjustedDayMs(slotIdx, direction) {
            const days = Number(dep.getTimeAdjustDayStep(slotIdx));
            const safeDays = Number.isFinite(days) ? days : 1;
            const sign = direction < 0 ? -1 : 1;
            return sign * safeDays * 24 * 60 * 60 * 1000;
        }

        function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
            const safeBaseRef = (baseRef && typeof baseRef === "object") ? baseRef : null;
            if (safeBaseRef?.type === "custom") {
                return {
                    zone: "CUSTOM",
                    fixedOffsetMinutes: dep.getCustomOffsetMinutes(safeBaseRef)
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
            const customDays = Number(dep.getTimeAdjustDayStep(slotIdx));
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
            if (dep.isRealtime()) return;

            const globalTimes = getGlobalTimesRef();
            if (!Array.isArray(globalTimes) || !globalTimes.length) return;

            if (action === "now") {
                globalTimes[slotIdx] = new Date();
                dep.updateClocks();
                return;
            }
            if (action === "set_zero_day" || action === "sync_prev_end") {
                if (slotIdx === 1 && isValidDate(globalTimes[0])) {
                    globalTimes[1] = new Date(globalTimes[0].getTime());
                    dep.updateClocks();
                }
                return;
            }

            if (!safeDeps.timeService || typeof safeDeps.timeService.adjustDate !== "function") return;

            const baseRef = dep.getBaseTimezoneRef();
            const defaultFixedOffsetMinutes = dep.getFixedOffsetForDisplay(baseRef);
            const { zone, fixedOffsetMinutes } = resolveTimeAdjustZoneAndOffset(baseRef, defaultFixedOffsetMinutes);
            const customDays = Number(dep.getTimeAdjustDayStep(slotIdx));
            globalTimes[slotIdx] = safeDeps.timeService.adjustDate(
                globalTimes[slotIdx],
                action,
                zone,
                fixedOffsetMinutes,
                Number.isFinite(customDays) ? customDays : 1
            );
            dep.updateClocks();
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
            dep.ensureMultiRangeState();
            const multiRanges = dep.getMultiRanges();
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
                if (idx === 0 || dep.isMultiRangeStartLinked(idx)) {
                    current.startUtcMs = cursor;
                } else {
                    current.startUtcMs = sanitizeUtcMs(current.startUtcMs, cursor);
                }
                current.endUtcMs = current.startUtcMs + (nextDurations[idx] ?? 0);
                cursor = current.endUtcMs;
            }

            if (shouldRenderMultiRanges()) dep.renderMultiRanges();
            dep.savePersistence();
        }

        function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
            if (!shouldRenderMultiRanges()) return;
            if (rangeIdx > 0 && slotIdx === 0 && !dep.isMultiRangeStartEditEnabled(rangeIdx)) return;
            if (slotIdx === 1 && !dep.isMultiRangeEndEditEnabled(rangeIdx)) return;

            dep.ensureMultiRangeState();
            const multiRanges = dep.getMultiRanges();
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
                dep.syncLinkedRangesFrom(rangeIdx, {
                    includeCurrent: true,
                    stopAtFirstUnlocked: true,
                    baseDurations: durationSnapshot
                });
            } else if (slotIdx === 1 && action === "set_zero_day") {
                range.endUtcMs = range.startUtcMs;
            } else {
                const baseRef = dep.getBaseTimezoneRef();
                const anchorDate = new Date(sanitizeUtcMs(range.startUtcMs, Date.now()));
                const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(baseRef, anchorDate);
                const baseDate = dep.getMultiRangeSlotDate(rangeIdx, slotIdx);
                const nextUtcDate = getAdjustedUtcDateByAction(
                    baseDate,
                    action,
                    slotIdx,
                    baseRef,
                    fixedOffsetMinutes
                );
                if (!isValidDate(nextUtcDate)) return;
                dep.setMultiRangeSlotDate(rangeIdx, slotIdx, nextUtcDate);
            }

            if (slotIdx === 1) {
                dep.syncFollowingRangesByDuration(rangeIdx);
            } else if (rangeIdx === 0) {
                dep.syncMultiRangeStartLinks(1);
            }

            dep.renderMultiRanges();
            dep.savePersistence();
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
