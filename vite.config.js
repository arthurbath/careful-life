import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	build: {
		outDir: '../dist',
		emptyOutDir: true,
	},
	plugins: [
		ViteImageOptimizer({
			png: {
				quality: 80,
			},
			jpeg: {
				quality: 75,
			},
			webp: {
				lossless: true,
			},
			avif: {
				cqLevel: 33,
			},
			gif: {
				optimizationLevel: 3,
			},
			svg: {
				multipass: true,
			},
		}),
	],
})

