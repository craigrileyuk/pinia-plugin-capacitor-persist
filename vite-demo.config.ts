import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({}),
		tailwindcss(),
	],
	root: process.cwd() + '/demo',
	server: {
		port: 6565,
	},
});
