import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { expect, test } from "vitest";

const CALCULATOR_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator.js");
const calculatorCode = fs.readFileSync(CALCULATOR_MODULE_PATH, "utf8");

function createClassList(initial = "") {
    const values = new Set(String(initial).split(/\s+/).filter(Boolean));
    return {
        add(...tokens) {
            tokens.forEach((token) => values.add(String(token)));
        },
        remove(...tokens) {
            tokens.forEach((token) => values.delete(String(token)));
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function createElement({
    id = "",
    type = "text",
    value = "",
    textContent = "",
    className = "",
    attrs = {}
} = {}) {
    const listeners = new Map();
    const attributes = new Map(Object.entries(attrs));

    const el = {
        id,
        type,
        value,
        textContent,
        classList: createClassList(className),
        style: {},
        addEventListener(eventName, handler) {
            if (!listeners.has(eventName)) listeners.set(eventName, []);
            listeners.get(eventName).push(handler);
        },
        dispatch(eventName, extra = {}) {
            const handlers = listeners.get(eventName) || [];
            const event = { target: el, ...extra };
            if (typeof event.preventDefault !== "function") {
                event.preventDefault = () => { };
            }
            handlers.forEach((handler) => handler(event));
        },
        click() {
            el.dispatch("click");
        },
        focus() { },
        select() { },
        blur() {
            el.dispatch("blur");
        },
        getAttribute(name) {
            return attributes.has(name) ? attributes.get(name) : null;
        },
        setAttribute(name, valueToSet) {
            attributes.set(name, String(valueToSet));
        }
    };

    Object.defineProperty(el, "valueAsDate", {
        get() {
            if (!el.value) return null;
            if (el.type === "date") return new Date(`${el.value}T00:00:00`);
            return new Date(el.value);
        },
        set(dateObj) {
            if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
                el.value = "";
                return;
            }
            if (el.type === "date") {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                const day = String(dateObj.getDate()).padStart(2, "0");
                el.value = `${year}-${month}-${day}`;
                return;
            }
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const hour = String(dateObj.getHours()).padStart(2, "0");
            const minute = String(dateObj.getMinutes()).padStart(2, "0");
            const second = String(dateObj.getSeconds()).padStart(2, "0");
            el.value = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
        }
    });

    return el;
}

function createStorageStub() {
    const store = new Map();
    return {
        getItem(key) {
            return store.has(key) ? store.get(key) : null;
        },
        setItem(key, value) {
            store.set(String(key), String(value));
        },
        removeItem(key) {
            store.delete(String(key));
        }
    };
}

function createCalculatorContext() {
    const byId = new Map();
    const queryMap = new Map();
    const intervals = [];

    const register = (el) => {
        if (el.id) byId.set(el.id, el);
        return el;
    };

    const setQuery = (selector, list) => {
        queryMap.set(selector, list);
    };

    const periodStart = register(createElement({ id: "period-start", type: "date", value: "2026-03-07" }));
    const periodEnd = register(createElement({ id: "period-end", type: "date", value: "2026-03-08" }));
    const periodSwapBtn = register(createElement({ id: "period-swap-btn", type: "button" }));
    const periodRes = register(createElement({ id: "period-res", textContent: "" }));
    const periodHourRes = register(createElement({ id: "period-hour-res", textContent: "" }));
    const periodMinRes = register(createElement({ id: "period-min-res", textContent: "" }));
    const periodSecRes = register(createElement({ id: "period-sec-res", textContent: "" }));

    const offsetStart = register(createElement({ id: "offset-start", type: "date", value: "2026-03-07" }));
    const offVal = register(createElement({ id: "off-val", type: "number", value: "0" }));
    const offUnit = register(createElement({ id: "off-unit", type: "select-one", value: "day" }));
    const offDir = register(createElement({ id: "off-dir", type: "select-one", value: "after" }));
    const offsetRes = register(createElement({ id: "offset-res", type: "text", value: "-" }));

    const convDay = register(createElement({ id: "conv-day", type: "number", value: "" }));
    const convHour = register(createElement({ id: "conv-hour", type: "number", value: "" }));
    const convMin = register(createElement({ id: "conv-min", type: "number", value: "" }));
    const convSec = register(createElement({ id: "conv-sec", type: "number", value: "" }));

    const unixNowValue = register(createElement({ id: "unix-now-value", textContent: "0" }));
    const unixNowMsValue = register(createElement({ id: "unix-now-ms-value", textContent: "0" }));
    const unixSyncNowBtn = register(createElement({ id: "unix-sync-now-btn", type: "button" }));
    const unixTsInput = register(createElement({ id: "unix-ts-input", type: "text", value: "" }));
    const unixTsMsInput = register(createElement({ id: "unix-ts-ms-input", type: "text", value: "" }));
    const unixIsoLocalInput = register(createElement({ id: "unix-iso-local-input", type: "text", value: "" }));
    const unixIsoUtcInput = register(createElement({ id: "unix-iso-utc-input", type: "text", value: "" }));
    const unixRfc2822Input = register(createElement({ id: "unix-rfc2822-input", type: "text", value: "" }));
    const unixSqlInput = register(createElement({ id: "unix-sql-input", type: "text", value: "" }));
    const unixHumanInput = register(createElement({ id: "unix-human-input", type: "text", value: "" }));

    const smartFormatRows = [
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "unix_sec" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "unix_ms" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "iso_local" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "iso_utc" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "rfc2822" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "sql" } }),
        createElement({ className: "smart-format-row", attrs: { "data-format-field": "human" } })
    ];

    const copyIds = [
        "copy-conv-day-btn",
        "copy-conv-hour-btn",
        "copy-conv-min-btn",
        "copy-conv-sec-btn",
        "copy-period-res-btn",
        "copy-period-hour-res-btn",
        "copy-period-min-res-btn",
        "copy-period-sec-res-btn",
        "copy-offset-res-btn",
        "copy-unix-now-btn",
        "copy-unix-now-ms-btn",
        "copy-unix-ts-btn",
        "copy-unix-ts-ms-btn",
        "copy-unix-iso-local-btn",
        "copy-unix-iso-utc-btn",
        "copy-unix-rfc2822-btn",
        "copy-unix-sql-btn",
        "copy-unix-human-btn"
    ];
    copyIds.forEach((id) => register(createElement({ id, type: "button" })));

    const countdownNameButtons = [];
    const countdownNameInputs = [];
    const countdownTargetInputs = [];
    const countdownDisplays = [];
    const countdownStatuses = [];
    const countdownActionButtons = [];
    for (let i = 0; i < 3; i++) {
        countdownNameButtons.push(register(createElement({
            id: `countdown-name-${i}`,
            type: "button",
            textContent: `Countdown ${i + 1}`,
            className: "countdown-name-btn",
            attrs: { "data-slot": String(i) }
        })));
        countdownNameInputs.push(register(createElement({
            id: `countdown-name-input-${i}`,
            type: "text",
            value: `Countdown ${i + 1}`,
            className: "countdown-name-input",
            attrs: { "data-slot": String(i) }
        })));
        countdownNameInputs[i].style.display = "none";
        countdownTargetInputs.push(register(createElement({
            id: `countdown-target-${i}`,
            type: "datetime-local",
            className: "countdown-target-input",
            attrs: { "data-slot": String(i) }
        })));
        countdownDisplays.push(register(createElement({
            id: `countdown-display-${i}`,
            textContent: "00d 00:00:00",
            className: "countdown-display",
            attrs: { "data-slot": String(i) }
        })));
        countdownStatuses.push(register(createElement({
            id: `countdown-status-${i}`,
            textContent: "",
            className: "countdown-status",
            attrs: { "data-slot": String(i) }
        })));

        ["toggle", "reset"].forEach((action) => {
            countdownActionButtons.push(register(createElement({
                id: `countdown-${action}-${i}`,
                type: "button",
                className: `sm-btn${action === "toggle" ? " countdown-toggle-btn" : ""}`,
                attrs: { "data-slot": String(i), "data-action": action }
            })));
        });
    }

    setQuery(".countdown-name-btn", countdownNameButtons);
    setQuery(".countdown-name-input", countdownNameInputs);
    setQuery(".countdown-toggle-btn", countdownActionButtons.filter((btn) => btn.getAttribute("data-action") === "toggle"));
    setQuery(".countdown-target-input", countdownTargetInputs);
    setQuery(".countdown-display", countdownDisplays);
    setQuery(".countdown-status", countdownStatuses);
    setQuery(".countdown-slot-controls .sm-btn[data-action]", countdownActionButtons);
    setQuery(".smart-format-row", smartFormatRows);

    const documentStub = {
        getElementById(id) {
            return byId.get(id) || null;
        },
        querySelectorAll(selector) {
            return queryMap.get(selector) || [];
        }
    };

    const storage = createStorageStub();

    const sandbox = {
        console,
        Date,
        Math,
        JSON,
        Number,
        String,
        Object,
        Array,
        parseInt,
        localStorage: storage,
        document: documentStub,
        prompt: () => null,
        setInterval(fn) {
            intervals.push(fn);
            return intervals.length;
        },
        clearInterval(id) {
            intervals[id - 1] = null;
        }
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);

    // Load dependencies required by calculator.js
    const timeCorePath = path.resolve(process.cwd(), "js/modules/time-core.js");
    vm.runInContext(fs.readFileSync(timeCorePath, "utf8"), sandbox, { filename: "js/modules/time-core.js" });

    vm.runInContext(calculatorCode, sandbox, { filename: "js/modules/calculator.js" });

    return {
        sandbox,
        elements: {
            periodStart,
            periodEnd,
            periodSwapBtn,
            periodRes,
            periodHourRes,
            periodMinRes,
            periodSecRes,
            offsetStart,
            offVal,
            offUnit,
            offDir,
            offsetRes,
            unixNowValue,
            unixNowMsValue,
            unixSyncNowBtn,
            unixTsInput,
            unixTsMsInput,
            unixIsoLocalInput,
            unixIsoUtcInput,
            unixRfc2822Input,
            unixSqlInput,
            unixHumanInput,
            smartFormatRows,
            countdownTargetInputs,
            countdownNameButtons,
            countdownNameInputs,
            countdownDisplays,
            countdownStatuses,
            countdownActionButtons
        },
        storage,
        intervals
    };
}

