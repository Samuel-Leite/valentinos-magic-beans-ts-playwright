import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isRemote = process.env.RUN_REMOTE === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright']
  ],
  use: {
    trace: 'on-first-retry',
  },
  projects: isRemote
    ? [
      {
        name: process.env.DEVICE || 'desktop',
        use: {}, // remote runner will be applied to tests via remoteRunner.ts
      },
    ]
    : [
      {
        name: 'Local',
        use: {
          headless: false,
        },
      },
    ],
});