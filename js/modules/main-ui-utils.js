(function initGtvMainUiUtils(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let floatingTooltipEl = null;
        let floatingTooltipTarget = null;
        let floatingTooltipBound = false;
        let dragGhostEl = null;

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

        function getWindowRef() {
            if (typeof safeDeps.getWindowRef === "function") {
                const injected = safeDeps.getWindowRef();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (typeof safeDeps.getWindowRefOrNull === "function") {
                const injected = safeDeps.getWindowRefOrNull();
                if (injected && typeof injected === "object") {
                    return injected;
                }
            }
            if (safeDeps.windowRef && typeof safeDeps.windowRef === "object") {
                return safeDeps.windowRef;
            }
            if (safeDeps.window && typeof safeDeps.window === "object") {
                return safeDeps.window;
            }
            if (globalObj?.window && typeof globalObj.window === "object") {
                return globalObj.window;
            }
            if (typeof window === "object" && window) {
                return window;
            }
            if (globalObj && typeof globalObj === "object") {
                return globalObj;
            }
            return null;
        }

        function isElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            const ElementCtor = safeDeps.ElementCtor || safeDeps.Element || globalObj?.Element || globalThis?.Element;
            if (typeof ElementCtor !== "function") return true;
            return value instanceof ElementCtor;
        }

        function isHtmlElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            const HTMLElementCtor = safeDeps.HTMLElementCtor || safeDeps.HTMLElement || globalObj?.HTMLElement || globalThis?.HTMLElement;
            if (typeof HTMLElementCtor !== "function") return true;
            return value instanceof HTMLElementCtor;
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

        function upgradeNativeTitleTooltips(root = getDocumentRef()) {
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
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return null;
            if (!documentRef.body || typeof documentRef.body.appendChild !== "function") return null;
            const tooltip = documentRef.createElement("div");
            tooltip.className = "app-floating-tooltip";
            tooltip.id = "app-floating-tooltip";
            documentRef.body.appendChild(tooltip);
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
            const windowRef = getWindowRef();
            const viewportWidth = Number.isFinite(Number(windowRef?.innerWidth))
                ? Number(windowRef.innerWidth)
                : 1024;
            const viewportHeight = Number.isFinite(Number(windowRef?.innerHeight))
                ? Number(windowRef.innerHeight)
                : 768;

            let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            left = Math.min(
                viewportWidth - tooltipRect.width - viewportPadding,
                Math.max(viewportPadding, left)
            );

            let top = targetRect.top - tooltipRect.height - offset;
            if (top < viewportPadding) {
                top = targetRect.bottom + offset;
            }
            top = Math.min(
                viewportHeight - tooltipRect.height - viewportPadding,
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
            if (!tooltip) return;
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
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return null;
            if (!documentRef.body || typeof documentRef.body.appendChild !== "function") return null;

            const ghostTable = documentRef.createElement("table");
            ghostTable.className = "data-table drag-ghost-table";
            ghostTable.setAttribute("aria-hidden", "true");

            const ghostBody = documentRef.createElement("tbody");
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

            documentRef.body.appendChild(ghostTable);
            dragGhostEl = ghostTable;
            return ghostTable;
        }

        function bindFloatingTooltipEvents() {
            if (floatingTooltipBound) return;
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.addEventListener !== "function") return;
            const windowRef = getWindowRef();
            floatingTooltipBound = true;

            documentRef.addEventListener("pointerenter", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            documentRef.addEventListener("pointerleave", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            documentRef.addEventListener("focusin", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            documentRef.addEventListener("focusout", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            if (windowRef && typeof windowRef.addEventListener === "function") {
                windowRef.addEventListener("scroll", positionFloatingTooltip, true);
                windowRef.addEventListener("resize", positionFloatingTooltip, true);
            }
            documentRef.addEventListener("pointerdown", hideFloatingTooltip, true);
            documentRef.addEventListener("keydown", hideFloatingTooltip, true);
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
