import fs from "node:fs";
import path from "node:path";

import { expect, test } from "vitest";

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
