import love from 'eslint-config-love';

export default [
  {
    ...love,
    files: ['src/**'],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",

    }
  },
]