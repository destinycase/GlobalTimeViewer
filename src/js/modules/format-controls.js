(function initGtvFormatControls(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let timePartsOutsideHandlerBound = false;
        let copyFormatDragGhostEl = null;
        const requestUiFrame = (typeof globalObj.requestAnimationFrame === "function")
            ? globalObj.requestAnimationFrame.bind(globalObj)
            : ((cb) => {
                if (typeof globalObj.setTimeout === "function") {
                    return globalObj.setTimeout(cb, 16);
                }
                if (typeof cb === "function") cb();
                return 0;
            });

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
                    logWarn(`[GTVFormatControls] Dependency "${depName}" threw.`, err);
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
                "getActiveCopyFormatKeys",
                "getActiveTimePartKeys",
                "isShowCopyFormat",
                "updateCopyFormatPreview",
                "getDisplayFormatOrder",
                "getDisplayFormatEnabled",
                "setDisplayFormatEnabled",
                "renderList",
                "savePersistence",
                "setDisplayFormatOrder",
                "sanitizeCopyFormatOrder",
                "getDisplayTimePartsEnabled",
                "setDisplayTimePartsEnabled",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "setCopyFormatEnabled",
                "setCopyFormatOrder",
                "getCopyTimePartsEnabled",
                "setCopyTimePartsEnabled",
                "upgradeNativeTitleTooltips",
                "patchAppState",
                "getActiveFormatProfileContext",
                "sanitizeCopyFormatOrderForContext",
                "syncActiveFormatProfileFromState"
            ])
        });

        function savePersistenceSafe() {
            return dep.savePersistence();
        }

        function translate(key) {
            const translated = dep.t(key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function getCopyFormatKeys() {
            const activeKeys = dep.getActiveCopyFormatKeys();
            if (Array.isArray(activeKeys) && activeKeys.length) return activeKeys;
            return Array.isArray(safeDeps.COPY_FORMAT_KEYS) ? safeDeps.COPY_FORMAT_KEYS : [];
        }

        function getTimePartKeys() {
            const activeKeys = dep.getActiveTimePartKeys();
            if (Array.isArray(activeKeys) && activeKeys.length) return activeKeys;
            return Array.isArray(safeDeps.TIME_PART_KEYS) ? safeDeps.TIME_PART_KEYS : [];
        }

        function toOrderArray(order) {
            return Array.isArray(order)
                ? order.filter((key) => typeof key === "string" && key)
                : [];
        }

        function normalizeOrderForContext(nextOrder) {
            const rawOrder = toOrderArray(nextOrder);
            const sanitizedOrder = toOrderArray(dep.sanitizeCopyFormatOrder(nextOrder));
            const baseOrder = sanitizedOrder.length ? sanitizedOrder : rawOrder;
            const context = dep.getActiveFormatProfileContext();
            const contextualOrder = toOrderArray(dep.sanitizeCopyFormatOrderForContext(baseOrder, context));
            if (contextualOrder.length) return contextualOrder;
            return baseOrder;
        }

        function isSameOrder(a, b) {
            const left = toOrderArray(a);
            const right = toOrderArray(b);
            if (left.length !== right.length) return false;
            for (let i = 0; i < left.length; i += 1) {
                if (left[i] !== right[i]) return false;
            }
            return true;
        }

        function applyOrderWithFallback(stateKey, nextOrder, setterFn, getterFn) {
            const safeOrder = normalizeOrderForContext(nextOrder);
            setterFn(safeOrder);

            const updatedOrder = toOrderArray(getterFn());
            if (isSameOrder(updatedOrder, safeOrder)) return safeOrder;

            dep.patchAppState({ [stateKey]: safeOrder });
            dep.syncActiveFormatProfileFromState();
            return safeOrder;
        }

        function isElementLike(el) {
            return !!el && typeof el === "object";
        }

        function isHtmlElementLike(el) {
            if (!isElementLike(el)) return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function clearCopyFormatDragGhost() {
            if (!copyFormatDragGhostEl) return;
            if (copyFormatDragGhostEl.parentNode) {
                copyFormatDragGhostEl.parentNode.removeChild(copyFormatDragGhostEl);
            }
            copyFormatDragGhostEl = null;
        }

        function createCopyFormatDragGhost(item) {
            const doc = getDocumentRef();
            if (!isHtmlElementLike(item)) return null;
            if (!doc || !doc.body || typeof doc.body.appendChild !== "function") return null;
            if (typeof item.cloneNode !== "function") return null;
            clearCopyFormatDragGhost();

            const ghost = item.cloneNode(true);
            if (!isHtmlElementLike(ghost)) return null;
            if (!ghost.style || typeof ghost.style !== "object") return null;

            if (ghost.classList && typeof ghost.classList.remove === "function") {
                ghost.classList.remove("dragging");
            }
            if (ghost.classList && typeof ghost.classList.add === "function") {
                ghost.classList.add("copy-format-drag-ghost");
            }

            if (typeof ghost.querySelectorAll === "function") {
                ghost.querySelectorAll("input, button").forEach((el) => {
                    if (isHtmlElementLike(el) && typeof el.setAttribute === "function") {
                        el.setAttribute("tabindex", "-1");
                    }
                    if (el && typeof el === "object" && "disabled" in el) {
                        el.disabled = true;
                    }
                });
            }

            const rect = (typeof item.getBoundingClientRect === "function")
                ? item.getBoundingClientRect()
                : { width: 120 };

            ghost.style.position = "fixed";
            ghost.style.left = "-10000px";
            ghost.style.top = "-10000px";
            ghost.style.width = `${Math.max(120, Math.round(Number(rect.width) || 120))}px`;
            ghost.style.pointerEvents = "none";
            ghost.style.zIndex = "10000";

            doc.body.appendChild(ghost);
            copyFormatDragGhostEl = ghost;
            return ghost;
        }

        function captureCopyFormatItemRects(list) {
            const rectMap = new Map();
            if (!isElementLike(list) || typeof list.querySelectorAll !== "function") return rectMap;
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                if (typeof item?.getBoundingClientRect !== "function") return;
                rectMap.set(item, item.getBoundingClientRect());
            });
            return rectMap;
        }

        function animateCopyFormatReorder(list, beforeRects) {
            if (!isElementLike(list) || typeof list.querySelectorAll !== "function") return;
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                const before = beforeRects.get(item);
                if (!before || typeof item?.getBoundingClientRect !== "function") return;
                const after = item.getBoundingClientRect();
                const deltaX = before.left - after.left;
                const deltaY = before.top - after.top;
                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
                if (!item.style || typeof item.style !== "object") return;

                item.style.transition = "none";
                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                requestUiFrame(() => {
                    if (!item.style || typeof item.style !== "object") return;
                    item.style.transition = "transform 170ms ease";
                    item.style.transform = "";
                });
                if (typeof item.addEventListener === "function") {
                    item.addEventListener("transitionend", () => {
                        if (!item.style || typeof item.style !== "object") return;
                        item.style.transition = "";
                    }, { once: true });
                }
            });
        }

        function getCopyFieldLabel(key) {
            const keyMap = {
                timezone: "copy_field_timezone",
                region: "copy_field_region",
                offset: "copy_field_offset",
                time: "copy_field_time",
                period_days: "copy_field_period",
                period_time: "copy_field_period_time"
            };
            return translate(keyMap[key] || key);
        }

        function getTimePartLabel(partKey) {
            const map = {
                dn: "copy_time_part_dn",
                date: "copy_time_part_date",
                time: "copy_time_part_time",
                weekday: "copy_time_part_weekday"
            };
            return translate(map[partKey] || partKey);
        }

        function closeAllTimePartsMenus() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.querySelectorAll !== "function") return;
            doc.querySelectorAll(".time-parts-dropdown.open").forEach((el) => {
                if (el?.classList && typeof el.classList.remove === "function") {
                    el.classList.remove("open");
                }
            });
        }

        function bindTimePartsOutsideClickHandler() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.addEventListener !== "function") return;
            if (timePartsOutsideHandlerBound) return;
            doc.addEventListener("click", (e) => {
                const target = e?.target;
                if (typeof Element !== "undefined" && target && !(target instanceof Element)) return;
                if (target?.closest?.(".time-parts-dropdown")) return;
                closeAllTimePartsMenus();
            });
            timePartsOutsideHandlerBound = true;
        }

        function getCopyFormatDropTarget(container, x, y = null) {
            if (!isElementLike(container) || typeof container.querySelectorAll !== "function") return null;
            const draggableItems = Array.from(container.querySelectorAll(".copy-format-item:not(.dragging)") || []);
            if (!draggableItems.length) return null;

            if (typeof y === "number") {
                for (const child of draggableItems) {
                    if (typeof child?.getBoundingClientRect !== "function") continue;
                    const box = child.getBoundingClientRect();
                    const halfY = box.top + (box.height / 2);
                    const halfX = box.left + (box.width / 2);
                    const inSameRow = y >= box.top && y <= box.bottom;

                    if (y < halfY || (inSameRow && x < halfX)) {
                        return child;
                    }
                }
                return null;
            }

            return draggableItems.reduce((closest, child) => {
                if (typeof child?.getBoundingClientRect !== "function") return closest;
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) return { offset, element: child };
                return closest;
            }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
        }

        function renderFormatControlList(list, order, enabled, options = {}) {
            const doc = getDocumentRef();
            const safeOrder = Array.isArray(order) ? order : [];
            const safeEnabled = (enabled && typeof enabled === "object") ? enabled : {};
            const { onToggle, onReorder, onReorderPreview, timePartsEnabled, onTimePartToggle } = options;
            if (!isElementLike(list) || !doc || typeof doc.createElement !== "function") return;
            let didCommitReorderOnDrop = false;
            let lastPreviewOrderSignature = "";

            function collectCurrentOrder() {
                if (typeof list.querySelectorAll !== "function") return [];
                return Array.from(list.querySelectorAll(".copy-format-item") || [])
                    .map((el) => el?.dataset?.key)
                    .filter((value) => typeof value === "string" && value);
            }

            function getOrderSignature(nextOrder) {
                return Array.isArray(nextOrder) ? nextOrder.join("\u0001") : "";
            }

            function previewCurrentOrder() {
                if (typeof onReorderPreview !== "function") return;
                const nextOrder = collectCurrentOrder();
                const signature = getOrderSignature(nextOrder);
                if (signature === lastPreviewOrderSignature) return;
                lastPreviewOrderSignature = signature;
                onReorderPreview(nextOrder);
            }

            function commitCurrentOrder() {
                if (typeof onReorder !== "function") return;
                const nextOrder = collectCurrentOrder();
                lastPreviewOrderSignature = getOrderSignature(nextOrder);
                onReorder(nextOrder);
            }

            function getDropTargetFromEvent(event) {
                const clientX = Number(event?.clientX);
                const clientY = Number(event?.clientY);
                if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
                    return getCopyFormatDropTarget(list, clientX, clientY);
                }

                const target = event?.target;
                if (!target || typeof target.closest !== "function") return null;
                const candidate = target.closest(".copy-format-item:not(.dragging)");
                if (!candidate) return null;
                if (typeof list.contains === "function" && !list.contains(candidate)) return null;
                return candidate;
            }

            function moveDraggingItemToDropTarget(event, options = {}) {
                const { animate = true } = options;
                const dragging = (typeof list.querySelector === "function")
                    ? list.querySelector(".copy-format-item.dragging")
                    : null;
                if (!dragging) return false;

                const after = getDropTargetFromEvent(event);
                if (after === dragging || dragging.nextElementSibling === after) return false;

                if (typeof list.insertBefore !== "function") return false;
                const beforeRects = animate ? captureCopyFormatItemRects(list) : null;
                list.insertBefore(dragging, after);
                if (animate && beforeRects) {
                    animateCopyFormatReorder(list, beforeRects);
                }
                return true;
            }

            bindTimePartsOutsideClickHandler();
            list.textContent = "";
            safeOrder.forEach((key) => {
                if (!getCopyFormatKeys().includes(key)) return;

                const item = doc.createElement("div");
                item.className = "copy-format-item";
                item.dataset.key = key;
                item.draggable = false;

                const dragHandle = doc.createElement("span");
                dragHandle.className = "copy-format-drag";
                dragHandle.textContent = "\u22EE\u22EE";
                dragHandle.draggable = true;

                const label = doc.createElement("label");
                label.className = "copy-format-item-label";

                const checkbox = doc.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !!safeEnabled[key];
                checkbox.addEventListener("change", () => {
                    if (typeof onToggle === "function") onToggle(key, checkbox.checked);
                });

                const text = doc.createElement("span");
                text.textContent = getCopyFieldLabel(key);

                label.appendChild(checkbox);
                label.appendChild(text);
                item.appendChild(dragHandle);
                item.appendChild(label);

                if (key === "time") {
                    const dropdown = doc.createElement("div");
                    dropdown.className = "time-parts-dropdown";

                    const partsBtn = doc.createElement("button");
                    partsBtn.type = "button";
                    partsBtn.className = "time-parts-toggle-btn";
                    partsBtn.textContent = translate("btn_time_parts");
                    partsBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const willOpen = !!dropdown.classList && !dropdown.classList.contains("open");
                        closeAllTimePartsMenus();
                        if (willOpen && dropdown.classList && typeof dropdown.classList.add === "function") {
                            dropdown.classList.add("open");
                        }
                    });

                    const menu = doc.createElement("div");
                    menu.className = "time-parts-menu";
                    getTimePartKeys().forEach((partKey) => {
                        const rowEl = doc.createElement("label");
                        rowEl.className = "time-parts-option";

                        const cb = doc.createElement("input");
                        cb.type = "checkbox";
                        cb.checked = !!timePartsEnabled?.[partKey];
                        cb.addEventListener("change", () => {
                            if (typeof onTimePartToggle === "function") onTimePartToggle(partKey, cb.checked);
                        });

                        const txt = doc.createElement("span");
                        txt.textContent = getTimePartLabel(partKey);

                        rowEl.appendChild(cb);
                        rowEl.appendChild(txt);
                        menu.appendChild(rowEl);
                    });

                    dropdown.appendChild(partsBtn);
                    dropdown.appendChild(menu);
                    item.appendChild(dropdown);
                }

                dragHandle.addEventListener("dragstart", (e) => {
                    didCommitReorderOnDrop = false;
                    lastPreviewOrderSignature = "";
                    if (item.classList && typeof item.classList.add === "function") item.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", key);
                        const ghost = createCopyFormatDragGhost(item);
                        e.dataTransfer.setDragImage(ghost || item, 12, 12);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    if (item.classList && typeof item.classList.remove === "function") item.classList.remove("dragging");
                    clearCopyFormatDragGhost();
                    if (!didCommitReorderOnDrop) {
                        commitCurrentOrder();
                    }
                    didCommitReorderOnDrop = false;
                });

                list.appendChild(item);
            });

            list.ondragover = (e) => {
                const dragging = (typeof list.querySelector === "function")
                    ? list.querySelector(".copy-format-item.dragging")
                    : null;
                if (!dragging) return;
                e.preventDefault();
                const moved = moveDraggingItemToDropTarget(e, { animate: true });
                if (moved) previewCurrentOrder();
            };

            list.ondrop = (e) => {
                const dragging = (typeof list.querySelector === "function")
                    ? list.querySelector(".copy-format-item.dragging")
                    : null;
                if (!dragging) return;
                e.preventDefault();
                const moved = moveDraggingItemToDropTarget(e, { animate: false });
                clearCopyFormatDragGhost();
                didCommitReorderOnDrop = true;
                if (moved) previewCurrentOrder();
                commitCurrentOrder();
            };
        }

        function renderCopyFormatControls() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const row = doc.getElementById("copy-format-row");
            const displayList = doc.getElementById("display-format-list");
            const copyList = doc.getElementById("copy-format-list");
            if (!row || !displayList || !copyList) return;

            const showCopyFormat = !!dep.isShowCopyFormat();
            row.style.display = showCopyFormat ? "flex" : "none";
            if (!showCopyFormat) {
                displayList.textContent = "";
                copyList.textContent = "";
                dep.updateCopyFormatPreview();
                return;
            }

            renderFormatControlList(
                displayList,
                dep.getDisplayFormatOrder(),
                dep.getDisplayFormatEnabled(),
                {
                    onToggle: (key, checked) => {
                        const currentEnabled = dep.getDisplayFormatEnabled();
                        dep.setDisplayFormatEnabled({
                            ...((currentEnabled && typeof currentEnabled === "object") ? currentEnabled : {}),
                            [key]: checked
                        });
                        dep.renderList();
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    },
                    onReorder: (nextOrder) => {
                        applyOrderWithFallback(
                            "displayFormatOrder",
                            nextOrder,
                            dep.setDisplayFormatOrder,
                            dep.getDisplayFormatOrder
                        );
                        dep.renderList();
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    },
                    onReorderPreview: (nextOrder) => {
                        applyOrderWithFallback(
                            "displayFormatOrder",
                            nextOrder,
                            dep.setDisplayFormatOrder,
                            dep.getDisplayFormatOrder
                        );
                        dep.renderList();
                        dep.updateCopyFormatPreview();
                    },
                    timePartsEnabled: dep.getDisplayTimePartsEnabled(),
                    onTimePartToggle: (partKey, checked) => {
                        const currentParts = dep.getDisplayTimePartsEnabled();
                        dep.setDisplayTimePartsEnabled({
                            ...((currentParts && typeof currentParts === "object") ? currentParts : {}),
                            [partKey]: checked
                        });
                        dep.renderList();
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    }
                }
            );

            renderFormatControlList(
                copyList,
                dep.getCopyFormatOrder(),
                dep.getCopyFormatEnabled(),
                {
                    onToggle: (key, checked) => {
                        const currentEnabled = dep.getCopyFormatEnabled();
                        dep.setCopyFormatEnabled({
                            ...((currentEnabled && typeof currentEnabled === "object") ? currentEnabled : {}),
                            [key]: checked
                        });
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    },
                    onReorder: (nextOrder) => {
                        applyOrderWithFallback(
                            "copyFormatOrder",
                            nextOrder,
                            dep.setCopyFormatOrder,
                            dep.getCopyFormatOrder
                        );
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    },
                    onReorderPreview: (nextOrder) => {
                        applyOrderWithFallback(
                            "copyFormatOrder",
                            nextOrder,
                            dep.setCopyFormatOrder,
                            dep.getCopyFormatOrder
                        );
                        dep.updateCopyFormatPreview();
                    },
                    timePartsEnabled: dep.getCopyTimePartsEnabled(),
                    onTimePartToggle: (partKey, checked) => {
                        const currentParts = dep.getCopyTimePartsEnabled();
                        dep.setCopyTimePartsEnabled({
                            ...((currentParts && typeof currentParts === "object") ? currentParts : {}),
                            [partKey]: checked
                        });
                        dep.updateCopyFormatPreview();
                        savePersistenceSafe();
                    }
                }
            );

            dep.updateCopyFormatPreview();
            dep.upgradeNativeTitleTooltips(row);
        }

        return Object.freeze({
            getCopyFieldLabel,
            getTimePartLabel,
            closeAllTimePartsMenus,
            bindTimePartsOutsideClickHandler,
            getCopyFormatDropTarget,
            renderFormatControlList,
            renderCopyFormatControls
        });
    }

    globalObj.GTVFormatControls = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
