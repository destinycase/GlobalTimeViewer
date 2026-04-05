(function initGtvMultiRangeCopy(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logError(`[GTVMultiRangeCopy] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            t: toSafeCallable("t", safeDeps.t),
            ensureMultiRangeState: toSafeCallable("ensureMultiRangeState", safeDeps.ensureMultiRangeState),
            getMultiRanges: toSafeCallable("getMultiRanges", safeDeps.getMultiRanges),
            getTimezoneRefById: toSafeCallable("getTimezoneRefById", safeDeps.getTimezoneRefById),
            buildTimezoneComputedSnapshotForRange: toSafeCallable("buildTimezoneComputedSnapshotForRange", safeDeps.buildTimezoneComputedSnapshotForRange),
            formatSnapshotText: toSafeCallable("formatSnapshotText", safeDeps.formatSnapshotText),
            getCopyFormatOrder: toSafeCallable("getCopyFormatOrder", safeDeps.getCopyFormatOrder),
            getCopyFormatEnabled: toSafeCallable("getCopyFormatEnabled", safeDeps.getCopyFormatEnabled),
            getCopyTimePartsEnabled: toSafeCallable("getCopyTimePartsEnabled", safeDeps.getCopyTimePartsEnabled),
            writeClipboard: toSafeCallable("writeClipboard", safeDeps.writeClipboard),
            showToast: toSafeCallable("showToast", safeDeps.showToast),
            getBaseTimezoneRef: toSafeCallable("getBaseTimezoneRef", safeDeps.getBaseTimezoneRef),
            getRenderableTimezoneRows: toSafeCallable("getRenderableTimezoneRows", safeDeps.getRenderableTimezoneRows),
            getMultiRangeTitleText: toSafeCallable("getMultiRangeTitleText", safeDeps.getMultiRangeTitleText)
        });

        function translate(key) {
            const value = dep.t(key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof safeDeps.consoleError === "function") {
                safeDeps.consoleError(...args);
                return;
            }
            if (typeof globalObj?.console?.error === "function") {
                globalObj.console.error(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function getRangesSafe() {
            const ranges = dep.getMultiRanges();
            return Array.isArray(ranges) ? ranges : [];
        }

        async function copyMultiRangeRow(rangeIdx, rowId) {
            dep.ensureMultiRangeState();
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;
            const tz = dep.getTimezoneRefById(rowId);
            if (!tz) return;

            const snapshot = dep.buildTimezoneComputedSnapshotForRange(
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const text = dep.formatSnapshotText(
                snapshot,
                dep.getCopyFormatOrder(),
                dep.getCopyFormatEnabled(),
                dep.getCopyTimePartsEnabled()
            );
            if (!text) return;

            try {
                await dep.writeClipboard(text);
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyMultiRangeRow failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyWholeMultiRange(rangeIdx) {
            dep.ensureMultiRangeState();
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;

            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return;
            const dynamicRowsRaw = dep.getRenderableTimezoneRows(baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [dep.getMultiRangeTitleText(rangeIdx, range, baseRef)];

            rowRefs.forEach((tz) => {
                if (!tz) return;
                const snapshot = dep.buildTimezoneComputedSnapshotForRange(
                    tz,
                    new Date(range.startUtcMs),
                    new Date(range.endUtcMs)
                );
                const line = dep.formatSnapshotText(
                    snapshot,
                    dep.getCopyFormatOrder(),
                    dep.getCopyFormatEnabled(),
                    dep.getCopyTimePartsEnabled()
                );
                if (line) lineArr.push(line);
            });

            if (lineArr.length <= 1) return;
            try {
                await dep.writeClipboard(lineArr.join("\n"));
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyWholeMultiRange failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllMultiRangeTimezones() {
            dep.ensureMultiRangeState();
            const ranges = getRangesSafe();
            const baseRef = dep.getBaseTimezoneRef();
            if (!baseRef) return;
            const dynamicRowsRaw = dep.getRenderableTimezoneRows(baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [];

            ranges.forEach((range, rangeIdx) => {
                lineArr.push(dep.getMultiRangeTitleText(rangeIdx, range, baseRef));
                rowRefs.forEach((tz) => {
                    if (!tz) return;
                    const snapshot = dep.buildTimezoneComputedSnapshotForRange(
                        tz,
                        new Date(range.startUtcMs),
                        new Date(range.endUtcMs)
                    );
                    const line = dep.formatSnapshotText(
                        snapshot,
                        dep.getCopyFormatOrder(),
                        dep.getCopyFormatEnabled(),
                        dep.getCopyTimePartsEnabled()
                    );
                    if (line) lineArr.push(line);
                });
                if (rangeIdx < ranges.length - 1) {
                    lineArr.push("");
                }
            });

            if (!lineArr.length) return;
            try {
                await dep.writeClipboard(lineArr.join("\n"));
                dep.showToast(translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                logError("copyAllMultiRangeTimezones failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
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
