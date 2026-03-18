import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-select-services.js");

function loadMainSelectServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-select-services.js" });
    return sandbox.window.GTVMainSelectServices
        || sandbox.GTVMainSelectServices
        || sandbox.globalThis.GTVMainSelectServices;
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
