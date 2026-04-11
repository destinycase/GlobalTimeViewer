const semanticSafetyRules = Object.freeze({
    "no-debugger": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-undef": "error",
    "no-redeclare": "error",
    eqeqeq: ["error", "always"],
    "no-loss-of-precision": "error",
    "no-template-curly-in-string": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "use-isnan": "error",
    "valid-typeof": "error"
});

const deliveryQualityRules = Object.freeze({
    "no-console": ["error", { allow: ["warn", "error"] }]
});

const moduleUnusedVarRules = Object.freeze({
    "no-unused-vars": ["error", {
        args: "none",
        caughtErrors: "none",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_"
    }]
});

const entryUnusedVarRules = Object.freeze({
    "no-unused-vars": ["error", {
        args: "none",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_"
    }]
});

const baseRules = Object.freeze({
    ...semanticSafetyRules,
    ...deliveryQualityRules
});

const sharedRuntimeGlobals = Object.freeze({
    alert: "readonly",
    AbortController: "readonly",
    Blob: "readonly",
    Buffer: "readonly",
    cancelAnimationFrame: "readonly",
    chrome: "readonly",
    clearInterval: "readonly",
    clearTimeout: "readonly",
    confirm: "readonly",
    console: "readonly",
    DOMException: "readonly",
    document: "readonly",
    Event: "readonly",
    Element: "readonly",
    fetch: "readonly",
    FileReader: "readonly",
    global: "readonly",
    getComputedStyle: "readonly",
    HTMLElement: "readonly",
    Image: "readonly",
    Intl: "readonly",
    localStorage: "readonly",
    location: "readonly",
    module: "readonly",
    MutationObserver: "readonly",
    navigator: "readonly",
    Node: "readonly",
    NodeFilter: "readonly",
    process: "readonly",
    prompt: "readonly",
    requestAnimationFrame: "readonly",
    queueMicrotask: "readonly",
    require: "readonly",
    setInterval: "readonly",
    setTimeout: "readonly",
    sessionStorage: "readonly",
    URL: "readonly",
    window: "readonly",
    XMLSerializer: "readonly",
    crypto: "readonly"
});

module.exports = [
    {
        ignores: [
            "dist/**",
            "dist_extension/**",
            "coverage/**",
            "node_modules/**",
            "js/vendor/**",
            "js/bundle.js"
        ]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: sharedRuntimeGlobals
        },
        rules: baseRules
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: sharedRuntimeGlobals
        },
        rules: baseRules
    },
    {
        files: ["js/modules/**/*.js"],
        rules: moduleUnusedVarRules
    },
    {
        files: ["background.js", "i18n.js"],
        rules: entryUnusedVarRules
    }
];
