const path = require("path");
module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "plugin:react/recommended",
    "standard-with-typescript",
    "prettier"
  ],
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": [
      path.resolve(__dirname, './packages/chrome/tsconfig.json'),
      path.resolve(__dirname, './packages/chrome/tsconfig.node.json'),
      path.resolve(__dirname, './packages/core/tsconfig.json'),
    ]
  },
  plugins: ["react", "prettier"],
  "rules": {
    "prettier/prettier": [
      "error",  // let eslint throw prettier errors
      {
        "singleQuote": true,
      }
    ],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-floating-promises": 0
  }
}
