(function initGtvCopyActions(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected.getElementById === "function") return injected;
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef.getElementById === "function") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document.getElementById === "function") {
                return globalObj.document;
            }
            return (typeof document === "object" && document) ? document : null;
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

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logError(`[GTVCopyActions] Dependency "${depName}" threw.`, err);
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
                "t",
                "isShowCopyFormat",
                "isMultiTab",
                "ensureMultiRangeState",
                "getMultiRanges",
                "getBaseTimezoneRef",
                "buildTimezoneComputedSnapshotForRange",
                "formatSnapshotText",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "isFixedTimeTab",
                "getFixedTimePreviewCopyText",
                "getRowFormattedText",
                "getRowCopyText",
                "writeClipboard",
                "showToast",
                "copyAllMultiRangeTimezones",
                "getAllFixedTimeRowsCopyText"
            ])
        });

        function getBooleanValue(getter, fallback = false) {
            const value = getter();
            if (value === undefined) return !!fallback;
            return !!value;
        }

        function translate(key) {
            const value = dep.t(key);
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

            if (!getBooleanValue(dep.isShowCopyFormat)) {
                setPreview(copyPreviewEl, "-");
                return;
            }

            if (getBooleanValue(dep.isMultiTab)) {
                dep.ensureMultiRangeState();
                const multiRanges = dep.getMultiRanges();
                const firstRange = Array.isArray(multiRanges) ? multiRanges[0] : null;
                const baseRef = dep.getBaseTimezoneRef();
                const snapshot = firstRange
                    ? dep.buildTimezoneComputedSnapshotForRange(baseRef, new Date(firstRange.startUtcMs), new Date(firstRange.endUtcMs))
                    : null;
                setPreview(
                    copyPreviewEl,
                    dep.formatSnapshotText(
                        snapshot,
                        dep.getCopyFormatOrder(),
                        dep.getCopyFormatEnabled(),
                        dep.getCopyTimePartsEnabled()
                    )
                );
                return;
            }

            if (getBooleanValue(dep.isFixedTimeTab)) {
                setPreview(copyPreviewEl, dep.getFixedTimePreviewCopyText(""));
                return;
            }

            const baseRef = dep.getBaseTimezoneRef();
            const baseRowId = baseRef?.id || "utc";
            setPreview(
                copyPreviewEl,
                dep.getRowFormattedText(
                    baseRowId,
                    dep.getCopyFormatOrder(),
                    dep.getCopyFormatEnabled(),
                    dep.getCopyTimePartsEnabled()
                )
            );
        }

        async function copyRow(id) {
            const text = dep.getRowCopyText(id);
            if (!text) return;
            try {
                await dep.writeClipboard(text);
                dep.showToast(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyRow failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllTimezones() {
            const doc = getDocumentRef();
            if (getBooleanValue(dep.isMultiTab)) {
                await dep.copyAllMultiRangeTimezones();
                return;
            }
            if (getBooleanValue(dep.isFixedTimeTab)) {
                const fixedTimeAllText = dep.getAllFixedTimeRowsCopyText("");
                if (!fixedTimeAllText) return;
                try {
                    await dep.writeClipboard(fixedTimeAllText);
                    dep.showToast(translate("toast_copy_all_success"), { type: "success" });
                } catch (err) {
                    logError("copyAllTimezones failed:", err);
                    dep.showToast(translate("toast_copy_failed"), { type: "error" });
                }
                return;
            }

            if (!doc || typeof doc.querySelectorAll !== "function") return;
            const lineArr = Array.from(doc.querySelectorAll("#clocks-container .time-row") || [])
                .map((row) => dep.getRowCopyText(String(row?.id || "").replace("tz-row-", "")))
                .filter(Boolean);
            if (!lineArr.length) return;

            try {
                await dep.writeClipboard(lineArr.join("\n"));
                dep.showToast(translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                logError("copyAllTimezones failed:", err);
                dep.showToast(translate("toast_copy_failed"), { type: "error" });
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
