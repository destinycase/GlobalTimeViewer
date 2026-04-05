(function initGtvCalculator(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    function isStorageRef(value) {
        return !!value
            && typeof value.getItem === "function"
            && typeof value.setItem === "function";
    }

    function isDocumentRef(value) {
        return !!value && typeof value.getElementById === "function";
    }

    // Use createService DI by default; legacy wrapper injects global refs lazily.

    function getGlobalStorageRef() {
        if (isStorageRef(globalObj?.localStorage)) {
            return globalObj.localStorage;
        }
        if (typeof localStorage !== "undefined" && isStorageRef(localStorage)) {
            return localStorage;
        }
        return null;
    }

    function getGlobalDocumentRef() {
        if (isDocumentRef(globalObj?.document)) {
            return globalObj.document;
        }
        if (typeof document !== "undefined" && isDocumentRef(document)) {
            return document;
        }
        return null;
    }

    function getGlobalLuxonDateTimeRef() {
        return globalObj?.luxon?.DateTime || null;
    }

    function defaultPad2(value) {
        return String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0");
    }

    function resolveStorageRef(safeDeps) {
        if (typeof safeDeps.getStorageRef === "function") {
            const injected = safeDeps.getStorageRef();
            if (isStorageRef(injected)) return injected;
        }
        if (typeof safeDeps.getStorageRefOrNull === "function") {
            const injected = safeDeps.getStorageRefOrNull();
            if (isStorageRef(injected)) return injected;
        }
        if (isStorageRef(safeDeps.storageRef)) return safeDeps.storageRef;
        if (isStorageRef(safeDeps.storage)) return safeDeps.storage;
        return getGlobalStorageRef();
    }

    function resolveDocumentRef(safeDeps) {
        if (typeof safeDeps.getDocumentRef === "function") {
            const injected = safeDeps.getDocumentRef();
            if (isDocumentRef(injected)) return injected;
        }
        if (typeof safeDeps.getDocumentRefOrNull === "function") {
            const injected = safeDeps.getDocumentRefOrNull();
            if (isDocumentRef(injected)) return injected;
        }
        if (isDocumentRef(safeDeps.documentRef)) return safeDeps.documentRef;
        if (isDocumentRef(safeDeps.document)) return safeDeps.document;
        return getGlobalDocumentRef();
    }

    function resolveLuxonDateTimeRef(safeDeps) {
        if (typeof safeDeps.getLuxonDateTimeRef === "function") {
            const injected = safeDeps.getLuxonDateTimeRef();
            if (injected) return injected;
        }
        if (typeof safeDeps.getLuxonDateTimeRefOrNull === "function") {
            const injected = safeDeps.getLuxonDateTimeRefOrNull();
            if (injected) return injected;
        }
        return safeDeps.luxonDateTimeRef || safeDeps.LuxonDateTime || getGlobalLuxonDateTimeRef();
    }

    function resolveDatePickerCtor(safeDeps) {
        if (typeof safeDeps.datePickerCtor === "function") return safeDeps.datePickerCtor;
        if (typeof safeDeps.CustomDatePicker === "function") return safeDeps.CustomDatePicker;
        return (typeof globalObj?.CustomDatePicker === "function") ? globalObj.CustomDatePicker : null;
    }

    function resolveRefreshTargetRef(safeDeps) {
        if (safeDeps.refreshTargetRef && typeof safeDeps.refreshTargetRef === "object") {
            return safeDeps.refreshTargetRef;
        }
        return (typeof globalObj !== "undefined" && globalObj) ? globalObj : null;
    }

    function resolvePad2Ref(safeDeps) {
        if (typeof safeDeps.pad2 === "function") return safeDeps.pad2;
        if (typeof safeDeps.timeCoreRef?.pad === "function") return safeDeps.timeCoreRef.pad;
        if (typeof safeDeps.GTVTimeCore?.pad === "function") return safeDeps.GTVTimeCore.pad;
        if (typeof globalObj?.GTVTimeCore?.pad === "function") return globalObj.GTVTimeCore.pad;
        return defaultPad2;
    }

    function buildLegacyServiceDeps() {
        return {
            getStorageRef: () => getGlobalStorageRef(),
            getDocumentRef: () => getGlobalDocumentRef(),
            getLuxonDateTimeRef: () => getGlobalLuxonDateTimeRef(),
            datePickerCtor: (typeof globalObj?.CustomDatePicker === "function") ? globalObj.CustomDatePicker : null,
            timeCoreRef: globalObj?.GTVTimeCore || null,
            refreshTargetRef: globalObj || null
        };
    }

    // Internal helpers (module scope)

    function makeDocHelpers(docRef) {
        const _doc = docRef || null;
        return {
            getElementById(id) {
                if (!_doc || typeof _doc.getElementById !== "function") return null;
                return _doc.getElementById(id);
            },
            querySelector(selector) {
                if (!_doc || typeof _doc.querySelector !== "function") return null;
                return _doc.querySelector(selector);
            },
            querySelectorAll(selector) {
                if (!_doc || typeof _doc.querySelectorAll !== "function") return [];
                return Array.from(_doc.querySelectorAll(selector) || []);
            },
            getCurrentLang() {
                const lang = _doc?.documentElement?.lang;
                return (typeof lang === "string" && lang.trim()) ? lang : "en";
            },
            getCurrentTheme() {
                const theme = _doc?.documentElement?.getAttribute?.("data-theme");
                return (typeof theme === "string" && theme.trim()) ? theme : "dark";
            }
        };
    }

    function isCalculatorTabActive(helpers) {
        const calcSection = helpers.getElementById("calc-section");
        if (!calcSection?.classList || typeof calcSection.classList.contains !== "function") {
            return true;
        }
        return calcSection.classList.contains("active");
    }

    const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
    const LOCAL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
    const SQL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
    const ISO_WITH_EXPLICIT_ZONE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/i;
    const RFC2822_PATTERN = /^(?:[A-Za-z]{3},\s*)?\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}(?::\d{2})?\s+(?:[A-Za-z]{1,5}|[+-]\d{4})$/;

    function isValidDateObject(value) {
        return value instanceof Date && !Number.isNaN(value.getTime());
    }

    function buildValidatedLocalDate(year, month, day, hour = 0, minute = 0, second = 0) {
        const y = Number(year);
        const m = Number(month);
        const d = Number(day);
        const h = Number(hour);
        const min = Number(minute);
        const sec = Number(second);
        const built = new Date(y, m - 1, d, h, min, sec, 0);
        if (Number.isNaN(built.getTime())) return null;
        if (
            built.getFullYear() !== y ||
            built.getMonth() !== m - 1 ||
            built.getDate() !== d ||
            built.getHours() !== h ||
            built.getMinutes() !== min ||
            built.getSeconds() !== sec
        ) {
            return null;
        }
        return built;
    }

    function buildValidatedUtcDate(year, month, day, hour = 0, minute = 0, second = 0) {
        const y = Number(year);
        const m = Number(month);
        const d = Number(day);
        const h = Number(hour);
        const min = Number(minute);
        const sec = Number(second);
        const built = new Date(Date.UTC(y, m - 1, d, h, min, sec, 0));
        if (Number.isNaN(built.getTime())) return null;
        if (
            built.getUTCFullYear() !== y ||
            built.getUTCMonth() !== m - 1 ||
            built.getUTCDate() !== d ||
            built.getUTCHours() !== h ||
            built.getUTCMinutes() !== min ||
            built.getUTCSeconds() !== sec
        ) {
            return null;
        }
        return built;
    }

    function parseLocalDateOnlyString(raw) {
        const matched = String(raw || "").trim().match(DATE_ONLY_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(matched[1], matched[2], matched[3]);
    }

    function parseLocalDateTimeString(raw) {
        const matched = String(raw || "").trim().match(LOCAL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6] || 0
        );
    }

    function parseUtcDateTimeString(raw) {
        const matched = String(raw || "").trim().match(LOCAL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedUtcDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6] || 0
        );
    }

    function parseUtcDateOnlyString(raw) {
        const matched = String(raw || "").trim().match(DATE_ONLY_PATTERN);
        if (!matched) return null;
        return buildValidatedUtcDate(matched[1], matched[2], matched[3]);
    }

    function parseSqlDateTimeString(raw) {
        const matched = String(raw || "").trim().match(SQL_DATETIME_PATTERN);
        if (!matched) return null;
        return buildValidatedLocalDate(
            matched[1], matched[2], matched[3],
            matched[4], matched[5], matched[6]
        );
    }

    function parseZonedIsoString(raw) {
        const normalized = String(raw || "").trim();
        if (!ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized)) return null;
        const epochMs = Date.parse(normalized);
        return Number.isFinite(epochMs) ? new Date(epochMs) : null;
    }

    function parseRfc2822String(raw) {
        const normalized = String(raw || "").trim();
        if (!RFC2822_PATTERN.test(normalized)) return null;
        const epochMs = Date.parse(normalized);
        return Number.isFinite(epochMs) ? new Date(epochMs) : null;
    }

    function parseIsoLocalDateString(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;
        const hasExplicitZone = ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized);

        if (luxonDT && typeof luxonDT.fromISO === "function") {
            const parsed = hasExplicitZone
                ? luxonDT.fromISO(normalized, { setZone: true })
                : luxonDT.fromISO(normalized, { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseZonedIsoString(normalized)
            || parseLocalDateTimeString(normalized)
            || parseLocalDateOnlyString(normalized);
    }

    function parseIsoUtcDateString(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;
        const hasExplicitZone = ISO_WITH_EXPLICIT_ZONE_PATTERN.test(normalized);

        if (luxonDT && typeof luxonDT.fromISO === "function") {
            const parsed = hasExplicitZone
                ? luxonDT.fromISO(normalized, { setZone: true })
                : luxonDT.fromISO(normalized, { zone: "utc" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseZonedIsoString(normalized)
            || parseUtcDateTimeString(normalized)
            || parseUtcDateOnlyString(normalized);
    }

    function parseSqlDateWithLuxon(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;

        if (luxonDT && typeof luxonDT.fromSQL === "function") {
            const parsed = luxonDT.fromSQL(normalized, { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }
        if (luxonDT && typeof luxonDT.fromFormat === "function") {
            const parsed = luxonDT.fromFormat(normalized, "yyyy-LL-dd HH:mm:ss", { zone: "local" });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseSqlDateTimeString(normalized);
    }

    function parseRfc2822DateWithLuxon(raw, luxonDT) {
        const normalized = String(raw || "").trim();
        if (!normalized) return null;

        if (luxonDT && typeof luxonDT.fromRFC2822 === "function") {
            const parsed = luxonDT.fromRFC2822(normalized, { setZone: true });
            if (parsed?.isValid) return parsed.toJSDate();
        }

        return parseRfc2822String(normalized);
    }

    function toValidDate(value, luxonDT) {
        if (!value) return null;
        if (isValidDateObject(value)) return new Date(value.getTime());
        if (typeof value === "number" && Number.isFinite(value)) {
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
        if (typeof value !== "string") return null;
        return parseIsoLocalDateString(value, luxonDT)
            || parseSqlDateWithLuxon(value, luxonDT)
            || parseRfc2822DateWithLuxon(value, luxonDT);
    }

    function formatDateOnly(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        return `${year}-${month}-${day}`;
    }

    function formatDateTimeForInput(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        const hour = padFn(dateObj.getHours());
        const minute = padFn(dateObj.getMinutes());
        const second = padFn(dateObj.getSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    function formatLocalDateTime(dateObj, padFn = defaultPad2) {
        const year = dateObj.getFullYear();
        const month = padFn(dateObj.getMonth() + 1);
        const day = padFn(dateObj.getDate());
        const hour = padFn(dateObj.getHours());
        const minute = padFn(dateObj.getMinutes());
        const second = padFn(dateObj.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    function formatUTCDateTime(dateObj, padFn = defaultPad2) {
        const year = dateObj.getUTCFullYear();
        const month = padFn(dateObj.getUTCMonth() + 1);
        const day = padFn(dateObj.getUTCDate());
        const hour = padFn(dateObj.getUTCHours());
        const minute = padFn(dateObj.getUTCMinutes());
        const second = padFn(dateObj.getUTCSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    function formatUTCDateOnlyStartOfDay(dateObj, padFn = defaultPad2) {
        const year = dateObj.getUTCFullYear();
        const month = padFn(dateObj.getUTCMonth() + 1);
        const day = padFn(dateObj.getUTCDate());
        return `${year}-${month}-${day} 00:00:00`;
    }

    // ?? 移댁슫?몃떎????????????????????????????????????????????????????????????????

    function buildCountdownDefaultName(slotIdx, t) {
        const prefix = (t("calc_countdown_default_prefix") || "Countdown").trim() || "Countdown";
        return `${prefix} ${slotIdx + 1}`;
    }

    function makeCountdownStorage(storageRef) {
        function loadCountdownState() {
            try {
                if (!storageRef || typeof storageRef.getItem !== "function") return null;
                const raw = storageRef.getItem(COUNTDOWN_STORAGE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : null;
            } catch (_err) {
                return null;
            }
        }

        function saveCountdownState(state) {
            try {
                if (!storageRef || typeof storageRef.setItem !== "function") return;
                storageRef.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(state));
            } catch (_err) {
                // 怨꾩궛湲??꾩슜 蹂댁“ ?곹깭 ????ㅽ뙣??臾댁떆?쒕떎.
            }
        }

        return { loadCountdownState, saveCountdownState };
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

    function formatCountdownText(remainingMs, t, padFn = defaultPad2) {
        const clampedMs = Math.max(0, Math.floor(remainingMs));
        const totalSeconds = Math.floor(clampedMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const daySuffix = t("calc_countdown_day_suffix") || "d";
        return `${padFn(days)}${daySuffix} ${padFn(hours)}:${padFn(minutes)}:${padFn(seconds)}`;
    }

    function renderCountdownSlot(slotIdx, refs, countdownState, t, helpers, runtime = {}, options) {
        const { syncMeta = false } = (options && typeof options === "object") ? options : {};
        const datePickerCtor = (typeof runtime.datePickerCtor === "function") ? runtime.datePickerCtor : null;
        const luxonDT = runtime.luxonDT || null;
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : defaultPad2;
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

            if (datePickerCtor && !targetInput._cdp) {
                targetInput._cdp = new datePickerCtor(targetInput, {
                    type: "datetime",
                    lang: helpers.getCurrentLang(),
                    theme: helpers.getCurrentTheme(),
                    triggerElement: helpers.querySelector(`.trigger-cd-${slotIdx}`) || null
                });
            }

            if (slot.targetIso) {
                const targetDate = toValidDate(slot.targetIso, luxonDT);
                if (targetInput._cdp) {
                    if (targetDate) targetInput._cdp.setDate(targetDate);
                    else targetInput._cdp.setDate(null);
                } else {
                    targetInput.value = targetDate ? formatDateTimeForInput(targetDate, padFn) : "";
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
        }

        if (!Number.isFinite(remainingMs)) {
            toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
            displayEl.textContent = formatCountdownText(0, t, padFn);
            displayEl.classList.remove("expired");
            statusEl.textContent = "";
            statusEl.classList.remove("expired");
            return;
        }

        displayEl.textContent = formatCountdownText(remainingMs, t, padFn);
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
        return expired;
    }

    /**
     * initCountdown ???대줈? 湲곕컲 ??대㉧ 愿由?
     * @param {function} t - 踰덉뿭 ?⑥닔
     * @param {object} helpers - DOM ?ы띁 (getElementById ??
     * @param {object} cdStorage - { loadCountdownState, saveCountdownState }
     * @param {object} timerIds - { countdownTimerId } 李몄“ 媛앹껜 (?몃??먯꽌 ?뚯쑀)
     */
    function initCountdown(t, helpers, cdStorage, timerIds, runtime = {}) {
        const luxonDT = runtime.luxonDT || null;
        const nameButtons = helpers.querySelectorAll(".countdown-name-btn");
        const nameInputs = helpers.querySelectorAll(".countdown-name-input");
        const toggleButtons = helpers.querySelectorAll(".countdown-toggle-btn");
        const targetInputs = helpers.querySelectorAll(".countdown-target-input");
        const displayEls = helpers.querySelectorAll(".countdown-display");
        const statusEls = helpers.querySelectorAll(".countdown-status");
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

        // ?대줈? ?대? ?곹깭 ??紐⑤뱢 ?꾩뿭 ?ㅼ뿼 ?놁쓬
        const countdownState = normalizeCountdownState(cdStorage.loadCountdownState(), t);
        const refs = { nameButtons, nameInputs, toggleButtons, targetInputs, displayEls, statusEls };

        const saveState = () => cdStorage.saveCountdownState(countdownState);
        const render = (i, opts) => {
            const expired = renderCountdownSlot(i, refs, countdownState, t, helpers, runtime, opts);
            if (expired) saveState();
        };

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
                    saveState();
                }
                nameInput.style.display = "none";
                nameBtn.style.display = "inline-flex";
                render(i, { syncMeta: true });
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

            nameInput.addEventListener("blur", () => closeNameEditor(true));

            targetInput.addEventListener("change", () => {
                const parsed = (targetInput._cdp && targetInput._cdp.selectedDate)
                    ? toValidDate(targetInput._cdp.selectedDate, luxonDT)
                    : toValidDate(targetInput.value, luxonDT);
                if (!parsed) {
                    countdownState[i].targetIso = "";
                    countdownState[i].active = false;
                    countdownState[i].pausedRemainingMs = null;
                } else {
                    countdownState[i].targetIso = parsed.toISOString();
                    countdownState[i].pausedRemainingMs = null;
                    if (!countdownState[i].active) {
                        countdownState[i].pausedRemainingMs = Math.max(0, parsed.getTime() - Date.now());
                    }
                }
                render(i, { syncMeta: true });
                saveState();
            });
        }

        helpers.querySelectorAll(".countdown-slot-controls .sm-btn[data-action]").forEach((btn) => {
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
                        const parsed = toValidDate(targetInput.value, luxonDT) || toValidDate(slot.targetIso, luxonDT);
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

                render(slotIdx, { syncMeta: true });
                saveState();
            });
        });

        // ?댁쟾 ??대㉧ ?뺣━ ??????대㉧ ?깅줉 (?대줈? ?대? timerIds 媛앹껜 ?ъ슜)
        if (timerIds.countdown !== null && timerIds.countdown !== undefined) {
            clearInterval(timerIds.countdown);
        }
        timerIds.countdown = setInterval(() => {
            if (!isCalculatorTabActive(helpers)) return;
            for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                render(i);
            }
        }, 1000);

        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            render(i, { syncMeta: true });
        }

        return {
            refresh() {
                for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                    render(i, { syncMeta: true });
                }
            }
        };
    }

    // ?? Unix ??꾩뒪?ы봽 蹂?섍린 ??????????????????????????????????????????????????

    function initUnixTimestampConverter(t, helpers, luxonDT, timerIds, runtime = {}) {
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : defaultPad2;
        const unixNowValue = helpers.getElementById("unix-now-value");
        const unixNowMsValue = helpers.getElementById("unix-now-ms-value");
        const unixSyncNowBtn = helpers.getElementById("unix-sync-now-btn");
        const unixTsInput = helpers.getElementById("unix-ts-input");
        const unixTsMsInput = helpers.getElementById("unix-ts-ms-input");
        const unixIsoLocalInput = helpers.getElementById("unix-iso-local-input");
        const unixIsoUtcInput = helpers.getElementById("unix-iso-utc-input");
        const unixRfc2822Input = helpers.getElementById("unix-rfc2822-input");
        const unixSqlInput = helpers.getElementById("unix-sql-input");
        const unixHumanInput = helpers.getElementById("unix-human-input");
        const smartFormatRows = helpers.querySelectorAll(".smart-format-row");

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
            const month = padFn(dateObj.getMonth() + 1);
            const day = padFn(dateObj.getDate());
            const hour = padFn(dateObj.getHours());
            const minute = padFn(dateObj.getMinutes());
            const second = padFn(dateObj.getSeconds());
            const totalOffsetMinutes = -dateObj.getTimezoneOffset();
            const sign = totalOffsetMinutes >= 0 ? "+" : "-";
            const absOffset = Math.abs(totalOffsetMinutes);
            const offsetHour = padFn(Math.floor(absOffset / 60));
            const offsetMinute = padFn(absOffset % 60);
            return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
        };

        const buildFieldValues = (epochMs) => {
            const safeEpochMs = Math.trunc(Number(epochMs));
            if (!Number.isFinite(safeEpochMs)) return null;

            if (luxonDT && typeof luxonDT.fromMillis === "function") {
                const utc = luxonDT.fromMillis(safeEpochMs, { zone: "utc" });
                if (!utc.isValid) return null;
                const local = utc.toLocal().setLocale(helpers.getCurrentLang());
                return {
                    unixSec: String(Math.floor(safeEpochMs / 1000)),
                    unixMs: String(safeEpochMs),
                    isoLocal: local.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    isoUtc: utc.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    rfc2822: local.toRFC2822() || "",
                    sql: local.toFormat("yyyy-LL-dd HH:mm:ss"),
                    human: local.toLocaleString(luxonDT.DATETIME_FULL_WITH_SECONDS)
                };
            }

            const dateObj = new Date(safeEpochMs);
            if (Number.isNaN(dateObj.getTime())) return null;
            const locale = helpers.getCurrentLang() === "ko" ? "ko-KR" : "en-US";
            return {
                unixSec: String(Math.floor(safeEpochMs / 1000)),
                unixMs: String(safeEpochMs),
                isoLocal: formatIsoLocalWithOffset(dateObj),
                isoUtc: formatUTCDateTime(dateObj, padFn),
                rfc2822: dateObj.toUTCString(),
                sql: formatLocalDateTime(dateObj, padFn),
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
                unixSec: invalidText, unixMs: invalidText, isoLocal: invalidText,
                isoUtc: invalidText, rfc2822: invalidText, sql: invalidText, human: invalidText
            });
        };

        const renderFromEpoch = (epochMs) => {
            const values = buildFieldValues(epochMs);
            if (!values) { renderInvalid(); return; }
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

            let parsedDate = null;
            if (key === "iso_local") {
                parsedDate = parseIsoLocalDateString(raw, luxonDT);
            } else if (key === "iso_utc") {
                parsedDate = parseIsoUtcDateString(raw, luxonDT);
            } else if (key === "rfc2822") {
                parsedDate = parseRfc2822DateWithLuxon(raw, luxonDT);
            } else if (key === "sql") {
                parsedDate = parseSqlDateWithLuxon(raw, luxonDT);
            }

            return isValidDateObject(parsedDate) ? Math.trunc(parsedDate.getTime()) : null;
        };

        const handleFieldInput = (key, fieldEl) => {
            if (isSyncing || !fieldEl) return;
            const parsedMs = parseFieldValue(key, fieldEl.value);
            if (!Number.isFinite(parsedMs)) { renderInvalid(); return; }
            activeEpochMs = Math.trunc(parsedMs);
            renderFromEpoch(activeEpochMs);
        };

        const updateNow = () => {
            if (!isCalculatorTabActive(helpers)) return;
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

        // ?댁쟾 ??대㉧ ?뺣━ ??????대㉧ ?깅줉
        if (timerIds.unix !== null && timerIds.unix !== undefined) {
            clearInterval(timerIds.unix);
        }
        timerIds.unix = setInterval(updateNow, 1000);
        syncNow();

        return {
            refresh() {
                updateNow();
                if (hasValidEpoch) renderFromEpoch(activeEpochMs);
                else renderInvalid();
            }
        };
    }

    // ?? ?⑥쐞 蹂?섍린 ?????????????????????????????????????????????????????????????

    function initConverter(helpers) {
        const secIn = helpers.getElementById("conv-sec");
        const minIn = helpers.getElementById("conv-min");
        const hourIn = helpers.getElementById("conv-hour");
        const dayIn = helpers.getElementById("conv-day");
        if (!secIn || !minIn || !hourIn || !dayIn) return;

        const allInputs = [secIn, minIn, hourIn, dayIn];

        const updateFrom = (rawValue, unit) => {
            const numericValue = Number(rawValue);
            if (rawValue === "" || Number.isNaN(numericValue)) {
                allInputs.forEach((input) => { input.value = ""; });
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

    // ?? 湲곌컙/?좎쭨 怨꾩궛湲??????????????????????????????????????????????????????????

    function initPeriodAndDateShift(t, helpers, runtime = {}) {
        const datePickerCtor = (typeof runtime.datePickerCtor === "function") ? runtime.datePickerCtor : null;
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : defaultPad2;
        const periodStart = helpers.getElementById("period-start");
        const periodEnd = helpers.getElementById("period-end");
        const periodSwapBtn = helpers.getElementById("period-swap-btn");
        const periodDayRes = helpers.getElementById("period-res");
        const periodHourRes = helpers.getElementById("period-hour-res");
        const periodMinRes = helpers.getElementById("period-min-res");
        const periodSecRes = helpers.getElementById("period-sec-res");
        const offsetStart = helpers.getElementById("offset-start");
        const offsetValueInput = helpers.getElementById("off-val");
        const offValMinus = helpers.getElementById("off-val-minus");
        const offValPlus = helpers.getElementById("off-val-plus");
        const offsetUnit = helpers.getElementById("off-unit");
        const offsetDirection = helpers.getElementById("off-dir");
        const offsetResult = helpers.getElementById("offset-res");

        if (
            !periodStart || !periodEnd || !periodDayRes || !periodHourRes || !periodMinRes || !periodSecRes ||
            !offsetStart || !offsetValueInput || !offsetUnit || !offsetDirection || !offsetResult
        ) {
            return { refresh: () => { } };
        }

        const applyPicker = (el, iconId) => {
            if (datePickerCtor && !el._cdp) {
                el._cdp = new datePickerCtor(el, {
                    type: "date",
                    lang: helpers.getCurrentLang(),
                    theme: helpers.getCurrentTheme(),
                    triggerElement: helpers.getElementById(iconId) || null
                });
            }
        };

        applyPicker(periodStart, "period-start-trigger");
        applyPicker(periodEnd, "period-end-trigger");
        applyPicker(offsetStart, "offset-start-trigger");

        // 湲곌컙 怨꾩궛?? UTC ?먯젙?쇰줈 ?뚯떛 (DST 寃쎄퀎 ?ㅻ쪟 諛⑹?)
        const getPickerDateUtc = (el) => {
            let val = el.value;
            if (el._cdp && el._cdp.selectedDate) {
                const d = new Date(el._cdp.selectedDate);
                val = `${d.getFullYear()}-${padFn(d.getMonth() + 1)}-${padFn(d.getDate())}`;
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

        // 湲곌컙 怨꾩궛怨??ㅽ봽??怨꾩궛?먯꽌 ?숈씪??UTC ?좎쭨 ?뚯떛 濡쒖쭅???ъ궗?⑺븳??
        const today = new Date();
        const todayText = formatDateOnly(today, padFn);
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
                // Math.trunc ?ъ슜: ?쒖옉??> 醫낅즺???뚯닔) ???ㅻ갑??諛섏삱由?踰꾧렇 諛⑹?
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
            if (!offStartD) { offsetResult.value = "-"; return; }

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

            offsetResult.value = formatUTCDateOnlyStartOfDay(resultDate, padFn);
        };

        [periodStart, periodEnd, offsetStart, offsetValueInput, offsetUnit, offsetDirection].forEach((el) => {
            el.addEventListener("input", updateAll);
            el.addEventListener("change", updateAll);
        });

        if (offValMinus && offValPlus) {
            offValMinus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v > 1) { offsetValueInput.value = v - 1; updateAll(); }
            });
            offValPlus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 0;
                offsetValueInput.value = v + 1;
                updateAll();
            });
            offsetValueInput.addEventListener("input", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v < 1) { offsetValueInput.value = 1; updateAll(); }
            });
        }

        if (periodSwapBtn) {
            periodSwapBtn.addEventListener("click", () => {
                // CDP ?곹깭源뚯? 怨좊젮??援먰솚(Swap) 濡쒖쭅??蹂댁셿
                const startD = getPickerDateUtc(periodStart);
                const endD = getPickerDateUtc(periodEnd);
                if (startD && endD) {
                    if (periodStart._cdp) periodStart._cdp.setDate(endD);
                    else periodStart.value = formatDateOnly(endD, padFn);
                    if (periodEnd._cdp) periodEnd._cdp.setDate(startD);
                    else periodEnd.value = formatDateOnly(startD, padFn);
                    updateAll();
                } else {
                    // ?대갚: 媛믩쭔 援먯껜
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

    // ?? 蹂듭궗 踰꾪듉 諛붿씤???????????????????????????????????????????????????????????

    function bindCopyButtons(copyText, helpers, copyBindings) {
        if (!Array.isArray(copyBindings)) return;
        copyBindings.forEach(([btnId, targetId, isInput]) => {
            const btn = helpers.getElementById(btnId);
            if (!btn) return;
            btn.addEventListener("click", () => copyText(targetId, isInput));
        });
    }
    // Use createService DI by default; resolve global fallbacks at call time only.

    /**
     * createService(deps)
     * ??대㉧ 蹂?섎? ?대줈? ?대???寃⑸━???몃? ?ㅼ뿼??諛⑹??쒕떎.
     * destroy()濡?紐⑤뱺 ??대㉧瑜?紐낆떆?곸쑝濡??뺣━?????덈떎.
     * 湲곗〈 initCalculators() ?명꽣?섏씠?ㅻ룄 ?좎??쒕떎.
     */
    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const storageRef = resolveStorageRef(safeDeps);
        const luxonDT = resolveLuxonDateTimeRef(safeDeps);
        const documentRef = resolveDocumentRef(safeDeps);
        const refreshTargetRef = resolveRefreshTargetRef(safeDeps);
        const runtime = Object.freeze({
            luxonDT,
            datePickerCtor: resolveDatePickerCtor(safeDeps),
            pad2: resolvePad2Ref(safeDeps)
        });

        // ?대줈? ?대? ??대㉧ 李몄“ ???몃? ?꾩뿭 蹂???ㅼ뿼 ?놁쓬
        const timerIds = { countdown: null, unix: null };

        /**
         * destroy() ??紐⑤뱺 ??대㉧瑜??뺣━?쒕떎.
         * ?ъ큹湲고솕?섍굅????쓣 ?レ쓣 ??紐낆떆?곸쑝濡??몄텧?쒕떎.
         */
        function destroy() {
            if (timerIds.countdown !== null && timerIds.countdown !== undefined) {
                clearInterval(timerIds.countdown);
                timerIds.countdown = null;
            }
            if (timerIds.unix !== null && timerIds.unix !== undefined) {
                clearInterval(timerIds.unix);
                timerIds.unix = null;
            }
        }

        function initCalculators(options) {
            const opts = (options && typeof options === "object") ? options : {};
            const t = (typeof opts.t === "function") ? opts.t : ((key) => key);
            const copyText = (typeof opts.copyText === "function") ? opts.copyText : (async () => { });

            const helpers = makeDocHelpers(documentRef);
            const cdStorage = makeCountdownStorage(storageRef);

            const periodAndShift = initPeriodAndDateShift(t, helpers, runtime);
            const countdown = initCountdown(t, helpers, cdStorage, timerIds, runtime);
            const unixConverter = initUnixTimestampConverter(t, helpers, luxonDT, timerIds, runtime);
            initConverter(helpers);

            bindCopyButtons(copyText, helpers, [
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

            if (refreshTargetRef) {
                refreshTargetRef.__gtvCalcRefresh = () => {
                    periodAndShift.refresh();
                    countdown.refresh();
                    unixConverter.refresh();

                    const currentLang = helpers.getCurrentLang();
                    const currentTheme = helpers.getCurrentTheme();
                    helpers.querySelectorAll(".custom-date-picker-input").forEach((el) => {
                        if (el._cdp) {
                            el._cdp.setLang(currentLang);
                            el._cdp.setTheme(currentTheme);
                        }
                    });
                };
            }
        }

        return Object.freeze({ initCalculators, destroy });
    }

    // ?? ?섏쐞 ?명솚 吏꾩엯????湲곗〈 main.js媛 GTVCalculator.initCalculators()瑜??ъ슜?섎뒗 寃쎌슦 ??

    /**
     * @deprecated createService() ?ъ슜??沅뚯옣?쒕떎.
     * 湲곗〈 ?몄텧 肄붾뱶??臾댁쨷???좎?瑜??꾪빐 ?④꺼???섑띁.
     */
    function initCalculators(options) {
        // 湲곕낯 ?쒕퉬???몄뒪?댁뒪瑜??앹꽦???꾩엫?쒕떎.
        const svc = createService(buildLegacyServiceDeps());
        svc.initCalculators(options);
    }

    globalObj.GTVCalculator = Object.freeze({
        createService,
        initCalculators
    });
})(typeof window !== "undefined" ? window : globalThis);
