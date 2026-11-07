(function initGtvCalculator(globalObj) {
    "use strict";

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

    function resolvePad2Ref(safeDeps, fallbackPad2) {
        if (typeof safeDeps.pad2 === "function") return safeDeps.pad2;
        if (typeof safeDeps.timeCoreRef?.pad === "function") return safeDeps.timeCoreRef.pad;
        if (typeof safeDeps.GTVTimeCore?.pad === "function") return safeDeps.GTVTimeCore.pad;
        if (typeof globalObj?.GTVTimeCore?.pad === "function") return globalObj.GTVTimeCore.pad;
        return fallbackPad2;
    }

    // Calculator tool modules load before this file (runtime-script-list order) and register globals.
    function resolveCalculatorModule(injected, globalName) {
        const moduleApi = injected || globalObj?.[globalName] || globalThis[globalName];
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${globalName}.createService`);
        }
        return moduleApi.createService();
    }

    function buildLegacyServiceDeps() {
        return {
            getStorageRef: () => getGlobalStorageRef(),
            getDocumentRef: () => getGlobalDocumentRef(),
            getLuxonDateTimeRef: () => getGlobalLuxonDateTimeRef(),
            countdownStateModule: globalObj?.GTVCalculatorCountdownState || null,
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
            },
            isCalculatorTabActive() {
                const calcSection = this.getElementById("calc-section");
                if (!calcSection?.classList || typeof calcSection.classList.contains !== "function") {
                    return true;
                }
                return calcSection.classList.contains("active");
            }
        };
    }

    // ── 단위 변환기 ───────────────────────────────────────────────

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

    // ── 기간/날짜 계산기 ──────────────────────────────────────────

    function initPeriodAndDateShift(t, helpers, runtime = {}) {
        const datePickerCtor = (typeof runtime.datePickerCtor === "function") ? runtime.datePickerCtor : null;
        const dateFormat = runtime.dateFormat;
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : dateFormat.defaultPad2;
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

        // 기간 계산은 UTC 자정 기준으로 파싱한다 (DST 경계 오류 방지).
        // The input is authoritative so manual edits are not masked by a stale picker selection.
        const getPickerDateUtc = (el) => dateFormat.parseUtcDateOnlyString(el.value);

        const today = new Date();
        const todayText = dateFormat.formatDateOnly(today, padFn);
        if (!periodStart.value) periodStart.value = todayText;
        if (!periodEnd.value) periodEnd.value = todayText;
        if (!offsetStart.value) offsetStart.value = todayText;
        if (!offsetValueInput.value) offsetValueInput.value = "1";
        if (!offsetUnit.value) offsetUnit.value = "day";
        if (!offsetDirection.value) offsetDirection.value = "after";

        const setPeriodResult = (el, value, suffix) => {
            el.textContent = `${value}${suffix || ""}`;
        };

        const setDateInputFeedback = (input, isInvalid) => {
            const errorEl = helpers.getElementById(`${input.id}-error`);
            if (isInvalid) {
                input.setAttribute("aria-invalid", "true");
                if (errorEl) errorEl.textContent = t("calc_invalid_date_help");
            } else {
                input.removeAttribute("aria-invalid");
                if (errorEl) errorEl.textContent = "";
            }
        };

        const updateAll = () => {
            const startD = getPickerDateUtc(periodStart);
            const endD = getPickerDateUtc(periodEnd);
            setDateInputFeedback(periodStart, !startD);
            setDateInputFeedback(periodEnd, !endD);

            if (startD && endD) {
                // Math.trunc 사용: 시작일 > 종료일(음수)일 때 내림 방향으로 1이 더 빠지는 버그 방지
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
            setDateInputFeedback(offsetStart, !offStartD);
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

            offsetResult.value = dateFormat.formatUTCDateOnlyStartOfDay(resultDate, padFn);
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
            // Swap the typed date text. The date picker works in local time, so it receives a
            // local-midnight date built from the same text (never the UTC-midnight calculation date).
            const setSwappedDateValue = (el, value) => {
                const localDate = dateFormat.parseLocalDateOnlyString(value);
                if (el._cdp && localDate) el._cdp.setDate(localDate);
                else el.value = value;
            };
            periodSwapBtn.addEventListener("click", () => {
                const startValue = String(periodStart.value || "").trim();
                const endValue = String(periodEnd.value || "").trim();
                setSwappedDateValue(periodStart, endValue);
                setSwappedDateValue(periodEnd, startValue);
                updateAll();
            });
        }

        updateAll();
        return { refresh: updateAll };
    }

    // ── 복사 버튼 바인딩 ──────────────────────────────────────────

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
     * 타이머 변수를 클로저 내부에 격리해 외부 오염을 방지한다.
     * destroy()로 모든 타이머를 명시적으로 정리할 수 있다.
     * 기존 initCalculators() 인터페이스도 유지한다.
     */
    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const storageRef = resolveStorageRef(safeDeps);
        const luxonDT = resolveLuxonDateTimeRef(safeDeps);
        const documentRef = resolveDocumentRef(safeDeps);
        const refreshTargetRef = resolveRefreshTargetRef(safeDeps);
        const countdownStateModule = (
            safeDeps.countdownStateModule
            || globalObj?.GTVCalculatorCountdownState
            || null
        );
        if (!countdownStateModule || typeof countdownStateModule.createService !== "function") {
            throw new Error("Missing required module API: GTVCalculatorCountdownState.createService");
        }
        const countdownStateUtils = countdownStateModule.createService();
        if (
            !countdownStateUtils
            || typeof countdownStateUtils.normalizeState !== "function"
            || typeof countdownStateUtils.parseRemainingMs !== "function"
            || typeof countdownStateUtils.formatRemainingText !== "function"
            || typeof countdownStateUtils.buildDefaultName !== "function"
            || !Number.isInteger(countdownStateUtils.slotCount)
            || typeof countdownStateUtils.storageKey !== "string"
        ) {
            throw new Error("Invalid calculator countdown state service");
        }
        const dateFormat = resolveCalculatorModule(safeDeps.dateFormatModule, "GTVCalculatorDateFormat");
        const countdownTool = resolveCalculatorModule(safeDeps.countdownModule, "GTVCalculatorCountdown");
        const formatConverter = resolveCalculatorModule(safeDeps.formatConverterModule, "GTVCalculatorFormatConverter");
        const runtime = Object.freeze({
            luxonDT,
            countdownStateUtils,
            dateFormat,
            datePickerCtor: resolveDatePickerCtor(safeDeps),
            pad2: resolvePad2Ref(safeDeps, dateFormat.defaultPad2)
        });

        // 클로저 내부 타이머 참조 — 외부 전역 변수 오염 없음
        const timerIds = { countdown: null, unix: null };

        /**
         * destroy() — 모든 타이머를 정리한다.
         * 재초기화하거나 탭을 닫을 때 명시적으로 호출한다.
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
            const cdStorage = countdownTool.makeCountdownStorage(storageRef, countdownStateUtils.storageKey);

            const periodAndShift = initPeriodAndDateShift(t, helpers, runtime);
            const countdown = countdownTool.initCountdown(t, helpers, cdStorage, timerIds, runtime);
            const unixConverter = formatConverter.initUnixTimestampConverter(t, helpers, luxonDT, timerIds, runtime);
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

    // ── 하위 호환 진입점 (기존 main.js가 GTVCalculator.initCalculators()를 사용하는 경우) ──

    /**
     * @deprecated createService() 사용을 권장한다.
     * 기존 호출 코드를 끊김 없이 유지하기 위해 남겨 둔 래퍼.
     */
    function initCalculators(options) {
        // 기본 서비스 인스턴스를 생성해 위임한다.
        const svc = createService(buildLegacyServiceDeps());
        svc.initCalculators(options);
    }

    globalObj.GTVCalculator = Object.freeze({
        createService,
        initCalculators
    });
})(typeof window !== "undefined" ? window : globalThis);
