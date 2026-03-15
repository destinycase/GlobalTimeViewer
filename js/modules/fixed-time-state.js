(function initGtvFixedTimeState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getMinSlotCount() {
            const parsed = Number(safeDeps.MIN_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getMaxSlotCount() {
            const parsed = Number(safeDeps.MAX_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(getMinSlotCount(), Math.trunc(parsed)) : 5;
        }

        function getFixedTimeSlotCount(group = invokeDep("getCurrentGroup")) {
            const safeGroup = (group && typeof group === "object") ? group : null;
            if (!safeGroup) return getMinSlotCount();
            invokeDep("ensureGroupFixedTimes", safeGroup);
            const sanitizeCount = invokeDep("sanitizeFixedTimeSlotCount", safeGroup.fixedTimes?.length);
            return Number.isFinite(sanitizeCount) ? sanitizeCount : getMinSlotCount();
        }

        function setCurrentGroupFixedDate(rawValue, options = {}) {
            const { persist = true, rerender = true } = options;
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
            const nextDate = invokeDep("sanitizeFixedDateValue", rawValue, group.fixedDate || "");
            if (group.fixedDate === nextDate) return false;
            group.fixedDate = nextDate;
            if (rerender && invokeDep("isFixedTimeTab")) {
                invokeDep("renderFixedTimeTab");
                invokeDep("renderTimelineFrame");
            }
            if (persist) invokeDep("savePersistence");
            return true;
        }

        function refreshFixedTimeSlotCountControls() {
            const group = invokeDep("getCurrentGroup");
            const countInput = document.getElementById("fixed-time-slot-count-input");
            const decreaseBtn = document.getElementById("fixed-time-slot-count-decrease");
            const increaseBtn = document.getElementById("fixed-time-slot-count-increase");
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
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);

            const parsed = parseInt(value, 10);
            const nextCount = invokeDep("sanitizeFixedTimeSlotCount", value);
            if (showBoundaryToast && Number.isFinite(parsed)) {
                if (parsed > getMaxSlotCount()) {
                    invokeDep("showToast", invokeDep("t", "toast_fixed_time_max"), { type: "info" });
                } else if (parsed < getMinSlotCount()) {
                    invokeDep("showToast", invokeDep("t", "toast_fixed_time_min"), { type: "info" });
                }
            }

            const currentCount = getFixedTimeSlotCount(group);
            if (nextCount === currentCount) {
                refreshFixedTimeSlotCountControls();
                if (rerender && invokeDep("isFixedTimeTab")) {
                    invokeDep("renderFixedTimeTab");
                    invokeDep("renderTimelineFrame");
                }
                if (persist) invokeDep("savePersistence");
                return false;
            }

            if (nextCount < currentCount) {
                group.fixedTimes = group.fixedTimes.slice(0, nextCount);
            } else {
                while (group.fixedTimes.length < nextCount) {
                    const nextId = invokeDep("createUniqueFixedTimeId", group);
                    group.fixedTimes.push(invokeDep("createDefaultFixedTimeSlot", nextId));
                }
            }
            invokeDep("ensureGroupFixedTimes", group);
            refreshFixedTimeSlotCountControls();
            if (rerender && invokeDep("isFixedTimeTab")) {
                invokeDep("renderFixedTimeTab");
                invokeDep("renderTimelineFrame");
            }
            if (persist) invokeDep("savePersistence");
            return true;
        }

        return Object.freeze({
            getFixedTimeSlotCount,
            setCurrentGroupFixedDate,
            refreshFixedTimeSlotCountControls,
            setFixedTimeSlotCount
        });
    }

    globalObj.GTVFixedTimeState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
