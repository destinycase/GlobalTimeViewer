(function initGtvTableRender(globalObj) {
    "use strict";

    function createService(deps) {
        function getDisplayColumns(effectiveSlotCount) {
            const columns = [];
            deps.sanitizeCopyFormatOrder(deps.getDisplayFormatOrder()).forEach((key) => {
                if (!deps.getDisplayFormatEnabled()?.[key]) return;
                if (key === "time") {
                    columns.push("time_main");
                    if (effectiveSlotCount > 1) columns.push("time_extra");
                    return;
                }
                if ((key === "period_days" || key === "period_time") && effectiveSlotCount <= 1) {
                    return;
                }
                columns.push(key);
            });
            return columns;
        }

        function getDisplayTimeInputMode() {
            const enabled = deps.getDisplayTimePartsEnabled() || {};
            const showDate = !!enabled.date;
            const showTime = !!enabled.time;
            if (showDate && showTime) return "datetime";
            if (showDate) return "date";
            if (showTime) return "time";
            return "none";
        }

        function buildTimeColumnCell(slotIdx, slotCountToRender, options = {}) {
            if (slotIdx >= slotCountToRender) return "";
            const { isReadonly = false } = options;
            const enabled = deps.getDisplayTimePartsEnabled() || {};
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
            const useRangeTimeLabels = !deps.isRealtime() && deps.getSlotCount() > 1;
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${deps.t("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${deps.t("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 140px;">${deps.t("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${deps.t(useRangeTimeLabels ? "th_time_day_start" : "th_time_day_main")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${deps.t(useRangeTimeLabels ? "th_time_day_end" : "th_time_day_extra")}</th>`;
                case "period_days":
                    return `<th style="width: 90px;">${deps.t("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 170px;">${deps.t("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function getMultiDisplayColumnHeader(colKey) {
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${deps.t("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${deps.t("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 150px;">${deps.t("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${deps.t("th_time_day_start")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${deps.t("th_time_day_end")}</th>`;
                case "period_days":
                    return `<th style="width: 100px;">${deps.t("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 180px;">${deps.t("th_period_time")}</th>`;
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
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: deps.isRealtime() });
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
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: deps.isRealtime() });
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

        function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz.id) {
            const tr = document.createElement("tr");
            tr.className = "time-row";
            tr.id = `tz-row-${rowId}`;
            tr.draggable = false;

            const dragHandleHtml = `<button type="button" class="drag-handle" draggable="true">&#8942;&#8942;</button>`;
            let inner = `<td class="move-cell"><div class="btn-group">${dragHandleHtml}</div></td>`;
            displayColumns.forEach((colKey) => {
                inner += buildDynamicRowCell(colKey, effectiveSlotCount);
            });
            inner += buildRowActionCells(deps.t("tooltip_copy"), "X", deps.t("tooltip_remove_row"));
            tr.insertAdjacentHTML('beforeend', inner);

            const zoneNameEl = tr.querySelector(".zone-name");
            if (zoneNameEl) zoneNameEl.textContent = deps.getZoneDisplayName(tz);

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) copyBtn.addEventListener("click", () => deps.copyRow(rowId));

            const removeBtn = tr.querySelector(".remove-row-btn");
            if (removeBtn) removeBtn.addEventListener("click", () => deps.removeTimezone(rowId));

            tr.querySelectorAll(".time-input").forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = rowId === "utc" ? null : tz.id;

                const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                if (window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    input._cdp = new CustomDatePicker(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: document.documentElement.lang || "en",
                        theme: document.documentElement.getAttribute("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => deps.handleTimeChange(e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                input.onkeydown = (e) => {
                    if (e.key === "Enter") {
                        deps.handleTimeChange(e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
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
                        e.dataTransfer.setData("text/plain", rowId);
                        const ghost = (typeof deps.createDragGhostFromRow === "function")
                            ? deps.createDragGhostFromRow(tr)
                            : null;
                        e.dataTransfer.setDragImage(ghost || tr, 20, 20);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    tr.classList.remove("dragging");
                    if (typeof deps.clearDragGhost === "function") deps.clearDragGhost();
                    deps.saveOrder();
                    deps.updateClocks();
                });
            }

            return tr;
        }

        function getRenderableTimezoneRows(baseRef) {
            const zoneRows = deps.getCurrentGroupZones().filter(
                (tz) => tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            const rowsToRender = [...zoneRows];
            if (baseRef.id !== "utc" && deps.isCurrentGroupUtcRowVisible()) {
                const utcRef = deps.getUTCRef();
                const insertIndex = Math.min(Math.max(deps.getCurrentGroupUtcRowOrder(), 0), rowsToRender.length);
                rowsToRender.splice(insertIndex, 0, utcRef);
            }
            return rowsToRender;
        }

        function renderList() {
            deps.hideFloatingTooltip();
            if (deps.isMultiTab()) {
                deps.renderMultiRanges();
                return;
            }

            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            const displayColumns = getDisplayColumns(effectiveSlotCount);
            const baseRef = deps.getBaseTimezoneRef();
            const baseRefName = deps.escapeHtml(deps.getZoneDisplayName(baseRef));
            const theadRow = document.querySelector("#table-head tr");

            if (theadRow) {
                const headCells = [`<th class="move-col" style="width: 70px;">${deps.t("th_order")}</th>`];
                headCells.push(...displayColumns.map(getDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_copy")}</th>`);
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_remove")}</th>`);
                theadRow.textContent = "";
                theadRow.insertAdjacentHTML('beforeend', headCells.join(""));
            }

            const container = document.getElementById("clocks-container");
            if (!container) return;
            container.textContent = "";

            const baseRow = document.createElement("tr");
            baseRow.className = "time-row static base-row";
            baseRow.id = `tz-row-${baseRef.id}`;
            let baseInner = `<td class="move-cell"><span class="drag-spacer" aria-hidden="true"></span></td>`;
            displayColumns.forEach((colKey) => {
                baseInner += buildStaticRowCell(colKey, effectiveSlotCount, baseRefName);
            });
            baseInner += buildRowActionCells(deps.t("tooltip_copy"), "");
            baseRow.insertAdjacentHTML('beforeend', baseInner);
            const baseCopyBtn = baseRow.querySelector(".copy-row-btn");
            if (baseCopyBtn) baseCopyBtn.addEventListener("click", () => deps.copyRow(baseRef.id));
            container.appendChild(baseRow);

            for (let i = 0; i < effectiveSlotCount; i++) {
                const inputs = [...baseRow.querySelectorAll(`.time-input[data-slot="${i}"]`)];
                inputs.forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    const slotIdx = parseInt(input.dataset.slot, 10);

                    const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                    if (window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                        input._cdp = new CustomDatePicker(input, {
                            type: inputMode === "date" ? "date" : "datetime",
                            lang: document.documentElement.lang || "en",
                            theme: document.documentElement.getAttribute("data-theme") || "dark",
                            triggerElement: triggerBtn || null
                        });
                    }

                    input.onchange = (e) => deps.handleTimeChange(e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                    input.onkeydown = (e) => {
                        if (e.key === "Enter") {
                            deps.handleTimeChange(e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                            input.blur();
                        }
                    };
                    if (deps.isRealtime()) input.readOnly = true;
                });
            }

            const rowsToRender = getRenderableTimezoneRows(baseRef);
            rowsToRender.forEach((tz) => {
                const rowId = tz.id === "utc" ? "utc" : tz.id;
                const row = createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId);
                container.appendChild(row);
            });

            deps.renderBaseTimeSelect();
            deps.updateTimeAdjustPanel();
            deps.updateClocks();
            deps.upgradeNativeTitleTooltips(container);
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


