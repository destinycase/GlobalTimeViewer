(function initGtvImageExport(globalObj) {
    "use strict";

    function resolveDocumentRef(deps = null) {
        if (deps?.documentRef && typeof deps.documentRef.createElement === "function") {
            return deps.documentRef;
        }
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
        if (deps?.chromeRef && typeof deps.chromeRef === "object") {
            return deps.chromeRef;
        }
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

    function logError(deps, ...args) {
        if (typeof deps?.logError === "function") {
            deps.logError(...args);
            return;
        }
        if (typeof deps?.consoleError === "function") {
            deps.consoleError(...args);
            return;
        }
        if (typeof globalObj?.console?.error === "function") {
            globalObj.console.error(...args);
            return;
        }
        if (typeof console?.error === "function") {
            console.error(...args);
        }
    }

    function createDepFacade(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logError(safeDeps, `[GTVImageExport] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function toSafeAsyncCallable(depName, depFn) {
            if (typeof depFn !== "function") return async () => undefined;
            return async (...args) => {
                try {
                    return await depFn(...args);
                } catch (err) {
                    logError(safeDeps, `[GTVImageExport] Dependency "${depName}" threw.`, err);
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

        function pickSafeAsyncCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeAsyncCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

        return Object.freeze({
            ...pickSafeCallables([
                "isMultiTab",
                "showToast",
                "t",
                "ensureMultiRangeState"
            ]),
            ...pickSafeAsyncCallables([
                "renderMultiRangeTitlesToPngDataUrl"
            ]),
            ...pickSafeCallables([
                "getMultiRangeTitlesImageFilename"
            ]),
            ...pickSafeAsyncCallables([
                "renderMultiRangesToPngDataUrl",
                "renderMultiRangeSingleToPngDataUrl",
                "detectForeignObjectRendererSupport",
                "renderTimezoneTableToPngDataUrl"
            ]),
            ...pickSafeCallables([
                "isDomExceptionLike",
                "setCanUseForeignObjectRenderer"
            ]),
            ...pickSafeAsyncCallables([
                "renderTimezoneTableFallbackDataUrl"
            ]),
            ...pickSafeCallables([
                "getTimezoneTableImageFilename"
            ])
        });
    }

    function translate(dep, key, fallback) {
        const value = dep.t(key);
        if (typeof value === "string" && value.trim()) return value;
        return fallback;
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
        const dep = createDepFacade(deps);
        try {
            if (dep.isMultiTab() !== true) return;
            dep.showToast(translate(dep, "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            dep.ensureMultiRangeState();
            const dataUrl = await dep.renderMultiRangeTitlesToPngDataUrl();
            const defaultName = `GlobalTimeViewer_MultiRanges_Titles_${Date.now()}.png`;
            const fileNameRaw = dep.getMultiRangeTitlesImageFilename(defaultName);
            const fileName = (typeof fileNameRaw === "string" && fileNameRaw.trim()) ? fileNameRaw.trim() : defaultName;
            if (!dataUrl) throw new Error("Image render failed");
            await downloadDataUrl(dataUrl, fileName, deps);
            dep.showToast(translate(dep, "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            logError(deps, "Failed to save multi-range titles image:", err);
            dep.showToast(
                `${translate(dep, "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeAllImage(deps) {
        const dep = createDepFacade(deps);
        try {
            dep.showToast(translate(dep, "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await dep.renderMultiRangesToPngDataUrl();
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViewer_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
            dep.showToast(translate(dep, "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            logError(deps, "Failed to save all multi-range images:", err);
            dep.showToast(
                `${translate(dep, "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeSingleImage(deps, rangeIdx) {
        const dep = createDepFacade(deps);
        try {
            dep.showToast(translate(dep, "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await dep.renderMultiRangeSingleToPngDataUrl(rangeIdx);
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViewer_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
            dep.showToast(translate(dep, "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            logError(deps, "Failed to save single multi-range image:", err);
            dep.showToast(
                `${translate(dep, "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveTimezoneTableImage(deps) {
        const dep = createDepFacade(deps);
        try {
            if (dep.isMultiTab() === true) {
                await saveMultiRangeAllImage(deps);
                return;
            }

            dep.showToast(translate(dep, "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const supportsPrimaryRenderer = await dep.detectForeignObjectRendererSupport();
            let dataUrl = "";
            if (supportsPrimaryRenderer) {
                try {
                    dataUrl = await dep.renderTimezoneTableToPngDataUrl();
                    if (!dataUrl) throw new Error("Primary renderer unavailable");
                } catch (primaryErr) {
                    if (dep.isDomExceptionLike(primaryErr)) {
                        dep.setCanUseForeignObjectRenderer(false);
                    }
                    dataUrl = await dep.renderTimezoneTableFallbackDataUrl();
                }
            } else {
                dataUrl = await dep.renderTimezoneTableFallbackDataUrl();
            }
            if (!dataUrl) throw new Error("Image render failed");
            const defaultName = `GlobalTimeViewer_Table_${Date.now()}`;
            const baseNameRaw = dep.getTimezoneTableImageFilename(defaultName);
            const baseName = (typeof baseNameRaw === "string" && baseNameRaw.trim()) ? baseNameRaw.trim() : defaultName;
            const filename = `${baseName}.png`;
            await downloadDataUrl(dataUrl, filename, deps);
            dep.showToast(translate(dep, "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            logError(deps, "Failed to save timezone table image:", err);
            dep.showToast(
                `${translate(dep, "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    function createService(deps = {}) {
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
