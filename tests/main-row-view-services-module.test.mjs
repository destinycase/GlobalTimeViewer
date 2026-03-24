import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-row-view-services.js");
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
            const shouldAdd = force === undefined ? !values.has(key) : !!force;
            if (shouldAdd) values.add(key);
            else values.delete(key);
            return shouldAdd;
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function loadMainRowViewServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRowViewServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRowViewServices || globalThis.GTVMainRowViewServices;
}

function createMockRow(id = "tz-row-tz-a") {
    const zoneCodeEl = { textContent: "", classList: createClassList() };
    const zoneNameEl = { textContent: "" };
    const offsetTextEl = { textContent: "" };
    const periodEl = { textContent: "" };
    const periodTimeEl = { textContent: "" };
    const inputs = [
        { dataset: { inputMode: "datetime" }, value: "keep-0" },
        { dataset: { inputMode: "time" }, value: "keep-1" }
    ];
    const dayBadges = [{ textContent: "", className: "" }, { textContent: "", className: "" }];
    const dnIcons = [{ textContent: "", title: "" }, { textContent: "", title: "" }];

    const row = {
        id,
        querySelector(selector) {
            if (selector === ".zone-code") return zoneCodeEl;
            if (selector === ".zone-name") return zoneNameEl;
            if (selector === ".offset-text") return offsetTextEl;
            if (selector === ".period-days-text") return periodEl;
            if (selector === ".period-time-text") return periodTimeEl;
            return null;
        },
        querySelectorAll(selector) {
            if (selector === '.time-input[data-slot="0"]') return [inputs[0]];
            if (selector === '.time-input[data-slot="1"]') return [inputs[1]];
            if (selector === ".day-slot-0") return [dayBadges[0]];
            if (selector === ".day-slot-1") return [dayBadges[1]];
            if (selector === ".dn-slot-0") return [dnIcons[0]];
            if (selector === ".dn-slot-1") return [dnIcons[1]];
            return [];
        }
    };

    return { row, zoneCodeEl, zoneNameEl, offsetTextEl, periodEl, periodTimeEl, inputs, dayBadges, dnIcons };
}

describe("GTV main row view services module", () => {
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
    it("caches row view state by row id", () => {
        const moduleApi = loadMainRowViewServicesModule();
        const { row } = createMockRow();
        const service = moduleApi.createService();

        const stateA = service.getRowViewState(row);
        const stateB = service.getRowViewState(row);

        expect(stateA).toBe(stateB);
    });

    it("updates row DOM fields from timezone snapshot", () => {
        const moduleApi = loadMainRowViewServicesModule();
        const rowId = "tz-a";
        const mock = createMockRow(`tz-row-${rowId}`);
        const documentRef = {
            activeElement: mock.inputs[0],
            getElementById: (id) => (id === `tz-row-${rowId}` ? mock.row : null)
        };
        const service = moduleApi.createService({
            getDocumentRef: () => documentRef,
            getSnapshotFormatService: () => ({
                buildTimezoneComputedSnapshot: () => ({
                    timezone: "KST",
                    offset: "UTC+09:00",
                    times: ["2026-03-17 10:20:30", "2026-03-17 11:22:33"],
                    dates: ["2026-03-17", "2026-03-17"],
                    clocks: ["10:20:30", "11:22:33"],
                    dayNames: ["Sun", "Mon"],
                    dayNightIcons: ["DAY", "NIGHT"],
                    periodDays: "+1 day",
                    periodTime: "01:00"
                })
            }),
            getGlobalTime: (slotIdx) => (slotIdx === 0 ? new Date("2026-03-17T00:00:00Z") : null),
            getZoneDisplayNameForUiAtDate: () => "Seoul [DST]",
            getCurrentLang: () => "en",
            getI18nData: () => ({
                en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
            }),
            isRealtime: () => false,
            getSlotCount: () => 2,
            normalizeDayNightMarker: (value) => String(value || "").toUpperCase(),
            getDayNightGlyph: (value) => (value === "NIGHT" ? "\uD83C\uDF19" : "\u2600\uFE0F"),
            t: (key) => key
        });

        service.updateRow(rowId, { id: rowId, type: "standard", zone: "Asia/Seoul" });

        expect(mock.zoneCodeEl.textContent).toBe("KST");
        expect(mock.zoneCodeEl.classList.contains("zone-code-standard")).toBe(true);
        expect(mock.zoneCodeEl.classList.contains("zone-code-custom")).toBe(false);
        expect(mock.zoneNameEl.textContent).toBe("Seoul [DST]");
        expect(mock.offsetTextEl.textContent).toBe("UTC+09:00");
        expect(mock.inputs[0].value).toBe("keep-0");
        expect(mock.inputs[1].value).toBe("11:22:33");
        expect(mock.dayBadges[0].className).toContain("day-sun");
        expect(mock.dayBadges[1].className).not.toContain("day-sat");
        expect(mock.dnIcons[0].title).toBe("dn_day");
        expect(mock.dnIcons[1].title).toBe("dn_night");
        expect(mock.periodEl.textContent).toBe("+1 day");
        expect(mock.periodTimeEl.textContent).toBe("01:00");
    });

    it("marks custom timezone rows with custom zone-code class", () => {
        const moduleApi = loadMainRowViewServicesModule();
        const rowId = "tz-c1";
        const mock = createMockRow(`tz-row-${rowId}`);
        const documentRef = {
            activeElement: null,
            getElementById: (id) => (id === `tz-row-${rowId}` ? mock.row : null)
        };
        const service = moduleApi.createService({
            getDocumentRef: () => documentRef,
            getSnapshotFormatService: () => ({
                buildTimezoneComputedSnapshot: () => ({
                    timezone: "MYTZ",
                    offset: "UTC+09:00",
                    times: ["2026-03-17 10:20:30"],
                    dates: ["2026-03-17"],
                    clocks: ["10:20:30"],
                    dayNames: ["Tue"],
                    dayNightIcons: ["DAY"],
                    periodDays: "-",
                    periodTime: "-"
                })
            }),
            getGlobalTime: () => new Date("2026-03-17T00:00:00Z"),
            getZoneDisplayName: () => "Custom Name",
            getCurrentLang: () => "en",
            getI18nData: () => ({ en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } }),
            isRealtime: () => true,
            getSlotCount: () => 1,
            normalizeDayNightMarker: (value) => String(value || "").toUpperCase(),
            getDayNightGlyph: () => "\u2600\uFE0F",
            t: (key) => key
        });

        service.updateRow(rowId, { id: rowId, type: "custom", abbr: "MYTZ", name: "Custom Name" });

        expect(mock.zoneCodeEl.classList.contains("zone-code-custom")).toBe(true);
        expect(mock.zoneCodeEl.classList.contains("zone-code-standard")).toBe(false);
    });
});
