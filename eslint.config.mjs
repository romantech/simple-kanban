import { dirname } from 'path';
import { fileURLToPath } from 'url';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import nextPlugin from '@next/eslint-plugin-next';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  globalIgnores(['.next/**', 'node_modules/**', 'dist/**', 'build/**']),

  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
  },

  ...tailwindPlugin.configs['flat/recommended'],
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  prettierPluginRecommended,

  {
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      // 타입 import 할 때 인라인으로 type 키워드 추가 e.g., import { type Circle } from '...'
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      'tailwindcss/no-custom-classname': ['warn', { whitelist: ['toaster'] }],
    },
  },

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
