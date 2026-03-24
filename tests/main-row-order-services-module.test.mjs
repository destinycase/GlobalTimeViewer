import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-row-order-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRowOrderServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRowOrderServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRowOrderServices || globalThis.GTVMainRowOrderServices;
}

describe("GTV main row order services module", () => {
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
