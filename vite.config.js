import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger, defineConfig } from 'vite';

const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));

const logger = createLogger();
const loggerWarn = logger.warn;
logger.warn = (msg, options) => {
    const text = String(msg || "");
    if (text.includes(`can't be bundled without type="module" attribute`)) {
        return;
    }
    loggerWarn(msg, options);
};

// The extension page lives in src/. scripts/build-extension.mjs runs
// `vite build src --config vite.config.js`, so the build root is src/ while
// Vitest keeps the repository root for test discovery and coverage paths.
export default defineConfig({
    customLogger: logger,
    base: '',
    test: {
        include: ['tests/**/*.test.mjs'],
        exclude: ['node_modules/**', 'tests/local/**'],
        setupFiles: ['tests/helpers/install-runtime-globals.mjs'],
        coverage: {
            provider: 'v8',
            reporter: ['text-summary', 'html'],
            reportsDirectory: 'coverage',
            all: true,
            thresholds: {
                statements: 83.0,
                lines: 83.0,
                branches: 72.0,
                functions: 70.0
            },
            include: [
                'src/background.js',
                'src/i18n.js',
                'src/main.js',
                'src/js/modules/**/*.js'
            ],
            exclude: [
                'src/js/vendor/**',
                'src/js/bundle.js',
                'tests/**'
            ]
        }
    },
    build: {
        outDir: path.join(PROJECT_ROOT, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.join(PROJECT_ROOT, 'src', 'index.html')
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
