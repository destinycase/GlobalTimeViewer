import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-row-order-services.js");

function loadMainRowOrderServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-row-order-services.js" });
    return sandbox.window.GTVMainRowOrderServices
        || sandbox.GTVMainRowOrderServices
        || sandbox.globalThis.GTVMainRowOrderServices;
}

describe("GTV main row order services module", () => {
    it("reorders active group rows and persists order", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const groups = [{
            zones: [{ id: "tz-a" }, { id: "tz-b" }],
            showUtcRow: false,
            utcRowOrder: 99
        }];
        let persistedCount = 0;
        const service = moduleApi.createService({
            getGroups: () => groups,
            getActiveGroupId: () => 0,
            getCurrentGroupBaseTimezoneId: () => "tz-a",
            getPersistenceService: () => ({
                savePersistence: () => {
                    persistedCount += 1;
                }
            }),
            getDocumentRef: () => ({
                querySelectorAll: () => ([
                    { id: "tz-row-tz-b" },
                    { id: "tz-row-utc" },
                    { id: "tz-row-tz-a" }
                ])
            })
        });

        service.saveOrder();

        expect(groups[0].zones.map((zone) => zone.id)).toEqual(["tz-b", "tz-a"]);
        expect(groups[0].showUtcRow).toBe(true);
        expect(groups[0].utcRowOrder).toBe(1);
        expect(persistedCount).toBe(1);
    });

    it("binds drag handlers through initDragAndDrop", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const container = {
            ondragover: null,
            ondrop: null,
            ondragleave: null,
            querySelector: () => null,
            querySelectorAll: () => [],
            contains: () => false
        };
        const service = moduleApi.createService({
            getDocumentRef: () => ({
                getElementById: () => container
            })
        });

        service.initDragAndDrop();

        expect(typeof container.ondragover).toBe("function");
        expect(typeof container.ondrop).toBe("function");
        expect(typeof container.ondragleave).toBe("function");
    });
});
