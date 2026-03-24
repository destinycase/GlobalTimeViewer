import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator-actions.js");

function loadCalculatorActionsModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const windowStub = options.window || {};
    const sandbox = {
        window: windowStub,
        globalThis: {},
        console: options.console || console,
        document: options.document,
        navigator: options.navigator
    };
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

    it("initCalculators falls back to global calculator api when dep api is missing", () => {
        let observedOptions = null;
        const module = loadCalculatorActionsModule({
            window: {
                GTVCalculator: {
                    initCalculators(options) {
                        observedOptions = options;
                    }
                }
            }
        });
        const service = module.createService({
            t: (key) => `tr:${key}`
        });

        service.initCalculators();

        expect(typeof observedOptions?.copyText).toBe("function");
        expect(observedOptions?.t("a")).toBe("tr:a");
    });

    it("initCalculators logs error when calculator api is unavailable", () => {
        const module = loadCalculatorActionsModule();
        const errors = [];
        const service = module.createService({
            logError: (...args) => {
                errors.push(args);
            }
        });

        service.initCalculators();

        expect(errors).toHaveLength(1);
        expect(String(errors[0][0])).toContain("Missing required module API");
    });

    it("copyText returns early for missing element and empty text", async () => {
        const module = loadCalculatorActionsModule();
        const copied = [];
        const service = module.createService({
            getElementById: (id) => {
                if (id === "empty-input") return { value: "   " };
                return null;
            },
            writeClipboard: async (text) => {
                copied.push(text);
            }
        });

        await service.copyText("missing", false);
        await service.copyText("empty-input", true);

        expect(copied).toEqual([]);
    });

    it("copyText period extraction yields empty when result has no numeric text", async () => {
        const module = loadCalculatorActionsModule();
        const copied = [];
        const elements = {
            "period-res": {
                textContent: "N/A"
            }
        };
        const service = module.createService({
            PERIOD_RESULT_IDS: new Set(["period-res"]),
            getElementById: (id) => elements[id] || null,
            writeClipboard: async (text) => {
                copied.push(text);
            }
        });

        await service.copyText("period-res", false);

        expect(copied).toEqual([]);
    });

    it("copyText can use document/navigator fallback when deps are not provided", async () => {
        const copied = [];
        const module = loadCalculatorActionsModule({
            document: {
                getElementById(id) {
                    if (id === "plain-text") return { textContent: " copied value " };
                    return null;
                }
            },
            navigator: {
                clipboard: {
                    async writeText(text) {
                        copied.push(text);
                    }
                }
            }
        });
        const toasts = [];
        const service = module.createService({
            t: (key) => key,
            showToast: (message, options = {}) => {
                toasts.push({ message, options });
            }
        });

        await service.copyText("plain-text", false);

        expect(copied).toEqual(["copied value"]);
        expect(toasts).toEqual([{ message: "toast_copy_success", options: { type: "success" } }]);
    });

    it("copyText handles unavailable clipboard api using console.error fallback", async () => {
        const errors = [];
        const module = loadCalculatorActionsModule({
            console: {
                error: (...args) => {
                    errors.push(args);
                }
            },
            document: {
                getElementById(id) {
                    if (id === "plain-text") return { textContent: "value" };
                    return null;
                }
            }
        });
        const toasts = [];
        const service = module.createService({
            t: (key) => key,
            showToast: (message, options = {}) => {
                toasts.push({ message, options });
            }
        });

        await service.copyText("plain-text", false);

        expect(errors.length).toBe(1);
        expect(String(errors[0][0])).toContain("copyText failed:");
        expect(toasts).toEqual([{ message: "toast_copy_failed", options: { type: "error" } }]);
    });

    it("translate falls back to key string when translator is missing or empty", async () => {
        const module = loadCalculatorActionsModule();
        const toasts = [];
        const service = module.createService({
            getElementById: () => ({ value: "123" }),
            writeClipboard: async () => { },
            t: () => "",
            showToast: (message, options = {}) => {
                toasts.push({ message, options });
            }
        });

        await service.copyText("unix-ts-input", true);

        expect(toasts).toEqual([{ message: "toast_copy_success", options: { type: "success" } }]);
    });
});
