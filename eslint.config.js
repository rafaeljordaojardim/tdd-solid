import love from 'eslint-config-love';

export default [
  {
    ...love,
    files: ['src/*.js', 'src/*.ts'],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": "off",

    }
  },
]