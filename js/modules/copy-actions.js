(function initGtvCopyActions(globalObj) {
    "use strict";

    function createService(deps) {
        function updateCopyFormatPreview() {
            const copyPreviewEl = document.getElementById("copy-format-preview");
            if (!copyPreviewEl) return;

            const setPreview = (el, text) => {
                const resolved = text || "-";
                el.textContent = resolved;
                el.classList.toggle("empty", resolved === "-");
            };

            if (!deps.isShowCopyFormat()) {
                setPreview(copyPreviewEl, "-");
                return;
            }

            if (deps.isMultiTab()) {
                deps.ensureMultiRangeState();
                const firstRange = deps.getMultiRanges()[0];
                const baseRef = deps.getBaseTimezoneRef();
                const snapshot = firstRange
                    ? deps.buildTimezoneComputedSnapshotForRange(baseRef, new Date(firstRange.startUtcMs), new Date(firstRange.endUtcMs))
                    : null;
                setPreview(
                    copyPreviewEl,
                    deps.formatSnapshotText(
                        snapshot,
                        deps.getCopyFormatOrder(),
                        deps.getCopyFormatEnabled(),
                        deps.getCopyTimePartsEnabled()
                    )
                );
                return;
            }

            const baseRef = deps.getBaseTimezoneRef();
            const baseRowId = baseRef?.id || "utc";
            setPreview(
                copyPreviewEl,
                deps.getRowFormattedText(
                    baseRowId,
                    deps.getCopyFormatOrder(),
                    deps.getCopyFormatEnabled(),
                    deps.getCopyTimePartsEnabled()
                )
            );
        }

        async function copyRow(id) {
            const text = deps.getRowCopyText(id);
            if (!text) return;
            try {
                await deps.writeClipboard(text);
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyRow failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllTimezones() {
            if (deps.isMultiTab()) {
                await deps.copyAllMultiRangeTimezones();
                return;
            }

            const lineArr = [...document.querySelectorAll("#clocks-container .time-row")]
                .map((row) => deps.getRowCopyText(String(row.id || "").replace("tz-row-", "")))
                .filter(Boolean);
            if (!lineArr.length) return;

            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllTimezones failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        return Object.freeze({
            updateCopyFormatPreview,
            copyRow,
            copyAllTimezones
        });
    }

    globalObj.GTVCopyActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