function createTranslator() {
    const map = {
        unit_days_suffix: "d",
        unit_hours_suffix: "h",
        unit_minutes_suffix: "m",
        unit_seconds_suffix: "s",
        calc_countdown_default_prefix: "Countdown",
        calc_countdown_start: "Start",
        calc_countdown_stop: "Stop",
        calc_countdown_expired: "Expired",
        calc_countdown_rename_prompt: "Edit countdown name:",
        calc_countdown_day_suffix: "d",
        calc_unix_invalid: "Invalid timestamp"
    };
    return (key) => map[key] || key;
}

test("date shift supports year unit with before direction", () => {
    const { sandbox, elements } = createCalculatorContext();
    sandbox.GTVCalculator.initCalculators({
        t: createTranslator(),
        copyText: async () => { }
    });

    elements.offsetStart.value = "2026-03-07";
    elements.offVal.value = "2";
    elements.offUnit.value = "year";
    elements.offDir.value = "before";
    elements.offDir.dispatch("change");

    expect(elements.offsetRes.value).toBe("2024-03-07 00:00:00");
});

test("unix converter performs bidirectional conversion", () => {
    const { sandbox, elements } = createCalculatorContext();
    sandbox.GTVCalculator.initCalculators({
        t: createTranslator(),
        copyText: async () => { }
    });

    elements.unixTsInput.value = "0";
    elements.unixTsInput.dispatch("input");
    expect(elements.unixTsMsInput.value).toBe("0");
    expect(elements.unixIsoUtcInput.value.startsWith("1970-01-01T00:00:00")).toBe(true);

    elements.unixSqlInput.value = "1970-01-02 00:00:00";
    elements.unixSqlInput.dispatch("input");
    const expectedMs = new Date(1970, 0, 2, 0, 0, 0).getTime();
    const expectedTs = String(Math.floor(expectedMs / 1000));
    expect(elements.unixTsInput.value).toBe(expectedTs);
    expect(elements.unixTsMsInput.value).toBe(String(expectedMs));
});

