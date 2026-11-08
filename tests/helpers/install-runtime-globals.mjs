// Vitest setup: modules resolve shared helpers from GTVServiceInvokeUtils and GTVTimeCore at run
// time, as they do in the browser where service-invoke-utils.js and time-core.js load early. Unit
// tests load a single module, so install the shared helpers once per test file.
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const MODULES_DIR = path.resolve(process.cwd(), "src", "js", "modules");
const SHARED_HELPERS = [
    ["GTVServiceInvokeUtils", path.join(MODULES_DIR, "service-invoke-utils.js")],
    ["GTVTimeCore", path.join(MODULES_DIR, "time-core.js")]
];

SHARED_HELPERS.forEach(([globalName, modulePath]) => {
    if (globalThis[globalName]) return;
    delete require.cache[require.resolve(modulePath)];
    require(modulePath);
});
