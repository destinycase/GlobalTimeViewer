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

    async function openMainPage() {
        try {
            if (!chromeApi || !chromeApi.tabs || typeof chromeApi.tabs.create !== "function") {
                throw new Error("chrome.tabs.create API is unavailable");
            }
            await chromeApi.tabs.create({ url: resolveMainPageUrl() });
        } catch (error) {
            const message = (error && typeof error.message === "string")
                ? error.message
                : String(error);
            console.error("[GTV-BG] Failed to open extension tab", {
                message,
                timestamp: new Date().toISOString()
            });
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
