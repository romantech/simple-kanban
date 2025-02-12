import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...tailwindPlugin.configs['flat/recommended'],
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  prettierPluginRecommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  { rules: { 'prettier/prettier': 'warn' } },
);
