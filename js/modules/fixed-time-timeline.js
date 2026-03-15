(function initGtvFixedTimeTimeline(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TIMELINE_TOTAL_SECONDS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_SECONDS))
            ? Number(safeDeps.TIMELINE_TOTAL_SECONDS)
            : (24 * 60 * 60);

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeTimeline] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

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
            const group = invokeDep("getCurrentGroup");
            if (!group || !baseRef) return null;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;

            const safeAnchorDate = isValidDate(anchorDate)
                ? anchorDate
                : (isValidDate(invokeDep("getGlobalTime", 0)) ? invokeDep("getGlobalTime", 0) : new Date());
            return invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, safeAnchorDate) || null;
        }

        function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
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
            const group = invokeDep("getCurrentGroup");
            if (!group) return [];
            invokeDep("ensureGroupFixedTimes", group);
            return Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
        }

        function getFixedTimeTimelineSlotCount() {
            return invokeDep("getFixedTimeSlotCount", invokeDep("getCurrentGroup"));
        }

        function getFixedTimeTimelineIndicatorToken() {
            const group = invokeDep("getCurrentGroup");
            if (!group) return "";
            invokeDep("ensureGroupFixedTimes", group);
            const defaultName = invokeDep("getDefaultFixedTimeName");
            const slots = Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
            return slots.map((slot, idx) => {
                const id = invokeDep("sanitizeFixedTimeId", slot?.id) || "";
                const name = invokeDep("sanitizeFixedTimeName", slot?.name, defaultName) || "";
                return `${idx}:${id}:${name}`;
            }).join("|");
        }

        function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
            return invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, slotCount);
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

