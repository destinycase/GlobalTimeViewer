(function initGtvMainRowOrderServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const requestUiFrame = (typeof safeDeps.requestUiFrame === "function")
            ? safeDeps.requestUiFrame
            : ((cb) => setTimeout(cb, 16));
        const cancelUiFrame = (typeof safeDeps.cancelUiFrame === "function")
            ? safeDeps.cancelUiFrame
            : ((id) => clearTimeout(id));
        const getGroups = (typeof safeDeps.getGroups === "function")
            ? safeDeps.getGroups
            : (() => (Array.isArray(safeDeps.groups) ? safeDeps.groups : []));
        const getActiveGroupId = (typeof safeDeps.getActiveGroupId === "function")
            ? safeDeps.getActiveGroupId
            : (() => Number.isInteger(safeDeps.activeGroupId) ? safeDeps.activeGroupId : 0);
        const getCurrentGroupBaseTimezoneId = (typeof safeDeps.getCurrentGroupBaseTimezoneId === "function")
            ? safeDeps.getCurrentGroupBaseTimezoneId
            : (() => "utc");
        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => {
                if (!safeDeps.persistenceService || typeof safeDeps.persistenceService !== "object") return null;
                return safeDeps.persistenceService;
            });
        const getDocumentRef = (typeof safeDeps.getDocumentRef === "function")
            ? safeDeps.getDocumentRef
            : (() => {
                if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
                if (typeof document === "object" && document) return document;
                return null;
            });
        const NodeCtor = (typeof safeDeps.NodeCtor === "function")
            ? safeDeps.NodeCtor
            : ((typeof Node === "function") ? Node : null);

        function savePersistence() {
            const persistenceService = getPersistenceService();
            if (!persistenceService || typeof persistenceService.savePersistence !== "function") return;
            persistenceService.savePersistence();
        }

        function captureReorderableRowRects(container) {
            const rectMap = new Map();
            const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
            rows.forEach((row) => {
                rectMap.set(row, row.getBoundingClientRect());
            });
            return rectMap;
        }

        function animateReorderTransition(container, beforeRects) {
            const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
            rows.forEach((row) => {
                const prevRect = beforeRects.get(row);
                if (!prevRect) return;
                const nextRect = row.getBoundingClientRect();
                const deltaY = prevRect.top - nextRect.top;
                if (Math.abs(deltaY) < 1) return;

                row.style.transition = "none";
                row.style.transform = `translateY(${deltaY}px)`;
                requestUiFrame(() => {
                    row.style.transition = "transform 170ms ease";
                    row.style.transform = "";
                });
                row.addEventListener("transitionend", () => {
                    row.style.transition = "";
                }, { once: true });
            });
        }

        function getAfter(container, y) {
            const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
            return rows.reduce((closest, row) => {
                const rect = row.getBoundingClientRect();
                const offset = y - rect.top - (rect.height / 2);
                if (offset < 0 && offset > closest.offset) {
                    return { offset, element: row };
                }
                return closest;
            }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
        }

        function bindRowContainerDragAndDrop(container) {
            if (!container) return;

            let pendingClientY = 0;
            let reorderFrameId = null;
            const requestReorder = () => {
                if (reorderFrameId !== null) return;
                reorderFrameId = requestUiFrame(() => {
                    reorderFrameId = null;
                    const draggingRow = container.querySelector(".time-row.dragging");
                    if (!draggingRow) return;

                    const beforeRects = captureReorderableRowRects(container);
                    const afterEl = getAfter(container, pendingClientY);
                    if (afterEl === draggingRow || draggingRow.nextElementSibling === afterEl) return;
                    container.insertBefore(draggingRow, afterEl);
                    animateReorderTransition(container, beforeRects);
                });
            };

            container.ondragover = (e) => {
                const draggingRow = container.querySelector(".time-row.dragging");
                if (!draggingRow) return;
                e.preventDefault();
                pendingClientY = e.clientY;
                requestReorder();
            };

            container.ondrop = (e) => {
                const draggingRow = container.querySelector(".time-row.dragging");
                if (!draggingRow) return;
                e.preventDefault();
            };

            container.ondragleave = (e) => {
                const relatedTarget = e ? e.relatedTarget : null;
                const isInside = !!(NodeCtor && relatedTarget instanceof NodeCtor && container.contains(relatedTarget));
                if (!isInside && reorderFrameId !== null) {
                    cancelUiFrame(reorderFrameId);
                    reorderFrameId = null;
                }
            };
        }

        function initDragAndDrop() {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            bindRowContainerDragAndDrop(documentRef.getElementById("clocks-container"));
        }

        function saveOrderForContainer(containerSelector) {
            const groups = getGroups();
            const activeGroup = Array.isArray(groups) ? groups[getActiveGroupId()] : null;
            if (!activeGroup) return;

            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.querySelectorAll !== "function") return;

            const ids = [...documentRef.querySelectorAll(`${containerSelector} .time-row:not(.static)`)]
                .map((row) => row.id.replace("tz-row-", ""));
            const zoneIds = ids.filter((id) => id !== "utc");
            activeGroup.zones.sort((a, b) => {
                const idxA = zoneIds.indexOf(a.id);
                const idxB = zoneIds.indexOf(b.id);
                if (idxA < 0 || idxB < 0) return 0;
                return idxA - idxB;
            });
            if (getCurrentGroupBaseTimezoneId() !== "utc") {
                const utcIndex = ids.indexOf("utc");
                activeGroup.showUtcRow = utcIndex >= 0;
                if (utcIndex >= 0) activeGroup.utcRowOrder = utcIndex;
            } else {
                activeGroup.showUtcRow = true;
                activeGroup.utcRowOrder = 0;
            }
            savePersistence();
        }

        function saveOrder() {
            saveOrderForContainer("#clocks-container");
        }

        return Object.freeze({
            bindRowContainerDragAndDrop,
            initDragAndDrop,
            captureReorderableRowRects,
            animateReorderTransition,
            getAfter,
            saveOrderForContainer,
            saveOrder
        });
    }

    globalObj.GTVMainRowOrderServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
