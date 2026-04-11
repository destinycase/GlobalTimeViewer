import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "vendor", "luxon-global-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

const globalKeys = ["window", "luxon"];
const previousGlobals = new Map();

function backupGlobals() {
    previousGlobals.clear();
    globalKeys.forEach((key) => {
        previousGlobals.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });
}

function restoreGlobals() {
    previousGlobals.forEach((entry, key) => {
        if (!entry.exists) {
            delete globalThis[key];
            return;
        }
        globalThis[key] = entry.value;
    });
    previousGlobals.clear();
}

function loadBridge({ windowRef, globalLuxon }) {
    backupGlobals();

    if (windowRef === undefined) delete globalThis.window;
    else globalThis.window = windowRef;

    if (globalLuxon === undefined) delete globalThis.luxon;
    else globalThis.luxon = globalLuxon;

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
}

describe("luxon global bridge", () => {
    afterEach(() => {
        delete require.cache[MODULE_ID];
        restoreGlobals();
    });

    it("copies global luxon onto window when window.luxon is missing", () => {
        const globalLuxon = { DateTime: { now: () => 0 } };
        const windowRef = {};

        loadBridge({ windowRef, globalLuxon });

        expect(windowRef.luxon).toBe(globalLuxon);
    });

    it("keeps existing window.luxon reference when already present", () => {
        const globalLuxon = { DateTime: { now: () => 0 } };
        const existingWindowLuxon = { DateTime: { now: () => 1 } };
        const windowRef = { luxon: existingWindowLuxon };

        loadBridge({ windowRef, globalLuxon });

        expect(windowRef.luxon).toBe(existingWindowLuxon);
    });
});
