const path = require('path');
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // Since React 17 we don't need to import React in JSX
    'standard-with-typescript',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      path.resolve(__dirname, './packages/chrome/tsconfig.json'),
      path.resolve(__dirname, './packages/chrome/tsconfig.node.json'),
      path.resolve(__dirname, './packages/core/tsconfig.json'),
    ],
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
  },
};
