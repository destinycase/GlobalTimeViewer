(function initGtvTimerEngine(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const setIntervalFn = (typeof safeDeps.setIntervalFn === "function")
            ? safeDeps.setIntervalFn
            : ((fn, ms) => setInterval(fn, ms));
        const clearIntervalFn = (typeof safeDeps.clearIntervalFn === "function")
            ? safeDeps.clearIntervalFn
            : ((id) => clearInterval(id));
        let realtimeIntervalId = null;

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getTickIntervalMs(overrideMs = null) {
            const fallback = Number.isFinite(Number(safeDeps.DEFAULT_REALTIME_TICK_MS))
                ? Math.max(100, Math.trunc(Number(safeDeps.DEFAULT_REALTIME_TICK_MS)))
                : 1000;
            const parsed = Number(overrideMs);
            return Number.isFinite(parsed) ? Math.max(100, Math.trunc(parsed)) : fallback;
        }

        function runRealtimeTick() {
            const shouldTick = invokeDep("shouldTick");
            if (shouldTick === false) return false;
            invokeDep("onTick");
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
