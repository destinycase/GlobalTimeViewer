(function initGtvMultiRangeRender(globalObj) {
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
                console.warn(`[GTVMultiRangeRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function getCurrentLang() {
            return invokeDep("getCurrentLang") === "ko" ? "ko" : "en";
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function destroyDatePickersInRoot(root) {
            if (!root || typeof root.querySelectorAll !== "function") return;
            const inputs = asArray(root.querySelectorAll(".time-input"));
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

        function getZoneDisplayNameForUiAtDate(tz, anchorDate) {
            const safeAnchorDate = isValidDate(anchorDate) ? anchorDate : new Date();
            const uiName = invokeDep("getZoneDisplayNameForUiAtDate", tz, safeAnchorDate);
            if (typeof uiName === "string" && uiName.trim()) return uiName;
            return invokeDep("getZoneDisplayName", tz) || "";
        }

        function getDayNightGlyph(marker) {
            if (marker === "DAY") return "\u2600\uFE0F";
            if (marker === "NIGHT") return "\uD83C\uDF19";
            return marker;
        }

        function applyZoneCodeKindClass(zoneCodeEl, timezoneRef = null) {
            if (!zoneCodeEl || !zoneCodeEl.classList || typeof zoneCodeEl.classList.toggle !== "function") return;
            const isCustom = !!(timezoneRef && timezoneRef.type === "custom");
            zoneCodeEl.classList.toggle("zone-code-custom", isCustom);
            zoneCodeEl.classList.toggle("zone-code-standard", !isCustom);
        }

        function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
            const snapshot = invokeDep(
                "buildTimezoneComputedSnapshotForDates",
                tz,
                [date],
                { fixedDisplayOffsetMinutes }
            ) || {};
            const timeStr = snapshot.times?.[0] || "";
            const dateStr = snapshot.dates?.[0] || "";
            const clockStr = snapshot.clocks?.[0] || "";
            const dayIndex = Number.isFinite(snapshot.dayIndexes?.[0]) ? snapshot.dayIndexes[0] : 0;
            const hour = Number.parseInt(clockStr.slice(0, 2), 10) || 0;
            return {
                timeStr,
                dateStr,
                clockStr,
                dayIndex,
                hour,
                dayName: snapshot.dayNames?.[0] || "",
                dayNightIcon: snapshot.dayNightIcons?.[0] || (hour >= 6 && hour <= 18 ? "DAY" : "NIGHT")
            };
        }

        function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
            if (!tz) return null;
            const fixedDisplayOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, startDate);
            return invokeDep(
                "buildTimezoneComputedSnapshotForDates",
                tz,
                [startDate, endDate],
                { fixedDisplayOffsetMinutes }
            ) || null;
        }

        function applySnapshotToRow(row, snapshot) {
            if (!row || !snapshot || typeof row.querySelector !== "function") return;
            const doc = getDocumentRef();

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

                const inputs = asArray(row.querySelectorAll?.(`.time-input[data-slot="${slotIdx}"]`));
                inputs.forEach((input) => {
                    const inputMode = input.dataset?.inputMode || "datetime";
                    let nextValue = timeStr;
                    if (inputMode === "date") nextValue = dateStr;
                    else if (inputMode === "time") nextValue = clockStr;
                    else if (inputMode === "none") nextValue = "";
                    if (!doc || doc.activeElement !== input) input.value = nextValue;
                });

                const badges = asArray(row.querySelectorAll?.(`.day-slot-${slotIdx}`));
                badges.forEach((badge) => {
                    badge.textContent = dayName;
                    badge.className = `day-badge day-slot-${slotIdx}`;
                    if (dayIndex === 0) badge.classList?.add?.("day-sun");
                    else if (dayIndex === 6) badge.classList?.add?.("day-sat");
                });

                const dnElements = asArray(row.querySelectorAll?.(`.dn-slot-${slotIdx}`));
                dnElements.forEach((dnEl) => {
                    dnEl.textContent = dnGlyph;
                    if (dnMarker === "DAY") dnEl.title = translate("dn_day");
                    else if (dnMarker === "NIGHT") dnEl.title = translate("dn_night");
                    else dnEl.title = "";
                });
            }

            const periodEl = row.querySelector(".period-days-text");
            if (periodEl) periodEl.textContent = (snapshot.periodDays || "").trim() || "-";

            const periodTimeEl = row.querySelector(".period-time-text");
            if (periodTimeEl) periodTimeEl.textContent = (snapshot.periodTime || "").trim() || "-";
        }

        function formatRangeDurationText(startUtcMs, endUtcMs) {
            const safeStart = Number(startUtcMs);
            const safeEnd = Number(endUtcMs);
            const diffMs = (Number.isFinite(safeEnd) ? safeEnd : 0) - (Number.isFinite(safeStart) ? safeStart : 0);
            const sign = diffMs < 0 ? "-" : "";
            const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
            const day = Math.floor(totalMinutes / 1440);
            const hour = Math.floor((totalMinutes % 1440) / 60);
            const minute = totalMinutes % 60;
            if (getCurrentLang() === "ko") return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
            return `${sign}${day}d ${hour}h ${minute}m`;
        }

        function getMultiRangeTitleText(rangeIdx, range, baseRef) {
            const safeRange = (range && typeof range === "object") ? range : { startUtcMs: 0, endUtcMs: 0 };
            const safeTitle = invokeDep(
                "sanitizeMultiSubgroupName",
                invokeDep("getCurrentMultiSubgroupName"),
                invokeDep("sanitizeMultiRangeTitle", invokeDep("getMultiRangeTitle"))
            ) || "";
            const durationText = formatRangeDurationText(safeRange.startUtcMs, safeRange.endUtcMs);
            const baseSnapshot = buildTimezoneComputedSnapshotForRange(
                baseRef,
                new Date(safeRange.startUtcMs),
                new Date(safeRange.endUtcMs)
            );
            const startText = baseSnapshot?.times?.[0] || "-";
            const endText = baseSnapshot?.times?.[1] || "-";
            return `${safeTitle} #${rangeIdx + 1} - ${startText} ~ ${endText} [${durationText}]`;
        }

        function createMultiRangeTableRow(tz, options = {}) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;

            const safeTz = (tz && typeof tz === "object") ? tz : {};
            const safeOptions = (options && typeof options === "object") ? options : {};
            const rangeIdx = Number(safeOptions.rangeIdx) || 0;
            const range = (safeOptions.range && typeof safeOptions.range === "object")
                ? safeOptions.range
                : { startUtcMs: 0, endUtcMs: 0 };
            const displayColumns = asArray(safeOptions.displayColumns);
            const isBase = !!safeOptions.isBase;
            const safeRowId = String(safeOptions.rowId || safeTz.id || "utc");
            const baseNameHtml = String(safeOptions.baseNameHtml || "");

            const tr = doc.createElement("tr");
            tr.className = isBase ? "time-row static base-row" : "time-row";
            tr.id = `multi-r${rangeIdx}-tz-row-${safeRowId}`;

            let inner = "";
            displayColumns.forEach((colKey) => {
                if (isBase) {
                    inner += String(invokeDep("buildStaticRowCell", colKey, 2, baseNameHtml) || "");
                } else {
                    inner += String(invokeDep("buildDynamicRowCell", colKey, 2) || "");
                }
            });
            inner += `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${translate("tooltip_copy")}">&#128203;</button></div></td>`;
            tr.insertAdjacentHTML("beforeend", inner);
            applyZoneCodeKindClass(tr.querySelector(".zone-code"), safeTz);

            if (!isBase) {
                const zoneNameEl = tr.querySelector(".zone-name");
                if (zoneNameEl) {
                    const anchorDate = new Date(range.startUtcMs);
                    zoneNameEl.textContent = getZoneDisplayNameForUiAtDate(safeTz, anchorDate) || "";
                }
            }

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => invokeDep("copyMultiRangeRow", rangeIdx, safeRowId));
            }

            const inputs = asArray(tr.querySelectorAll(".time-input"));
            inputs.forEach((input) => {
                const slotIdx = parseInt(input.dataset?.slot, 10);
                const inputMode = input.dataset?.inputMode || "datetime";
                const timezoneId = safeRowId === "utc" ? null : safeTz.id;
                const lockedByChain = slotIdx === 0 && rangeIdx > 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx);
                const lockedByEndToggle = slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx);
                const lockedByToggle = lockedByChain || lockedByEndToggle;

                const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                if (lockedByToggle) {
                    input.readOnly = true;
                    if (triggerBtn?.style) triggerBtn.style.display = "none";
                }

                const CustomDatePickerCtor = globalObj.CustomDatePicker;
                if (!lockedByToggle && CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
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

                input.onchange = (e) => {
                    if (lockedByToggle) return;
                    invokeDep("handleMultiRangeTimeChange", rangeIdx, e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                };
                input.onkeydown = (e) => {
                    if (e.key !== "Enter") return;
                    if (!lockedByToggle) {
                        invokeDep("handleMultiRangeTimeChange", rangeIdx, input.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                    }
                    input.blur();
                };
            });

            const snapshot = buildTimezoneComputedSnapshotForRange(
                safeTz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            applySnapshotToRow(tr, snapshot);
            return tr;
        }

        function renderMultiRanges() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;

            invokeDep("hideFloatingTooltip");
            const container = doc.getElementById("multi-ranges-container");
            if (!container) return;

            invokeDep("ensureMultiRangeState");
            invokeDep("refreshMultiRangeControls");
            invokeDep("renderMultiBulkToolSets");

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) {
                destroyDatePickersInRoot(container);
                container.innerHTML = "";
                return;
            }
            const displayColumns = asArray(invokeDep("getDisplayColumns", 2));
            const rowsToRender = asArray(invokeDep("getRenderableTimezoneRows", baseRef));
            const multiRanges = asArray(invokeDep("getMultiRanges"));
            const multiRangeCollapsed = asArray(invokeDep("getMultiRangeCollapsed"));
            const multiRangeCountRaw = Number(invokeDep("getMultiRangeCount"));
            const multiRangeCount = Number.isFinite(multiRangeCountRaw) ? multiRangeCountRaw : multiRanges.length;

            destroyDatePickersInRoot(container);
            container.innerHTML = "";
            multiRanges.forEach((range, rangeIdx) => {
                const rangeAnchorDate = new Date(range?.startUtcMs);
                const baseZoneName = getZoneDisplayNameForUiAtDate(baseRef, rangeAnchorDate) || "";
                const escapedBaseZoneName = invokeDep("escapeHtml", baseZoneName);
                const baseRefName = (typeof escapedBaseZoneName === "string") ? escapedBaseZoneName : String(baseZoneName);

                const block = doc.createElement("div");
                block.className = "multi-range-block";
                const isCollapsed = !!multiRangeCollapsed[rangeIdx];
                if (isCollapsed) block.classList.add("collapsed");

                const header = doc.createElement("div");
                header.className = "multi-range-header";
                const title = doc.createElement("div");
                title.className = "multi-range-title";
                title.textContent = getMultiRangeTitleText(rangeIdx, range, baseRef);

                const headerActions = doc.createElement("div");
                headerActions.className = "multi-range-header-actions";
                const createHeaderActionDivider = () => {
                    const divider = doc.createElement("span");
                    divider.className = "multi-range-header-divider";
                    divider.textContent = "|";
                    divider.setAttribute("aria-hidden", "true");
                    return divider;
                };

                const saveRangeBtn = doc.createElement("button");
                saveRangeBtn.type = "button";
                saveRangeBtn.className = "sm-btn multi-range-save-btn";
                saveRangeBtn.textContent = translate("btn_save_image_range");
                saveRangeBtn.addEventListener("click", () => {
                    invokeDep("saveMultiRangeSingleImage", rangeIdx);
                });

                const copyRangeBtn = doc.createElement("button");
                copyRangeBtn.type = "button";
                copyRangeBtn.className = "sm-btn multi-range-copy-btn";
                copyRangeBtn.textContent = translate("btn_copy_range");
                copyRangeBtn.addEventListener("click", () => {
                    invokeDep("copyWholeMultiRange", rangeIdx);
                });

                const collapseBelowBtn = doc.createElement("button");
                collapseBelowBtn.type = "button";
                collapseBelowBtn.className = "sm-btn multi-range-toggle-btn";
                collapseBelowBtn.textContent = translate("btn_collapse_below");
                collapseBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                collapseBelowBtn.addEventListener("click", () => invokeDep("setMultiRangesCollapsedBelow", rangeIdx, true));

                const expandBelowBtn = doc.createElement("button");
                expandBelowBtn.type = "button";
                expandBelowBtn.className = "sm-btn multi-range-toggle-btn";
                expandBelowBtn.textContent = translate("btn_expand_below");
                expandBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                expandBelowBtn.addEventListener("click", () => invokeDep("setMultiRangesCollapsedBelow", rangeIdx, false));

                const toggleBtn = doc.createElement("button");
                toggleBtn.type = "button";
                toggleBtn.className = "sm-btn multi-range-toggle-btn";
                toggleBtn.textContent = isCollapsed ? translate("btn_expand_this_range") : translate("btn_collapse_this_range");
                toggleBtn.addEventListener("click", () => invokeDep("toggleMultiRangeCollapsed", rangeIdx));

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

                const adjustRow = doc.createElement("div");
                adjustRow.className = "multi-range-adjust-row";
                const startAdjustEnabled = !!invokeDep("isMultiRangeStartEditEnabled", rangeIdx);
                const startAdjustSet = (rangeIdx > 0)
                    ? invokeDep("renderTimeAdjustSet", 0, {
                        labelText: translate("label_start_time_adjust"),
                        includeFixedActions: false,
                        includeSyncPreviousEndAction: true,
                        disabled: !startAdjustEnabled,
                        onAction: (slotIdx, action) => invokeDep("applyMultiRangeTimeAdjustAction", rangeIdx, slotIdx, action)
                    })
                    : null;
                if (startAdjustSet) {
                    invokeDep(
                        "attachTimeAdjustToggleLabel",
                        startAdjustSet,
                        startAdjustEnabled,
                        translate("label_start_time_adjust"),
                        (nextChecked) => invokeDep("setMultiRangeStartEditEnabled", rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                    adjustRow.appendChild(startAdjustSet);
                }

                const endAdjustEnabled = !!invokeDep("isMultiRangeEndEditEnabled", rangeIdx);
                const endAdjustSet = invokeDep("renderTimeAdjustSet", 1, {
                    labelText: translate("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true,
                    disabled: !endAdjustEnabled,
                    onAction: (slotIdx, action) => invokeDep("applyMultiRangeTimeAdjustAction", rangeIdx, slotIdx, action)
                });
                if (endAdjustSet) {
                    invokeDep(
                        "attachTimeAdjustToggleLabel",
                        endAdjustSet,
                        endAdjustEnabled,
                        translate("label_extra_time_adjust"),
                        (nextChecked) => invokeDep("setMultiRangeEndEditEnabled", rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                    adjustRow.appendChild(endAdjustSet);
                }
                block.appendChild(adjustRow);

                const tableWrap = doc.createElement("div");
                tableWrap.className = "multi-range-table-wrap";
                const table = doc.createElement("table");
                table.className = "data-table multi-range-table";

                const thead = doc.createElement("thead");
                const headCells = [];
                headCells.push(...displayColumns.map((colKey) => invokeDep("getMultiDisplayColumnHeader", colKey)).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_copy")}</th>`);
                thead.insertAdjacentHTML("afterbegin", `<tr>${headCells.join("")}</tr>`);
                table.appendChild(thead);

                const tbody = doc.createElement("tbody");
                const baseRow = createMultiRangeTableRow(baseRef, {
                    rangeIdx,
                    range,
                    displayColumns,
                    isBase: true,
                    rowId: baseRef.id,
                    baseNameHtml: baseRefName
                });
                if (baseRow) tbody.appendChild(baseRow);

                rowsToRender.forEach((tz) => {
                    if (!tz || typeof tz !== "object") return;
                    const rowId = tz.id === "utc" ? "utc" : tz.id;
                    const row = createMultiRangeTableRow(tz, {
                        rangeIdx,
                        range,
                        displayColumns,
                        isBase: false,
                        rowId
                    });
                    if (row) tbody.appendChild(row);
                });

                table.appendChild(tbody);
                tableWrap.appendChild(table);
                block.appendChild(tableWrap);
                container.appendChild(block);
            });

            invokeDep("updateTimeAdjustPanel");
            invokeDep("updateCopyFormatPreview");
            invokeDep("upgradeNativeTitleTooltips", container);
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
