/* global WebSocket */
/**
 * Minimal Chrome DevTools Protocol helpers for the real-Chrome checks.
 * Uses Node's built-in WebSocket/fetch only (no browser automation dependency).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";

export function resolveChromePath() {
    const candidates = [
        process.env.GTV_CHROME_PATH,
        process.env.CHROME_BIN,
        process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
        process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe"),
        process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/usr/bin/google-chrome",
        "/usr/bin/google-chrome-stable",
        "/usr/bin/chromium"
    ].filter(Boolean);
    const found = candidates.find((candidate) => fs.existsSync(candidate));
    if (!found) {
        throw new Error("Chrome executable not found. Set GTV_CHROME_PATH to the Chrome binary.");
    }
    return found;
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function until(label, fn, timeoutMs = 20000, intervalMs = 100) {
    const deadline = Date.now() + timeoutMs;
    let lastError = null;
    while (Date.now() < deadline) {
        try {
            const value = await fn();
            if (value) return value;
        } catch (err) {
            lastError = err;
        }
        await sleep(intervalMs);
    }
    throw new Error(`Timed out waiting for ${label}${lastError ? ` (${lastError.message})` : ""}`);
}

export async function connect(url) {
    const ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve, { once: true });
        ws.addEventListener("error", () => reject(new Error(`WebSocket connection failed: ${url}`)), { once: true });
    });
    let nextId = 0;
    const pending = new Map();
    const listeners = new Map();
    ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.method) {
            (listeners.get(message.method) || []).forEach((listener) => listener(message.params));
        }
        const request = pending.get(message.id);
        if (!request) return;
        pending.delete(message.id);
        clearTimeout(request.timer);
        if (message.error) request.reject(new Error(`${request.method}: ${JSON.stringify(message.error)}`));
        else request.resolve(message.result);
    });
    return {
        on(method, listener) {
            const callbacks = listeners.get(method) || [];
            callbacks.push(listener);
            listeners.set(method, callbacks);
        },
        send(method, params = {}) {
            return new Promise((resolve, reject) => {
                const id = ++nextId;
                const timer = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error(`CDP timeout: ${method}`));
                }, 15000);
                pending.set(id, { resolve, reject, timer, method });
                ws.send(JSON.stringify({ id, method, params }));
            });
        },
        close() {
            try {
                ws.close();
            } catch {
                // already closed
            }
        }
    };
}

export async function evaluate(client, expression) {
    const result = await client.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true
    });
    if (result.exceptionDetails) {
        const description = result.exceptionDetails.exception?.description || result.exceptionDetails.text;
        throw new Error(`Page evaluation failed: ${description}`);
    }
    return result.result?.value;
}

/**
 * Starts a headless Chrome with a fresh profile and returns a session that can load
 * an unpacked extension and open its pages. Call session.close() when done.
 */
export async function launchChrome({ downloadDir } = {}) {
    const chromePath = resolveChromePath();
    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "gtv-chrome-profile-"));
    const chrome = spawn(chromePath, [
        "--headless=new",
        "--remote-debugging-port=0",
        `--user-data-dir=${profileDir}`,
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        "--disable-sync",
        "--disable-gpu",
        "--window-size=1600,1000",
        "about:blank"
    ], { stdio: "ignore", windowsHide: true });

    const clients = [];
    const portFile = path.join(profileDir, "DevToolsActivePort");
    let browser = null;
    let port = "";

    async function close() {
        clients.forEach((client) => client.close());
        try {
            if (process.platform === "win32" && chrome.pid) {
                execFileSync("taskkill", ["/F", "/T", "/PID", String(chrome.pid)], { stdio: "ignore" });
            } else if (chrome.pid) {
                process.kill(chrome.pid);
            }
        } catch {
            // process already exited
        }
        for (let attempt = 0; attempt < 10; attempt++) {
            try {
                fs.rmSync(profileDir, { recursive: true, force: true });
                break;
            } catch {
                await sleep(300);
            }
        }
    }

    try {
        await until("Chrome DevTools port", () => fs.existsSync(portFile) && fs.readFileSync(portFile, "utf8").includes("\n"));
        const [portLine, browserPath] = fs.readFileSync(portFile, "utf8").trim().split(/\r?\n/);
        port = portLine;
        browser = await connect(`ws://127.0.0.1:${port}${browserPath}`);
        clients.push(browser);
        if (downloadDir) {
            fs.mkdirSync(downloadDir, { recursive: true });
            await browser.send("Browser.setDownloadBehavior", {
                behavior: "allow",
                downloadPath: downloadDir,
                eventsEnabled: true
            });
        }
    } catch (err) {
        await close();
        throw err;
    }

    async function attach(targetId) {
        const client = await connect(`ws://127.0.0.1:${port}/devtools/page/${targetId}`);
        clients.push(client);
        return client;
    }

    return {
        chromePath,
        browser,
        async version() {
            return (await browser.send("Browser.getVersion")).product;
        },
        async loadExtension(extensionDir) {
            const loaded = await browser.send("Extensions.loadUnpacked", { path: path.resolve(extensionDir) });
            if (!loaded?.id) throw new Error("Chrome did not return an extension id.");
            return loaded.id;
        },
        async targets() {
            return (await browser.send("Target.getTargets")).targetInfos;
        },
        attach,
        async openPage(url) {
            const { targetId } = await browser.send("Target.createTarget", { url });
            const client = await attach(targetId);
            const consoleErrors = [];
            client.on("Runtime.consoleAPICalled", (params) => {
                if (params.type === "error") {
                    consoleErrors.push(params.args.map((arg) => arg.value ?? arg.description).join(" "));
                }
            });
            client.on("Runtime.exceptionThrown", (params) => {
                const details = params.exceptionDetails;
                consoleErrors.push(`Uncaught: ${details.exception?.description || details.text}`);
            });
            await client.send("Runtime.enable");
            await client.send("Page.enable");
            return { client, targetId, consoleErrors };
        },
        close
    };
}
