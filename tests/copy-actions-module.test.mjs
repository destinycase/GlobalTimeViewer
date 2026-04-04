import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "copy-actions.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

const activeRestores = [];

afterEach(() => {
    while (activeRestores.length) {
        const restore = activeRestores.pop();
        if (typeof restore === "function") restore();
    }
});

function createClassList() {
    const values = new Set();
    return {
        toggle(token, enabled) {
            const key = String(token);
            if (enabled) values.add(key);
            else values.delete(key);
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function loadCopyActionsModule(options = {}) {
    const preservedKeys = ["window", "document", "GTVCopyActions"];
    const preserved = new Map();
    preservedKeys.forEach((key) => {
        preserved.set(key, Object.prototype.hasOwnProperty.call(globalThis, key) ? globalThis[key] : undefined);
    });

    globalThis.window = globalThis;
    globalThis.document = options.document || {
        getElementById() {
            return null;
        },
        querySelectorAll() {
            return [];
        }
    };

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);

    activeRestores.push(() => {
        delete require.cache[MODULE_ID];
        preservedKeys.forEach((key) => {
            const value = preserved.get(key);
            if (value === undefined) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = value;
        });
    });

    return globalThis.GTVCopyActions;
}

describe("GTV copy actions module", () => {
    it("updateCopyFormatPreview exits safely when preview element is missing", () => {
        const module = loadCopyActionsModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService(null);

        expect(() => service.updateCopyFormatPreview()).not.toThrow();
    });

    it("updateCopyFormatPreview shows dash when copy format is hidden", () => {
        const preview = {
            textContent: "",
            classList: createClassList()
        };
        const module = loadCopyActionsModule({
            document: {
                getElementById(id) {
                    return id === "copy-format-preview" ? preview : null;
                }
            }
        });
        const service = module.createService({
            isShowCopyFormat: () => false
        });

        service.updateCopyFormatPreview();

        expect(preview.textContent).toBe("-");
        expect(preview.classList.contains("empty")).toBe(true);
    });

    it("updateCopyFormatPreview falls back when dependency invocation throws", () => {
        const preview = {
            textContent: "",
            classList: createClassList()
        };
        const module = loadCopyActionsModule({
            document: {
                getElementById(id) {
                    return id === "copy-format-preview" ? preview : null;
                }
            }
        });
        const service = module.createService({
            isShowCopyFormat: () => {
                throw new Error("dep failure");
            }
        });

        expect(() => service.updateCopyFormatPreview()).not.toThrow();
        expect(preview.textContent).toBe("-");
        expect(preview.classList.contains("empty")).toBe(true);
    });

    it("updateCopyFormatPreview renders multi-tab snapshot text", () => {
        const preview = {
            textContent: "",
            classList: createClassList()
        };
        const module = loadCopyActionsModule({
            document: {
                getElementById(id) {
                    return id === "copy-format-preview" ? preview : null;
                }
            }
        });
        const service = module.createService({
            isShowCopyFormat: () => true,
            isMultiTab: () => true,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getBaseTimezoneRef: () => ({ id: "utc" }),
            buildTimezoneComputedSnapshotForRange: () => ({ timezone: "utc" }),
            getCopyFormatOrder: () => ["time"],
            getCopyFormatEnabled: () => ({ time: true }),
            getCopyTimePartsEnabled: () => ({ time: true }),
            formatSnapshotText: () => "MULTI SNAPSHOT"
        });

        service.updateCopyFormatPreview();
        expect(preview.textContent).toBe("MULTI SNAPSHOT");
        expect(preview.classList.contains("empty")).toBe(false);
    });

    it("updateCopyFormatPreview handles fixed/live tab preview paths", () => {
        const preview = {
            textContent: "",
            classList: createClassList()
        };
        const module = loadCopyActionsModule({
            document: {
                getElementById(id) {
                    return id === "copy-format-preview" ? preview : null;
                }
            }
        });

        const fixedService = module.createService({
            isShowCopyFormat: () => true,
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getFixedTimePreviewCopyText: () => "FIXED PREVIEW"
        });
        fixedService.updateCopyFormatPreview();
        expect(preview.textContent).toBe("FIXED PREVIEW");

        const liveService = module.createService({
            isShowCopyFormat: () => true,
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getBaseTimezoneRef: () => ({ id: "asia-seoul" }),
            getCopyFormatOrder: () => ["time"],
            getCopyFormatEnabled: () => ({ time: true }),
            getCopyTimePartsEnabled: () => ({ time: true }),
            getRowFormattedText: () => "LIVE PREVIEW"
        });
        liveService.updateCopyFormatPreview();
        expect(preview.textContent).toBe("LIVE PREVIEW");
    });

    it("copyRow handles success and failure paths", async () => {
        const successToasts = [];
        const successModule = loadCopyActionsModule();
        const successService = successModule.createService({
            getRowCopyText: () => "ROW TEXT",
            writeClipboard: async () => {},
            showToast: (message, options = {}) => successToasts.push({ message, type: options.type }),
            t: (key) => key
        });
        await successService.copyRow("utc");
        expect(successToasts).toContainEqual({ message: "toast_copy_success", type: "success" });

        const failureToasts = [];
        const failureModule = loadCopyActionsModule();
        const failureService = failureModule.createService({
            getRowCopyText: () => "ROW TEXT",
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: (message, options = {}) => failureToasts.push({ message, type: options.type }),
            t: (key) => key
        });
        const originalError = console.error;
        console.error = () => {};
        try {
            await failureService.copyRow("utc");
        } finally {
            console.error = originalError;
        }
        expect(failureToasts).toContainEqual({ message: "toast_copy_failed", type: "error" });

        const noTextModule = loadCopyActionsModule();
        const noTextService = noTextModule.createService({
            getRowCopyText: () => ""
        });
        await expect(noTextService.copyRow("utc")).resolves.toBeUndefined();
    });

    it("copyAllTimezones supports multi/fixed/live modes", async () => {
        let delegated = 0;
        const multiModule = loadCopyActionsModule();
        const multiService = multiModule.createService({
            isMultiTab: () => true,
            copyAllMultiRangeTimezones: async () => { delegated += 1; }
        });
        await multiService.copyAllTimezones();
        expect(delegated).toBe(1);

        let fixedCopied = "";
        const fixedModule = loadCopyActionsModule();
        const fixedService = fixedModule.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getAllFixedTimeRowsCopyText: () => "[Slot A]\n[UTC] 09:00:00",
            writeClipboard: async (text) => { fixedCopied = text; },
            showToast: () => {},
            t: (key) => key
        });
        await fixedService.copyAllTimezones();
        expect(fixedCopied).toContain("[Slot A]");

        const rows = [{ id: "tz-row-utc" }, { id: "tz-row-asia-seoul" }];
        let liveCopied = "";
        const liveModule = loadCopyActionsModule({
            document: {
                getElementById() {
                    return null;
                },
                querySelectorAll(selector) {
                    if (selector === "#clocks-container .time-row") return rows;
                    return [];
                }
            }
        });
        const liveService = liveModule.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getRowCopyText: (id) => `${id}:00`,
            writeClipboard: async (text) => { liveCopied = text; },
            showToast: () => {},
            t: (key) => key
        });
        await liveService.copyAllTimezones();
        expect(liveCopied).toBe("utc:00\nasia-seoul:00");
    });

    it("copyAllTimezones exits safely when live mode has no query selector support", async () => {
        const module = loadCopyActionsModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => false
        });

        await expect(service.copyAllTimezones()).resolves.toBeUndefined();
    });

    it("prefers explicit documentRef and logError dependencies", async () => {
        const rows = [{ id: "tz-row-explicit" }];
        const errors = [];
        const module = loadCopyActionsModule({
            document: {
                getElementById() {
                    return null;
                },
                querySelectorAll() {
                    return [];
                }
            }
        });
        const service = module.createService({
            documentRef: {
                getElementById() {
                    return null;
                },
                querySelectorAll(selector) {
                    if (selector === "#clocks-container .time-row") return rows;
                    return [];
                }
            },
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getRowCopyText: () => "ROW TEXT",
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: () => {},
            t: (key) => key,
            logError: (...args) => {
                errors.push(args);
            }
        });

        await service.copyAllTimezones();

        expect(errors).toHaveLength(1);
        expect(String(errors[0][0])).toContain("copyAllTimezones failed:");
    });

    it("prefers injected getDocumentRef over global document", () => {
        const globalPreview = { textContent: "", classList: createClassList() };
        const injectedPreview = { textContent: "", classList: createClassList() };
        const module = loadCopyActionsModule({
            document: {
                getElementById(id) {
                    return id === "copy-format-preview" ? globalPreview : null;
                }
            }
        });
        const service = module.createService({
            getDocumentRef: () => ({
                getElementById(id) {
                    return id === "copy-format-preview" ? injectedPreview : null;
                }
            }),
            isShowCopyFormat: () => false
        });

        service.updateCopyFormatPreview();

        expect(injectedPreview.textContent).toBe("-");
        expect(globalPreview.textContent).toBe("");
    });
});
