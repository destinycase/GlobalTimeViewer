(() => {
    "use strict";

    const chromeApi = (typeof chrome === "object" && chrome) ? chrome : null;

    function resolveMainPageUrl() {
        if (
            chromeApi
            && chromeApi.runtime
            && typeof chromeApi.runtime.getURL === "function"
        ) {
            return chromeApi.runtime.getURL("index.html");
        }
        return "index.html";
    }

    async function clearFailureBadge() {
        if (!chromeApi || !chromeApi.action || typeof chromeApi.action.setBadgeText !== "function") return;
        try {
            await chromeApi.action.setBadgeText({ text: "" });
        } catch (_err) {
            // Ignore action badge clear failures.
        }
    }

    async function showOpenTabFailureFeedback(message) {
        if (!chromeApi || !chromeApi.action || typeof chromeApi.action.setBadgeText !== "function") return;
        try {
            await chromeApi.action.setBadgeText({ text: "ERR" });
            if (typeof chromeApi.action.setBadgeBackgroundColor === "function") {
                await chromeApi.action.setBadgeBackgroundColor({ color: "#D93025" });
            }
            if (typeof chromeApi.action.setTitle === "function") {
                await chromeApi.action.setTitle({
                    title: `Global Time Viewer - Open failed: ${message || "unknown error"}`
                });
            }
            if (typeof setTimeout === "function") {
                setTimeout(() => {
                    void clearFailureBadge();
                }, 5000);
            }
        } catch (_err) {
            // Ignore action feedback failures.
        }
    }

    async function openMainPage() {
        try {
            if (!chromeApi || !chromeApi.tabs || typeof chromeApi.tabs.create !== "function") {
                throw new Error("chrome.tabs.create API is unavailable");
            }
            await chromeApi.tabs.create({ url: resolveMainPageUrl() });
            await clearFailureBadge();
        } catch (error) {
            const message = (error && typeof error.message === "string")
                ? error.message
                : String(error);
            console.error("[GTV-BG] Failed to open extension tab", {
                message,
                timestamp: new Date().toISOString()
            });
            await showOpenTabFailureFeedback(message);
        }
    }

    if (
        chromeApi
        && chromeApi.action
        && chromeApi.action.onClicked
        && typeof chromeApi.action.onClicked.addListener === "function"
    ) {
        chromeApi.action.onClicked.addListener(() => {
            void openMainPage();
        });
    } else {
        console.error("[GTV-BG] chrome.action.onClicked API is unavailable");
    }
})();
