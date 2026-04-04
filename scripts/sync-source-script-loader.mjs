import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const SCRIPT_LIST_PATH = path.join(ROOT_DIR, "script_list.tmp");
const SOURCE_SCRIPT_LOADER_PATH = path.join(ROOT_DIR, "js", "source-script-loader.js");

function readScriptList() {
    if (!fs.existsSync(SCRIPT_LIST_PATH)) {
        throw new Error(`Missing script list: ${SCRIPT_LIST_PATH}`);
    }

    const sourceScripts = fs.readFileSync(SCRIPT_LIST_PATH, "utf8")
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);

    if (sourceScripts.length === 0) {
        throw new Error("script_list.tmp is empty.");
    }

    return sourceScripts;
}

function renderSourceScriptLoader(sourceScripts) {
    const serializedList = JSON.stringify(sourceScripts, null, 4);
    return `(function initGtvSourceScriptLoader(globalObj) {
    "use strict";

    const SOURCE_SCRIPTS = Object.freeze(${serializedList});
    const documentRef = globalObj?.document || null;

    function renderDeferredScriptTags(paths) {
        return paths
            .map((src) => \`<script src="\${src}" defer></script>\`)
            .join("\\n");
    }

    function injectScriptsWithDomWrite(paths) {
        if (!documentRef || typeof documentRef.write !== "function") return false;
        if (documentRef.readyState !== "loading") return false;
        documentRef.write(\`\${renderDeferredScriptTags(paths)}\\n\`);
        return true;
    }

    function injectScriptsDynamically(paths) {
        if (!documentRef || typeof documentRef.createElement !== "function") {
            throw new Error("Document API unavailable for source script loader.");
        }

        const parent = documentRef.body || documentRef.head || documentRef.documentElement;
        if (!parent || typeof parent.appendChild !== "function") {
            throw new Error("No valid parent element for source script loader.");
        }

        paths.forEach((src) => {
            const scriptEl = documentRef.createElement("script");
            scriptEl.src = src;
            scriptEl.defer = true;
            scriptEl.async = false;
            parent.appendChild(scriptEl);
        });
    }

    try {
        if (!injectScriptsWithDomWrite(SOURCE_SCRIPTS)) {
            injectScriptsDynamically(SOURCE_SCRIPTS);
        }
    } catch (error) {
        console.error("[GTV] Failed to inject source scripts.", error);
        throw error;
    }
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
