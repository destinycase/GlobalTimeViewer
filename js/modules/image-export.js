(function initGtvImageExport(globalObj) {
    "use strict";

    function resolveDocumentRef(deps = null) {
        if (deps?.document && typeof deps.document.createElement === "function") {
            return deps.document;
        }
        if (globalObj?.document && typeof globalObj.document.createElement === "function") {
            return globalObj.document;
        }
        if (typeof document !== "undefined" && document && typeof document.createElement === "function") {
            return document;
        }
        return null;
    }

    function resolveChromeApi(deps = null) {
        if (deps?.chrome && typeof deps.chrome === "object") {
            return deps.chrome;
        }
        if (globalObj?.chrome && typeof globalObj.chrome === "object") {
            return globalObj.chrome;
        }
        if (typeof chrome !== "undefined" && chrome && typeof chrome === "object") {
            return chrome;
        }
        return null;
    }

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

    function triggerAnchorDownload(dataUrl, filename, deps = null) {
        const doc = resolveDocumentRef(deps);
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

    function downloadDataUrl(dataUrl, filename, deps = null) {
        return new Promise((resolve, reject) => {
            const chromeApi = resolveChromeApi(deps);
            if (chromeApi?.downloads?.download) {
                chromeApi.downloads.download(
                    { url: dataUrl, filename, saveAs: false },
                    (downloadId) => {
                        if (chromeApi.runtime?.lastError || !downloadId) {
                            try {
                                triggerAnchorDownload(dataUrl, filename, deps);
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
                triggerAnchorDownload(dataUrl, filename, deps);
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
            const fileName = callDep(deps, "getMultiRangeTitlesImageFilename", `GlobalTimeViewer_MultiRanges_Titles_${Date.now()}.png`);
            if (!dataUrl) throw new Error("Image render failed");
            await downloadDataUrl(dataUrl, fileName, deps);
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
            const filename = `GlobalTimeViewer_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
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
            const filename = `GlobalTimeViewer_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
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
            const baseName = callDep(deps, "getTimezoneTableImageFilename", `GlobalTimeViewer_Table_${Date.now()}`);
            const filename = `${baseName}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
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
