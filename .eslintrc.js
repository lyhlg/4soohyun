// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:react-hooks/recommended', // React hooks rules
    'plugin:prettier/recommended', // Prettier recommended rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off', // We will use TypeScript's types for component props instead
    'react/react-in-jsx-scope': 'off', // No need to import React with Next.js
    'jsx-a11y/anchor-is-valid': 'off', // This rule is not compatible with how Next.js's <Link />
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': [
      // I suggest this setting for requiring return types on functions only where usefull
      'warn',
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }, { usePrettierrc: true }], // Includes .prettierrc.js rules
    '@typescript-eslint/no-empty-interface': 0, // default prop를 정의하기 위함
    '@typescript-eslint/no-empty-function': 0, // empty function을 허용함
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
  },
}
