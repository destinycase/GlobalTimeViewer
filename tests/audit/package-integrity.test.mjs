import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { describe, expect, test } from "vitest";

import { readZipEntries } from "../../scripts/zip-archive.mjs";

const ROOT_DIR = process.cwd();
const PACKAGE_VERSION = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8")).version;
const ZIP_PATH = process.env.GTV_PACKAGE_ZIP
    ? path.resolve(process.env.GTV_PACKAGE_ZIP)
    : path.join(ROOT_DIR, "release", `gtv-v${PACKAGE_VERSION}.zip`);
const ZIP_EXISTS = fs.existsSync(ZIP_PATH);
const REQUIRE_ARTIFACTS = process.env.GTV_REQUIRE_ARTIFACTS === "1";
const DIST_DIR = path.join(ROOT_DIR, "dist_extension");

const TEXT_EXTENSIONS = new Set([".html", ".js", ".css", ".json", ".txt"]);
const REQUIRED_ENTRIES = [
    "manifest.json",
    "index.html",
    "background.js",
    "js/bundle.js",
    "icons/icon16.png",
    "icons/icon48.png",
    "icons/icon128.png"
];
const FORBIDDEN_ENTRY_PATTERNS = [
    /\.map$/i,
    /\.(tmp|bak|log|zip|mjs|cjs|ts|md)$/i,
    /(^|\/)(src|tests|scripts|docs|docs_dev|scratch|node_modules|Asset|coverage)\//,
    /(^|\/)(AGENTS|CLAUDE)\.md$/i,
    /(^|\/)package(-lock)?\.json$/,
    /(^|\/)source-script-loader\.js$/,
    /(^|\/)script_list/,
    /(^|\/)\.[^/]+/
];

function readGitConfig(key) {
    try {
        return execFileSync("git", ["config", "--get", key], { cwd: ROOT_DIR, encoding: "utf8" }).trim();
    } catch {
        return "";
    }
}

function textEntries(entries) {
    return [...entries].filter(([name]) => TEXT_EXTENSIONS.has(path.extname(name).toLowerCase()));
}

test("release ZIP for the current package version is present when required", () => {
    if (REQUIRE_ARTIFACTS) {
        expect(ZIP_EXISTS, `missing ${ZIP_PATH}`).toBe(true);
    }
});

describe.skipIf(!ZIP_EXISTS)(`release package ${path.basename(ZIP_PATH)}`, () => {
    const entries = ZIP_EXISTS ? readZipEntries(ZIP_PATH) : new Map();
    const names = [...entries.keys()];
    const readJson = (name) => JSON.parse(entries.get(name).toString("utf8"));

    test("is named after and built for the current package version", () => {
        expect(path.basename(ZIP_PATH)).toBe(`gtv-v${PACKAGE_VERSION}.zip`);
        const manifest = readJson("manifest.json");
        expect(manifest.version).toBe(PACKAGE_VERSION);
        expect(manifest.version_name).toBe(PACKAGE_VERSION);
        const bundle = entries.get("js/bundle.js").toString("utf8");
        expect(bundle).toContain(`"${PACKAGE_VERSION}"`);
    });

    test("contains the required extension files", () => {
        for (const required of REQUIRED_ENTRIES) {
            expect(names, required).toContain(required);
        }
    });

    test("contains no source, test, development or hidden files", () => {
        const forbidden = names.filter((name) => FORBIDDEN_ENTRY_PATTERNS.some((pattern) => pattern.test(name)));
        expect(forbidden).toEqual([]);
    });

    test("resolves every file referenced by the manifest", () => {
        const manifest = readJson("manifest.json");
        const referenced = [
            ...Object.values(manifest.icons || {}),
            manifest.background?.service_worker
        ].filter(Boolean);
        expect(referenced.length).toBeGreaterThan(0);
        for (const reference of referenced) {
            expect(names, reference).toContain(reference);
        }
    });

    test("resolves every local script and stylesheet referenced by index.html", () => {
        const html = entries.get("index.html").toString("utf8");
        const references = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)]
            .map((match) => match[1])
            .filter((reference) => !/^(https?:)?\/\//i.test(reference))
            .map((reference) => path.posix.normalize(reference.split("?")[0]));
        expect(references).toContain("js/bundle.js");
        for (const reference of references) {
            expect(names, reference).toContain(reference);
        }
    });

    test("uses LF line endings in text files", () => {
        const withCrlf = textEntries(entries)
            .filter(([, content]) => content.includes("\r\n"))
            .map(([name]) => name);
        expect(withCrlf).toEqual([]);
    });

    test("does not expose developer environment values", () => {
        const needles = [
            readGitConfig("user.email"),
            readGitConfig("user.name"),
            os.homedir(),
            ROOT_DIR
        ].filter((value) => value && value.length >= 4);
        const leaks = [];
        for (const [name, content] of textEntries(entries)) {
            const text = content.toString("utf8");
            for (const needle of needles) {
                const variants = new Set([needle, needle.replace(/\\/g, "/"), needle.replace(/\\/g, "\\\\")]);
                if ([...variants].some((variant) => text.includes(variant))) {
                    leaks.push(name);
                }
            }
        }
        expect(leaks).toEqual([]);
    });

    test.skipIf(!fs.existsSync(path.join(DIST_DIR, "manifest.json")))("matches dist_extension file by file when it is the same version", () => {
        const distManifest = JSON.parse(fs.readFileSync(path.join(DIST_DIR, "manifest.json"), "utf8"));
        if (distManifest.version !== PACKAGE_VERSION) return;
        for (const name of names) {
            const distPath = path.join(DIST_DIR, ...name.split("/"));
            expect(fs.existsSync(distPath), name).toBe(true);
            expect(fs.readFileSync(distPath).equals(entries.get(name)), name).toBe(true);
        }
    });
});
