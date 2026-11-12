(function initGtvTimezoneSearch(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let standardTimezoneEntriesCache = null;
        let standardTimezoneEntriesCacheYear = null;
        let standardTimezoneWarmupQueued = false;
        let fullTimezoneOverlayStandardEntries = [];
        let fullTimezoneOverlayCountryEntries = [];
        let fullTimezoneOverlayActiveTab = "standard";
        let fullTimezoneOverlayQuery = "";
        let generatedTimezoneIdSeq = 0;

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef.getElementById === "function") return safeDeps.documentRef;
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") return safeDeps.document;
            if (globalObj?.document && typeof globalObj.document.getElementById === "function") return globalObj.document;
            return (typeof document === "object" && document) ? document : null;
        }

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVTimezoneSearch", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "getZoneMap",
                "getCurrentLang",
                "getLocalizedTZLabel",
                "getTimezoneOffset",
                "getBetterAbbr",
                "t",
                "createUniqueTimezoneId",
                "addTimezone",
                "getCurrentGroup",
                "savePersistence",
                "renderList",
                "showToast"
            ])
        });

        function addTimezoneSafe(nextZone) {
            return dep.addTimezone(nextZone);
        }

        function getTZDatabase() {
            return Array.isArray(safeDeps.TZ_DATABASE) ? safeDeps.TZ_DATABASE : [];
        }

        function getZoneMap() {
            const zoneMapFromDep = dep.getZoneMap();
            if (zoneMapFromDep && typeof zoneMapFromDep === "object") return zoneMapFromDep;
            return (safeDeps.ZONE_MAP && typeof safeDeps.ZONE_MAP === "object") ? safeDeps.ZONE_MAP : {};
        }

        function getCurrentLang() {
            const lang = dep.getCurrentLang();
            return lang === "en" ? "en" : "ko";
        }

        function getLocalizedTZLabel(tzData) {
            const localized = dep.getLocalizedTZLabel(tzData);
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
            const offset = dep.getTimezoneOffset(zone, date);
            return Number.isFinite(offset) ? offset : Number.NaN;
        }

        function getBetterAbbrSafe(zone, date) {
            const value = dep.getBetterAbbr(zone, date);
            return String(value || "").trim();
        }

        function translate(key) {
            const translated = dep.t(key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function createUniqueTimezoneId(prefix = "tz") {
            const id = dep.createUniqueTimezoneId(prefix);
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

        function parseFixedOffsetMinutes(rawValue) {
            if (rawValue === null || rawValue === undefined) return null;
            if (typeof rawValue === "string") {
                if (!rawValue.trim()) return null;
                const parsedString = Number(rawValue);
                if (!Number.isFinite(parsedString)) return null;
                return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsedString)));
            }
            if (typeof rawValue === "number") {
                if (!Number.isFinite(rawValue)) return null;
                return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(rawValue)));
            }
            return null;
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
                // 아래 대체 경로를 사용한다.
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
            const now = new Date();
            getSortedTZData(getTZDatabase()).forEach((tzData) => {
                const mapping = zoneMap[tzData.zone];
                const hasDstMapping = Array.isArray(mapping) && mapping.length >= 2;
                const currentAbbr = normalizeZoneAbbreviation(getBetterAbbrSafe(tzData.zone, now));
                if (hasDstMapping) {
                    const offsets = getZoneStandardDaylightOffsets(tzData.zone);
                    if (Number.isFinite(offsets.daylight) && Number.isFinite(offsets.standard) && offsets.daylight !== offsets.standard) {
                        const currentOffset = getTimezoneOffsetSafe(tzData.zone, now);
                        const inDaylight = Number.isFinite(currentOffset) ? currentOffset === offsets.daylight : false;
                        const activeSuffix = inDaylight ? "dst" : "std";
                        const activeAbbr = normalizeZoneAbbreviation(inDaylight ? mapping[1] : mapping[0]);
                        entries.push({
                            ...tzData,
                            kind: "country_region",
                            key: `${tzData.zone}|${activeSuffix}`,
                            abbr: activeAbbr || currentAbbr || normalizeZoneAbbreviation(mapping[0]),
                            fixedOffsetMinutes: null
                        });
                        return;
                    }
                }

                const autoAbbr = Array.isArray(mapping)
                    ? normalizeZoneAbbreviation(mapping[0])
                    : normalizeZoneAbbreviation(mapping || currentAbbr);
                entries.push({
                    ...tzData,
                    kind: "country_region",
                    key: `${tzData.zone}|auto`,
                    abbr: autoAbbr || currentAbbr,
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

            const pushEntry = (_abbrValue, offsetMinutes, _zone = "UTC") => {
                if (!Number.isFinite(offsetMinutes)) return;
                const safeOffset = Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(offsetMinutes)));
                const abbr = safeOffset === 0 ? "UTC" : formatUtcOffsetLabel(safeOffset);
                const dedupeKey = String(safeOffset);
                if (seen.has(dedupeKey)) return;
                seen.add(dedupeKey);
                entries.push({
                    kind: "standard_list",
                    key: `std:${abbr}:${safeOffset}`,
                    zone: "UTC",
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
                    logWarn("Failed to warm up standard timezone cache.", err);
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
                const parsedOffset = parseFixedOffsetMinutes(entry.fixedOffsetMinutes);
                const offsetLabel = formatUtcOffsetLabel(parsedOffset === null ? 0 : parsedOffset);
                return getCurrentLang() === "en"
                    ? `${offsetLabel} Standard Time`
                    : `${offsetLabel} \uD45C\uC900\uC2DC`;
            }
            return getLocalizedTZLabel(entry);
        }

        function resolveTimezoneEntryOffsetMinutes(entry) {
            const fixedOffset = parseFixedOffsetMinutes(entry?.fixedOffsetMinutes);
            if (fixedOffset !== null) return fixedOffset;
            if (entry?.zone) {
                const liveOffset = getTimezoneOffsetSafe(entry.zone, new Date());
                if (Number.isFinite(liveOffset)) return Math.trunc(liveOffset);
            }
            return null;
        }

        function filterTimezoneEntries(entries, query) {
            const normalizedQuery = String(query || "").trim().toLowerCase();
            if (!normalizedQuery) return Array.isArray(entries) ? [...entries] : [];
            return (Array.isArray(entries) ? entries : []).filter((entry) => {
                const offsetMinutes = resolveTimezoneEntryOffsetMinutes(entry);
                const searchText = [
                    getTimezoneEntryTitle(entry),
                    entry?.name,
                    entry?.city,
                    entry?.name_en,
                    entry?.city_en,
                    entry?.zone,
                    normalizeZoneAbbreviation(entry?.abbr),
                    Number.isFinite(offsetMinutes) ? formatUtcOffsetLabel(offsetMinutes) : ""
                ]
                    .filter((value) => typeof value === "string" && value.trim())
                    .join(" ")
                    .toLowerCase();
                return searchText.includes(normalizedQuery);
            });
        }

        function getSelectableTZEntryByKey(entryKey) {
            const key = (typeof entryKey === "string") ? entryKey.trim() : "";
            if (!key) return null;
            const countryEntry = getSelectableTZEntries().find((entry) => entry.key === key);
            if (countryEntry) return countryEntry;
            return getStandardTimezoneEntries().find((entry) => entry.key === key) || null;
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            if (!entry || typeof entry !== "object") return null;
            if (entry.kind === "standard_list") {
                // A fixed offset without daylight saving time: stored as a custom entry, the type
                // every screen draws and calculates with its own offset ("UTC+09:00").
                const timeCore = globalObj?.GTVTimeCore || globalThis.GTVTimeCore;
                const fields = timeCore?.toCustomOffsetFields?.(entry.fixedOffsetMinutes);
                if (!fields) return null;
                return {
                    id: createUniqueTimezoneId("tz-c"),
                    type: "custom",
                    abbr: fields.abbr,
                    name: `${fields.abbr} ${translate("standard_time_suffix")}`,
                    offH: fields.offH,
                    offM: fields.offM
                };
            }
            const entryKey = (typeof entry.key === "string") ? entry.key.trim() : "";
            const isAutoEntry = entryKey.endsWith("|auto");
            const keyHasFixedVariant = entryKey.endsWith("|dst") || entryKey.endsWith("|std");
            const hasFiniteOffset = Number.isFinite(entry.fixedOffsetMinutes);
            const keepFixedFields = keyHasFixedVariant && hasFiniteOffset;
            const fixedOffsetMinutes = keepFixedFields ? entry.fixedOffsetMinutes : null;
            const fixedAbbr = keepFixedFields
                ? normalizeZoneAbbreviation(entry.abbr)
                : (isAutoEntry ? normalizeZoneAbbreviation(entry.abbr) : "");
            return {
                id: createUniqueTimezoneId("tz"),
                zone: entry.zone,
                name_ko: `${entry.name} - ${entry.city}`,
                name_en: `${entry.name_en} - ${entry.city_en}`,
                type: "standard",
                fixedAbbr,
                fixedOffsetMinutes
            };
        }

        // UTC+00:00 in the standard time list stands for the table's UTC row: it shows the row again
        // when it is hidden instead of adding a separate fixed-offset entry.
        function showUtcRowFromList() {
            const activeGroup = dep.getCurrentGroup();
            if (!activeGroup) return false;
            if (activeGroup.showUtcRow !== false) {
                dep.showToast(translate("toast_timezone_duplicate"), { type: "info" });
                return false;
            }
            activeGroup.showUtcRow = true;
            if (!Number.isFinite(parseInt(activeGroup.utcRowOrder, 10))) activeGroup.utcRowOrder = 0;
            dep.savePersistence();
            dep.renderList();
            return true;
        }

        function addFromSearchWithData(entryKey) {
            const entry = getSelectableTZEntryByKey(entryKey);
            if (entry?.kind === "standard_list" && parseFixedOffsetMinutes(entry.fixedOffsetMinutes) === 0) {
                return showUtcRowFromList();
            }
            const nextZone = createStandardTimezoneFromSelectableEntry(entry);
            if (!nextZone) return false;
            if (nextZone.type === "custom") {
                // The same offset already in the group gets the usual timezone notice.
                const zones = dep.getCurrentGroup()?.zones;
                const exists = Array.isArray(zones) && zones.some((zone) => zone?.type === "custom"
                    && String(zone.abbr || "").toUpperCase() === nextZone.abbr);
                if (exists) {
                    dep.showToast(translate("toast_timezone_duplicate"), { type: "info" });
                    return false;
                }
            }
            return addTimezoneSafe({ ...nextZone }) !== false;
        }

        function createTimezoneListItem(tzEntry, closeOverlay = false) {
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
                ? formatUtcOffsetLabel(parseFixedOffsetMinutes(tzEntry?.fixedOffsetMinutes) ?? 0)
                : (
                    normalizeZoneAbbreviation(tzEntry?.abbr)
                    || normalizeZoneAbbreviation(getBetterAbbrSafe(tzEntry?.zone, new Date()))
                    || "UTC"
                );
            if (tzEntry?.kind === "standard_list") {
                abbr.textContent = `[${abbrText}]`;
            } else {
                const offsetMinutes = resolveTimezoneEntryOffsetMinutes(tzEntry);
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
                    closeFullTimezoneOverlay();
                }
            });
            return item;
        }

        function sanitizeFullTimezoneOverlayTab(value) {
            return (value === "country" || value === "custom") ? value : "standard";
        }

        function getActiveFullTimezoneOverlayEntries() {
            const sourceEntries = fullTimezoneOverlayActiveTab === "country"
                ? fullTimezoneOverlayCountryEntries
                : fullTimezoneOverlayStandardEntries;
            return filterTimezoneEntries(sourceEntries, fullTimezoneOverlayQuery);
        }

        function updateFullTimezoneOverlaySearchUi() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const searchInput = doc.getElementById("tz-search-input");
            const clearBtn = doc.getElementById("tz-search-clear");
            if (searchInput && searchInput.value !== fullTimezoneOverlayQuery) {
                searchInput.value = fullTimezoneOverlayQuery;
            }
            if (searchInput) {
                // The standard time list holds offsets only (UTC+09:00), so it gets its own hint. The
                // data-i18n key follows the tab so a language change keeps the matching text.
                const placeholderKey = fullTimezoneOverlayActiveTab === "standard"
                    ? "placeholder_timezone_search_standard"
                    : "placeholder_timezone_search";
                searchInput.setAttribute?.("data-i18n", placeholderKey);
                searchInput.placeholder = translate(placeholderKey);
            }
            if (clearBtn) {
                const hasQuery = !!String(fullTimezoneOverlayQuery || "").trim();
                clearBtn.disabled = !hasQuery;
                clearBtn.style.visibility = hasQuery ? "visible" : "hidden";
                clearBtn.setAttribute?.("aria-hidden", hasQuery ? "false" : "true");
            }
        }

        function setFullTimezoneOverlayQuery(value) {
            fullTimezoneOverlayQuery = String(value || "");
            updateFullTimezoneOverlaySearchUi();
            renderFullTimezoneOverlayList();
        }

        function resetFullTimezoneOverlayQuery() {
            setFullTimezoneOverlayQuery("");
        }

        function renderFullTimezoneOverlayList() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const list = doc.getElementById("full-tz-list");
            if (!list) return;

            list.textContent = "";
            const entries = getActiveFullTimezoneOverlayEntries();
            if (!entries.length && typeof doc.createElement === "function") {
                const emptyState = doc.createElement("div");
                emptyState.className = "tz-empty-state";
                const hasQuery = !!String(fullTimezoneOverlayQuery || "").trim();
                emptyState.textContent = translate(
                    (fullTimezoneOverlayActiveTab === "standard" && hasQuery)
                        ? "overlay_no_tz_results_standard"
                        : "overlay_no_tz_results"
                );
                list.appendChild(emptyState);
                return;
            }
            entries.forEach((entry) => {
                const item = createTimezoneListItem(entry, true);
                if (item) list.appendChild(item);
            });
        }

        function updateFullTimezoneOverlayTabButtons() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            ["standard", "country", "custom"].forEach((tab) => {
                const tabBtn = doc.getElementById(`tz-tab-${tab}`);
                if (!tabBtn) return;
                tabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === tab);
                tabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === tab ? "true" : "false");
            });
            // The custom tab shows its form instead of the search box and the list.
            const isCustom = fullTimezoneOverlayActiveTab === "custom";
            const setShown = (id, shown, display) => {
                const el = doc.getElementById(id);
                if (el?.style) el.style.display = shown ? display : "none";
            };
            setShown("tz-custom-panel", isCustom, "flex");
            setShown("full-tz-list", !isCustom, "");
            const searchRow = doc.getElementById("tz-search-input")?.closest?.(".overlay-search-row");
            if (searchRow?.style) searchRow.style.display = isCustom ? "none" : "";
        }

        function setFullTimezoneOverlayTab(value) {
            fullTimezoneOverlayActiveTab = sanitizeFullTimezoneOverlayTab(value);
            updateFullTimezoneOverlayTabButtons();
            updateFullTimezoneOverlaySearchUi();
            if (fullTimezoneOverlayActiveTab === "custom") {
                const doc = getDocumentRef();
                doc?.getElementById?.("custom-abbr")?.focus?.();
                return;
            }
            renderFullTimezoneOverlayList();
        }

        function closeFullTimezoneOverlay() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const overlay = doc.getElementById("full-tz-overlay");
            if (overlay) overlay.style.display = "none";
            resetFullTimezoneOverlayQuery();
        }

        function openFullTimezoneOverlay() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const overlay = doc.getElementById("full-tz-overlay");
            if (!overlay) return;
            fullTimezoneOverlayStandardEntries = getStandardTimezoneEntries();
            fullTimezoneOverlayCountryEntries = getSelectableTZEntries();
            fullTimezoneOverlayQuery = "";
            setFullTimezoneOverlayTab("standard");
            overlay.style.display = "flex";
            const searchInput = doc.getElementById("tz-search-input");
            if (searchInput?.focus) {
                if (typeof globalObj.setTimeout === "function") {
                    globalObj.setTimeout(() => searchInput.focus(), 0);
                } else {
                    searchInput.focus();
                }
            }
        }

        function initSearchAndSelect() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;

            const showAllBtn = doc.getElementById("show-all-tz");
            if (showAllBtn) {
                showAllBtn.onclick = () => {
                    openFullTimezoneOverlay();
                };
            }

            ["standard", "country", "custom"].forEach((tab) => {
                const tabBtn = doc.getElementById(`tz-tab-${tab}`);
                if (tabBtn) tabBtn.addEventListener("click", () => setFullTimezoneOverlayTab(tab));
            });

            const searchInput = doc.getElementById("tz-search-input");
            if (searchInput) {
                searchInput.addEventListener("input", (event) => {
                    setFullTimezoneOverlayQuery(event?.target?.value || "");
                });
            }

            const clearSearchBtn = doc.getElementById("tz-search-clear");
            if (clearSearchBtn) {
                clearSearchBtn.addEventListener("click", () => {
                    resetFullTimezoneOverlayQuery();
                    searchInput?.focus?.();
                });
            }

            const closeOverlayBtn = doc.getElementById("close-overlay");
            if (closeOverlayBtn) {
                closeOverlayBtn.onclick = () => {
                    closeFullTimezoneOverlay();
                };
            }

            updateFullTimezoneOverlaySearchUi();
        }

        return Object.freeze({
            formatUtcOffsetLabel,
            normalizeZoneAbbreviation,
            getAllSupportedTimezoneNames,
            getSelectableTZEntries,
            getStandardTimezoneEntries,
            queueStandardTimezoneWarmup,
            getTimezoneEntryTitle,
            filterTimezoneEntries,
            getSelectableTZEntryByKey,
            sanitizeFullTimezoneOverlayTab,
            renderFullTimezoneOverlayList,
            updateFullTimezoneOverlayTabButtons,
            setFullTimezoneOverlayTab,
            initSearchAndSelect,
            createStandardTimezoneFromSelectableEntry,
            addFromSearchWithData
        });
    }

    globalObj.GTVTimezoneSearch = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
