import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsonPlugin from '@eslint/json';
import markdownPlugin from '@eslint/markdown';
import cssPlugin from '@eslint/css';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // No procesar node_modules, dist, package-lock y todo el frontend por ahora
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/package-lock.json',
      'packages/frontend/**',
    ],
  },

  // Reglas generales para JS/TS/JSX/TSX
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      js,
      prettier: prettierPlugin,
    },
    extends: ['js/recommended'],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Aplica Prettier y considera error cualquier diferencia de formato
      'prettier/prettier': 'error',
    },
  },

  // Conjunto de reglas recomendadas para TypeScript
  tseslint.configs.recommended,

  // Lint para JSON
  {
    files: ['**/*.json'],
    plugins: { json: jsonPlugin },
    language: 'json/json',
    extends: ['json/recommended'],
  },

  // Lint para Markdown (GitHub Flavored)
  {
    files: ['**/*.md'],
    plugins: { markdown: markdownPlugin },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },

  // Lint para CSS
  {
    files: ['**/*.css'],
    plugins: { css: cssPlugin },
    language: 'css/css',
    extends: ['css/recommended'],
  },
]);
