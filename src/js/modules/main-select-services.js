(function initGtvMainSelectServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const ensureBaseTimezoneSelection = (typeof safeDeps.ensureBaseTimezoneSelection === "function")
            ? safeDeps.ensureBaseTimezoneSelection
            : (() => { });

        // The base timezone is the top row of the Manage Timezones popup's group list; there is
        // no base select element any more. Callers keep this name for "make sure the group's base
        // timezone is valid" after group, zone or tab changes.
        function renderBaseTimeSelect() {
            ensureBaseTimezoneSelection();
        }

        return Object.freeze({
            renderBaseTimeSelect
        });
    }

    globalObj.GTVMainSelectServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
