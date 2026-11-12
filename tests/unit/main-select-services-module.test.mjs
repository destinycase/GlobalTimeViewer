import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-select-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainSelectServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainSelectServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainSelectServices || globalThis.GTVMainSelectServices;
}

function createOptionElement() {
    return { value: "", textContent: "", tagName: "OPTION" };
}

function createSelectElement() {
    return {
        options: [],
        dataset: {},
        style: { width: "" },
        textContent: "",
        value: "",
        appendChild(option) {
            this.options.push(option);
        }
    };
}

describe("GTV main select services module", () => {
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
    it("adjusts select width using measured option labels", () => {
        const moduleApi = loadMainSelectServicesModule();
        const select = createSelectElement();
        select.options = [{ textContent: "short" }, { textContent: "long label text" }];

        const service = moduleApi.createService({
            getDocumentRef: () => ({
                createElement: (tag) => {
                    if (tag === "canvas") {
                        return {
                            getContext: () => ({
                                font: "",
                                measureText: (text) => ({ width: text.length * 6 })
                            })
                        };
                    }
                    return createOptionElement();
                }
            }),
            getComputedStyle: () => ({
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "14px",
                fontFamily: "Arial"
            })
        });

        service.adjustSelectWidthForContent(select, 100);

        expect(select.dataset.minWidth).toBe("100");
        // No DOM to measure in: estimate 15 chars * 6 = 90, + 46 (no padding/border info) + 26 arrow.
        expect(select.style.width).toBe("162px");
    });

    it("renders base-time options and persists when selected timezone changes", () => {
        const moduleApi = loadMainSelectServicesModule();
        const baseSelect = createSelectElement();
        let persistedCount = 0;
        let selectedBaseId = "";
        const service = moduleApi.createService({
            getDocumentRef: () => ({
                getElementById: (id) => (id === "base-time-select" ? baseSelect : null),
                createElement: (tag) => {
                    if (tag === "canvas") {
                        return {
                            getContext: () => ({
                                font: "",
                                measureText: () => ({ width: 40 })
                            })
                        };
                    }
                    return createOptionElement();
                }
            }),
            getComputedStyle: () => ({
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "14px",
                fontFamily: "Arial"
            }),
            ensureBaseTimezoneSelection: () => { },
            getCurrentGroupBaseTimezoneId: () => "missing-id",
            isCurrentGroupUtcRowVisible: () => false,
            getCurrentGroupZones: () => ([
                { id: "tz-a", zone: "Asia/Seoul" },
                { id: "tz-b", zone: "Europe/London" }
            ]),
            getZoneAbbreviation: (tz) => (tz.id === "tz-a" ? "KST" : "GMT"),
            getZoneDisplayName: (tz) => tz.zone,
            setCurrentGroupBaseTimezoneId: (value) => {
                selectedBaseId = value;
                return true;
            },
            savePersistence: () => {
                persistedCount += 1;
            },
            t: (key) => key
        });

        service.renderBaseTimeSelect();

        expect(baseSelect.options).toHaveLength(2);
        expect(baseSelect.options[0].textContent).toBe("[KST] Asia/Seoul");
        expect(baseSelect.value).toBe("tz-a");
        expect(selectedBaseId).toBe("tz-a");
        expect(persistedCount).toBe(1);
    });

    it("refreshes both select widths via documentRef fallback path", () => {
        const moduleApi = loadMainSelectServicesModule();
        const quickSelect = createSelectElement();
        quickSelect.options = [{ textContent: "UTC" }, { textContent: "Pacific Time" }];
        const baseSelect = createSelectElement();
        baseSelect.options = [{ textContent: "UTC" }, { textContent: "Asia/Seoul" }];

        const service = moduleApi.createService({
            documentRef: {
                getElementById: (id) => {
                    if (id === "tz-quick-select") return quickSelect;
                    if (id === "base-time-select") return baseSelect;
                    return null;
                },
                createElement: (tag) => {
                    if (tag === "canvas") {
                        return {
                            getContext: () => ({
                                font: "",
                                measureText: (text) => ({ width: text.length * 7 })
                            })
                        };
                    }
                    return createOptionElement();
                }
            }
        });

        service.refreshSelectWidths();

        expect(quickSelect.style.width.endsWith("px")).toBe(true);
        // The base time select is in the group settings popup and keeps its stylesheet width.
        expect(baseSelect.style.width || "").toBe("");
    });

    it("sizes the city select to the browser's own width for it, measured on a hidden copy", () => {
        const moduleApi = loadMainSelectServicesModule();
        const appended = [];
        const parent = { appendChild: (node) => appended.push(node) };
        let copyRemoved = false;
        const quickSelect = createSelectElement();
        quickSelect.parentElement = parent;
        quickSelect.cloneNode = () => ({
            style: { cssText: "" },
            offsetWidth: 309.4,
            removeAttribute() { },
            remove() { copyRemoved = true; }
        });
        const service = moduleApi.createService({
            documentRef: { getElementById: (id) => (id === "tz-quick-select" ? quickSelect : null), createElement: () => ({}) }
        });

        service.refreshSelectWidths();

        expect(quickSelect.style.width).toBe("310px");
        expect(appended).toHaveLength(1);
        expect(appended[0].style.cssText).toContain("visibility:hidden");
        expect(appended[0].style.cssText).toContain("width:auto");
        expect(copyRemoved).toBe(true);
    });

    it("estimates the city select width from its longest option when it cannot be measured", () => {
        const moduleApi = loadMainSelectServicesModule();
        const quickSelect = createSelectElement();
        quickSelect.options = [{ textContent: "Short" }, { textContent: "  A much longer city name  " }];
        const measure = (text) => ({ width: text.length * 10 });
        const service = moduleApi.createService({
            getComputedStyle: () => ({
                fontStyle: "normal", fontWeight: "400", fontSize: "14px", fontFamily: "sans-serif",
                paddingLeft: "10px", paddingRight: "34px", borderLeftWidth: "1px", borderRightWidth: "1px"
            }),
            documentRef: {
                getElementById: (id) => (id === "tz-quick-select" ? quickSelect : null),
                createElement: () => ({ getContext: () => ({ font: "", measureText: measure }) })
            }
        });

        service.refreshSelectWidths();
        // "A much longer city name" = 23 chars * 10 = 230, + 46 padding/border + 26 arrow.
        expect(quickSelect.style.width).toBe("302px");

        // Shorter options (another language) shrink it back, but not below the minimum.
        quickSelect.options = [{ textContent: "UTC" }];
        service.refreshSelectWidths();
        expect(quickSelect.style.width).toBe("118px");
    });

    it("uses safe fallback dependencies when rendering base-time select", () => {
        const moduleApi = loadMainSelectServicesModule();
        const baseSelect = createSelectElement();
        const service = moduleApi.createService({
            documentRef: {
                getElementById: (id) => (id === "base-time-select" ? baseSelect : null),
                createElement: (tag) => {
                    if (tag === "canvas") {
                        return {
                            getContext: () => ({
                                font: "",
                                measureText: (text) => ({ width: text.length * 6 })
                            })
                        };
                    }
                    return createOptionElement();
                }
            }
        });

        expect(() => service.renderBaseTimeSelect()).not.toThrow();
        expect(baseSelect.options[0]?.value).toBe("utc");
    });

    it("falls back to no-op persistence and setter when selected id changes", () => {
        const moduleApi = loadMainSelectServicesModule();
        const baseSelect = createSelectElement();
        const service = moduleApi.createService({
            getDocumentRef: () => ({
                getElementById: (id) => (id === "base-time-select" ? baseSelect : null),
                createElement: (tag) => {
                    if (tag === "canvas") {
                        return {
                            getContext: () => ({
                                font: "",
                                measureText: () => ({ width: 40 })
                            })
                        };
                    }
                    return createOptionElement();
                }
            }),
            getCurrentGroupBaseTimezoneId: () => "missing-id",
            getCurrentGroupZones: () => ([{ id: "tz-z", zone: "Z" }])
        });

        expect(() => service.renderBaseTimeSelect()).not.toThrow();
        expect(baseSelect.value).toBe("utc");
        expect(baseSelect.options.some((opt) => opt.value === "tz-z")).toBe(true);
    });
});
