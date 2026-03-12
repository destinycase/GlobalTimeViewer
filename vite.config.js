import { defineConfig } from 'vite';

export default defineConfig({
    base: '',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'vite-index.html'
            },
            output: {
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        sourcemap: false
    }
});
