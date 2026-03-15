(function initGtvCopyActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getBooleanDep(name, fallback = false) {
            const value = invokeDep(name);
            if (value === undefined) return !!fallback;
            return !!value;
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function updateCopyFormatPreview() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const copyPreviewEl = doc.getElementById("copy-format-preview");
            if (!copyPreviewEl) return;

            const setPreview = (el, text) => {
                const resolved = text || "-";
                el.textContent = resolved;
                if (el.classList && typeof el.classList.toggle === "function") {
                    el.classList.toggle("empty", resolved === "-");
                }
            };

            if (!getBooleanDep("isShowCopyFormat")) {
                setPreview(copyPreviewEl, "-");
                return;
            }

            if (getBooleanDep("isMultiTab")) {
                invokeDep("ensureMultiRangeState");
                const multiRanges = invokeDep("getMultiRanges");
                const firstRange = Array.isArray(multiRanges) ? multiRanges[0] : null;
                const baseRef = invokeDep("getBaseTimezoneRef");
                const snapshot = firstRange
                    ? invokeDep("buildTimezoneComputedSnapshotForRange", baseRef, new Date(firstRange.startUtcMs), new Date(firstRange.endUtcMs))
                    : null;
                setPreview(
                    copyPreviewEl,
                    invokeDep(
                        "formatSnapshotText",
                        snapshot,
                        invokeDep("getCopyFormatOrder"),
                        invokeDep("getCopyFormatEnabled"),
                        invokeDep("getCopyTimePartsEnabled")
                    )
                );
                return;
            }

            if (getBooleanDep("isFixedTimeTab")) {
                setPreview(copyPreviewEl, invokeDep("getFixedTimePreviewCopyText", ""));
                return;
            }

            const baseRef = invokeDep("getBaseTimezoneRef");
            const baseRowId = baseRef?.id || "utc";
            setPreview(
                copyPreviewEl,
                invokeDep(
                    "getRowFormattedText",
                    baseRowId,
                    invokeDep("getCopyFormatOrder"),
                    invokeDep("getCopyFormatEnabled"),
                    invokeDep("getCopyTimePartsEnabled")
                )
            );
        }

        async function copyRow(id) {
            const text = invokeDep("getRowCopyText", id);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyRow failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllTimezones() {
            const doc = getDocumentRef();
            if (getBooleanDep("isMultiTab")) {
                await invokeDep("copyAllMultiRangeTimezones");
                return;
            }
            if (getBooleanDep("isFixedTimeTab")) {
                const fixedTimeAllText = invokeDep("getAllFixedTimeRowsCopyText", "");
                if (!fixedTimeAllText) return;
                try {
                    await invokeDep("writeClipboard", fixedTimeAllText);
                    invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
                } catch (err) {
                    console.error("copyAllTimezones failed:", err);
                    invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
                }
                return;
            }

            if (!doc || typeof doc.querySelectorAll !== "function") return;
            const lineArr = Array.from(doc.querySelectorAll("#clocks-container .time-row") || [])
                .map((row) => invokeDep("getRowCopyText", String(row?.id || "").replace("tz-row-", "")))
                .filter(Boolean);
            if (!lineArr.length) return;

            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllTimezones failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
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
