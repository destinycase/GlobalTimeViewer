import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const I18N_PATH = path.resolve(process.cwd(), "i18n.js");

function createClassList() {
    const values = new Set();
    return {
        add(token) {
            values.add(String(token));
        },
        remove(token) {
            values.delete(String(token));
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function createI18nElement({ tagName = "DIV", type = "", key = "", titleKey = "" } = {}) {
    const attrs = new Map();
    if (key) attrs.set("data-i18n", key);
    if (titleKey) attrs.set("data-i18n-title", titleKey);
    return {
        tagName,
        type,
        textContent: "",
        placeholder: "",
        classList: createClassList(),
        getAttribute(name) {
            return attrs.get(name) || "";
        },
        setAttribute(name, value) {
            attrs.set(name, String(value));
        },
        removeAttribute(name) {
            attrs.delete(name);
        }
    };
}

function createLangOption(value) {
    return {
        value,
        textContent: ""
    };
}

function createLangSelect() {
    const ko = createLangOption("ko");
    const en = createLangOption("en");
    return {
        querySelector(selector) {
            if (selector === "option[value=\"ko\"]") return ko;
            if (selector === "option[value=\"en\"]") return en;
            return null;
        },
        ko,
        en
    };
}

function createRuntime(options = {}) {
    const code = fs.readFileSync(I18N_PATH, "utf8");
    const i18nElements = options.i18nElements || [];
    const titleElements = options.titleElements || [];
    const langSelect = options.langSelect || null;
    const documentStub = options.document || {
        title: "",
        documentElement: { lang: "" },
        querySelectorAll(selector) {
            if (selector === "[data-i18n]") return i18nElements;
            if (selector === "[data-i18n-title]") return titleElements;
            return [];
        },
        getElementById(id) {
            if (id === "lang-select") return langSelect;
            return null;
        }
    };
    const localStorageStub = options.localStorage || {
        getItem: () => "ko",
        setItem: () => { }
    };
    const consoleStub = options.console || console;

    const runtimeFactory = new Function(
        "localStorage",
        "document",
        "window",
        "console",
        `${code}
        return {
            setLanguage,
            t,
            tFormat,
            applyTranslations,
            safeLocalStorageGet,
            safeLocalStorageSet,
            getCurrentLang: () => currentLang
        };`
    );

    const runtime = runtimeFactory(localStorageStub, documentStub, {}, consoleStub);
    return { runtime, documentStub, localStorageStub, langSelect };
}

describe("i18n runtime module", () => {
    it("falls back to ko when stored language is invalid", () => {
        const { runtime } = createRuntime({
            localStorage: {
                getItem: () => "xx",
                setItem: () => { }
            }
        });

        expect(runtime.getCurrentLang()).toBe("ko");
    });

    it("safeLocalStorageGet/Set handle storage exceptions", () => {
        const warnings = [];
        const { runtime } = createRuntime({
            localStorage: {
                getItem() {
                    throw new Error("read failed");
                },
                setItem() {
                    throw new Error("write failed");
                }
            },
            console: {
                warn: (...args) => warnings.push(args)
            }
        });

        const baseline = warnings.length;
        expect(runtime.safeLocalStorageGet("X", "fallback")).toBe("fallback");
        expect(runtime.safeLocalStorageSet("X", "Y")).toBe(false);
        expect(warnings.length - baseline).toBe(2);
    });

    it("setLanguage ignores unsupported languages", () => {
        const writes = [];
        const { runtime } = createRuntime({
            localStorage: {
                getItem: () => "ko",
                setItem: (k, v) => writes.push([k, v])
            }
        });

        runtime.setLanguage("invalid");
        expect(runtime.getCurrentLang()).toBe("ko");
        expect(writes.length).toBe(0);
    });

    it("setLanguage updates state and persists selected language", () => {
        const writes = [];
        const { runtime } = createRuntime({
            localStorage: {
                getItem: () => "ko",
                setItem: (k, v) => writes.push([k, v])
            }
        });

        runtime.setLanguage("en");
        expect(runtime.getCurrentLang()).toBe("en");
        expect(writes).toEqual([["GTV_Lang", "en"]]);
    });

    it("applyTranslations updates i18n text, tooltip attrs, lang select, and title", () => {
        const inputEl = createI18nElement({ tagName: "INPUT", type: "text", key: "placeholder_search" });
        const optionEl = createI18nElement({ tagName: "OPTION", key: "theme_dark" });
        const textEl = createI18nElement({ tagName: "DIV", key: "app_title" });
        const titleEl = createI18nElement({ titleKey: "tooltip_theme_desc" });
        const langSelect = createLangSelect();

        const { runtime, documentStub } = createRuntime({
            i18nElements: [inputEl, optionEl, textEl],
            titleElements: [titleEl],
            langSelect
        });

        runtime.setLanguage("en");

        expect(documentStub.documentElement.lang).toBe("en");
        expect(inputEl.placeholder.length).toBeGreaterThan(0);
        expect(optionEl.textContent.length).toBeGreaterThan(0);
        expect(textEl.textContent.length).toBeGreaterThan(0);
        expect(titleEl.getAttribute("data-tooltip").length).toBeGreaterThan(0);
        expect(titleEl.getAttribute("aria-label").length).toBeGreaterThan(0);
        expect(titleEl.classList.contains("custom-tooltip")).toBe(true);
        expect(langSelect.ko.textContent.includes("KO")).toBe(true);
        expect(langSelect.en.textContent.includes("EN")).toBe(true);
        expect(documentStub.title.length).toBeGreaterThan(0);
    });

    it("tFormat interpolates token placeholders", () => {
        const { runtime } = createRuntime();
        const text = runtime.tFormat("toast_group_export_success", { filename: "sample.json" });
        expect(text.includes("sample.json")).toBe(true);
    });
});
