import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // Use BASE_URL from config.yaml
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
  timeout: 30000, // Set 30 seconds timeout
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
