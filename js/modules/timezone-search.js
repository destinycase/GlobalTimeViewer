(function initGtvTimezoneSearch(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let standardTimezoneEntriesCache = null;
        let standardTimezoneEntriesCacheYear = null;
        let standardTimezoneWarmupQueued = false;
        let fullTimezoneOverlayStandardEntries = [];
        let fullTimezoneOverlayCountryEntries = [];
        let fullTimezoneOverlayActiveTab = "standard";
        let generatedTimezoneIdSeq = 0;

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getTZDatabase() {
            return Array.isArray(safeDeps.TZ_DATABASE) ? safeDeps.TZ_DATABASE : [];
        }

        function getZoneMap() {
            const zoneMapFromDep = invokeDep("getZoneMap");
            if (zoneMapFromDep && typeof zoneMapFromDep === "object") return zoneMapFromDep;
            return (safeDeps.ZONE_MAP && typeof safeDeps.ZONE_MAP === "object") ? safeDeps.ZONE_MAP : {};
        }

        function getCurrentLang() {
            const lang = invokeDep("getCurrentLang");
            return lang === "en" ? "en" : "ko";
        }

        function getLocalizedTZLabel(tzData) {
            const localized = invokeDep("getLocalizedTZLabel", tzData);
            if (typeof localized === "string" && localized.trim()) return localized;
            if (!tzData || typeof tzData !== "object") return "";
            if (getCurrentLang() === "en") {
                const en = String(tzData.name_en || tzData.name || "").trim();
                const cityEn = String(tzData.city_en || tzData.city || "").trim();
                if (en && cityEn) return `${en} - ${cityEn}`;
                return en || cityEn || String(tzData.zone || "");
            }
            const ko = String(tzData.name || tzData.name_ko || "").trim();
            const city = String(tzData.city || tzData.city_ko || "").trim();
            if (ko && city) return `${ko} - ${city}`;
            return ko || city || String(tzData.zone || "");
        }

        function getTimezoneOffsetSafe(zone, date) {
            const offset = invokeDep("getTimezoneOffset", zone, date);
            return Number.isFinite(offset) ? offset : Number.NaN;
        }

        function getBetterAbbrSafe(zone, date) {
            const value = invokeDep("getBetterAbbr", zone, date);
            return String(value || "").trim();
        }

        function translate(key) {
            const translated = invokeDep("t", key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function createUniqueTimezoneId(prefix = "tz") {
            const id = invokeDep("createUniqueTimezoneId", prefix);
            if (typeof id === "string" && id.trim()) return id;
            generatedTimezoneIdSeq += 1;
            return `${prefix}-${Date.now()}-${generatedTimezoneIdSeq}`;
        }

        function formatUtcOffsetLabel(totalMinutes = 0) {
            const safeTotalMinutes = Number.isFinite(totalMinutes) ? Math.trunc(totalMinutes) : 0;
            const sign = safeTotalMinutes >= 0 ? "+" : "-";
            const abs = Math.abs(safeTotalMinutes);
            const hh = String(Math.floor(abs / 60)).padStart(2, "0");
            const mm = String(abs % 60).padStart(2, "0");
            return `UTC${sign}${hh}:${mm}`;
        }

        function getZoneStandardDaylightOffsets(zone) {
            const safeZone = (typeof zone === "string") ? zone.trim() : "";
            if (!safeZone) return { standard: null, daylight: null };
            try {
                const now = new Date();
                const year = now.getUTCFullYear();
                const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
                const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
                const janOffset = getTimezoneOffsetSafe(safeZone, jan);
                const julOffset = getTimezoneOffsetSafe(safeZone, jul);
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset)) {
                    return { standard: null, daylight: null };
                }
                if (janOffset === julOffset) {
                    return { standard: janOffset, daylight: null };
                }
                return {
                    standard: Math.min(janOffset, julOffset),
                    daylight: Math.max(janOffset, julOffset)
                };
            } catch (err) {
                return { standard: null, daylight: null };
            }
        }

        function normalizeZoneAbbreviation(value) {
            return String(value || "").replace("GMT", "UTC").trim().toUpperCase();
        }

        function getAllSupportedTimezoneNames() {
            try {
                if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
                    const values = Intl.supportedValuesOf("timeZone");
                    if (Array.isArray(values) && values.length) return values;
                }
            } catch (err) {
                // Fallback below.
            }
            const fallback = new Set(["UTC"]);
            getTZDatabase().forEach((tzData) => {
                if (tzData?.zone) fallback.add(tzData.zone);
            });
            return [...fallback];
        }

        function getSortedTZData(list) {
            const locale = getCurrentLang() === "en" ? "en-US" : "ko-KR";
            return [...list].sort((a, b) =>
                getLocalizedTZLabel(a).localeCompare(getLocalizedTZLabel(b), locale, { sensitivity: "base", numeric: true })
            );
        }

        function getSelectableTZEntries() {
            const entries = [];
            const zoneMap = getZoneMap();
            getSortedTZData(getTZDatabase()).forEach((tzData) => {
                const mapping = zoneMap[tzData.zone];
                if (Array.isArray(mapping) && mapping.length >= 2) {
                    const offsets = getZoneStandardDaylightOffsets(tzData.zone);
                    if (Number.isFinite(offsets.daylight) && Number.isFinite(offsets.standard) && offsets.daylight !== offsets.standard) {
                        entries.push({
                            ...tzData,
                            kind: "country_region",
                            key: `${tzData.zone}|dst`,
                            abbr: normalizeZoneAbbreviation(mapping[1]),
                            fixedOffsetMinutes: offsets.daylight
                        });
                        entries.push({
                            ...tzData,
                            kind: "country_region",
                            key: `${tzData.zone}|std`,
                            abbr: normalizeZoneAbbreviation(mapping[0]),
                            fixedOffsetMinutes: offsets.standard
                        });
                        return;
                    }
                }

                const baseAbbr = Array.isArray(mapping)
                    ? normalizeZoneAbbreviation(mapping[0])
                    : normalizeZoneAbbreviation(mapping || getBetterAbbrSafe(tzData.zone, new Date()));
                entries.push({
                    ...tzData,
                    kind: "country_region",
                    key: `${tzData.zone}|auto`,
                    abbr: baseAbbr || normalizeZoneAbbreviation(getBetterAbbrSafe(tzData.zone, new Date())),
                    fixedOffsetMinutes: null
                });
            });
            return entries;
        }

        function getStandardTimezoneEntries() {
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            if (standardTimezoneEntriesCacheYear === currentYear && Array.isArray(standardTimezoneEntriesCache)) {
                return standardTimezoneEntriesCache.map((entry) => ({ ...entry }));
            }

            const entries = [];
            const seen = new Set();

            const pushEntry = (abbrValue, offsetMinutes, zone = "UTC") => {
                if (!Number.isFinite(offsetMinutes)) return;
                const safeOffset = Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(offsetMinutes)));
                const abbr = normalizeZoneAbbreviation(abbrValue) || formatUtcOffsetLabel(safeOffset);
                const dedupeKey = `${abbr}|${safeOffset}`;
                if (seen.has(dedupeKey)) return;
                seen.add(dedupeKey);
                entries.push({
                    kind: "standard_list",
                    key: `std:${abbr}:${safeOffset}`,
                    zone,
                    abbr,
                    fixedOffsetMinutes: safeOffset
                });
            };

            pushEntry("UTC", 0, "UTC");

            const janDate = new Date(Date.UTC(currentYear, 0, 1, 12, 0, 0));
            const julDate = new Date(Date.UTC(currentYear, 6, 1, 12, 0, 0));
            getAllSupportedTimezoneNames().forEach((zone) => {
                if (zone === "UTC") return;
                const janOffset = getTimezoneOffsetSafe(zone, janDate);
                const julOffset = getTimezoneOffsetSafe(zone, julDate);
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset)) return;

                const janAbbr = normalizeZoneAbbreviation(getBetterAbbrSafe(zone, janDate)) || formatUtcOffsetLabel(janOffset);
                const julAbbr = normalizeZoneAbbreviation(getBetterAbbrSafe(zone, julDate)) || formatUtcOffsetLabel(julOffset);

                if (janOffset === julOffset) {
                    pushEntry(janAbbr, janOffset, zone);
                    return;
                }

                const standardOffset = Math.min(janOffset, julOffset);
                const daylightOffset = Math.max(janOffset, julOffset);
                const standardAbbr = (janOffset === standardOffset) ? janAbbr : julAbbr;
                const daylightAbbr = (janOffset === daylightOffset) ? janAbbr : julAbbr;
                pushEntry(daylightAbbr, daylightOffset, zone);
                pushEntry(standardAbbr, standardOffset, zone);
            });

            const sorted = entries.sort((a, b) => {
                const diff = a.fixedOffsetMinutes - b.fixedOffsetMinutes;
                if (diff !== 0) return diff;
                return a.abbr.localeCompare(b.abbr, "en-US", { sensitivity: "base" });
            });
            standardTimezoneEntriesCache = sorted.map((entry) => ({ ...entry }));
            standardTimezoneEntriesCacheYear = currentYear;
            return sorted;
        }

        function queueStandardTimezoneWarmup() {
            const currentYear = new Date().getUTCFullYear();
            if (standardTimezoneEntriesCacheYear === currentYear && Array.isArray(standardTimezoneEntriesCache)) return;
            if (standardTimezoneWarmupQueued) return;
            standardTimezoneWarmupQueued = true;

            const warmup = () => {
                standardTimezoneWarmupQueued = false;
                try {
                    getStandardTimezoneEntries();
                } catch (err) {
                    console.warn("Failed to warm up standard timezone cache.", err);
                }
            };

            if (typeof globalObj.requestIdleCallback === "function") {
                globalObj.requestIdleCallback(warmup, { timeout: 1200 });
                return;
            }
            if (typeof globalObj.setTimeout === "function") {
                globalObj.setTimeout(warmup, 120);
                return;
            }
            warmup();
        }

        function getTimezoneEntryTitle(entry) {
            if (entry?.kind === "standard_list") {
                const offsetLabel = formatUtcOffsetLabel(entry.fixedOffsetMinutes);
                return getCurrentLang() === "en"
                    ? `${offsetLabel} Standard Time`
                    : `${offsetLabel} \uD45C\uC900\uC2DC`;
            }
            return getLocalizedTZLabel(entry);
        }

        function getSelectableTZEntryByKey(entryKey) {
            const key = (typeof entryKey === "string") ? entryKey.trim() : "";
            if (!key) return null;
            const countryEntry = getSelectableTZEntries().find((entry) => entry.key === key);
            if (countryEntry) return countryEntry;
            return getStandardTimezoneEntries().find((entry) => entry.key === key) || null;
        }

        function getSelectableTZOptionLabel(entry) {
            const line1 = getTimezoneEntryTitle(entry);
            const abbr = normalizeZoneAbbreviation(entry?.abbr);
            return abbr ? `${line1} [${abbr}]` : line1;
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            if (!entry || typeof entry !== "object") return null;
            if (entry.kind === "standard_list") {
                const abbr = normalizeZoneAbbreviation(entry.abbr);
                const fixedOffsetMinutes = Number.isFinite(entry.fixedOffsetMinutes) ? Math.trunc(entry.fixedOffsetMinutes) : null;
                const offsetLabel = formatUtcOffsetLabel(fixedOffsetMinutes);
                return {
                    id: createUniqueTimezoneId("tz"),
                    zone: entry.zone || "UTC",
                    name_ko: `${offsetLabel} \uD45C\uC900\uC2DC`,
                    name_en: `${offsetLabel} Standard Time`,
                    type: "standard",
                    fixedAbbr: abbr,
                    fixedOffsetMinutes
                };
            }
            return {
                id: createUniqueTimezoneId("tz"),
                zone: entry.zone,
                name_ko: `${entry.name} - ${entry.city}`,
                name_en: `${entry.name_en} - ${entry.city_en}`,
                type: "standard",
                fixedAbbr: normalizeZoneAbbreviation(entry.abbr),
                fixedOffsetMinutes: Number.isFinite(entry.fixedOffsetMinutes) ? entry.fixedOffsetMinutes : null
            };
        }

        function addFromSearchWithData(entryKey) {
            const entry = getSelectableTZEntryByKey(entryKey);
            const nextZone = createStandardTimezoneFromSelectableEntry(entry);
            if (nextZone) {
                invokeDep("addTimezone", {
                    ...nextZone
                });
            }
        }

        function createTimezoneListItem(tzEntry, closeOverlay = false) {
            const resolveEntryOffsetMinutes = (entry) => {
                const fixedOffsetRaw = entry?.fixedOffsetMinutes;
                const hasFixedOffsetValue = (
                    fixedOffsetRaw !== null
                    && fixedOffsetRaw !== undefined
                    && !(typeof fixedOffsetRaw === "string" && !fixedOffsetRaw.trim())
                );
                if (hasFixedOffsetValue) {
                    const fixedOffset = Number(fixedOffsetRaw);
                    if (Number.isFinite(fixedOffset)) return Math.trunc(fixedOffset);
                }
                if (entry?.zone) {
                    const liveOffset = getTimezoneOffsetSafe(entry.zone, new Date());
                    if (Number.isFinite(liveOffset)) return Math.trunc(liveOffset);
                }
                return null;
            };

            const formatOffsetBadgeLabel = (offsetMinutes) => {
                const compact = formatUtcOffsetLabel(offsetMinutes); // UTC+09:00
                return `UTC ${compact.slice(3)}`; // UTC +09:00
            };

            const toCanonicalOffsetText = (value) => String(value || "").replace(/\s+/g, "").toUpperCase();

            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            const item = doc.createElement("div");
            item.className = "tz-item";
            const title = doc.createElement("div");
            title.className = "tz-item-title";
            title.textContent = getTimezoneEntryTitle(tzEntry);
            const abbr = doc.createElement("div");
            abbr.className = "tz-item-abbr";
            const abbrText = tzEntry?.kind === "standard_list"
                ? formatUtcOffsetLabel(tzEntry?.fixedOffsetMinutes)
                : (
                    normalizeZoneAbbreviation(tzEntry?.abbr)
                    || normalizeZoneAbbreviation(getBetterAbbrSafe(tzEntry?.zone, new Date()))
                    || "UTC"
                );
            if (tzEntry?.kind === "standard_list") {
                abbr.textContent = `[${abbrText}]`;
            } else {
                const offsetMinutes = resolveEntryOffsetMinutes(tzEntry);
                if (Number.isFinite(offsetMinutes)) {
                    const offsetText = formatOffsetBadgeLabel(offsetMinutes);
                    if (toCanonicalOffsetText(abbrText) === toCanonicalOffsetText(offsetText)) {
                        abbr.textContent = `[${abbrText}]`;
                    } else {
                        abbr.textContent = `[${abbrText}] [${offsetText}]`;
                    }
                } else {
                    abbr.textContent = `[${abbrText}]`;
                }
            }
            item.appendChild(title);
            item.appendChild(abbr);
            item.addEventListener("click", () => {
                addFromSearchWithData(tzEntry.key);
                if (closeOverlay) {
                    const overlay = doc.getElementById?.("full-tz-overlay");
                    if (overlay) overlay.style.display = "none";
                }
            });
            return item;
        }

        function sanitizeFullTimezoneOverlayTab(value) {
            return value === "country" ? "country" : "standard";
        }

        function renderFullTimezoneOverlayList() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const list = doc.getElementById("full-tz-list");
            if (!list) return;

            list.innerHTML = "";
            const entries = fullTimezoneOverlayActiveTab === "country"
                ? fullTimezoneOverlayCountryEntries
                : fullTimezoneOverlayStandardEntries;
            entries.forEach((entry) => {
                const item = createTimezoneListItem(entry, true);
                if (item) list.appendChild(item);
            });
        }

        function updateFullTimezoneOverlayTabButtons() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const standardTabBtn = doc.getElementById("tz-tab-standard");
            const countryTabBtn = doc.getElementById("tz-tab-country");
            if (standardTabBtn) {
                standardTabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === "standard");
                standardTabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === "standard" ? "true" : "false");
            }
            if (countryTabBtn) {
                countryTabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === "country");
                countryTabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === "country" ? "true" : "false");
            }
        }

        function setFullTimezoneOverlayTab(value) {
            fullTimezoneOverlayActiveTab = sanitizeFullTimezoneOverlayTab(value);
            updateFullTimezoneOverlayTabButtons();
            renderFullTimezoneOverlayList();
        }

        function updateTZDropdown() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;
            const quickSelect = doc.getElementById("tz-quick-select");
            if (!quickSelect) return;
            const placeholder = quickSelect.options?.[0] || null;
            quickSelect.textContent = "";
            if (placeholder) quickSelect.appendChild(placeholder);

            const utcOption = doc.createElement("option");
            utcOption.value = "UTC";
            utcOption.textContent = translate("utc_name");
            quickSelect.appendChild(utcOption);

            getSelectableTZEntries().forEach((entry) => {
                const option = doc.createElement("option");
                option.value = entry.key;
                option.textContent = getSelectableTZOptionLabel(entry);
                quickSelect.appendChild(option);
            });
            invokeDep("adjustSelectWidthForContent", quickSelect, 118);
        }

        function initSearchAndSelect() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const quickSelect = doc.getElementById("tz-quick-select");
            if (!quickSelect) return;

            updateTZDropdown();

            quickSelect.onchange = (e) => {
                const value = e?.target?.value;
                if (value === "UTC") {
                    const activeGroup = invokeDep("getCurrentGroup");
                    if (activeGroup) {
                        activeGroup.showUtcRow = true;
                        if (!Number.isFinite(parseInt(activeGroup.utcRowOrder, 10))) {
                            activeGroup.utcRowOrder = 0;
                        }
                        invokeDep("savePersistence");
                        invokeDep("renderList");
                    }
                    quickSelect.value = "";
                    return;
                }
                const entry = getSelectableTZEntryByKey(value);
                if (entry) addFromSearchWithData(entry.key);
                quickSelect.value = "";
            };

            const showAllBtn = doc.getElementById("show-all-tz");
            if (showAllBtn) {
                showAllBtn.onclick = () => {
                    const overlay = doc.getElementById("full-tz-overlay");
                    if (!overlay) return;
                    fullTimezoneOverlayStandardEntries = getStandardTimezoneEntries();
                    fullTimezoneOverlayCountryEntries = getSelectableTZEntries();
                    setFullTimezoneOverlayTab("standard");
                    overlay.style.display = "flex";
                };
            }

            const standardTabBtn = doc.getElementById("tz-tab-standard");
            const countryTabBtn = doc.getElementById("tz-tab-country");
            if (standardTabBtn) {
                standardTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("standard"));
            }
            if (countryTabBtn) {
                countryTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("country"));
            }

            const closeOverlayBtn = doc.getElementById("close-overlay");
            if (closeOverlayBtn) {
                closeOverlayBtn.onclick = () => {
                    const overlay = doc.getElementById("full-tz-overlay");
                    if (overlay) overlay.style.display = "none";
                };
            }
        }

        return Object.freeze({
            formatUtcOffsetLabel,
            normalizeZoneAbbreviation,
            getAllSupportedTimezoneNames,
            getSelectableTZEntries,
            getStandardTimezoneEntries,
            queueStandardTimezoneWarmup,
            getTimezoneEntryTitle,
            getSelectableTZEntryByKey,
            getSelectableTZOptionLabel,
            sanitizeFullTimezoneOverlayTab,
            renderFullTimezoneOverlayList,
            updateFullTimezoneOverlayTabButtons,
            setFullTimezoneOverlayTab,
            updateTZDropdown,
            initSearchAndSelect,
            createStandardTimezoneFromSelectableEntry,
            addFromSearchWithData
        });
    }

    globalObj.GTVTimezoneSearch = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

