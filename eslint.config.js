import configPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig(
	globalIgnores(['node_modules', 'dist']),
	js.configs.recommended,
	tseslint.configs.recommended,
	configPrettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		rules: {
			semi: ['off'],
			curly: 'off',
			quotes: ['error', 'single'],
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-unused-expressions': 'error',
		},
	}
);
