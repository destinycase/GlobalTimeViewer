(function initGtvMainRowViewServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const rowViewCache = (safeDeps.rowViewCache instanceof Map) ? safeDeps.rowViewCache : new Map();
        const maxRuntimeCacheSize = Number.isFinite(Number(safeDeps.maxRuntimeCacheSize))
            ? Math.max(1, Math.trunc(Number(safeDeps.maxRuntimeCacheSize)))
            : 4096;
        const getDocumentRef = (typeof safeDeps.getDocumentRef === "function")
            ? safeDeps.getDocumentRef
            : (() => {
                if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
                if (typeof document === "object" && document) return document;
                return null;
            });
        const getSnapshotFormatService = (typeof safeDeps.getSnapshotFormatService === "function")
            ? safeDeps.getSnapshotFormatService
            : (() => {
                if (!safeDeps.snapshotFormatService || typeof safeDeps.snapshotFormatService !== "object") return null;
                return safeDeps.snapshotFormatService;
            });
        const getGlobalTime = (typeof safeDeps.getGlobalTime === "function")
            ? safeDeps.getGlobalTime
            : (() => null);
        const getZoneDisplayName = (typeof safeDeps.getZoneDisplayName === "function")
            ? safeDeps.getZoneDisplayName
            : (() => "");
        const getZoneDisplayNameForUiAtDate = (typeof safeDeps.getZoneDisplayNameForUiAtDate === "function")
            ? safeDeps.getZoneDisplayNameForUiAtDate
            : null;
        const getCurrentLang = (typeof safeDeps.getCurrentLang === "function")
            ? safeDeps.getCurrentLang
            : (() => "en");
        const getI18nData = (typeof safeDeps.getI18nData === "function")
            ? safeDeps.getI18nData
            : (() => (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object") ? safeDeps.I18N_DATA : {});
        const isRealtime = (typeof safeDeps.isRealtime === "function")
            ? safeDeps.isRealtime
            : (() => true);
        const getSlotCount = (typeof safeDeps.getSlotCount === "function")
            ? safeDeps.getSlotCount
            : (() => 1);
        const normalizeDayNightMarker = (typeof safeDeps.normalizeDayNightMarker === "function")
            ? safeDeps.normalizeDayNightMarker
            : ((value) => String(value || "").toUpperCase());
        const getDayNightGlyph = (typeof safeDeps.getDayNightGlyph === "function")
            ? safeDeps.getDayNightGlyph
            : ((value) => String(value || ""));
        const t = (typeof safeDeps.t === "function")
            ? safeDeps.t
            : ((key) => String(key || ""));

        function getSlotZeroAnchorDate() {
            const slotZero = getGlobalTime(0);
            if (slotZero instanceof Date && Number.isFinite(slotZero.getTime())) {
                return slotZero;
            }
            return new Date();
        }

        function getRowViewState(row) {
            const rowId = String(row?.id || "");
            const cached = rowId ? rowViewCache.get(rowId) : null;
            if (cached && cached.row === row) return cached;

            const state = {
                row,
                zoneCodeEl: row.querySelector(".zone-code"),
                zoneNameEl: row.querySelector(".zone-name"),
                offsetTextEl: row.querySelector(".offset-text"),
                periodEl: row.querySelector(".period-days-text"),
                periodTimeEl: row.querySelector(".period-time-text"),
                slotInputs: new Map(),
                slotDayBadges: new Map(),
                slotDnIcons: new Map()
            };

            if (rowId) {
                if (rowViewCache.size >= maxRuntimeCacheSize) {
                    const oldestKey = rowViewCache.keys().next().value;
                    if (oldestKey !== undefined) rowViewCache.delete(oldestKey);
                }
                rowViewCache.set(rowId, state);
            }
            return state;
        }

        function getSlotElementsForRow(rowViewState, slotIdx) {
            let inputs = rowViewState.slotInputs.get(slotIdx);
            if (!inputs) {
                inputs = [...rowViewState.row.querySelectorAll(`.time-input[data-slot="${slotIdx}"]`)];
                rowViewState.slotInputs.set(slotIdx, inputs);
            }

            let dayBadges = rowViewState.slotDayBadges.get(slotIdx);
            if (!dayBadges) {
                dayBadges = [...rowViewState.row.querySelectorAll(`.day-slot-${slotIdx}`)];
                rowViewState.slotDayBadges.set(slotIdx, dayBadges);
            }

            let dnIcons = rowViewState.slotDnIcons.get(slotIdx);
            if (!dnIcons) {
                dnIcons = [...rowViewState.row.querySelectorAll(`.dn-slot-${slotIdx}`)];
                rowViewState.slotDnIcons.set(slotIdx, dnIcons);
            }

            return { inputs, dayBadges, dnIcons };
        }

        function applyZoneCodeKindClass(zoneCodeEl, timezoneRef = null) {
            if (!zoneCodeEl || !zoneCodeEl.classList || typeof zoneCodeEl.classList.toggle !== "function") return;
            const isCustom = !!(timezoneRef && timezoneRef.type === "custom");
            zoneCodeEl.classList.toggle("zone-code-custom", isCustom);
            zoneCodeEl.classList.toggle("zone-code-standard", !isCustom);
        }

        function updateRow(id, timezoneRef = null) {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            const row = documentRef.getElementById(`tz-row-${id}`);
            if (!row) return;

            const snapshotService = getSnapshotFormatService();
            if (!snapshotService || typeof snapshotService.buildTimezoneComputedSnapshot !== "function") return;
            const snapshot = snapshotService.buildTimezoneComputedSnapshot(id);
            if (!snapshot) return;

            const rowViewState = getRowViewState(row);
            if (rowViewState.zoneCodeEl) {
                rowViewState.zoneCodeEl.textContent = snapshot.timezone;
                applyZoneCodeKindClass(rowViewState.zoneCodeEl, timezoneRef);
            }
            if (rowViewState.zoneNameEl) {
                const anchorDate = getSlotZeroAnchorDate();
                let nextZoneName = "";
                if (timezoneRef && typeof timezoneRef === "object") {
                    if (typeof getZoneDisplayNameForUiAtDate === "function") {
                        nextZoneName = getZoneDisplayNameForUiAtDate(timezoneRef, anchorDate) || "";
                    } else {
                        nextZoneName = getZoneDisplayName(timezoneRef) || "";
                    }
                }
                if (!nextZoneName) nextZoneName = snapshot.region || "";
                rowViewState.zoneNameEl.textContent = nextZoneName;
            }
            if (rowViewState.offsetTextEl) rowViewState.offsetTextEl.textContent = snapshot.offset;

            const i18nData = getI18nData();
            const currentLang = getCurrentLang();
            const dayNames = i18nData[currentLang]?.days || i18nData.en?.days || [];
            const sunName = dayNames[0] || "";
            const satName = dayNames[6] || "";
            const effectiveSlotCount = isRealtime() ? 1 : getSlotCount();
            for (let i = 0; i < effectiveSlotCount; i++) {
                const timeStr = snapshot.times[i] || "";
                const dateStr = snapshot.dates[i] || "";
                const clockStr = snapshot.clocks[i] || "";
                const dayStr = snapshot.dayNames[i] || "";
                const dayNightStatus = snapshot.dayNightIcons[i] || "DAY";
                const dayNightMarker = normalizeDayNightMarker(dayNightStatus);
                const dayNightGlyph = getDayNightGlyph(dayNightStatus);
                const { inputs, dayBadges, dnIcons } = getSlotElementsForRow(rowViewState, i);

                inputs.forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    let nextValue = timeStr;
                    if (inputMode === "date") nextValue = dateStr;
                    else if (inputMode === "time") nextValue = clockStr;
                    else if (inputMode === "none") nextValue = "";
                    if (documentRef.activeElement !== input) {
                        input.value = nextValue;
                    }
                });

                dayBadges.forEach((dayBadge) => {
                    dayBadge.textContent = dayStr;
                    const isSun = dayStr === sunName;
                    const isSat = dayStr === satName;
                    dayBadge.className = "day-badge day-slot-" + i + (isSun ? " day-sun" : (isSat ? " day-sat" : ""));
                });

                dnIcons.forEach((dnIcon) => {
                    dnIcon.textContent = dayNightGlyph;
                    if (dayNightMarker === "DAY") dnIcon.title = t("dn_day");
                    else if (dayNightMarker === "NIGHT") dnIcon.title = t("dn_night");
                    else dnIcon.title = "";
                });
            }

            if (rowViewState.periodEl) {
                rowViewState.periodEl.textContent = snapshot.periodDays || "-";
            }

            if (rowViewState.periodTimeEl) {
                rowViewState.periodTimeEl.textContent = snapshot.periodTime || "-";
            }
        }

        return Object.freeze({
            getRowViewState,
            getSlotElementsForRow,
            updateRow
        });
    }

    globalObj.GTVMainRowViewServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
