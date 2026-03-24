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
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text-summary', 'html'],
            all: true,
            thresholds: {
                statements: 83.0,
                lines: 83.0,
                branches: 69.3,
                functions: 59.0
            },
            include: [
                'background.js',
                'i18n.js',
                'main.js',
                'js/modules/**/*.js'
            ],
            exclude: [
                'dist/**',
                'dist_extension/**',
                'coverage/**',
                'node_modules/**',
                'js/vendor/**',
                'js/bundle.js',
                'tests/**'
            ]
        }
    },
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
