import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, expect, test } from "vitest";
import {
    parseSourceScriptList,
    validateRuntimeScriptCoverage,
    validateSourceScriptFiles
} from "../scripts/source-script-list.mjs";

let tempDir;

afterEach(() => {
    if (tempDir) {
        fs.rmSync(tempDir, { recursive: true, force: true });
        tempDir = null;
    }
});

test("parses ordered local paths and ignores blank lines", () => {
    expect(parseSourceScriptList("i18n.js\n\njs/modules/app.js\n")).toEqual([
        "i18n.js",
        "js/modules/app.js"
    ]);
});

test.each([
    ["empty list", "\n  \n", /script_list\.tmp is empty/],
    ["duplicate entry", "a.js\na.js", /Duplicate script path/],
    ["parent traversal", "../outside.js", /normalized and stay within/],
    ["absolute path", "/outside.js", /Invalid local script path/],
    ["URL", "https://example.com/app.js", /Invalid local script path/],
    ["backslash path", "js\\app.js", /Invalid local script path/]
])("rejects %s", (_label, input, error) => {
    expect(() => parseSourceScriptList(input)).toThrow(error);
});

test("requires every listed path to resolve to a file under the project root", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gtv-source-list-"));
    fs.mkdirSync(path.join(tempDir, "js"));
    fs.writeFileSync(path.join(tempDir, "js", "present.js"), "// test");

    expect(() => validateSourceScriptFiles(tempDir, ["js/present.js"])).not.toThrow();
    expect(() => validateSourceScriptFiles(tempDir, ["js/missing.js"]))
        .toThrow(/js\/missing\.js/);
    expect(() => validateSourceScriptFiles(tempDir, ["js"]))
        .toThrow(/js/);
});

test("runtime script coverage detects a source file omitted from the loader manifest", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gtv-runtime-coverage-"));
    fs.mkdirSync(path.join(tempDir, "js", "vendor"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "js", "modules"), { recursive: true });
    ["i18n.js", "main.js", "js/vendor/library.js", "js/modules/feature.js"].forEach((entry) => {
        const target = path.join(tempDir, ...entry.split("/"));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, "// test");
    });

    expect(() => validateRuntimeScriptCoverage(tempDir, [
        "i18n.js",
        "main.js",
        "js/vendor/library.js"
    ])).toThrow(/not listed: js\/modules\/feature\.js/);
    expect(() => validateRuntimeScriptCoverage(tempDir, [
        "i18n.js",
        "main.js",
        "js/vendor/library.js",
        "js/modules/feature.js"
    ])).not.toThrow();
});
