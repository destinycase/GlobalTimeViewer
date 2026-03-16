(function initGtvFixedTimeTable(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeTable] Dependency "${name}" threw.`, err);
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

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function getFixedTimeSlotLayoutMetrics(partsEnabled) {
            const safeParts = (partsEnabled && typeof partsEnabled === "object")
                ? partsEnabled
                : {};
            const showDn = safeParts.dn !== false;
            const showTime = safeParts.time !== false;
            const showWeekday = safeParts.weekday !== false;

            const inputWidthPx = showTime ? 100 : 0;
            const dayNightWidthPx = showDn ? 20 : 0;
            const weekdayWidthPx = showWeekday ? 28 : 0;
            const calendarBtnWidthPx = showTime ? 22 : 0;
            const copyBtnWidthPx = 24;
            const paddingAndGapPx = 16;
            const minimumWidthPx = showTime ? 152 : 72;
            const columnMinWidthPx = Math.max(
                minimumWidthPx,
                inputWidthPx + dayNightWidthPx + weekdayWidthPx + calendarBtnWidthPx + copyBtnWidthPx + paddingAndGapPx
            );

            return {
                inputWidthPx,
                columnMinWidthPx
            };
        }

        function getFixedTimeDisplayColumns() {
            const order = invokeDep("sanitizeCopyFormatOrderForContext", invokeDep("getDisplayFormatOrder"), "fixed-time");
            const enabled = invokeDep("sanitizeCopyFormatEnabledForContext", invokeDep("getDisplayFormatEnabled"), "display", "fixed-time");
            const columns = [];
            asArray(order).forEach((key) => {
                if (key === "time") {
                    if (enabled?.time) columns.push("time_slots");
                    return;
                }
                if (!enabled?.[key]) return;
                if (key === "timezone" || key === "region" || key === "offset") {
                    columns.push(key);
                }
            });
            return columns;
        }

        function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
            if (!tz || typeof tz !== "object") return "";
            const safeAnchorDate = isValidDate(anchorDate) ? anchorDate : new Date();
            if (tz.type === "custom") {
                return invokeDep("formatUtcOffsetLabel", invokeDep("getCustomOffsetMinutes", tz)) || "";
            }
            if (tz.zone === "UTC") {
                return invokeDep("formatUtcOffsetLabel", 0) || "";
            }
            const fixedOffset = invokeDep("getFixedOffsetForDisplayAtDate", tz, safeAnchorDate);
            if (Number.isFinite(fixedOffset)) {
                return invokeDep("formatUtcOffsetLabel", fixedOffset) || "";
            }
            return invokeDep("formatUtcOffsetLabel", invokeDep("getTimezoneOffset", tz.zone || "UTC", safeAnchorDate)) || "";
        }

        function renderFixedTimeTable() {
            if (typeof document !== "object" || !document) return;
            const headRow = document.querySelector("#fixed-time-table-head tr");
            const body = document.getElementById("fixed-time-body");
            const group = invokeDep("getCurrentGroup");
            if (!headRow || !body || !group) return;

            invokeDep("ensureGroupFixedTimes", group);
            const fixedTimes = asArray(group.fixedTimes);
            const displayPartsEnabled = invokeDep("getFixedTimeDisplayPartsEnabled") || {};
            const slotLayout = getFixedTimeSlotLayoutMetrics(displayPartsEnabled);
            const displayColumns = getFixedTimeDisplayColumns();
            const fixedTimeTable = document.querySelector(".fixed-time-table");
            if (fixedTimeTable?.style && typeof fixedTimeTable.style.setProperty === "function") {
                fixedTimeTable.style.setProperty("--fixed-time-slot-min-width", `${slotLayout.columnMinWidthPx}px`);
                fixedTimeTable.style.setProperty("--fixed-time-input-width", `${slotLayout.inputWidthPx}px`);
            }

            headRow.textContent = "";

            displayColumns.forEach((colKey) => {
                if (colKey === "timezone") {
                    const timezoneHead = document.createElement("th");
                    timezoneHead.style.width = "110px";
                    timezoneHead.textContent = translate("th_tz_abbr");
                    headRow.appendChild(timezoneHead);
                    return;
                }
                if (colKey === "region") {
                    const nameHead = document.createElement("th");
                    nameHead.style.width = "220px";
                    nameHead.textContent = translate("th_region");
                    headRow.appendChild(nameHead);
                    return;
                }
                if (colKey === "offset") {
                    const offsetHead = document.createElement("th");
                    offsetHead.style.width = "140px";
                    offsetHead.textContent = translate("th_utc_offset");
                    headRow.appendChild(offsetHead);
                    return;
                }
                if (colKey !== "time_slots") return;

                fixedTimes.forEach((slot, slotIdx) => {
                    const slotHead = document.createElement("th");
                    slotHead.className = "dynamic-col fixed-time-slot-head-cell";
                    slotHead.style.minWidth = `${slotLayout.columnMinWidthPx}px`;

                    const slotHeadWrap = document.createElement("div");
                    slotHeadWrap.className = "fixed-time-slot-head";

                    const slotHeadTop = document.createElement("div");
                    slotHeadTop.className = "fixed-time-slot-head-top";

                    const colorDot = document.createElement("span");
                    colorDot.className = "fixed-time-slot-dot";
                    colorDot.style.background = invokeDep("getFixedTimeTimelineIndicatorColor", slotIdx) || "";
                    colorDot.setAttribute("aria-hidden", "true");

                    const markerWrap = document.createElement("span");
                    markerWrap.className = "fixed-time-slot-marker";
                    markerWrap.appendChild(colorDot);

                    const slotTitle = document.createElement("span");
                    slotTitle.className = "fixed-time-slot-title";
                    slotTitle.textContent = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, fixedTimes.length) || "";

                    const renameBtn = document.createElement("button");
                    renameBtn.type = "button";
                    renameBtn.className = "sm-btn fixed-time-slot-rename-btn export-exclude";
                    renameBtn.title = translate("btn_rename");
                    renameBtn.textContent = "\u270E";
                    renameBtn.addEventListener("click", () => {
                        invokeDep("renameFixedTimeSlot", slotIdx);
                    });
                    slotHeadTop.appendChild(renameBtn);

                    const copySlotBtn = document.createElement("button");
                    copySlotBtn.type = "button";
                    copySlotBtn.className = "sm-btn fixed-time-slot-copy-btn custom-tooltip export-exclude";
                    copySlotBtn.title = translate("tooltip_copy");
                    copySlotBtn.textContent = "\uD83D\uDCCB";
                    copySlotBtn.addEventListener("click", async () => {
                        await invokeDep("copyFixedTimeSlotColumn", slotIdx);
                    });

                    const actionsWrap = document.createElement("span");
                    actionsWrap.className = "fixed-time-slot-actions";
                    actionsWrap.appendChild(renameBtn);
                    actionsWrap.appendChild(copySlotBtn);

                    slotHeadTop.appendChild(markerWrap);
                    slotHeadTop.appendChild(slotTitle);
                    slotHeadTop.appendChild(actionsWrap);

                    slotHeadWrap.appendChild(slotHeadTop);
                    slotHead.appendChild(slotHeadWrap);
                    headRow.appendChild(slotHead);
                });
            });

            body.textContent = "";
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
            const anchorDate = isValidDate(invokeDep("getGlobalTime", 0))
                ? invokeDep("getGlobalTime", 0)
                : new Date();
            const slotUtcDates = fixedTimes.map((slot) => invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate));

            rows.forEach((tz) => {
                const row = document.createElement("tr");
                row.className = "time-row fixed-time-row";
                row.id = `tz-row-${tz.id}`;
                const isBaseRow = tz.id === baseRef.id;
                if (isBaseRow) row.classList.add("static");
                row.draggable = false;

                const offsetAnchorDate = isValidDate(slotUtcDates[0]) ? slotUtcDates[0] : anchorDate;
                displayColumns.forEach((colKey) => {
                    if (colKey === "timezone") {
                        const tzCell = document.createElement("td");
                        tzCell.className = "timezone-cell";
                        const abbrWrap = document.createElement("div");
                        abbrWrap.className = "abbr-cell";
                        const zoneCode = document.createElement("span");
                        zoneCode.className = "zone-code";
                        zoneCode.textContent = invokeDep("getZoneAbbreviation", tz, anchorDate) || "";
                        abbrWrap.appendChild(zoneCode);
                        tzCell.appendChild(abbrWrap);
                        row.appendChild(tzCell);
                        return;
                    }

                    if (colKey === "region") {
                        const nameCell = document.createElement("td");
                        const zoneInfo = document.createElement("div");
                        zoneInfo.className = "zone-info";
                        const zoneName = document.createElement("span");
                        zoneName.className = "zone-name";
                        zoneName.textContent = invokeDep("getZoneDisplayName", tz) || "";
                        zoneInfo.appendChild(zoneName);
                        nameCell.appendChild(zoneInfo);
                        row.appendChild(nameCell);
                        return;
                    }

                    if (colKey === "offset") {
                        const offsetCell = document.createElement("td");
                        const offsetText = document.createElement("span");
                        offsetText.className = "offset-text";
                        offsetText.textContent = getFixedTimeOffsetTextAtDate(tz, offsetAnchorDate);
                        offsetCell.appendChild(offsetText);
                        row.appendChild(offsetCell);
                        return;
                    }

                    if (colKey !== "time_slots") return;
                    slotUtcDates.forEach((utcDate, slotIdx) => {
                        const timeCell = document.createElement("td");
                        timeCell.className = "fixed-time-time";
                        const payload = invokeDep("buildFixedTimeDisplayPayloadAtUtc", utcDate, tz);
                        const cellWrap = document.createElement("div");
                        cellWrap.className = "fixed-time-cell-wrap";

                        const timeGroup = document.createElement("div");
                        timeGroup.className = "time-day-group";
                        let hasTimeGroupContent = false;

                        if (displayPartsEnabled.dn) {
                            const dnEl = document.createElement("span");
                            dnEl.className = "dn-icon";
                            dnEl.textContent = payload?.dayNightGlyph || "";
                            dnEl.title = payload?.dayNightMarker === "DAY" ? translate("dn_day") : translate("dn_night");
                            timeGroup.appendChild(dnEl);
                            hasTimeGroupContent = true;
                        }

                        let timeInput = null;
                        let triggerBtn = null;
                        if (displayPartsEnabled.time) {
                            timeInput = document.createElement("input");
                            timeInput.type = "text";
                            timeInput.className = "time-input fixed-time-time-input";
                            timeInput.spellcheck = false;
                            timeInput.value = invokeDep("buildFixedTimeCellInputValue", utcDate, tz) || "";
                            timeGroup.appendChild(timeInput);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.weekday && payload?.dayName) {
                            const dayEl = document.createElement("span");
                            const isSun = payload.weekdayIndex === 0;
                            const isSat = payload.weekdayIndex === 6;
                            dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
                            dayEl.textContent = payload.dayName;
                            timeGroup.appendChild(dayEl);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.time) {
                            triggerBtn = document.createElement("button");
                            triggerBtn.type = "button";
                            triggerBtn.className = "calendar-btn";
                            triggerBtn.tabIndex = -1;
                            triggerBtn.title = "Time Picker";
                            triggerBtn.textContent = "\uD83D\uDCC5";
                            timeGroup.appendChild(triggerBtn);
                            hasTimeGroupContent = true;
                        }

                        if (timeInput && triggerBtn) {
                            invokeDep("bindCustomDatePickerForInput", timeInput, triggerBtn, { preserveValue: true, type: "time" });
                            timeInput.value = invokeDep("buildFixedTimeCellInputValue", utcDate, tz) || "";

                            const commitCellInput = () => {
                                const latestInput = String(timeInput.value || "").trim();
                                invokeDep("applyFixedTimeSlotByTimezoneInput", slotIdx, tz, latestInput, utcDate);
                            };
                            timeInput.addEventListener("change", commitCellInput);
                            timeInput.addEventListener("keydown", (event) => {
                                if (event.key !== "Enter") return;
                                event.preventDefault();
                                timeInput.blur();
                            });
                            timeInput.addEventListener("blur", commitCellInput);
                        }

                        if (hasTimeGroupContent) {
                            cellWrap.appendChild(timeGroup);
                        }

                        const copyBtn = document.createElement("button");
                        copyBtn.type = "button";
                        copyBtn.className = "sm-btn fixed-time-copy-btn custom-tooltip export-exclude";
                        copyBtn.title = translate("tooltip_copy");
                        copyBtn.textContent = "\uD83D\uDCCB";
                        copyBtn.addEventListener("click", async () => {
                            await invokeDep("copyFixedTimeCellByTimezone", tz, utcDate);
                        });
                        cellWrap.appendChild(copyBtn);

                        timeCell.appendChild(cellWrap);
                        row.appendChild(timeCell);
                    });
                });

                body.appendChild(row);
            });
            invokeDep("upgradeNativeTitleTooltips", headRow);
            invokeDep("upgradeNativeTitleTooltips", body);
        }

        return Object.freeze({
            getFixedTimeSlotLayoutMetrics,
            getFixedTimeDisplayColumns,
            getFixedTimeOffsetTextAtDate,
            renderFixedTimeTable
        });
    }

    globalObj.GTVFixedTimeTable = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
