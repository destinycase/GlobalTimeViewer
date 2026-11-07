(function initGtvMainAppStateServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const appStatePatcherApi = requireCreateServiceModule(safeDeps.GTV_APP_STATE_PATCHER, "GTVAppStatePatcher");
        const appPersistenceStateApi = requireCreateServiceModule(safeDeps.GTV_APP_PERSISTENCE_STATE, "GTVAppPersistenceState");

        const getStateSource = (typeof safeDeps.getStateSource === "function")
            ? safeDeps.getStateSource
            : (() => ({}));
        const stateSetters = (safeDeps.stateSetters && typeof safeDeps.stateSetters === "object")
            ? safeDeps.stateSetters
            : {};
        const setIsRealtimeState = (typeof safeDeps.setIsRealtimeState === "function")
            ? safeDeps.setIsRealtimeState
            : (() => {});
        const syncActiveFormatProfileFromState = (typeof safeDeps.syncActiveFormatProfileFromState === "function")
            ? safeDeps.syncActiveFormatProfileFromState
            : (() => {});
        const ensureFormatProfiles = (typeof safeDeps.ensureFormatProfiles === "function")
            ? safeDeps.ensureFormatProfiles
            : (() => {});
        const getCurrentFormatProfileState = (typeof safeDeps.getCurrentFormatProfileState === "function")
            ? safeDeps.getCurrentFormatProfileState
            : (() => ({}));
        const resolveFormatProfileContext = (typeof safeDeps.resolveFormatProfileContext === "function")
            ? safeDeps.resolveFormatProfileContext
            : (() => "live");
        const applyFormatProfileState = (typeof safeDeps.applyFormatProfileState === "function")
            ? safeDeps.applyFormatProfileState
            : (() => {});

        const appStatePatcherService = appStatePatcherApi.createService({
            getStateSource: () => getStateSource(),
            stateSetters,
            setIsRealtimeState: (...args) => setIsRealtimeState(...args)
        });

        const appPersistenceStateService = appPersistenceStateApi.createService({
            getState: () => appStatePatcherService.getStateSnapshot(),
            setState: (next = {}) => appStatePatcherService.applyStatePatch(next),
            setIsRealtimeState: (...args) => setIsRealtimeState(...args),
            syncActiveFormatProfileFromState: (...args) => syncActiveFormatProfileFromState(...args),
            ensureFormatProfiles: (...args) => ensureFormatProfiles(...args),
            getCurrentFormatProfileState: (...args) => getCurrentFormatProfileState(...args),
            resolveFormatProfileContext: (...args) => resolveFormatProfileContext(...args),
            applyFormatProfileState: (...args) => applyFormatProfileState(...args)
        });

        return Object.freeze({
            appStatePatcherService,
            appPersistenceStateService
        });
    }

    globalObj.GTVMainAppStateServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
