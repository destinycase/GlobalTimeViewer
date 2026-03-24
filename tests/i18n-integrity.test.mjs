import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const I18N_PATH = path.resolve(process.cwd(), "i18n.js");
const INDEX_PATH = path.resolve(process.cwd(), "index.html");

function loadI18nData() {
    const code = fs.readFileSync(I18N_PATH, "utf8");
    const evaluate = new Function(
        "localStorage",
        "document",
        "window",
        "console",
        `${code}\nreturn I18N_DATA;`
    );
    return evaluate(
        {
            getItem: () => "ko",
            setItem: () => { }
        },
        {
            title: "",
            documentElement: { lang: "" },
            querySelectorAll: () => [],
            getElementById: () => null
        },
        {},
        console
    );
}

function collectAttributeValues(html, attrName) {
    const regex = new RegExp(`${attrName}="([^"]+)"`, "g");
    const values = new Set();
    let match = regex.exec(html);
    while (match) {
        values.add(match[1]);
        match = regex.exec(html);
    }
    return [...values];
}

describe("i18n key integrity", () => {
    it("resolves all data-i18n and data-i18n-title keys from index.html", () => {
        const i18nData = loadI18nData();
        const html = fs.readFileSync(INDEX_PATH, "utf8");
        const keys = [
            ...collectAttributeValues(html, "data-i18n"),
            ...collectAttributeValues(html, "data-i18n-title")
        ];

        expect(keys.length).toBeGreaterThan(0);
        keys.forEach((key) => {
            expect(i18nData.en[key], `missing en key: ${key}`).not.toBeUndefined();
            expect(i18nData.ko[key], `missing ko key: ${key}`).not.toBeUndefined();

            const enVal = i18nData.en[key];
            const koVal = i18nData.ko[key];
            if (typeof enVal === "string") expect(enVal.trim().length).toBeGreaterThan(0);
            if (typeof koVal === "string") expect(koVal.trim().length).toBeGreaterThan(0);
        });
    });
});
