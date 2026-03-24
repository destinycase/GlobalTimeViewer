import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-select-services.js");
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
});
