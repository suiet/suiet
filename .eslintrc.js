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
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      path.resolve(__dirname, './packages/chrome/tsconfig.json'),
      path.resolve(__dirname, './packages/core/tsconfig.json'),
      path.resolve(__dirname, './packages/wallet-adapter/tsconfig.json'),
      path.resolve(__dirname, './examples/wallet-adapter-demo/tsconfig.json'),
    ],
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/no-extraneous-class': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    'react/display-name': 0,
    'new-cap': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
