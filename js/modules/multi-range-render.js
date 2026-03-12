(function initGtvMultiRangeRender(globalObj) {
    "use strict";

    function createService(deps) {
        function getDayNightGlyph(marker) {
            if (marker === "DAY") return "\u2600\uFE0F";
            if (marker === "NIGHT") return "🌙";
            return marker;
        }

        function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
            let timeStr = "";
            let dayIndex = 0;
            let hour = 0;

            if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
                const offsetMin = tz.type === "custom" ? deps.getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
                const shifted = new Date(date.getTime() + (offsetMin * 60000));
                hour = shifted.getUTCHours();
                dayIndex = shifted.getUTCDay();
                timeStr = `${shifted.getUTCFullYear()}-${deps.pad(shifted.getUTCMonth() + 1)}-${deps.pad(shifted.getUTCDate())} ${deps.pad(hour)}:${deps.pad(shifted.getUTCMinutes())}:${deps.pad(shifted.getUTCSeconds())}`;
            } else {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz.zone,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    weekday: "short",
                    hour12: false
                });
                const parts = formatter.formatToParts(date);
                const get = (type) => parts.find((part) => part.type === type)?.value || "";
                const rawHour = parseInt(get("hour"), 10);
                hour = rawHour === 24 ? 0 : rawHour;
                const weekday = get("weekday");
                dayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekday] ?? 0;
                timeStr = `${get("year")}-${deps.pad(get("month"))}-${deps.pad(get("day"))} ${deps.pad(hour)}:${deps.pad(get("minute"))}:${deps.pad(get("second"))}`;
            }

            const dayNames = deps.I18N_DATA?.[deps.getCurrentLang()]?.days || [];
            const [dateStr, clockStrRaw] = timeStr.split(" ");
            return {
                timeStr,
                dateStr,
                clockStr: (clockStrRaw || "").trim(),
                dayIndex,
                hour,
                dayName: dayNames[dayIndex] || "",
                dayNightIcon: (hour >= 6 && hour <= 18) ? "DAY" : "NIGHT"
            };
        }

        function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
            if (!tz) return null;

            let zoneCodeMain = "";
            let offsetStr = "";
            const fixedDisplayOffsetMinutes = deps.getFixedOffsetForDisplayAtDate(tz, startDate);

            if (tz.type === "custom") {
                zoneCodeMain = deps.normalizeCustomAbbr(tz.abbr);
                const offsetMin = deps.getCustomOffsetMinutes(tz);
                const sign = offsetMin >= 0 ? "+" : "-";
                const absMin = Math.abs(offsetMin);
                offsetStr = `UTC${sign}${deps.pad(Math.floor(absMin / 60))}:${deps.pad(absMin % 60)}`;
            } else {
                zoneCodeMain = deps.getZoneAbbreviation(tz, startDate);
                if (Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
                    const absMin = Math.abs(fixedDisplayOffsetMinutes);
                    offsetStr = `UTC${sign}${deps.pad(Math.floor(absMin / 60))}:${deps.pad(absMin % 60)}`;
                } else {
                    const offFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
                    const partsArr = offFmt.formatToParts(startDate);
                    const offVal = partsArr.find((part) => part.type === "timeZoneName")?.value || "GMT+0";
                    const matched = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
                    if (matched) {
                        const sign = offVal.includes("+") ? "+" : "-";
                        offsetStr = `UTC${sign}${deps.pad(matched[1])}:${deps.pad(matched[2] || 0)}`;
                    } else {
                        offsetStr = "UTC+00:00";
                    }
                }
            }

            const points = [
                getTimezoneDisplayPointAtDate(startDate, tz, fixedDisplayOffsetMinutes),
                getTimezoneDisplayPointAtDate(endDate, tz, fixedDisplayOffsetMinutes)
            ];

            const times = points.map((point) => point.timeStr);
            const dates = points.map((point) => point.dateStr);
            const clocks = points.map((point) => point.clockStr);
            const dayNames = points.map((point) => point.dayName);
            const dayIndexes = points.map((point) => point.dayIndex);
            const dayNightIcons = points.map((point) => point.dayNightIcon);

            const spanDays = deps.getSignedInclusiveDaySpan(times[0], times[1]);
            const spanTime = deps.getSignedDurationDayHourMinute(times[0], times[1]);

            return {
                timezone: zoneCodeMain,
                region: deps.getZoneDisplayName(tz),
                offset: offsetStr,
                times,
                dates,
                clocks,
                dayNames,
                dayIndexes,
                dayNightIcons,
                periodDays: spanDays === null ? "" : `${spanDays}${deps.t("unit_days_suffix")}`,
                periodTime: spanTime === null ? "" : spanTime
            };
        }

        function applySnapshotToRow(row, snapshot) {
            if (!row || !snapshot) return;

            const zoneCodeEl = row.querySelector(".zone-code");
            if (zoneCodeEl) zoneCodeEl.textContent = snapshot.timezone || "";

            const zoneNameEl = row.querySelector(".zone-name");
            if (zoneNameEl && !zoneNameEl.textContent) zoneNameEl.textContent = snapshot.region || "";

            const offsetTextEl = row.querySelector(".offset-text");
            if (offsetTextEl) offsetTextEl.textContent = snapshot.offset || "";

            for (let slotIdx = 0; slotIdx < 2; slotIdx++) {
                const timeStr = snapshot.times?.[slotIdx] || "";
                const dateStr = snapshot.dates?.[slotIdx] || "";
                const clockStr = snapshot.clocks?.[slotIdx] || "";
                const dayName = snapshot.dayNames?.[slotIdx] || "";
                const dayIndex = snapshot.dayIndexes?.[slotIdx] ?? 0;
                const dnMarker = String(snapshot.dayNightIcons?.[slotIdx] || "").trim().toUpperCase();
                const dnGlyph = getDayNightGlyph(dnMarker);

                row.querySelectorAll(`.time-input[data-slot="${slotIdx}"]`).forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    let nextValue = timeStr;
                    if (inputMode === "date") nextValue = dateStr;
                    else if (inputMode === "time") nextValue = clockStr;
                    else if (inputMode === "none") nextValue = "";
                    if (document.activeElement !== input) input.value = nextValue;
                });

                row.querySelectorAll(`.day-slot-${slotIdx}`).forEach((badge) => {
                    badge.textContent = dayName;
                    badge.className = `day-badge day-slot-${slotIdx}`;
                    if (dayIndex === 0) badge.classList.add("day-sun");
                    else if (dayIndex === 6) badge.classList.add("day-sat");
                });

                row.querySelectorAll(`.dn-slot-${slotIdx}`).forEach((dnEl) => {
                    dnEl.textContent = dnGlyph;
                    if (dnMarker === "DAY") dnEl.title = deps.t("dn_day");
                    else if (dnMarker === "NIGHT") dnEl.title = deps.t("dn_night");
                    else dnEl.title = "";
                });
            }

            const periodEl = row.querySelector(".period-days-text");
            if (periodEl) periodEl.textContent = (snapshot.periodDays || "").trim() || "-";

            const periodTimeEl = row.querySelector(".period-time-text");
            if (periodTimeEl) periodTimeEl.textContent = (snapshot.periodTime || "").trim() || "-";
        }

        function formatRangeDurationText(startUtcMs, endUtcMs) {
            const diffMs = endUtcMs - startUtcMs;
            const sign = diffMs < 0 ? "-" : "";
            const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
            const day = Math.floor(totalMinutes / 1440);
            const hour = Math.floor((totalMinutes % 1440) / 60);
            const minute = totalMinutes % 60;
            if (deps.getCurrentLang() === "ko") return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
            return `${sign}${day}d ${hour}h ${minute}m`;
        }

        function getMultiRangeTitleText(rangeIdx, range, baseRef) {
            const safeTitle = deps.sanitizeMultiSubgroupName(
                deps.getCurrentMultiSubgroupName(),
                deps.sanitizeMultiRangeTitle(deps.getMultiRangeTitle())
            );
            const durationText = formatRangeDurationText(range.startUtcMs, range.endUtcMs);
            const baseSnapshot = buildTimezoneComputedSnapshotForRange(
                baseRef,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const startText = baseSnapshot?.times?.[0] || "-";
            const endText = baseSnapshot?.times?.[1] || "-";
            return `${safeTitle} #${rangeIdx + 1} - ${startText} ~ ${endText} [${durationText}]`;
        }

        function createMultiRangeTableRow(tz, options = {}) {
            const { rangeIdx, range, displayColumns, isBase = false, rowId = tz.id, baseNameHtml = "" } = options;
            const tr = document.createElement("tr");
            tr.className = isBase ? "time-row static base-row" : "time-row";
            tr.id = `multi-r${rangeIdx}-tz-row-${rowId}`;

            let inner = "";
            displayColumns.forEach((colKey) => {
                inner += isBase ? deps.buildStaticRowCell(colKey, 2, baseNameHtml) : deps.buildDynamicRowCell(colKey, 2);
            });
            inner += `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${deps.t("tooltip_copy")}">&#128203;</button></div></td>`;
            tr.insertAdjacentHTML('beforeend', inner);

            if (!isBase) {
                const zoneNameEl = tr.querySelector(".zone-name");
                if (zoneNameEl) zoneNameEl.textContent = deps.getZoneDisplayName(tz);
            }

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => deps.copyMultiRangeRow(rangeIdx, rowId));
            }

            tr.querySelectorAll(".time-input").forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = rowId === "utc" ? null : tz.id;
                const lockedByChain = slotIdx === 0 && rangeIdx > 0 && !deps.isMultiRangeStartEditEnabled(rangeIdx);
                const lockedByEndToggle = slotIdx === 1 && !deps.isMultiRangeEndEditEnabled(rangeIdx);
                const lockedByToggle = lockedByChain || lockedByEndToggle;

                const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                if (lockedByToggle) {
                    input.readOnly = true;
                    if (triggerBtn) triggerBtn.style.display = "none";
                }

                if (!lockedByToggle && window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    input._cdp = new CustomDatePicker(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: document.documentElement.lang || "en",
                        theme: document.documentElement.getAttribute("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => {
                    if (lockedByToggle) return;
                    deps.handleMultiRangeTimeChange(rangeIdx, e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                };
                input.onkeydown = (e) => {
                    if (e.key !== "Enter") return;
                    if (!lockedByToggle) deps.handleMultiRangeTimeChange(rangeIdx, input.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                    input.blur();
                };
            });

            const snapshot = buildTimezoneComputedSnapshotForRange(
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            applySnapshotToRow(tr, snapshot);
            return tr;
        }

        function renderMultiRanges() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("multi-ranges-container");
            if (!container) return;

            deps.ensureMultiRangeState();
            deps.refreshMultiRangeControls();
            deps.renderMultiBulkToolSets();

            const baseRef = deps.getBaseTimezoneRef();
            const baseRefName = deps.escapeHtml(deps.getZoneDisplayName(baseRef));
            const displayColumns = deps.getDisplayColumns(2);
            const rowsToRender = deps.getRenderableTimezoneRows(baseRef);
            const multiRanges = deps.getMultiRanges();
            const multiRangeCollapsed = deps.getMultiRangeCollapsed();
            const multiRangeCount = deps.getMultiRangeCount();

            container.innerHTML = "";
            multiRanges.forEach((range, rangeIdx) => {
                const block = document.createElement("div");
                block.className = "multi-range-block";
                const isCollapsed = !!multiRangeCollapsed[rangeIdx];
                if (isCollapsed) block.classList.add("collapsed");

                const header = document.createElement("div");
                header.className = "multi-range-header";
                const title = document.createElement("div");
                title.className = "multi-range-title";
                title.textContent = getMultiRangeTitleText(rangeIdx, range, baseRef);

                const headerActions = document.createElement("div");
                headerActions.className = "multi-range-header-actions";
                const createHeaderActionDivider = () => {
                    const divider = document.createElement("span");
                    divider.className = "multi-range-header-divider";
                    divider.textContent = "|";
                    divider.setAttribute("aria-hidden", "true");
                    return divider;
                };

                const saveRangeBtn = document.createElement("button");
                saveRangeBtn.type = "button";
                saveRangeBtn.className = "sm-btn multi-range-save-btn";
                saveRangeBtn.textContent = deps.t("btn_save_image_range");
                saveRangeBtn.addEventListener("click", () => {
                    deps.saveMultiRangeSingleImage(rangeIdx);
                });

                const copyRangeBtn = document.createElement("button");
                copyRangeBtn.type = "button";
                copyRangeBtn.className = "sm-btn multi-range-copy-btn";
                copyRangeBtn.textContent = deps.t("btn_copy_range");
                copyRangeBtn.addEventListener("click", () => {
                    deps.copyWholeMultiRange(rangeIdx);
                });

                const collapseBelowBtn = document.createElement("button");
                collapseBelowBtn.type = "button";
                collapseBelowBtn.className = "sm-btn multi-range-toggle-btn";
                collapseBelowBtn.textContent = deps.t("btn_collapse_below");
                collapseBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                collapseBelowBtn.addEventListener("click", () => deps.setMultiRangesCollapsedBelow(rangeIdx, true));

                const expandBelowBtn = document.createElement("button");
                expandBelowBtn.type = "button";
                expandBelowBtn.className = "sm-btn multi-range-toggle-btn";
                expandBelowBtn.textContent = deps.t("btn_expand_below");
                expandBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                expandBelowBtn.addEventListener("click", () => deps.setMultiRangesCollapsedBelow(rangeIdx, false));

                const toggleBtn = document.createElement("button");
                toggleBtn.type = "button";
                toggleBtn.className = "sm-btn multi-range-toggle-btn";
                toggleBtn.textContent = isCollapsed ? deps.t("btn_expand_this_range") : deps.t("btn_collapse_this_range");
                toggleBtn.addEventListener("click", () => deps.toggleMultiRangeCollapsed(rangeIdx));

                headerActions.appendChild(saveRangeBtn);
                headerActions.appendChild(copyRangeBtn);
                headerActions.appendChild(createHeaderActionDivider());
                headerActions.appendChild(collapseBelowBtn);
                headerActions.appendChild(expandBelowBtn);
                headerActions.appendChild(createHeaderActionDivider());
                headerActions.appendChild(toggleBtn);
                header.appendChild(title);
                header.appendChild(headerActions);
                block.appendChild(header);

                const adjustRow = document.createElement("div");
                adjustRow.className = "multi-range-adjust-row";
                const startAdjustEnabled = rangeIdx === 0 ? true : deps.isMultiRangeStartEditEnabled(rangeIdx);
                const startAdjustSet = deps.renderTimeAdjustSet(0, {
                    labelText: deps.t("label_start_time_adjust"),
                    includeFixedActions: rangeIdx === 0,
                    includeSyncPreviousEndAction: rangeIdx > 0,
                    disabled: rangeIdx > 0 ? !startAdjustEnabled : false,
                    onAction: (slotIdx, action) => deps.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action)
                });
                if (rangeIdx > 0) {
                    deps.attachTimeAdjustToggleLabel(
                        startAdjustSet,
                        startAdjustEnabled,
                        deps.t("label_start_time_adjust"),
                        (nextChecked) => deps.setMultiRangeStartEditEnabled(rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                }
                adjustRow.appendChild(startAdjustSet);
                const endAdjustEnabled = deps.isMultiRangeEndEditEnabled(rangeIdx);
                const endAdjustSet = deps.renderTimeAdjustSet(1, {
                    labelText: deps.t("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true,
                    disabled: !endAdjustEnabled,
                    onAction: (slotIdx, action) => deps.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action)
                });
                deps.attachTimeAdjustToggleLabel(
                    endAdjustSet,
                    endAdjustEnabled,
                    deps.t("label_extra_time_adjust"),
                    (nextChecked) => deps.setMultiRangeEndEditEnabled(rangeIdx, nextChecked, { persist: true, rerender: true })
                );
                adjustRow.appendChild(endAdjustSet);
                block.appendChild(adjustRow);

                const tableWrap = document.createElement("div");
                tableWrap.className = "multi-range-table-wrap";
                const table = document.createElement("table");
                table.className = "data-table multi-range-table";

                const thead = document.createElement("thead");
                const headCells = [];
                headCells.push(...displayColumns.map(deps.getMultiDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_copy")}</th>`);
                thead.insertAdjacentHTML('afterbegin', `<tr>${headCells.join("")}</tr>`);
                table.appendChild(thead);

                const tbody = document.createElement("tbody");
                const baseRow = createMultiRangeTableRow(baseRef, {
                    rangeIdx,
                    range,
                    displayColumns,
                    isBase: true,
                    rowId: baseRef.id,
                    baseNameHtml: baseRefName
                });
                tbody.appendChild(baseRow);

                rowsToRender.forEach((tz) => {
                    const rowId = tz.id === "utc" ? "utc" : tz.id;
                    tbody.appendChild(createMultiRangeTableRow(tz, {
                        rangeIdx,
                        range,
                        displayColumns,
                        isBase: false,
                        rowId
                    }));
                });

                table.appendChild(tbody);
                tableWrap.appendChild(table);
                block.appendChild(tableWrap);
                container.appendChild(block);
            });

            deps.updateTimeAdjustPanel();
            deps.updateCopyFormatPreview();
            deps.upgradeNativeTitleTooltips(container);
        }

        return Object.freeze({
            getTimezoneDisplayPointAtDate,
            buildTimezoneComputedSnapshotForRange,
            applySnapshotToRow,
            formatRangeDurationText,
            getMultiRangeTitleText,
            createMultiRangeTableRow,
            renderMultiRanges
        });
    }

    globalObj.GTVMultiRangeRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


