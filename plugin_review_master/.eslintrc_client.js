module.exports = {
    root: true,
    extends: ["eslint:recommended"],
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    globals: {},
    rules: {
        "eol-last": ["error", "always"],
        "func-style": "off",
        "global-require": "off",
        "linebreak-style": ["error", "windows"],
        "keyword-spacing": "off",
        "no-bitwise": "off",
        "no-useless-escape": "off",
        "no-plusplus": "off",
        "no-unneeded-ternary": "off",
        "no-unused-vars": "off",
        "prefer-const": "off",
        "prefer-spread": "off",
        "no-mixed-spaces-and-tabs": "off",
        indent: "off",
        quotes: "off",
        radix: "off",
        semi: ["error", "always"],
        strict: ["error", "global"]
    }
};