(function initGtvImageForeignRender(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TABLE_IMAGE_EXPORT_WIDTH = Number.isFinite(Number(safeDeps.TABLE_IMAGE_EXPORT_WIDTH))
            ? Number(safeDeps.TABLE_IMAGE_EXPORT_WIDTH)
            : 1600;

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
                    logWarn(`[GTVImageForeignRender] Dependency "${depName}" threw.`, err);
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
                "getCanUseForeignObjectRenderer",
                "setCanUseForeignObjectRenderer"
            ])
        });

        function getCachedForeignObjectRendererSupport() {
            return dep.getCanUseForeignObjectRenderer();
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
            if (!target) return { getPropertyValue: () => "", backgroundColor: "" };
            if (typeof globalObj.getComputedStyle === "function") {
                return globalObj.getComputedStyle(target);
            }
            if (typeof getComputedStyle === "function") {
                return getComputedStyle(target);
            }
            return { getPropertyValue: () => "", backgroundColor: "" };
        }

        function getCanUseForeignObjectRenderer() {
            const value = getCachedForeignObjectRendererSupport();
            return typeof value === "boolean" ? value : null;
        }

        function setCanUseForeignObjectRenderer(value) {
            dep.setCanUseForeignObjectRenderer(!!value);
        }

        function collectDocumentCssText() {
            const doc = getDocumentRef();
            if (!doc) return "";

            let cssText = "";
            const styleSheets = Array.isArray(doc.styleSheets) ? doc.styleSheets : Array.from(doc.styleSheets || []);
            for (const styleSheet of styleSheets) {
                try {
                    if (styleSheet?.cssRules) {
                        const rules = Array.isArray(styleSheet.cssRules)
                            ? styleSheet.cssRules
                            : Array.from(styleSheet.cssRules);
                        for (const rule of rules) {
                            cssText += `${rule.cssText}\n`;
                        }
                    }
                } catch (_err) {
                    // 접근할 수 없는 스타일시트 규칙은 무시한다.
                }
            }

            const internalStyles = doc.querySelectorAll?.("style") || [];
            Array.from(internalStyles).forEach((styleEl) => {
                const text = styleEl?.innerText || "";
                if (text && !cssText.includes(text.substring(0, 50))) {
                    cssText += `\n${text}\n`;
                }
            });

            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body);
            const themeVars = [
                "--panel-bg", "--panel-bg-alt", "--border", "--text", "--text-dim",
                "--accent", "--accent-hover", "--table-head-bg", "--timeline-label-w",
                "--timeline-box-w", "--timeline-box-h", "--ui-scale"
            ];

            let injectedVars = ":root {\n";
            themeVars.forEach((v) => {
                const val = (rootStyle.getPropertyValue?.(v) || "").trim();
                if (val) injectedVars += `  ${v}: ${val} !important;\n`;
            });
            if (!(rootStyle.getPropertyValue?.("--timeline-label-w") || "").trim()) {
                injectedVars += "  --timeline-label-w: 150px;\n";
            }
            if (!(rootStyle.getPropertyValue?.("--timeline-box-h") || "").trim()) {
                injectedVars += "  --timeline-box-h: 28px;\n";
            }
            injectedVars += `  background-color: ${bodyStyle.backgroundColor || "#0f172a"} !important;\n`;
            injectedVars += "}\n";

            cssText = injectedVars + cssText;
            cssText = cssText.replace(/@font-face\s*{[\s\S]*?}/gi, "");
            cssText = cssText.replace(/@import\s+[^;]+;/gi, "");
            cssText = cssText.replace(/url\s*\([\s\S]*?\)/gi, "none");
            cssText += "\n* { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif !important; }\n";
            return cssText;
        }

        function loadImageElement(src) {
            const ImageCtor = globalObj.Image || (typeof Image !== "undefined" ? Image : null);
            if (typeof ImageCtor !== "function") {
                return Promise.reject(new Error("Image constructor unavailable"));
            }
            return new Promise((resolve, reject) => {
                const img = new ImageCtor();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Image load error"));
                img.src = src;
            });
        }

        async function waitForDocumentFontsReady() {
            const doc = getDocumentRef();
            if (!doc?.fonts?.ready) return;
            try {
                await doc.fonts.ready;
            } catch (_) {
                // 폰트 준비 실패 시에도 대체 렌더링으로 계속 진행한다.
            }
        }

        function isDomExceptionLike(err) {
            if (!err) return false;
            const DomExceptionCtor = globalObj.DOMException || (typeof DOMException !== "undefined" ? DOMException : null);
            if (typeof DomExceptionCtor === "function" && err instanceof DomExceptionCtor) return true;
            const name = typeof err.name === "string" ? err.name : "";
            return name === "SecurityError" || name === "InvalidStateError";
        }

        async function detectForeignObjectRendererSupport() {
            const cached = getCanUseForeignObjectRenderer();
            if (typeof cached === "boolean") return cached;

            const URLCtor = globalObj.URL || (typeof URL !== "undefined" ? URL : null);
            if (!URLCtor || typeof URLCtor.createObjectURL !== "function") {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const doc = getDocumentRef();
            if (!doc?.createElement) {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const probeSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="width:4px;height:4px;background:#000;"></div>
                    </foreignObject>
                </svg>
            `;
            const BlobCtor = globalObj.Blob || (typeof Blob !== "undefined" ? Blob : null);
            if (typeof BlobCtor !== "function") {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const probeBlob = new BlobCtor([probeSvg], { type: "image/svg+xml;charset=utf-8" });
            const probeUrl = URLCtor.createObjectURL(probeBlob);
            try {
                const img = await loadImageElement(probeUrl);
                const canvas = doc.createElement("canvas");
                canvas.width = 4;
                canvas.height = 4;
                const ctx = canvas.getContext?.("2d");
                if (!ctx) {
                    setCanUseForeignObjectRenderer(false);
                    return false;
                }
                ctx.drawImage(img, 0, 0, 4, 4);
                canvas.toDataURL("image/png");
                setCanUseForeignObjectRenderer(true);
                return true;
            } catch (_err) {
                setCanUseForeignObjectRenderer(false);
                return false;
            } finally {
                URLCtor.revokeObjectURL?.(probeUrl);
            }
        }

        async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
            const doc = getDocumentRef();
            if (!doc?.createElement) throw new Error("DOM unavailable");
            if (!renderElement) throw new Error("Render element not found");

            const measureHost = doc.createElement("div");
            measureHost.style.cssText = "position:fixed; left:-99999px; top:0; width:max-content; min-width:1400px; height:auto; visibility:hidden; pointer-events:none; display:block !important;";
            const measureClone = renderElement.cloneNode(true);
            measureClone.classList?.remove?.("collapsed");

            if (measureClone.classList?.contains("multi-ranges-container") || measureClone.querySelector?.(".multi-range-block")) {
                measureClone.style.display = "flex";
                measureClone.style.flexDirection = "column";
                measureClone.style.alignItems = "center";
                measureClone.style.gap = "40px";
                measureClone.style.width = "1400px";
            }

            measureHost.appendChild(measureClone);
            doc.body?.appendChild?.(measureHost);

            const width = Math.ceil(measureClone.scrollWidth || 1400);
            const height = Math.ceil(measureClone.scrollHeight || 600);
            measureHost.remove?.();

            const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
            const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

            const serializer = new XMLSerializer();
            const markup = serializer.serializeToString(renderElement);
            const cssText = collectDocumentCssText();

            const dayBox = doc.querySelector?.(".timeline-hour-box.day");
            const liveDayBg = dayBox ? getComputedStyleSafe(dayBox).backgroundColor : "#caeefb";
            const liveNightBg = "#616161";
            const liveBorder = dayBox ? getComputedStyleSafe(dayBox).borderTopColor : "#8795aa";
            const liveText = getComputedStyleSafe(doc.body).color || "#f8fafc";
            const liveBg = getComputedStyleSafe(doc.body).backgroundColor || "#0f172a";

            const extraCss = `
                :root {
                    --text: ${liveText} !important;
                    --panel-bg: ${liveBg} !important;
                }
                body {
                    background-color: ${liveBg} !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                }
                .timezone-export-wrapper, .multi-ranges-container {
                    width: ${width}px !important;
                    min-height: ${height}px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: 40px !important;
                    padding: 60px 80px !important;
                    box-sizing: border-box !important;
                    background-color: ${liveBg} !important;
                    color: ${liveText} !important;
                    overflow: visible !important;
                }
                .multi-ranges-container {
                    flex-direction: column !important;
                    align-items: center !important;
                }
                .multi-range-block {
                    width: 100% !important;
                    max-width: 1400px !important;
                    margin-bottom: 20px !important;
                    background-color: transparent !important;
                }
                .timeline-panels.dual {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 30px !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                }
                .timeline-frame .time-adjust-row,
                .timeline-frame .time-adjust-set-container {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    gap: 25px !important;
                }
                .timeline-axis-row, .timeline-timezone-row {
                    display: grid !important;
                    grid-template-columns: var(--timeline-label-w, 150px) 1fr !important;
                    width: 100% !important;
                    height: var(--timeline-box-h, 28px) !important;
                    margin-bottom: 2px !important;
                    color: ${liveText} !important;
                }
                .timeline-label {
                    display: flex !important;
                    align-items: center !important;
                    padding-right: 20px !important;
                    font-size: 13px !important;
                    color: ${liveText} !important;
                }
                .timeline-box-row {
                    display: flex !important;
                    width: 100% !important;
                    height: 100% !important;
                    border: 0.5px solid ${liveBorder} !important;
                }
                .timeline-hour-box {
                    flex: 1 !important;
                    height: 100% !important;
                    border-right: 0.5px solid ${liveBorder} !important;
                }
                .timeline-hour-box.day { background-color: ${liveDayBg} !important; }
                .timeline-hour-box.night { background-color: ${liveNightBg} !important; }
                .calendar-btn { display: none !important; }
                .timeline-indicator {
                    position: absolute !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    background-color: #ef4444 !important;
                    width: 2px !important;
                    z-index: 10 !important;
                }
                .multi-range-title {
                    font-size: 22px !important;
                    margin-bottom: 20px !important;
                    color: ${liveText} !important;
                }
                .data-table { border-collapse: collapse !important; width: 100% !important; color: ${liveText} !important; }
                .data-table th, .data-table td { border: 1px solid var(--border) !important; padding: 12px !important; color: ${liveText} !important; }
                .zone-code, .zone-name, .offset-text, .period-days-text, .period-time-text { color: ${liveText} !important; }
                * { box-sizing: border-box !important; }
            `;

            let safeCssText = `${cssText}\n${extraCss}`
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/<\/style>/gi, "<\\/style>")
                .replace(/url\s*\(/gi, "none(");

            const tempDiv = doc.createElement("div");
            tempDiv.insertAdjacentHTML?.("beforeend", markup);

            const riskyTags = ["script", "iframe", "object", "embed", "link", "meta", "image", "img"];
            riskyTags.forEach((tag) => {
                Array.from(tempDiv.querySelectorAll?.(tag) || []).forEach((el) => el.remove?.());
            });

            const showElementFilter = (typeof NodeFilter !== "undefined" && Number.isFinite(NodeFilter.SHOW_ELEMENT))
                ? NodeFilter.SHOW_ELEMENT
                : 1;
            const walker = doc.createTreeWalker?.(tempDiv, showElementFilter);
            const SAFE_ATTRS = new Set([
                "id", "class", "style", "colspan", "rowspan", "width", "height", "xmlns",
                "viewbox", "x", "y", "rx", "ry", "cx", "cy", "r", "d", "fill", "stroke",
                "stroke-width", "points", "transform", "preserveaspectratio", "opacity"
            ]);

            if (walker) {
                let curr = walker.nextNode();
                while (curr) {
                    if (curr.nodeType === 1) {
                        const attrs = Array.from(curr.attributes || []);
                        for (const attr of attrs) {
                            if (!SAFE_ATTRS.has(String(attr.name || "").toLowerCase())) {
                                curr.removeAttribute?.(attr.name);
                            }
                        }
                        const style = curr.getAttribute?.("style");
                        if (style && style.toLowerCase().includes("url")) {
                            curr.setAttribute?.("style", style.replace(/url\s*\(/gi, "none("));
                        }
                    }
                    curr = walker.nextNode();
                }
            }

            const svgMarkup = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            <style>/* <![CDATA[ */\n${safeCssText}\n/* ]]> */</style>
                            ${tempDiv.innerHTML}
                        </div>
                    </foreignObject>
                </svg>
            `;

            const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);

            await waitForDocumentFontsReady();
            const img = await loadImageElement(svgDataUrl);
            const canvas = doc.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext?.("2d");
            if (!ctx) throw new Error("Canvas context unavailable");

            ctx.fillStyle = getComputedStyleSafe(doc.body).backgroundColor || "#0f172a";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            try {
                ctx.getImageData(0, 0, 1, 1);
            } catch (taintErr) {
                throw taintErr;
            }

            return canvas.toDataURL("image/png");
        }

        return Object.freeze({
            collectDocumentCssText,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            renderElementWithForeignObjectToPngDataUrl
        });
    }

    globalObj.GTVImageForeignRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
