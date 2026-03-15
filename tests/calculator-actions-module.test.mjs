import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator-actions.js");

function loadCalculatorActionsModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/calculator-actions.js" });
    return sandbox.window.GTVCalculatorActions || sandbox.GTVCalculatorActions || sandbox.globalThis.GTVCalculatorActions;
}

describe("GTV calculator actions module", () => {
    it("initCalculators delegates to calculator module with translated t and copyText", () => {
        const module = loadCalculatorActionsModule();
        let observedOptions = null;
        const service = module.createService({
            GTV_CALCULATOR: {
                initCalculators: (options) => {
                    observedOptions = options;
                }
            },
            t: (key) => `tr:${key}`
        });

        service.initCalculators();
        expect(typeof observedOptions?.copyText).toBe("function");
        expect(observedOptions?.t("sample_key")).toBe("tr:sample_key");
    });

    it("copyText copies normalized period value and shows success toast", async () => {
        const module = loadCalculatorActionsModule();
        const toasts = [];
        const copied = [];
        const elements = {
            "period-res": {
                textContent: "15 days"
            }
        };
        const service = module.createService({
            PERIOD_RESULT_IDS: new Set(["period-res"]),
            getElementById: (id) => elements[id] || null,
            writeClipboard: async (text) => {
                copied.push(text);
            },
            t: (key) => key,
            showToast: (message, options = {}) => {
                toasts.push({ message, options });
            }
        });

        await service.copyText("period-res", false);
        expect(copied).toEqual(["15"]);
        expect(toasts).toEqual([{ message: "toast_copy_success", options: { type: "success" } }]);
    });

    it("copyText shows error toast on clipboard failure", async () => {
        const module = loadCalculatorActionsModule();
        const toasts = [];
        const errors = [];
        const elements = {
            "unix-ts-input": {
                value: "1700000000"
            }
        };
        const service = module.createService({
            getElementById: (id) => elements[id] || null,
            writeClipboard: async () => {
                throw new Error("copy failed");
            },
            t: (key) => key,
            showToast: (message, options = {}) => {
                toasts.push({ message, options });
            },
            logError: (...args) => {
                errors.push(args);
            }
        });

        await service.copyText("unix-ts-input", true);
        expect(errors.length).toBe(1);
        expect(toasts).toEqual([{ message: "toast_copy_failed", options: { type: "error" } }]);
    });
});
