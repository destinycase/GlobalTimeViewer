import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-search.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

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
    const listeners = new Map();
    const attributes = new Map();
    const element = {
        tagName: String(tagName || "div").toUpperCase(),
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        value: "",
        options: [],
        children: [],
        onclick: null,
        appendChild(child) {
            if (!child) return child;
            child.parentNode = this;
            child.parentElement = this;
            this.children.push(child);
            if (this.tagName === "SELECT" && child?.tagName === "OPTION") {
                this.options.push(child);
            }
            return child;
        },
        setAttribute(name, value) {
            attributes.set(String(name), String(value));
        },
        getAttribute(name) {
            return attributes.has(String(name)) ? attributes.get(String(name)) : null;
        },
        addEventListener(eventName, handler) {
            if (!listeners.has(eventName)) listeners.set(eventName, []);
            listeners.get(eventName).push(handler);
        },
        dispatchEvent(event) {
            const evt = event || { type: "" };
            if (typeof evt.preventDefault !== "function") evt.preventDefault = () => { };
            if (typeof evt.stopPropagation !== "function") evt.stopPropagation = () => { };
            if (!evt.target) evt.target = this;
            const handlers = listeners.get(evt.type) || [];
            handlers.forEach((handler) => handler(evt));
            return true;
        },
        click() {
            this.dispatchEvent({ type: "click", target: this });
            if (typeof this.onclick === "function") {
                this.onclick({ target: this, preventDefault() { }, stopPropagation() { } });
            }
        },
        querySelectorAll(selector) {
            if (typeof selector !== "string" || !selector.startsWith(".")) return [];
            const className = selector.slice(1);
            return this.children.filter((child) => child?.classList?.contains?.(className));
        },
        querySelector(selector) {
            return this.querySelectorAll(selector)[0] || null;
        }
    };
    let textContentValue = "";
    Object.defineProperty(element, "textContent", {
        get() {
            return textContentValue;
        },
        set(value) {
            textContentValue = String(value ?? "");
            if (!textContentValue) {
                element.children = [];
                if (element.tagName === "SELECT") element.options = [];
            }
        }
    });
    return element;
}

function createDocumentStub(elementsById = {}) {
    return {
        getElementById(id) {
            return elementsById[id] || null;
        },
        createElement(tag) {
            return createElementStub(tag);
        }
    };
}

function createOffsetAndAbbrDeps() {
    return {
        getTimezoneOffset: (zone, date) => {
            if (zone === "UTC") return 0;
            if (zone === "Asia/Seoul") return 540;
            if (zone === "America/New_York") return date.getUTCMonth() === 0 ? -300 : -240;
            return Number.NaN;
        },
        getBetterAbbr: (zone, date) => {
            if (zone === "UTC") return "UTC";
            if (zone === "Asia/Seoul") return "KST";
            if (zone === "America/New_York") return date.getUTCMonth() === 0 ? "EST" : "EDT";
            return "";
        }
    };
}

