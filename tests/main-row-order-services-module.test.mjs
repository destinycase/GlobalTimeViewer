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

    it("captures rects, computes getAfter target, and animates moved rows", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const frameCallbacks = [];
        const rowA = {
            style: {},
            getBoundingClientRect: () => ({ top: 20, height: 10 }),
            addEventListener(type, handler) {
                if (type === "transitionend") handler();
            }
        };
        const rowB = {
            style: {},
            getBoundingClientRect: () => ({ top: 50, height: 10 }),
            addEventListener(type, handler) {
                if (type === "transitionend") handler();
            }
        };
        const container = {
            querySelectorAll: () => [rowA, rowB]
        };

        const service = moduleApi.createService({
            requestUiFrame: (cb) => {
                frameCallbacks.push(cb);
                return frameCallbacks.length;
            }
        });

        const rectMap = service.captureReorderableRowRects(container);
        expect(rectMap.size).toBe(2);
        expect(service.getAfter(container, 23)).toBe(rowA);
        expect(service.getAfter(container, 200)).toBe(null);

        rowA.getBoundingClientRect = () => ({ top: 5, height: 10 });
        rowB.getBoundingClientRect = () => ({ top: 50.2, height: 10 });
        service.animateReorderTransition(container, rectMap);
        expect(frameCallbacks.length).toBe(1);
        frameCallbacks[0]();
        expect(rowA.style.transition).toBe("transform 170ms ease");
        expect(rowA.style.transform).toBe("");
        expect(rowB.style.transition || "").toBe("");
    });

    it("reorders rows via dragover and cancels pending frame on dragleave outside", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const scheduled = new Map();
        const cancelled = [];
        const NodeCtor = class FakeNode {};
        const draggingRow = {
            id: "tz-row-tz-a",
            style: {},
            nextElementSibling: null,
            getBoundingClientRect: () => ({ top: 10, height: 10 }),
            addEventListener() {}
        };
        const rowB = {
            id: "tz-row-tz-b",
            style: {},
            getBoundingClientRect: () => ({ top: 60, height: 10 }),
            addEventListener() {}
        };
        let dragging = draggingRow;
        let insertArgs = null;
        const container = {
            ondragover: null,
            ondrop: null,
            ondragleave: null,
            querySelector(selector) {
                if (selector === ".time-row.dragging") return dragging;
                return null;
            },
            querySelectorAll() {
                return [rowB];
            },
            insertBefore(node, before) {
                insertArgs = [node, before];
            },
            contains() {
                return false;
            }
        };

        const service = moduleApi.createService({
            NodeCtor,
            requestUiFrame: (cb) => {
                const id = scheduled.size + 1;
                scheduled.set(id, () => {
                    scheduled.delete(id);
                    cb();
                });
                return id;
            },
            cancelUiFrame: (id) => {
                cancelled.push(id);
                scheduled.delete(id);
            }
        });

        service.bindRowContainerDragAndDrop(container);
        expect(typeof container.ondragover).toBe("function");
        expect(typeof container.ondrop).toBe("function");
        expect(typeof container.ondragleave).toBe("function");

        const dragEvent = {
            clientY: 40,
            preventDefaultCalled: 0,
            preventDefault() {
                this.preventDefaultCalled += 1;
            }
        };
        container.ondragover(dragEvent);
        expect(scheduled.size).toBe(1);
        scheduled.get(1)();
        expect(insertArgs).toEqual([draggingRow, rowB]);
        expect(dragEvent.preventDefaultCalled).toBe(1);

        const dropEvent = {
            preventDefaultCalled: 0,
            preventDefault() {
                this.preventDefaultCalled += 1;
            }
        };
        container.ondrop(dropEvent);
        expect(dropEvent.preventDefaultCalled).toBe(1);

        container.ondragover({ clientY: 35, preventDefault() {} });
        expect(scheduled.size).toBe(1);
        container.ondragleave({ relatedTarget: new NodeCtor() });
        expect(cancelled).toEqual([1]);

        dragging = null;
        expect(() => container.ondragover({ clientY: 1, preventDefault() {} })).not.toThrow();
        expect(() => container.ondrop({ preventDefault() {} })).not.toThrow();
    });

    it("handles fallback deps and UTC-base ordering branches", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const groups = [
            {
                zones: [{ id: "tz-c" }, { id: "tz-a" }, { id: "tz-b" }],
                showUtcRow: false,
                utcRowOrder: 99
            }
        ];
        let persisted = 0;
        const documentRef = {
            querySelectorAll: () => ([
                { id: "tz-row-tz-b" },
                { id: "tz-row-tz-a" },
                { id: "tz-row-tz-missing" }
            ]),
            getElementById: () => null
        };
        const service = moduleApi.createService({
            groups,
            activeGroupId: 0,
            documentRef,
            persistenceService: {
                savePersistence() {
                    persisted += 1;
                }
            }
        });

        service.saveOrderForContainer("#clocks-container");
        expect(groups[0].zones.map((zone) => zone.id)).toEqual(["tz-c", "tz-b", "tz-a"]);
        expect(groups[0].showUtcRow).toBe(true);
        expect(groups[0].utcRowOrder).toBe(0);
        expect(persisted).toBe(1);
    });

    it("safely no-ops when active group or document API is unavailable", () => {
        const moduleApi = loadMainRowOrderServicesModule();
        const serviceA = moduleApi.createService({
            getGroups: () => [],
            getActiveGroupId: () => 3
        });
        expect(() => serviceA.saveOrderForContainer("#clocks-container")).not.toThrow();

        const serviceB = moduleApi.createService({
            getGroups: () => ([{ zones: [] }]),
            getActiveGroupId: () => 0,
            getDocumentRef: () => null
        });
        expect(() => serviceB.saveOrderForContainer("#clocks-container")).not.toThrow();

        const serviceC = moduleApi.createService({
            getDocumentRef: () => null
        });
        expect(() => serviceC.initDragAndDrop()).not.toThrow();
        expect(() => serviceC.bindRowContainerDragAndDrop(null)).not.toThrow();
    });
});
