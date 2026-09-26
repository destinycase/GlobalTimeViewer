import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    parseSourceScriptList,
    validateRuntimeScriptCoverage,
    validateSourceScriptFiles
} from "./source-script-list.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const SCRIPT_LIST_PATH = path.join(ROOT_DIR, "script_list.tmp");
const SOURCE_SCRIPT_LOADER_PATH = path.join(ROOT_DIR, "js", "source-script-loader.js");

function readScriptList() {
    if (!fs.existsSync(SCRIPT_LIST_PATH)) {
        throw new Error(`Missing script list: ${SCRIPT_LIST_PATH}`);
    }

    const sourceScripts = parseSourceScriptList(fs.readFileSync(SCRIPT_LIST_PATH, "utf8"));
    validateSourceScriptFiles(ROOT_DIR, sourceScripts);
    validateRuntimeScriptCoverage(ROOT_DIR, sourceScripts);
    return sourceScripts;
}

function renderSourceScriptLoader(sourceScripts) {
    const serializedList = JSON.stringify(sourceScripts, null, 4);
    return `(function initGtvSourceScriptLoader(globalObj) {
    "use strict";

    const SOURCE_SCRIPTS = Object.freeze(${serializedList});
    const documentRef = globalObj?.document || null;

    function injectScriptsDynamically(paths) {
        if (!documentRef || typeof documentRef.createElement !== "function") {
            throw new Error("Document API unavailable for source script loader.");
        }

        const parent = documentRef.head || documentRef.body || documentRef.documentElement;
        if (!parent || typeof parent.appendChild !== "function") {
            throw new Error("No valid parent element for source script loader.");
        }

        const scripts = [];
        const loadPromises = paths.map((src) => new Promise((resolve, reject) => {
            const scriptEl = documentRef.createElement("script");
            scripts.push(scriptEl);
            scriptEl.src = src;
            scriptEl.async = false;
            scriptEl.onload = resolve;
            scriptEl.onerror = () => reject(new Error("Failed to load source script: " + src));
            parent.appendChild(scriptEl);
        }));
        return Promise.all(loadPromises).catch((error) => {
            scripts.forEach((scriptEl) => scriptEl.remove?.());
            throw error;
        });
    }

    injectScriptsDynamically(SOURCE_SCRIPTS).catch((error) => {
        console.error("[GTV] Failed to inject source scripts.", error);
        const documentRef = globalObj?.document || null;
        const errorBanner = documentRef?.getElementById?.("fatal-error-banner");
        const errorDescription = documentRef?.getElementById?.("fatal-error-desc");
        if (errorDescription) {
            errorDescription.textContent = error.message || String(error);
        }
        errorBanner?.classList?.remove?.("is-hidden");
        documentRef?.getElementById?.("app-loading-overlay")?.classList?.add?.("hidden");
    });
})(typeof window !== "undefined" ? window : globalThis);
`;
}

function main() {
    const sourceScripts = readScriptList();
    const loaderSource = renderSourceScriptLoader(sourceScripts);
    fs.writeFileSync(SOURCE_SCRIPT_LOADER_PATH, loaderSource, "utf8");
    process.stdout.write(`Synced source script loader with ${sourceScripts.length} entries.\n`);
}

main();
