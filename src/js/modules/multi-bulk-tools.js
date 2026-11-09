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

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVMultiBulkTools", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "t",
                "getMultiRangeCount",
                "renderTimeAdjustSet",
                "applyBulkRangeAllAction",
                "createTimeAdjustActionButton",
                "createTimeAdjustDivider",
                "applyFirstRangeStartAdjustAction",
                "setAllMultiRangeStartEditEnabled",
                "setAllMultiRangeEndEditEnabled",
                "upgradeNativeTitleTooltips"
            ])
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

            // Same fixed-width leading block as the other time adjust rows, so columns line up.
            const leadBlock = zeroDayBtn ? doc.createElement("span") : null;
            if (leadBlock) {
                leadBlock.className = "time-adjust-lead";
                leadBlock.appendChild(zeroDayBtn);
            }
            const leadNode = leadBlock || zeroDayBtn;

            const bulkChildren = asArray(bulkSet.children);
            const firstActionNode = bulkChildren.find((_node, idx) => idx > 0) || null;
            if (leadNode && firstActionNode && typeof bulkSet.insertBefore === "function") {
                bulkSet.insertBefore(leadNode, firstActionNode);
                const divider = dep.createTimeAdjustDivider();
                if (divider) bulkSet.insertBefore(divider, firstActionNode);
            } else if (leadNode) {
                bulkSet.appendChild(leadNode);
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
