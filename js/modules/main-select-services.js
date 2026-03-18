(function initGtvMainSelectServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getDocumentRef = (typeof safeDeps.getDocumentRef === "function")
            ? safeDeps.getDocumentRef
            : (() => {
                if (safeDeps.documentRef && typeof safeDeps.documentRef === "object") return safeDeps.documentRef;
                if (typeof document === "object" && document) return document;
                return null;
            });
        const getComputedStyleFn = (typeof safeDeps.getComputedStyle === "function")
            ? safeDeps.getComputedStyle
            : ((typeof getComputedStyle === "function")
                ? getComputedStyle
                : (() => ({
                    fontStyle: "",
                    fontWeight: "",
                    fontSize: "14px",
                    fontFamily: "sans-serif"
                })));
        const ensureBaseTimezoneSelection = (typeof safeDeps.ensureBaseTimezoneSelection === "function")
            ? safeDeps.ensureBaseTimezoneSelection
            : (() => { });
        const getCurrentGroupBaseTimezoneId = (typeof safeDeps.getCurrentGroupBaseTimezoneId === "function")
            ? safeDeps.getCurrentGroupBaseTimezoneId
            : (() => "utc");
        const isCurrentGroupUtcRowVisible = (typeof safeDeps.isCurrentGroupUtcRowVisible === "function")
            ? safeDeps.isCurrentGroupUtcRowVisible
            : (() => true);
        const getCurrentGroupZones = (typeof safeDeps.getCurrentGroupZones === "function")
            ? safeDeps.getCurrentGroupZones
            : (() => []);
        const getZoneAbbreviation = (typeof safeDeps.getZoneAbbreviation === "function")
            ? safeDeps.getZoneAbbreviation
            : (() => "");
        const getZoneDisplayName = (typeof safeDeps.getZoneDisplayName === "function")
            ? safeDeps.getZoneDisplayName
            : (() => "");
        const setCurrentGroupBaseTimezoneId = (typeof safeDeps.setCurrentGroupBaseTimezoneId === "function")
            ? safeDeps.setCurrentGroupBaseTimezoneId
            : (() => false);
        const savePersistence = (typeof safeDeps.savePersistence === "function")
            ? safeDeps.savePersistence
            : (() => { });
        const t = (typeof safeDeps.t === "function")
            ? safeDeps.t
            : ((key) => String(key || ""));

        let measureCanvas = null;

        function adjustSelectWidthForContent(select, minWidth = 0) {
            if (!select) return;

            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.createElement !== "function") return;
            if (!measureCanvas) measureCanvas = documentRef.createElement("canvas");

            const ctx = measureCanvas && typeof measureCanvas.getContext === "function"
                ? measureCanvas.getContext("2d")
                : null;
            if (!ctx) return;

            const computed = getComputedStyleFn(select);
            ctx.font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

            let maxTextWidth = 0;
            const options = Array.from(select.options || []);
            options.forEach((option) => {
                const label = String(option?.textContent || "").trim();
                if (!label) return;
                maxTextWidth = Math.max(maxTextWidth, ctx.measureText(label).width);
            });

            const requiredWidth = Math.ceil(maxTextWidth + 72);
            const currentWidth = parseInt(select.dataset?.minWidth || "", 10);
            const baseMinWidth = Number.isFinite(currentWidth)
                ? currentWidth
                : (parseInt(select.style?.width || "", 10) || minWidth || 0);
            if (!Number.isFinite(currentWidth) && select.dataset) select.dataset.minWidth = String(baseMinWidth);

            if (select.style) {
                select.style.width = `${Math.max(baseMinWidth, requiredWidth)}px`;
            }
        }

        function refreshSelectWidths() {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            adjustSelectWidthForContent(documentRef.getElementById("tz-quick-select"), 118);
            adjustSelectWidthForContent(documentRef.getElementById("base-time-select"), 200);
        }

        function renderBaseTimeSelect() {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            const select = documentRef.getElementById("base-time-select");
            if (!select) return;

            ensureBaseTimezoneSelection();
            const selectedBefore = getCurrentGroupBaseTimezoneId();
            select.textContent = "";

            const includeUtcOption = selectedBefore === "utc" || isCurrentGroupUtcRowVisible();
            if (includeUtcOption && typeof documentRef.createElement === "function") {
                const utcOption = documentRef.createElement("option");
                utcOption.value = "utc";
                utcOption.textContent = `[UTC] ${t("utc_name")}`;
                select.appendChild(utcOption);
            }

            const zones = Array.isArray(getCurrentGroupZones()) ? getCurrentGroupZones() : [];
            zones.forEach((tz) => {
                if (typeof documentRef.createElement !== "function") return;
                const option = documentRef.createElement("option");
                option.value = tz.id;
                option.textContent = `[${getZoneAbbreviation(tz)}] ${getZoneDisplayName(tz)}`;
                select.appendChild(option);
            });

            const options = Array.from(select.options || []);
            const selectedNext = options.some((option) => option.value === selectedBefore)
                ? selectedBefore
                : (options[0]?.value || "utc");
            setCurrentGroupBaseTimezoneId(selectedNext);
            select.value = selectedNext;
            if (selectedNext !== selectedBefore) savePersistence();
            adjustSelectWidthForContent(select, 220);
        }

        return Object.freeze({
            adjustSelectWidthForContent,
            refreshSelectWidths,
            renderBaseTimeSelect
        });
    }

    globalObj.GTVMainSelectServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
