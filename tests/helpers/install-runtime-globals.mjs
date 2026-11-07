// Vitest setup: modules resolve shared helpers from GTVServiceInvokeUtils at createService time,
// as they do in the browser where service-invoke-utils.js loads early. Unit tests load a single
// module, so install the shared helper once per test file.
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const SERVICE_INVOKE_UTILS_PATH = path.resolve(process.cwd(), "src", "js", "modules", "service-invoke-utils.js");

if (!globalThis.GTVServiceInvokeUtils) {
    delete require.cache[require.resolve(SERVICE_INVOKE_UTILS_PATH)];
    require(SERVICE_INVOKE_UTILS_PATH);
}
