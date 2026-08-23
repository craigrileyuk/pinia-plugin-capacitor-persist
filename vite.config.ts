import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
			'@@': path.resolve(import.meta.dirname, './'),
		},
	},
	build: {
		lib: {
			entry: path.resolve(import.meta.dirname, 'src/index.ts'),
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
	test: {
		environment: 'jsdom',
	},
});
