import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // environment: 'jsdom', // uncomment if you need DOM APIs
    globals: true, // Use global APIs like describe, it, expect
  },
});
