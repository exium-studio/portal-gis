module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-require-imports": "off",
    // TODO research more
    // "@typescript-eslint/no-unused-vars": "off",
    // "@typescript-eslint/no-unused-expressions": "off",
    "react-hooks/exhaustive-deps": "off",
    "jsx-a11y/alt-text": "off",
  },
};
