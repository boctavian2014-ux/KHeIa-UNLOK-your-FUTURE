module.exports = {
  root: true,
  extends: ['@react-native-community'],
  env: {
    es2021: true,
  },
  rules: {
    'prettier/prettier': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-bitwise': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
