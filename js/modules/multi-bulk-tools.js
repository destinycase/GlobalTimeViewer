(function initGtvMultiBulkTools(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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
            if (typeof globalObj?.console?.warn === "function") {
                globalObj.console.warn(...args);
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
                    logWarn(`[GTVMultiBulkTools] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            t: toSafeCallable("t", safeDeps.t),
            getMultiRangeCount: toSafeCallable("getMultiRangeCount", safeDeps.getMultiRangeCount),
            renderTimeAdjustSet: toSafeCallable("renderTimeAdjustSet", safeDeps.renderTimeAdjustSet),
            applyBulkRangeAllAction: toSafeCallable("applyBulkRangeAllAction", safeDeps.applyBulkRangeAllAction),
            createTimeAdjustActionButton: toSafeCallable("createTimeAdjustActionButton", safeDeps.createTimeAdjustActionButton),
            createTimeAdjustDivider: toSafeCallable("createTimeAdjustDivider", safeDeps.createTimeAdjustDivider),
            applyFirstRangeStartAdjustAction: toSafeCallable("applyFirstRangeStartAdjustAction", safeDeps.applyFirstRangeStartAdjustAction),
            setAllMultiRangeStartEditEnabled: toSafeCallable("setAllMultiRangeStartEditEnabled", safeDeps.setAllMultiRangeStartEditEnabled),
            setAllMultiRangeEndEditEnabled: toSafeCallable("setAllMultiRangeEndEditEnabled", safeDeps.setAllMultiRangeEndEditEnabled),
            upgradeNativeTitleTooltips: toSafeCallable("upgradeNativeTitleTooltips", safeDeps.upgradeNativeTitleTooltips)
        });

        function callBulkAllAction(slotIdx, action) {
            return dep.applyBulkRangeAllAction(slotIdx, action);
        }

        function callFirstRangeStartAdjustAction(slotIdx, action) {
            return dep.applyFirstRangeStartAdjustAction(slotIdx, action);
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

        function isElementLike(node) {
            if (!node || typeof node !== "object") return false;
            if (typeof Element === "undefined") return true;
            return node instanceof Element;
        }

        function getMultiRangeCount() {
            const value = Number(dep.getMultiRangeCount());
            return Number.isFinite(value) ? Math.max(0, value) : 0;
        }

        function renderMultiBulkToolSets() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;

            const startTools = doc.getElementById("multi-bulk-start-tools");
            const allTools = doc.getElementById("multi-bulk-all-tools");
            if (!allTools) return;

            const multiRangeCount = getMultiRangeCount();
            const hasRanges = multiRangeCount > 0;
            allTools.textContent = "";
            if (startTools) {
                startTools.textContent = "";
                startTools.style.display = "none";
            }
            allTools.style.display = "flex";
            allTools.style.flexDirection = "column";
            allTools.style.alignItems = "flex-start";
            allTools.style.gap = "8px";

            const bulkSet = dep.renderTimeAdjustSet(1, {
                labelText: translate("label_range_bulk"),
                disabled: !hasRanges,
                onAction: callBulkAllAction,
                includeFixedActions: false
            });
            if (!bulkSet || typeof bulkSet.appendChild !== "function") return;

            const zeroDayBtn = dep.createTimeAdjustActionButton(
                "btn_set_zero_day",
                1,
                "set_zero_day",
                callBulkAllAction,
                !hasRanges
            );
            if (zeroDayBtn?.classList && typeof zeroDayBtn.classList.add === "function") {
                zeroDayBtn.classList.add("time-adjust-bulk-zero-btn");
            }

            const bulkChildren = asArray(bulkSet.children);
            const firstActionNode = bulkChildren.find((_node, idx) => idx > 0) || null;
            if (zeroDayBtn && firstActionNode && typeof bulkSet.insertBefore === "function") {
                bulkSet.insertBefore(zeroDayBtn, firstActionNode);
                const divider = dep.createTimeAdjustDivider();
                if (divider) bulkSet.insertBefore(divider, firstActionNode);
            } else if (zeroDayBtn) {
                bulkSet.appendChild(zeroDayBtn);
            }

            const bulkToolBlock = doc.createElement("div");
            bulkToolBlock.className = "multi-tool-block";
            bulkToolBlock.appendChild(bulkSet);

            const firstRangeStartSet = dep.renderTimeAdjustSet(0, {
                labelText: translate("label_start_time_adjust"),
                disabled: !hasRanges,
                onAction: callFirstRangeStartAdjustAction,
                includeFixedActions: true,
                includeSyncPreviousEndAction: false
            });
            const firstRangeStartToolBlock = doc.createElement("div");
            firstRangeStartToolBlock.className = "multi-tool-block";
            firstRangeStartToolBlock.dataset.role = "first-range-start-tools";
            if (firstRangeStartSet) firstRangeStartToolBlock.appendChild(firstRangeStartSet);

            const createBulkToggleButton = (buttonText, onClick) => {
                const button = doc.createElement("button");
                button.type = "button";
                button.className = "sm-btn time-adjust-bulk-toggle-btn";
                button.textContent = buttonText;
                button.disabled = !hasRanges;
                button.addEventListener("click", () => {
                    if (button.disabled) return;
                    onClick();
                });
                return button;
            };

            const bulkToggleSet = doc.createElement("div");
            bulkToggleSet.className = "time-adjust-set";
            const bulkToggleLabel = doc.createElement("span");
            bulkToggleLabel.className = "time-adjust-set-label";
            bulkToggleLabel.textContent = translate("label_all_range_time_adjust");
            bulkToggleSet.appendChild(bulkToggleLabel);
            const enableStartBtn = createBulkToggleButton(
                translate("btn_enable_all_start_time_adjust"),
                () => dep.setAllMultiRangeStartEditEnabled(true, { persist: true, rerender: true })
            );
            if (enableStartBtn) bulkToggleSet.appendChild(enableStartBtn);
            const disableStartBtn = createBulkToggleButton(
                translate("btn_disable_all_start_time_adjust"),
                () => dep.setAllMultiRangeStartEditEnabled(false, { persist: true, rerender: true })
            );
            if (disableStartBtn) bulkToggleSet.appendChild(disableStartBtn);
            const toggleDivider = dep.createTimeAdjustDivider();
            if (toggleDivider) bulkToggleSet.appendChild(toggleDivider);
            const enableEndBtn = createBulkToggleButton(
                translate("btn_enable_all_end_time_adjust"),
                () => dep.setAllMultiRangeEndEditEnabled(true, { persist: true, rerender: true })
            );
            if (enableEndBtn) bulkToggleSet.appendChild(enableEndBtn);
            const disableEndBtn = createBulkToggleButton(
                translate("btn_disable_all_end_time_adjust"),
                () => dep.setAllMultiRangeEndEditEnabled(false, { persist: true, rerender: true })
            );
            if (disableEndBtn) bulkToggleSet.appendChild(disableEndBtn);
            const toggleToolBlock = doc.createElement("div");
            toggleToolBlock.className = "multi-tool-block";
            toggleToolBlock.appendChild(bulkToggleSet);
            allTools.appendChild(toggleToolBlock);
            if (firstRangeStartSet) allTools.appendChild(firstRangeStartToolBlock);
            allTools.appendChild(bulkToolBlock);

            const syncZeroButtonWidth = () => {
                const bulkZeroBtn = allTools.querySelector?.(".time-adjust-bulk-zero-btn");
                if (!bulkZeroBtn || !isElementLike(bulkZeroBtn)) return;
                const rangeButtons = asArray(doc.querySelectorAll?.(
                    '.multi-range-adjust-row [data-action="set_zero_day"], .multi-range-adjust-row [data-action="sync_prev_end"]'
                ));
                const targetButtons = [bulkZeroBtn, ...rangeButtons].filter((btn) => isElementLike(btn));
                if (!targetButtons.length) return;

                targetButtons.forEach((btn) => {
                    btn.style.width = "";
                    btn.style.minWidth = "";
                    btn.style.justifyContent = "";
                    btn.style.textAlign = "";
                });

                const firstRangeSet = allTools.querySelector?.('[data-role="first-range-start-tools"] .time-adjust-set')
                    || doc.querySelector?.('.multi-range-adjust-row .time-adjust-set [data-action="now"]')?.closest?.(".time-adjust-set");
                let desiredSpanToDivider = 0;
                if (firstRangeSet) {
                    const nowBtn = firstRangeSet.querySelector?.('[data-action="now"]');
                    const firstDivider = firstRangeSet.querySelector?.(".time-adjust-divider");
                    if (nowBtn && firstDivider) {
                        const nowRect = nowBtn.getBoundingClientRect();
                        const dividerRect = firstDivider.getBoundingClientRect();
                        desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    }
                }

                const getComputedStyleFn = (typeof globalObj.getComputedStyle === "function")
                    ? globalObj.getComputedStyle.bind(globalObj)
                    : null;
                if (desiredSpanToDivider > 0 && getComputedStyleFn) {
                    targetButtons.forEach((btn) => {
                        const set = btn.closest?.(".time-adjust-set");
                        const setStyle = set ? getComputedStyleFn(set) : null;
                        const gap = setStyle ? (parseFloat(setStyle.columnGap || setStyle.gap || "0") || 0) : 0;
                        const btnStyle = getComputedStyleFn(btn);
                        const marginRight = parseFloat(btnStyle.marginRight || "0") || 0;
                        const nextWidth = Math.max(150, Math.round(desiredSpanToDivider - marginRight - gap));
                        const widthPx = `${nextWidth}px`;
                        btn.style.width = widthPx;
                        btn.style.minWidth = widthPx;
                    });
                    return;
                }

                const fallbackWidth = Math.max(
                    180,
                    ...targetButtons.map((btn) => Math.ceil(btn.getBoundingClientRect().width)),
                    ...targetButtons.map((btn) => Math.ceil((Number(btn.scrollWidth) || 0) + 18))
                );
                if (fallbackWidth <= 0) return;
                const widthPx = `${fallbackWidth}px`;
                targetButtons.forEach((btn) => {
                    btn.style.width = widthPx;
                    btn.style.minWidth = widthPx;
                });
            };

            if (typeof globalObj.requestAnimationFrame === "function") {
                globalObj.requestAnimationFrame(syncZeroButtonWidth);
            } else {
                syncZeroButtonWidth();
            }
            dep.upgradeNativeTitleTooltips(allTools);
        }

        return Object.freeze({
            renderMultiBulkToolSets
        });
    }

    globalObj.GTVMultiBulkTools = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
