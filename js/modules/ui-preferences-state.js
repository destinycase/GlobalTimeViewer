(function initGtvUiPreferencesState(globalObj) {
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
                    logWarn(`[GTVUiPreferencesState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getState: toSafeCallable("getState", safeDeps.getState),
            setState: toSafeCallable("setState", safeDeps.setState),
            t: toSafeCallable("t", safeDeps.t),
            showToast: toSafeCallable("showToast", safeDeps.showToast),
            updateClocks: toSafeCallable("updateClocks", safeDeps.updateClocks),
            savePersistence: toSafeCallable("savePersistence", safeDeps.savePersistence),
            setStorageValue: toSafeCallable("setStorageValue", safeDeps.setStorageValue),
            getStorageValue: toSafeCallable("getStorageValue", safeDeps.getStorageValue)
        });

        function awaitIfPromiseLike(value) {
            if (value && typeof value.then === "function") {
                return value;
            }
            return Promise.resolve();
        }

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document === "object") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document === "object") {
                return globalObj.document;
            }
            return (typeof document === "object" && document) ? document : null;
        }

        function readState() {
            const state = dep.getState();
            if (!state || typeof state !== "object") {
                return {
                    uiScale: 1.0,
                    currentTheme: "dark",
                    currentLang: "ko",
                    dayStartHour: getDefaultDayStartHour(),
                    nightStartHour: getDefaultNightStartHour()
                };
            }
            return state;
        }

        function patchState(next = {}) {
            if (!next || typeof next !== "object") return;
            dep.setState(next);
        }

        function getUiScaleDefaultPercent() {
            const parsed = Number(safeDeps.DEFAULT_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 100;
        }

        function getUiScaleMinPercent() {
            const parsed = Number(safeDeps.MIN_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 50;
        }

        function getUiScaleMaxPercent() {
            const parsed = Number(safeDeps.MAX_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 200;
        }

        function getUiScalePercentOptions() {
            return Array.isArray(safeDeps.UI_SCALE_PERCENT_OPTIONS)
                ? safeDeps.UI_SCALE_PERCENT_OPTIONS
                : [50, 75, 100, 125, 150, 175, 200];
        }

        function getDefaultDayStartHour() {
            const parsed = Number.parseInt(safeDeps.DEFAULT_DAY_START_HOUR, 10);
            if (!Number.isFinite(parsed)) return 6;
            return Math.min(23, Math.max(0, parsed));
        }

        function getDefaultNightStartHour() {
            const parsed = Number.parseInt(safeDeps.DEFAULT_NIGHT_START_HOUR, 10);
            if (!Number.isFinite(parsed)) return 18;
            return Math.min(23, Math.max(0, parsed));
        }

        function getDayNightHourOptions() {
            const source = Array.isArray(safeDeps.DAY_NIGHT_HOUR_OPTIONS)
                ? safeDeps.DAY_NIGHT_HOUR_OPTIONS
                : Array.from({ length: 24 }, (_, hour) => hour);
            const normalized = source
                .map((value) => Number.parseInt(value, 10))
                .filter((value) => Number.isFinite(value) && value >= 0 && value <= 23)
                .filter((value, idx, list) => list.indexOf(value) === idx)
                .sort((a, b) => a - b);
            return normalized.length ? normalized : Array.from({ length: 24 }, (_, hour) => hour);
        }

        function sanitizeDayNightHour(value, fallback = getDefaultDayStartHour()) {
            const parsed = Number.parseInt(value, 10);
            const fallbackHour = Number.parseInt(fallback, 10);
            const base = Number.isFinite(parsed)
                ? parsed
                : (Number.isFinite(fallbackHour) ? fallbackHour : getDefaultDayStartHour());
            const clamped = Math.min(23, Math.max(0, base));
            const options = getDayNightHourOptions();
            return options.reduce((closest, hour) => (
                Math.abs(hour - clamped) < Math.abs(closest - clamped) ? hour : closest
            ), options[0]);
        }

        function resolveCurrentDayNightHours() {
            const state = readState();
            const fallbackDay = getDefaultDayStartHour();
            const fallbackNight = getDefaultNightStartHour();
            const dayStartHour = sanitizeDayNightHour(state.dayStartHour, fallbackDay);
            const nightStartHour = sanitizeDayNightHour(state.nightStartHour, fallbackNight);
            if (nightStartHour <= dayStartHour) {
                return { dayStartHour: fallbackDay, nightStartHour: fallbackNight };
            }
            return { dayStartHour, nightStartHour };
        }

        function pad2(value) {
            return String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0");
        }

        function populateDayNightHourSelect(selectEl) {
            if (!selectEl) return;
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return;
            selectEl.textContent = "";
            getDayNightHourOptions().forEach((hour) => {
                const option = documentRef.createElement("option");
                option.value = String(hour);
                option.textContent = `${pad2(hour)}:00`;
                selectEl.appendChild(option);
            });
        }

        function getDayStartHour() {
            return resolveCurrentDayNightHours().dayStartHour;
        }

        function getNightStartHour() {
            return resolveCurrentDayNightHours().nightStartHour;
        }

        function getDayNightMarkerByHour(hourValue) {
            const hourRaw = Number.parseInt(hourValue, 10);
            const normalizedHour = ((Number.isFinite(hourRaw) ? hourRaw : 0) % 24 + 24) % 24;
            const { dayStartHour, nightStartHour } = resolveCurrentDayNightHours();
            return (normalizedHour >= dayStartHour && normalizedHour < nightStartHour) ? "DAY" : "NIGHT";
        }

        async function setDayNightRange(dayStartHourInput, nightStartHourInput, options = {}) {
            const safeOptions = (options && typeof options === "object") ? options : {};
            const current = resolveCurrentDayNightHours();
            const nextDayStartHour = sanitizeDayNightHour(dayStartHourInput, current.dayStartHour);
            const nextNightStartHour = sanitizeDayNightHour(nightStartHourInput, current.nightStartHour);
            if (nextNightStartHour <= nextDayStartHour) {
                if (safeOptions.showToast !== false) {
                    const toastMessage = dep.t("toast_day_night_invalid_order") || "Invalid day/night order";
                    dep.showToast(toastMessage, { type: "error" });
                }
                return {
                    ok: false,
                    dayStartHour: current.dayStartHour,
                    nightStartHour: current.nightStartHour
                };
            }

            patchState({
                dayStartHour: nextDayStartHour,
                nightStartHour: nextNightStartHour
            });

            if (safeOptions.rerender !== false) {
                dep.updateClocks();
            }
            if (safeOptions.persist !== false) {
                const saveResult = dep.savePersistence();
                if (saveResult && typeof saveResult.then === "function") {
                    await saveResult;
                }
            }

            return {
                ok: true,
                dayStartHour: nextDayStartHour,
                nightStartHour: nextNightStartHour
            };
        }

        function sanitizeUiScalePercent(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getUiScaleDefaultPercent();
            const clamped = Math.min(getUiScaleMaxPercent(), Math.max(getUiScaleMinPercent(), parsed));
            const options = getUiScalePercentOptions();
            return options.reduce((closest, percent) => (
                Math.abs(percent - clamped) < Math.abs(closest - clamped) ? percent : closest
            ), options[0]);
        }

        async function applyUiScale(scalePercent, persist = true) {
            const safePercent = sanitizeUiScalePercent(scalePercent);
            const nextScale = safePercent / 100;
            patchState({ uiScale: nextScale });
            const documentRef = getDocumentRef();

            if (documentRef?.documentElement) {
                documentRef.documentElement.style.setProperty("--ui-zoom", nextScale.toFixed(2));
                documentRef.documentElement.style.zoom = String(nextScale);
                documentRef.documentElement.style.overflow = "hidden";
            }
            if (documentRef?.body) {
                documentRef.body.style.overflow = "hidden";
            }

            if (persist) {
                await awaitIfPromiseLike(dep.setStorageValue(safeDeps.UI_SCALE_STORAGE_KEY, String(safePercent)));
            }
        }

        async function loadUiScalePreference() {
            const val = await dep.getStorageValue(safeDeps.UI_SCALE_STORAGE_KEY, getUiScaleDefaultPercent());
            return sanitizeUiScalePercent(val);
        }

        function populateUiScaleSelect(selectEl) {
            if (!selectEl) return;
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return;
            selectEl.textContent = "";
            getUiScalePercentOptions().forEach((percent) => {
                const option = documentRef.createElement("option");
                option.value = String(percent);
                option.textContent = `${percent}%`;
                selectEl.appendChild(option);
            });
        }

        function sanitizeTheme(theme) {
            const safeList = Array.isArray(safeDeps.THEME_LIST) ? safeDeps.THEME_LIST : ["dark"];
            return safeList.includes(theme) ? theme : "dark";
        }

        async function applyTheme(theme, persist = true) {
            const nextTheme = sanitizeTheme(theme);
            patchState({ currentTheme: nextTheme });
            const documentRef = getDocumentRef();
            if (documentRef?.documentElement) {
                documentRef.documentElement.setAttribute("data-theme", nextTheme);
            }
            if (persist) {
                await awaitIfPromiseLike(dep.setStorageValue(safeDeps.THEME_STORAGE_KEY, nextTheme));
            }
        }

        async function loadThemePreference() {
            const val = await dep.getStorageValue(safeDeps.THEME_STORAGE_KEY, "dark");
            return sanitizeTheme(val);
        }

        function setCurrentLang(lang) {
            const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object") ? safeDeps.I18N_DATA : {};
            const nextLang = i18nData[lang] ? lang : "ko";
            patchState({ currentLang: nextLang });
            const documentRef = getDocumentRef();
            if (documentRef?.documentElement) {
                documentRef.documentElement.lang = nextLang;
            }
        }

        return Object.freeze({
            sanitizeUiScalePercent,
            applyUiScale,
            loadUiScalePreference,
            populateUiScaleSelect,
            sanitizeDayNightHour,
            populateDayNightHourSelect,
            getDayStartHour,
            getNightStartHour,
            getDayNightMarkerByHour,
            setDayNightRange,
            sanitizeTheme,
            applyTheme,
            loadThemePreference,
            setCurrentLang
        });
    }

    globalObj.GTVUiPreferencesState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
