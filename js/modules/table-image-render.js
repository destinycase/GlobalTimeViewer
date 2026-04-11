(function initGtvTableImageRender(globalObj) {
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
                    logWarn(`[GTVTableImageRender] Dependency "${depName}" threw.`, err);
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
                    logWarn(`[GTVTableImageRender] Dependency "${depName}" threw.`, err);
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

        function pickSafeAsyncCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeAsyncCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

        const dep = Object.freeze({
            ...pickSafeCallables([
                "isFixedTimeTab",
                "prepareExportCanvas",
                "drawExportCellText",
                "cloneTableForImageExport"
            ]),
            ...pickSafeAsyncCallables([
                "waitForDocumentFontsReady"
            ])
        });

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

        function stripDstSuffix(value) {
            return String(value || "").replace(/\s*\[DST\]\s*$/i, "").trim();
        }

        function extractTableCellText(cell) {
            if (!cell) return "";
            const timeInput = cell.querySelector?.(".time-input");
            const exportTimeText = cell.querySelector?.(".export-time-text");
            if (timeInput) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayBadge = cell.querySelector?.(".day-badge");
                const timeText = (timeInput.value || "").trim();
                const dayText = (dayBadge?.textContent || "").trim();
                return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
            }
            if (exportTimeText) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayBadge = cell.querySelector?.(".day-badge");
                const timeText = (exportTimeText.textContent || "").trim();
                const dayText = (dayBadge?.textContent || "").trim();
                return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
            }

            const zoneCode = (cell.querySelector?.(".zone-code")?.textContent || "").trim();
            if (zoneCode) return zoneCode;
            const zoneName = (cell.querySelector?.(".zone-name")?.textContent || "").trim();
            if (zoneName) return stripDstSuffix(zoneName);
            const offsetText = (cell.querySelector?.(".offset-text")?.textContent || "").trim();
            if (offsetText) return offsetText;
            const periodDays = (cell.querySelector?.(".period-days-text")?.textContent || "").trim();
            if (periodDays && periodDays !== "-") return periodDays;
            const periodTime = (cell.querySelector?.(".period-time-text")?.textContent || "").trim();
            if (periodTime && periodTime !== "-") return periodTime;
            const clockNode = cell.querySelector?.(".fixed-time-clock");
            const fixedTimeClock = (clockNode?.value || clockNode?.textContent || "").trim();
            if (fixedTimeClock) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayText = (cell.querySelector?.(".day-badge")?.textContent || "").trim();
                return [dnText, fixedTimeClock, dayText].filter(Boolean).join(" ").trim();
            }
            const buttonText = (cell.querySelector?.("button")?.textContent || "").trim();
            if (buttonText) return buttonText;
            return (cell.textContent || "").trim();
        }

        function extractTableHeaderText(cell) {
            if (!cell) return "";
            const fixedTitle = (cell.querySelector?.(".fixed-time-slot-title")?.textContent || "").trim();
            if (fixedTitle) return fixedTitle;
            return (cell.textContent || "").trim();
        }

        function getActiveTableExportContext() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") {
                return {
                    table: null,
                    headerSelector: "#table-head th",
                    rowSelector: "#clocks-container tr.time-row"
                };
            }
            if (dep.isFixedTimeTab()) {
                const section = doc.getElementById("fixed-time-section");
                const table = section ? section.querySelector?.(".data-table") : null;
                return {
                    table,
                    headerSelector: "#fixed-time-table-head th",
                    rowSelector: "#fixed-time-body tr.time-row"
                };
            }
            const section = doc.getElementById("timezone-section");
            const table = section ? section.querySelector?.(".data-table") : null;
            return {
                table,
                headerSelector: "#table-head th",
                rowSelector: "#clocks-container tr.time-row"
            };
        }

        async function renderTimezoneTableFallbackDataUrl() {
            await dep.waitForDocumentFontsReady();

            const doc = getDocumentRef();
            const context = getActiveTableExportContext();
            const table = context.table;
            if (!doc || !table || typeof table.querySelectorAll !== "function") {
                throw new Error("Table element not found");
            }

            const headerCells = Array.from(table.querySelectorAll(context.headerSelector) || [])
                .filter((th) => !th.classList?.contains("export-exclude") && !th.classList?.contains("move-col"));
            const bodyRows = Array.from(table.querySelectorAll(context.rowSelector) || []);
            if (!headerCells.length || !bodyRows.length) {
                throw new Error("No table data to render");
            }

            const colCount = headerCells.length;
            const measuredColWidths = headerCells.map((th) => {
                const w = Math.ceil(th.getBoundingClientRect?.().width || 0);
                return Math.max(w, 70);
            });
            const tableWidth = measuredColWidths.reduce((acc, w) => acc + w, 0);
            const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect?.().height || 0) || 40);
            const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect?.().height || 0) || 40));
            const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);
            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body || doc.documentElement);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";

            const renderTarget = dep.prepareExportCanvas(tableWidth, tableHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            const headBg = (rootStyle.getPropertyValue?.("--table-head-bg") || "#1e293b").trim();
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const textColor = (rootStyle.getPropertyValue?.("--text") || "#f1f5f9").trim();
            const dimColor = (rootStyle.getPropertyValue?.("--text-dim") || "#94a3b8").trim();
            const rowBgA = "rgba(255,255,255,0.02)";
            const rowBgB = "rgba(255,255,255,0.04)";

            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const exportBodyFont = `13px ${monoFont} `;
            const exportHeaderFont = `600 13px ${monoFont} `;

            const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
                dep.drawExportCellText(ctx, text, x, y, w, h, { align, color, font });
            };

            const isCenterHeader = () => true;
            const isCenterBodyCell = (cell) => {
                if (!cell) return false;
                if (
                    cell.classList?.contains("move-cell") ||
                    cell.classList?.contains("timezone-cell") ||
                    cell.classList?.contains("fixed-time-time") ||
                    cell.classList?.contains("period-days-cell") ||
                    cell.classList?.contains("period-time-cell")
                ) {
                    return true;
                }
                return !!cell.querySelector?.(".offset-text");
            };

            let y = 0;
            ctx.fillStyle = headBg;
            ctx.fillRect(0, y, tableWidth, headerHeight);
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y + headerHeight - 0.5);
            ctx.lineTo(tableWidth, y + headerHeight - 0.5);
            ctx.stroke();

            let x = 0;
            for (let c = 0; c < colCount; c++) {
                const w = measuredColWidths[c];
                const headText = extractTableHeaderText(headerCells[c]);
                drawCellText(headText, x, y, w, headerHeight, isCenterHeader(c) ? "center" : "left", dimColor, exportHeaderFont);
                if (c < colCount - 1) {
                    ctx.beginPath();
                    ctx.moveTo(x + w - 0.5, y);
                    ctx.lineTo(x + w - 0.5, tableHeight);
                    ctx.stroke();
                }
                x += w;
            }

            y += headerHeight;
            bodyRows.forEach((row, rowIdx) => {
                const h = rowHeights[rowIdx];
                ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
                ctx.fillRect(0, y, tableWidth, h);
                ctx.beginPath();
                ctx.moveTo(0, y + h - 0.5);
                ctx.lineTo(tableWidth, y + h - 0.5);
                ctx.stroke();

                let rowX = 0;
                const cells = Array.from(row.children || [])
                    .filter((td) => !td.classList?.contains("export-exclude") && !td.classList?.contains("move-cell"));
                for (let c = 0; c < colCount; c++) {
                    const w = measuredColWidths[c];
                    const cell = cells[c];
                    const text = extractTableCellText(cell);
                    const center = isCenterBodyCell(cell);
                    drawCellText(text, rowX, y, w, h, center ? "center" : "left", textColor, exportBodyFont);
                    rowX += w;
                }
                y += h;
            });

            return canvas.toDataURL("image/png");
        }

        async function renderTimezoneTableToPngDataUrl() {
            const context = getActiveTableExportContext();
            const tableEl = context.table;
            if (!tableEl) throw new Error("Timezone table not found");

            const cloned = dep.cloneTableForImageExport(tableEl);
            const renderer = safeDeps.renderElementWithForeignObjectToPngDataUrl;
            if (typeof renderer !== "function") {
                throw new Error("Primary renderer unavailable");
            }
            return renderer(cloned || tableEl);
        }

        return Object.freeze({
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl
        });
    }

    globalObj.GTVTableImageRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
