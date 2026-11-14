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
    it("checks the group's base timezone and touches no select element", () => {
        const moduleApi = loadMainSelectServicesModule();
        let ensureCalls = 0;
        let documentReads = 0;
        const service = moduleApi.createService({
            ensureBaseTimezoneSelection: () => { ensureCalls += 1; },
            getDocumentRef: () => { documentReads += 1; return null; }
        });

        expect(service.renderBaseTimeSelect()).toBe(undefined);
        expect(ensureCalls).toBe(1);
        expect(documentReads).toBe(0);
        expect(Object.keys(service)).toEqual(["renderBaseTimeSelect"]);
    });

    it("works without dependencies", () => {
        const moduleApi = loadMainSelectServicesModule();
        const service = moduleApi.createService();
        expect(() => service.renderBaseTimeSelect()).not.toThrow();
    });
});
