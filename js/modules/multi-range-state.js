(function initGtvMultiRangeState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
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
                    logWarn(`[GTVMultiRangeState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getState: toSafeCallable("getState", safeDeps.getState),
            setState: toSafeCallable("setState", safeDeps.setState),
            t: toSafeCallable("t", safeDeps.t),
            sanitizeUtcMs: toSafeCallable("sanitizeUtcMs", safeDeps.sanitizeUtcMs),
            getGlobalTimes: toSafeCallable("getGlobalTimes", safeDeps.getGlobalTimes),
            isMultiTab: toSafeCallable("isMultiTab", safeDeps.isMultiTab),
            renderMultiRanges: toSafeCallable("renderMultiRanges", safeDeps.renderMultiRanges),
            savePersistence: toSafeCallable("savePersistence", safeDeps.savePersistence),
            showToast: toSafeCallable("showToast", safeDeps.showToast)
        });

        function savePersistenceSafe() {
            return dep.savePersistence();
        }

        function readState() {
            const state = dep.getState();
            if (!state || typeof state !== "object") {
                return {
                    multiRangeCount: 1,
                    multiRangeTitle: "",
                    multiRanges: [],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                };
            }
            return state;
        }

        function patchState(next = {}) {
            if (!next || typeof next !== "object") return;
            dep.setState(next);
        }

        function translate(key) {
            const text = dep.t(key);
            return (typeof text === "string" && text) ? text : String(key || "");
        }

        function sanitizeUtcMs(value, fallbackMs) {
            const viaDep = dep.sanitizeUtcMs(value, fallbackMs);
            if (Number.isFinite(viaDep)) return viaDep;
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return parsed;
            const fallback = Number(fallbackMs);
            return Number.isFinite(fallback) ? fallback : Date.now();
        }

        function getMinCount() {
            const parsed = Number(safeDeps.MIN_MULTI_RANGE_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getMaxCount() {
            const parsed = Number(safeDeps.MAX_MULTI_RANGE_COUNT);
            return Number.isFinite(parsed) ? Math.max(getMinCount(), Math.trunc(parsed)) : 12;
        }

        function sanitizeMultiRangeCount(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getMinCount();
            return Math.min(getMaxCount(), Math.max(getMinCount(), parsed));
        }

        function sanitizeMultiRangeTitle(value) {
            const text = (typeof value === "string") ? value.trim() : "";
            if (!text) return translate("placeholder_range_title");
            return text.slice(0, 40);
        }

        function getDefaultMultiRangeBounds() {
            const globalTimes = dep.getGlobalTimes();
            const safeTimes = Array.isArray(globalTimes) ? globalTimes : [];
            const nowMs = Date.now();
            const startMs = sanitizeUtcMs(safeTimes[0]?.getTime?.(), nowMs);
            const endMs = sanitizeUtcMs(safeTimes[1]?.getTime?.(), startMs);
            return { startMs, endMs };
        }

        function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
            if (!rawRange || typeof rawRange !== "object") {
                return { startUtcMs: fallbackStartMs, endUtcMs: fallbackEndMs };
            }
            const startUtcMs = sanitizeUtcMs(rawRange.startUtcMs, fallbackStartMs);
            const endUtcMs = sanitizeUtcMs(rawRange.endUtcMs, fallbackEndMs);
            return { startUtcMs, endUtcMs };
        }

        function isMultiRangeStartEditEnabled(rangeIdx) {
            const state = readState();
            if (!Number.isInteger(rangeIdx) || rangeIdx <= 0) return false;
            return !!state.multiRangeStartEditEnabled?.[rangeIdx];
        }

        function isMultiRangeEndEditEnabled(rangeIdx) {
            const state = readState();
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
            return !!state.multiRangeEndEditEnabled?.[rangeIdx];
        }

        function isMultiRangeStartLinked(rangeIdx) {
            return rangeIdx > 0 && !isMultiRangeStartEditEnabled(rangeIdx);
        }

        function ensureMultiRangeState() {
            const state = readState();
            const nextCount = sanitizeMultiRangeCount(state.multiRangeCount);
            const nextTitle = sanitizeMultiRangeTitle(state.multiRangeTitle);
            const defaults = getDefaultMultiRangeBounds();

            const normalized = Array.isArray(state.multiRanges)
                ? state.multiRanges.map((item) => sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
                : [];
            const normalizedCollapsed = Array.isArray(state.multiRangeCollapsed)
                ? state.multiRangeCollapsed.map((flag) => !!flag)
                : [];
            const normalizedStartEdit = Array.isArray(state.multiRangeStartEditEnabled)
                ? state.multiRangeStartEditEnabled.map((flag) => !!flag)
                : [];
            const normalizedEndEdit = Array.isArray(state.multiRangeEndEditEnabled)
                ? state.multiRangeEndEditEnabled.map((flag) => !!flag)
                : [];

            let nextRanges = normalized.slice(0, nextCount);
            if (!nextRanges.length) {
                nextRanges = [{
                    startUtcMs: defaults.startMs,
                    endUtcMs: defaults.endMs
                }];
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

            const nextStartEditEnabled = Array.from({ length: nextCount }, (_, idx) => (idx === 0 ? false : !!normalizedStartEdit[idx]));
            const nextEndEditEnabled = Array.from({ length: nextCount }, (_, idx) =>
                (normalizedEndEdit[idx] === undefined ? true : !!normalizedEndEdit[idx])
            );

            nextRanges[0].startUtcMs = sanitizeUtcMs(nextRanges[0].startUtcMs, defaults.startMs);
            nextRanges[0].endUtcMs = sanitizeUtcMs(nextRanges[0].endUtcMs, defaults.endMs);
            for (let i = 1; i < nextRanges.length; i++) {
                nextRanges[i].startUtcMs = sanitizeUtcMs(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
                if (!nextStartEditEnabled[i]) {
                    nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
                }
                nextRanges[i].endUtcMs = sanitizeUtcMs(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
            }

            patchState({
                multiRangeCount: nextCount,
                multiRangeTitle: nextTitle,
                multiRanges: nextRanges,
                multiRangeCollapsed: Array.from({ length: nextCount }, (_, idx) => !!normalizedCollapsed[idx]),
                multiRangeStartEditEnabled: nextStartEditEnabled,
                multiRangeEndEditEnabled: nextEndEditEnabled
            });
        }

        function renderIfMultiTab() {
            if (!dep.isMultiTab()) return;
            dep.renderMultiRanges();
        }

        function persistIfNeeded(persist) {
            if (!persist) return;
            savePersistenceSafe();
        }

        function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx <= 0 || rangeIdx >= count) return false;

            const nextEnabled = !!enabled;
            const nextStartEdit = Array.isArray(state.multiRangeStartEditEnabled) ? [...state.multiRangeStartEditEnabled] : [];
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];

            nextStartEdit[rangeIdx] = nextEnabled;
            if (!nextEnabled && nextRanges[rangeIdx] && nextRanges[rangeIdx - 1]) {
                nextRanges[rangeIdx].startUtcMs = nextRanges[rangeIdx - 1].endUtcMs;
            }

            patchState({
                multiRangeStartEditEnabled: nextStartEdit,
                multiRanges: nextRanges
            });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= count) return false;

            const nextEndEdit = Array.isArray(state.multiRangeEndEditEnabled) ? [...state.multiRangeEndEditEnabled] : [];
            nextEndEdit[rangeIdx] = !!enabled;
            patchState({ multiRangeEndEditEnabled: nextEndEdit });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const next = !!enabled;
            const nextStartEdit = Array.isArray(state.multiRangeStartEditEnabled) ? [...state.multiRangeStartEditEnabled] : [];
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];

            for (let idx = 1; idx < count; idx++) {
                nextStartEdit[idx] = next;
                if (!next && nextRanges[idx] && nextRanges[idx - 1]) {
                    nextRanges[idx].startUtcMs = nextRanges[idx - 1].endUtcMs;
                }
            }

            patchState({
                multiRangeStartEditEnabled: nextStartEdit,
                multiRanges: nextRanges
            });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const next = !!enabled;
            const nextEndEdit = Array.isArray(state.multiRangeEndEditEnabled) ? [...state.multiRangeEndEditEnabled] : [];

            for (let idx = 0; idx < count; idx++) {
                nextEndEdit[idx] = next;
            }

            patchState({ multiRangeEndEditEnabled: nextEndEdit });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function refreshMultiRangeControls() {
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const countInput = document.getElementById("multi-range-count-input");
            if (countInput) countInput.value = String(count);

            const decreaseBtn = document.getElementById("multi-range-count-decrease");
            const increaseBtn = document.getElementById("multi-range-count-increase");
            if (decreaseBtn) decreaseBtn.disabled = count <= getMinCount();
            if (increaseBtn) increaseBtn.disabled = count >= getMaxCount();
        }

        function syncMultiRangeStartLinks(startIdx = 1) {
            ensureMultiRangeState();
            const state = readState();
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];
            for (let idx = Math.max(1, startIdx); idx < nextRanges.length; idx++) {
                if (!isMultiRangeStartLinked(idx)) continue;
                nextRanges[idx].startUtcMs = nextRanges[idx - 1].endUtcMs;
            }
            patchState({ multiRanges: nextRanges });
        }

        function syncFollowingRangesByDuration(changedRangeIdx) {
            const state = readState();
            const ranges = Array.isArray(state.multiRanges) ? state.multiRanges : [];
            if (!Number.isInteger(changedRangeIdx) || changedRangeIdx < 0 || changedRangeIdx >= ranges.length) return;
            if (changedRangeIdx >= ranges.length - 1) return;

            const fallbackNow = Date.now();
            const nextRanges = ranges.map((item) => ({ ...item }));
            const durations = nextRanges.map((range) => {
                const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
                const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
                return endUtcMs - startUtcMs;
            });

            let cursor = sanitizeUtcMs(nextRanges[changedRangeIdx]?.endUtcMs, fallbackNow);
            for (let idx = changedRangeIdx + 1; idx < nextRanges.length; idx++) {
                const duration = durations[idx] ?? 0;
                if (isMultiRangeStartLinked(idx)) {
                    nextRanges[idx].startUtcMs = cursor;
                    nextRanges[idx].endUtcMs = cursor + duration;
                } else {
                    nextRanges[idx].startUtcMs = sanitizeUtcMs(nextRanges[idx].startUtcMs, cursor);
                    nextRanges[idx].endUtcMs = sanitizeUtcMs(nextRanges[idx].endUtcMs, nextRanges[idx].startUtcMs);
                }
                cursor = sanitizeUtcMs(nextRanges[idx].endUtcMs, cursor);
            }

            patchState({ multiRanges: nextRanges });
        }

        function syncLinkedRangesFrom(rangeIdx, options = {}) {
            const { includeCurrent = true, stopAtFirstUnlocked = true, baseDurations = null } = options;
            ensureMultiRangeState();
            const state = readState();
            const ranges = Array.isArray(state.multiRanges) ? state.multiRanges : [];
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= ranges.length) return;

            const fallbackNow = Date.now();
            const nextRanges = ranges.map((item) => ({ ...item }));
            const durations = Array.isArray(baseDurations) && baseDurations.length
                ? baseDurations
                : nextRanges.map((range) => {
                    const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
                    const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
                    return endUtcMs - startUtcMs;
                });

            let anchorIdx = rangeIdx;
            if (includeCurrent) {
                const startUtcMs = sanitizeUtcMs(nextRanges[anchorIdx]?.startUtcMs, fallbackNow);
                nextRanges[anchorIdx].startUtcMs = startUtcMs;
                nextRanges[anchorIdx].endUtcMs = startUtcMs + (durations[anchorIdx] ?? 0);
            }

            let cursor = sanitizeUtcMs(nextRanges[anchorIdx]?.endUtcMs, fallbackNow);
            for (let idx = anchorIdx + 1; idx < nextRanges.length; idx++) {
                if (!isMultiRangeStartLinked(idx)) {
                    if (stopAtFirstUnlocked) break;
                    cursor = sanitizeUtcMs(nextRanges[idx]?.endUtcMs, cursor);
                    continue;
                }
                nextRanges[idx].startUtcMs = cursor;
                nextRanges[idx].endUtcMs = cursor + (durations[idx] ?? 0);
                cursor = sanitizeUtcMs(nextRanges[idx].endUtcMs, cursor);
            }

            patchState({ multiRanges: nextRanges });
        }

        function setMultiRangeCount(value, options = {}) {
            const { persist = true, rerender = true, showBoundaryToast = false } = options;
            const parsed = parseInt(value, 10);
            const nextCount = sanitizeMultiRangeCount(value);

            if (showBoundaryToast && Number.isFinite(parsed)) {
                if (parsed >= getMaxCount()) {
                    dep.showToast(translate("toast_range_count_max"));
                } else if (parsed <= getMinCount()) {
                    dep.showToast(translate("toast_range_count_min"));
                }
            }

            patchState({ multiRangeCount: nextCount });
            ensureMultiRangeState();
            refreshMultiRangeControls();

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
        }

        function toggleMultiRangeCollapsed(rangeIdx) {
            ensureMultiRangeState();
            const state = readState();
            const nextCollapsed = Array.isArray(state.multiRangeCollapsed) ? [...state.multiRangeCollapsed] : [];
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= nextCollapsed.length) return;
            nextCollapsed[rangeIdx] = !nextCollapsed[rangeIdx];
            patchState({ multiRangeCollapsed: nextCollapsed });
            renderIfMultiTab();
            savePersistenceSafe();
        }

        function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= count) return;

            const nextCollapsed = Array.isArray(state.multiRangeCollapsed) ? [...state.multiRangeCollapsed] : [];
            const next = !!collapsed;
            for (let idx = rangeIdx; idx < count; idx++) {
                nextCollapsed[idx] = next;
            }
            patchState({ multiRangeCollapsed: nextCollapsed });
            renderIfMultiTab();
            savePersistenceSafe();
        }

        function getMultiRangeSlotDate(rangeIdx, slotIdx) {
            ensureMultiRangeState();
            const state = readState();
            const range = state.multiRanges?.[rangeIdx];
            if (!range) return new Date();
            const utcMs = slotIdx === 0 ? range.startUtcMs : range.endUtcMs;
            return new Date(utcMs);
        }

        function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
            ensureMultiRangeState();
            const state = readState();
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];
            const range = nextRanges[rangeIdx];
            if (!range || !(nextDate instanceof Date) || !Number.isFinite(nextDate.getTime())) return false;
            const nextMs = nextDate.getTime();
            if (slotIdx === 0) range.startUtcMs = nextMs;
            else range.endUtcMs = nextMs;
            patchState({ multiRanges: nextRanges });
            return true;
        }

        return Object.freeze({
            sanitizeMultiRangeCount,
            sanitizeMultiRangeTitle,
            getDefaultMultiRangeBounds,
            sanitizeMultiRangeItem,
            isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled,
            isMultiRangeStartLinked,
            ensureMultiRangeState,
            setMultiRangeStartEditEnabled,
            setMultiRangeEndEditEnabled,
            setAllMultiRangeStartEditEnabled,
            setAllMultiRangeEndEditEnabled,
            refreshMultiRangeControls,
            syncMultiRangeStartLinks,
            syncFollowingRangesByDuration,
            syncLinkedRangesFrom,
            setMultiRangeCount,
            toggleMultiRangeCollapsed,
            setMultiRangesCollapsedBelow,
            getMultiRangeSlotDate,
            setMultiRangeSlotDate
        });
    }

    globalObj.GTVMultiRangeState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
