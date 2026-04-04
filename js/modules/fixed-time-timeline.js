(function initGtvFixedTimeTimeline(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TIMELINE_TOTAL_SECONDS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_SECONDS))
            ? Number(safeDeps.TIMELINE_TOTAL_SECONDS)
            : (24 * 60 * 60);

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
                    logWarn(`[GTVFixedTimeTimeline] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getCurrentGroup: toSafeCallable("getCurrentGroup", safeDeps.getCurrentGroup),
            ensureGroupFixedTimes: toSafeCallable("ensureGroupFixedTimes", safeDeps.ensureGroupFixedTimes),
            getGlobalTime: toSafeCallable("getGlobalTime", safeDeps.getGlobalTime),
            resolveFixedTimeSlotUtcDate: toSafeCallable("resolveFixedTimeSlotUtcDate", safeDeps.resolveFixedTimeSlotUtcDate),
            getFixedTimeSlotCount: toSafeCallable("getFixedTimeSlotCount", safeDeps.getFixedTimeSlotCount),
            getDefaultFixedTimeName: toSafeCallable("getDefaultFixedTimeName", safeDeps.getDefaultFixedTimeName),
            sanitizeFixedTimeId: toSafeCallable("sanitizeFixedTimeId", safeDeps.sanitizeFixedTimeId),
            sanitizeFixedTimeName: toSafeCallable("sanitizeFixedTimeName", safeDeps.sanitizeFixedTimeName),
            getFixedTimeSlotHeaderLabel: toSafeCallable("getFixedTimeSlotHeaderLabel", safeDeps.getFixedTimeSlotHeaderLabel)
        });

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function clampRatio(value) {
            const clampFn = safeDeps.clampNumber;
            if (typeof clampFn === "function") return clampFn(value, 0, 1);
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return 0;
            if (numeric < 0) return 0;
            if (numeric > 1) return 1;
            return numeric;
        }

        function pad2(value) {
            const padFn = safeDeps.pad;
            if (typeof padFn === "function") return padFn(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = undefined) {
            const group = dep.getCurrentGroup();
            if (!group || !baseRef) return null;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;

            const safeAnchorDate = isValidDate(anchorDate)
                ? anchorDate
                : (isValidDate(dep.getGlobalTime(0)) ? dep.getGlobalTime(0) : new Date());
            return dep.resolveFixedTimeSlotUtcDate(slot, baseRef, safeAnchorDate) || null;
        }

        function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
            const group = dep.getCurrentGroup();
            if (!group) return false;
            dep.ensureGroupFixedTimes(group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return false;

            const totalSeconds = Math.min(
                TIMELINE_TOTAL_SECONDS - 1,
                Math.max(0, Math.round(clampRatio(ratio) * TIMELINE_TOTAL_SECONDS))
            );
            const hour = Math.floor(totalSeconds / 3600);
            const minute = Math.floor((totalSeconds % 3600) / 60);
            slot.time = `${pad2(hour)}:${pad2(minute)}`;
            return true;
        }

        function getFixedTimeTimelineSlots() {
            const group = dep.getCurrentGroup();
            if (!group) return [];
            dep.ensureGroupFixedTimes(group);
            return Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
        }

        function getFixedTimeTimelineSlotCount() {
            return dep.getFixedTimeSlotCount(dep.getCurrentGroup());
        }

        function getFixedTimeTimelineIndicatorToken() {
            const group = dep.getCurrentGroup();
            if (!group) return "";
            dep.ensureGroupFixedTimes(group);
            const defaultName = dep.getDefaultFixedTimeName();
            const slots = Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
            return slots.map((slot, idx) => {
                const id = dep.sanitizeFixedTimeId(slot?.id) || "";
                const name = dep.sanitizeFixedTimeName(slot?.name, defaultName) || "";
                return `${idx}:${id}:${name}`;
            }).join("|");
        }

        function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
            return dep.getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
        }

        return Object.freeze({
            resolveFixedTimeTimelineSourceDate,
            applyFixedTimeSlotTimelineRatio,
            getFixedTimeTimelineSlots,
            getFixedTimeTimelineSlotCount,
            getFixedTimeTimelineIndicatorToken,
            getFixedTimeSlotTimelineLabel
        });
    }

    globalObj.GTVFixedTimeTimeline = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
