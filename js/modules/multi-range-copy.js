(function initGtvMultiRangeCopy(globalObj) {
    "use strict";

    function createService(deps) {
        async function copyMultiRangeRow(rangeIdx, rowId) {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const range = ranges[rangeIdx];
            if (!range) return;
            const tz = deps.getTimezoneRefById(rowId);
            if (!tz) return;

            const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const text = deps.formatSnapshotText(
                snapshot,
                deps.getCopyFormatOrder(),
                deps.getCopyFormatEnabled(),
                deps.getCopyTimePartsEnabled()
            );
            if (!text) return;

            try {
                await deps.writeClipboard(text);
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyMultiRangeRow failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyWholeMultiRange(rangeIdx) {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const range = ranges[rangeIdx];
            if (!range) return;

            const baseRef = deps.getBaseTimezoneRef();
            const dynamicRows = deps.getRenderableTimezoneRows(baseRef);
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [deps.getMultiRangeTitleText(rangeIdx, range, baseRef)];

            rowRefs.forEach((tz) => {
                const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                    tz,
                    new Date(range.startUtcMs),
                    new Date(range.endUtcMs)
                );
                const line = deps.formatSnapshotText(
                    snapshot,
                    deps.getCopyFormatOrder(),
                    deps.getCopyFormatEnabled(),
                    deps.getCopyTimePartsEnabled()
                );
                if (line) lineArr.push(line);
            });

            if (lineArr.length <= 1) return;
            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyWholeMultiRange failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllMultiRangeTimezones() {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const baseRef = deps.getBaseTimezoneRef();
            const dynamicRows = deps.getRenderableTimezoneRows(baseRef);
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [];

            ranges.forEach((range, rangeIdx) => {
                lineArr.push(deps.getMultiRangeTitleText(rangeIdx, range, baseRef));
                rowRefs.forEach((tz) => {
                    const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                        tz,
                        new Date(range.startUtcMs),
                        new Date(range.endUtcMs)
                    );
                    const line = deps.formatSnapshotText(
                        snapshot,
                        deps.getCopyFormatOrder(),
                        deps.getCopyFormatEnabled(),
                        deps.getCopyTimePartsEnabled()
                    );
                    if (line) lineArr.push(line);
                });
                if (rangeIdx < ranges.length - 1) {
                    lineArr.push("");
                }
            });

            if (!lineArr.length) return;
            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllMultiRangeTimezones failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
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
