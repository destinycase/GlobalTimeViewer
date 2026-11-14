import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "timezone-search.js");
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

    it("renderFullTimezoneOverlayList prefers injected documentRef over global document", () => {
        const globalList = createElementStub("div");
        const injectedList = createElementStub("div");
        const module = loadTimezoneSearchModule({
            document: createDocumentStub({ "full-tz-list": globalList })
        });
        const injectedDoc = createDocumentStub({ "full-tz-list": injectedList });
        const service = module.createService({
            documentRef: injectedDoc,
            ...createOffsetAndAbbrDeps()
        });

        service.renderFullTimezoneOverlayList();

        expect(injectedList.children.length).toBe(1);
        expect(globalList.children.length).toBe(0);
    });
    it("renderFullTimezoneOverlayList prefers injected getDocumentRefOrNull over global document", () => {
        const globalList = createElementStub("div");
        const injectedList = createElementStub("div");
        const module = loadTimezoneSearchModule({
            document: createDocumentStub({ "full-tz-list": globalList })
        });
        const injectedDoc = createDocumentStub({ "full-tz-list": injectedList });
        const service = module.createService({
            getDocumentRefOrNull: () => injectedDoc,
            ...createOffsetAndAbbrDeps()
        });

        service.renderFullTimezoneOverlayList();

        expect(injectedList.children.length).toBe(1);
        expect(globalList.children.length).toBe(0);
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

    it("group list follows the table order, reorders, sets the base and removes rows", () => {
        const group = {
            name: "Work",
            baseTimezoneId: "tz-se",
            showUtcRow: true,
            utcRowOrder: 1,
            zones: [
                { id: "tz-se", type: "standard", zone: "Asia/Seoul", name_ko: "Seoul" },
                { id: "tz-ny", type: "standard", zone: "America/New_York", name_ko: "New York" },
                { id: "tz-c", type: "custom", abbr: "P530", name: "India", offH: 5, offM: 30 },
                { id: "tz-tk", type: "standard", zone: "Asia/Tokyo", name_ko: "Tokyo" }
            ]
        };
        const calls = { save: 0, render: 0, timeline: 0, adjust: 0 };
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            getCurrentGroup: () => group,
            savePersistence: () => { calls.save += 1; },
            renderList: () => { calls.render += 1; },
            renderTimelineFrame: () => { calls.timeline += 1; },
            updateTimeAdjustPanel: () => { calls.adjust += 1; },
            getZoneAbbreviation: (zone) => (zone.type === "custom" ? zone.abbr : zone.zone.split("/")[1].slice(0, 3).toUpperCase()),
            getZoneDisplayName: (zone) => zone.name || zone.name_ko,
            t: (key) => key,
            ...createOffsetAndAbbrDeps()
        });
        const order = () => service.getGroupListEntries().map((entry) => entry.id);

        // Base first, then the zones with the UTC row at utcRowOrder (same as the table).
        expect(order()).toEqual(["tz-se", "tz-ny", "utc", "tz-c", "tz-tk"]);
        const entries = service.getGroupListEntries();
        expect(entries[0]).toMatchObject({ isBase: true, name: "Seoul" });
        expect(entries[2]).toMatchObject({ isUtc: true, abbr: "UTC", name: "utc_name", offsetText: "UTC+00:00" });
        expect(entries[3]).toMatchObject({ abbr: "P530", name: "India", offsetText: "UTC+05:30" });

        // Drag result with the same top row: only the order below changes, the base stays.
        expect(service.applyGroupListOrder(["tz-se", "tz-tk", "tz-ny", "tz-c", "utc"])).toBe(true);
        expect(order()).toEqual(["tz-se", "tz-tk", "tz-ny", "tz-c", "utc"]);
        expect(group.baseTimezoneId).toBe("tz-se");
        expect(group.utcRowOrder).toBe(3);
        expect(group.zones.map((zone) => zone.id)).toEqual(["tz-se", "tz-tk", "tz-ny", "tz-c"]);
        expect(calls).toEqual({ save: 1, render: 1, timeline: 1, adjust: 0 });
        // Same order or a list that does not match the rows changes nothing.
        expect(service.applyGroupListOrder(["tz-se", "tz-tk", "tz-ny", "tz-c", "utc"])).toBe(false);
        expect(service.applyGroupListOrder(["tz-tk", "tz-ny"])).toBe(false);
        expect(calls.save).toBe(1);

        // Arrow keys on a handle move one step within the whole list.
        expect(service.moveGroupListEntry("utc", 1)).toBe(true);
        expect(order()).toEqual(["tz-se", "utc", "tz-tk", "tz-ny", "tz-c"]);
        expect(group.utcRowOrder).toBe(0);
        // Moving the top row down makes the next row the base.
        expect(service.moveGroupListEntry("tz-se", 2)).toBe(true);
        expect(group.baseTimezoneId).toBe("utc");
        expect(order()).toEqual(["utc", "tz-tk", "tz-se", "tz-ny", "tz-c"]);
        expect(calls.adjust).toBe(1);
        // A drag that puts a city on top makes it the base; the UTC row keeps its place below.
        expect(service.applyGroupListOrder(["tz-se", "utc", "tz-tk", "tz-ny", "tz-c"])).toBe(true);
        expect(group.baseTimezoneId).toBe("tz-se");
        expect(order()).toEqual(["tz-se", "utc", "tz-tk", "tz-ny", "tz-c"]);
        expect(group.showUtcRow).toBe(true);
        expect(group.utcRowOrder).toBe(0);
        expect(calls.adjust).toBe(2);
        calls.adjust = 0;

        // New base: it goes on top and the previous base sits right below it.
        expect(service.setGroupListBase("tz-ny")).toBe(true);
        expect(group.baseTimezoneId).toBe("tz-ny");
        expect(order()).toEqual(["tz-ny", "tz-se", "utc", "tz-tk", "tz-c"]);
        expect(calls.adjust).toBe(1);
        // UTC as base: the previous base comes first below it.
        expect(service.setGroupListBase("utc")).toBe(true);
        expect(group.baseTimezoneId).toBe("utc");
        expect(order()).toEqual(["utc", "tz-ny", "tz-se", "tz-tk", "tz-c"]);
        // Back to a city base: the UTC row returns right below it.
        expect(service.setGroupListBase("tz-c")).toBe(true);
        expect(order()).toEqual(["tz-c", "utc", "tz-ny", "tz-se", "tz-tk"]);
        expect(service.setGroupListBase("tz-c")).toBe(false);
        expect(service.setGroupListBase("missing")).toBe(false);

        // Remove: the base stays; the UTC row is hidden; a zone is deleted.
        expect(service.removeGroupListEntry("tz-c")).toBe(false);
        expect(service.removeGroupListEntry("utc")).toBe(true);
        expect(group.showUtcRow).toBe(false);
        expect(service.removeGroupListEntry("utc")).toBe(false);
        expect(service.removeGroupListEntry("tz-se")).toBe(true);
        expect(order()).toEqual(["tz-c", "tz-ny", "tz-tk"]);
        expect(group.zones.some((zone) => zone.id === "tz-se")).toBe(false);
    });

    it("group list rows use one moment for the abbreviation and the UTC offset", () => {
        const group = {
            baseTimezoneId: "tz-ny",
            showUtcRow: false,
            zones: [{ id: "tz-ny", type: "standard", zone: "America/New_York", name_ko: "New York" }]
        };
        const abbrDates = [];
        const offsetDates = [];
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            getCurrentGroup: () => group,
            // A stale date (as the Time Edit tab may hold) must not reach the abbreviation.
            getZoneAbbreviation: (_zone, date = new Date("2026-07-15T12:00:00Z")) => {
                abbrDates.push(date.getTime());
                return date.getUTCMonth() === 6 ? "EDT" : "EST";
            },
            getZoneDisplayName: (zone) => zone.name_ko,
            getTimezoneOffset: (_zone, date) => {
                offsetDates.push(date.getTime());
                return date.getUTCMonth() === 6 ? -240 : -300;
            },
            getBetterAbbr: () => "",
            t: (key) => key
        });

        const [row] = service.getGroupListEntries();
        expect(abbrDates).toHaveLength(1);
        expect(offsetDates).toHaveLength(1);
        expect(abbrDates[0]).toBe(offsetDates[0]);
        expect(Math.abs(abbrDates[0] - Date.now())).toBeLessThan(5000);
        expect(row.abbr === "EDT" ? row.offsetText === "UTC-04:00" : row.offsetText === "UTC-05:00").toBe(true);
    });

    it("initSearchAndSelect exits safely when the popup elements are missing", () => {
        const module = loadTimezoneSearchModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.initSearchAndSelect()).not.toThrow();
    });
    it("the UTC tile shows the hidden UTC row instead of adding an entry", () => {
        const activeGroup = { showUtcRow: false, utcRowOrder: "invalid", zones: [] };
        let saveCalls = 0;
        let renderCalls = 0;
        const added = [];
        const toasts = [];
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            getCurrentGroup: () => activeGroup,
            savePersistence: () => { saveCalls += 1; },
            renderList: () => { renderCalls += 1; },
            addTimezone: (zone) => { added.push(zone); return true; },
            showToast: (message) => { toasts.push(message); },
            t: (key) => key,
            ...createOffsetAndAbbrDeps()
        });
        const utcEntry = service.getSelectableTZEntryByKey("utc-row");
        expect(utcEntry).toMatchObject({ kind: "utc_row", abbr: "UTC", fixedOffsetMinutes: 0 });
        expect(service.getTimezoneEntryTitle(utcEntry)).toBe("overlay_utc_row_title");

        expect(service.addFromSearchWithData("utc-row")).toBe(true);
        expect(activeGroup.showUtcRow).toBe(true);
        expect(activeGroup.utcRowOrder).toBe(0);
        expect(saveCalls).toBe(1);
        expect(renderCalls).toBe(1);
        expect(added).toEqual([]);

        // Already shown: a notice, nothing else changes.
        expect(service.addFromSearchWithData("utc-row")).toBe(false);
        expect(toasts).toEqual(["toast_timezone_duplicate"]);
        expect(saveCalls).toBe(1);
        expect(added).toEqual([]);
    });
    it("initSearchAndSelect wires full overlay open/tab/close actions", () => {
        const showAllBtn = createElementStub("button");
        const overlay = createElementStub("div");
        overlay.style.display = "none";
        const list = createElementStub("div");
        const countryTabBtn = createElementStub("button");
        const searchInput = createElementStub("input");
        const clearSearchBtn = createElementStub("button");
        const closeOverlayBtn = createElementStub("button");
        const customTabBtn = createElementStub("button");
        const customPanel = createElementStub("div");
        customPanel.style.display = "none";
        const customAbbr = createElementStub("input");
        let customFocused = 0;
        customAbbr.focus = () => { customFocused += 1; };
        const customName = createElementStub("input");
        const customOffH = createElementStub("select");
        const customOffM = createElementStub("select");
        const doc = createDocumentStub({
            "custom-name": customName,
            "custom-off-h": customOffH,
            "custom-off-m": customOffM,
            "tz-tab-custom": customTabBtn,
            "tz-custom-panel": customPanel,
            "custom-abbr": customAbbr,
            "show-all-tz": showAllBtn,
            "full-tz-overlay": overlay,
            "full-tz-list": list,
            "tz-tab-country": countryTabBtn,
            "tz-search-input": searchInput,
            "tz-search-clear": clearSearchBtn,
            "close-overlay": closeOverlayBtn
        });

        const keyListeners = [];
        doc.addEventListener = (type, handler) => { if (type === "keydown") keyListeners.push(handler); };
        const pressKey = (key) => keyListeners.forEach((handler) => handler({ key, preventDefault() { } }));
        const module = loadTimezoneSearchModule({ document: doc });
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
            t: (key) => key,
            ...createOffsetAndAbbrDeps()
        });

        service.initSearchAndSelect();
        // Esc does nothing while the popup is closed.
        pressKey("Escape");
        expect(overlay.style.display).toBe("none");
        showAllBtn.onclick();

        expect(overlay.style.display).toBe("flex");
        // The group list tab opens first; the presets tab shows the UTC tile, then the cities.
        expect(countryTabBtn.classList.contains("active")).toBe(false);
        expect(list.style.display).toBe("none");
        countryTabBtn.dispatchEvent({ type: "click", target: countryTabBtn });
        expect(countryTabBtn.classList.contains("active")).toBe(true);
        expect(countryTabBtn.getAttribute("aria-selected")).toBe("true");
        expect(list.children.map((item) => item.children[0].textContent)).toEqual(["overlay_utc_row_title", "Korea - Seoul"]);
        expect(list.children[0].children[1].textContent).toBe("[UTC] [UTC +00:00]");
        expect(clearSearchBtn.disabled).toBe(true);

        searchInput.value = "UTC+09:00";
        searchInput.dispatchEvent({ type: "input", target: searchInput });
        expect(list.children.map((item) => item.children[0].textContent)).toEqual(["Korea - Seoul"]);
        expect(clearSearchBtn.disabled).toBe(false);
        searchInput.value = "Nowhere";
        searchInput.dispatchEvent({ type: "input", target: searchInput });
        expect(list.children[0].textContent).toBe("overlay_no_tz_results");

        clearSearchBtn.dispatchEvent({ type: "click", target: clearSearchBtn });
        expect(searchInput.value).toBe("");
        expect(clearSearchBtn.disabled).toBe(true);

        // The custom tab shows its form instead of the list and focuses the abbreviation field.
        customTabBtn.dispatchEvent({ type: "click", target: customTabBtn });
        expect(customTabBtn.classList.contains("active")).toBe(true);
        expect(countryTabBtn.classList.contains("active")).toBe(false);
        expect(customPanel.style.display).toBe("flex");
        expect(list.style.display).toBe("none");
        expect(customFocused).toBe(1);
        countryTabBtn.dispatchEvent({ type: "click", target: countryTabBtn });
        expect(customPanel.style.display).toBe("none");
        expect(list.style.display).toBe("");

        // Closing empties the custom form (abbreviation, name, offset back to +00:00).
        customAbbr.value = "ABC";
        customName.value = "Left over";
        customOffH.value = "9";
        customOffM.value = "30";
        closeOverlayBtn.onclick();
        expect([customAbbr.value, customName.value, customOffH.value, customOffM.value]).toEqual(["", "", "0", "0"]);
        expect(overlay.style.display).toBe("none");

        // A click inside the popup box keeps it open; a click on the area outside closes it.
        showAllBtn.onclick();
        customAbbr.value = "OUT";
        overlay.dispatchEvent({ type: "click", target: list });
        expect(overlay.style.display).toBe("flex");
        overlay.dispatchEvent({ type: "click", target: overlay });
        expect(overlay.style.display).toBe("none");
        expect(customAbbr.value).toBe("");

        // Esc closes the popup, but not while an in-page prompt is open above it.
        showAllBtn.onclick();
        const promptOverlay = createElementStub("div");
        promptOverlay.style.display = "flex";
        const getById = doc.getElementById;
        doc.getElementById = (id) => (id === "app-prompt-overlay" ? promptOverlay : getById(id));
        pressKey("Escape");
        expect(overlay.style.display).toBe("flex");
        promptOverlay.style.display = "none";
        pressKey("Enter");
        expect(overlay.style.display).toBe("flex");
        pressKey("Escape");
        expect(overlay.style.display).toBe("none");
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

    it("filterTimezoneEntries treats boolean fixed offsets as non-fixed", () => {
        const module = loadTimezoneSearchModule();
        const service = module.createService({
            getTimezoneOffset: (zone) => (zone === "Asia/Seoul" ? 540 : Number.NaN),
            getBetterAbbr: () => "KST"
        });

        const entries = [{
            kind: "country_region",
            name: "Korea",
            city: "Seoul",
            name_en: "Korea",
            city_en: "Seoul",
            zone: "Asia/Seoul",
            abbr: "KST",
            fixedOffsetMinutes: false
        }];

        expect(service.filterTimezoneEntries(entries, "utc+09:00")).toHaveLength(1);
        expect(service.filterTimezoneEntries(entries, "utc+00:00")).toHaveLength(0);
    });
});
