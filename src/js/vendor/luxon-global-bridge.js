(function initGtvLuxonGlobalBridge(globalObj) {
    "use strict";

    const hostRef = (globalObj && (typeof globalObj === "object" || typeof globalObj === "function"))
        ? globalObj
        : ((typeof globalThis !== "undefined") ? globalThis : null);
    if (!hostRef) return;

    // Ensure bundling/minification does not drop the global luxon entrypoint.
    const resolvedLuxon = (hostRef.luxon && typeof hostRef.luxon === "object")
        ? hostRef.luxon
        : ((typeof luxon !== "undefined" && luxon) ? luxon : null);

    if (resolvedLuxon && typeof resolvedLuxon === "object") {
        hostRef.luxon = resolvedLuxon;
    }
})(typeof window !== "undefined" ? window : globalThis);
