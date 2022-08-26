/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@@': path.resolve(__dirname, './'),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'piniaCapacitorPersist',
			fileName: (format: string) => `pinia-capacitor-persist.${format}.js`,
			formats: ['es', 'umd'],
		},
		rollupOptions: {
			external: ['@capacitor/preferences', 'vue'],
			output: {
				globals: {
					'@capacitor/preferences': 'CapacitorPreferences',
				},
			},
		},
	},
});
