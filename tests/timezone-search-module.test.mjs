import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-search.js");

function createClassList() {
    const values = new Set();
    return {
        add(...tokens) {
            tokens.forEach((token) => values.add(String(token)));
        },
        remove(...tokens) {
            tokens.forEach((token) => values.delete(String(token)));
        },
        toggle(token, force) {
            const key = String(token);
            const shouldAdd = (force === undefined) ? !values.has(key) : !!force;
            if (shouldAdd) values.add(key);
            else values.delete(key);
            return shouldAdd;
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function createElementStub(tagName = "div") {
    return {
        tagName: String(tagName || "div").toUpperCase(),
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        value: "",
        options: [],
        children: [],
        appendChild(child) {
            this.children.push(child);
            if (this.tagName === "SELECT" && child?.tagName === "OPTION") {
                this.options.push(child);
            }
            return child;
        },
        setAttribute() { },
        addEventListener() { },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        }
    };
}

function loadTimezoneSearchModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Intl: options.Intl || Intl,
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement(tag) {
                return createElementStub(tag);
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/timezone-search.js" });
    return sandbox.window.GTVTimezoneSearch || sandbox.GTVTimezoneSearch || sandbox.globalThis.GTVTimezoneSearch;
}

describe("GTV timezone search module", () => {
    it("getSelectableTZEntries handles missing deps state safely", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService(null);

        expect(service.getSelectableTZEntries()).toEqual([]);
    });

    it("createStandardTimezoneFromSelectableEntry falls back ID when generator is missing", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({});

        const result = service.createStandardTimezoneFromSelectableEntry({
            kind: "standard_list",
            zone: "UTC",
            abbr: "UTC",
            fixedOffsetMinutes: 0
        });

        expect(result).toMatchObject({
            zone: "UTC",
            type: "standard",
            fixedAbbr: "UTC",
            fixedOffsetMinutes: 0
        });
        expect(result.id).toMatch(/^tz-/);
    });

    it("addFromSearchWithData uses selectable entries and forwards addTimezone", () => {
        const added = [];
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            TZ_DATABASE: [
                {
                    zone: "Asia/Seoul",
                    name: "\uB300\uD55C\uBBFC\uAD6D",
                    city: "\uC11C\uC6B8",
                    name_en: "South Korea",
                    city_en: "Seoul"
                }
            ],
            ZONE_MAP: { "Asia/Seoul": "KST" },
            getTimezoneOffset: () => 540,
            getBetterAbbr: () => "KST",
            createUniqueTimezoneId: () => "tz-1",
            addTimezone: (timezone) => {
                added.push(timezone);
            }
        });

        service.addFromSearchWithData("Asia/Seoul|auto");

        expect(added).toHaveLength(1);
        expect(added[0]).toMatchObject({
            id: "tz-1",
            zone: "Asia/Seoul",
            fixedAbbr: "KST"
        });
    });

    it("getSelectableTZEntries exposes a single active entry for DST zones", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            TZ_DATABASE: [
                {
                    zone: "America/New_York",
                    name: "USA",
                    city: "New York",
                    name_en: "USA",
                    city_en: "New York"
                }
            ],
            ZONE_MAP: {
                "America/New_York": ["EST", "EDT"]
            },
            getTimezoneOffset: (_zone, date) => {
                const month = date.getUTCMonth();
                if (month === 0) return -300;
                if (month === 6) return -240;
                return -240;
            },
            getBetterAbbr: () => "EDT"
        });

        const entries = service.getSelectableTZEntries();
        expect(entries).toHaveLength(1);
        expect(entries[0].key).toMatch(/^America\/New_York\|(dst|std)$/);
        expect(entries[0].fixedOffsetMinutes).toBe(null);
        expect(["EST", "EDT"]).toContain(entries[0].abbr);
        expect(entries.some((entry) => entry.key.endsWith("|auto"))).toBe(false);
    });

    it("createStandardTimezoneFromSelectableEntry keeps dst/std entries fixed", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            createUniqueTimezoneId: () => "tz-fixed"
        });

        const result = service.createStandardTimezoneFromSelectableEntry({
            kind: "country_region",
            key: "America/New_York|dst",
            zone: "America/New_York",
            name: "USA",
            city: "New York",
            name_en: "USA",
            city_en: "New York",
            abbr: "EDT",
            fixedOffsetMinutes: -240
        });

        expect(result).toMatchObject({
            id: "tz-fixed",
            zone: "America/New_York",
            fixedAbbr: "EDT",
            fixedOffsetMinutes: -240
        });
    });

    it("createStandardTimezoneFromSelectableEntry clears fixed fields for dst/std when offset is not fixed", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            createUniqueTimezoneId: () => "tz-dynamic"
        });

        const result = service.createStandardTimezoneFromSelectableEntry({
            kind: "country_region",
            key: "America/New_York|dst",
            zone: "America/New_York",
            name: "USA",
            city: "New York",
            name_en: "USA",
            city_en: "New York",
            abbr: "EDT",
            fixedOffsetMinutes: null
        });

        expect(result).toMatchObject({
            id: "tz-dynamic",
            zone: "America/New_York",
            fixedAbbr: "",
            fixedOffsetMinutes: null
        });
    });

    it("createStandardTimezoneFromSelectableEntry clears fixed fields for auto entries", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            createUniqueTimezoneId: () => "tz-auto"
        });

        const result = service.createStandardTimezoneFromSelectableEntry({
            kind: "country_region",
            key: "America/New_York|auto",
            zone: "America/New_York",
            name: "USA",
            city: "New York",
            name_en: "USA",
            city_en: "New York",
            abbr: "EST",
            fixedOffsetMinutes: -300
        });

        expect(result).toMatchObject({
            id: "tz-auto",
            zone: "America/New_York",
            fixedAbbr: "EST",
            fixedOffsetMinutes: null
        });
    });

    it("addFromSearchWithData keeps DST zone rows dynamic from existing selectable key", () => {
        const added = [];
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            TZ_DATABASE: [
                {
                    zone: "America/New_York",
                    name: "USA",
                    city: "New York",
                    name_en: "USA",
                    city_en: "New York"
                }
            ],
            ZONE_MAP: {
                "America/New_York": ["EST", "EDT"]
            },
            getTimezoneOffset: (_zone, date) => {
                const month = date.getUTCMonth();
                if (month === 0) return -300;
                if (month === 6) return -240;
                return -240;
            },
            getBetterAbbr: () => "EDT",
            createUniqueTimezoneId: () => "tz-ny",
            addTimezone: (timezone) => {
                added.push(timezone);
            }
        });

        const entry = service.getSelectableTZEntries()[0];
        service.addFromSearchWithData(entry.key);

        expect(added).toHaveLength(1);
        expect(added[0]).toMatchObject({
            id: "tz-ny",
            zone: "America/New_York",
            fixedAbbr: "",
            fixedOffsetMinutes: null
        });
    });

    it("updateTZDropdown exits safely when quick select element is missing", () => {
        const module = loadTimezoneSearchModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.updateTZDropdown()).not.toThrow();
    });

    it("initSearchAndSelect handles UTC quick-select branch and persists", () => {
        const quickSelect = createElementStub("select");
        const placeholder = createElementStub("option");
        placeholder.value = "";
        quickSelect.options = [placeholder];
        const activeGroup = { showUtcRow: false, utcRowOrder: "invalid" };
        let saveCalls = 0;
        let renderCalls = 0;

        const module = loadTimezoneSearchModule({
            document: {
                getElementById(id) {
                    if (id === "tz-quick-select") return quickSelect;
                    return null;
                },
                createElement(tag) {
                    return createElementStub(tag);
                }
            }
        });
        const service = module.createService({
            getCurrentGroup: () => activeGroup,
            savePersistence: () => { saveCalls += 1; },
            renderList: () => { renderCalls += 1; },
            t: (key) => key
        });

        service.initSearchAndSelect();
        quickSelect.onchange({ target: { value: "UTC" } });

        expect(activeGroup.showUtcRow).toBe(true);
        expect(activeGroup.utcRowOrder).toBe(0);
        expect(saveCalls).toBe(1);
        expect(renderCalls).toBe(1);
        expect(quickSelect.value).toBe("");
    });

    it("getTimezoneEntryTitle returns localized standard label", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            getCurrentLang: () => "ko"
        });

        const title = service.getTimezoneEntryTitle({
            kind: "standard_list",
            fixedOffsetMinutes: 540
        });

        expect(title).toContain("UTC+09:00");
        expect(title).toContain("\uD45C\uC900\uC2DC");
    });

    it("getTimezoneEntryTitle localizes country-region label by language", () => {
        const module = loadTimezoneSearchModule();
        const entry = {
            kind: "country_region",
            name: "\uC77C\uBCF8",
            city: "\uB3C4\uCFC4",
            name_en: "Japan",
            city_en: "Tokyo"
        };

        const serviceKo = module.createService({
            getCurrentLang: () => "ko"
        });
        const serviceEn = module.createService({
            getCurrentLang: () => "en"
        });

        expect(serviceKo.getTimezoneEntryTitle(entry)).toBe("\uC77C\uBCF8 - \uB3C4\uCFC4");
        expect(serviceEn.getTimezoneEntryTitle(entry)).toBe("Japan - Tokyo");
    });
});
