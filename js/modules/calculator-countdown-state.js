(function initGtvCalculatorCountdownState(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    function buildDefaultName(slotIdx, t) {
        const prefix = (t("calc_countdown_default_prefix") || "Countdown").trim() || "Countdown";
        return `${prefix} ${slotIdx + 1}`;
    }

    function normalizeState(persisted, t) {
        const base = Array.isArray(persisted) ? persisted : [];
        const next = [];
        for (let index = 0; index < COUNTDOWN_SLOT_COUNT; index++) {
            const source = base[index] || {};
            const hasCustomName = !!source.nameIsCustom;
            const fallbackName = buildDefaultName(index, t);
            const rawName = (typeof source.name === "string") ? source.name.trim() : "";
            next.push({
                name: rawName || fallbackName,
                nameIsCustom: hasCustomName && !!rawName,
                targetIso: (typeof source.targetIso === "string") ? source.targetIso : "",
                active: !!source.active,
                pausedRemainingMs: Number.isFinite(source.pausedRemainingMs)
                    ? Math.max(0, Math.floor(source.pausedRemainingMs))
                    : null
            });
        }
        return next;
    }

    function parseRemainingMs(slot, nowMs) {
        if (!slot) return null;
        if (slot.active && slot.targetIso) {
            const targetMs = Date.parse(slot.targetIso);
            if (!Number.isFinite(targetMs)) return null;
            return targetMs - nowMs;
        }
        if (Number.isFinite(slot.pausedRemainingMs)) return slot.pausedRemainingMs;
        if (slot.targetIso) {
            const targetMs = Date.parse(slot.targetIso);
            if (!Number.isFinite(targetMs)) return null;
            return Math.max(0, targetMs - nowMs);
        }
        return null;
    }

    function formatRemainingText(remainingMs, t, padFn = defaultPad2) {
        const clampedMs = Math.max(0, Math.floor(remainingMs));
        const totalSeconds = Math.floor(clampedMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const daySuffix = t("calc_countdown_day_suffix") || "d";
        return `${padFn(days)}${daySuffix} ${padFn(hours)}:${padFn(minutes)}:${padFn(seconds)}`;
    }

    function defaultPad2(value) {
        return String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0");
    }

    function createService() {
        return Object.freeze({
            slotCount: COUNTDOWN_SLOT_COUNT,
            storageKey: COUNTDOWN_STORAGE_KEY,
            buildDefaultName,
            normalizeState,
            parseRemainingMs,
            formatRemainingText
        });
    }

    const defaultService = createService();
    globalObj.GTVCalculatorCountdownState = Object.freeze({
        createService,
        ...defaultService
    });
})(typeof window !== "undefined" ? window : globalThis);
