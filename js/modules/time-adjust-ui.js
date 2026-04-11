(function initGtvTimeAdjustUi(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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
            return (typeof document === "object" && document) ? document : null;
        }

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVTimeAdjustUI] Dependency "${depName}" threw.`, err);
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
                "t",
                "applyTimeAdjustAction",
                "getTimeAdjustDayStepValue",
                "setTimeAdjustDayStepValue",
                "savePersistence",
                "getCurrentMainTab",
                "isRealtime",
                "getSlotCount",
                "upgradeNativeTitleTooltips"
            ])
        });

        function callAction(slotIdx, action) {
            return dep.applyTimeAdjustAction(slotIdx, action);
        }

        function translate(key) {
            const value = dep.t(key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            return Number.isFinite(parsed) ? parsed : fallback;
        }

        function isHtmlElementLike(el) {
            if (!el || typeof el !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function createElement(tagName) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            return doc.createElement(tagName);
        }

        function appendChildIfPossible(parent, child) {
            if (!parent || !child) return;
            if (typeof parent.appendChild !== "function") return;
            parent.appendChild(child);
        }

        function resolveActionHandler(onAction) {
            if (typeof onAction === "function") return onAction;
            return callAction;
        }

        function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = null, disabled = false) {
            const button = createElement("button");
            if (!button) return null;
            const actionHandler = resolveActionHandler(onAction);
            button.type = "button";
            button.className = "sm-btn";
            button.dataset.action = action;
            button.textContent = translate(labelKey);
            button.disabled = !!disabled;
            button.addEventListener("click", () => {
                if (button.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, action);
            });
            return button;
        }

        function createTimeAdjustDivider() {
            const divider = createElement("span");
            if (!divider) return null;
            divider.className = "time-adjust-divider";
            divider.textContent = "|";
            return divider;
        }

        function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
            if (!isHtmlElementLike(setEl) || typeof onChange !== "function") return;
            const label = setEl.querySelector?.(".time-adjust-set-label");
            if (!label) return;

            if (label.classList && typeof label.classList.add === "function") {
                label.classList.add("time-adjust-set-label-with-toggle");
            }
            label.textContent = "";

            const toggle = createElement("input");
            const textEl = createElement("span");
            if (!toggle || !textEl) return;

            toggle.type = "checkbox";
            toggle.className = "time-adjust-set-toggle";
            toggle.checked = !!checked;
            toggle.addEventListener("change", () => onChange(toggle.checked));

            textEl.textContent = text;

            appendChildIfPossible(label, toggle);
            appendChildIfPossible(label, textEl);
        }

        function sanitizeTimeAdjustDayStep(value) {
            const minStep = getNumberConstant("MIN_TIME_ADJUST_DAY_STEP", 1);
            const maxStep = getNumberConstant("MAX_TIME_ADJUST_DAY_STEP", 36500);
            const defaultStep = getNumberConstant("DEFAULT_TIME_ADJUST_DAY_STEP", 1);
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return defaultStep;
            return Math.min(maxStep, Math.max(minStep, parsed));
        }

        function getTimeAdjustDayStep(slotIdx) {
            return sanitizeTimeAdjustDayStep(dep.getTimeAdjustDayStepValue(slotIdx));
        }

        function setTimeAdjustDayStep(slotIdx, value) {
            const safeValue = sanitizeTimeAdjustDayStep(value);
            dep.setTimeAdjustDayStepValue(slotIdx, safeValue);
            return safeValue;
        }

        function createTimeAdjustCustomDaysControl(slotIdx, onAction = null, disabled = false) {
            const wrap = createElement("div");
            const label = createElement("span");
            const dayInput = createElement("input");
            const minusBtn = createElement("button");
            const plusBtn = createElement("button");
            if (!wrap || !label || !dayInput || !minusBtn || !plusBtn) return wrap;
            const actionHandler = resolveActionHandler(onAction);

            wrap.className = "time-adjust-custom-group";

            label.className = "time-adjust-custom-label";
            label.textContent = translate("label_custom_days");

            dayInput.type = "number";
            dayInput.className = "form-input time-adjust-days-input";
            dayInput.min = String(getNumberConstant("MIN_TIME_ADJUST_DAY_STEP", 1));
            dayInput.step = "1";
            dayInput.inputMode = "numeric";
            dayInput.value = String(getTimeAdjustDayStep(slotIdx));
            dayInput.disabled = !!disabled;

            minusBtn.type = "button";
            minusBtn.className = "sm-btn time-adjust-custom-btn";
            minusBtn.textContent = "-";
            minusBtn.disabled = !!disabled;
            minusBtn.addEventListener("click", () => {
                if (minusBtn.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, "minus_custom_days");
            });

            plusBtn.type = "button";
            plusBtn.className = "sm-btn time-adjust-custom-btn";
            plusBtn.textContent = "+";
            plusBtn.disabled = !!disabled;
            plusBtn.addEventListener("click", () => {
                if (plusBtn.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, "plus_custom_days");
            });

            const syncInputAndLabel = (persist = false) => {
                const normalized = setTimeAdjustDayStep(slotIdx, dayInput.value);
                dayInput.value = String(normalized);
                if (persist) dep.savePersistence();
            };

            dayInput.addEventListener("input", () => syncInputAndLabel(true));
            dayInput.addEventListener("change", () => syncInputAndLabel(true));
            dayInput.addEventListener("blur", () => syncInputAndLabel(true));
            syncInputAndLabel();

            appendChildIfPossible(wrap, label);
            appendChildIfPossible(wrap, minusBtn);
            appendChildIfPossible(wrap, dayInput);
            appendChildIfPossible(wrap, plusBtn);
            return wrap;
        }

        function renderTimeAdjustSet(slotIdx, options = {}) {
            const {
                onAction = null,
                labelText = "",
                disabled = false,
                includeFixedActions = true,
                includeZeroDayAction = false,
                includeSyncPreviousEndAction = false
            } = options;
            const actionHandler = resolveActionHandler(onAction);
            const set = createElement("div");
            const label = createElement("span");
            if (!set || !label) return set;

            set.className = "time-adjust-set";

            label.className = "time-adjust-set-label";
            label.textContent = labelText || (slotIdx === 0 ? translate("th_time_day_main") : translate("th_time_day_extra"));
            appendChildIfPossible(set, label);

            if (includeFixedActions) {
                const fixedActions = [
                    ["btn_now", "now"],
                    ["btn_midnight", "midnight"],
                    ["btn_sharp_hour", "sharp_hour"]
                ];
                fixedActions.forEach(([labelKey, action]) => {
                    appendChildIfPossible(set, createTimeAdjustActionButton(labelKey, slotIdx, action, actionHandler, disabled));
                });
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            if (includeZeroDayAction) {
                const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", slotIdx, "set_zero_day", actionHandler, disabled);
                if (zeroDayBtn?.classList && typeof zeroDayBtn.classList.add === "function") {
                    zeroDayBtn.classList.add("time-adjust-zero-btn");
                }
                appendChildIfPossible(set, zeroDayBtn);
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            if (includeSyncPreviousEndAction) {
                const syncPrevBtn = createTimeAdjustActionButton("btn_sync_extra_time", slotIdx, "sync_prev_end", actionHandler, disabled);
                if (syncPrevBtn?.classList && typeof syncPrevBtn.classList.add === "function") {
                    syncPrevBtn.classList.add("time-adjust-sync-btn");
                }
                appendChildIfPossible(set, syncPrevBtn);
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            const shiftActionGroups = [
                [["btn_minus_hour", "minus_hour"], ["btn_plus_hour", "plus_hour"]],
                [["btn_minus_day", "minus_day"], ["btn_plus_day", "plus_day"]],
                [["btn_minus_week", "minus_week"], ["btn_plus_week", "plus_week"]]
            ];
            shiftActionGroups.forEach((group, groupIdx) => {
                group.forEach(([labelKey, action]) => {
                    appendChildIfPossible(set, createTimeAdjustActionButton(labelKey, slotIdx, action, actionHandler, disabled));
                });
                if (groupIdx < shiftActionGroups.length - 1) {
                    appendChildIfPossible(set, createTimeAdjustDivider());
                }
            });

            appendChildIfPossible(set, createTimeAdjustDivider());
            appendChildIfPossible(set, createTimeAdjustActionButton("btn_minus_four_weeks", slotIdx, "minus_four_weeks", actionHandler, disabled));
            appendChildIfPossible(set, createTimeAdjustActionButton("btn_plus_four_weeks", slotIdx, "plus_four_weeks", actionHandler, disabled));
            appendChildIfPossible(set, createTimeAdjustDivider());
            appendChildIfPossible(set, createTimeAdjustCustomDaysControl(slotIdx, actionHandler, disabled));

            return set;
        }

        function updateTimeAdjustPanel() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const frame = doc.getElementById("time-adjust-frame");
            const row = doc.getElementById("time-adjust-row");
            const buttonsContainer = doc.getElementById("time-adjust-buttons");
            if (!frame || !row || !buttonsContainer) return;

            const visible = dep.getCurrentMainTab() === "fixed";
            frame.style.display = visible ? "block" : "none";
            row.style.display = visible ? "block" : "none";

            if (!visible) {
                buttonsContainer.textContent = "";
                return;
            }

            const effectiveSlotCount = dep.isRealtime() ? 1 : (Number(dep.getSlotCount()) || 1);
            buttonsContainer.innerHTML = "";
            if (effectiveSlotCount > 1) {
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(0, {
                    labelText: translate("label_start_time_adjust"),
                    includeFixedActions: true
                }));
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(1, {
                    labelText: translate("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true
                }));
            } else {
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(0, {
                    labelText: translate("label_main_time_adjust"),
                    includeFixedActions: true
                }));
            }

            const syncFixedZeroButtonWidth = () => {
                const sets = Array.from(buttonsContainer.querySelectorAll?.(".time-adjust-set") || []);
                if (sets.length < 2) return;
                const startSet = sets[0];
                const endSet = sets[1];
                const zeroBtn = endSet.querySelector?.('[data-action="set_zero_day"]');
                if (!isHtmlElementLike(zeroBtn)) return;

                zeroBtn.style.width = "";
                zeroBtn.style.minWidth = "";

                const nowBtn = startSet.querySelector?.('[data-action="now"]');
                const firstDivider = startSet.querySelector?.(".time-adjust-divider");
                if (isHtmlElementLike(nowBtn) && isHtmlElementLike(firstDivider)) {
                    const nowRect = nowBtn.getBoundingClientRect();
                    const dividerRect = firstDivider.getBoundingClientRect();
                    const desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    if (desiredSpanToDivider > 0 && typeof globalObj.getComputedStyle === "function") {
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

                const fallbackWidth = Math.max(150, Math.ceil((Number(zeroBtn.scrollWidth) || 0) + 18));
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

            dep.upgradeNativeTitleTooltips(buttonsContainer);
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
