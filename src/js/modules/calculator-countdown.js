(function initGtvCalculatorCountdown(globalObj) {
    "use strict";

    // Countdown tool: storage, per-slot rendering and controls. Date helpers come from runtime.dateFormat.

    // ── 카운트다운 ───────────────────────────────────────────────

    function makeCountdownStorage(storageRef, storageKey) {
        function loadCountdownState() {
            try {
                if (!storageRef || typeof storageRef.getItem !== "function") return null;
                const raw = storageRef.getItem(storageKey);
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
                storageRef.setItem(storageKey, JSON.stringify(state));
            } catch (_err) {
                // 계산기 전용 보조 상태 저장 실패는 무시한다.
            }
        }

        return { loadCountdownState, saveCountdownState };
    }

    function isElementDisplayNone(element) {
        if (!element || typeof element !== "object") return true;
        const inlineDisplay = (typeof element?.style?.display === "string")
            ? element.style.display.trim()
            : "";
        if (inlineDisplay) return inlineDisplay === "none";
        if (element?.classList && typeof element.classList.contains === "function" && element.classList.contains("is-hidden")) {
            return true;
        }
        if (typeof globalObj?.getComputedStyle === "function") {
            const computedDisplay = globalObj.getComputedStyle(element)?.display;
            if (typeof computedDisplay === "string" && computedDisplay.trim()) {
                return computedDisplay === "none";
            }
        }
        return false;
    }

    function renderCountdownSlot(slotIdx, refs, countdownState, t, helpers, runtime = {}, options) {
        const { syncMeta = false } = (options && typeof options === "object") ? options : {};
        const countdownStateUtils = runtime.countdownStateUtils;
        const datePickerCtor = (typeof runtime.datePickerCtor === "function") ? runtime.datePickerCtor : null;
        const luxonDT = runtime.luxonDT || null;
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : runtime.dateFormat.defaultPad2;
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
                slot.name = countdownStateUtils.buildDefaultName(slotIdx, t);
            }
            nameBtn.textContent = slot.name;
            if (isElementDisplayNone(nameInput)) {
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
                const targetDate = runtime.dateFormat.toValidDate(slot.targetIso, luxonDT);
                if (targetInput._cdp) {
                    if (targetDate) targetInput._cdp.setDate(targetDate);
                    else targetInput._cdp.setDate(null);
                } else {
                    targetInput.value = targetDate ? runtime.dateFormat.formatDateTimeForInput(targetDate, padFn) : "";
                }
            } else {
                if (targetInput._cdp) targetInput._cdp.setDate(null);
                else targetInput.value = "";
            }
        }

        const nowMs = Date.now();
        let remainingMs = countdownStateUtils.parseRemainingMs(slot, nowMs);
        let expired = false;

        if (slot.active && Number.isFinite(remainingMs) && remainingMs <= 0) {
            slot.active = false;
            slot.pausedRemainingMs = 0;
            remainingMs = 0;
            expired = true;
        }

        if (!Number.isFinite(remainingMs)) {
            toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
            displayEl.textContent = countdownStateUtils.formatRemainingText(0, t, padFn);
            displayEl.classList.remove("expired");
            statusEl.textContent = "";
            statusEl.classList.remove("expired");
            return;
        }

        displayEl.textContent = countdownStateUtils.formatRemainingText(remainingMs, t, padFn);
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
     * initCountdown — 클로저 기반 타이머 관리
     * @param {function} t - 번역 함수
     * @param {object} helpers - DOM 헬퍼 (getElementById 등)
     * @param {object} cdStorage - { loadCountdownState, saveCountdownState }
     * @param {object} timerIds - { countdownTimerId } 참조 객체 (외부에서 소유)
     */
    function initCountdown(t, helpers, cdStorage, timerIds, runtime = {}) {
        const countdownStateUtils = runtime.countdownStateUtils;
        const luxonDT = runtime.luxonDT || null;
        const nameButtons = helpers.querySelectorAll(".countdown-name-btn");
        const nameInputs = helpers.querySelectorAll(".countdown-name-input");
        const toggleButtons = helpers.querySelectorAll(".countdown-toggle-btn");
        const targetInputs = helpers.querySelectorAll(".countdown-target-input");
        const displayEls = helpers.querySelectorAll(".countdown-display");
        const statusEls = helpers.querySelectorAll(".countdown-status");
        if (
            nameButtons.length < countdownStateUtils.slotCount ||
            nameInputs.length < countdownStateUtils.slotCount ||
            toggleButtons.length < countdownStateUtils.slotCount ||
            targetInputs.length < countdownStateUtils.slotCount ||
            displayEls.length < countdownStateUtils.slotCount ||
            statusEls.length < countdownStateUtils.slotCount
        ) {
            return { refresh: () => { } };
        }

        // 클로저 내부 상태 — 모듈 전역 오염 없음
        const countdownState = countdownStateUtils.normalizeState(cdStorage.loadCountdownState(), t);
        const refs = { nameButtons, nameInputs, toggleButtons, targetInputs, displayEls, statusEls };

        const saveState = () => cdStorage.saveCountdownState(countdownState);
        const render = (i, opts) => {
            const expired = renderCountdownSlot(i, refs, countdownState, t, helpers, runtime, opts);
            if (expired) saveState();
        };

        for (let i = 0; i < countdownStateUtils.slotCount; i++) {
            const nameBtn = nameButtons[i];
            const nameInput = nameInputs[i];
            const targetInput = targetInputs[i];

            const closeNameEditor = (commit) => {
                if (isElementDisplayNone(nameInput)) return;
                if (commit) {
                    const trimmed = String(nameInput.value || "").trim();
                    if (!trimmed) {
                        countdownState[i].name = countdownStateUtils.buildDefaultName(i, t);
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
                nameInput.value = countdownState[i].name || countdownStateUtils.buildDefaultName(i, t);
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
                    ? runtime.dateFormat.toValidDate(targetInput._cdp.selectedDate, luxonDT)
                    : runtime.dateFormat.toValidDate(targetInput.value, luxonDT);
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
            if (!Number.isInteger(slotIdx) || slotIdx < 0 || slotIdx >= countdownStateUtils.slotCount) return;
            const targetInput = targetInputs[slotIdx];

            btn.addEventListener("click", () => {
                const slot = countdownState[slotIdx];
                if (!slot) return;

                if (action === "toggle") {
                    if (slot.active) {
                        const remainingMs = countdownStateUtils.parseRemainingMs(slot, Date.now());
                        slot.active = false;
                        slot.pausedRemainingMs = Number.isFinite(remainingMs)
                            ? Math.max(0, Math.floor(remainingMs))
                            : null;
                    } else {
                        const parsed = runtime.dateFormat.toValidDate(targetInput.value, luxonDT) || runtime.dateFormat.toValidDate(slot.targetIso, luxonDT);
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

        // 이전 타이머 정리 후 새 타이머 등록 (클로저 내부 timerIds 객체 사용)
        if (timerIds.countdown !== null && timerIds.countdown !== undefined) {
            clearInterval(timerIds.countdown);
        }
        timerIds.countdown = setInterval(() => {
            if (!helpers.isCalculatorTabActive()) return;
            for (let i = 0; i < countdownStateUtils.slotCount; i++) {
                render(i);
            }
        }, 1000);

        for (let i = 0; i < countdownStateUtils.slotCount; i++) {
            render(i, { syncMeta: true });
        }

        return {
            refresh() {
                for (let i = 0; i < countdownStateUtils.slotCount; i++) {
                    render(i, { syncMeta: true });
                }
            }
        };
    }


    function createService(_deps = {}) {
        return Object.freeze({
            makeCountdownStorage,
            initCountdown
        });
    }

    const defaultService = createService();

    globalObj.GTVCalculatorCountdown = Object.freeze({
        createService,
        makeCountdownStorage: defaultService.makeCountdownStorage,
        initCountdown: defaultService.initCountdown
    });
})(typeof window !== "undefined" ? window : globalThis);
