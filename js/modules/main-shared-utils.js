(function initGtvMainSharedUtils(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const tableImageExportWidth = Number.isFinite(Number(safeDeps.tableImageExportWidth))
            ? Math.max(1, Math.round(Number(safeDeps.tableImageExportWidth)))
            : 1920;
        const createCanvas = (typeof safeDeps.createCanvas === "function")
            ? safeDeps.createCanvas
            : (() => {
                if (typeof document !== "object" || !document || typeof document.createElement !== "function") {
                    return null;
                }
                return document.createElement("canvas");
            });

        function prepareExportCanvas(sourceWidth, sourceHeight, pageBg) {
            const targetWidth = tableImageExportWidth;
            const renderRatio = targetWidth / Math.max(1, sourceWidth);
            const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

            const canvas = createCanvas();
            if (!canvas) throw new Error("Canvas element unavailable");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context unavailable");

            ctx.scale(renderRatio, renderRatio);
            ctx.fillStyle = pageBg;
            ctx.fillRect(0, 0, sourceWidth, sourceHeight);

            return { canvas, ctx, renderRatio, targetWidth, targetHeight };
        }

        function drawExportCellText(ctx, text, x, y, w, h, options = {}) {
            const {
                align = "left",
                color = "#f1f5f9",
                font = "13px Arial",
                clip = false,
                padX = 8
            } = options;

            ctx.save();
            if (clip) {
                ctx.beginPath();
                ctx.rect(x + 2, y + 1, Math.max(0, w - 4), Math.max(0, h - 2));
                ctx.clip();
            }

            ctx.fillStyle = color;
            ctx.font = font;
            ctx.textBaseline = "middle";

            if (align === "center") {
                ctx.textAlign = "center";
                ctx.fillText(text, x + (w / 2), y + (h / 2));
            } else {
                ctx.textAlign = "left";
                ctx.fillText(text, x + padX, y + (h / 2));
            }
            ctx.restore();
        }

        function parseDateTimeParts(val, inputMode) {
            const normalized = (val || "").trim();
            if (!normalized) return null;

            const patterns = {
                datetime: /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
                date: /^(\d{4})-(\d{2})-(\d{2})$/,
                time: /^(\d{2}):(\d{2}):(\d{2})$/
            };

            const match = normalized.match(patterns[inputMode]);
            if (!match) return null;

            return match.slice(1).map(Number);
        }

        function parseLocalDateTimeToUtcMs(value) {
            const match = (value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (!match) return NaN;
            return Date.UTC(
                Number(match[1]),
                Number(match[2]) - 1,
                Number(match[3]),
                Number(match[4]),
                Number(match[5]),
                Number(match[6])
            );
        }

        function escapeHtml(value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        return Object.freeze({
            prepareExportCanvas,
            drawExportCellText,
            parseDateTimeParts,
            parseLocalDateTimeToUtcMs,
            escapeHtml
        });
    }

    globalObj.GTVMainSharedUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
