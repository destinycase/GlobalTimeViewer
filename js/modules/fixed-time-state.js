(function initGtvFixedTimeState(globalObj) {
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
                    logWarn(`[GTVFixedTimeState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getCurrentGroup: toSafeCallable("getCurrentGroup", safeDeps.getCurrentGroup),
            ensureGroupFixedTimes: toSafeCallable("ensureGroupFixedTimes", safeDeps.ensureGroupFixedTimes),
            sanitizeFixedTimeSlotCount: toSafeCallable("sanitizeFixedTimeSlotCount", safeDeps.sanitizeFixedTimeSlotCount),
            sanitizeFixedDateValue: toSafeCallable("sanitizeFixedDateValue", safeDeps.sanitizeFixedDateValue),
            isFixedTimeTab: toSafeCallable("isFixedTimeTab", safeDeps.isFixedTimeTab),
            renderFixedTimeTab: toSafeCallable("renderFixedTimeTab", safeDeps.renderFixedTimeTab),
            renderTimelineFrame: toSafeCallable("renderTimelineFrame", safeDeps.renderTimelineFrame),
            savePersistence: toSafeCallable("savePersistence", safeDeps.savePersistence),
            sanitizeFixedTimeShowLiveNow: toSafeCallable("sanitizeFixedTimeShowLiveNow", safeDeps.sanitizeFixedTimeShowLiveNow),
            showToast: toSafeCallable("showToast", safeDeps.showToast),
            t: toSafeCallable("t", safeDeps.t),
            createUniqueFixedTimeId: toSafeCallable("createUniqueFixedTimeId", safeDeps.createUniqueFixedTimeId),
            createDefaultFixedTimeSlot: toSafeCallable("createDefaultFixedTimeSlot", safeDeps.createDefaultFixedTimeSlot)
        });

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected.getElementById === "function") {
                    return injected;
                }
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected.getElementById === "function") {
                    return injected;
                }
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef.getElementById === "function") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document.getElementById === "function") {
                return globalObj.document;
            }
            if (typeof document === "object" && document && typeof document.getElementById === "function") {
                return document;
            }
            return null;
        }

        function getMinSlotCount() {
            const parsed = Number(safeDeps.MIN_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getMaxSlotCount() {
            const parsed = Number(safeDeps.MAX_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(getMinSlotCount(), Math.trunc(parsed)) : 5;
        }

        function getFixedTimeSlotCount(group = dep.getCurrentGroup()) {
            const safeGroup = (group && typeof group === "object") ? group : null;
            if (!safeGroup) return getMinSlotCount();
            dep.ensureGroupFixedTimes(safeGroup);
            const sanitizeCount = dep.sanitizeFixedTimeSlotCount(safeGroup.fixedTimes?.length);
            return Number.isFinite(sanitizeCount) ? sanitizeCount : getMinSlotCount();
        }

        function setCurrentGroupFixedDate(rawValue, options = {}) {
            const { persist = true, rerender = true } = options;
            const group = dep.getCurrentGroup();
            if (!group) return false;
            dep.ensureGroupFixedTimes(group);
            const nextDate = dep.sanitizeFixedDateValue(rawValue, group.fixedDate || "");
            if (group.fixedDate === nextDate) return false;
            group.fixedDate = nextDate;
            if (rerender && dep.isFixedTimeTab()) {
                dep.renderFixedTimeTab();
                dep.renderTimelineFrame();
            }
            if (persist) dep.savePersistence();
            return true;
        }

        function getCurrentGroupFixedTimeShowLiveNow(group = dep.getCurrentGroup()) {
            const safeGroup = (group && typeof group === "object") ? group : null;
            if (!safeGroup) return false;
            dep.ensureGroupFixedTimes(safeGroup);
            const sanitized = dep.sanitizeFixedTimeShowLiveNow(safeGroup.fixedTimeShowLiveNow, false);
            if (sanitized === undefined) return !!safeGroup.fixedTimeShowLiveNow;
            return !!sanitized;
        }

        function setCurrentGroupFixedTimeShowLiveNow(enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            const group = dep.getCurrentGroup();
            if (!group) return false;
            dep.ensureGroupFixedTimes(group);
            const sanitized = dep.sanitizeFixedTimeShowLiveNow(enabled, false);
            const nextEnabled = (sanitized === undefined) ? !!enabled : !!sanitized;
            if (!!group.fixedTimeShowLiveNow === nextEnabled) return false;
            group.fixedTimeShowLiveNow = nextEnabled;
            if (rerender && dep.isFixedTimeTab()) {
                dep.renderFixedTimeTab();
                dep.renderTimelineFrame();
            }
            if (persist) dep.savePersistence();
            return true;
        }

        function refreshFixedTimeSlotCountControls() {
            const group = dep.getCurrentGroup();
            const doc = getDocumentRef();
            const countInput = doc?.getElementById?.("fixed-time-slot-count-input");
            const decreaseBtn = doc?.getElementById?.("fixed-time-slot-count-decrease");
            const increaseBtn = doc?.getElementById?.("fixed-time-slot-count-increase");
            if (!group) {
                if (countInput) countInput.value = String(getMinSlotCount());
                if (decreaseBtn) decreaseBtn.disabled = true;
                if (increaseBtn) increaseBtn.disabled = true;
                return;
            }

            const count = getFixedTimeSlotCount(group);
            if (countInput) countInput.value = String(count);
            if (decreaseBtn) decreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = false;
        }

        function setFixedTimeSlotCount(value, options = {}) {
            const { persist = true, rerender = true, showBoundaryToast = false } = options;
            const group = dep.getCurrentGroup();
            if (!group) return false;
            dep.ensureGroupFixedTimes(group);

            const parsed = parseInt(value, 10);
            const nextCount = dep.sanitizeFixedTimeSlotCount(value);
            if (showBoundaryToast && Number.isFinite(parsed)) {
                if (parsed > getMaxSlotCount()) {
                    dep.showToast(dep.t("toast_fixed_time_max"), { type: "info" });
                } else if (parsed < getMinSlotCount()) {
                    dep.showToast(dep.t("toast_fixed_time_min"), { type: "info" });
                }
            }

            const currentCount = getFixedTimeSlotCount(group);
            if (nextCount === currentCount) {
                refreshFixedTimeSlotCountControls();
                if (rerender && dep.isFixedTimeTab()) {
                    dep.renderFixedTimeTab();
                    dep.renderTimelineFrame();
                }
                if (persist) dep.savePersistence();
                return false;
            }

            if (nextCount < currentCount) {
                group.fixedTimes = group.fixedTimes.slice(0, nextCount);
            } else {
                while (group.fixedTimes.length < nextCount) {
                    const nextId = dep.createUniqueFixedTimeId(group);
                    group.fixedTimes.push(dep.createDefaultFixedTimeSlot(nextId));
                }
            }
            dep.ensureGroupFixedTimes(group);
            refreshFixedTimeSlotCountControls();
            if (rerender && dep.isFixedTimeTab()) {
                dep.renderFixedTimeTab();
                dep.renderTimelineFrame();
            }
            if (persist) dep.savePersistence();
            return true;
        }

        return Object.freeze({
            getFixedTimeSlotCount,
            setCurrentGroupFixedDate,
            getCurrentGroupFixedTimeShowLiveNow,
            setCurrentGroupFixedTimeShowLiveNow,
            refreshFixedTimeSlotCountControls,
            setFixedTimeSlotCount
        });
    }

    globalObj.GTVFixedTimeState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
