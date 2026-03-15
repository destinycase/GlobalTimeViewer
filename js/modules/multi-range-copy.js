(function initGtvMultiRangeCopy(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getRangesSafe() {
            const ranges = invokeDep("getMultiRanges");
            return Array.isArray(ranges) ? ranges : [];
        }

        async function copyMultiRangeRow(rangeIdx, rowId) {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;
            const tz = invokeDep("getTimezoneRefById", rowId);
            if (!tz) return;

            const snapshot = invokeDep(
                "buildTimezoneComputedSnapshotForRange",
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const text = invokeDep(
                "formatSnapshotText",
                snapshot,
                invokeDep("getCopyFormatOrder"),
                invokeDep("getCopyFormatEnabled"),
                invokeDep("getCopyTimePartsEnabled")
            );
            if (!text) return;

            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyMultiRangeRow failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyWholeMultiRange(rangeIdx) {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const dynamicRowsRaw = invokeDep("getRenderableTimezoneRows", baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [invokeDep("getMultiRangeTitleText", rangeIdx, range, baseRef)];

            rowRefs.forEach((tz) => {
                if (!tz) return;
                const snapshot = invokeDep(
                    "buildTimezoneComputedSnapshotForRange",
                    tz,
                    new Date(range.startUtcMs),
                    new Date(range.endUtcMs)
                );
                const line = invokeDep(
                    "formatSnapshotText",
                    snapshot,
                    invokeDep("getCopyFormatOrder"),
                    invokeDep("getCopyFormatEnabled"),
                    invokeDep("getCopyTimePartsEnabled")
                );
                if (line) lineArr.push(line);
            });

            if (lineArr.length <= 1) return;
            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyWholeMultiRange failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllMultiRangeTimezones() {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const dynamicRowsRaw = invokeDep("getRenderableTimezoneRows", baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [];

            ranges.forEach((range, rangeIdx) => {
                lineArr.push(invokeDep("getMultiRangeTitleText", rangeIdx, range, baseRef));
                rowRefs.forEach((tz) => {
                    if (!tz) return;
                    const snapshot = invokeDep(
                        "buildTimezoneComputedSnapshotForRange",
                        tz,
                        new Date(range.startUtcMs),
                        new Date(range.endUtcMs)
                    );
                    const line = invokeDep(
                        "formatSnapshotText",
                        snapshot,
                        invokeDep("getCopyFormatOrder"),
                        invokeDep("getCopyFormatEnabled"),
                        invokeDep("getCopyTimePartsEnabled")
                    );
                    if (line) lineArr.push(line);
                });
                if (rangeIdx < ranges.length - 1) {
                    lineArr.push("");
                }
            });

            if (!lineArr.length) return;
            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllMultiRangeTimezones failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        return Object.freeze({
            copyMultiRangeRow,
            copyWholeMultiRange,
            copyAllMultiRangeTimezones
        });
    }

    globalObj.GTVMultiRangeCopy = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
