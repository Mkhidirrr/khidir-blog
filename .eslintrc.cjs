// ANALYSIS: File ini berisi konfigurasi ESLint. Pastikan rules sudah sesuai dengan kebutuhan project Astro/TypeScript. Periksa apakah ada plugin yang belum diinstall atau aturan yang bertentangan.

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
