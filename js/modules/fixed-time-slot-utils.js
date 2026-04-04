(function initGtvFixedTimeSlotUtils(globalObj) {
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
            t: toSafeCallable(safeDeps.t),
            buildStrictUtcDateFromParts: toSafeCallable(safeDeps.buildStrictUtcDateFromParts),
            getCurrentGroup: toSafeCallable(safeDeps.getCurrentGroup),
            getNextFixedTimeSeed: toSafeCallable(safeDeps.getNextFixedTimeSeed)
        });

        function getCurrentGroupSafe() {
            const group = dep.getCurrentGroup();
            return (group && typeof group === "object") ? group : null;
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            if (!Number.isFinite(parsed)) return fallback;
            return Math.trunc(parsed);
        }

        function getMinSlotCount() {
            return Math.max(1, getNumberConstant("MIN_FIXED_TIME_SLOT_COUNT", 1));
        }

        function getMaxSlotCount() {
            const min = getMinSlotCount();
            return Math.max(min, getNumberConstant("MAX_FIXED_TIME_SLOT_COUNT", 5));
        }

        function getDefaultFixedTimeValue() {
            const raw = safeDeps.DEFAULT_FIXED_TIME_VALUE;
            return (typeof raw === "string" && raw.trim()) ? raw.trim() : "09:00";
        }

        function pad2(value) {
            if (typeof safeDeps.pad === "function") return safeDeps.pad(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function getDefaultFixedTimeName() {
            const translated = dep.t("label_fixed_time_default");
            return (typeof translated === "string" && translated.trim()) ? translated.trim() : "Fixed Time";
        }

        function getDefaultFixedDate(anchorDate = new Date()) {
            const safeDate = (anchorDate instanceof Date && Number.isFinite(anchorDate.getTime())) ? anchorDate : new Date();
            return `${safeDate.getFullYear()}-${pad2(safeDate.getMonth() + 1)}-${pad2(safeDate.getDate())}`;
        }

        function getDefaultFixedTimes() {
            return [{
                id: "",
                name: getDefaultFixedTimeName(),
                time: getDefaultFixedTimeValue()
            }];
        }

        function sanitizeFixedTimeSlotCount(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getMinSlotCount();
            return Math.min(getMaxSlotCount(), Math.max(getMinSlotCount(), parsed));
        }

        function sanitizeFixedTimeId(value) {
            if (typeof value !== "string") return "";
            const trimmed = value.trim();
            if (!trimmed) return "";
            return trimmed.slice(0, 40);
        }

        function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
            const text = (typeof value === "string") ? value.trim() : "";
            if (!text) return fallback;
            return text.slice(0, 40);
        }

        function sanitizeFixedTimeValue(value, fallback = getDefaultFixedTimeValue()) {
            const source = (typeof value === "string") ? value.trim() : "";
            const match = source.match(/^(\d{1,2}):(\d{1,2})$/);
            if (!match) return fallback;
            const hour = parseInt(match[1], 10);
            const minute = parseInt(match[2], 10);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return fallback;
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback;
            return `${pad2(hour)}:${pad2(minute)}`;
        }

        function sanitizeFixedDateValue(value, fallback = "") {
            const source = (typeof value === "string") ? value.trim() : "";
            if (!source) return fallback;
            const parseDateTimeParts = safeDeps.parseDateTimeParts;
            if (typeof parseDateTimeParts !== "function") return fallback;

            const parsed = parseDateTimeParts(source, "date");
            if (!Array.isArray(parsed) || parsed.length < 3) return fallback;
            const year = parseInt(parsed[0], 10);
            const month = parseInt(parsed[1], 10);
            const day = parseInt(parsed[2], 10);
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return fallback;

            const strictDate = dep.buildStrictUtcDateFromParts({
                year,
                month,
                day,
                hour: 0,
                minute: 0,
                second: 0
            });
            if (!(strictDate instanceof Date) || !Number.isFinite(strictDate.getTime())) return fallback;
            return `${String(year).padStart(4, "0")}-${pad2(month)}-${pad2(day)}`;
        }

        function sanitizeFixedTimeShowLiveNow(value, fallback = false) {
            if (typeof value === "boolean") return value;
            if (typeof value === "number") return value !== 0;
            if (typeof value === "string") {
                const normalized = value.trim().toLowerCase();
                if (!normalized) return false;
                if (normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on") {
                    return true;
                }
                if (normalized === "false" || normalized === "0" || normalized === "no" || normalized === "off") {
                    return false;
                }
            }
            return !!fallback;
        }

        function createDefaultFixedTimeSlot(id = "") {
            return {
                id: sanitizeFixedTimeId(id),
                name: getDefaultFixedTimeName(),
                time: getDefaultFixedTimeValue()
            };
        }

        function getFixedDatePartsFromGroup(group = undefined) {
            const targetGroup = (group && typeof group === "object") ? group : getCurrentGroupSafe();
            if (!targetGroup) return null;
            const fixedDate = sanitizeFixedDateValue(targetGroup.fixedDate, "");
            if (!fixedDate) return null;

            const parseDateTimeParts = safeDeps.parseDateTimeParts;
            if (typeof parseDateTimeParts !== "function") return null;
            const parsed = parseDateTimeParts(fixedDate, "date");
            if (!Array.isArray(parsed) || parsed.length < 3) return null;

            const year = parseInt(parsed[0], 10);
            const month = parseInt(parsed[1], 10);
            const day = parseInt(parsed[2], 10);
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
            return { year, month, day };
        }

        function sanitizeFixedTimes(rawFixedTimes) {
            const source = Array.isArray(rawFixedTimes) ? rawFixedTimes : [];
            const sanitized = [];
            const seenIds = new Set();
            let localSeed = 0;
            const nextId = () => {
                let candidate = "";
                do {
                    localSeed += 1;
                    candidate = `ft-${localSeed}`;
                } while (seenIds.has(candidate));
                return candidate;
            };

            source.forEach((item) => {
                if (!item || typeof item !== "object") return;
                if (sanitized.length >= getMaxSlotCount()) return;

                let id = sanitizeFixedTimeId(item.id);
                if (!id || seenIds.has(id)) {
                    id = nextId();
                }
                seenIds.add(id);

                sanitized.push({
                    id,
                    name: sanitizeFixedTimeName(item.name, getDefaultFixedTimeName()),
                    time: sanitizeFixedTimeValue(item.time, getDefaultFixedTimeValue())
                });
            });

            while (sanitized.length < getMinSlotCount()) {
                const id = nextId();
                seenIds.add(id);
                const defaultSlot = createDefaultFixedTimeSlot(id);
                defaultSlot.id = id;
                sanitized.push(defaultSlot);
            }

            return sanitized;
        }

        function ensureGroupFixedTimes(group) {
            if (!group || typeof group !== "object") return;
            group.fixedTimes = sanitizeFixedTimes(group.fixedTimes);
            group.fixedDate = sanitizeFixedDateValue(group.fixedDate, "");
            group.fixedTimeShowLiveNow = sanitizeFixedTimeShowLiveNow(group.fixedTimeShowLiveNow, false);
        }

        function createUniqueFixedTimeId(group = undefined) {
            const targetGroup = (group && typeof group === "object") ? group : getCurrentGroupSafe();
            const existingIds = new Set(
                (Array.isArray(targetGroup && targetGroup.fixedTimes) ? targetGroup.fixedTimes : [])
                    .map((item) => sanitizeFixedTimeId(item && item.id))
                    .filter(Boolean)
            );

            let candidate = "";
            do {
                const nextSeed = dep.getNextFixedTimeSeed();
                const parsedSeed = Number(nextSeed);
                const suffix = Number.isFinite(parsedSeed) ? Math.trunc(parsedSeed) : Date.now();
                candidate = `ft-${suffix}`;
            } while (existingIds.has(candidate));

            return candidate;
        }

        return Object.freeze({
            getDefaultFixedTimeName,
            getDefaultFixedDate,
            getDefaultFixedTimes,
            sanitizeFixedTimeSlotCount,
            createDefaultFixedTimeSlot,
            sanitizeFixedTimeId,
            sanitizeFixedTimeName,
            sanitizeFixedTimeValue,
            sanitizeFixedDateValue,
            sanitizeFixedTimeShowLiveNow,
            getFixedDatePartsFromGroup,
            sanitizeFixedTimes,
            ensureGroupFixedTimes,
            createUniqueFixedTimeId
        });
    }

    globalObj.GTVFixedTimeSlotUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
