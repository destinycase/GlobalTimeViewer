(function initGtvSettingsIo(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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
            if (typeof document !== "undefined" && document && typeof document.getElementById === "function") {
                return document;
            }
            return null;
        }

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof globalObj?.console?.warn === "function") {
                globalObj.console.warn(...args);
                return;
            }
            if (typeof console?.warn === "function") {
                console.warn(...args);
            }
        }

        function createPersistenceWriteError(message, cause = null) {
            const err = new Error(message || "Failed to persist imported settings payload");
            err.code = "PERSISTENCE_WRITE_FAILED";
            err.cause = cause || null;
            return err;
        }

        async function persistPreferenceValue(storageKey, value) {
            const writeResult = await safeDeps.setStorageValue(storageKey, value, { suppressToast: true });
            if (!writeResult || writeResult.ok !== true) {
                throw createPersistenceWriteError(`Failed to persist preference key: ${storageKey}`, writeResult?.error || null);
            }
        }

        async function ensurePersistenceSaved() {
            const ok = await safeDeps.savePersistence();
            if (!ok) {
                throw createPersistenceWriteError("Failed to persist normalized imported settings");
            }
        }

        function ensureImportedGroupsFallbackToStandardTime() {
            let changed = false;
            const groups = Array.isArray(safeDeps.getGroups()) ? safeDeps.getGroups() : [];
            groups.forEach((group) => {
                if (!group || typeof group !== "object") return;
                const zoneCount = Array.isArray(group.zones) ? group.zones.length : 0;
                if (zoneCount > 0) return;

                if (safeDeps.sanitizeBaseTimezoneId(group.baseTimezoneId) !== "utc") {
                    group.baseTimezoneId = "utc";
                    changed = true;
                }
                if (group.showUtcRow === false) {
                    group.showUtcRow = true;
                    changed = true;
                }
                if (safeDeps.sanitizeUtcRowOrder(group.utcRowOrder) !== 0) {
                    group.utcRowOrder = 0;
                    changed = true;
                }
            });
            return changed;
        }

        function clampGroupIndex(value, groupsLength, fallback = 0) {
            const safeLength = Number.isFinite(groupsLength) ? Math.max(1, Math.trunc(groupsLength)) : 1;
            const parsed = parseInt(value, 10);
            const fallbackParsed = parseInt(fallback, 10);
            const safeValue = Number.isFinite(parsed) ? parsed : (Number.isFinite(fallbackParsed) ? fallbackParsed : 0);
            return Math.min(Math.max(safeValue, 0), safeLength - 1);
        }

        function buildLegacyGlobalMultiState(payload) {
            if (typeof safeDeps.sanitizeMultiStatePayload !== "function") return null;
            const normalized = safeDeps.sanitizeMultiStatePayload({
                multiRangeCount: payload?.multiRangeCount,
                multiRanges: payload?.multiRanges,
                multiRangeCollapsed: payload?.multiRangeCollapsed,
                multiRangeStartEditEnabled: payload?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: payload?.multiRangeEndEditEnabled
            }, null);
            if (!normalized || typeof normalized !== "object") return null;
            if (typeof safeDeps.sanitizeMultiRangeTitle === "function") {
                normalized.multiRangeTitle = safeDeps.sanitizeMultiRangeTitle(payload?.multiRangeTitle);
            }
            return normalized;
        }

        function createFallbackImportedGroup(legacyGlobalMultiState = null) {
            const translatedDefaultName = (typeof safeDeps.t === "function") ? safeDeps.t("default_group_name") : "Group";
            const safeDefaultName = (typeof translatedDefaultName === "string" && translatedDefaultName.trim())
                ? translatedDefaultName.trim()
                : "Group";
            const rawFallback = {
                name: safeDefaultName,
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof safeDeps.getDefaultFixedDate === "function")
                    ? safeDeps.getDefaultFixedDate()
                    : "",
                fixedTimeShowLiveNow: false,
                fixedTimes: (typeof safeDeps.getDefaultFixedTimes === "function")
                    ? safeDeps.getDefaultFixedTimes()
                    : []
            };
            if (typeof safeDeps.sanitizeGroup === "function") {
                const sanitized = safeDeps.sanitizeGroup(rawFallback, 0, legacyGlobalMultiState);
                if (sanitized && typeof sanitized === "object") return sanitized;
            }
            return rawFallback;
        }

        function sanitizeImportedGroups(payload) {
            const sourceGroups = Array.isArray(payload?.groups) ? payload.groups : [];
            const legacyGlobalMultiState = buildLegacyGlobalMultiState(payload);
            if (typeof safeDeps.sanitizeGroup !== "function") {
                const fallbackGroups = sourceGroups
                    .filter((group) => !!group && typeof group === "object")
                    .map((group) => ({ ...group }));
                if (fallbackGroups.length) return fallbackGroups;
                return [createFallbackImportedGroup(legacyGlobalMultiState)];
            }

            const sanitized = sourceGroups
                .map((group, idx) => safeDeps.sanitizeGroup(group, idx, legacyGlobalMultiState))
                .filter((group) => !!group && typeof group === "object");

            if (sanitized.length) return sanitized;
            return [createFallbackImportedGroup(legacyGlobalMultiState)];
        }

        function sanitizeImportedMainTab(tabValue) {
            if (typeof safeDeps.sanitizeMainTab === "function") {
                return safeDeps.sanitizeMainTab(tabValue);
            }
            const normalized = (typeof tabValue === "string") ? tabValue.trim() : "";
            if (normalized === "live" || normalized === "fixed" || normalized === "multi" || normalized === "fixed-time" || normalized === "calc") {
                return normalized;
            }
            return "live";
        }

        function buildSanitizedImportPayload(payload) {
            const groups = sanitizeImportedGroups(payload);
            const activeGroupId = clampGroupIndex(payload?.activeGroupId, groups.length, 0);
            const currentMainTab = sanitizeImportedMainTab(payload?.currentMainTab);
            const parsedDayStartHour = Number.parseInt(payload?.dayStartHour, 10);
            const parsedNightStartHour = Number.parseInt(payload?.nightStartHour, 10);
            const defaultDayStartHour = Number.parseInt(safeDeps.DEFAULT_DAY_START_HOUR, 10);
            const defaultNightStartHour = Number.parseInt(safeDeps.DEFAULT_NIGHT_START_HOUR, 10);
            const safeDayStartHour = Math.min(
                23,
                Math.max(
                    0,
                    Number.isFinite(parsedDayStartHour)
                        ? parsedDayStartHour
                        : (Number.isFinite(defaultDayStartHour) ? defaultDayStartHour : 6)
                )
            );
            const safeNightStartHour = Math.min(
                23,
                Math.max(
                    0,
                    Number.isFinite(parsedNightStartHour)
                        ? parsedNightStartHour
                        : (Number.isFinite(defaultNightStartHour) ? defaultNightStartHour : 18)
                )
            );
            const dayNightRange = (safeNightStartHour <= safeDayStartHour)
                ? {
                    dayStartHour: Number.isFinite(defaultDayStartHour) ? Math.min(23, Math.max(0, defaultDayStartHour)) : 6,
                    nightStartHour: Number.isFinite(defaultNightStartHour) ? Math.min(23, Math.max(0, defaultNightStartHour)) : 18
                }
                : { dayStartHour: safeDayStartHour, nightStartHour: safeNightStartHour };

            const rawGroupMap = (payload?.activeGroupIdByMainTab && typeof payload.activeGroupIdByMainTab === "object")
                ? payload.activeGroupIdByMainTab
                : null;
            const activeGroupIdByMainTab = {
                live: clampGroupIndex(rawGroupMap?.live, groups.length, activeGroupId),
                fixed: clampGroupIndex(rawGroupMap?.fixed, groups.length, activeGroupId)
            };

            const parsedSlotCount = parseInt(payload?.slotCount, 10);
            const slotCount = Number.isFinite(parsedSlotCount) ? Math.min(2, Math.max(1, parsedSlotCount)) : 1;

            let baseTimezoneId = "utc";
            if (typeof safeDeps.sanitizeBaseTimezoneId === "function") {
                baseTimezoneId = safeDeps.sanitizeBaseTimezoneId(payload?.baseTimezoneId);
                if (baseTimezoneId !== "utc") {
                    const activeGroup = groups[activeGroupId];
                    const zones = Array.isArray(activeGroup?.zones) ? activeGroup.zones : [];
                    const found = zones.some((zone) => zone && zone.id === baseTimezoneId);
                    if (!found) baseTimezoneId = "utc";
                }
            }

            return {
                groups,
                activeGroupId,
                currentMainTab,
                activeGroupIdByMainTab,
                slotCount,
                baseTimezoneId,
                showCopyFormat: !!payload?.showCopyFormat,
                showTimeline: !!payload?.showTimeline,
                displayFormatOrder: payload?.displayFormatOrder,
                displayFormatEnabled: payload?.displayFormatEnabled,
                displayTimePartsEnabled: payload?.displayTimePartsEnabled,
                copyFormatOrder: payload?.copyFormatOrder,
                copyFormatEnabled: payload?.copyFormatEnabled,
                copyTimePartsEnabled: payload?.copyTimePartsEnabled,
                formatProfiles: payload?.formatProfiles,
                activeFormatProfileContext: payload?.activeFormatProfileContext,
                timeAdjustDayStepBySlot: payload?.timeAdjustDayStepBySlot,
                dayStartHour: dayNightRange.dayStartHour,
                nightStartHour: dayNightRange.nightStartHour,
                multiRangeCount: payload?.multiRangeCount,
                multiRangeTitle: payload?.multiRangeTitle,
                multiRanges: payload?.multiRanges,
                multiRangeCollapsed: payload?.multiRangeCollapsed,
                multiRangeStartEditEnabled: payload?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: payload?.multiRangeEndEditEnabled
            };
        }

        function normalizeImportPayload(payload) {
            if (typeof safeDeps.normalizeImportedPayload === "function") {
                try {
                    const normalized = safeDeps.normalizeImportedPayload(payload);
                    if (normalized && typeof normalized === "object") return normalized;
                } catch (err) {
                    logWarn("normalizeImportedPayload failed. Falling back to local import sanitization.", err);
                }
            }
            return buildSanitizedImportPayload(payload);
        }

        async function applyImportedSettings(importedRoot) {
            const rawPayload = (importedRoot && typeof importedRoot === "object" && importedRoot.data && typeof importedRoot.data === "object")
                ? importedRoot.data
                : importedRoot;
            if (!rawPayload || typeof rawPayload !== "object") {
                throw new Error("Invalid settings payload");
            }
            if (!Array.isArray(rawPayload.groups)) {
                throw new Error("Invalid settings payload: groups is required");
            }

            const pref = (importedRoot && typeof importedRoot === "object" && importedRoot.preferences && typeof importedRoot.preferences === "object")
                ? importedRoot.preferences
                : importedRoot;
            const payload = { ...rawPayload };
            if (payload.dayStartHour === undefined && pref && pref.dayStartHour !== undefined) {
                payload.dayStartHour = pref.dayStartHour;
            }
            if (payload.nightStartHour === undefined && pref && pref.nightStartHour !== undefined) {
                payload.nightStartHour = pref.nightStartHour;
            }

            const sanitizedPayload = normalizeImportPayload(payload);
            const writeResult = await safeDeps.persistStorageSnapshot(sanitizedPayload, { suppressToast: true });
            if (!writeResult.ok) {
                throw createPersistenceWriteError("Failed to persist imported settings payload", writeResult.error);
            }

            if (pref && typeof pref === "object") {
                if (typeof pref.theme === "string") {
                    await persistPreferenceValue(safeDeps.THEME_STORAGE_KEY, safeDeps.sanitizeTheme(pref.theme));
                }
                if (typeof pref.language === "string" && safeDeps.I18N_DATA[pref.language]) {
                    await persistPreferenceValue(safeDeps.LANG_STORAGE_KEY, pref.language);
                }
                if (pref.uiScale !== undefined) {
                    await persistPreferenceValue(safeDeps.UI_SCALE_STORAGE_KEY, String(safeDeps.sanitizeUiScalePercent(pref.uiScale)));
                }
            }

            const nextLang = await safeDeps.getStorageValue(safeDeps.LANG_STORAGE_KEY, "ko");
            safeDeps.setCurrentLang(safeDeps.I18N_DATA[nextLang] ? nextLang : "ko");
            await safeDeps.loadPersistence();
            if (safeDeps.localizeAutoGeneratedNamesForCurrentLanguage()) {
                await ensurePersistenceSaved();
            }
            if (ensureImportedGroupsFallbackToStandardTime()) {
                await ensurePersistenceSaved();
            }
            await safeDeps.applyTheme(await safeDeps.loadThemePreference(), false);
            await safeDeps.applyUiScale(await safeDeps.loadUiScalePreference(), false);
            safeDeps.applyTranslations();
            safeDeps.applyVersionBranding();

            const doc = getDocumentRef();
            const langSelect = doc?.getElementById?.("lang-select");
            if (langSelect) langSelect.value = safeDeps.getCurrentLang();

            const themeSelect = doc?.getElementById?.("theme-select");
            if (themeSelect) themeSelect.value = safeDeps.getCurrentTheme();
            const uiScaleSelect = doc?.getElementById?.("ui-scale-select");
            if (uiScaleSelect) {
                safeDeps.populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(safeDeps.getCurrentUiScalePercent());
            }
            const dayStartSelect = doc?.getElementById?.("day-start-select");
            if (dayStartSelect) {
                if (typeof safeDeps.populateDayNightHourSelect === "function") {
                    safeDeps.populateDayNightHourSelect(dayStartSelect);
                }
                if (typeof safeDeps.getDayStartHour === "function") {
                    dayStartSelect.value = String(safeDeps.getDayStartHour());
                }
            }
            const nightStartSelect = doc?.getElementById?.("night-start-select");
            if (nightStartSelect) {
                if (typeof safeDeps.populateDayNightHourSelect === "function") {
                    safeDeps.populateDayNightHourSelect(nightStartSelect);
                }
                if (typeof safeDeps.getNightStartHour === "function") {
                    nightStartSelect.value = String(safeDeps.getNightStartHour());
                }
            }
            safeDeps.refreshMultiRangeControls();

            safeDeps.updateTZDropdown();
            safeDeps.refreshSelectWidths();
            safeDeps.switchMainTab(safeDeps.getCurrentMainTab());
        }

        return Object.freeze({
            applyImportedSettings
        });
    }

    globalObj.GTVSettingsIO = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
