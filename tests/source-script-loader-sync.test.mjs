import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { expect, test, vi } from "vitest";

const SCRIPT_LIST_PATH = path.resolve(process.cwd(), "script_list.tmp");
const SOURCE_SCRIPT_LOADER_PATH = path.resolve(process.cwd(), "js", "source-script-loader.js");

function readScriptList() {
    return fs.readFileSync(SCRIPT_LIST_PATH, "utf8")
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function readLoaderScriptList() {
    const loaderSource = fs.readFileSync(SOURCE_SCRIPT_LOADER_PATH, "utf8");
    const matched = loaderSource.match(/const SOURCE_SCRIPTS = Object\.freeze\((\[[\s\S]*?\])\);/);
    expect(matched).not.toBeNull();
    return JSON.parse(matched[1]);
}

test("source script loader stays in sync with script_list.tmp", () => {
    expect(readLoaderScriptList()).toEqual(readScriptList());
});

test("script_list.tmp includes every runtime script exactly once", () => {
    const runtimeScripts = [
        "i18n.js",
        "main.js",
        ...fs.readdirSync(path.resolve(process.cwd(), "js", "vendor"))
            .filter((name) => name.endsWith(".js"))
            .map((name) => `js/vendor/${name}`),
        ...fs.readdirSync(path.resolve(process.cwd(), "js", "modules"))
            .filter((name) => name.endsWith(".js"))
            .map((name) => `js/modules/${name}`)
    ].sort();

    expect([...readScriptList()].sort()).toEqual(runtimeScripts);
});

test("source script loader preserves ordered execution and reports a failed path", () => {
    const loaderSource = fs.readFileSync(SOURCE_SCRIPT_LOADER_PATH, "utf8");

    expect(loaderSource).toContain("const loadPromises = paths.map");
    expect(loaderSource).toContain("scriptEl.async = false");
    expect(loaderSource).toContain("return Promise.all(loadPromises)");
    expect(loaderSource).toContain("Failed to load source script: ");
    expect(loaderSource).toContain("fatal-error-banner");
});

test("source script loader appends all scripts without serial network waits", async () => {
    const loaderSource = fs.readFileSync(SOURCE_SCRIPT_LOADER_PATH, "utf8");
    const appended = [];
    const pendingScripts = [];
    const elements = new Map();
    const documentRef = {
        head: {
            appendChild(script) {
                appended.push(script.src);
                pendingScripts.push(script);
            }
        },
        createElement() {
            return {};
        },
        getElementById(id) {
            return elements.get(id) || null;
        }
    };
    const context = {
        document: documentRef,
        console,
        Promise,
        setTimeout
    };
    context.window = context;

    vm.runInNewContext(loaderSource, context);
    expect(appended).toEqual(readScriptList());
    expect(pendingScripts).toHaveLength(readScriptList().length);
    pendingScripts.forEach((script) => script.onload());
    await vi.waitFor(() => expect(pendingScripts).toHaveLength(readScriptList().length));
});

test("source script loader shows a fatal error when a script fails to load", async () => {
    const loaderSource = fs.readFileSync(SOURCE_SCRIPT_LOADER_PATH, "utf8");
    const description = { textContent: "", classList: { add() {} } };
    const banner = { classList: { remove() { this.removed = true; } } };
    const overlay = { classList: { add() { this.hidden = true; } } };
    const elements = new Map([
        ["fatal-error-desc", description],
        ["fatal-error-banner", banner],
        ["app-loading-overlay", overlay]
    ]);
    const errors = [];
    const documentRef = {
        head: {
            appendChild(script) {
                script.onerror();
            }
        },
        createElement() {
            return {};
        },
        getElementById(id) {
            return elements.get(id) || null;
        }
    };
    const context = {
        document: documentRef,
        console: { error: (...args) => errors.push(args) },
        Promise,
        setTimeout
    };
    context.window = context;

    vm.runInNewContext(loaderSource, context);
    await vi.waitFor(() => expect(errors).toHaveLength(1));

    expect(description.textContent).toContain(readScriptList()[0]);
    expect(banner.classList.removed).toBe(true);
    expect(overlay.classList.hidden).toBe(true);
});
