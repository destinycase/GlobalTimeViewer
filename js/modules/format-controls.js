(function initGtvFormatControls(globalObj) {
    "use strict";

    function createService(deps) {
        let timePartsOutsideHandlerBound = false;
        let copyFormatDragGhostEl = null;
        const requestUiFrame = (typeof globalObj.requestAnimationFrame === "function")
            ? globalObj.requestAnimationFrame.bind(globalObj)
            : ((cb) => globalObj.setTimeout(cb, 16));

        function clearCopyFormatDragGhost() {
            if (!copyFormatDragGhostEl) return;
            if (copyFormatDragGhostEl.parentNode) {
                copyFormatDragGhostEl.parentNode.removeChild(copyFormatDragGhostEl);
            }
            copyFormatDragGhostEl = null;
        }

        function createCopyFormatDragGhost(item) {
            if (!(item instanceof HTMLElement)) return null;
            clearCopyFormatDragGhost();

            const ghost = item.cloneNode(true);
            if (!(ghost instanceof HTMLElement)) return null;
            ghost.classList.remove("dragging");
            ghost.classList.add("copy-format-drag-ghost");
            ghost.querySelectorAll("input, button").forEach((el) => {
                if (el instanceof HTMLElement) el.setAttribute("tabindex", "-1");
                if ("disabled" in el) el.disabled = true;
            });

            const rect = item.getBoundingClientRect();
            ghost.style.position = "fixed";
            ghost.style.left = "-10000px";
            ghost.style.top = "-10000px";
            ghost.style.width = `${Math.max(120, Math.round(rect.width))}px`;
            ghost.style.pointerEvents = "none";
            ghost.style.zIndex = "10000";

            document.body.appendChild(ghost);
            copyFormatDragGhostEl = ghost;
            return ghost;
        }

        function captureCopyFormatItemRects(list) {
            const rectMap = new Map();
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                rectMap.set(item, item.getBoundingClientRect());
            });
            return rectMap;
        }

        function animateCopyFormatReorder(list, beforeRects) {
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                const before = beforeRects.get(item);
                if (!before) return;
                const after = item.getBoundingClientRect();
                const deltaX = before.left - after.left;
                const deltaY = before.top - after.top;
                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

                item.style.transition = "none";
                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                requestUiFrame(() => {
                    item.style.transition = "transform 170ms ease";
                    item.style.transform = "";
                });
                item.addEventListener("transitionend", () => {
                    item.style.transition = "";
                }, { once: true });
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
            return deps.t(keyMap[key] || key);
        }

        function getTimePartLabel(partKey) {
            const map = {
                dn: "copy_time_part_dn",
                date: "copy_time_part_date",
                time: "copy_time_part_time",
                weekday: "copy_time_part_weekday"
            };
            return deps.t(map[partKey] || partKey);
        }

        function closeAllTimePartsMenus() {
            document.querySelectorAll(".time-parts-dropdown.open").forEach((el) => {
                el.classList.remove("open");
            });
        }

        function bindTimePartsOutsideClickHandler() {
            if (timePartsOutsideHandlerBound) return;
            document.addEventListener("click", (e) => {
                const target = e.target;
                if (typeof Element !== "undefined" && !(target instanceof Element)) return;
                if (target?.closest?.(".time-parts-dropdown")) return;
                closeAllTimePartsMenus();
            });
            timePartsOutsideHandlerBound = true;
        }

        function getCopyFormatDropTarget(container, x, y = null) {
            const draggableItems = [...container.querySelectorAll(".copy-format-item:not(.dragging)")];
            if (!draggableItems.length) return null;

            if (typeof y === "number") {
                for (const child of draggableItems) {
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
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) return { offset, element: child };
                return closest;
            }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
        }

        function renderFormatControlList(list, order, enabled, options = {}) {
            const { onToggle, onReorder, timePartsEnabled, onTimePartToggle } = options;
            if (!list) return;

            bindTimePartsOutsideClickHandler();
            list.textContent = "";
            order.forEach((key) => {
                if (!deps.COPY_FORMAT_KEYS.includes(key)) return;

                const item = document.createElement("div");
                item.className = "copy-format-item";
                item.dataset.key = key;
                item.draggable = false;

                const dragHandle = document.createElement("span");
                dragHandle.className = "copy-format-drag";
                dragHandle.textContent = "⋮⋮";
                dragHandle.draggable = true;

                const label = document.createElement("label");
                label.className = "copy-format-item-label";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !!enabled[key];
                checkbox.addEventListener("change", () => {
                    if (typeof onToggle === "function") onToggle(key, checkbox.checked);
                });

                const text = document.createElement("span");
                text.textContent = getCopyFieldLabel(key);

                label.appendChild(checkbox);
                label.appendChild(text);
                item.appendChild(dragHandle);
                item.appendChild(label);

                if (key === "time") {
                    const dropdown = document.createElement("div");
                    dropdown.className = "time-parts-dropdown";

                    const partsBtn = document.createElement("button");
                    partsBtn.type = "button";
                    partsBtn.className = "time-parts-toggle-btn";
                    partsBtn.textContent = deps.t("btn_time_parts");
                    partsBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const willOpen = !dropdown.classList.contains("open");
                        closeAllTimePartsMenus();
                        if (willOpen) dropdown.classList.add("open");
                    });

                    const menu = document.createElement("div");
                    menu.className = "time-parts-menu";
                    deps.TIME_PART_KEYS.forEach((partKey) => {
                        const rowEl = document.createElement("label");
                        rowEl.className = "time-parts-option";

                        const cb = document.createElement("input");
                        cb.type = "checkbox";
                        cb.checked = !!timePartsEnabled?.[partKey];
                        cb.addEventListener("change", () => {
                            if (typeof onTimePartToggle === "function") onTimePartToggle(partKey, cb.checked);
                        });

                        const txt = document.createElement("span");
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
                    item.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", key);
                        const ghost = createCopyFormatDragGhost(item);
                        e.dataTransfer.setDragImage(ghost || item, 12, 12);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    item.classList.remove("dragging");
                    clearCopyFormatDragGhost();
                    const nextOrder = [...list.querySelectorAll(".copy-format-item")].map((el) => el.dataset.key);
                    if (typeof onReorder === "function") onReorder(nextOrder);
                });

                list.appendChild(item);
            });

            list.ondragover = (e) => {
                const dragging = list.querySelector(".copy-format-item.dragging");
                if (!dragging) return;
                e.preventDefault();
                const beforeRects = captureCopyFormatItemRects(list);
                const after = getCopyFormatDropTarget(list, e.clientX, e.clientY);
                if (after === dragging || dragging.nextElementSibling === after) return;
                list.insertBefore(dragging, after);
                animateCopyFormatReorder(list, beforeRects);
            };
            list.ondrop = (e) => {
                const dragging = list.querySelector(".copy-format-item.dragging");
                if (!dragging) return;
                e.preventDefault();
                clearCopyFormatDragGhost();
            };
        }

        function renderCopyFormatControls() {
            const row = document.getElementById("copy-format-row");
            const displayList = document.getElementById("display-format-list");
            const copyList = document.getElementById("copy-format-list");
            if (!row || !displayList || !copyList) return;

            row.style.display = deps.isShowCopyFormat() ? "flex" : "none";
            if (!deps.isShowCopyFormat()) {
                displayList.textContent = "";
                copyList.textContent = "";
                deps.updateCopyFormatPreview();
                return;
            }

            renderFormatControlList(displayList, deps.getDisplayFormatOrder(), deps.getDisplayFormatEnabled(), {
                onToggle: (key, checked) => {
                    deps.setDisplayFormatEnabled({
                        ...deps.getDisplayFormatEnabled(),
                        [key]: checked
                    });
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                onReorder: (nextOrder) => {
                    deps.setDisplayFormatOrder(deps.sanitizeCopyFormatOrder(nextOrder));
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                timePartsEnabled: deps.getDisplayTimePartsEnabled(),
                onTimePartToggle: (partKey, checked) => {
                    deps.setDisplayTimePartsEnabled({
                        ...deps.getDisplayTimePartsEnabled(),
                        [partKey]: checked
                    });
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                }
            });

            renderFormatControlList(copyList, deps.getCopyFormatOrder(), deps.getCopyFormatEnabled(), {
                onToggle: (key, checked) => {
                    deps.setCopyFormatEnabled({
                        ...deps.getCopyFormatEnabled(),
                        [key]: checked
                    });
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                onReorder: (nextOrder) => {
                    deps.setCopyFormatOrder(deps.sanitizeCopyFormatOrder(nextOrder));
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                timePartsEnabled: deps.getCopyTimePartsEnabled(),
                onTimePartToggle: (partKey, checked) => {
                    deps.setCopyTimePartsEnabled({
                        ...deps.getCopyTimePartsEnabled(),
                        [partKey]: checked
                    });
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                }
            });
            deps.updateCopyFormatPreview();
            deps.upgradeNativeTitleTooltips(row);
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
