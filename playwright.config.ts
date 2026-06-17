import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],
  use: {
    // Если в env нет BASE_URL, берем дефолтный
    baseURL: process.env.BASE_URL ?? 'https://www.redmine.org',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  outputDir: 'test-results'
});

// Добавляем глобальные константы в процесс, чтобы тесты могли их прочитать,
// если они не заданы снаружи через ENV
process.env.SEARCH_KEYWORD = process.env.SEARCH_KEYWORD ?? 'Test';
process.env.ACTIVITY_USER = process.env.ACTIVITY_USER ?? 'Go MAEDA';
process.env.ACTIVITY_DATE = process.env.ACTIVITY_DATE ?? '2026-06-16';