test("countdown marks expired target and persists slot state", () => {
    const { sandbox, elements, storage } = createCalculatorContext();
    sandbox.GTVCalculator.initCalculators({
        t: createTranslator(),
        copyText: async () => { }
    });

    elements.countdownTargetInputs[0].value = "2000-01-01T00:00:00";
    elements.countdownTargetInputs[0].dispatch("change");

    const toggleBtn = elements.countdownActionButtons.find((btn) =>
        btn.getAttribute("data-slot") === "0" && btn.getAttribute("data-action") === "toggle"
    );
    toggleBtn.click();

    expect(elements.countdownStatuses[0].textContent).toBe("Expired");
    const persisted = JSON.parse(storage.getItem("GTV_CalcCountdown_v1"));
    expect(Array.isArray(persisted)).toBe(true);
    expect(persisted[0].active).toBe(false);
});

test("countdown restart keeps target time and recalculates from current moment", () => {
    const realDate = Date;
    let mockNowMs = Date.parse("2026-03-07T00:00:00Z");

    class MockDate extends Date {
        constructor(...args) {
            if (args.length === 0) {
                super(mockNowMs);
            } else {
                super(...args);
            }
        }
        static now() {
            return mockNowMs;
        }
    }

    global.Date = MockDate;
    try {
        const { sandbox, elements } = createCalculatorContext();
        sandbox.Date = MockDate;
        sandbox.window.Date = MockDate;
        sandbox.GTVCalculator.initCalculators({
            t: createTranslator(),
            copyText: async () => { }
        });

        const toggleBtn = elements.countdownActionButtons.find((btn) =>
            btn.getAttribute("data-slot") === "0" && btn.getAttribute("data-action") === "toggle"
        );

        const formatRemaining = (text) => {
            const matched = String(text).match(/^(\d+)d\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (!matched) return Number.NaN;
            const days = Number(matched[1]);
            const hours = Number(matched[2]);
            const mins = Number(matched[3]);
            const secs = Number(matched[4]);
            return (days * 86400) + (hours * 3600) + (mins * 60) + secs;
        };

        elements.countdownTargetInputs[0].value = "2026-03-07T23:00:00";
        elements.countdownTargetInputs[0].dispatch("change");

        toggleBtn.click();
        expect(toggleBtn.textContent).toBe("Stop");
        const firstTargetValue = elements.countdownTargetInputs[0].value;

        mockNowMs = Date.parse("2026-03-07T00:20:00Z");
        toggleBtn.click();
        expect(toggleBtn.textContent).toBe("Start");

        const frozenText = elements.countdownDisplays[0].textContent;
        const frozenSeconds = formatRemaining(frozenText);
        expect(Number.isFinite(frozenSeconds)).toBe(true);

        mockNowMs = Date.parse("2026-03-07T00:40:00Z");
        toggleBtn.click();
        expect(toggleBtn.textContent).toBe("Stop");
        expect(elements.countdownTargetInputs[0].value).toBe(firstTargetValue);

        const resumedSeconds = formatRemaining(elements.countdownDisplays[0].textContent);
        expect(Number.isFinite(resumedSeconds)).toBe(true);
        expect(resumedSeconds).toBeLessThan(frozenSeconds);
    } finally {
        global.Date = realDate;
    }
});

test("countdown name edits inline without prompt flow", () => {
    const { sandbox, elements, storage } = createCalculatorContext();
    let promptCalled = false;
    sandbox.prompt = () => {
        promptCalled = true;
        return "ignored";
    };

    sandbox.GTVCalculator.initCalculators({
        t: createTranslator(),
        copyText: async () => { }
    });

    const nameBtn = elements.countdownNameButtons[0];
    const nameInput = elements.countdownNameInputs[0];

    nameBtn.click();
    expect(nameBtn.style.display).toBe("none");
    expect(nameInput.style.display).toBe("block");

    nameInput.value = "Project Deadline";
    nameInput.dispatch("keydown", { key: "Enter" });

    expect(nameBtn.textContent).toBe("Project Deadline");
    expect(nameInput.style.display).toBe("none");
    expect(promptCalled).toBe(false);

    const persisted = JSON.parse(storage.getItem("GTV_CalcCountdown_v1"));
    expect(persisted[0].name).toBe("Project Deadline");
    expect(persisted[0].nameIsCustom).toBe(true);
});
