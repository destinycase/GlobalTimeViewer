(function initGtvMainTimezoneMutationServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getGroups = (typeof safeDeps.getGroups === "function")
            ? safeDeps.getGroups
            : (() => (Array.isArray(safeDeps.groups) ? safeDeps.groups : []));
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const getCurrentGroupBaseTimezoneId = (typeof safeDeps.getCurrentGroupBaseTimezoneId === "function")
            ? safeDeps.getCurrentGroupBaseTimezoneId
            : (() => "utc");
        const sanitizeTimezoneId = (typeof safeDeps.sanitizeTimezoneId === "function")
            ? safeDeps.sanitizeTimezoneId
            : ((value) => String(value || "").trim());
        const getNextTimezoneIdSeed = (typeof safeDeps.getNextTimezoneIdSeed === "function")
            ? safeDeps.getNextTimezoneIdSeed
            : (() => Math.floor(Math.random() * 1000000));
        const getNow = (typeof safeDeps.getNow === "function")
            ? safeDeps.getNow
            : (() => Date.now());
        const getRandomUUID = (typeof safeDeps.getRandomUUID === "function")
            ? safeDeps.getRandomUUID
            : (() => {
                if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                    return crypto.randomUUID();
                }
                return "";
            });
        const getRandom = (typeof safeDeps.getRandom === "function")
            ? safeDeps.getRandom
            : (() => Math.random());
        const getGroupStateService = (typeof safeDeps.getGroupStateService === "function")
            ? safeDeps.getGroupStateService
            : (() => null);
        const normalizeCustomAbbr = (typeof safeDeps.normalizeCustomAbbr === "function")
            ? safeDeps.normalizeCustomAbbr
            : ((value) => String(value || "").trim().toUpperCase());
        const normalizeStandardZone = (typeof safeDeps.normalizeStandardZone === "function")
            ? safeDeps.normalizeStandardZone
            : ((value) => String(value || "").trim());
        const showToast = (typeof safeDeps.showToast === "function")
            ? safeDeps.showToast
            : (() => { });
        const t = (typeof safeDeps.t === "function")
            ? safeDeps.t
            : ((key) => String(key || ""));
        const savePersistence = (typeof safeDeps.savePersistence === "function")
            ? safeDeps.savePersistence
            : (() => { });
        const renderList = (typeof safeDeps.renderList === "function")
            ? safeDeps.renderList
            : (() => { });
        const renderTimelineFrame = (typeof safeDeps.renderTimelineFrame === "function")
            ? safeDeps.renderTimelineFrame
            : (() => { });

        function getUsedTimezoneIds() {
            const usedIds = new Set(["utc"]);
            const groups = getGroups();
            if (!Array.isArray(groups)) return usedIds;
            groups.forEach((group) => {
                if (!group || !Array.isArray(group.zones)) return;
                group.zones.forEach((zone) => {
                    const zoneId = sanitizeTimezoneId(zone?.id);
                    if (zoneId) usedIds.add(zoneId);
                });
            });
            return usedIds;
        }

        function createUniqueTimezoneId(prefix = "tz") {
            const normalizedPrefix = (typeof prefix === "string" && prefix.trim()) ? prefix.trim() : "tz";
            const usedIds = getUsedTimezoneIds();

            const uuid = getRandomUUID();
            if (typeof uuid === "string" && uuid) {
                const uuidId = `${normalizedPrefix}-${uuid}`;
                if (!usedIds.has(uuidId)) return uuidId;
            }

            for (let attempt = 0; attempt < 10000; attempt++) {
                const seed = getNextTimezoneIdSeed();
                const candidate = `${normalizedPrefix}-${getNow()}-${seed}`;
                if (!usedIds.has(candidate)) return candidate;
            }

            return `${normalizedPrefix}-${getNow()}-${Math.floor(getRandom() * 1000000000)}`;
        }

        function addTimezone(tz) {
            const activeGroup = getCurrentGroup();
            if (!activeGroup) return false;
            if (!tz || typeof tz !== "object") return false;

            const groupStateService = getGroupStateService();
            if (tz?.type === "standard"
                && groupStateService
                && typeof groupStateService.isValidTimeZone === "function"
                && !groupStateService.isValidTimeZone(tz.zone)) {
                showToast(t("toast_invalid_timezone"));
                return false;
            }

            if (!Array.isArray(activeGroup.zones)) activeGroup.zones = [];
            let nextTimezone = { ...tz };
            if (nextTimezone.type === "custom") {
                const normalizedAbbr = normalizeCustomAbbr(nextTimezone.abbr);
                const hasDuplicateAbbr = activeGroup.zones.some((zone) => (
                    zone?.type === "custom"
                    && normalizeCustomAbbr(zone?.abbr) === normalizedAbbr
                ));
                if (hasDuplicateAbbr) {
                    showToast(t("toast_custom_timezone_duplicate"), { type: "info" });
                    return false;
                }
                nextTimezone = { ...nextTimezone, abbr: normalizedAbbr };
            }
            if (nextTimezone.type === "standard") {
                const normalizedZone = normalizeStandardZone(nextTimezone.zone);
                const hasDuplicateZone = activeGroup.zones.some((zone) => (
                    zone?.type === "standard"
                    && normalizeStandardZone(zone?.zone) === normalizedZone
                ));
                if (normalizedZone && hasDuplicateZone) {
                    showToast(t("toast_timezone_duplicate"), { type: "info" });
                    return false;
                }
            }

            const requestedId = sanitizeTimezoneId(nextTimezone.id);
            const existingIds = new Set(
                activeGroup.zones
                    .map((zone) => sanitizeTimezoneId(zone?.id))
                    .filter(Boolean)
            );
            let nextId = requestedId;
            if (!nextId || existingIds.has(nextId)) {
                nextId = createUniqueTimezoneId(nextTimezone.type === "custom" ? "tz-c" : "tz");
            }
            activeGroup.zones.push({ ...nextTimezone, id: nextId });
            savePersistence();
            renderList();
            renderTimelineFrame();
            return true;
        }

        function removeTimezone(id) {
            const activeGroup = getCurrentGroup();
            if (!activeGroup) return;
            if (id === getCurrentGroupBaseTimezoneId()) return;

            if (id === "utc") {
                activeGroup.showUtcRow = false;
                activeGroup.utcRowOrder = 0;
                savePersistence();
                renderList();
                renderTimelineFrame();
                return;
            }

            if (!Array.isArray(activeGroup.zones)) activeGroup.zones = [];
            activeGroup.zones = activeGroup.zones.filter((zone) => zone.id !== id);
            savePersistence();
            renderList();
            renderTimelineFrame();
        }

        return Object.freeze({
            getUsedTimezoneIds,
            createUniqueTimezoneId,
            addTimezone,
            removeTimezone
        });
    }

    globalObj.GTVMainTimezoneMutationServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
