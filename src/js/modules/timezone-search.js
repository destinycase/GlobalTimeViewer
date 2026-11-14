(function initGtvTimezoneSearch(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let fullTimezoneOverlayCountryEntries = [];
        let fullTimezoneOverlayActiveTab = "list";
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
                "showToast",
                "renderTimelineFrame",
                "updateTimeAdjustPanel",
                "getZoneAbbreviation",
                "getZoneDisplayName"
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

        // First tile of the presets: the table's UTC row ("Standard Time (UTC)").
        const UTC_ROW_ENTRY_KEY = "utc-row";
        function getUtcRowEntry() {
            return { kind: "utc_row", key: UTC_ROW_ENTRY_KEY, zone: "UTC", abbr: "UTC", fixedOffsetMinutes: 0 };
        }

        function getTimezoneEntryTitle(entry) {
            if (entry?.kind === "utc_row") return translate("overlay_utc_row_title");
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
            if (key === UTC_ROW_ENTRY_KEY) return getUtcRowEntry();
            return getSelectableTZEntries().find((entry) => entry.key === key) || null;
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            if (!entry || typeof entry !== "object") return null;
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

        // The UTC tile stands for the table's UTC row: it shows the row again when it is hidden.
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
            if (entry?.kind === "utc_row") return showUtcRowFromList();
            const nextZone = createStandardTimezoneFromSelectableEntry(entry);
            if (!nextZone) return false;
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
            const abbrText = normalizeZoneAbbreviation(tzEntry?.abbr)
                || normalizeZoneAbbreviation(getBetterAbbrSafe(tzEntry?.zone, new Date()))
                || "UTC";
            const offsetMinutes = resolveTimezoneEntryOffsetMinutes(tzEntry);
            if (Number.isFinite(offsetMinutes)) {
                const offsetText = formatOffsetBadgeLabel(offsetMinutes);
                abbr.textContent = toCanonicalOffsetText(abbrText) === toCanonicalOffsetText(offsetText)
                    ? `[${abbrText}]`
                    : `[${abbrText}] [${offsetText}]`;
            } else {
                abbr.textContent = `[${abbrText}]`;
            }
            item.appendChild(title);
            item.appendChild(abbr);
            item.addEventListener("click", () => {
                const added = addFromSearchWithData(tzEntry.key);
                if (added === true) {
                    dep.showToast(`${translate("toast_timezone_added")} ${getTimezoneEntryTitle(tzEntry)}`, { type: "success" });
                    refreshGroupListCount();
                }
                if (closeOverlay) {
                    closeFullTimezoneOverlay();
                }
            });
            return item;
        }

        // ---- Group list tab: the current group's timezones in table order. The base row is
        // pinned on top; the others are reordered with the drag handle (or arrow keys on it).
        function getCurrentGroupSafe() {
            const group = dep.getCurrentGroup();
            return (group && typeof group === "object") ? group : null;
        }

        function getGroupBaseId(group) {
            const id = (typeof group?.baseTimezoneId === "string") ? group.baseTimezoneId.trim() : "";
            if (id && id !== "utc" && Array.isArray(group.zones) && group.zones.some((zone) => zone?.id === id)) return id;
            return "utc";
        }

        function isUtcZoneEntry(zone) {
            return !!zone && zone.type === "standard" && zone.zone === "UTC";
        }

        // Same order as the table: zones in saved order, the UTC row placed at utcRowOrder.
        function getGroupListOrderIds(group) {
            if (!group) return [];
            const baseId = getGroupBaseId(group);
            const ids = (Array.isArray(group.zones) ? group.zones : [])
                .filter((zone) => zone && typeof zone === "object" && zone.id !== baseId && !isUtcZoneEntry(zone))
                .map((zone) => zone.id);
            if (baseId !== "utc" && group.showUtcRow !== false) {
                const order = parseInt(group.utcRowOrder, 10);
                const insertAt = Math.min(Math.max(Number.isFinite(order) ? order : 0, 0), ids.length);
                ids.splice(insertAt, 0, "utc");
            }
            return [baseId, ...ids];
        }

        function getZoneOffsetMinutes(zone, atDate = new Date()) {
            if (!zone) return 0;
            if (zone.type === "custom") {
                const h = parseInt(zone.offH, 10) || 0;
                const m = parseInt(zone.offM, 10) || 0;
                return h * 60 + (h < 0 ? -m : m);
            }
            const fixed = parseFixedOffsetMinutes(zone.fixedOffsetMinutes);
            if (fixed !== null) return fixed;
            const live = getTimezoneOffsetSafe(zone.zone, atDate);
            return Number.isFinite(live) ? Math.trunc(live) : 0;
        }

        function getGroupListEntries() {
            const group = getCurrentGroupSafe();
            if (!group) return [];
            const zonesById = new Map((Array.isArray(group.zones) ? group.zones : []).map((zone) => [zone?.id, zone]));
            // Abbreviation and UTC offset use the same moment (now, like the preset tiles), so a
            // row never mixes a summer abbreviation with a winter offset.
            const now = new Date();
            return getGroupListOrderIds(group).map((id, index) => {
                if (id === "utc") {
                    return { id, isBase: index === 0, isUtc: true, abbr: "UTC", name: translate("utc_name"), offsetText: formatUtcOffsetLabel(0) };
                }
                const zone = zonesById.get(id);
                const abbr = String(dep.getZoneAbbreviation(zone, now) || zone?.abbr || "").trim();
                const name = String(dep.getZoneDisplayName(zone) || zone?.name || zone?.name_ko || "").trim();
                return { id, isBase: index === 0, isUtc: false, isCustom: zone?.type === "custom", abbr, name, offsetText: formatUtcOffsetLabel(getZoneOffsetMinutes(zone, now)) };
            }).filter((entry) => entry.id === "utc" || zonesById.has(entry.id));
        }

        function commitGroupListChange(options = {}) {
            dep.savePersistence();
            dep.renderList();
            dep.renderTimelineFrame();
            if (options.baseChanged) dep.updateTimeAdjustPanel();
            renderGroupList();
        }

        // Applies a new order of all rows ("utc" for the UTC row). The top row becomes the base
        // timezone; the others keep the given order (zones array order and utcRowOrder).
        function applyGroupListOrder(orderedIds) {
            const group = getCurrentGroupSafe();
            if (!group || !Array.isArray(orderedIds)) return false;
            const current = getGroupListOrderIds(group);
            const next = orderedIds.filter((id, i) => current.includes(id) && orderedIds.indexOf(id) === i);
            if (next.length !== current.length || next.every((id, i) => id === current[i])) return false;
            const prevBaseId = current[0];
            const nextBaseId = next[0];
            const rest = next.slice(1);
            group.baseTimezoneId = nextBaseId;
            const zones = Array.isArray(group.zones) ? group.zones : [];
            const zoneOrder = rest.filter((id) => id !== "utc");
            const listed = zoneOrder.map((id) => zones.find((zone) => zone?.id === id)).filter(Boolean);
            group.zones = [...zones.filter((zone) => !zoneOrder.includes(zone?.id)), ...listed];
            if (nextBaseId === "utc") {
                group.showUtcRow = true;
                group.utcRowOrder = 0;
            } else {
                const utcIndex = rest.indexOf("utc");
                if (utcIndex >= 0) {
                    group.showUtcRow = true;
                    group.utcRowOrder = utcIndex;
                }
            }
            commitGroupListChange({ baseChanged: nextBaseId !== prevBaseId });
            return true;
        }

        // Moves one row to a position in the whole list (0 = top, which makes it the base).
        function moveGroupListEntry(id, toIndex) {
            const group = getCurrentGroupSafe();
            if (!group) return false;
            const ids = getGroupListOrderIds(group);
            const from = ids.indexOf(id);
            if (from < 0) return false;
            const target = Math.min(Math.max(Math.trunc(Number(toIndex)) || 0, 0), ids.length - 1);
            if (target === from) return false;
            ids.splice(from, 1);
            ids.splice(target, 0, id);
            return applyGroupListOrder(ids);
        }

        // Makes a row the base timezone by moving it to the top; the previous base goes right below it.
        function setGroupListBase(id) {
            return moveGroupListEntry(id, 0);
        }

        // Removes a row (the UTC row is hidden). The base row cannot be removed.
        function removeGroupListEntry(id) {
            const group = getCurrentGroupSafe();
            if (!group || id === getGroupBaseId(group)) return false;
            if (id === "utc") {
                if (group.showUtcRow === false) return false;
                group.showUtcRow = false;
                group.utcRowOrder = 0;
            } else {
                const zones = Array.isArray(group.zones) ? group.zones : [];
                if (!zones.some((zone) => zone?.id === id)) return false;
                group.zones = zones.filter((zone) => zone?.id !== id);
            }
            commitGroupListChange();
            return true;
        }

        function refreshGroupListCount() {
            const doc = getDocumentRef();
            const countEl = doc?.getElementById?.("tz-tab-list-count");
            if (countEl) countEl.textContent = `(${getGroupListEntries().length})`;
        }

        function renderGroupList() {
            refreshGroupListCount();
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;
            const listEl = doc.getElementById("tz-group-list");
            if (!listEl) return;
            const focusedId = doc.activeElement?.closest?.(".tz-group-row")?.dataset?.id || "";
            listEl.textContent = "";
            const hint = doc.createElement("p");
            hint.className = "settings-desc tz-group-list-hint";
            hint.textContent = translate("group_list_base_hint");
            listEl.appendChild(hint);
            getGroupListEntries().forEach((entry) => {
                const row = doc.createElement("div");
                row.className = `tz-group-row${entry.isBase ? " is-base" : ""}`;
                row.dataset.id = entry.id;
                row.setAttribute("role", "listitem");

                const handle = doc.createElement("button");
                handle.type = "button";
                handle.className = "tz-group-handle";
                handle.textContent = "\u22EE\u22EE";
                handle.title = translate("group_list_drag_hint");
                handle.setAttribute("aria-label", `${translate("group_list_drag_hint")}: ${entry.name}`);
                bindGroupListHandle(handle, row, entry.id);

                const info = doc.createElement("div");
                info.className = "tz-group-info";
                const abbr = doc.createElement("span");
                abbr.className = "tz-group-abbr";
                abbr.textContent = entry.abbr;
                const name = doc.createElement("span");
                name.className = "tz-group-name";
                name.textContent = entry.name;
                const offset = doc.createElement("span");
                offset.className = "tz-group-offset";
                offset.textContent = entry.offsetText;
                info.appendChild(abbr);
                info.appendChild(name);
                info.appendChild(offset);

                // Only this popup shows which row is the base: the top row.
                const baseMark = doc.createElement("span");
                baseMark.className = "tz-group-base-mark";
                if (entry.isBase) {
                    baseMark.textContent = translate("label_base_order");
                    baseMark.title = translate("group_list_base_hint");
                }

                const remove = doc.createElement("button");
                remove.type = "button";
                remove.className = "sm-btn danger tz-group-remove";
                remove.textContent = "X";
                if (entry.isBase) {
                    remove.disabled = true;
                    remove.title = translate("group_list_base_locked");
                } else {
                    remove.title = translate("tooltip_remove_row");
                    remove.setAttribute("aria-label", `${translate("tooltip_remove_row")}: ${entry.name}`);
                    remove.addEventListener("click", () => removeGroupListEntry(entry.id));
                }

                row.appendChild(handle);
                row.appendChild(info);
                row.appendChild(baseMark);
                row.appendChild(remove);
                listEl.appendChild(row);
            });
            if (focusedId) {
                const again = [...(listEl.querySelectorAll?.(".tz-group-row") || [])].find((row) => row.dataset.id === focusedId);
                again?.querySelector?.(".tz-group-handle")?.focus?.({ preventScroll: true });
            }
        }

        // Drag with the handle (pointer events cover mouse, pen and touch); the row follows the
        // pointer among the other rows and the order is saved on release. Arrow keys on a
        // focused handle move it one step.
        function bindGroupListHandle(handle, row, id) {
            handle.addEventListener("keydown", (event) => {
                if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
                event.preventDefault?.();
                const ids = getGroupListOrderIds(getCurrentGroupSafe());
                const from = ids.indexOf(id);
                moveGroupListEntry(id, from + (event.key === "ArrowUp" ? -1 : 1));
            });
            handle.addEventListener("pointerdown", (event) => {
                if (event.button !== undefined && event.button !== 0) return;
                event.preventDefault?.();
                const listEl = row.parentElement;
                if (!listEl) return;
                try { handle.setPointerCapture?.(event.pointerId); } catch (_err) { /* capture is optional */ }
                row.classList.add("is-dragging");
                const onMove = (moveEvent) => {
                    const others = [...listEl.querySelectorAll(".tz-group-row:not(.is-dragging)")];
                    const before = others.find((other) => {
                        const box = other.getBoundingClientRect();
                        return moveEvent.clientY < box.top + box.height / 2;
                    });
                    if (before) {
                        if (row.nextElementSibling !== before) listEl.insertBefore(row, before);
                    } else if (listEl.lastElementChild !== row) {
                        listEl.appendChild(row);
                    }
                };
                // Listen on the document so the drag keeps going when the pointer leaves the handle
                // (pointer capture is used too where available).
                const moveTarget = handle.ownerDocument || getDocumentRef();
                const onEnd = () => {
                    moveTarget.removeEventListener("pointermove", onMove);
                    moveTarget.removeEventListener("pointerup", onEnd);
                    moveTarget.removeEventListener("pointercancel", onEnd);
                    row.classList.remove("is-dragging");
                    const ids = [...listEl.querySelectorAll(".tz-group-row")].map((el) => el.dataset.id);
                    if (!applyGroupListOrder(ids)) renderGroupList();
                };
                moveTarget.addEventListener("pointermove", onMove);
                moveTarget.addEventListener("pointerup", onEnd);
                moveTarget.addEventListener("pointercancel", onEnd);
            });
        }

        function sanitizeFullTimezoneOverlayTab(value) {
            return (value === "custom" || value === "country") ? value : "list";
        }

        function getActiveFullTimezoneOverlayEntries() {
            return filterTimezoneEntries(fullTimezoneOverlayCountryEntries, fullTimezoneOverlayQuery);
        }

        function updateFullTimezoneOverlaySearchUi() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const searchInput = doc.getElementById("tz-search-input");
            const clearBtn = doc.getElementById("tz-search-clear");
            if (searchInput && searchInput.value !== fullTimezoneOverlayQuery) {
                searchInput.value = fullTimezoneOverlayQuery;
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
                emptyState.textContent = translate("overlay_no_tz_results");
                list.appendChild(emptyState);
                return;
            }
            entries.forEach((entry) => {
                // The popup stays open after adding, so several timezones can be added in a row.
                const item = createTimezoneListItem(entry, false);
                if (item) list.appendChild(item);
            });
        }

        function updateFullTimezoneOverlayTabButtons() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            ["list", "country", "custom"].forEach((tab) => {
                const tabBtn = doc.getElementById(`tz-tab-${tab}`);
                if (!tabBtn) return;
                tabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === tab);
                tabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === tab ? "true" : "false");
            });
            // Each tab shows its own panel: the group list, the presets (search and tiles), or the custom form.
            const isCountry = fullTimezoneOverlayActiveTab === "country";
            const setShown = (id, shown, display) => {
                const el = doc.getElementById(id);
                if (el?.style) el.style.display = shown ? display : "none";
            };
            setShown("tz-group-list", fullTimezoneOverlayActiveTab === "list", "flex");
            setShown("tz-custom-panel", fullTimezoneOverlayActiveTab === "custom", "flex");
            setShown("full-tz-list", isCountry, "");
            const searchRow = doc.getElementById("tz-search-input")?.closest?.(".overlay-search-row");
            if (searchRow?.style) searchRow.style.display = isCountry ? "" : "none";
        }

        function setFullTimezoneOverlayTab(value) {
            fullTimezoneOverlayActiveTab = sanitizeFullTimezoneOverlayTab(value);
            updateFullTimezoneOverlayTabButtons();
            updateFullTimezoneOverlaySearchUi();
            if (fullTimezoneOverlayActiveTab === "custom") {
                const doc = getDocumentRef();
                doc?.getElementById?.("custom-abbr")?.focus?.();
                refreshGroupListCount();
                return;
            }
            if (fullTimezoneOverlayActiveTab === "list") {
                renderGroupList();
                return;
            }
            refreshGroupListCount();
            renderFullTimezoneOverlayList();
        }

        // Closing the popup also empties the custom tab's form (abbreviation, name, offset +00:00),
        // so text left from an unfinished or failed add does not come back next time.
        function resetCustomTimezoneForm(doc) {
            ["custom-abbr", "custom-name"].forEach((id) => {
                const input = doc.getElementById(id);
                if (input) input.value = "";
            });
            ["custom-off-h", "custom-off-m"].forEach((id) => {
                const select = doc.getElementById(id);
                if (select) select.value = "0";
            });
        }

        function closeFullTimezoneOverlay() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const overlay = doc.getElementById("full-tz-overlay");
            if (overlay) overlay.style.display = "none";
            resetFullTimezoneOverlayQuery();
            resetCustomTimezoneForm(doc);
            // Focus back on the List button, without the keyboard focus highlight.
            doc.getElementById("show-all-tz")?.focus?.({ focusVisible: false, preventScroll: true });
        }

        function isFullTimezoneOverlayOpen(doc) {
            const overlay = doc.getElementById("full-tz-overlay");
            return !!overlay && !!overlay.style && overlay.style.display === "flex";
        }

        function openFullTimezoneOverlay() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const overlay = doc.getElementById("full-tz-overlay");
            if (!overlay) return;
            fullTimezoneOverlayCountryEntries = [getUtcRowEntry(), ...getSelectableTZEntries()];
            fullTimezoneOverlayQuery = "";
            setFullTimezoneOverlayTab("list");
            overlay.style.display = "flex";
            // The group list opens first; focus its tab so the keyboard starts inside the popup.
            const listTab = doc.getElementById("tz-tab-list");
            if (listTab?.focus) {
                listTab.focus({ focusVisible: false, preventScroll: true });
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

            ["list", "country", "custom"].forEach((tab) => {
                const tabBtn = doc.getElementById(`tz-tab-${tab}`);
                if (tabBtn) tabBtn.addEventListener("click", () => setFullTimezoneOverlayTab(tab));
            });
            // A custom timezone is added by main-ui-init's handler on the same button, registered
            // earlier; this one runs after it and only updates the group list count.
            const addCustomBtn = doc.getElementById("add-custom-btn");
            if (addCustomBtn && typeof addCustomBtn.addEventListener === "function") {
                addCustomBtn.addEventListener("click", () => refreshGroupListCount());
            }

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

            // A click on the dimmed area outside the popup box closes it, like the other popups.
            const fullOverlay = doc.getElementById("full-tz-overlay");
            if (fullOverlay && typeof fullOverlay.addEventListener === "function") {
                fullOverlay.addEventListener("click", (event) => {
                    if (event?.target === fullOverlay) closeFullTimezoneOverlay();
                });
            }

            // Esc closes the popup, unless an in-page prompt or confirm is open above it.
            if (typeof doc.addEventListener === "function") {
                doc.addEventListener("keydown", (event) => {
                    if (event?.key !== "Escape" || !isFullTimezoneOverlayOpen(doc)) return;
                    const dialogAbove = ["app-prompt-overlay", "app-confirm-overlay"].some((id) => {
                        const el = doc.getElementById(id);
                        return !!el && !!el.style && !!el.style.display && el.style.display !== "none";
                    });
                    if (dialogAbove) return;
                    event.preventDefault?.();
                    closeFullTimezoneOverlay();
                });
            }

            updateFullTimezoneOverlaySearchUi();
        }

        return Object.freeze({
            formatUtcOffsetLabel,
            normalizeZoneAbbreviation,
            getSelectableTZEntries,
            getTimezoneEntryTitle,
            filterTimezoneEntries,
            getSelectableTZEntryByKey,
            sanitizeFullTimezoneOverlayTab,
            renderFullTimezoneOverlayList,
            updateFullTimezoneOverlayTabButtons,
            setFullTimezoneOverlayTab,
            getGroupListEntries,
            applyGroupListOrder,
            moveGroupListEntry,
            setGroupListBase,
            removeGroupListEntry,
            renderGroupList,
            initSearchAndSelect,
            createStandardTimezoneFromSelectableEntry,
            addFromSearchWithData
        });
    }

    globalObj.GTVTimezoneSearch = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
