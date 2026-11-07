(function initGtvMainRuntimeUiServicesBootstrap(globalObj) {
    "use strict";

    function requireFunction(value, label) {
        if (typeof value !== "function") throw new Error(`Missing required dependency: ${label}`);
        return value;
    }
    function requireObject(value, label) {
        if (!value || typeof value !== "object") throw new Error(`Missing required dependency: ${label}`);
        return value;
    }
    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        function pickDeps(source, ...depNames) {
            if (Array.isArray(source)) {
                depNames = source;
                source = safeDeps;
            }
            const result = {};
            depNames.forEach((name) => {
                result[name] = source[name];
            });
            return result;
        }
        function resolveDeps(overrides = {}) {
            return (overrides && typeof overrides === "object") ? overrides : {};
        }
        function pickAliasedDeps(d, aliases = {}) {
            const result = {};
            Object.keys(aliases).forEach((key) => {
                result[key] = d[aliases[key]];
            });
            return result;
        }
        function deferDynamic(d, getter) {
            return typeof d.deferDynamicCall === "function" ? d.deferDynamicCall(getter) : () => undefined;
        }
        function bindFacade(d, getter, methodName) {
            return typeof d.bindFacadeMethod === "function" ? d.bindFacadeMethod(getter, methodName) : () => undefined;
        }
        function createContextStateSetter(d, stateKey, resolver) {
            return (next) => {
                const context = d.getPatchedActiveFormatProfileContextState();
                d.patchAppState({ [stateKey]: resolver(next, context) });
                d.syncActiveFormatProfileFromState();
            };
        }

        function buildMainTabServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_FORMAT_CONTROLS",
                    "serviceBootstrap",
                    "COPY_FORMAT_KEYS",
                    "TIME_PART_KEYS",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                ...pickDeps(d, "sanitizeCopyFormatOrder"),
                renderList: deferDynamic(d, d.getRenderListRef),
                ...pickDeps(d, "updateCopyFormatPreview"),
                ...pickAliasedDeps(d, {
                    "savePersistence": "savePersistenceSafely",
                }),
                ...pickDeps(d, "upgradeNativeTitleTooltips"),
                ...pickAliasedDeps(d, {
                    "isShowCopyFormat": "getPatchedShowCopyFormatState",
                    "getDisplayFormatOrder": "getPatchedDisplayFormatOrderState",
                    "getActiveFormatProfileContext": "getPatchedActiveFormatProfileContextState",
                }),
                ...pickDeps(d,
                    "patchAppState",
                    "sanitizeCopyFormatOrderForContext",
                    "syncActiveFormatProfileFromState"
                ),
                setDisplayFormatOrder: createContextStateSetter(
                    d,
                    "displayFormatOrder",
                    (next, context) => d.sanitizeCopyFormatOrderForContext(next, context)
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayFormatEnabled": "getPatchedDisplayFormatEnabledState",
                }),
                setDisplayFormatEnabled: createContextStateSetter(
                    d,
                    "displayFormatEnabled",
                    (next, context) => d.sanitizeCopyFormatEnabledForContext(next, "display", context)
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayTimePartsEnabled": "getPatchedDisplayTimePartsEnabledState",
                }),
                setDisplayTimePartsEnabled: createContextStateSetter(
                    d,
                    "displayTimePartsEnabled",
                    (next, context) => d.sanitizeTimePartsEnabledForContext(next, "display", context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatOrder": "getPatchedCopyFormatOrderState",
                }),
                setCopyFormatOrder: createContextStateSetter(
                    d,
                    "copyFormatOrder",
                    (next, context) => d.sanitizeCopyFormatOrderForContext(next, context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatEnabled": "getPatchedCopyFormatEnabledState",
                }),
                setCopyFormatEnabled: createContextStateSetter(
                    d,
                    "copyFormatEnabled",
                    (next, context) => d.sanitizeCopyFormatEnabledForContext(next, "copy", context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyTimePartsEnabled": "getPatchedCopyTimePartsEnabledState",
                }),
                setCopyTimePartsEnabled: createContextStateSetter(
                    d,
                    "copyTimePartsEnabled",
                    (next, context) => d.sanitizeTimePartsEnabledForContext(next, "copy", context)
                ),
                ...pickAliasedDeps(d, {
                    "getActiveCopyFormatKeys": "getActiveCopyFormatKeysForCurrentContext",
                    "getActiveTimePartKeys": "getActiveTimePartKeysForCurrentContext",
                }),
                ...pickDeps(d,
                    "sanitizeMainTab",
                    "clampGroupIndex",
                    "normalizeGroupTabState",
                    "isMultiTab",
                    "isFixedTimeTab",
                ),
                ...pickAliasedDeps(d, {
                    "getSlotCount": "getPatchedSlotCountState",
                    "getShowCopyFormat": "getPatchedShowCopyFormatState",
                    "getShowTimeline": "getPatchedShowTimelineState",
                    "getIsRealtime": "getIsRealtimeState",
                    "setIsRealtime": "setIsRealtimeState",
                }),
                syncRealtimeNow: () => {
                    if (typeof d.setGlobalTimeState === "function") {
                        d.setGlobalTimeState(0, new Date());
                    }
                },
                ...pickAliasedDeps(d, {
                    "getCurrentMainTab": "getPatchedMainTabState",
                    "setCurrentMainTab": "setCurrentMainTabState",
                    "getActiveGroupId": "getPatchedActiveGroupIdState",
                    "setActiveGroupId": "setActiveGroupIdState",
                    "getActiveGroupIdByMainTab": "getActiveGroupIdByMainTabStateSnapshot",
                    "setActiveGroupIdByMainTab": "setActiveGroupIdByMainTabState",
                }),
                ...pickDeps(d,
                    "hideFloatingTooltip",
                    "syncCurrentMultiStateToActiveSubgroup",
                    "refreshMultiRangeControls",
                    "renderBaseTimeSelect",
                    "loadCurrentMultiStateFromActiveSubgroup",
                ),
                renderGroups: bindFacade(d, d.getGroupTabsServiceRef, "renderGroups"),
                renderMultiSubgroups: bindFacade(d, d.getGroupTabsServiceRef, "renderMultiSubgroups"),
                ...pickAliasedDeps(d, {
                    "renderMultiRanges": "renderMultiRangesSafely",
                }),
                ...pickDeps(d, "renderFixedTimeTab"),
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                ...pickAliasedDeps(d, {
                    "updateTimeAdjustPanel": "updateTimeAdjustPanelSafely",
                }),
                ...pickDeps(d,
                    "resolveFormatProfileContext",
                ),
                ...pickDeps(d, "activateFormatProfileContext")
            };
        }

        function buildMainImageExportNamingProxyConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickAliasedDeps(d, {
                    "getImageExportNamingService": "getImageExportNamingServiceRef",
                }),
                ...pickDeps(d,
                    "getCustomOffsetMinutes",
                    "pad",
                    "timeService",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "getGroups": "getGroupsStateSnapshot",
                    "getActiveGroupId": "getPatchedActiveGroupIdState",
                    "t": "gtvT",
                }),
                ...pickDeps(d, "getZoneAbbreviation"),
                ...pickAliasedDeps(d, {
                    "getBaseTime": "getBaseTimeSnapshot",
                    "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameForExport",
                }),
                ...pickDeps(d, "getCurrentMultiSubgroupName")
            };
        }

        function buildMainImageExportServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_IMAGE_EXPORT_NAMING",
                    "GTV_IMAGE_EXPORT_ACTIONS",
                ),
                ...pickAliasedDeps(d, {
                    "imageExportApi": "GTV_IMAGE_EXPORT",
                    "t": "gtvT",
                }),
                ...pickDeps(d,
                    "pad",
                    "timeService",
                    "getCustomOffsetMinutes",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "getBaseTime": "getBaseTimeSnapshot",
                    "getActiveGroupName": "getActiveGroupNameSnapshot",
                }),
                ...pickDeps(d, "getZoneAbbreviation"),
                ...pickAliasedDeps(d, {
                    "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameForExport",
                }),
                ...pickDeps(d, "getCurrentMultiSubgroupName"),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickDeps(d,
                    "isMultiTab",
                    "ensureMultiRangeState",
                    "detectForeignObjectRendererSupport",
                    "renderTimezoneTableToPngDataUrl",
                    "renderTimezoneTableFallbackDataUrl",
                    "renderMultiRangesToPngDataUrl",
                    "renderMultiRangeSingleToPngDataUrl",
                    "renderMultiRangesFallbackDataUrl",
                    "renderMultiRangeTitlesToPngDataUrl",
                    "getTimezoneTableImageFilename",
                    "getMultiRangeTableImageFilename",
                    "getMultiRangeTitlesImageFilename",
                ),
                ...pickAliasedDeps(d, {
                    "getMultiRanges": "getPatchedMultiRangesState",
                }),
                ...pickDeps(d, "isDomExceptionLike"),
                ...pickDeps(d, "setCanUseForeignObjectRenderer")
            };
        }

        function buildMainAppStateServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_APP_STATE_PATCHER",
                    "GTV_APP_PERSISTENCE_STATE",
                ),
                ...pickAliasedDeps(d, {
                    "getStateSource": "getMainAppStateSource",
                    "stateSetters": "directStateSetters",
                }),
                ...pickDeps(d,
                    "setIsRealtimeState",
                    "syncActiveFormatProfileFromState",
                    "ensureFormatProfiles",
                    "getCurrentFormatProfileState",
                    "resolveFormatProfileContext",
                ),
                ...pickDeps(d, "applyFormatProfileState")
            };
        }

        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");
        const createMainTabServices = requireFunction(
            mainCoreServices.createMainTabServices,
            "mainCoreServices.createMainTabServices"
        );

        const createMainImageExportNamingProxy = requireFunction(
            mainCoreServices.createMainImageExportNamingProxy,
            "mainCoreServices.createMainImageExportNamingProxy"
        );

        const createMainImageExportServices = requireFunction(
            mainCoreServices.createMainImageExportServices,
            "mainCoreServices.createMainImageExportServices"
        );

        const createMainAppStateServices = requireFunction(
            mainCoreServices.createMainAppStateServices,
            "mainCoreServices.createMainAppStateServices"
        );

        const mainTabServicesConfig = buildMainTabServicesConfig({
            ...pickDeps([
                "GTV_FORMAT_CONTROLS",
                "serviceBootstrap",
                "COPY_FORMAT_KEYS",
                "TIME_PART_KEYS",
                "gtvT",
                "sanitizeCopyFormatOrder",
                "deferDynamicCall",
                "getRenderListRef",
                "updateCopyFormatPreview",
                "savePersistenceSafely",
                "upgradeNativeTitleTooltips",
                "getPatchedShowCopyFormatState",
                "getPatchedDisplayFormatOrderState",
                "getPatchedActiveFormatProfileContextState",
                "patchAppState",
                "sanitizeCopyFormatOrderForContext",
                "syncActiveFormatProfileFromState",
                "getPatchedDisplayFormatEnabledState",
                "sanitizeCopyFormatEnabledForContext",
                "getPatchedDisplayTimePartsEnabledState",
                "sanitizeTimePartsEnabledForContext",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "getActiveCopyFormatKeysForCurrentContext",
                "getActiveTimePartKeysForCurrentContext",
                "sanitizeMainTab",
                "clampGroupIndex",
                "normalizeGroupTabState",
                "isMultiTab",
                "isFixedTimeTab",
                "getPatchedSlotCountState",
                "getPatchedShowTimelineState",
                "getIsRealtimeState",
                "setIsRealtimeState",
                "setGlobalTimeState",
                "getPatchedMainTabState",
                "setCurrentMainTabState",
                "getPatchedActiveGroupIdState",
                "setActiveGroupIdState",
                "getActiveGroupIdByMainTabStateSnapshot",
                "setActiveGroupIdByMainTabState",
                "hideFloatingTooltip",
                "syncCurrentMultiStateToActiveSubgroup",
                "refreshMultiRangeControls",
                "renderBaseTimeSelect",
                "loadCurrentMultiStateFromActiveSubgroup",
                "bindFacadeMethod",
                "getGroupTabsServiceRef",
                "renderMultiRangesSafely",
                "renderFixedTimeTab",
                "getRenderTimelineFrameRef",
                "updateTimeAdjustPanelSafely",
                "resolveFormatProfileContext",
                "activateFormatProfileContext",
            ]),
        });

        const mainTabServices = createMainTabServices(mainTabServicesConfig);

        const formatControlsService = mainTabServices.formatControlsService;

        const tabUiService = mainTabServices.tabUiService;

        const tabOrchestratorService = mainTabServices.tabOrchestratorService;

        const mainImageExportNamingProxyConfig = buildMainImageExportNamingProxyConfig({
            ...pickDeps([
                "getImageExportNamingServiceRef",
                "getCustomOffsetMinutes",
                "pad",
                "timeService",
                "getBaseTimezoneRef",
                "getGroupsStateSnapshot",
                "getPatchedActiveGroupIdState",
                "gtvT",
                "getZoneAbbreviation",
                "getBaseTimeSnapshot",
                "sanitizeMultiSubgroupNameForExport",
                "getCurrentMultiSubgroupName",
            ]),
        });

        const mainImageExportNamingProxy = createMainImageExportNamingProxy(mainImageExportNamingProxyConfig);

        const {
            sanitizeFilenamePart,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename
        } = mainImageExportNamingProxy;

        const mainImageExportServicesConfig = buildMainImageExportServicesConfig({
            ...pickDeps([
                "GTV_IMAGE_EXPORT_NAMING",
                "GTV_IMAGE_EXPORT_ACTIONS",
                "GTV_IMAGE_EXPORT",
                "gtvT",
                "pad",
                "timeService",
                "getCustomOffsetMinutes",
                "getBaseTimezoneRef",
                "getBaseTimeSnapshot",
                "getActiveGroupNameSnapshot",
                "getZoneAbbreviation",
                "sanitizeMultiSubgroupNameForExport",
                "getCurrentMultiSubgroupName",
                "deferDynamicCall",
                "getShowToastRef",
                "isMultiTab",
                "ensureMultiRangeState",
                "detectForeignObjectRendererSupport",
                "renderTimezoneTableToPngDataUrl",
                "renderTimezoneTableFallbackDataUrl",
                "renderMultiRangesToPngDataUrl",
                "renderMultiRangeSingleToPngDataUrl",
                "renderMultiRangesFallbackDataUrl",
                "renderMultiRangeTitlesToPngDataUrl",
            ]),
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename,
            ...pickDeps([
                "getPatchedMultiRangesState",
                "isDomExceptionLike",
                "setCanUseForeignObjectRenderer",
            ]),
        });

        const mainImageExportServices = createMainImageExportServices(mainImageExportServicesConfig);

        const imageExportNamingService = mainImageExportServices.imageExportNamingService;

        const imageExportActionsService = mainImageExportServices.imageExportActionsService;

        const mainAppStateServicesConfig = buildMainAppStateServicesConfig({
            ...pickDeps([
                "GTV_APP_STATE_PATCHER",
                "GTV_APP_PERSISTENCE_STATE",
                "getMainAppStateSource",
                "directStateSetters",
                "setIsRealtimeState",
                "syncActiveFormatProfileFromState",
                "ensureFormatProfiles",
                "getCurrentFormatProfileState",
                "resolveFormatProfileContext",
                "applyFormatProfileState",
            ]),
        });

        const mainAppStateServices = createMainAppStateServices(mainAppStateServicesConfig);

        const appStatePatcherService = mainAppStateServices.appStatePatcherService;

        const appPersistenceStateService = mainAppStateServices.appPersistenceStateService;
        return Object.freeze({
            formatControlsService,
            tabUiService,
            tabOrchestratorService,
            sanitizeFilenamePart,
            imageExportNamingService,
            imageExportActionsService,
            appStatePatcherService,
            appPersistenceStateService
        });
    }
    globalObj.GTVMainRuntimeUiServicesBootstrap = Object.freeze({ createService });
})(typeof window !== "undefined" ? window : globalThis);
