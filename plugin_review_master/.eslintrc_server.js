module.exports = {
    root: true,
    extends: "eslint:recommended",
    env: {
        commonjs: true
    },
    globals: {
        dw: true,
        customer: true,
        session: true,
        request: true,
        response: true,
        empty: true,
        PIPELET_ERROR: true,
        PIPELET_NEXT: true
    },
    rules: {
        "eol-last": ["error", "always"],
        "func-style": "off",
        "global-require": "off",
        "linebreak-style": ["error", "windows"],
        "keyword-spacing": "off",
        "no-bitwise": "off",
        "no-plusplus": "off",
        "no-unneeded-ternary": "off",
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "prefer-const": "off",
        "prefer-spread": "off",
        "no-mixed-spaces-and-tabs": "off",
        indent: "off",
        quotes: "off",
        radix: ["error", "always"],
        semi: ["error", "always"],
        strict: ["error", "global"]
    }
};