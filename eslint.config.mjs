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

  // Configuración base de seguridad
  {
    rules: {
      // Reglas de seguridad
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-inline-comments': 'off',
      // Detectar credenciales hardcodeadas
      'no-secrets/no-secrets': 'off', // Requiere plugin adicional
      // Prevenir inyección de código
      'security/detect-object-injection': 'off', // Requiere eslint-plugin-security
      'security/detect-non-literal-regexp': 'off',
      'security/detect-unsafe-regex': 'off',
    },
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
