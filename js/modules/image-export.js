(function initGtvImageExport(globalObj) {
    "use strict";

    const doc = globalObj?.document || (typeof document !== "undefined" ? document : null);
    const chromeApi = globalObj?.chrome || (typeof chrome !== "undefined" ? chrome : null);

    function callDep(deps, name, fallback, ...args) {
        const fn = deps?.[name];
        if (typeof fn !== "function") return fallback;
        try {
            return fn(...args);
        } catch (_err) {
            return fallback;
        }
    }

    async function callDepAsync(deps, name, fallback, ...args) {
        const fn = deps?.[name];
        if (typeof fn !== "function") return fallback;
        try {
            return await fn(...args);
        } catch (_err) {
            return fallback;
        }
    }

    function triggerAnchorDownload(dataUrl, filename) {
        if (!doc || typeof doc.createElement !== "function" || !doc.body || typeof doc.body.appendChild !== "function") {
            throw new Error("Download is unavailable without DOM support");
        }
        const anchor = doc.createElement("a");
        anchor.href = dataUrl;
        anchor.download = filename;
        doc.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    function downloadDataUrl(dataUrl, filename) {
        return new Promise((resolve, reject) => {
            if (chromeApi?.downloads?.download) {
                chromeApi.downloads.download(
                    { url: dataUrl, filename, saveAs: false },
                    (downloadId) => {
                        if (chromeApi.runtime?.lastError || !downloadId) {
                            try {
                                triggerAnchorDownload(dataUrl, filename);
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
                triggerAnchorDownload(dataUrl, filename);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async function saveMultiRangeTitlesImage(deps) {
        try {
            if (callDep(deps, "isMultiTab", false) !== true) return;
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            callDep(deps, "ensureMultiRangeState", null);
            const dataUrl = await callDepAsync(deps, "renderMultiRangeTitlesToPngDataUrl", "");
            const fileName = callDep(deps, "getMultiRangeTitlesImageFilename", `GlobalTimeViwer_MultiRanges_Titles_${Date.now()}.png`);
            if (!dataUrl) throw new Error("Image render failed");
            await downloadDataUrl(dataUrl, fileName);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save multi-range titles image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeAllImage(deps) {
        try {
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await callDepAsync(deps, "renderMultiRangesToPngDataUrl", "");
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViwer_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save all multi-range images:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeSingleImage(deps, rangeIdx) {
        try {
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await callDepAsync(deps, "renderMultiRangeSingleToPngDataUrl", "", rangeIdx);
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViwer_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save single multi-range image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveTimezoneTableImage(deps) {
        try {
            if (callDep(deps, "isMultiTab", false) === true) {
                await saveMultiRangeAllImage(deps);
                return;
            }

            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const supportsPrimaryRenderer = await callDepAsync(deps, "detectForeignObjectRendererSupport", false);
            let dataUrl = "";
            if (supportsPrimaryRenderer) {
                try {
                    const primaryRenderer = deps?.renderTimezoneTableToPngDataUrl;
                    if (typeof primaryRenderer !== "function") {
                        throw new Error("Primary renderer unavailable");
                    }
                    dataUrl = await primaryRenderer();
                } catch (primaryErr) {
                    if (callDep(deps, "isDomExceptionLike", false, primaryErr)) {
                        callDep(deps, "setCanUseForeignObjectRenderer", null, false);
                    }
                    dataUrl = await callDepAsync(deps, "renderTimezoneTableFallbackDataUrl", "");
                }
            } else {
                dataUrl = await callDepAsync(deps, "renderTimezoneTableFallbackDataUrl", "");
            }
            if (!dataUrl) throw new Error("Image render failed");
            const baseName = callDep(deps, "getTimezoneTableImageFilename", `GlobalTimeViwer_Table_${Date.now()}`);
            const filename = `${baseName}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save timezone table image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    function createService(deps) {
        const boundDeps = (deps && typeof deps === "object") ? deps : {};
        return Object.freeze({
            downloadDataUrl,
            saveMultiRangeTitlesImage: () => saveMultiRangeTitlesImage(boundDeps),
            saveMultiRangeAllImage: () => saveMultiRangeAllImage(boundDeps),
            saveMultiRangeSingleImage: (rangeIdx) => saveMultiRangeSingleImage(boundDeps, rangeIdx),
            saveTimezoneTableImage: () => saveTimezoneTableImage(boundDeps)
        });
    }


    globalObj.GTVImageExport = Object.freeze({
        downloadDataUrl,
        createService,
        saveMultiRangeTitlesImage,
        saveMultiRangeAllImage,
        saveMultiRangeSingleImage,
        saveTimezoneTableImage
    });
})(typeof window !== "undefined" ? window : globalThis);
