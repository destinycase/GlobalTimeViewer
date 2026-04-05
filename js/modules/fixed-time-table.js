(function initGtvFixedTimeTable(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const liveNowElementMap = new Map();

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
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document === "object") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document === "object") {
                return globalObj.document;
            }
            if (typeof document === "object" && document) {
                return document;
            }
            return null;
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVFixedTimeTable] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            t: toSafeCallable("t", safeDeps.t),
            sanitizeCopyFormatOrderForContext: toSafeCallable("sanitizeCopyFormatOrderForContext", safeDeps.sanitizeCopyFormatOrderForContext),
            getDisplayFormatOrder: toSafeCallable("getDisplayFormatOrder", safeDeps.getDisplayFormatOrder),
            sanitizeCopyFormatEnabledForContext: toSafeCallable("sanitizeCopyFormatEnabledForContext", safeDeps.sanitizeCopyFormatEnabledForContext),
            getDisplayFormatEnabled: toSafeCallable("getDisplayFormatEnabled", safeDeps.getDisplayFormatEnabled),
            formatUtcOffsetLabel: toSafeCallable("formatUtcOffsetLabel", safeDeps.formatUtcOffsetLabel),
            getCustomOffsetMinutes: toSafeCallable("getCustomOffsetMinutes", safeDeps.getCustomOffsetMinutes),
            getFixedOffsetForDisplayAtDate: toSafeCallable("getFixedOffsetForDisplayAtDate", safeDeps.getFixedOffsetForDisplayAtDate),
            getTimezoneOffset: toSafeCallable("getTimezoneOffset", safeDeps.getTimezoneOffset),
            getZoneDisplayNameForUiAtDate: toSafeCallable("getZoneDisplayNameForUiAtDate", safeDeps.getZoneDisplayNameForUiAtDate),
            getZoneDisplayName: toSafeCallable("getZoneDisplayName", safeDeps.getZoneDisplayName),
            getBaseTimezoneRef: toSafeCallable("getBaseTimezoneRef", safeDeps.getBaseTimezoneRef),
            getRenderableTimezoneRows: toSafeCallable("getRenderableTimezoneRows", safeDeps.getRenderableTimezoneRows),
            getFixedTimeDisplayPartsEnabled: toSafeCallable("getFixedTimeDisplayPartsEnabled", safeDeps.getFixedTimeDisplayPartsEnabled),
            buildFixedTimeDisplayPayloadAtUtc: toSafeCallable("buildFixedTimeDisplayPayloadAtUtc", safeDeps.buildFixedTimeDisplayPayloadAtUtc),
            getCurrentGroup: toSafeCallable("getCurrentGroup", safeDeps.getCurrentGroup),
            ensureGroupFixedTimes: toSafeCallable("ensureGroupFixedTimes", safeDeps.ensureGroupFixedTimes),
            getFixedTimeTimelineIndicatorColor: toSafeCallable("getFixedTimeTimelineIndicatorColor", safeDeps.getFixedTimeTimelineIndicatorColor),
            getFixedTimeSlotHeaderLabel: toSafeCallable("getFixedTimeSlotHeaderLabel", safeDeps.getFixedTimeSlotHeaderLabel),
            renameFixedTimeSlot: toSafeCallable("renameFixedTimeSlot", safeDeps.renameFixedTimeSlot),
            copyFixedTimeSlotColumn: toSafeCallable("copyFixedTimeSlotColumn", safeDeps.copyFixedTimeSlotColumn),
            getGlobalTime: toSafeCallable("getGlobalTime", safeDeps.getGlobalTime),
            resolveFixedTimeSlotUtcDate: toSafeCallable("resolveFixedTimeSlotUtcDate", safeDeps.resolveFixedTimeSlotUtcDate),
            getZoneAbbreviation: toSafeCallable("getZoneAbbreviation", safeDeps.getZoneAbbreviation),
            buildFixedTimeCellInputValue: toSafeCallable("buildFixedTimeCellInputValue", safeDeps.buildFixedTimeCellInputValue),
            bindCustomDatePickerForInput: toSafeCallable("bindCustomDatePickerForInput", safeDeps.bindCustomDatePickerForInput),
            applyFixedTimeSlotByTimezoneInput: toSafeCallable("applyFixedTimeSlotByTimezoneInput", safeDeps.applyFixedTimeSlotByTimezoneInput),
            copyFixedTimeCellByTimezone: toSafeCallable("copyFixedTimeCellByTimezone", safeDeps.copyFixedTimeCellByTimezone),
            upgradeNativeTitleTooltips: toSafeCallable("upgradeNativeTitleTooltips", safeDeps.upgradeNativeTitleTooltips)
        });

        function getRenderableTimezoneRowsSafe(baseRef) {
            return asArray(dep.getRenderableTimezoneRows(baseRef));
        }

        function translate(key) {
            const value = dep.t(key);
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

        function getFixedTimeSlotLayoutMetrics(partsEnabled) {
            const safeParts = (partsEnabled && typeof partsEnabled === "object")
                ? partsEnabled
                : {};
            const showDn = safeParts.dn !== false;
            const showTime = safeParts.time !== false;
            const showWeekday = safeParts.weekday !== false;
            const inputWidthPx = showTime ? 85 : 0;
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
            const order = dep.sanitizeCopyFormatOrderForContext(dep.getDisplayFormatOrder(), "fixed-time");
            const enabled = dep.sanitizeCopyFormatEnabledForContext(dep.getDisplayFormatEnabled(), "display", "fixed-time");
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
                return dep.formatUtcOffsetLabel(dep.getCustomOffsetMinutes(tz)) || "";
            }
            if (tz.zone === "UTC") {
                return dep.formatUtcOffsetLabel(0) || "";
            }
            const fixedOffset = dep.getFixedOffsetForDisplayAtDate(tz, safeAnchorDate);
            if (Number.isFinite(fixedOffset)) {
                return dep.formatUtcOffsetLabel(fixedOffset) || "";
            }
            return dep.formatUtcOffsetLabel(dep.getTimezoneOffset(tz.zone || "UTC", safeAnchorDate)) || "";
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate) {
            const safeAnchorDate = isValidDate(anchorDate) ? anchorDate : new Date();
            const uiName = dep.getZoneDisplayNameForUiAtDate(tz, safeAnchorDate);
            if (typeof uiName === "string" && uiName.trim()) return uiName;
            return dep.getZoneDisplayName(tz) || "";
        }

        function applyZoneCodeKindClass(zoneCodeEl, timezoneRef = null) {
            if (!zoneCodeEl || !zoneCodeEl.classList || typeof zoneCodeEl.classList.toggle !== "function") return;
            const isCustom = !!(timezoneRef && timezoneRef.type === "custom");
            zoneCodeEl.classList.toggle("zone-code-custom", isCustom);
            zoneCodeEl.classList.toggle("zone-code-standard", !isCustom);
        }

        function appendReadonlyTimeDisplay(targetCell, payload, displayPartsEnabled) {
            if (!targetCell) return;
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return;
            const safeParts = (displayPartsEnabled && typeof displayPartsEnabled === "object")
                ? displayPartsEnabled
                : {};
            const wrapper = documentRef.createElement("div");
            wrapper.className = "time-day-group";

            if (safeParts.dn) {
                const dnEl = documentRef.createElement("span");
                dnEl.className = "dn-icon";
                dnEl.textContent = payload?.dayNightGlyph || "";
                dnEl.title = payload?.dayNightMarker === "DAY" ? translate("dn_day") : translate("dn_night");
                wrapper.appendChild(dnEl);
            }

            if (safeParts.time) {
                const clockEl = documentRef.createElement("input");
                clockEl.type = "text";
                clockEl.className = "time-input live-time-input fixed-time-clock";
                clockEl.spellcheck = false;
                clockEl.readOnly = true;
                clockEl.value = payload?.clock || "--:--:--";
                wrapper.appendChild(clockEl);
            }

            if (safeParts.weekday && payload?.dayName) {
                const weekdayIdx = Number(payload.weekdayIndex);
                const dayEl = documentRef.createElement("span");
                const isSun = weekdayIdx === 0;
                const isSat = weekdayIdx === 6;
                dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
                dayEl.textContent = payload.dayName;
                wrapper.appendChild(dayEl);
            }

            if (!wrapper.children.length) {
                const emptyEl = documentRef.createElement("span");
                emptyEl.className = "fixed-time-empty";
                emptyEl.textContent = payload?.clock || "--:--:--";
                wrapper.appendChild(emptyEl);
            }

            targetCell.appendChild(wrapper);
        }

        function renderFixedTimeTable(isLiveTick = false) {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            const body = documentRef.getElementById("fixed-time-body");
            if (!body) return;

            if (isLiveTick) {
                const baseRef = dep.getBaseTimezoneRef();
                if (!baseRef) return;
                const rows = [baseRef, ...getRenderableTimezoneRowsSafe(baseRef)];
                const liveNowUtcDate = new Date();
                const displayPartsEnabled = dep.getFixedTimeDisplayPartsEnabled() || {};

                rows.forEach((tz, idx) => {
                    if (!tz) return;
                    const cacheKey = String(tz.id || idx);
                    let cached = liveNowElementMap.get(cacheKey);

                    if (!cached) {
                        const cell = body.querySelector(`.fixed-time-live-now[data-tz-id="${tz.id}"]`);
                        if (!cell) return;
                        cached = {
                            cell,
                            dnEl: cell.querySelector(".dn-icon"),
                            clockEl: cell.querySelector(".fixed-time-clock"),
                            dayEl: cell.querySelector(".day-badge")
                        };
                        liveNowElementMap.set(cacheKey, cached);
                    }

                    const payload = dep.buildFixedTimeDisplayPayloadAtUtc(liveNowUtcDate, tz);
                    if (!payload) return;

                    if (displayPartsEnabled.dn && cached.dnEl) {
                        cached.dnEl.textContent = payload.dayNightGlyph || "";
                        cached.dnEl.title = payload.dayNightMarker === "DAY" ? translate("dn_day") : translate("dn_night");
                    }

                    if (displayPartsEnabled.time && cached.clockEl) {
                        // 포커스 중인 경우 업데이트 방지 (보통 readonly라 상관없지만 일관성 유지)
                        if (documentRef.activeElement !== cached.clockEl) {
                            cached.clockEl.value = payload.clock || "--:--:--";
                        }
                    }

                    if (displayPartsEnabled.weekday && payload.dayName && cached.dayEl) {
                        const isSun = payload.weekdayIndex === 0;
                        const isSat = payload.weekdayIndex === 6;
                        cached.dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
                        cached.dayEl.textContent = payload.dayName;
                    }
                });
                return;
            }

            liveNowElementMap.clear();

            if (typeof documentRef.querySelector !== "function") return;
            const headRow = documentRef.querySelector("#fixed-time-table-head tr");
            const group = dep.getCurrentGroup();
            if (!headRow || !group) return;

            dep.ensureGroupFixedTimes(group);
            const fixedTimes = asArray(group.fixedTimes);
            const showLiveNowColumn = !!group.fixedTimeShowLiveNow;
            const displayPartsEnabled = dep.getFixedTimeDisplayPartsEnabled() || {};
            const slotLayout = getFixedTimeSlotLayoutMetrics(displayPartsEnabled);
            const displayColumns = getFixedTimeDisplayColumns();
            const fixedTimeTable = documentRef.querySelector(".fixed-time-table");
            if (fixedTimeTable?.style && typeof fixedTimeTable.style.setProperty === "function") {
                fixedTimeTable.style.setProperty("--fixed-time-slot-min-width", `${slotLayout.columnMinWidthPx}px`);
                fixedTimeTable.style.setProperty("--fixed-time-input-width", `${slotLayout.inputWidthPx}px`);
            }

            headRow.textContent = "";

            displayColumns.forEach((colKey) => {
                if (colKey === "timezone") {
                    const timezoneHead = documentRef.createElement("th");
                    timezoneHead.style.width = "110px";
                    timezoneHead.textContent = translate("th_tz_abbr");
                    headRow.appendChild(timezoneHead);
                    return;
                }
                if (colKey === "region") {
                    const nameHead = documentRef.createElement("th");
                    nameHead.style.width = "220px";
                    nameHead.textContent = translate("th_region");
                    headRow.appendChild(nameHead);
                    return;
                }
                if (colKey === "offset") {
                    const offsetHead = documentRef.createElement("th");
                    offsetHead.style.width = "140px";
                    offsetHead.textContent = translate("th_utc_offset");
                    headRow.appendChild(offsetHead);
                    return;
                }
                if (colKey !== "time_slots") return;

                if (showLiveNowColumn) {
                    const liveNowHead = documentRef.createElement("th");
                    liveNowHead.className = "dynamic-col";
                    liveNowHead.style.width = "170px";

                    const liveNowHeadWrap = documentRef.createElement("div");
                    liveNowHeadWrap.className = "fixed-time-slot-head fixed-time-live-now-head";

                    const markerWrap = documentRef.createElement("span");
                    markerWrap.className = "fixed-time-slot-marker";
                    const colorDot = documentRef.createElement("span");
                    colorDot.className = "fixed-time-slot-dot fixed-time-live-now-dot";
                    colorDot.style.background = "#00E676";
                    colorDot.setAttribute("aria-hidden", "true");
                    markerWrap.appendChild(colorDot);

                    const liveNowTitle = documentRef.createElement("span");
                    liveNowTitle.className = "fixed-time-slot-title";
                    liveNowTitle.textContent = translate("th_fixed_time_live_now");

                    const titleWrap = documentRef.createElement("span");
                    titleWrap.className = "fixed-time-slot-title-wrap";
                    titleWrap.appendChild(markerWrap);
                    titleWrap.appendChild(liveNowTitle);

                    liveNowHeadWrap.appendChild(titleWrap);
                    liveNowHead.appendChild(liveNowHeadWrap);
                    headRow.appendChild(liveNowHead);
                }

                fixedTimes.forEach((slot, slotIdx) => {
                    const slotHead = documentRef.createElement("th");
                    slotHead.className = "dynamic-col fixed-time-slot-head-cell";
                    slotHead.style.minWidth = `${slotLayout.columnMinWidthPx}px`;

                    const slotHeadWrap = documentRef.createElement("div");
                    slotHeadWrap.className = "fixed-time-slot-head";

                    const slotHeadTop = documentRef.createElement("div");
                    slotHeadTop.className = "fixed-time-slot-head-top";

                    const colorDot = documentRef.createElement("span");
                    colorDot.className = "fixed-time-slot-dot";
                    colorDot.style.background = dep.getFixedTimeTimelineIndicatorColor(slotIdx) || "";
                    colorDot.setAttribute("aria-hidden", "true");

                    const markerWrap = documentRef.createElement("span");
                    markerWrap.className = "fixed-time-slot-marker";
                    markerWrap.appendChild(colorDot);

                    const slotTitle = documentRef.createElement("span");
                    slotTitle.className = "fixed-time-slot-title";
                    slotTitle.textContent = dep.getFixedTimeSlotHeaderLabel(slot, slotIdx, fixedTimes.length) || "";

                    const slotTitleWrap = documentRef.createElement("span");
                    slotTitleWrap.className = "fixed-time-slot-title-wrap";
                    slotTitleWrap.appendChild(markerWrap);
                    slotTitleWrap.appendChild(slotTitle);

                    const renameBtn = documentRef.createElement("button");
                    renameBtn.type = "button";
                    renameBtn.className = "sm-btn fixed-time-slot-rename-btn export-exclude";
                    renameBtn.title = translate("btn_rename");
                    renameBtn.textContent = "\u270E";
                    renameBtn.addEventListener("click", () => {
                        dep.renameFixedTimeSlot(slotIdx);
                    });
                    slotHeadTop.appendChild(renameBtn);

                    const copySlotBtn = documentRef.createElement("button");
                    copySlotBtn.type = "button";
                    copySlotBtn.className = "sm-btn fixed-time-slot-copy-btn custom-tooltip export-exclude";
                    copySlotBtn.title = translate("tooltip_copy");
                    copySlotBtn.textContent = "\uD83D\uDCCB";
                    copySlotBtn.addEventListener("click", async () => {
                        await dep.copyFixedTimeSlotColumn(slotIdx);
                    });

                    const actionsWrap = documentRef.createElement("span");
                    actionsWrap.className = "fixed-time-slot-actions";
                    actionsWrap.appendChild(renameBtn);
                    actionsWrap.appendChild(copySlotBtn);

                    slotHeadTop.appendChild(slotTitleWrap);
                    slotHeadTop.appendChild(actionsWrap);

                    slotHeadWrap.appendChild(slotHeadTop);
                    slotHead.appendChild(slotHeadWrap);
                    headRow.appendChild(slotHead);
                });
            });

            destroyDatePickersInRoot(body);
            body.textContent = "";
            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return;
            const rows = [baseRef, ...getRenderableTimezoneRowsSafe(baseRef)];
            const globalTimeSlot0 = dep.getGlobalTime(0);
            const anchorDate = isValidDate(globalTimeSlot0)
                ? globalTimeSlot0
                : new Date();
            const slotUtcDates = fixedTimes.map((slot) => dep.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate));
            const liveNowUtcDate = new Date();

            rows.forEach((tz) => {
                const row = documentRef.createElement("tr");
                row.className = "time-row fixed-time-row";
                row.id = `tz-row-${tz.id}`;
                const isBaseRow = tz.id === baseRef.id;
                if (isBaseRow) row.classList.add("static");
                row.draggable = false;

                const offsetAnchorDate = isValidDate(slotUtcDates[0]) ? slotUtcDates[0] : anchorDate;
                displayColumns.forEach((colKey) => {
                    if (colKey === "timezone") {
                        const tzCell = documentRef.createElement("td");
                        tzCell.className = "timezone-cell";
                        const abbrWrap = documentRef.createElement("div");
                        abbrWrap.className = "abbr-cell";
                        const zoneCode = documentRef.createElement("span");
                        zoneCode.className = "zone-code";
                        zoneCode.textContent = dep.getZoneAbbreviation(tz, anchorDate) || "";
                        applyZoneCodeKindClass(zoneCode, tz);
                        abbrWrap.appendChild(zoneCode);
                        tzCell.appendChild(abbrWrap);
                        row.appendChild(tzCell);
                        return;
                    }

                    if (colKey === "region") {
                        const nameCell = documentRef.createElement("td");
                        const zoneInfo = documentRef.createElement("div");
                        zoneInfo.className = "zone-info";
                        const zoneName = documentRef.createElement("span");
                        zoneName.className = "zone-name";
                        zoneName.textContent = getZoneDisplayNameForUiAtDate(tz, offsetAnchorDate) || "";
                        zoneInfo.appendChild(zoneName);
                        nameCell.appendChild(zoneInfo);
                        row.appendChild(nameCell);
                        return;
                    }

                    if (colKey === "offset") {
                        const offsetCell = documentRef.createElement("td");
                        const offsetText = documentRef.createElement("span");
                        offsetText.className = "offset-text";
                        offsetText.textContent = getFixedTimeOffsetTextAtDate(tz, offsetAnchorDate);
                        offsetCell.appendChild(offsetText);
                        row.appendChild(offsetCell);
                        return;
                    }

                    if (colKey !== "time_slots") return;

                    if (showLiveNowColumn) {
                        const liveNowCell = documentRef.createElement("td");
                        liveNowCell.className = "fixed-time-time fixed-time-live-now";
                        liveNowCell.dataset.tzId = String(tz.id || "");
                        const liveNowPayload = dep.buildFixedTimeDisplayPayloadAtUtc(liveNowUtcDate, tz);
                        appendReadonlyTimeDisplay(liveNowCell, liveNowPayload, displayPartsEnabled);
                        row.appendChild(liveNowCell);
                    }

                    slotUtcDates.forEach((utcDate, slotIdx) => {
                        const timeCell = documentRef.createElement("td");
                        timeCell.className = "fixed-time-time";
                        const payload = dep.buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
                        const cellWrap = documentRef.createElement("div");
                        cellWrap.className = "fixed-time-cell-wrap";

                        const timeGroup = documentRef.createElement("div");
                        timeGroup.className = "time-day-group";
                        let hasTimeGroupContent = false;

                        if (displayPartsEnabled.dn) {
                            const dnEl = documentRef.createElement("span");
                            dnEl.className = "dn-icon";
                            dnEl.textContent = payload?.dayNightGlyph || "";
                            dnEl.title = payload?.dayNightMarker === "DAY" ? translate("dn_day") : translate("dn_night");
                            timeGroup.appendChild(dnEl);
                            hasTimeGroupContent = true;
                        }

                        let timeInput = null;
                        let triggerBtn = null;
                        if (displayPartsEnabled.time) {
                            timeInput = documentRef.createElement("input");
                            timeInput.type = "text";
                            timeInput.className = "time-input fixed-time-time-input";
                            timeInput.spellcheck = false;
                            timeInput.value = dep.buildFixedTimeCellInputValue(utcDate, tz) || "";
                            timeGroup.appendChild(timeInput);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.weekday && payload?.dayName) {
                            const dayEl = documentRef.createElement("span");
                            const isSun = payload.weekdayIndex === 0;
                            const isSat = payload.weekdayIndex === 6;
                            dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
                            dayEl.textContent = payload.dayName;
                            timeGroup.appendChild(dayEl);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.time) {
                            triggerBtn = documentRef.createElement("button");
                            triggerBtn.type = "button";
                            triggerBtn.className = "calendar-btn";
                            triggerBtn.tabIndex = -1;
                            triggerBtn.title = "Time Picker";
                            triggerBtn.textContent = "\uD83D\uDCC5";
                            timeGroup.appendChild(triggerBtn);
                            hasTimeGroupContent = true;
                        }

                        if (timeInput && triggerBtn) {
                            dep.bindCustomDatePickerForInput(timeInput, triggerBtn, { preserveValue: true, type: "time" });
                            timeInput.value = dep.buildFixedTimeCellInputValue(utcDate, tz) || "";

                            const commitCellInput = () => {
                                const latestInput = String(timeInput.value || "").trim();
                                dep.applyFixedTimeSlotByTimezoneInput(slotIdx, tz, latestInput, utcDate);
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

                        const copyBtn = documentRef.createElement("button");
                        copyBtn.type = "button";
                        copyBtn.className = "sm-btn fixed-time-copy-btn custom-tooltip export-exclude";
                        copyBtn.title = translate("tooltip_copy");
                        copyBtn.textContent = "\uD83D\uDCCB";
                        copyBtn.addEventListener("click", async () => {
                            await dep.copyFixedTimeCellByTimezone(tz, utcDate);
                        });
                        cellWrap.appendChild(copyBtn);

                        timeCell.appendChild(cellWrap);
                        row.appendChild(timeCell);
                    });
                });

                body.appendChild(row);
            });
            dep.upgradeNativeTitleTooltips(headRow);
            dep.upgradeNativeTitleTooltips(body);
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
