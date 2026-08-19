import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/", "oracle_academy/", "data/manifest.json"],
    },
    js.configs.recommended,
    {
        files: ["js/**/*.js"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            globals: globals.browser,
        },
    },
    {
        files: ["tools/**/*.js", "tests/**/*.js"],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            globals: globals.node,
        },
    },
];
