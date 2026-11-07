(function initGtvTimerEngine(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const globalSetInterval = (typeof globalObj?.setInterval === "function")
            ? globalObj.setInterval.bind(globalObj)
            : null;
        const globalClearInterval = (typeof globalObj?.clearInterval === "function")
            ? globalObj.clearInterval.bind(globalObj)
            : null;
        const nativeSetInterval = (typeof setInterval === "function")
            ? setInterval
            : null;
        const nativeClearInterval = (typeof clearInterval === "function")
            ? clearInterval
            : null;
        const setIntervalFn = (typeof safeDeps.setIntervalFn === "function")
            ? safeDeps.setIntervalFn
            : ((fn, ms) => {
                if (typeof globalSetInterval === "function") {
                    return globalSetInterval(fn, ms);
                }
                if (typeof nativeSetInterval === "function") {
                    return nativeSetInterval(fn, ms);
                }
                return null;
            });
        const clearIntervalFn = (typeof safeDeps.clearIntervalFn === "function")
            ? safeDeps.clearIntervalFn
            : ((id) => {
                if (typeof globalClearInterval === "function") {
                    globalClearInterval(id);
                    return;
                }
                if (typeof nativeClearInterval === "function") {
                    nativeClearInterval(id);
                }
            });
        let realtimeIntervalId = null;

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVTimerEngine", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "shouldTick",
                "onTick"
            ])
        });

        function getTickIntervalMs(overrideMs = null) {
            const fallback = Number.isFinite(Number(safeDeps.DEFAULT_REALTIME_TICK_MS))
                ? Math.max(100, Math.trunc(Number(safeDeps.DEFAULT_REALTIME_TICK_MS)))
                : 1000;
            const parsed = Number(overrideMs);
            return Number.isFinite(parsed) ? Math.max(100, Math.trunc(parsed)) : fallback;
        }

        function runRealtimeTick() {
            const shouldTick = dep.shouldTick();
            if (shouldTick === false) return false;
            dep.onTick();
            return true;
        }

        function stopRealtimeTicker() {
            if (realtimeIntervalId === null) return false;
            clearIntervalFn(realtimeIntervalId);
            realtimeIntervalId = null;
            return true;
        }

        function startRealtimeTicker(options = {}) {
            const { intervalMs = null } = options;
            const tickIntervalMs = getTickIntervalMs(intervalMs);
            stopRealtimeTicker();
            realtimeIntervalId = setIntervalFn(() => {
                runRealtimeTick();
            }, tickIntervalMs);
            return realtimeIntervalId;
        }

        function restartRealtimeTicker(options = {}) {
            stopRealtimeTicker();
            return startRealtimeTicker(options);
        }

        function isRealtimeTickerRunning() {
            return realtimeIntervalId !== null;
        }

        return Object.freeze({
            getTickIntervalMs,
            runRealtimeTick,
            startRealtimeTicker,
            stopRealtimeTicker,
            restartRealtimeTicker,
            isRealtimeTickerRunning
        });
    }

    globalObj.GTVTimerEngine = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
