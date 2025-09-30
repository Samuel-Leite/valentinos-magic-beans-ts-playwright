import { test } from '@playwright/test';
import { YamlReader } from '../utils/yamlReader';
import { Logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

/**
 * Manages global test lifecycle hooks including environment setup,
 * report cleanup, and per-test execution tracking.
 */
class Hooks {
  /**
   * Deletes previous test report directories to ensure a clean run.
   */
  async cleanReports(): Promise<void> {
    const reportDirs = [
      'allure-results',
      'playwright-report',
      'test-results'
    ].map(dir => path.join(__dirname, '..', '..', dir));

    const deleted: string[] = [];
    const failed: string[] = [];

    for (const dir of reportDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        deleted.push(path.basename(dir));
      } catch (err: any) {
        failed.push(`${path.basename(dir)} (${err.message})`);
      }
    }

    if (deleted.length > 0) Logger.info(`Deleted directories: ${deleted.join(', ')}`);
    if (failed.length > 0) Logger.warn(`Failed to delete: ${failed.join(', ')}`);
  }

  /**
   * Runs once before all tests.
   * Logs environment and cleans up previous reports.
   */
  async beforeAllTests(): Promise<void> {
    Logger.info(`Environment: ${process.env.ENV}`);
    await this.cleanReports();
    Logger.clearLogFile();
  }

  /**
   * Runs before each test.
   * Sets execution ID and navigates to base URL.
   * @param page Playwright page instance
   */
  async beforeEachTest(page: any): Promise<void> {
    Logger.setExecutionId(); // ✅ executionId only for test logs
    Logger.info('Test started');
    const baseUrl = YamlReader.readUrl(process.env.ENV || 'qa');
    Logger.info(`URL loaded: ${baseUrl}`);
    await page.goto(baseUrl);
  }

  /**
   * Runs after each test.
   * Closes the page and logs completion.
   * @param page Playwright page instance
   */
  async afterEachTest(page: any): Promise<void> {
    Logger.info('Test ended');
    await page.close();
  }
}

const hooks = new Hooks();

test.beforeAll(async () => {
  await hooks.beforeAllTests();
});

test.beforeEach(async ({ page }) => {
  await hooks.beforeEachTest(page);
});

test.afterEach(async ({ page }) => {
  await hooks.afterEachTest(page);
});

export default Hooks;