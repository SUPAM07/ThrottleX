import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
    exclude: ['src/test/load/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules', 'dist'],
      include: ['src/main/**/*.ts'],
      thresholds: {
        global: {
          lines: 70,
          functions: 70,
          branches: 60,
          statements: 70,
        },
      },
    },
    testTimeout: 30_000,
    alias: {
      '@': path.resolve(__dirname, './src/main'),
    },
  },
});
