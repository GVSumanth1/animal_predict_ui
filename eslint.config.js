const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");

module.exports = [
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "dist/**",
            "build/**",
            "coverage/**",
            ".git/**",
            ".vscode/**",
            ".idea/**",
            "*.min.js",
            ".env.local",
            ".env",
            "out/**"
        ]
    },
    js.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                React: "readonly",
                ...globals.browser,
                ...globals.node,
                ...globals.jest
            }
        },
        rules: {
            "react/no-unescaped-entities": "off",
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
        }
    }
];