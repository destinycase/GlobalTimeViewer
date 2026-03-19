(function initGtvCalculator(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    let countdownState = [];
    let countdownTimerId = null;
    let unixTimerId = null;

    const GTV_TIME_CORE = globalObj?.GTVTimeCore || null;
    const LuxonDateTime = globalObj?.luxon?.DateTime || null;
    const storage = globalObj?.localStorage || (typeof localStorage !== "undefined" ? localStorage : null);
    const doc = globalObj?.document || (typeof document !== "undefined" ? document : null);
    const pad2 = (typeof GTV_TIME_CORE?.pad === "function")
        ? GTV_TIME_CORE.pad
        : ((value) => String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0"));

    function getElementById(id) {
        if (!doc || typeof doc.getElementById !== "function") return null;
        return doc.getElementById(id);
    }

    function querySelector(selector) {
        if (!doc || typeof doc.querySelector !== "function") return null;
        return doc.querySelector(selector);
    }

    function querySelectorAll(selector) {
        if (!doc || typeof doc.querySelectorAll !== "function") return [];
        return Array.from(doc.querySelectorAll(selector) || []);
    }

    function getCurrentLang() {
        const lang = doc?.documentElement?.lang;
        return (typeof lang === "string" && lang.trim()) ? lang : "en";
    }

    function getCurrentTheme() {
        const theme = doc?.documentElement?.getAttribute?.("data-theme");
        return (typeof theme === "string" && theme.trim()) ? theme : "dark";
    }

    function isCalculatorTabActive() {
        const calcSection = getElementById("calc-section");
        if (!calcSection?.classList || typeof calcSection.classList.contains !== "function") {
            return true;
        }
        return calcSection.classList.contains("active");
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

    function formatUTCDateOnlyStartOfDay(dateObj) {
        const year = dateObj.getUTCFullYear();
        const month = pad2(dateObj.getUTCMonth() + 1);
        const day = pad2(dateObj.getUTCDate());
        return `${year}-${month}-${day} 00:00:00`;
    }

    function initConverter() {
        const secIn = getElementById("conv-sec");
        const minIn = getElementById("conv-min");
        const hourIn = getElementById("conv-hour");
        const dayIn = getElementById("conv-day");
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
        if (!Array.isArray(copyBindings)) return;
        copyBindings.forEach(([btnId, targetId, isInput]) => {
            const btn = getElementById(btnId);
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
            if (!storage || typeof storage.getItem !== "function") return null;
            const raw = storage.getItem(COUNTDOWN_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function saveCountdownState() {
        try {
            if (!storage || typeof storage.setItem !== "function") return;
            storage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(countdownState));
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

            const DatePickerCtor = globalObj?.CustomDatePicker;
            if (typeof DatePickerCtor === "function" && !targetInput._cdp) {
                targetInput._cdp = new DatePickerCtor(targetInput, {
                    type: "datetime",
                    lang: getCurrentLang(),
                    theme: getCurrentTheme(),
                    triggerElement: querySelector(`.trigger-cd-${slotIdx}`) || null
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
        const nameButtons = querySelectorAll(".countdown-name-btn");
        const nameInputs = querySelectorAll(".countdown-name-input");
        const toggleButtons = querySelectorAll(".countdown-toggle-btn");
        const targetInputs = querySelectorAll(".countdown-target-input");
        const displayEls = querySelectorAll(".countdown-display");
        const statusEls = querySelectorAll(".countdown-status");
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

        querySelectorAll(".countdown-slot-controls .sm-btn[data-action]").forEach((btn) => {
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
            if (!isCalculatorTabActive()) return;
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
        const unixNowValue = getElementById("unix-now-value");
        const unixNowMsValue = getElementById("unix-now-ms-value");
        const unixSyncNowBtn = getElementById("unix-sync-now-btn");
        const unixTsInput = getElementById("unix-ts-input");
        const unixTsMsInput = getElementById("unix-ts-ms-input");
        const unixIsoLocalInput = getElementById("unix-iso-local-input");
        const unixIsoUtcInput = getElementById("unix-iso-utc-input");
        const unixRfc2822Input = getElementById("unix-rfc2822-input");
        const unixSqlInput = getElementById("unix-sql-input");
        const unixHumanInput = getElementById("unix-human-input");
        const smartFormatRows = querySelectorAll(".smart-format-row");

        if (
            !unixNowValue || !unixNowMsValue || !unixTsInput || !unixTsMsInput ||
            !unixIsoLocalInput || !unixIsoUtcInput || !unixRfc2822Input || !unixSqlInput || !unixHumanInput
        ) {
            return { refresh: () => { } };
        }

        const editableFields = [
            { key: "unix_sec", el: unixTsInput },
            { key: "unix_ms", el: unixTsMsInput },
            { key: "iso_local", el: unixIsoLocalInput },
            { key: "iso_utc", el: unixIsoUtcInput },
            { key: "rfc2822", el: unixRfc2822Input },
            { key: "sql", el: unixSqlInput }
        ];

        let activeEpochMs = Date.now();
        let hasValidEpoch = true;
        let isSyncing = false;

        const setRowsInvalid = (invalid) => {
            smartFormatRows.forEach((row) => {
                if (!row || !row.classList) return;
                if (invalid) row.classList.add("is-invalid");
                else row.classList.remove("is-invalid");
            });
        };

        const formatIsoLocalWithOffset = (dateObj) => {
            const year = dateObj.getFullYear();
            const month = pad2(dateObj.getMonth() + 1);
            const day = pad2(dateObj.getDate());
            const hour = pad2(dateObj.getHours());
            const minute = pad2(dateObj.getMinutes());
            const second = pad2(dateObj.getSeconds());
            const totalOffsetMinutes = -dateObj.getTimezoneOffset();
            const sign = totalOffsetMinutes >= 0 ? "+" : "-";
            const absOffset = Math.abs(totalOffsetMinutes);
            const offsetHour = pad2(Math.floor(absOffset / 60));
            const offsetMinute = pad2(absOffset % 60);
            return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
        };

        const buildFieldValues = (epochMs) => {
            const safeEpochMs = Math.trunc(Number(epochMs));
            if (!Number.isFinite(safeEpochMs)) return null;

            if (LuxonDateTime && typeof LuxonDateTime.fromMillis === "function") {
                const utc = LuxonDateTime.fromMillis(safeEpochMs, { zone: "utc" });
                if (!utc.isValid) return null;
                const local = utc.toLocal().setLocale(getCurrentLang());
                return {
                    unixSec: String(Math.floor(safeEpochMs / 1000)),
                    unixMs: String(safeEpochMs),
                    isoLocal: local.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    isoUtc: utc.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    rfc2822: local.toRFC2822() || "",
                    sql: local.toFormat("yyyy-LL-dd HH:mm:ss"),
                    human: local.toLocaleString(LuxonDateTime.DATETIME_FULL_WITH_SECONDS)
                };
            }

            const dateObj = new Date(safeEpochMs);
            if (Number.isNaN(dateObj.getTime())) return null;
            const locale = getCurrentLang() === "ko" ? "ko-KR" : "en-US";
            return {
                unixSec: String(Math.floor(safeEpochMs / 1000)),
                unixMs: String(safeEpochMs),
                isoLocal: formatIsoLocalWithOffset(dateObj),
                isoUtc: formatUTCDateTime(dateObj),
                rfc2822: dateObj.toUTCString(),
                sql: formatLocalDateTime(dateObj),
                human: dateObj.toLocaleString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    weekday: "short"
                })
            };
        };

        const setFieldValues = (values) => {
            if (!values) return;
            isSyncing = true;
            unixTsInput.value = values.unixSec;
            unixTsMsInput.value = values.unixMs;
            unixIsoLocalInput.value = values.isoLocal;
            unixIsoUtcInput.value = values.isoUtc;
            unixRfc2822Input.value = values.rfc2822;
            unixSqlInput.value = values.sql;
            unixHumanInput.value = values.human;
            isSyncing = false;
        };

        const renderInvalid = () => {
            hasValidEpoch = false;
            setRowsInvalid(true);
            const invalidText = t("calc_unix_invalid");
            setFieldValues({
                unixSec: invalidText,
                unixMs: invalidText,
                isoLocal: invalidText,
                isoUtc: invalidText,
                rfc2822: invalidText,
                sql: invalidText,
                human: invalidText
            });
        };

        const renderFromEpoch = (epochMs) => {
            const values = buildFieldValues(epochMs);
            if (!values) {
                renderInvalid();
                return;
            }
            hasValidEpoch = true;
            setRowsInvalid(false);
            setFieldValues(values);
        };

        const parseFieldValue = (key, value) => {
            const raw = String(value || "").trim();
            if (!raw) return null;

            if (key === "unix_sec") {
                const sec = Number(raw);
                return Number.isFinite(sec) ? Math.trunc(sec * 1000) : null;
            }
            if (key === "unix_ms") {
                const ms = Number(raw);
                return Number.isFinite(ms) ? Math.trunc(ms) : null;
            }

            if (LuxonDateTime) {
                let parsed = null;
                if (key === "iso_local") {
                    parsed = LuxonDateTime.fromISO(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromISO(raw, { zone: "local" });
                } else if (key === "iso_utc") {
                    parsed = LuxonDateTime.fromISO(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromISO(raw, { zone: "utc" });
                } else if (key === "rfc2822") {
                    parsed = LuxonDateTime.fromRFC2822(raw, { setZone: true });
                } else if (key === "sql") {
                    parsed = LuxonDateTime.fromSQL(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromFormat(raw, "yyyy-LL-dd HH:mm:ss", { zone: "local" });
                }
                if (parsed && parsed.isValid) return Math.trunc(parsed.toMillis());
            }

            if (key === "sql") {
                const sqlMatched = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
                if (sqlMatched) {
                    const asDate = new Date(
                        Number(sqlMatched[1]),
                        Number(sqlMatched[2]) - 1,
                        Number(sqlMatched[3]),
                        Number(sqlMatched[4]),
                        Number(sqlMatched[5]),
                        Number(sqlMatched[6])
                    );
                    if (!Number.isNaN(asDate.getTime())) return asDate.getTime();
                }
            }

            const fallbackDate = new Date(raw);
            return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate.getTime();
        };

        const handleFieldInput = (key, fieldEl) => {
            if (isSyncing || !fieldEl) return;
            const parsedMs = parseFieldValue(key, fieldEl.value);
            if (!Number.isFinite(parsedMs)) {
                renderInvalid();
                return;
            }
            activeEpochMs = Math.trunc(parsedMs);
            renderFromEpoch(activeEpochMs);
        };

        const updateNow = () => {
            if (!isCalculatorTabActive()) return;
            const nowMs = Date.now();
            unixNowValue.textContent = String(Math.floor(nowMs / 1000));
            unixNowMsValue.textContent = String(Math.trunc(nowMs));
        };

        const syncNow = () => {
            activeEpochMs = Date.now();
            renderFromEpoch(activeEpochMs);
            updateNow();
        };

        editableFields.forEach(({ key, el }) => {
            el.addEventListener("input", () => handleFieldInput(key, el));
            el.addEventListener("change", () => handleFieldInput(key, el));
        });
        if (unixSyncNowBtn) unixSyncNowBtn.addEventListener("click", syncNow);

        if (unixTimerId != null) {
            clearInterval(unixTimerId);
            unixTimerId = null;
        }
        unixTimerId = setInterval(updateNow, 1000);

        syncNow();

        return {
            refresh() {
                updateNow();
                if (hasValidEpoch) renderFromEpoch(activeEpochMs);
                else renderInvalid();
            }
        };
    }

    function initPeriodAndDateShift(t) {
        const periodStart = getElementById("period-start");
        const periodEnd = getElementById("period-end");
        const periodSwapBtn = getElementById("period-swap-btn");
        const periodDayRes = getElementById("period-res");
        const periodHourRes = getElementById("period-hour-res");
        const periodMinRes = getElementById("period-min-res");
        const periodSecRes = getElementById("period-sec-res");

        const offsetStart = getElementById("offset-start");
        const offsetValueInput = getElementById("off-val");
        const offValMinus = getElementById("off-val-minus");
        const offValPlus = getElementById("off-val-plus");
        const offsetUnit = getElementById("off-unit");
        const offsetDirection = getElementById("off-dir");
        const offsetResult = getElementById("offset-res");

        if (
            !periodStart || !periodEnd || !periodDayRes || !periodHourRes || !periodMinRes || !periodSecRes ||
            !offsetStart || !offsetValueInput || !offsetUnit || !offsetDirection || !offsetResult
        ) {
            return { refresh: () => { } };
        }

        const applyPicker = (el, iconId) => {
            const DatePickerCtor = globalObj?.CustomDatePicker;
            if (typeof DatePickerCtor === "function" && !el._cdp) {
                el._cdp = new DatePickerCtor(el, {
                    type: "date",
                    lang: getCurrentLang(),
                    theme: getCurrentTheme(),
                    triggerElement: getElementById(iconId) || null
                });
            }
        };

        applyPicker(periodStart, "period-start-trigger");
        applyPicker(periodEnd, "period-end-trigger");
        applyPicker(offsetStart, "offset-start-trigger");

        // 기간 계산용: UTC 자정으로 파싱 (DST 경계 오류 방지)
        const getPickerDateUtc = (el) => {
            let val = el.value;
            // CDP가 있으면 해당 날짜 객체에서 YYYY-MM-DD 정보만 추출
            if (el._cdp && el._cdp.selectedDate) {
                const d = new Date(el._cdp.selectedDate);
                val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            }

            if (val) {
                const parts = val.split("-");
                if (parts.length === 3) {
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10) - 1;
                    const d = parseInt(parts[2], 10);
                    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                        return new Date(Date.UTC(y, m, d));
                    }
                }
            }
            return null;
        };
        // Reuse UTC date parsing for both period and offset calculations.
        const today = new Date();
        const todayText = formatDateOnly(today);
        if (!periodStart.value) periodStart.value = todayText;
        if (!periodEnd.value) periodEnd.value = todayText;
        if (!offsetStart.value) offsetStart.value = todayText;
        if (!offsetValueInput.value) offsetValueInput.value = "1";
        if (!offsetUnit.value) offsetUnit.value = "day";
        if (!offsetDirection.value) offsetDirection.value = "after";

        const setPeriodResult = (el, value, suffix) => {
            el.textContent = `${value}${suffix || ""}`;
        };

        const updateAll = () => {
            const startD = getPickerDateUtc(periodStart);
            const endD = getPickerDateUtc(periodEnd);

            if (startD && endD) {
                // Math.trunc 사용: 시작일 > 종료일(음수) 시 Math.round가 오방향으로 반올림하는 버그 수정
                const diffMs = endD.getTime() - startD.getTime();
                setPeriodResult(periodDayRes, Math.trunc(diffMs / 86400000), t("unit_days_suffix"));
                setPeriodResult(periodHourRes, Math.trunc(diffMs / 3600000), t("unit_hours_suffix"));
                setPeriodResult(periodMinRes, Math.trunc(diffMs / 60000), t("unit_minutes_suffix"));
                setPeriodResult(periodSecRes, Math.trunc(diffMs / 1000), t("unit_seconds_suffix"));
            } else {
                setPeriodResult(periodDayRes, 0, t("unit_days_suffix"));
                setPeriodResult(periodHourRes, 0, t("unit_hours_suffix"));
                setPeriodResult(periodMinRes, 0, t("unit_minutes_suffix"));
                setPeriodResult(periodSecRes, 0, t("unit_seconds_suffix"));
            }


            const offStartD = getPickerDateUtc(offsetStart);
            if (!offStartD) {
                offsetResult.value = "-";
                return;
            }

            const resultDate = new Date(offStartD.getTime());
            const offsetValue = parseInt(offsetValueInput.value, 10) || 0;
            const directionMultiplier = offsetDirection.value === "before" ? -1 : 1;
            const actualShift = offsetValue * directionMultiplier;

            if (offsetUnit.value === "day") resultDate.setUTCDate(resultDate.getUTCDate() + actualShift);
            if (offsetUnit.value === "week") resultDate.setUTCDate(resultDate.getUTCDate() + (actualShift * 7));
            if (offsetUnit.value === "month") {
                const targetDay = resultDate.getUTCDate();
                resultDate.setUTCMonth(resultDate.getUTCMonth() + actualShift);
                if (resultDate.getUTCDate() !== targetDay) resultDate.setUTCDate(0);
            }
            if (offsetUnit.value === "year") {
                const targetDay = resultDate.getUTCDate();
                resultDate.setUTCFullYear(resultDate.getUTCFullYear() + actualShift);
                if (resultDate.getUTCDate() !== targetDay) resultDate.setUTCDate(0);
            }

            offsetResult.value = formatUTCDateOnlyStartOfDay(resultDate);
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
                // CDP 상태까지 고려한 Swap 로직 보완
                const startD = getPickerDateUtc(periodStart);
                const endD = getPickerDateUtc(periodEnd);

                if (startD && endD) {
                    // CDP가 있으면 setDate로 동기화, 없으면 value로 직접 교체
                    if (periodStart._cdp) periodStart._cdp.setDate(endD);
                    else periodStart.value = formatDateOnly(endD);

                    if (periodEnd._cdp) periodEnd._cdp.setDate(startD);
                    else periodEnd.value = formatDateOnly(startD);

                    updateAll();
                } else {
                    // 폴백: 값만 교체
                    const startValue = periodStart.value;
                    periodStart.value = periodEnd.value;
                    periodEnd.value = startValue;
                    updateAll();
                }
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
            ["copy-unix-now-ms-btn", "unix-now-ms-value", false],
            ["copy-unix-ts-btn", "unix-ts-input", true],
            ["copy-unix-ts-ms-btn", "unix-ts-ms-input", true],
            ["copy-unix-iso-local-btn", "unix-iso-local-input", true],
            ["copy-unix-iso-utc-btn", "unix-iso-utc-input", true],
            ["copy-unix-rfc2822-btn", "unix-rfc2822-input", true],
            ["copy-unix-sql-btn", "unix-sql-input", true],
            ["copy-unix-human-btn", "unix-human-input", true]
        ]);

        if (typeof globalObj !== "undefined") {
            globalObj.__gtvCalcRefresh = () => {
                periodAndShift.refresh();
                countdown.refresh();
                unixConverter.refresh();

                const currentLang = getCurrentLang();
                const currentTheme = getCurrentTheme();
                querySelectorAll(".custom-date-picker-input").forEach(el => {
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
