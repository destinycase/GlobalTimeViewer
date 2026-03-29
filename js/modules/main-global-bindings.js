(function initGtvMainGlobalBindings(globalObj) {
    "use strict";

    const BINDING_MAP = Object.freeze({
        GTV_MAIN_BOOTSTRAP_GUARD: "GTVMainBootstrapGuard",
        GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS: "GTVMainBootstrapGuardBindings",
        GTV_MAIN_RUNTIME_HOST_UTILS: "GTVMainRuntimeHostUtils",
        GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS: "GTVMainRuntimeHostUtilsBindings",
        GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES: "GTVMainRuntimeHostAccessorProxies",
        GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS: "GTVMainRuntimeHostAccessorBindings",
        GTV_MAIN_RUNTIME_PRIMARY_STATE: "GTVMainRuntimePrimaryState",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS: "GTVMainRuntimePrimaryStateBindings",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES: "GTVMainRuntimePrimaryStateAccessorProxies",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS: "GTVMainRuntimePrimaryStateAccessorBindings",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS: "GTVMainRuntimeServiceBridgeHelpers",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS: "GTVMainRuntimeServiceBridgeHelperBindings",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES: "GTVMainRuntimeServiceBridgeAccessorProxies",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS: "GTVMainRuntimeServiceBridgeAccessorBindings",
        GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES: "GTVMainRuntimeUiBridgeAccessorProxies",
        GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS: "GTVMainRuntimeUiBridgeAccessorBindings",
        GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES: "GTVMainRuntimeOperationAccessorProxies",
        GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS: "GTVMainRuntimeOperationAccessorBindings",
        GTV_MAIN_RUNTIME_PUBLIC_API_BINDINGS: "GTVMainRuntimePublicApiBindings",
        GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES: "GTVMainRuntimeBootstrapAccessorProxies",
        GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS: "GTVMainRuntimeBootstrapAccessorBindings",
        GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES: "GTVMainRuntimeCoreAccessorProxies",
        GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS: "GTVMainRuntimeCoreAccessorBindings",
        GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES: "GTVMainRuntimeStatePatchAccessorProxies",
        GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS: "GTVMainRuntimeStatePatchAccessorBindings",
        GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK: "GTVMainRuntimePatchedStateFallback",
        GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS: "GTVMainRuntimePatchedStateFallbackBindings",
        GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS: "GTVMainRuntimeLocalStateHelpers",
        GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS: "GTVMainRuntimeLocalStateHelpersBindings",
        GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES: "GTVMainRuntimeLocalStateAccessorProxies",
        GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS: "GTVMainRuntimeLocalStateAccessorBindings",
        GTV_MAIN_FACADE_BINDINGS: "GTVMainFacadeBindings",
        GTV_MAIN_RUNTIME_BRIDGE_PROXIES: "GTVMainRuntimeBridgeProxies",
        GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS: "GTVMainRuntimeBridgeProxyBindings",
        GTV_MAIN_RUNTIME_TIMEZONE_HELPERS: "GTVMainRuntimeTimezoneHelpers",
        GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS: "GTVMainRuntimeTimezoneHelperBindings",
        GTV_MAIN_RUNTIME_STATE_HELPERS: "GTVMainRuntimeStateHelpers",
        GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES: "GTVMainRuntimeStateHelperAliases",
        GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS: "GTVMainRuntimeStateHelperAliasesBindings",
        GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES: "GTVMainRuntimeStateHelperAccessorProxies",
        GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS: "GTVMainRuntimeStateHelperAccessorBindings",
        GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS: "GTVMainFormatProfileFacadeBindings",
        GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS: "GTVMainCoreServiceAssemblyBindings",
        GTV_MAIN_FOUNDATION_SERVICES_BINDINGS: "GTVMainFoundationServicesBindings",
        GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS: "GTVMainRuntimeReferenceAccessorBindings",
        GTV_MAIN_RUNTIME_REFERENCE_ACCESSORS: "GTVMainRuntimeReferenceAccessors",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE: "GTVMainStateDomainWrapperBridge",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS: "GTVMainStateDomainWrapperBridgeBindings",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS: "GTVMainStateDomainWrapperGlobalBindings",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE: "GTVMainStateDomainWrapperGlobalBindingsBridge",
        GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS: "GTVMainStateDomainProxyBindings",
        GTV_MAIN_FACADE_METHOD_BINDER: "GTVMainFacadeMethodBinder",
        GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS: "GTVMainFacadeMethodBinderBindings",
        GTV_MAIN_FACADE_BRIDGE: "GTVMainFacadeBridge",
        GTV_MAIN_FACADE_BRIDGE_BINDINGS: "GTVMainFacadeBridgeBindings",
        GTV_MAIN_COMPOSITION_CONFIG_BUILDER: "GTVMainCompositionConfigBuilder",
        GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS: "GTVMainCompositionConfigBuilderBindings",
        GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER: "GTVMainCoreAssemblyConfigBuilder",
        GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS: "GTVMainCoreAssemblyConfigBuilderBindings",
        GTV_MAIN_CORE_SERVICE_BINDINGS: "GTVMainCoreServiceBindings",
        GTV_MAIN_FOUNDATION_SERVICE_BINDINGS: "GTVMainFoundationServiceBindings",
        GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER: "GTVMainRuntimeServiceConfigBuilder",
        GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS: "GTVMainRuntimeServiceConfigBuilderBindings",
        GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES: "GTVMainPatchedStateAccessorProxies",
        GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS: "GTVMainPatchedStateAccessorBindings"
    });

    const REQUIRED_BOOTSTRAP_SPECS = Object.freeze([
        { serviceName: "persistenceService", methodName: "loadPersistence" },
        { serviceName: "persistenceService", methodName: "savePersistence" },
        { serviceName: "mainUiInitService", methodName: "initUI" },
        { serviceName: "timezoneSearchService", methodName: "initSearchAndSelect" },
        { serviceName: "timerEngineService", methodName: "startRealtimeTicker" },
        { serviceName: "tabOrchestratorService", methodName: "switchMainTab" },
        { serviceName: "mainClockOrchestratorService", methodName: "updateClocks" },
        { serviceName: "mainPersistenceSnapshotService", methodName: "getPersistenceSnapshot" },
        { serviceName: "mainTimezoneMutationService", methodName: "addTimezone" },
        { serviceName: "mainTimezoneMutationService", methodName: "removeTimezone" },
        { serviceName: "calculatorActionsService", methodName: "initCalculators" },
        { serviceName: "calculatorActionsService", methodName: "copyText" }
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const globalRef = (safeDeps.globalRef && typeof safeDeps.globalRef === "object")
            ? safeDeps.globalRef
            : ((typeof window !== "undefined" && window) ? window : globalThis);

        const resolvedBindings = {};
        Object.entries(BINDING_MAP).forEach(([localKey, globalKey]) => {
            resolvedBindings[localKey] = globalRef[globalKey];
        });

        return Object.freeze({
            ...resolvedBindings,
            REQUIRED_BOOTSTRAP_SPECS
        });
    }

    globalObj.GTVMainGlobalBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
