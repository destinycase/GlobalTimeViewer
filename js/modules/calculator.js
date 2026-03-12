(function initGtvCalculator(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    let countdownState = [];
    let countdownTimerId = null;
    let unixTimerId = null;

    function pad2(value) {
        return String(Math.max(0, Math.trunc(value))).padStart(2, "0");
    }

    function toValidDate(value) {
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatDateOnly(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        return `${year}-${month}-${day}`;
    }

    function formatDateTimeForInput(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        const hour = pad2(dateObj.getHours());
        const minute = pad2(dateObj.getMinutes());
        const second = pad2(dateObj.getSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    function formatLocalDateTime(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        const hour = pad2(dateObj.getHours());
        const minute = pad2(dateObj.getMinutes());
        const second = pad2(dateObj.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    function formatUTCDateTime(dateObj) {
        const year = dateObj.getUTCFullYear();
        const month = pad2(dateObj.getUTCMonth() + 1);
        const day = pad2(dateObj.getUTCDate());
        const hour = pad2(dateObj.getUTCHours());
        const minute = pad2(dateObj.getUTCMinutes());
        const second = pad2(dateObj.getUTCSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    function initConverter() {
        const secIn = document.getElementById("conv-sec");
        const minIn = document.getElementById("conv-min");
        const hourIn = document.getElementById("conv-hour");
        const dayIn = document.getElementById("conv-day");
        if (!secIn || !minIn || !hourIn || !dayIn) return;

        const allInputs = [secIn, minIn, hourIn, dayIn];

        const updateFrom = (rawValue, unit) => {
            const numericValue = Number(rawValue);
            if (rawValue === "" || Number.isNaN(numericValue)) {
                allInputs.forEach((input) => {
                    input.value = "";
                });
                return;
            }

            let baseSec = 0;
            if (unit === "sec") baseSec = numericValue;
            if (unit === "min") baseSec = numericValue * 60;
            if (unit === "hour") baseSec = numericValue * 3600;
            if (unit === "day") baseSec = numericValue * 86400;

            if (unit !== "sec") secIn.value = String(Number(baseSec.toFixed(4)));
            if (unit !== "min") minIn.value = String(Number((baseSec / 60).toFixed(4)));
            if (unit !== "hour") hourIn.value = String(Number((baseSec / 3600).toFixed(4)));
            if (unit !== "day") dayIn.value = String(Number((baseSec / 86400).toFixed(4)));
        };

        secIn.oninput = (e) => updateFrom(e.target.value, "sec");
        minIn.oninput = (e) => updateFrom(e.target.value, "min");
        hourIn.oninput = (e) => updateFrom(e.target.value, "hour");
        dayIn.oninput = (e) => updateFrom(e.target.value, "day");
    }

    function bindCopyButtons(copyText, copyBindings) {
        copyBindings.forEach(([btnId, targetId, isInput]) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.addEventListener("click", () => copyText(targetId, isInput));
        });
    }

    function buildCountdownDefaultName(slotIdx, t) {
        const prefix = (t("calc_countdown_default_prefix") || "Countdown").trim() || "Countdown";
        return `${prefix} ${slotIdx + 1}`;
    }

    function loadCountdownState() {
        try {
            const raw = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function saveCountdownState() {
        try {
            localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(countdownState));
        } catch (err) {
            // Ignore storage errors for calculator-only helper state.
        }
    }

    function normalizeCountdownState(persisted, t) {
        const base = Array.isArray(persisted) ? persisted : [];
        const next = [];
        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            const source = base[i] || {};
            const hasCustomName = !!source.nameIsCustom;
            const fallbackName = buildCountdownDefaultName(i, t);
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

    function parseCountdownRemainingMs(slot, nowMs) {
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

    function formatCountdownText(remainingMs, t) {
        const clampedMs = Math.max(0, Math.floor(remainingMs));
        const totalSeconds = Math.floor(clampedMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const daySuffix = t("calc_countdown_day_suffix") || "d";
        return `${pad2(days)}${daySuffix} ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    }

    function renderCountdownSlot(slotIdx, refs, t, options = {}) {
        const { syncMeta = false } = options;
        const slot = countdownState[slotIdx];
        const nameBtn = refs.nameButtons[slotIdx];
        const nameInput = refs.nameInputs[slotIdx];
        const toggleBtn = refs.toggleButtons[slotIdx];
        const targetInput = refs.targetInputs[slotIdx];
        const displayEl = refs.displayEls[slotIdx];
        const statusEl = refs.statusEls[slotIdx];
        if (!slot || !nameBtn || !nameInput || !toggleBtn || !targetInput || !displayEl || !statusEl) return;

        if (syncMeta) {
            if (!slot.nameIsCustom) {
                slot.name = buildCountdownDefaultName(slotIdx, t);
            }
            nameBtn.textContent = slot.name;
            if (nameInput.style.display === "none") {
                nameInput.value = slot.name;
            }

            if (window.CustomDatePicker && !targetInput._cdp) {
                targetInput._cdp = new CustomDatePicker(targetInput, {
                    type: "datetime",
                    lang: document.documentElement.lang || "en",
                    theme: document.documentElement.getAttribute("data-theme") || "dark",
                    triggerElement: document.querySelector(`.trigger-cd-${slotIdx}`) || null
                });
            }

            if (slot.targetIso) {
                const targetDate = toValidDate(slot.targetIso);
                if (targetInput._cdp) {
                    if (targetDate) targetInput._cdp.setDate(targetDate);
                    else targetInput._cdp.setDate(null);
                } else {
                    targetInput.value = targetDate ? formatDateTimeForInput(targetDate) : "";
                }
            } else {
                if (targetInput._cdp) targetInput._cdp.setDate(null);
                else targetInput.value = "";
            }
        }

        const nowMs = Date.now();
        let remainingMs = parseCountdownRemainingMs(slot, nowMs);
        let expired = false;

        if (slot.active && Number.isFinite(remainingMs) && remainingMs <= 0) {
            slot.active = false;
            slot.pausedRemainingMs = 0;
            remainingMs = 0;
            expired = true;
            saveCountdownState();
        }

        if (!Number.isFinite(remainingMs)) {
            toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
            displayEl.textContent = formatCountdownText(0, t);
            displayEl.classList.remove("expired");
            statusEl.textContent = "";
            statusEl.classList.remove("expired");
            return;
        }

        displayEl.textContent = formatCountdownText(remainingMs, t);
        if (expired || (!slot.active && remainingMs === 0 && !!slot.targetIso)) {
            displayEl.classList.add("expired");
            statusEl.classList.add("expired");
            statusEl.textContent = t("calc_countdown_expired");
        } else {
            displayEl.classList.remove("expired");
            statusEl.classList.remove("expired");
            statusEl.textContent = "";
        }
        toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
    }

    function initCountdown(t) {
        const nameButtons = Array.from(document.querySelectorAll(".countdown-name-btn"));
        const nameInputs = Array.from(document.querySelectorAll(".countdown-name-input"));
        const toggleButtons = Array.from(document.querySelectorAll(".countdown-toggle-btn"));
        const targetInputs = Array.from(document.querySelectorAll(".countdown-target-input"));
        const displayEls = Array.from(document.querySelectorAll(".countdown-display"));
        const statusEls = Array.from(document.querySelectorAll(".countdown-status"));
        if (
            nameButtons.length < COUNTDOWN_SLOT_COUNT ||
            nameInputs.length < COUNTDOWN_SLOT_COUNT ||
            toggleButtons.length < COUNTDOWN_SLOT_COUNT ||
            targetInputs.length < COUNTDOWN_SLOT_COUNT ||
            displayEls.length < COUNTDOWN_SLOT_COUNT ||
            statusEls.length < COUNTDOWN_SLOT_COUNT
        ) {
            return { refresh: () => { } };
        }

        countdownState = normalizeCountdownState(loadCountdownState(), t);
        const refs = { nameButtons, nameInputs, toggleButtons, targetInputs, displayEls, statusEls };

        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            const nameBtn = nameButtons[i];
            const nameInput = nameInputs[i];
            const targetInput = targetInputs[i];

            const closeNameEditor = (commit) => {
                if (nameInput.style.display === "none") return;

                if (commit) {
                    const trimmed = String(nameInput.value || "").trim();
                    if (!trimmed) {
                        countdownState[i].name = buildCountdownDefaultName(i, t);
                        countdownState[i].nameIsCustom = false;
                    } else {
                        countdownState[i].name = trimmed;
                        countdownState[i].nameIsCustom = true;
                    }
                    saveCountdownState();
                }

                nameInput.style.display = "none";
                nameBtn.style.display = "inline-flex";
                renderCountdownSlot(i, refs, t, { syncMeta: true });
            };

            nameBtn.addEventListener("click", () => {
                nameInput.value = countdownState[i].name || buildCountdownDefaultName(i, t);
                nameBtn.style.display = "none";
                nameInput.style.display = "block";
                nameInput.focus();
                nameInput.select();
            });

            nameInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    closeNameEditor(true);
                    nameInput.blur();
                    return;
                }
                if (event.key === "Escape") {
                    event.preventDefault();
                    closeNameEditor(false);
                    nameInput.blur();
                }
            });

            nameInput.addEventListener("blur", () => {
                closeNameEditor(true);
            });

            targetInput.addEventListener("change", () => {
                const parsed = targetInput._cdp && targetInput._cdp.selectedDate ? new Date(targetInput._cdp.selectedDate) : toValidDate(targetInput.value);
                if (!parsed) {
                    countdownState[i].targetIso = "";
                    countdownState[i].active = false;
                    countdownState[i].pausedRemainingMs = null;
                } else {
                    countdownState[i].targetIso = parsed.toISOString();
                    countdownState[i].pausedRemainingMs = null;
                    if (!countdownState[i].active) {
                        const nowMs = Date.now();
                        countdownState[i].pausedRemainingMs = Math.max(0, parsed.getTime() - nowMs);
                    }
                }
                renderCountdownSlot(i, refs, t, { syncMeta: true });
                saveCountdownState();
            });
        }

        document.querySelectorAll(".countdown-slot-controls .sm-btn[data-action]").forEach((btn) => {
            const slotIdx = Number(btn.getAttribute("data-slot"));
            const action = btn.getAttribute("data-action");
            if (!Number.isInteger(slotIdx) || slotIdx < 0 || slotIdx >= COUNTDOWN_SLOT_COUNT) return;
            const targetInput = targetInputs[slotIdx];

            btn.addEventListener("click", () => {
                const slot = countdownState[slotIdx];
                if (!slot) return;

                if (action === "toggle") {
                    if (slot.active) {
                        const remainingMs = parseCountdownRemainingMs(slot, Date.now());
                        slot.active = false;
                        slot.pausedRemainingMs = Number.isFinite(remainingMs)
                            ? Math.max(0, Math.floor(remainingMs))
                            : null;
                    } else {
                        const parsed = toValidDate(targetInput.value) || toValidDate(slot.targetIso);
                        if (!parsed) return;
                        slot.targetIso = parsed.toISOString();
                        slot.active = true;
                        slot.pausedRemainingMs = null;
                    }
                } else if (action === "reset") {
                    slot.targetIso = "";
                    slot.active = false;
                    slot.pausedRemainingMs = null;
                    targetInput.value = "";
                }

                renderCountdownSlot(slotIdx, refs, t, { syncMeta: true });
                saveCountdownState();
            });
        });

        if (countdownTimerId != null) {
            clearInterval(countdownTimerId);
            countdownTimerId = null;
        }
        countdownTimerId = setInterval(() => {
            for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                renderCountdownSlot(i, refs, t);
            }
        }, 1000);

        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            renderCountdownSlot(i, refs, t, { syncMeta: true });
        }

        return {
            refresh() {
                for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                    renderCountdownSlot(i, refs, t, { syncMeta: true });
                }
            }
        };
    }

    function initUnixTimestampConverter(t) {
        const unixNowValue = document.getElementById("unix-now-value");
        const unixSyncNowBtn = document.getElementById("unix-sync-now-btn");
        const unixTsInput = document.getElementById("unix-ts-input");
        const unixTsDateOut = document.getElementById("unix-ts-date-out");
        const unixDateInput = document.getElementById("unix-date-input");
        const unixDateTsOut = document.getElementById("unix-date-ts-out");

        if (!unixNowValue || !unixTsInput || !unixTsDateOut || !unixDateInput || !unixDateTsOut) {
            return { refresh: () => { } };
        }

        if (window.CustomDatePicker && !unixDateInput._cdp) {
            unixDateInput._cdp = new CustomDatePicker(unixDateInput, {
                type: "datetime",
                lang: document.documentElement.lang || "en",
                theme: document.documentElement.getAttribute("data-theme") || "dark",
                triggerElement: document.getElementById("unix-date-input-trigger") || null
            });
        }

        const updateNow = () => {
            unixNowValue.textContent = String(Math.floor(Date.now() / 1000));
        };

        const updateFromTimestamp = () => {
            const raw = String(unixTsInput.value || "").trim();
            if (!raw) {
                unixTsDateOut.textContent = "-";
                return;
            }

            const sec = Number(raw);
            if (!Number.isFinite(sec)) {
                unixTsDateOut.textContent = t("calc_unix_invalid");
                return;
            }

            const dateObj = new Date(sec * 1000);
            if (Number.isNaN(dateObj.getTime())) {
                unixTsDateOut.textContent = t("calc_unix_invalid");
                return;
            }
            unixTsDateOut.textContent = formatUTCDateTime(dateObj);
        };

        const updateFromDate = () => {
            const parsed = unixDateInput._cdp && unixDateInput._cdp.selectedDate ? new Date(unixDateInput._cdp.selectedDate) : toValidDate(unixDateInput.value);
            if (!parsed) {
                unixDateTsOut.textContent = "-";
                return;
            }
            unixDateTsOut.textContent = String(Math.floor(parsed.getTime() / 1000));
        };

        const syncNow = () => {
            const nowDate = new Date();
            unixTsInput.value = String(Math.floor(nowDate.getTime() / 1000));
            unixDateInput.value = formatUTCDateTime(nowDate);
            updateFromTimestamp();
            updateFromDate();
        };

        unixTsInput.addEventListener("input", updateFromTimestamp);
        unixTsInput.addEventListener("change", updateFromTimestamp);
        unixDateInput.addEventListener("input", updateFromDate);
        unixDateInput.addEventListener("change", updateFromDate);
        if (unixSyncNowBtn) unixSyncNowBtn.addEventListener("click", syncNow);

        if (unixTimerId != null) {
            clearInterval(unixTimerId);
            unixTimerId = null;
        }
        unixTimerId = setInterval(updateNow, 1000);

        updateNow();
        updateFromTimestamp();
        updateFromDate();

        return {
            refresh() {
                updateNow();
                updateFromTimestamp();
                updateFromDate();
            }
        };
    }

    function initPeriodAndDateShift(t) {
        const periodStart = document.getElementById("period-start");
        const periodEnd = document.getElementById("period-end");
        const periodSwapBtn = document.getElementById("period-swap-btn");
        const periodDayRes = document.getElementById("period-res");
        const periodHourRes = document.getElementById("period-hour-res");
        const periodMinRes = document.getElementById("period-min-res");
        const periodSecRes = document.getElementById("period-sec-res");

        const offsetStart = document.getElementById("offset-start");
        const offsetValueInput = document.getElementById("off-val");
        const offValMinus = document.getElementById("off-val-minus");
        const offValPlus = document.getElementById("off-val-plus");
        const offsetUnit = document.getElementById("off-unit");
        const offsetDirection = document.getElementById("off-dir");
        const offsetResult = document.getElementById("offset-res");

        if (
            !periodStart || !periodEnd || !periodDayRes || !periodHourRes || !periodMinRes || !periodSecRes ||
            !offsetStart || !offsetValueInput || !offsetUnit || !offsetDirection || !offsetResult
        ) {
            return { refresh: () => { } };
        }

        const applyPicker = (el, iconId) => {
            if (window.CustomDatePicker && !el._cdp) {
                el._cdp = new CustomDatePicker(el, {
                    type: "date",
                    lang: document.documentElement.lang || "en",
                    theme: document.documentElement.getAttribute("data-theme") || "dark",
                    triggerElement: document.getElementById(iconId) || null
                });
            }
        };

        applyPicker(periodStart, "period-start-trigger");
        applyPicker(periodEnd, "period-end-trigger");
        applyPicker(offsetStart, "offset-start-trigger");

        const today = new Date();
        const todayText = formatDateOnly(today);
        if (!periodStart.value) periodStart.value = todayText;
        if (!periodEnd.value) periodEnd.value = todayText;
        if (!offsetStart.value) offsetStart.value = todayText;
        if (!offsetValueInput.value) offsetValueInput.value = "1";
        if (!offsetUnit.value) offsetUnit.value = "day";
        if (!offsetDirection.value) offsetDirection.value = "after";

        const setPeriodResult = (el, value) => {
            el.textContent = `${value}`;
        };

        const getPickerDate = (el) => {
            if (el._cdp && el._cdp.selectedDate) return new Date(el._cdp.selectedDate);
            if (el.value) return new Date(el.value + 'T00:00:00');
            return null;
        };

        const updateAll = () => {
            const startD = getPickerDate(periodStart);
            const endD = getPickerDate(periodEnd);

            if (startD && endD) {
                const diffMs = endD.getTime() - startD.getTime();
                setPeriodResult(periodDayRes, Math.round(diffMs / 86400000));
                setPeriodResult(periodHourRes, Math.round(diffMs / 3600000));
                setPeriodResult(periodMinRes, Math.round(diffMs / 60000));
                setPeriodResult(periodSecRes, Math.round(diffMs / 1000));
            } else {
                setPeriodResult(periodDayRes, 0);
                setPeriodResult(periodHourRes, 0);
                setPeriodResult(periodMinRes, 0);
                setPeriodResult(periodSecRes, 0);
            }

            const offStartD = getPickerDate(offsetStart);
            if (!offStartD) {
                offsetResult.value = "-";
                return;
            }

            const resultDate = new Date(offStartD.getTime());
            const offsetValue = parseInt(offsetValueInput.value, 10) || 0;
            const directionMultiplier = offsetDirection.value === "before" ? -1 : 1;
            const actualShift = offsetValue * directionMultiplier;

            if (offsetUnit.value === "day") resultDate.setDate(resultDate.getDate() + actualShift);
            if (offsetUnit.value === "week") resultDate.setDate(resultDate.getDate() + (actualShift * 7));
            if (offsetUnit.value === "month") resultDate.setMonth(resultDate.getMonth() + actualShift);
            if (offsetUnit.value === "year") resultDate.setFullYear(resultDate.getFullYear() + actualShift);

            offsetResult.value = formatLocalDateTime(resultDate);
        };

        [periodStart, periodEnd, offsetStart, offsetValueInput, offsetUnit, offsetDirection].forEach((el) => {
            el.addEventListener("input", updateAll);
            el.addEventListener("change", updateAll);
        });

        if (offValMinus && offValPlus) {
            offValMinus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v > 1) {
                    offsetValueInput.value = v - 1;
                    updateAll();
                }
            });
            offValPlus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 0;
                offsetValueInput.value = v + 1;
                updateAll();
            });
            offsetValueInput.addEventListener("input", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v < 1) {
                    offsetValueInput.value = 1;
                    updateAll();
                }
            });
        }

        if (periodSwapBtn) {
            periodSwapBtn.addEventListener("click", () => {
                const startValue = periodStart.value;
                periodStart.value = periodEnd.value;
                periodEnd.value = startValue;
                updateAll();
            });
        }

        updateAll();
        return { refresh: updateAll };
    }

    function initCalculators(options = {}) {
        const t = (typeof options.t === "function") ? options.t : ((key) => key);
        const copyText = (typeof options.copyText === "function")
            ? options.copyText
            : (async () => { });

        const periodAndShift = initPeriodAndDateShift(t);
        const countdown = initCountdown(t);
        const unixConverter = initUnixTimestampConverter(t);
        initConverter();

        bindCopyButtons(copyText, [
            ["copy-conv-day-btn", "conv-day", true],
            ["copy-conv-hour-btn", "conv-hour", true],
            ["copy-conv-min-btn", "conv-min", true],
            ["copy-conv-sec-btn", "conv-sec", true],
            ["copy-period-res-btn", "period-res", false],
            ["copy-period-hour-res-btn", "period-hour-res", false],
            ["copy-period-min-res-btn", "period-min-res", false],
            ["copy-period-sec-res-btn", "period-sec-res", false],
            ["copy-offset-res-btn", "offset-res", true],
            ["copy-unix-now-btn", "unix-now-value", false],
            ["copy-unix-ts-date-btn", "unix-ts-date-out", false],
            ["copy-unix-date-ts-btn", "unix-date-ts-out", false]
        ]);

        if (typeof globalObj !== "undefined") {
            globalObj.__gtvCalcRefresh = () => {
                periodAndShift.refresh();
                countdown.refresh();
                unixConverter.refresh();

                const currentLang = document.documentElement.lang || "en";
                const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
                document.querySelectorAll(".custom-date-picker-input").forEach(el => {
                    if (el._cdp) {
                        el._cdp.setLang(currentLang);
                        el._cdp.setTheme(currentTheme);
                    }
                });
            };
        }
    }

    globalObj.GTVCalculator = Object.freeze({
        initCalculators
    });
})(typeof window !== "undefined" ? window : globalThis);