function loadTimezoneSearchModule(options = {}) {
    const windowStub = {
        requestIdleCallback: options.requestIdleCallback,
        setTimeout: options.setTimeout
    };
    const globalPatches = {
        window: windowStub,
        Intl: options.Intl || Intl,
        document: options.document || createDocumentStub(),
        console
    };
    const keys = ["GTVTimezoneSearch", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return globalThis.window?.GTVTimezoneSearch || globalThis.GTVTimezoneSearch;
}

describe("GTV timezone search module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });
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

    it("getAllSupportedTimezoneNames falls back to TZ database when Intl is unavailable", () => {
        const module = loadTimezoneSearchModule({
            Intl: {
                supportedValuesOf() {
                    throw new Error("unsupported");
                }
            }
        });
        const service = module.createService({
            TZ_DATABASE: [
                { zone: "Asia/Seoul" },
                { zone: "America/New_York" },
                { zone: "Asia/Seoul" }
            ]
        });

        const names = service.getAllSupportedTimezoneNames();

        expect(names).toContain("UTC");
        expect(names).toContain("Asia/Seoul");
        expect(names).toContain("America/New_York");
    });

    it("getStandardTimezoneEntries generates sorted entries and returns cloned cache entries", () => {
        const module = loadTimezoneSearchModule({
            Intl: {
                supportedValuesOf() {
                    return ["UTC", "Asia/Seoul", "America/New_York"];
                }
            }
        });
        const service = module.createService({
            ...createOffsetAndAbbrDeps(),
            TZ_DATABASE: []
        });

        const first = service.getStandardTimezoneEntries();
        first[0].abbr = "MUTATED";
        const second = service.getStandardTimezoneEntries();

        expect(second[0].abbr).not.toBe("MUTATED");
        const offsets = second.map((entry) => entry.fixedOffsetMinutes);
        const sortedOffsets = [...offsets].sort((a, b) => a - b);
        expect(offsets).toEqual(sortedOffsets);
        expect(second.some((entry) => entry.zone === "UTC" && entry.fixedOffsetMinutes === 0)).toBe(true);
    });

    it("queueStandardTimezoneWarmup schedules only once via requestIdleCallback", () => {
        let scheduled = 0;
        let callback = null;
        const module = loadTimezoneSearchModule({
            requestIdleCallback(fn) {
                scheduled += 1;
                callback = fn;
            },
            Intl: {
                supportedValuesOf() {
                    return ["UTC"];
                }
            }
        });
        const service = module.createService({
            ...createOffsetAndAbbrDeps(),
            TZ_DATABASE: []
        });

        service.queueStandardTimezoneWarmup();
        service.queueStandardTimezoneWarmup();
        expect(scheduled).toBe(1);

        callback();
        service.queueStandardTimezoneWarmup();
        expect(scheduled).toBe(1);
    });

    it("queueStandardTimezoneWarmup falls back to setTimeout when requestIdleCallback is absent", () => {
        let delay = null;
        let callback = null;
        const module = loadTimezoneSearchModule({
            setTimeout(fn, timeout) {
                callback = fn;
                delay = timeout;
                return 1;
            }
        });
        const service = module.createService({});

        service.queueStandardTimezoneWarmup();

        expect(delay).toBe(120);
        expect(typeof callback).toBe("function");
    });

    it("queueStandardTimezoneWarmup prefers injected logWarn when warmup fails", () => {
        let callback = null;
        const supportedValues = ["UTC"];
        supportedValues.forEach = () => {
            throw new Error("warmup failed");
        };
        const module = loadTimezoneSearchModule({
            requestIdleCallback(fn) {
                callback = fn;
            },
            Intl: {
                supportedValuesOf() {
                    return supportedValues;
                }
            }
        });
        const warned = [];
        const service = module.createService({
            logWarn: (...args) => {
                warned.push(args);
            }
        });

        service.queueStandardTimezoneWarmup();
        callback();

        expect(warned).toHaveLength(1);
        expect(String(warned[0][0])).toContain("Failed to warm up standard timezone cache.");
    });

    it("updateTZDropdown prefers injected documentRef over global document", () => {
        const globalQuickSelect = createElementStub("select");
        const globalPlaceholder = createElementStub("option");
        globalQuickSelect.options = [globalPlaceholder];
        const injectedQuickSelect = createElementStub("select");
        const injectedPlaceholder = createElementStub("option");
        injectedQuickSelect.options = [injectedPlaceholder];
        const globalDoc = createDocumentStub({
            "tz-quick-select": globalQuickSelect
        });
        const injectedDoc = createDocumentStub({
            "tz-quick-select": injectedQuickSelect
        });
        const module = loadTimezoneSearchModule({
            document: globalDoc
        });
        const service = module.createService({
            documentRef: injectedDoc,
            TZ_DATABASE: [
                {
                    zone: "Asia/Seoul",
                    name: "Korea",
                    city: "Seoul",
                    name_en: "Korea",
                    city_en: "Seoul"
                }
            ],
            ZONE_MAP: {
                "Asia/Seoul": "KST"
            },
            ...createOffsetAndAbbrDeps()
        });

        service.updateTZDropdown();

        expect(injectedQuickSelect.options.length).toBeGreaterThan(1);
        expect(globalQuickSelect.options.length).toBe(1);
    });

    it("updateTZDropdown prefers injected getDocumentRefOrNull over global document", () => {
        const globalQuickSelect = createElementStub("select");
        const globalPlaceholder = createElementStub("option");
        globalQuickSelect.options = [globalPlaceholder];
        const injectedQuickSelect = createElementStub("select");
        const injectedPlaceholder = createElementStub("option");
        injectedQuickSelect.options = [injectedPlaceholder];
        const globalDoc = createDocumentStub({
            "tz-quick-select": globalQuickSelect
        });
        const injectedDoc = createDocumentStub({
            "tz-quick-select": injectedQuickSelect
        });
        const module = loadTimezoneSearchModule({
            document: globalDoc
        });
        const service = module.createService({
            getDocumentRefOrNull: () => injectedDoc,
            TZ_DATABASE: [
                {
                    zone: "Asia/Seoul",
                    name: "Korea",
                    city: "Seoul",
                    name_en: "Korea",
                    city_en: "Seoul"
                }
            ],
            ZONE_MAP: {
                "Asia/Seoul": "KST"
            },
            ...createOffsetAndAbbrDeps()
        });

        service.updateTZDropdown();

        expect(injectedQuickSelect.options.length).toBeGreaterThan(1);
        expect(globalQuickSelect.options.length).toBe(1);
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

    it("getSelectableTZEntryByKey can resolve a standard-list key", () => {
        const module = loadTimezoneSearchModule({
            Intl: {
                supportedValuesOf() {
                    return ["UTC"];
                }
            }
        });
        const service = module.createService(createOffsetAndAbbrDeps());

        const entry = service.getSelectableTZEntryByKey("std:UTC:0");

        expect(entry).toBeTruthy();
        expect(entry.kind).toBe("standard_list");
        expect(entry.zone).toBe("UTC");
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

    it("initSearchAndSelect wires full overlay open/tab/close actions", () => {
        const quickSelect = createElementStub("select");
        const placeholder = createElementStub("option");
        quickSelect.options = [placeholder];
        const showAllBtn = createElementStub("button");
        const overlay = createElementStub("div");
        overlay.style.display = "none";
        const list = createElementStub("div");
        const standardTabBtn = createElementStub("button");
        const countryTabBtn = createElementStub("button");
        const searchInput = createElementStub("input");
        const clearSearchBtn = createElementStub("button");
        const closeOverlayBtn = createElementStub("button");
        const doc = createDocumentStub({
            "tz-quick-select": quickSelect,
            "show-all-tz": showAllBtn,
            "full-tz-overlay": overlay,
            "full-tz-list": list,
            "tz-tab-standard": standardTabBtn,
            "tz-tab-country": countryTabBtn,
            "tz-search-input": searchInput,
            "tz-search-clear": clearSearchBtn,
            "close-overlay": closeOverlayBtn
        });

        const module = loadTimezoneSearchModule({
            document: doc,
            Intl: {
                supportedValuesOf() {
                    return ["UTC", "Asia/Seoul"];
                }
            }
        });
        const service = module.createService({
            TZ_DATABASE: [
                {
                    zone: "Asia/Seoul",
                    name: "Korea",
                    city: "Seoul",
                    name_en: "Korea",
                    city_en: "Seoul"
                }
            ],
            ZONE_MAP: {
                "Asia/Seoul": "KST"
            },
            ...createOffsetAndAbbrDeps()
        });

        service.initSearchAndSelect();
        showAllBtn.onclick();

        expect(overlay.style.display).toBe("flex");
        expect(list.children.length).toBeGreaterThan(0);
        expect(standardTabBtn.classList.contains("active")).toBe(true);
        expect(standardTabBtn.getAttribute("aria-selected")).toBe("true");
        expect(clearSearchBtn.disabled).toBe(true);

        searchInput.value = "UTC+09:00";
        searchInput.dispatchEvent({ type: "input", target: searchInput });
        expect(list.children).toHaveLength(1);
        expect(clearSearchBtn.disabled).toBe(false);

        countryTabBtn.dispatchEvent({ type: "click", target: countryTabBtn });
        expect(countryTabBtn.classList.contains("active")).toBe(true);
        expect(countryTabBtn.getAttribute("aria-selected")).toBe("true");

        clearSearchBtn.dispatchEvent({ type: "click", target: clearSearchBtn });
        expect(searchInput.value).toBe("");
        expect(clearSearchBtn.disabled).toBe(true);

        closeOverlayBtn.onclick();
        expect(overlay.style.display).toBe("none");
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

    it("filterTimezoneEntries matches title, abbreviation, and UTC offset", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            ...createOffsetAndAbbrDeps(),
            TZ_DATABASE: [
                {
                    zone: "Asia/Seoul",
                    name: "Korea",
                    city: "Seoul",
                    name_en: "Korea",
                    city_en: "Seoul"
                }
            ],
            ZONE_MAP: {
                "Asia/Seoul": "KST"
            }
        });

        const entries = service.getSelectableTZEntries();

        expect(service.filterTimezoneEntries(entries, "seoul")).toHaveLength(1);
        expect(service.filterTimezoneEntries(entries, "kst")).toHaveLength(1);
        expect(service.filterTimezoneEntries(entries, "utc+09:00")).toHaveLength(1);
        expect(service.filterTimezoneEntries(entries, "missing")).toHaveLength(0);
    });
});
