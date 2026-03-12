(function initGtvTimeAdjustUi(globalObj) {
    "use strict";

    function createService(deps) {
        function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = deps.applyTimeAdjustAction, disabled = false) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "sm-btn";
            button.dataset.action = action;
            button.textContent = deps.t(labelKey);
            button.disabled = !!disabled;
            button.addEventListener("click", () => {
                if (button.disabled) return;
                onAction(slotIdx, action);
            });
            return button;
        }

        function createTimeAdjustDivider() {
            const divider = document.createElement("span");
            divider.className = "time-adjust-divider";
            divider.textContent = "|";
            return divider;
        }

        function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
            if (!(setEl instanceof HTMLElement) || typeof onChange !== "function") return;
            const label = setEl.querySelector(".time-adjust-set-label");
            if (!label) return;

            label.classList.add("time-adjust-set-label-with-toggle");
            label.textContent = "";

            const toggle = document.createElement("input");
            toggle.type = "checkbox";
            toggle.className = "time-adjust-set-toggle";
            toggle.checked = !!checked;
            toggle.addEventListener("change", () => onChange(toggle.checked));

            const textEl = document.createElement("span");
            textEl.textContent = text;

            label.appendChild(toggle);
            label.appendChild(textEl);
        }

        function sanitizeTimeAdjustDayStep(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return deps.DEFAULT_TIME_ADJUST_DAY_STEP;
            return Math.min(deps.MAX_TIME_ADJUST_DAY_STEP, Math.max(deps.MIN_TIME_ADJUST_DAY_STEP, parsed));
        }

        function getTimeAdjustDayStep(slotIdx) {
            return sanitizeTimeAdjustDayStep(deps.getTimeAdjustDayStepValue(slotIdx));
        }

        function setTimeAdjustDayStep(slotIdx, value) {
            const safeValue = sanitizeTimeAdjustDayStep(value);
            deps.setTimeAdjustDayStepValue(slotIdx, safeValue);
            return safeValue;
        }

        function createTimeAdjustCustomDaysControl(slotIdx, onAction = deps.applyTimeAdjustAction, disabled = false) {
            const wrap = document.createElement("div");
            wrap.className = "time-adjust-custom-group";

            const label = document.createElement("span");
            label.className = "time-adjust-custom-label";
            label.textContent = deps.t("label_custom_days");

            const dayInput = document.createElement("input");
            dayInput.type = "number";
            dayInput.className = "form-input time-adjust-days-input";
            dayInput.min = String(deps.MIN_TIME_ADJUST_DAY_STEP);
            dayInput.step = "1";
            dayInput.inputMode = "numeric";
            dayInput.value = String(getTimeAdjustDayStep(slotIdx));
            dayInput.disabled = !!disabled;

            const minusBtn = document.createElement("button");
            minusBtn.type = "button";
            minusBtn.className = "sm-btn time-adjust-custom-btn";
            minusBtn.textContent = "-";
            minusBtn.disabled = !!disabled;
            minusBtn.addEventListener("click", () => {
                if (minusBtn.disabled) return;
                onAction(slotIdx, "minus_custom_days");
            });

            const plusBtn = document.createElement("button");
            plusBtn.type = "button";
            plusBtn.className = "sm-btn time-adjust-custom-btn";
            plusBtn.textContent = "+";
            plusBtn.disabled = !!disabled;
            plusBtn.addEventListener("click", () => {
                if (plusBtn.disabled) return;
                onAction(slotIdx, "plus_custom_days");
            });

            const syncInputAndLabel = (persist = false) => {
                const normalized = setTimeAdjustDayStep(slotIdx, dayInput.value);
                dayInput.value = String(normalized);
                if (persist) deps.savePersistence();
            };

            dayInput.addEventListener("input", () => syncInputAndLabel(true));
            dayInput.addEventListener("change", () => syncInputAndLabel(true));
            dayInput.addEventListener("blur", () => syncInputAndLabel(true));
            syncInputAndLabel();

            wrap.appendChild(label);
            wrap.appendChild(minusBtn);
            wrap.appendChild(dayInput);
            wrap.appendChild(plusBtn);
            return wrap;
        }

        function renderTimeAdjustSet(slotIdx, options = {}) {
            const {
                onAction = deps.applyTimeAdjustAction,
                labelText = "",
                disabled = false,
                includeFixedActions = true,
                includeZeroDayAction = false,
                includeSyncPreviousEndAction = false
            } = options;
            const set = document.createElement("div");
            set.className = "time-adjust-set";

            const label = document.createElement("span");
            label.className = "time-adjust-set-label";
            label.textContent = labelText || (slotIdx === 0 ? deps.t("th_time_day_main") : deps.t("th_time_day_extra"));
            set.appendChild(label);

            if (includeFixedActions) {
                const fixedActions = [
                    ["btn_now", "now"],
                    ["btn_midnight", "midnight"],
                    ["btn_sharp_hour", "sharp_hour"]
                ];
                fixedActions.forEach(([labelKey, action]) => {
                    set.appendChild(createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled));
                });
                set.appendChild(createTimeAdjustDivider());
            }

            if (includeZeroDayAction) {
                const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", slotIdx, "set_zero_day", onAction, disabled);
                zeroDayBtn.classList.add("time-adjust-zero-btn");
                set.appendChild(zeroDayBtn);
                set.appendChild(createTimeAdjustDivider());
            }

            if (includeSyncPreviousEndAction) {
                const syncPrevBtn = createTimeAdjustActionButton("btn_sync_extra_time", slotIdx, "sync_prev_end", onAction, disabled);
                syncPrevBtn.classList.add("time-adjust-sync-btn");
                set.appendChild(syncPrevBtn);
                set.appendChild(createTimeAdjustDivider());
            }

            const shiftActionGroups = [
                [["btn_minus_hour", "minus_hour"], ["btn_plus_hour", "plus_hour"]],
                [["btn_minus_day", "minus_day"], ["btn_plus_day", "plus_day"]],
                [["btn_minus_week", "minus_week"], ["btn_plus_week", "plus_week"]]
            ];
            shiftActionGroups.forEach((group, groupIdx) => {
                group.forEach(([labelKey, action]) => {
                    set.appendChild(createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled));
                });
                if (groupIdx < shiftActionGroups.length - 1) {
                    set.appendChild(createTimeAdjustDivider());
                }
            });

            set.appendChild(createTimeAdjustDivider());
            set.appendChild(createTimeAdjustActionButton("btn_minus_four_weeks", slotIdx, "minus_four_weeks", onAction, disabled));
            set.appendChild(createTimeAdjustActionButton("btn_plus_four_weeks", slotIdx, "plus_four_weeks", onAction, disabled));
            set.appendChild(createTimeAdjustDivider());
            set.appendChild(createTimeAdjustCustomDaysControl(slotIdx, onAction, disabled));

            return set;
        }

        function updateTimeAdjustPanel() {
            const frame = document.getElementById("time-adjust-frame");
            const row = document.getElementById("time-adjust-row");
            const buttonsContainer = document.getElementById("time-adjust-buttons");
            if (!frame || !row || !buttonsContainer) return;

            const visible = deps.getCurrentMainTab() === "fixed";
            frame.style.display = visible ? "block" : "none";
            row.style.display = visible ? "block" : "none";

            if (!visible) {
                buttonsContainer.textContent = "";
                return;
            }

            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            buttonsContainer.innerHTML = "";
            if (effectiveSlotCount > 1) {
                buttonsContainer.appendChild(renderTimeAdjustSet(0, {
                    labelText: deps.t("label_start_time_adjust"),
                    includeFixedActions: true
                }));
                buttonsContainer.appendChild(renderTimeAdjustSet(1, {
                    labelText: deps.t("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true
                }));
            } else {
                buttonsContainer.appendChild(renderTimeAdjustSet(0, {
                    labelText: deps.t("label_main_time_adjust"),
                    includeFixedActions: true
                }));
            }

            const syncFixedZeroButtonWidth = () => {
                const sets = [...buttonsContainer.querySelectorAll(".time-adjust-set")];
                if (sets.length < 2) return;
                const startSet = sets[0];
                const endSet = sets[1];
                const zeroBtn = endSet.querySelector('[data-action="set_zero_day"]');
                if (!(zeroBtn instanceof HTMLElement)) return;

                zeroBtn.style.width = "";
                zeroBtn.style.minWidth = "";

                const nowBtn = startSet.querySelector('[data-action="now"]');
                const firstDivider = startSet.querySelector(".time-adjust-divider");
                if (nowBtn instanceof HTMLElement && firstDivider instanceof HTMLElement) {
                    const nowRect = nowBtn.getBoundingClientRect();
                    const dividerRect = firstDivider.getBoundingClientRect();
                    const desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    if (desiredSpanToDivider > 0) {
                        const endSetStyle = globalObj.getComputedStyle(endSet);
                        const gap = parseFloat(endSetStyle.columnGap || endSetStyle.gap || "0") || 0;
                        const btnStyle = globalObj.getComputedStyle(zeroBtn);
                        const marginRight = parseFloat(btnStyle.marginRight || "0") || 0;
                        const widthPx = `${Math.max(150, Math.round(desiredSpanToDivider - marginRight - gap))}px`;
                        zeroBtn.style.width = widthPx;
                        zeroBtn.style.minWidth = widthPx;
                        return;
                    }
                }

                const fallbackWidth = Math.max(150, Math.ceil(zeroBtn.scrollWidth + 18));
                const widthPx = `${fallbackWidth}px`;
                zeroBtn.style.width = widthPx;
                zeroBtn.style.minWidth = widthPx;
            };

            if (effectiveSlotCount > 1) {
                if (typeof globalObj.requestAnimationFrame === "function") {
                    globalObj.requestAnimationFrame(syncFixedZeroButtonWidth);
                } else {
                    syncFixedZeroButtonWidth();
                }
            }

            deps.upgradeNativeTitleTooltips(buttonsContainer);
        }

        return Object.freeze({
            createTimeAdjustActionButton,
            createTimeAdjustDivider,
            attachTimeAdjustToggleLabel,
            sanitizeTimeAdjustDayStep,
            getTimeAdjustDayStep,
            setTimeAdjustDayStep,
            createTimeAdjustCustomDaysControl,
            renderTimeAdjustSet,
            updateTimeAdjustPanel
        });
    }

    globalObj.GTVTimeAdjustUI = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
