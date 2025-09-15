import { defineConfig } from 'vitest/config';
import { default as react } from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      // Use browser ESM version of styled-components to avoid CommonJS issues
      'styled-components': path.resolve('./src/unified-theme/node_modules/styled-components/dist/styled-components.browser.esm.js'),
      // Resolve React from unified-theme directory since tests run from root but dependencies are in subdirectory
      'react': path.resolve('./src/unified-theme/node_modules/react'),
    },
  }
});
