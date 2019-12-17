module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'packages/**/tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    '@typescript-eslint/tslint',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'no-use-before-define': ['error', 'nofunc'],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      ignoreRestSiblings: true
    }]
  }
};
