(function initGtvMultiRangeImageRender(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

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
                    logWarn(`[GTVMultiRangeImageRender] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function toSafeAsyncCallable(depName, depFn) {
            if (typeof depFn !== "function") return async () => undefined;
            return async (...args) => {
                try {
                    return await depFn(...args);
                } catch (err) {
                    logWarn(`[GTVMultiRangeImageRender] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getMultiRanges: toSafeCallable("getMultiRanges", safeDeps.getMultiRanges),
            getMultiRangeTitleText: toSafeCallable("getMultiRangeTitleText", safeDeps.getMultiRangeTitleText),
            waitForDocumentFontsReady: toSafeAsyncCallable("waitForDocumentFontsReady", safeDeps.waitForDocumentFontsReady),
            cloneMultiRangeBlockForImageExport: toSafeCallable("cloneMultiRangeBlockForImageExport", safeDeps.cloneMultiRangeBlockForImageExport),
            prepareExportCanvas: toSafeCallable("prepareExportCanvas", safeDeps.prepareExportCanvas),
            drawExportCellText: toSafeCallable("drawExportCellText", safeDeps.drawExportCellText),
            t: toSafeCallable("t", safeDeps.t),
            extractTableCellText: toSafeCallable("extractTableCellText", safeDeps.extractTableCellText),
            ensureMultiRangeState: toSafeCallable("ensureMultiRangeState", safeDeps.ensureMultiRangeState),
            getBaseTimezoneRef: toSafeCallable("getBaseTimezoneRef", safeDeps.getBaseTimezoneRef)
        });

        function translate(key) {
            const value = dep.t(key);
            return (typeof value === "string" && value) ? value : String(key || "");
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
            return (typeof document === "object" && document) ? document : null;
        }

        function getComputedStyleSafe(target) {
            if (typeof globalObj.getComputedStyle === "function") {
                return globalObj.getComputedStyle(target);
            }
            return {
                getPropertyValue() { return ""; },
                backgroundColor: ""
            };
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

        function getMultiRangeTitles(baseRef) {
            const ranges = asArray(dep.getMultiRanges());
            return ranges.map((range, rangeIdx) =>
                dep.getMultiRangeTitleText(rangeIdx, range, baseRef)
            );
        }

        async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
            await dep.waitForDocumentFontsReady();

            const doc = getDocumentRef();
            const containerEl = doc?.getElementById?.("multi-ranges-container");
            if (!containerEl) throw new Error("Multi-range container not found");

            const sourceBlocks = asArray(containerEl.querySelectorAll?.(".multi-range-block"));
            const selectedBlocks = Number.isInteger(targetRangeIdx)
                ? (sourceBlocks[targetRangeIdx] ? [sourceBlocks[targetRangeIdx]] : [])
                : sourceBlocks;
            if (!selectedBlocks.length) throw new Error("No multi-range table data to render");

            const clonedContainer = doc.createElement("div");
            clonedContainer.className = "multi-ranges-container";
            selectedBlocks.forEach((blockEl) => {
                const cloned = dep.cloneMultiRangeBlockForImageExport(blockEl);
                if (cloned) clonedContainer.appendChild(cloned);
            });

            const measureHost = doc.createElement("div");
            measureHost.style.cssText = "position:fixed; left:-10000px; top:0; width:auto; min-width:800px; max-width:1400px; height:auto; opacity:0; pointer-events:none; display:block !important;";
            measureHost.appendChild(clonedContainer);
            doc.body?.appendChild?.(measureHost);

            const metrics = [];
            try {
                const blockEls = asArray(clonedContainer.querySelectorAll?.(".multi-range-block"));
                blockEls.forEach((block) => {
                    block.classList?.remove?.("collapsed");
                    const titleText = (block.querySelector?.(".multi-range-title")?.textContent || "").trim();
                    const tableEl = block.querySelector?.(".data-table");
                    if (!tableEl) return;

                    const headerCells = asArray(tableEl.querySelectorAll?.("thead th"))
                        .filter((th) => !th.classList?.contains("export-exclude") && !th.classList?.contains("move-col"));
                    const bodyRows = asArray(tableEl.querySelectorAll?.("tbody tr.time-row"));
                    if (!headerCells.length || !bodyRows.length) return;

                    const colWidths = headerCells.map((th) => Math.max(Math.ceil(th.getBoundingClientRect?.().width || 0), 70));
                    const tableWidth = colWidths.reduce((acc, w) => acc + w, 0);
                    const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect?.().height || 0) || 40);
                    const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect?.().height || 0) || 40));
                    const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);

                    metrics.push({
                        titleText,
                        headerCells,
                        bodyRows,
                        colWidths,
                        headerHeight,
                        rowHeights,
                        tableWidth,
                        tableHeight
                    });
                });
            } finally {
                measureHost.remove?.();
            }

            if (!metrics.length) throw new Error("No multi-range table data to render");

            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body || doc.documentElement);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";
            const blockGap = 14;
            const titleHeight = 38;

            const maxTableWidth = Math.max(...metrics.map((metric) => metric.tableWidth));
            const sourceWidth = Math.max(1, maxTableWidth);
            const sourceHeight = metrics.reduce((sum, metric, idx) => (
                sum + titleHeight + metric.tableHeight + (idx < metrics.length - 1 ? blockGap : 0)
            ), 0);

            const renderTarget = dep.prepareExportCanvas(sourceWidth, sourceHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            const headBg = (rootStyle.getPropertyValue?.("--table-head-bg") || "#1e293b").trim();
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const textColor = (rootStyle.getPropertyValue?.("--text") || "#f1f5f9").trim();
            const dimColor = (rootStyle.getPropertyValue?.("--text-dim") || "#94a3b8").trim();
            const accentColor = (rootStyle.getPropertyValue?.("--accent") || "#38bdf8").trim();
            const rowBgA = "rgba(255,255,255,0.02)";
            const rowBgB = "rgba(255,255,255,0.04)";
            const titleBg = "rgba(56, 189, 248, 0.10)";

            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const exportBodyFont = `13px ${monoFont} `;
            const exportHeaderFont = `600 13px ${monoFont} `;
            const exportTitleFont = `700 16px ${monoFont} `;

            const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
                dep.drawExportCellText(ctx, text, x, y, w, h, { align, color, font, clip: true });
            };

            const isCenterBodyCell = (cell) => {
                if (!cell) return false;
                if (
                    cell.classList?.contains("timezone-cell") ||
                    cell.classList?.contains("period-days-cell") ||
                    cell.classList?.contains("period-time-cell")
                ) {
                    return true;
                }
                return !!cell.querySelector?.(".offset-text");
            };

            let y = 0;
            metrics.forEach((metric, metricIdx) => {
                const titleText = metric.titleText || `${translate("default_subgroup_name")} ${metricIdx + 1} `;
                ctx.fillStyle = titleBg;
                ctx.fillRect(0, y, sourceWidth, titleHeight);
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y + titleHeight - 0.5);
                ctx.lineTo(sourceWidth, y + titleHeight - 0.5);
                ctx.stroke();
                drawCellText(titleText, 0, y, sourceWidth, titleHeight, "left", accentColor, exportTitleFont);
                y += titleHeight;

                ctx.fillStyle = headBg;
                ctx.fillRect(0, y, metric.tableWidth, metric.headerHeight);
                ctx.beginPath();
                ctx.moveTo(0, y + metric.headerHeight - 0.5);
                ctx.lineTo(metric.tableWidth, y + metric.headerHeight - 0.5);
                ctx.stroke();

                let x = 0;
                for (let c = 0; c < metric.colWidths.length; c++) {
                    const w = metric.colWidths[c];
                    const headText = (metric.headerCells[c].textContent || "").trim();
                    drawCellText(headText, x, y, w, metric.headerHeight, "center", dimColor, exportHeaderFont);
                    if (c < metric.colWidths.length - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x + w - 0.5, y);
                        ctx.lineTo(x + w - 0.5, y + metric.tableHeight);
                        ctx.stroke();
                    }
                    x += w;
                }

                let rowY = y + metric.headerHeight;
                metric.bodyRows.forEach((row, rowIdx) => {
                    const h = metric.rowHeights[rowIdx];
                    ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
                    ctx.fillRect(0, rowY, metric.tableWidth, h);
                    ctx.beginPath();
                    ctx.moveTo(0, rowY + h - 0.5);
                    ctx.lineTo(metric.tableWidth, rowY + h - 0.5);
                    ctx.stroke();

                    let rowX = 0;
                    const cells = asArray(row.children)
                        .filter((td) => !td.classList?.contains("export-exclude") && !td.classList?.contains("move-cell"));
                    for (let c = 0; c < metric.colWidths.length; c++) {
                        const w = metric.colWidths[c];
                        const cell = cells[c];
                        const text = dep.extractTableCellText(cell) || "";
                        const center = isCenterBodyCell(cell);
                        drawCellText(text, rowX, rowY, w, h, center ? "center" : "left", textColor, exportBodyFont);
                        rowX += w;
                    }
                    rowY += h;
                });

                y += metric.tableHeight;
                if (metricIdx < metrics.length - 1) y += blockGap;
            });

            return canvas.toDataURL("image/png");
        }

        async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
            return renderMultiRangesFallbackDataUrl(targetRangeIdx);
        }

        async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
            return renderMultiRangesToPngDataUrl(rangeIdx);
        }

        async function renderMultiRangeTitlesToPngDataUrl() {
            await dep.waitForDocumentFontsReady();

            dep.ensureMultiRangeState();
            const baseRef = dep.getBaseTimezoneRef();
            const titles = getMultiRangeTitles(baseRef);
            if (!titles.length) throw new Error("No multi-range title data to render");

            const doc = getDocumentRef();
            const rootStyle = getComputedStyleSafe(doc?.documentElement || null);
            const bodyStyle = getComputedStyleSafe(doc?.body || doc?.documentElement || null);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const accentColor = (rootStyle.getPropertyValue?.("--accent") || "#38bdf8").trim();
            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const titleFont = `700 16px ${monoFont} `;
            const sidePadding = 16;
            const topBottomPadding = 12;
            const rowHeight = 40;
            const rowGap = 8;

            const measureCanvas = doc?.createElement?.("canvas");
            const measureCtx = measureCanvas?.getContext?.("2d");
            let maxTextWidth = 0;
            if (measureCtx) {
                measureCtx.font = titleFont;
                titles.forEach((titleText) => {
                    maxTextWidth = Math.max(maxTextWidth, Math.ceil(measureCtx.measureText(String(titleText || "")).width));
                });
            }

            const sourceWidth = Math.max(640, maxTextWidth + (sidePadding * 2));
            const contentHeight = (titles.length * rowHeight) + (Math.max(0, titles.length - 1) * rowGap);
            const sourceHeight = contentHeight + (topBottomPadding * 2);

            const renderTarget = dep.prepareExportCanvas(sourceWidth, sourceHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            let y = topBottomPadding;
            titles.forEach((titleText, idx) => {
                const rowBg = idx % 2 === 0 ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.08)";
                const resolvedTitle = (String(titleText || "").trim()) || `${translate("default_subgroup_name")} ${idx + 1} `;

                ctx.fillStyle = rowBg;
                ctx.fillRect(0, y, sourceWidth, rowHeight);

                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(0.5, y + 0.5, Math.max(1, sourceWidth - 1), Math.max(1, rowHeight - 1));

                dep.drawExportCellText(ctx, resolvedTitle, 0, y, sourceWidth, rowHeight, {
                    align: "left",
                    color: accentColor,
                    font: titleFont,
                    padX: sidePadding
                });

                y += rowHeight + rowGap;
            });

            return canvas.toDataURL("image/png");
        }

        return Object.freeze({
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl
        });
    }

    globalObj.GTVMultiRangeImageRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
