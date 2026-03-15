import { createLogger, defineConfig } from 'vite';

const logger = createLogger();
const loggerWarn = logger.warn;
logger.warn = (msg, options) => {
    const text = String(msg || "");
    if (text.includes(`can't be bundled without type="module" attribute`)) {
        return;
    }
    loggerWarn(msg, options);
};

export default defineConfig({
    customLogger: logger,
    base: '',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html'
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
