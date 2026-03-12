(function initGtvMultiState(globalObj) {
    "use strict";

    function createService(deps) {
        let multiSubgroupIdSeed = 0;

        function sanitizeMultiSubgroupId(value) {
            return (typeof value === "string" && value.trim()) ? value.trim() : "";
        }

        function sanitizeMultiSubgroupName(value, fallback = "") {
            const trimmed = (typeof value === "string" ? value : "").trim();
            if (trimmed) return trimmed.slice(0, 60);
            const fallbackTrimmed = (typeof fallback === "string" ? fallback : "").trim();
            if (fallbackTrimmed) return fallbackTrimmed.slice(0, 60);
            return deps.t("default_subgroup_name");
        }

        function getDefaultMultiSubgroupName(index = 0) {
            const base = deps.t("default_subgroup_name");
            return `${base} ${index + 1}`;
        }

        function getUsedMultiSubgroupIds() {
            const usedIds = new Set();
            const groups = deps.getGroups();
            groups.forEach((group) => {
                if (!group || !Array.isArray(group.multiSubgroups)) return;
                group.multiSubgroups.forEach((subgroup) => {
                    const subgroupId = sanitizeMultiSubgroupId(subgroup?.id);
                    if (subgroupId) usedIds.add(subgroupId);
                });
            });
            return usedIds;
        }

        function createUniqueMultiSubgroupId(prefix = "subgroup") {
            const normalizedPrefix = (typeof prefix === "string" && prefix.trim()) ? prefix.trim() : "subgroup";
            const usedIds = getUsedMultiSubgroupIds();

            if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                const uuidId = `${normalizedPrefix}-${crypto.randomUUID()}`;
                if (!usedIds.has(uuidId)) return uuidId;
            }

            for (let attempt = 0; attempt < 10000; attempt++) {
                multiSubgroupIdSeed = (multiSubgroupIdSeed + 1) % 1000000;
                const candidate = `${normalizedPrefix}-${Date.now()}-${multiSubgroupIdSeed}`;
                if (!usedIds.has(candidate)) return candidate;
            }

            return `${normalizedPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
        }

        function sanitizeMultiStatePayload(rawState = null, fallbackState = null) {
            const defaults = deps.getDefaultMultiRangeBounds();
            const fallback = fallbackState && typeof fallbackState === "object"
                ? fallbackState
                : {
                    multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                    multiRanges: [{ startUtcMs: defaults.startMs, endUtcMs: defaults.endMs }],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                };

            const nextCount = deps.sanitizeMultiRangeCount(rawState?.multiRangeCount ?? fallback.multiRangeCount);
            const sourceRanges = Array.isArray(rawState?.multiRanges)
                ? rawState.multiRanges
                : (Array.isArray(fallback.multiRanges) ? fallback.multiRanges : []);
            const sourceCollapsed = Array.isArray(rawState?.multiRangeCollapsed)
                ? rawState.multiRangeCollapsed
                : (Array.isArray(fallback.multiRangeCollapsed) ? fallback.multiRangeCollapsed : []);
            const sourceStartEdit = Array.isArray(rawState?.multiRangeStartEditEnabled)
                ? rawState.multiRangeStartEditEnabled
                : (Array.isArray(fallback.multiRangeStartEditEnabled) ? fallback.multiRangeStartEditEnabled : []);
            const sourceEndEdit = Array.isArray(rawState?.multiRangeEndEditEnabled)
                ? rawState.multiRangeEndEditEnabled
                : (Array.isArray(fallback.multiRangeEndEditEnabled) ? fallback.multiRangeEndEditEnabled : []);

            let nextRanges = sourceRanges
                .map((item) => deps.sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
                .slice(0, nextCount);
            if (!nextRanges.length) {
                const fallbackRange = deps.sanitizeMultiRangeItem(sourceRanges[0], defaults.startMs, defaults.endMs);
                nextRanges = [fallbackRange];
            }

            const firstDuration = nextRanges[0].endUtcMs - nextRanges[0].startUtcMs;
            while (nextRanges.length < nextCount) {
                const prev = nextRanges[nextRanges.length - 1];
                const startUtcMs = prev.endUtcMs;
                nextRanges.push({
                    startUtcMs,
                    endUtcMs: startUtcMs + firstDuration
                });
            }

            const nextCollapsed = Array.from({ length: nextCount }, (_, idx) => !!sourceCollapsed[idx]);
            const nextStartEditEnabled = Array.from({ length: nextCount }, (_, idx) => (idx === 0 ? false : !!sourceStartEdit[idx]));
            const nextEndEditEnabled = Array.from({ length: nextCount }, (_, idx) =>
                (sourceEndEdit[idx] === undefined ? true : !!sourceEndEdit[idx])
            );

            nextRanges[0].startUtcMs = deps.sanitizeUtcMs(nextRanges[0].startUtcMs, defaults.startMs);
            nextRanges[0].endUtcMs = deps.sanitizeUtcMs(nextRanges[0].endUtcMs, defaults.endMs);
            for (let i = 1; i < nextRanges.length; i++) {
                nextRanges[i].startUtcMs = deps.sanitizeUtcMs(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
                if (!nextStartEditEnabled[i]) {
                    nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
                }
                nextRanges[i].endUtcMs = deps.sanitizeUtcMs(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
            }

            return {
                multiRangeCount: nextCount,
                multiRanges: nextRanges,
                multiRangeCollapsed: nextCollapsed,
                multiRangeStartEditEnabled: nextStartEditEnabled,
                multiRangeEndEditEnabled: nextEndEditEnabled
            };
        }

        function createMultiSubgroupState(name = "", index = 0, state = null) {
            const normalized = sanitizeMultiStatePayload(state, null);
            return {
                id: createUniqueMultiSubgroupId(),
                name: sanitizeMultiSubgroupName(name, getDefaultMultiSubgroupName(index)),
                ...normalized
            };
        }

        function ensureGroupMultiSubgroups(group, options = {}) {
            if (!group || typeof group !== "object") return;
            const { legacyMultiState = null } = options;
            const rawSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const fallbackState = sanitizeMultiStatePayload(legacyMultiState, null);

            let normalizedSubgroups = rawSubgroups.map((subgroup, idx) => {
                const subgroupState = sanitizeMultiStatePayload(subgroup, fallbackState);
                return {
                    id: sanitizeMultiSubgroupId(subgroup?.id) || createUniqueMultiSubgroupId(),
                    name: sanitizeMultiSubgroupName(subgroup?.name, getDefaultMultiSubgroupName(idx)),
                    ...subgroupState
                };
            });

            if (!normalizedSubgroups.length) {
                normalizedSubgroups = [{
                    id: createUniqueMultiSubgroupId(),
                    name: sanitizeMultiSubgroupName(
                        group.multiRangeTitle || legacyMultiState?.multiRangeTitle || "",
                        getDefaultMultiSubgroupName(0)
                    ),
                    ...fallbackState
                }];
            }

            const used = new Set();
            normalizedSubgroups.forEach((subgroup, idx) => {
                if (!subgroup.id || used.has(subgroup.id)) subgroup.id = createUniqueMultiSubgroupId();
                used.add(subgroup.id);
                subgroup.name = sanitizeMultiSubgroupName(subgroup.name, getDefaultMultiSubgroupName(idx));
            });

            group.multiSubgroups = normalizedSubgroups;
            const requestedActiveSubgroupId = sanitizeMultiSubgroupId(group.activeMultiSubgroupId);
            group.activeMultiSubgroupId = normalizedSubgroups.some((subgroup) => subgroup.id === requestedActiveSubgroupId)
                ? requestedActiveSubgroupId
                : normalizedSubgroups[0].id;
        }

        return Object.freeze({
            sanitizeMultiSubgroupId,
            sanitizeMultiSubgroupName,
            getDefaultMultiSubgroupName,
            getUsedMultiSubgroupIds,
            createUniqueMultiSubgroupId,
            sanitizeMultiStatePayload,
            createMultiSubgroupState,
            ensureGroupMultiSubgroups
        });
    }

    globalObj.GTVMultiState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
