import { test, TestInfo } from '@playwright/test';
import { YamlReader } from '../utils/yamlReader';
import { Logger } from '../utils/logger';
import { BrowserStackStatus } from '../integrations/browserstack/browserstackStatus';
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
    await this.cleanReports();
    Logger.clearLogFile();
  }

  /**
   * Runs before each test.
   * Sets execution ID and navigates to base URL.
   * Logs the name of the test scenario.
   * @param page Playwright page instance
   * @param testInfo Playwright test metadata
   */
  async beforeEachTest(page: any, testInfo: TestInfo): Promise<void> {
    Logger.setExecutionId(); // ✅ executionId only for test logs
    Logger.info(`Test started: ${testInfo.title}`);
    const baseUrl = YamlReader.readUrl(process.env.ENV || 'qa');
    await page.goto(baseUrl);
  }

  /**
   * Runs after each test.
   * Closes the page and logs completion with test name.
   * @param page Playwright page instance
   * @param testInfo Playwright test metadata
   */
  async afterEachTest(page: any, testInfo: TestInfo): Promise<void> {
    Logger.info(`Test ended: ${testInfo.title}`);
    await BrowserStackStatus.updateFromTestInfo(page, testInfo);
    await page.close();
  }
}

const hooks = new Hooks();

test.beforeAll(async () => {
  await hooks.beforeAllTests();
});

test.beforeEach(async ({ page }, testInfo) => {
  await hooks.beforeEachTest(page, testInfo);
});

test.afterEach(async ({ page }, testInfo) => {
  await hooks.afterEachTest(page, testInfo);
});

export default Hooks;