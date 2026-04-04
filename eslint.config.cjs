const semanticSafetyRules = Object.freeze({
    "no-debugger": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
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

const baseRules = Object.freeze({
    ...semanticSafetyRules,
    ...deliveryQualityRules
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
            sourceType: "module"
        },
        rules: baseRules
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: baseRules
    },
    {
        files: ["js/modules/**/*.js"],
        rules: moduleUnusedVarRules
    }
];
