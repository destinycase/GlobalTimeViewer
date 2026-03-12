(function initGtvImageExport(globalObj) {
    "use strict";

    function downloadDataUrl(dataUrl, filename) {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== "undefined" && chrome.downloads?.download) {
                chrome.downloads.download(
                    { url: dataUrl, filename, saveAs: false },
                    (downloadId) => {
                        if (chrome.runtime?.lastError || !downloadId) {
                            try {
                                const anchor = document.createElement("a");
                                anchor.href = dataUrl;
                                anchor.download = filename;
                                document.body.appendChild(anchor);
                                anchor.click();
                                anchor.remove();
                                resolve();
                            } catch (fallbackErr) {
                                reject(fallbackErr);
                            }
                            return;
                        }
                        resolve();
                    }
                );
                return;
            }

            try {
                const anchor = document.createElement("a");
                anchor.href = dataUrl;
                anchor.download = filename;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async function saveMultiRangeTitlesImage(deps) {
        try {
            if (!deps.isMultiTab()) return;
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            deps.ensureMultiRangeState();
            const dataUrl = await deps.renderMultiRangeTitlesToPngDataUrl();
            await downloadDataUrl(dataUrl, deps.getMultiRangeTitlesImageFilename());
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save multi-range titles image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveMultiRangeAllImage(deps) {
        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const dataUrl = await deps.renderMultiRangesToPngDataUrl();
            const filename = `GlobalTime_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save all multi-range images:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveMultiRangeSingleImage(deps, rangeIdx) {
        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const dataUrl = await deps.renderMultiRangeSingleToPngDataUrl(rangeIdx);
            const filename = `GlobalTime_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save single multi-range image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveTimezoneTableImage(deps) {
        if (deps.isMultiTab()) {
            await saveMultiRangeAllImage(deps);
            return;
        }

        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const supportsPrimaryRenderer = await deps.detectForeignObjectRendererSupport();
            const wantsTimelineCapture = (typeof deps.isTimelineVisible === "function") ? deps.isTimelineVisible() : false;
            let dataUrl = "";
            if (supportsPrimaryRenderer || wantsTimelineCapture) {
                try {
                    dataUrl = await deps.renderTimezoneTableToPngDataUrl();
                } catch (primaryErr) {
                    if (deps.isDomExceptionLike(primaryErr)) {
                        deps.setCanUseForeignObjectRenderer(false);
                    }
                    dataUrl = await deps.renderTimezoneTableFallbackDataUrl();
                }
            } else {
                dataUrl = await deps.renderTimezoneTableFallbackDataUrl();
            }
            const filename = `${deps.getTimezoneTableImageFilename()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save timezone table image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }


    globalObj.GTVImageExport = Object.freeze({
        downloadDataUrl,
        saveMultiRangeTitlesImage,
        saveMultiRangeAllImage,
        saveMultiRangeSingleImage,
        saveTimezoneTableImage
    });
})(typeof window !== "undefined" ? window : globalThis);
