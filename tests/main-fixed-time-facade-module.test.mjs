import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-fixed-time-facade.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFixedTimeFacadeModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainFixedTimeFacade", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFixedTimeFacade || globalThis.GTVMainFixedTimeFacade;
}

describe("GTV main fixed-time facade module", () => {
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
    it("delegates fixed-time core/actions methods through service bridge", async () => {
        const moduleApi = loadMainFixedTimeFacadeModule();
        const fixedTimeCoreService = {
            getFixedTimeSlotParts: () => ({ hour: 9 }),
            getFixedTimeSlotHeaderLabel: () => "Header",
            getFixedTimeDisplayPartsEnabled: () => ({ dn: true, time: true, weekday: false })
        };
        const fixedTimeActionsService = {
            getFixedTimeCopyState: () => ({ order: ["timezone"], enabled: { timezone: true }, timePartsEnabled: { time: true } }),
            getFixedTimePreviewCopyText: () => "preview",
            copyFixedTimeSlotColumn: async () => true
        };
        const callServiceMethod = (_serviceName, serviceRef, methodName, args = [], options = {}) => {
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName](...args);
            }
            return options.fallback;
        };

        const service = moduleApi.createService({
            callServiceMethod,
            getFixedTimeCoreService: () => fixedTimeCoreService,
            getFixedTimeActionsService: () => fixedTimeActionsService,
            getCopyFormatOrderState: () => ["timezone"],
            getCopyFormatEnabledState: () => ({ timezone: true }),
            getCopyTimePartsEnabledState: () => ({ time: true }),
            sanitizeCopyFormatOrderForContext: (value) => value,
            sanitizeCopyFormatEnabledForContext: (value) => value,
            sanitizeTimePartsEnabledForContext: (value) => value,
            t: (key) => key
        });

        expect(service.getFixedTimeSlotParts({})).toEqual({ hour: 9 });
        expect(service.getFixedTimeSlotHeaderLabel({}, 0, 1)).toBe("Header");
        expect(service.getFixedTimeDisplayPartsEnabled()).toEqual({ dn: true, time: true, weekday: false });
        expect(service.getFixedTimeCopyState()).toEqual({
            order: ["timezone"],
            enabled: { timezone: true },
            timePartsEnabled: { time: true }
        });
        expect(service.getFixedTimePreviewCopyText()).toBe("preview");
        await expect(service.copyFixedTimeSlotColumn(0)).resolves.toBe(true);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("returns expected fallback values and binds custom date picker safely", () => {
        const moduleApi = loadMainFixedTimeFacadeModule();
        const callServiceMethod = (_serviceName, _serviceRef, _methodName, _args = [], options = {}) => options.fallback;
        const cdpCalls = [];
        const windowRef = {
            CustomDatePicker: function MockDatePicker(input, options) {
                cdpCalls.push([input, options]);
                this.destroy = () => { };
            }
        };
        const documentRef = {
            documentElement: {
                lang: "ko",
                getAttribute: (name) => (name === "data-theme" ? "light" : "")
            }
        };
        const service = moduleApi.createService({
            callServiceMethod,
            getCopyFormatOrderState: () => ["timezone", "time"],
            getCopyFormatEnabledState: () => ({ timezone: true, time: false }),
            getCopyTimePartsEnabledState: () => ({ dn: true }),
            sanitizeCopyFormatOrderForContext: () => ["timezone"],
            sanitizeCopyFormatEnabledForContext: () => ({ timezone: true }),
            sanitizeTimePartsEnabledForContext: () => ({ dn: true }),
            getWindowRef: () => windowRef,
            getDocumentRef: () => documentRef,
            t: (key) => key
        });

        expect(service.getFixedTimeSlotParts({})).toBe(null);
        expect(service.formatFixedTimeForTimezoneAtUtc(new Date(), {})).toBe("--:--:--");
        expect(service.getLocalizedWeekdayNameByIndex(1)).toBe("");
        expect(service.getFixedTimeSlotHeaderLabel({}, 1, 2)).toBe("th_fixed_time 2");
        expect(service.getFixedTimeCopyState()).toEqual({
            order: ["timezone"],
            enabled: { timezone: true },
            timePartsEnabled: { dn: true }
        });
        expect(service.applyFixedTimeSlotByTimezoneInput(0, {}, "09:00", new Date())).toBe(false);
        expect(service.removeFixedTimeSlot("x")).toBe(undefined);

        const input = { value: "2026-03-21 09:00:00" };
        service.bindCustomDatePickerForInput(input, null, { preserveValue: true, type: "datetime" });
        expect(cdpCalls).toHaveLength(1);
        expect(input.value).toBe("2026-03-21 09:00:00");
    });

    it("covers default dependency paths with fallback bridge and missing date picker module", () => {
        const moduleApi = loadMainFixedTimeFacadeModule();
        const warnings = [];
        const originalWarn = console.warn;
        console.warn = (...args) => {
            warnings.push(args.join(" "));
        };
        try {
            const service = moduleApi.createService({
                callServiceMethod: (_serviceName, _serviceRef, _methodName, _args = [], options = {}) => options.fallback
            });
            const input = { value: "", _cdp: null };

            expect(service.getFixedTimeDisplayPartsEnabled()).toEqual({ dn: true, time: true, weekday: true });
            expect(service.formatFixedTimePayloadText(null, null)).toBe("-");
            expect(service.getFixedTimeCopyState()).toEqual({
                order: [],
                enabled: {},
                timePartsEnabled: {}
            });
            expect(service.getFixedTimeSlotHeaderLabel({}, 2, 3)).toBe("th_fixed_time 3");
            service.bindCustomDatePickerForInput(input, null, {});
            expect(warnings.some((entry) => entry.includes("CustomDatePicker module is unavailable"))).toBe(true);
        } finally {
            console.warn = originalWarn;
        }
    });

    it("destroys previous picker and normalizes picker options when binding", () => {
        const moduleApi = loadMainFixedTimeFacadeModule();
        let destroyCalled = false;
        let ctorArgs = null;
        const windowRef = {
            CustomDatePicker: function MockDatePicker(input, options) {
                ctorArgs = { input, options };
                this.destroy = () => { };
            }
        };
        const documentRef = {
            documentElement: {
                lang: "en",
                getAttribute: () => "dark"
            }
        };
        const service = moduleApi.createService({
            callServiceMethod: (_serviceName, _serviceRef, _methodName, _args = [], options = {}) => options.fallback,
            getWindowRef: () => windowRef,
            getDocumentRef: () => documentRef
        });

        const input = {
            value: "2026-03-21 09:00:00",
            _cdp: { destroy: () => { destroyCalled = true; } }
        };
        service.bindCustomDatePickerForInput(input, null, { type: "invalid-type", preserveValue: false });

        expect(destroyCalled).toBe(true);
        expect(ctorArgs).not.toBe(null);
        expect(ctorArgs.options.type).toBe("datetime");
        expect(ctorArgs.options.lang).toBe("en");
        expect(ctorArgs.options.theme).toBe("dark");
    });

    it("uses injected consoleWarn fallback when date picker module is unavailable", () => {
        const moduleApi = loadMainFixedTimeFacadeModule();
        const warned = [];
        const service = moduleApi.createService({
            callServiceMethod: (_serviceName, _serviceRef, _methodName, _args = [], options = {}) => options.fallback,
            consoleWarn: (...args) => {
                warned.push(args);
            },
            getWindowRef: () => ({})
        });

        service.bindCustomDatePickerForInput({ value: "" }, null, {});

        expect(warned).toHaveLength(1);
        expect(String(warned[0][0])).toContain("CustomDatePicker module is unavailable");
    });
});
