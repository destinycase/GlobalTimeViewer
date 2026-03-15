(function initGtvMainUiUtils(globalObj) {
    "use strict";

    function createService() {
        let floatingTooltipEl = null;
        let floatingTooltipTarget = null;
        let floatingTooltipBound = false;
        let dragGhostEl = null;

        function isElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            if (typeof Element === "undefined") return true;
            return value instanceof Element;
        }

        function isHtmlElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return value instanceof HTMLElement;
        }

        function setCustomTooltip(el, text) {
            if (!isElementInstance(el)) return;
            const tooltip = (typeof text === "string") ? text.trim() : "";
            if (!tooltip) {
                el.removeAttribute("data-tooltip");
                if (!el.classList.contains("info-tip")) el.classList.remove("custom-tooltip");
                el.removeAttribute("title");
                return;
            }
            el.setAttribute("data-tooltip", tooltip);
            el.setAttribute("aria-label", tooltip);
            el.removeAttribute("title");
            if (!el.classList.contains("info-tip")) el.classList.add("custom-tooltip");
        }

        function upgradeNativeTitleTooltips(root = document) {
            if (!root || typeof root.querySelectorAll !== "function") return;
            const candidates = root.querySelectorAll(
                'button.copy-row-btn[title], button.remove-row-btn[title]'
            );
            candidates.forEach((el) => {
                const text = (el.getAttribute("title") || "").trim();
                if (!text) {
                    el.removeAttribute("title");
                    return;
                }
                setCustomTooltip(el, text);
            });
        }

        function ensureFloatingTooltipElement() {
            if (floatingTooltipEl && floatingTooltipEl.isConnected) return floatingTooltipEl;
            const tooltip = document.createElement("div");
            tooltip.className = "app-floating-tooltip";
            tooltip.id = "app-floating-tooltip";
            document.body.appendChild(tooltip);
            floatingTooltipEl = tooltip;
            return tooltip;
        }

        function hideFloatingTooltip() {
            if (floatingTooltipEl) floatingTooltipEl.classList.remove("visible");
            floatingTooltipTarget = null;
        }

        function positionFloatingTooltip() {
            if (!floatingTooltipEl || !floatingTooltipTarget) return;
            if (!isElementInstance(floatingTooltipTarget) || !floatingTooltipTarget.isConnected) {
                hideFloatingTooltip();
                return;
            }

            const targetRect = floatingTooltipTarget.getBoundingClientRect();
            floatingTooltipEl.style.left = "0px";
            floatingTooltipEl.style.top = "0px";
            const tooltipRect = floatingTooltipEl.getBoundingClientRect();
            const viewportPadding = 8;
            const offset = 10;

            let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            left = Math.min(
                window.innerWidth - tooltipRect.width - viewportPadding,
                Math.max(viewportPadding, left)
            );

            let top = targetRect.top - tooltipRect.height - offset;
            if (top < viewportPadding) {
                top = targetRect.bottom + offset;
            }
            top = Math.min(
                window.innerHeight - tooltipRect.height - viewportPadding,
                Math.max(viewportPadding, top)
            );

            floatingTooltipEl.style.left = `${Math.round(left)}px`;
            floatingTooltipEl.style.top = `${Math.round(top)}px`;
        }

        function showFloatingTooltip(target) {
            if (!isElementInstance(target)) {
                hideFloatingTooltip();
                return;
            }
            const text = (target.getAttribute("data-tooltip") || "").trim();
            if (!text) {
                hideFloatingTooltip();
                return;
            }

            const tooltip = ensureFloatingTooltipElement();
            tooltip.textContent = text;
            floatingTooltipTarget = target;
            tooltip.classList.add("visible");
            positionFloatingTooltip();
        }

        function clearDragGhost() {
            if (!dragGhostEl) return;
            if (dragGhostEl.parentNode) {
                dragGhostEl.parentNode.removeChild(dragGhostEl);
            }
            dragGhostEl = null;
        }

        function createDragGhostFromRow(row) {
            if (!isHtmlElementInstance(row)) return null;
            clearDragGhost();

            const ghostTable = document.createElement("table");
            ghostTable.className = "data-table drag-ghost-table";
            ghostTable.setAttribute("aria-hidden", "true");

            const ghostBody = document.createElement("tbody");
            const ghostRow = row.cloneNode(true);
            if (isHtmlElementInstance(ghostRow)) {
                ghostRow.classList.remove("dragging");
                ghostRow.classList.add("drag-ghost-row");
                const sourceInputs = [...row.querySelectorAll(".time-input")];
                ghostRow.querySelectorAll(".time-input").forEach((input, idx) => {
                    const sourceValue = sourceInputs[idx]?.value;
                    if (typeof sourceValue === "string") input.value = sourceValue;
                    input.setAttribute("readonly", "readonly");
                });
            }
            ghostBody.appendChild(ghostRow);
            ghostTable.appendChild(ghostBody);

            const rect = row.getBoundingClientRect();
            ghostTable.style.width = `${Math.max(420, Math.round(rect.width))}px`;
            ghostTable.style.position = "fixed";
            ghostTable.style.left = "-10000px";
            ghostTable.style.top = "-10000px";
            ghostTable.style.pointerEvents = "none";
            ghostTable.style.zIndex = "10000";

            document.body.appendChild(ghostTable);
            dragGhostEl = ghostTable;
            return ghostTable;
        }

        function bindFloatingTooltipEvents() {
            if (floatingTooltipBound) return;
            floatingTooltipBound = true;

            document.addEventListener("pointerenter", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            document.addEventListener("pointerleave", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            document.addEventListener("focusin", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            document.addEventListener("focusout", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            window.addEventListener("scroll", positionFloatingTooltip, true);
            window.addEventListener("resize", positionFloatingTooltip, true);
            document.addEventListener("pointerdown", hideFloatingTooltip, true);
            document.addEventListener("keydown", hideFloatingTooltip, true);
        }

        return Object.freeze({
            setCustomTooltip,
            upgradeNativeTitleTooltips,
            hideFloatingTooltip,
            bindFloatingTooltipEvents,
            clearDragGhost,
            createDragGhostFromRow
        });
    }

    globalObj.GTVMainUiUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
