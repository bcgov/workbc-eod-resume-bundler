const prettierConfig = require("./.prettierrc")

module.exports = {
    extends: ["elmsd"],
    parserOptions: { ecmaVersion: 2020 },
    rules: {
        "no-underscore-dangle": "off",
        "no-shadow": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        /* jsx-a11y rules should be fixed */
        "jsx-a11y/anchor-is-valid": "warn",
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/label-has-associated-control": "warn",
        "jsx-a11y/no-static-element-interactions": "warn",
        "prettier/prettier": ["error", prettierConfig],
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "warn"
    }
}
