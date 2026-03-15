import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "copy-actions.js");

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
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelectorAll() {
                return [];
            }
        },
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/copy-actions.js" });
    return sandbox.window.GTVCopyActions || sandbox.GTVCopyActions || sandbox.globalThis.GTVCopyActions;
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

    it("copyAllTimezones delegates to multi-range copy in multi mode", async () => {
        let delegated = 0;
        const module = loadCopyActionsModule();
        const service = module.createService({
            isMultiTab: () => true,
            copyAllMultiRangeTimezones: async () => { delegated += 1; }
        });

        await service.copyAllTimezones();

        expect(delegated).toBe(1);
    });

    it("copyAllTimezones uses fixed-time aggregate text in fixed-time mode", async () => {
        let copiedText = "";
        const module = loadCopyActionsModule();
        const service = module.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getAllFixedTimeRowsCopyText: () => "[Slot A]\n[UTC] 09:00:00",
            writeClipboard: async (text) => { copiedText = text; },
            showToast: () => { },
            t: (key) => key
        });

        await service.copyAllTimezones();

        expect(copiedText).toContain("[Slot A]");
        expect(copiedText).toContain("09:00:00");
    });

    it("copyAllTimezones exits safely when row query is unavailable", async () => {
        const module = loadCopyActionsModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({
            isMultiTab: () => false
        });

        await expect(service.copyAllTimezones()).resolves.toBeUndefined();
    });

    it("copyRow reports failure toast when clipboard write fails", async () => {
        const toasts = [];
        const module = loadCopyActionsModule({
            console: {
                error() { },
                warn() { },
                log() { }
            }
        });
        const service = module.createService({
            getRowCopyText: () => "ABC",
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: (message, options = {}) => {
                toasts.push({ message, type: options.type });
            },
            t: (key) => key
        });

        await service.copyRow("utc");

        expect(toasts).toHaveLength(1);
        expect(toasts[0]).toMatchObject({ message: "toast_copy_failed", type: "error" });
    });
});
