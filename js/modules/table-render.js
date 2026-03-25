(function initGtvTableRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTableRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function getSlotZeroAnchorDate() {
            const slotZero = invokeDep("getGlobalTime", 0);
            if (isValidDate(slotZero)) return slotZero;
            return new Date();
        }

        function destroyDatePickersInRoot(root) {
            if (!root || typeof root.querySelectorAll !== "function") return;
            const inputs = Array.from(root.querySelectorAll(".time-input") || []);
            inputs.forEach((input) => {
                const picker = input?._cdp;
                if (picker && typeof picker.destroy === "function") {
                    picker.destroy();
                }
                if (input && Object.prototype.hasOwnProperty.call(input, "_cdp")) {
                    input._cdp = null;
                }
            });
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate = getSlotZeroAnchorDate()) {
            const uiName = invokeDep("getZoneDisplayNameForUiAtDate", tz, anchorDate);
            if (typeof uiName === "string" && uiName.trim()) return uiName;
            const baseName = invokeDep("getZoneDisplayName", tz);
            if (typeof baseName === "string" && baseName.trim()) return baseName;
            return "";
        }

        function getDisplayEnabledMap() {
            const enabled = invokeDep("getDisplayFormatEnabled");
            return (enabled && typeof enabled === "object") ? enabled : {};
        }

        function getDisplayTimePartsEnabledMap() {
            const enabled = invokeDep("getDisplayTimePartsEnabled");
            return (enabled && typeof enabled === "object") ? enabled : {};
        }

        function getSafeDisplayOrder() {
            const order = invokeDep("getDisplayFormatOrder");
            const sanitized = invokeDep("sanitizeCopyFormatOrder", order);
            if (Array.isArray(sanitized)) return sanitized;
            if (Array.isArray(order)) return order;
            return [];
        }

        function getSlotCountSafe() {
            const value = Number(invokeDep("getSlotCount"));
            return Number.isFinite(value) ? value : 1;
        }

        function getDisplayColumns(effectiveSlotCount) {
            const columns = [];
            const safeSlotCount = Number.isFinite(Number(effectiveSlotCount)) ? Number(effectiveSlotCount) : 1;
            const enabledMap = getDisplayEnabledMap();
            const isMultiTab = !!invokeDep("isMultiTab");
            getSafeDisplayOrder().forEach((key) => {
                if (key === "time") {
                    if (!enabledMap[key] && !isMultiTab) return;
                    columns.push("time_main");
                    if (safeSlotCount > 1) columns.push("time_extra");
                    return;
                }
                if (!enabledMap[key]) return;
                if ((key === "period_days" || key === "period_time") && safeSlotCount <= 1) {
                    return;
                }
                columns.push(key);
            });
            return columns;
        }

        function getDisplayTimeInputMode() {
            const enabled = getDisplayTimePartsEnabledMap();
            const showDate = !!enabled.date;
            const showTime = !!enabled.time;
            if (showDate && showTime) return "datetime";
            if (showDate) return "date";
            if (showTime) return "time";
            return "none";
        }

        function applyZoneCodeKindClass(zoneCodeEl, timezoneRef = null) {
            if (!zoneCodeEl || !zoneCodeEl.classList || typeof zoneCodeEl.classList.toggle !== "function") return;
            const isCustom = !!(timezoneRef && timezoneRef.type === "custom");
            zoneCodeEl.classList.toggle("zone-code-custom", isCustom);
            zoneCodeEl.classList.toggle("zone-code-standard", !isCustom);
        }

        function buildTimeColumnCell(slotIdx, slotCountToRender, options = {}) {
            if (slotIdx >= slotCountToRender) return "";
            const { isReadonly = false } = options;
            const enabled = getDisplayTimePartsEnabledMap();
            const showDn = !!enabled.dn;
            const showWeekday = !!enabled.weekday;
            const inputMode = getDisplayTimeInputMode();
            const hideInput = inputMode === "none";
            return `
                <td class="dynamic-cell">
                    <div class="time-day-group">
                        ${showDn ? `<span class="dn-icon dn-slot-${slotIdx}"></span>` : ""}
                        <input
                            type="text"
                            class="time-input slot-${slotIdx}${hideInput ? " time-input-hidden" : ""}"
                            spellcheck="false"
                            data-slot="${slotIdx}"
                            data-field="time"
                            data-input-mode="${inputMode}"
                            ${isReadonly || hideInput ? "readonly" : ""}
                        >
                        ${isReadonly || hideInput ? "" : ""}
                        ${showWeekday ? `<span class="day-badge day-slot-${slotIdx}">-</span>` : ""}
                        ${hideInput || isReadonly ? "" : `<button type="button" class="calendar-btn trigger-slot-${slotIdx}" tabindex="-1" title="달력(Date Picker) 열기">📅</button>`}
                    </div>
                </td>
            `;
        }

        function getDisplayColumnHeader(colKey) {
            const useRangeTimeLabels = !invokeDep("isRealtime") && getSlotCountSafe() > 1;
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${translate("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${translate("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 140px;">${translate("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${translate(useRangeTimeLabels ? "th_time_day_start" : "th_time_day_main")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${translate(useRangeTimeLabels ? "th_time_day_end" : "th_time_day_extra")}</th>`;
                case "period_days":
                    return `<th style="width: 90px;">${translate("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 170px;">${translate("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function getMultiDisplayColumnHeader(colKey) {
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${translate("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${translate("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 150px;">${translate("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${translate("th_time_day_start")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${translate("th_time_day_end")}</th>`;
                case "period_days":
                    return `<th style="width: 100px;">${translate("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 180px;">${translate("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml = "") {
            switch (colKey) {
                case "timezone":
                    return `<td class="timezone-cell"><div class="abbr-cell"><span class="zone-code"></span></div></td>`;
                case "region":
                    return `<td><div class="zone-info"><span class="zone-name">${zoneNameHtml}</span></div></td>`;
                case "offset":
                    return `<td><span class="offset-text"></span></td>`;
                case "time_main":
                case "time_extra": {
                    const slotIdx = colKey === "time_main" ? 0 : 1;
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: invokeDep("isRealtime") });
                }
                case "period_days":
                    return `<td class="period-days-cell"><span class="period-days-text">-</span></td>`;
                case "period_time":
                    return `<td class="period-time-cell"><span class="period-time-text">-</span></td>`;
                default:
                    return "";
            }
        }

        function buildDynamicRowCell(colKey, slotCountToRender) {
            switch (colKey) {
                case "timezone":
                    return `<td class="timezone-cell"><div class="abbr-cell"><span class="zone-code"></span></div></td>`;
                case "region":
                    return `<td><div class="zone-info"><span class="zone-name"></span></div></td>`;
                case "offset":
                    return `<td><span class="offset-text"></span></td>`;
                case "time_main":
                case "time_extra": {
                    const slotIdx = colKey === "time_main" ? 0 : 1;
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: invokeDep("isRealtime") });
                }
                case "period_days":
                    return `<td class="period-days-cell"><span class="period-days-text">-</span></td>`;
                case "period_time":
                    return `<td class="period-time-cell"><span class="period-time-text">-</span></td>`;
                default:
                    return "";
            }
        }

        function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
            const copyCell = `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${copyButtonTitle}">&#128203;</button></div></td>`;
            const removeTitleAttr = (typeof removeButtonTitle === "string" && removeButtonTitle.trim())
                ? ` title="${removeButtonTitle.trim()}"`
                : "";
            const removeCell = removeButtonText
                ? `<td class="export-exclude remove-cell"><div class="btn-group"><button class="sm-btn danger remove-row-btn"${removeTitleAttr}>${removeButtonText}</button></div></td>`
                : `<td class="export-exclude remove-cell"></td>`;
            return `${copyCell}${removeCell}`;
        }

        function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz?.id, anchorDate = getSlotZeroAnchorDate()) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            const safeTz = (tz && typeof tz === "object") ? tz : {};
            const safeRowId = String(rowId || safeTz.id || "utc");
            const safeDisplayColumns = Array.isArray(displayColumns) ? displayColumns : [];
            const tr = doc.createElement("tr");
            tr.className = "time-row";
            tr.id = `tz-row-${safeRowId}`;
            tr.draggable = false;

            const dragHandleHtml = `<button type="button" class="drag-handle" draggable="true">&#8942;&#8942;</button>`;
            let inner = `<td class="move-cell"><div class="btn-group">${dragHandleHtml}</div></td>`;
            safeDisplayColumns.forEach((colKey) => {
                inner += buildDynamicRowCell(colKey, effectiveSlotCount);
            });
            inner += buildRowActionCells(translate("tooltip_copy"), "X", translate("tooltip_remove_row"));
            tr.insertAdjacentHTML('beforeend', inner);

            const zoneNameEl = tr.querySelector(".zone-name");
            if (zoneNameEl) zoneNameEl.textContent = getZoneDisplayNameForUiAtDate(safeTz, anchorDate) || "";
            applyZoneCodeKindClass(tr.querySelector(".zone-code"), safeTz);

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) copyBtn.addEventListener("click", () => invokeDep("copyRow", safeRowId));

            const removeBtn = tr.querySelector(".remove-row-btn");
            if (removeBtn) removeBtn.addEventListener("click", () => invokeDep("removeTimezone", safeRowId));

            Array.from(tr.querySelectorAll(".time-input") || []).forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = safeRowId === "utc" ? null : safeTz.id;

                const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                const CustomDatePickerCtor = globalObj.CustomDatePicker;
                if (CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    if (input._cdp && typeof input._cdp.destroy === "function") {
                        input._cdp.destroy();
                    }
                    input._cdp = new CustomDatePickerCtor(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: doc.documentElement?.lang || "en",
                        theme: doc.documentElement?.getAttribute?.("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => invokeDep("handleTimeChange", e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                input.onkeydown = (e) => {
                    if (e.key === "Enter") {
                        invokeDep("handleTimeChange", e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                        input.blur();
                    }
                };
            });

            const dragHandle = tr.querySelector(".drag-handle");
            if (dragHandle) dragHandle.draggable = true;
            if (dragHandle) {
                dragHandle.addEventListener("dragstart", (e) => {
                    tr.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", safeRowId);
                        const ghost = invokeDep("createDragGhostFromRow", tr);
                        e.dataTransfer.setDragImage(ghost || tr, 20, 20);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    tr.classList.remove("dragging");
                    invokeDep("clearDragGhost");
                    invokeDep("saveOrder");
                    invokeDep("updateClocks");
                });
            }

            return tr;
        }

        function getRenderableTimezoneRows(baseRef) {
            const safeBaseRef = (baseRef && typeof baseRef === "object") ? baseRef : { id: "utc" };
            const currentZones = invokeDep("getCurrentGroupZones");
            const zoneRows = (Array.isArray(currentZones) ? currentZones : []).filter(
                (tz) => tz && typeof tz === "object" && tz.id !== safeBaseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            const rowsToRender = [...zoneRows];
            if (safeBaseRef.id !== "utc" && invokeDep("isCurrentGroupUtcRowVisible")) {
                const utcRef = invokeDep("getUTCRef");
                if (utcRef && typeof utcRef === "object") {
                    const utcRowOrder = Number(invokeDep("getCurrentGroupUtcRowOrder"));
                    const safeUtcRowOrder = Number.isFinite(utcRowOrder) ? utcRowOrder : 0;
                    const insertIndex = Math.min(Math.max(safeUtcRowOrder, 0), rowsToRender.length);
                    rowsToRender.splice(insertIndex, 0, utcRef);
                }
            }
            return rowsToRender;
        }

        function renderList() {
            const doc = getDocumentRef();
            if (!doc) return;
            invokeDep("hideFloatingTooltip");
            if (invokeDep("isMultiTab")) {
                invokeDep("renderMultiRanges");
                return;
            }

            const effectiveSlotCount = invokeDep("isRealtime") ? 1 : getSlotCountSafe();
            const displayColumns = getDisplayColumns(effectiveSlotCount);
            const baseRef = invokeDep("getBaseTimezoneRef") || { id: "utc", zone: "UTC" };
            const anchorDate = getSlotZeroAnchorDate();
            const baseZoneName = getZoneDisplayNameForUiAtDate(baseRef, anchorDate) || "";
            const escapedBaseZoneName = invokeDep("escapeHtml", baseZoneName);
            const baseRefName = (typeof escapedBaseZoneName === "string") ? escapedBaseZoneName : String(baseZoneName);
            const theadRow = doc.querySelector?.("#table-head tr");

            if (theadRow) {
                const headCells = [`<th class="move-col" style="width: 70px;">${translate("th_order")}</th>`];
                headCells.push(...displayColumns.map(getDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_copy")}</th>`);
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_remove")}</th>`);
                theadRow.textContent = "";
                theadRow.insertAdjacentHTML('beforeend', headCells.join(""));
            }

            const container = doc.getElementById?.("clocks-container");
            if (!container) return;
            destroyDatePickersInRoot(container);
            container.textContent = "";

            if (typeof doc.createElement !== "function") return;
            const baseRow = doc.createElement("tr");
            baseRow.className = "time-row static base-row";
            baseRow.id = `tz-row-${baseRef.id}`;
            let baseInner = `<td class="move-cell"><span class="drag-spacer" aria-hidden="true"></span></td>`;
            displayColumns.forEach((colKey) => {
                baseInner += buildStaticRowCell(colKey, effectiveSlotCount, baseRefName);
            });
            baseInner += buildRowActionCells(translate("tooltip_copy"), "");
            baseRow.insertAdjacentHTML('beforeend', baseInner);
            applyZoneCodeKindClass(baseRow.querySelector(".zone-code"), baseRef);
            const baseCopyBtn = baseRow.querySelector(".copy-row-btn");
            if (baseCopyBtn) baseCopyBtn.addEventListener("click", () => invokeDep("copyRow", baseRef.id));
            container.appendChild(baseRow);

            for (let i = 0; i < effectiveSlotCount; i++) {
                const inputs = Array.from(baseRow.querySelectorAll(`.time-input[data-slot="${i}"]`) || []);
                inputs.forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    const slotIdx = parseInt(input.dataset.slot, 10);

                    const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                    const CustomDatePickerCtor = globalObj.CustomDatePicker;
                    if (CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                        if (input._cdp && typeof input._cdp.destroy === "function") {
                            input._cdp.destroy();
                        }
                        input._cdp = new CustomDatePickerCtor(input, {
                            type: inputMode === "date" ? "date" : "datetime",
                            lang: doc.documentElement?.lang || "en",
                            theme: doc.documentElement?.getAttribute?.("data-theme") || "dark",
                            triggerElement: triggerBtn || null
                        });
                    }

                    input.onchange = (e) => invokeDep("handleTimeChange", e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                    input.onkeydown = (e) => {
                        if (e.key === "Enter") {
                            invokeDep("handleTimeChange", e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                            input.blur();
                        }
                    };
                    if (invokeDep("isRealtime")) input.readOnly = true;
                });
            }

            const rowsToRender = getRenderableTimezoneRows(baseRef);
            rowsToRender.forEach((tz) => {
                if (!tz || typeof tz !== "object") return;
                const rowId = tz.id === "utc" ? "utc" : tz.id;
                const row = createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId, anchorDate);
                if (row) container.appendChild(row);
            });

            invokeDep("renderBaseTimeSelect");
            invokeDep("updateTimeAdjustPanel");
            invokeDep("updateClocks");
            invokeDep("upgradeNativeTitleTooltips", container);
        }

        return Object.freeze({
            getDisplayColumns,
            getDisplayTimeInputMode,
            buildTimeColumnCell,
            getDisplayColumnHeader,
            getMultiDisplayColumnHeader,
            buildStaticRowCell,
            buildDynamicRowCell,
            buildRowActionCells,
            createInteractiveTimezoneRow,
            getRenderableTimezoneRows,
            renderList
        });
    }

    globalObj.GTVTableRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
