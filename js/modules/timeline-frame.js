(function initGtvTimelineFrame(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TIMELINE_TOTAL_HOURS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_HOURS))
            ? Number(safeDeps.TIMELINE_TOTAL_HOURS)
            : 24;
        const TIMELINE_TOTAL_SECONDS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_SECONDS))
            ? Number(safeDeps.TIMELINE_TOTAL_SECONDS)
            : (24 * 60 * 60);

        const requestUiFrame = (typeof safeDeps.requestUiFrame === "function")
            ? safeDeps.requestUiFrame
            : ((cb) => {
                if (typeof globalObj.requestAnimationFrame === "function") {
                    return globalObj.requestAnimationFrame(cb);
                }
                if (typeof globalObj.setTimeout === "function") {
                    return globalObj.setTimeout(cb, 16);
                }
                if (typeof setTimeout === "function") {
                    return setTimeout(cb, 16);
                }
                if (typeof cb === "function") cb();
                return 0;
            });
        const cancelUiFrame = (typeof safeDeps.cancelUiFrame === "function")
            ? safeDeps.cancelUiFrame
            : ((id) => {
                if (typeof globalObj.cancelAnimationFrame === "function") {
                    globalObj.cancelAnimationFrame(id);
                    return;
                }
                if (typeof globalObj.clearTimeout === "function") {
                    globalObj.clearTimeout(id);
                    return;
                }
                if (typeof clearTimeout === "function") {
                    clearTimeout(id);
                }
            });

        let timelineDragState = null;

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
                if (injected && typeof injected === "object") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected === "object") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (globalObj?.document && typeof globalObj.document === "object") return globalObj.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVTimelineFrame] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

        const dep = Object.freeze({
            ...pickSafeCallables([
                "getGlobalTime",
                "setGlobalTime",
                "t",
                "getCurrentMainTab",
                "getIsRealtime",
                "getSlotCount",
                "isFixedTimeTab",
                "getShowTimeline",
                "isMultiTab",
                "getCurrentGroupZones",
                "isCurrentGroupUtcRowVisible",
                "getCurrentGroupUtcRowOrder",
                "getUTCRef",
                "resolveFixedTimeTimelineSourceDate",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "applyFixedTimeSlotTimelineRatio",
                "updateClocks",
                "savePersistence",
                "getDayNightMarkerByHour",
                "getZoneDisplayName",
                "getFixedTimeSlotTimelineLabel",
                "getFixedTimeTimelineSlots",
                "getCurrentGroupFixedTimeShowLiveNow",
                "getFixedTimeTimelineSlotCount",
                "pad",
                "getFixedTimeTimelineIndicatorToken",
                "getCurrentLang",
                "getCurrentTheme",
                "getTimelineFrameElement",
                "getBaseTimezoneRef"
            ])
        });

        function isFixedTimeTab() {
            return !!dep.isFixedTimeTab();
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
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

        function isElementLike(el) {
            if (!el || typeof el !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function clampNumber(value, min, max) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return min;
            if (numeric < min) return min;
            if (numeric > max) return max;
            return numeric;
        }

        function getGlobalTime(slotIdx) {
            const value = dep.getGlobalTime(slotIdx);
            return isValidDate(value) ? value : null;
        }

        function setGlobalTime(slotIdx, value) {
            if (!isValidDate(value)) return false;
            dep.setGlobalTime(slotIdx, value);
            return true;
        }

        function translate(key) {
            const value = dep.t(key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getCurrentMainTab() {
            const tab = dep.getCurrentMainTab();
            if (tab === "live" || tab === "fixed" || tab === "multi" || tab === "fixed-time" || tab === "calc") {
                return tab;
            }
            return "live";
        }

        function getIsRealtime() {
            return !!dep.getIsRealtime();
        }

        function getSlotCount() {
            const value = Number(dep.getSlotCount());
            return Number.isFinite(value) ? Math.max(1, value) : 1;
        }

        function getTimelinePanelCount() {
            if (isFixedTimeTab()) return 1;
            return (!getIsRealtime() && getSlotCount() > 1) ? 2 : 1;
        }

        function isTimelineSupportedTab() {
            const currentMainTab = getCurrentMainTab();
            return currentMainTab === "live" || currentMainTab === "fixed" || currentMainTab === "fixed-time";
        }

        function shouldRenderTimeline() {
            return !!dep.getShowTimeline() && isTimelineSupportedTab() && !dep.isMultiTab();
        }

        function stopTimelineDrag() {
            if (!timelineDragState) return;
            const state = timelineDragState;
            timelineDragState = null;
            if (state.rafId) {
                cancelUiFrame(state.rafId);
            }
            const pointerEventTarget = state.pointerEventTarget || state.trackBody;
            if (pointerEventTarget && typeof pointerEventTarget.removeEventListener === "function") {
                pointerEventTarget.removeEventListener("pointermove", state.onPointerMove);
                pointerEventTarget.removeEventListener("pointerup", state.onPointerUp);
                pointerEventTarget.removeEventListener("pointercancel", state.onPointerCancel);
            }
            const captureEl = state.captureEl || state.trackBody;
            if (
                captureEl &&
                Number.isInteger(state.pointerId) &&
                typeof captureEl.hasPointerCapture === "function" &&
                captureEl.hasPointerCapture(state.pointerId)
            ) {
                try {
                    captureEl.releasePointerCapture(state.pointerId);
                } catch (_err) {
                    // 리렌더/정리 중 포인터 캡처 해제 실패는 무시한다.
                }
            }
        }

        function getTimelineRows(baseRef) {
            const rowsToRender = asArray(dep.getCurrentGroupZones()).filter(
                (tz) => tz && typeof tz === "object" && tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            if (baseRef.id !== "utc" && dep.isCurrentGroupUtcRowVisible()) {
                const insertIndex = Math.min(
                    Math.max(Number(dep.getCurrentGroupUtcRowOrder()) || 0, 0),
                    rowsToRender.length
                );
                const utcRef = dep.getUTCRef();
                if (utcRef && typeof utcRef === "object") {
                    rowsToRender.splice(insertIndex, 0, utcRef);
                }
            }
            return [baseRef, ...rowsToRender];
        }

        function getTimelineSourceDate(slotIdx, baseRef) {
            if (isFixedTimeTab()) {
                const anchorDate = getGlobalTime(0) || new Date();
                const resolved = dep.resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate);
                if (isValidDate(resolved)) return resolved;
            }
            return getGlobalTime(slotIdx) || new Date();
        }

        function getTimelineBaseLocalContext(slotIdx, baseRef) {
            const sourceDate = getTimelineSourceDate(slotIdx, baseRef);
            const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
            const parts = dep.getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);
            if (!parts || typeof parts !== "object") {
                return {
                    sourceDate,
                    fixedOffsetMinutes,
                    parts: {
                        year: sourceDate.getUTCFullYear(),
                        month: sourceDate.getUTCMonth() + 1,
                        day: sourceDate.getUTCDate(),
                        hour: sourceDate.getUTCHours(),
                        minute: sourceDate.getUTCMinutes(),
                        second: sourceDate.getUTCSeconds()
                    }
                };
            }
            return { sourceDate, fixedOffsetMinutes, parts };
        }

        function getTimelineHourRatio(slotIdx, baseRef) {
            const { parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
            const totalSeconds = (parts.hour * 3600) + (parts.minute * 60) + parts.second;
            if (totalSeconds <= 0) return 0;
            if (totalSeconds >= (TIMELINE_TOTAL_SECONDS - 1)) return 1;
            return clampNumber(totalSeconds / TIMELINE_TOTAL_SECONDS, 0, 1);
        }

        function getTimelineBaseDayStartUtc(slotIdx, baseRef) {
            const { fixedOffsetMinutes, parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
            const dayStartParts = {
                year: parts.year,
                month: parts.month,
                day: parts.day,
                hour: 0,
                minute: 0,
                second: 0
            };
            const resolved = dep.getUTCDateFromLocalParts(dayStartParts, baseRef, fixedOffsetMinutes);
            return isValidDate(resolved) ? resolved : new Date();
        }

        function getTimelineRatioFromClientX(trackBody, clientX) {
            const boxRow = trackBody?.querySelector?.(".timeline-box-row");
            if (!boxRow) return 0;
            const rect = boxRow.getBoundingClientRect();
            if (!(rect.width > 0)) return 0;
            const clamped = clampNumber(clientX - rect.left, 0, rect.width);
            return clampNumber(clamped / rect.width, 0, 1);
        }

        function positionTimelineIndicator(trackBody, indicatorEl, ratio) {
            if (!trackBody || !indicatorEl) return false;
            const boxRow = trackBody.querySelector?.(".timeline-box-row");
            if (!boxRow) return false;
            const width = boxRow.clientWidth;
            if (!(width > 0)) return false;
            const rawLeft = boxRow.offsetLeft + (width * clampNumber(ratio, 0, 1));
            const minLeft = boxRow.offsetLeft;
            const maxLeft = boxRow.offsetLeft + width;
            const left = clampNumber(rawLeft, minLeft, maxLeft);
            indicatorEl.style.left = `${Math.round(left)}px`;
            return true;
        }

        function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
            if (getIsRealtime()) return;
            const safeOptions = (options && typeof options === "object") ? options : {};
            const shouldRender = safeOptions.render !== false;
            const shouldPersist = safeOptions.persist !== false;

            if (isFixedTimeTab()) {
                const applied = dep.applyFixedTimeSlotTimelineRatio(slotIdx, ratio);
                if (!applied) return;
                if (shouldRender) dep.updateClocks();
                if (shouldPersist) dep.savePersistence();
                return;
            }

            const sourceDate = getGlobalTime(slotIdx) || new Date();
            const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
            const parts = dep.getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);
            if (!parts || typeof parts !== "object") return;

            const totalSeconds = Math.min(
                TIMELINE_TOTAL_SECONDS - 1,
                Math.max(0, Math.round(clampNumber(ratio, 0, 1) * TIMELINE_TOTAL_SECONDS))
            );
            parts.hour = Math.floor(totalSeconds / 3600);
            parts.minute = Math.floor((totalSeconds % 3600) / 60);
            parts.second = totalSeconds % 60;

            const nextUtcDate = dep.getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
            if (!setGlobalTime(slotIdx, nextUtcDate)) return;

            if (shouldRender) {
                dep.updateClocks();
            }
        }

        function bindTimelineDrag(trackBody, indicatorEl, slotIdx, baseRef, dragHandleEl = trackBody) {
            if (!isElementLike(trackBody) || !isElementLike(indicatorEl)) return;
            const pointerSource = isElementLike(dragHandleEl) ? dragHandleEl : trackBody;
            const pointerEventTarget = (typeof globalObj.addEventListener === "function")
                ? globalObj
                : trackBody;
            const captureEl = (pointerSource && typeof pointerSource.setPointerCapture === "function")
                ? pointerSource
                : trackBody;

            pointerSource.addEventListener("pointerdown", (event) => {
                const pointerType = String(event.pointerType || "mouse").toLowerCase();
                const isMouseLike = pointerType === "mouse" || pointerType === "";
                if (getIsRealtime()) return;
                if (event.isPrimary === false) return;
                if (isMouseLike && event.button !== 0) return;
                event.preventDefault();
                stopTimelineDrag();

                const state = {
                    trackBody,
                    indicatorEl,
                    slotIdx,
                    baseRef,
                    pointerId: event.pointerId,
                    pointerEventTarget,
                    captureEl,
                    applyOnMove: true,
                    pendingRatio: null,
                    lastRatio: null,
                    rafId: 0,
                    onPointerMove: null,
                    onPointerUp: null,
                    onPointerCancel: null
                };

                const renderPendingRatio = () => {
                    state.rafId = 0;
                    if (state.pendingRatio === null) return;
                    state.lastRatio = state.pendingRatio;
                    positionTimelineIndicator(state.trackBody, state.indicatorEl, state.pendingRatio);
                    applyTimelineRatioToSlot(state.slotIdx, state.pendingRatio, state.baseRef, {
                        render: state.applyOnMove,
                        persist: false
                    });
                };

                const queueRatioRender = (clientX) => {
                    state.pendingRatio = getTimelineRatioFromClientX(state.trackBody, clientX);
                    if (state.rafId) return;
                    state.rafId = requestUiFrame(renderPendingRatio);
                };

                state.onPointerMove = (moveEvent) => {
                    if (moveEvent.pointerId !== state.pointerId) return;
                    moveEvent.preventDefault();
                    queueRatioRender(moveEvent.clientX);
                };

                state.onPointerCancel = (cancelEvent) => {
                    if (cancelEvent.pointerId !== state.pointerId) return;
                    stopTimelineDrag();
                };

                state.onPointerUp = (upEvent) => {
                    if (upEvent.pointerId !== state.pointerId) return;
                    upEvent.preventDefault();
                    if (state.rafId) {
                        cancelUiFrame(state.rafId);
                        renderPendingRatio();
                    }
                    const finalRatio = (state.pendingRatio !== null)
                        ? state.pendingRatio
                        : ((state.lastRatio !== null) ? state.lastRatio : getTimelineRatioFromClientX(state.trackBody, upEvent.clientX));
                    stopTimelineDrag();
                    applyTimelineRatioToSlot(state.slotIdx, finalRatio, state.baseRef, {
                        render: true,
                        persist: true
                    });
                };

                timelineDragState = state;
                queueRatioRender(event.clientX);

                if (pointerEventTarget && typeof pointerEventTarget.addEventListener === "function") {
                    pointerEventTarget.addEventListener("pointermove", state.onPointerMove);
                    pointerEventTarget.addEventListener("pointerup", state.onPointerUp);
                    pointerEventTarget.addEventListener("pointercancel", state.onPointerCancel);
                }
                if (captureEl && typeof captureEl.setPointerCapture === "function") {
                    try {
                        captureEl.setPointerCapture(state.pointerId);
                    } catch (_err) {
                        // 미지원 환경의 포인터 캡처 실패는 무시한다.
                    }
                }
            });
        }

        function createTimelineAxisTrack(doc) {
            const axisTrack = doc.createElement("div");
            axisTrack.className = "timeline-axis-track";
            for (let hour = 0; hour <= TIMELINE_TOTAL_HOURS; hour += 3) {
                const tick = doc.createElement("span");
                tick.className = "timeline-axis-mark";
                if (hour === TIMELINE_TOTAL_HOURS) tick.classList.add("last");
                tick.style.left = `${(hour / TIMELINE_TOTAL_HOURS) * 100}%`;
                tick.textContent = String(hour === TIMELINE_TOTAL_HOURS ? 0 : hour);
                axisTrack.appendChild(tick);
            }
            return axisTrack;
        }

        function resolveDayNightMarkerByHour(hour) {
            const marker = String(dep.getDayNightMarkerByHour(hour) || "").trim().toUpperCase();
            if (marker === "DAY" || marker === "NIGHT") return marker;
            const numericHour = Number.parseInt(hour, 10);
            const safeHour = ((Number.isFinite(numericHour) ? numericHour : 0) % 24 + 24) % 24;
            return (safeHour >= 6 && safeHour < 18) ? "DAY" : "NIGHT";
        }

        function createTimelineRow(doc, slotIdx, tz, baseDayStartUtcMs) {
            const row = doc.createElement("div");
            row.className = "timeline-timezone-row";

            const labelEl = doc.createElement("div");
            labelEl.className = "timeline-label";
            labelEl.textContent = dep.getZoneDisplayName(tz) || "";
            row.appendChild(labelEl);

            const boxRow = doc.createElement("div");
            boxRow.className = "timeline-box-row";
            for (let hourIdx = 0; hourIdx < TIMELINE_TOTAL_HOURS; hourIdx++) {
                const utcMs = baseDayStartUtcMs + (hourIdx * 60 * 60 * 1000);
                const utcPoint = new Date(utcMs);
                const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(tz, utcPoint);
                const localParts = dep.getLocalPartsByTimezone(utcPoint, tz, fixedOffsetMinutes);
                const localHour = Number(localParts?.hour) || 0;
                const marker = resolveDayNightMarkerByHour(localHour);
                const prevHour = (localHour + 23) % 24;
                const prevMarker = resolveDayNightMarkerByHour(prevHour);
                const isDay = marker === "DAY";

                const box = doc.createElement("div");
                box.className = `timeline-hour-box ${isDay ? "day" : "night"}`;

                if (marker !== prevMarker) {
                    const icon = doc.createElement("span");
                    icon.className = "timeline-hour-icon";
                    icon.textContent = marker === "DAY" ? "\u2600\uFE0F" : "\uD83C\uDF19";
                    box.appendChild(icon);
                }

                boxRow.appendChild(box);
            }

            row.appendChild(boxRow);
            return row;
        }

        function getFixedTimeTimelineIndicatorColor(slotIdx) {
            const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
            return palette[slotIdx % palette.length];
        }

        function getFixedTimeTimelineIndicatorLabel(slot, slotIdx, slotCount = 1) {
            const label = dep.getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount);
            if (typeof label === "string" && label.trim()) return label.trim();
            return String(slotIdx + 1);
        }

        function getTimelineIndicatorLabel(slotIdx) {
            const currentMainTab = getCurrentMainTab();
            const showRangeLabels = currentMainTab === "fixed" && !getIsRealtime() && getSlotCount() > 1;
            if (showRangeLabels) {
                return translate(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
            }
            return translate("th_time_day_main");
        }

        function appendFixedTimeTimelineIndicators(doc, trackBody, baseRef) {
            const slots = asArray(dep.getFixedTimeTimelineSlots());
            const slotCount = slots.length;

            if (!getIsRealtime()) trackBody.classList.add("draggable");
            for (let slotIdx = 0; slotIdx < slotCount; slotIdx++) {
                const slot = slots[slotIdx];
                const indicator = doc.createElement("div");
                indicator.className = "timeline-indicator fixed-slot";
                indicator.dataset.slot = String(slotIdx);

                const color = getFixedTimeTimelineIndicatorColor(slotIdx);
                indicator.style.background = color;
                indicator.style.color = color;
                const offsetPx = (slotIdx - ((slotCount - 1) / 2)) * 3;
                indicator.style.marginLeft = `${Math.round(offsetPx)}px`;

                const label = doc.createElement("span");
                label.className = "timeline-indicator-label";
                label.textContent = getFixedTimeTimelineIndicatorLabel(slot, slotIdx, slotCount);
                indicator.appendChild(label);

                trackBody.appendChild(indicator);
                if (!getIsRealtime()) {
                    bindTimelineDrag(trackBody, indicator, slotIdx, baseRef, indicator);
                }
            }

            if (dep.getCurrentGroupFixedTimeShowLiveNow()) {
                const liveIndicator = doc.createElement("div");
                liveIndicator.className = "timeline-indicator live-now";
                liveIndicator.dataset.slot = "live";
                liveIndicator.style.background = "#00E676";
                liveIndicator.style.color = "#00E676";
                const liveLabel = doc.createElement("span");
                liveLabel.className = "timeline-indicator-label";
                liveLabel.textContent = translate("th_fixed_time_live_now");
                liveIndicator.appendChild(liveLabel);
                trackBody.appendChild(liveIndicator);
            }
        }

        function createTimelinePanel(doc, slotIdx, baseRef, rows, panelCount) {
            const panel = doc.createElement("section");
            panel.className = "timeline-panel";

            const currentMainTab = getCurrentMainTab();
            if (panelCount > 1 && !isFixedTimeTab() && currentMainTab !== "fixed") {
                const title = doc.createElement("h3");
                title.className = `timeline-panel-title ${slotIdx === 0 ? "start" : "end"}`;
                title.textContent = translate(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
                panel.appendChild(title);
            }

            const scroll = doc.createElement("div");
            scroll.className = "timeline-scroll";

            const grid = doc.createElement("div");
            grid.className = "timeline-grid";

            const axisRow = doc.createElement("div");
            axisRow.className = "timeline-axis-row";

            const axisSpacer = doc.createElement("div");
            axisSpacer.className = "timeline-label timeline-axis-spacer";
            axisRow.appendChild(axisSpacer);
            axisRow.appendChild(createTimelineAxisTrack(doc));

            const trackBody = doc.createElement("div");
            trackBody.className = "timeline-track-body";

            const baseDayStartUtc = getTimelineBaseDayStartUtc(slotIdx, baseRef);
            const baseDayStartUtcMs = baseDayStartUtc.getTime();
            rows.forEach((tz) => {
                trackBody.appendChild(createTimelineRow(doc, slotIdx, tz, baseDayStartUtcMs));
            });

            if (isFixedTimeTab()) {
                appendFixedTimeTimelineIndicators(doc, trackBody, baseRef);
            } else {
                const indicator = doc.createElement("div");
                indicator.className = `timeline-indicator ${slotIdx === 0 ? "start" : "end"}`;

                const indicatorLabel = doc.createElement("span");
                indicatorLabel.className = "timeline-indicator-label";
                indicatorLabel.textContent = getTimelineIndicatorLabel(slotIdx);
                indicator.appendChild(indicatorLabel);

                trackBody.appendChild(indicator);

                if (!getIsRealtime()) {
                    trackBody.classList.add("draggable");
                    bindTimelineDrag(trackBody, indicator, slotIdx, baseRef, indicator);
                }
            }

            grid.appendChild(axisRow);
            grid.appendChild(trackBody);
            scroll.appendChild(grid);
            panel.appendChild(scroll);

            return panel;
        }

        function getTimelineRenderKey(baseRef, rows, panelCount) {
            const fixedTimeMode = isFixedTimeTab();
            const fixedSlotCount = Number(dep.getFixedTimeTimelineSlotCount());
            const slotKeyCount = fixedTimeMode && Number.isFinite(fixedSlotCount) ? fixedSlotCount : panelCount;
            const slotDayKeys = [];
            for (let slotIdx = 0; slotIdx < slotKeyCount; slotIdx++) {
                const ctx = getTimelineBaseLocalContext(slotIdx, baseRef);
                const pad = dep.pad();
                const monthText = (typeof pad === "function") ? pad(ctx.parts.month) : String(ctx.parts.month).padStart(2, "0");
                const dayText = (typeof pad === "function") ? pad(ctx.parts.day) : String(ctx.parts.day).padStart(2, "0");
                slotDayKeys.push(`${ctx.parts.year}-${monthText}-${dayText}`);
            }

            const fixedIndicatorToken = fixedTimeMode ? String(dep.getFixedTimeTimelineIndicatorToken() || "") : "";
            const fixedLiveNowToken = fixedTimeMode
                ? (dep.getCurrentGroupFixedTimeShowLiveNow() ? "live:1" : "live:0")
                : "";

            const rowKeys = rows.map((tz) => {
                const sourceDate = getGlobalTime(0) || new Date();
                const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(tz, sourceDate);
                const offsetToken = Number.isFinite(fixedOffsetMinutes) ? String(fixedOffsetMinutes) : "auto";
                return `${tz.id}:${offsetToken}`;
            });
            const dayNightToken = Array.from({ length: TIMELINE_TOTAL_HOURS }, (_, hour) => {
                const marker = resolveDayNightMarkerByHour(hour);
                if (marker === "DAY") return "D";
                if (marker === "NIGHT") return "N";
                return "?";
            }).join("");

            return [
                getCurrentMainTab(),
                panelCount,
                baseRef.id,
                dep.getCurrentLang(),
                dep.getCurrentTheme(),
                rowKeys.join(","),
                slotDayKeys.join("|"),
                dayNightToken,
                fixedIndicatorToken,
                fixedLiveNowToken
            ].join("::");
        }

        function refreshTimelineIndicators(frame, baseRef, panelCount) {
            if (isFixedTimeTab()) {
                const panel = frame.querySelector?.('.timeline-panel[data-slot="0"]');
                const trackBody = panel?.querySelector?.(".timeline-track-body");
                if (!panel || !trackBody) return false;
                const slotCount = Number(dep.getFixedTimeTimelineSlotCount());
                if (!Number.isFinite(slotCount) || slotCount <= 0) return false;

                let hasPositioned = false;
                for (let slotIdx = 0; slotIdx < slotCount; slotIdx++) {
                    const indicator = panel.querySelector?.(`.timeline-indicator[data-slot="${slotIdx}"]`);
                    if (!indicator) continue;
                    const positioned = positionTimelineIndicator(trackBody, indicator, getTimelineHourRatio(slotIdx, baseRef));
                    hasPositioned = hasPositioned || positioned;
                }

                const liveIndicator = panel.querySelector?.('.timeline-indicator[data-slot="live"]');
                if (liveIndicator) {
                    // 실시간(Now) 위치 계산을 위해 현재 로컬 시간 기반 비율 계산
                    const sourceDate = new Date();
                    const fixedOffsetMinutes = dep.getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
                    const parts = dep.getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);
                    if (parts) {
                        const totalSeconds = (parts.hour * 3600) + (parts.minute * 60) + parts.second;
                        const ratio = clampNumber(totalSeconds / TIMELINE_TOTAL_SECONDS, 0, 1);
                        const positioned = positionTimelineIndicator(trackBody, liveIndicator, ratio);
                        hasPositioned = hasPositioned || positioned;
                    }
                }

                return hasPositioned;
            }

            let hasPositioned = false;
            for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
                const panel = frame.querySelector?.(`.timeline-panel[data-slot="${slotIdx}"]`);
                if (!panel) continue;
                const trackBody = panel.querySelector?.(".timeline-track-body");
                const indicator = panel.querySelector?.(".timeline-indicator");
                if (!trackBody || !indicator) continue;
                const positioned = positionTimelineIndicator(trackBody, indicator, getTimelineHourRatio(slotIdx, baseRef));
                hasPositioned = hasPositioned || positioned;
            }
            return hasPositioned;
        }

        function scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, renderKey) {
            const refreshIfCurrent = () => {
                if (!frame?.isConnected) return false;
                if ((frame.getAttribute("data-render-key") || "") !== renderKey) return false;
                return refreshTimelineIndicators(frame, baseRef, panelCount);
            };

            requestUiFrame(() => {
                const positioned = refreshIfCurrent();
                if (positioned) return;
                requestUiFrame(() => {
                    refreshIfCurrent();
                });
            });
        }

        function renderTimelineFrame() {
            const frame = dep.getTimelineFrameElement();
            if (!frame) return;

            if (!shouldRenderTimeline()) {
                stopTimelineDrag();
                frame.removeAttribute("data-render-key");
                frame.style.display = "none";
                frame.textContent = "";
                return;
            }

            const doc = frame.ownerDocument || getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return;

            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef || typeof baseRef !== "object") return;
            const rows = getTimelineRows(baseRef);
            const panelCount = getTimelinePanelCount();
            const nextRenderKey = getTimelineRenderKey(baseRef, rows, panelCount);
            const currentRenderKey = frame.getAttribute("data-render-key") || "";

            if (getIsRealtime()) {
                frame.classList.add("is-realtime");
            } else {
                frame.classList.remove("is-realtime");
            }

            frame.style.display = "block";
            if (currentRenderKey === nextRenderKey) {
                const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
                if (!positioned) {
                    scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
                }
                return;
            }

            stopTimelineDrag();
            frame.textContent = "";

            const panels = doc.createElement("div");
            panels.className = `timeline-panels${panelCount > 1 ? " dual" : ""}`;

            for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
                const panel = createTimelinePanel(doc, slotIdx, baseRef, rows, panelCount);
                panel.dataset.slot = String(slotIdx);
                panels.appendChild(panel);
            }

            frame.setAttribute("data-render-key", nextRenderKey);
            frame.appendChild(panels);
            const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
            if (!positioned) {
                scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
            }
        }

        return Object.freeze({
            shouldRenderTimeline,
            stopTimelineDrag,
            applyTimelineRatioToSlot,
            getTimelineIndicatorLabel,
            getTimelinePanelCount,
            renderTimelineFrame
        });
    }

    globalObj.GTVTimelineFrame = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
