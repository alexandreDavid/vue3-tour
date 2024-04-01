module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    //'@vue/prettier/@typescript-eslint',
    //'@vue/standard',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
    'no-underscore-dangle': [2, { allow: ['_id'] }],
    'no-plusplus': 'off',
    'class-methods-use-this': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'lines-between-class-members': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'import/prefer-default-export': 'off',
  },
};
