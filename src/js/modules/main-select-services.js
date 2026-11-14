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

        function renderBaseTimeSelect() {
            const documentRef = getDocumentRef();
            if (!documentRef || typeof documentRef.getElementById !== "function") return;
            // The base timezone is chosen in the Add Timezone popup's group list; without the old
            // select element only the selection check runs.
            ensureBaseTimezoneSelection();
            const select = documentRef.getElementById("base-time-select");
            if (!select) return;

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
        }

        return Object.freeze({
            renderBaseTimeSelect
        });
    }

    globalObj.GTVMainSelectServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
