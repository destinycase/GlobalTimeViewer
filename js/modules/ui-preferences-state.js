(function initGtvUiPreferencesState(globalObj) {
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

        function readState() {
            const state = invokeDep("getState");
            if (!state || typeof state !== "object") {
                return {
                    uiScale: 1.0,
                    currentTheme: "dark",
                    currentLang: "ko"
                };
            }
            return state;
        }

        function patchState(next = {}) {
            if (!next || typeof next !== "object") return;
            invokeDep("setState", next);
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

            if (document.documentElement) {
                document.documentElement.style.setProperty("--ui-zoom", nextScale.toFixed(2));
                document.documentElement.style.zoom = String(nextScale);
                document.documentElement.style.overflow = "hidden";
            }
            if (document.body) {
                document.body.style.overflow = "hidden";
            }

            if (persist) {
                await invokeDep("setStorageValue", safeDeps.UI_SCALE_STORAGE_KEY, String(safePercent));
            }
        }

        async function loadUiScalePreference() {
            const val = await invokeDep("getStorageValue", safeDeps.UI_SCALE_STORAGE_KEY, getUiScaleDefaultPercent());
            return sanitizeUiScalePercent(val);
        }

        function populateUiScaleSelect(selectEl) {
            if (!selectEl) return;
            selectEl.textContent = "";
            getUiScalePercentOptions().forEach((percent) => {
                const option = document.createElement("option");
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
            if (document.documentElement) {
                document.documentElement.setAttribute("data-theme", nextTheme);
            }
            if (persist) {
                await invokeDep("setStorageValue", safeDeps.THEME_STORAGE_KEY, nextTheme);
            }
        }

        async function loadThemePreference() {
            const val = await invokeDep("getStorageValue", safeDeps.THEME_STORAGE_KEY, "dark");
            return sanitizeTheme(val);
        }

        function setCurrentLang(lang) {
            const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object") ? safeDeps.I18N_DATA : {};
            const nextLang = i18nData[lang] ? lang : "ko";
            patchState({ currentLang: nextLang });
            if (document.documentElement) {
                document.documentElement.lang = nextLang;
            }
        }

        return Object.freeze({
            sanitizeUiScalePercent,
            applyUiScale,
            loadUiScalePreference,
            populateUiScaleSelect,
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
