const semanticSafetyRules = Object.freeze({
    "no-debugger": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-loss-of-precision": "error",
    "no-template-curly-in-string": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "use-isnan": "error",
    "valid-typeof": "error"
});

module.exports = [
    {
        ignores: [
            "dist/**",
            "dist_extension/**",
            "coverage/**",
            "node_modules/**",
            "js/vendor/**"
        ]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: semanticSafetyRules
    },
    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        rules: semanticSafetyRules
    }
];
