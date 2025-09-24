import { test } from '@playwright/test';
import { YamlReader } from '../utils/yamlReader';
import { Logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

/**
 * Class responsible for managing global test hooks,
 * including report cleanup, initial navigation, and session teardown.
 */
class Hooks {
  allureResultsDir: string;

  /**
   * Initializes the default path for the Allure results directory.
   */
  constructor() {
    this.allureResultsDir = path.join(__dirname, '..', '..', 'allure-results');
  }

  /**
   * Deletes previous test execution report directories:
   * - allure-results
   * - playwright-report
   * - test-results
   */
  async cleanReports(): Promise<void> {
    const reportDirs = [
      path.join(__dirname, '..', '..', 'allure-results'),
      path.join(__dirname, '..', '..', 'playwright-report'),
      path.join(__dirname, '..', '..', 'test-results'),
    ];

    for (const dir of reportDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        Logger.info(`DIRECTORY: '${path.basename(dir)}' was successfully deleted`);
      } catch (err: any) {
        Logger.error(`DIRECTORY: failed to delete '${path.basename(dir)}': ${err.message}`);
      }
    }

    Logger.info('-----------------------------------------------------------------------');
  }

  /**
   * Runs before all tests.
   * Logs environment variables and cleans up previous reports.
   */
  async beforeAllTests(): Promise<void> {
    Logger.info('----------------------Environment Variables---------------------------');
    Logger.info(`ENV: ${process.env.ENV}`);
    await this.cleanReports();
    Logger.clearLogFile();
  }

  /**
   * Runs before each test.
   * Reads the environment URL and navigates to it.
   * @param page Playwright page instance
   */
  async beforeEachTest(page: any): Promise<void> {
    Logger.info('--------------------------------Start---------------------------------');
    const baseUrl = YamlReader.readUrl(process.env.ENV || 'qa');
    Logger.info(`Loaded URL: ${baseUrl}`);
    await page.goto(baseUrl);
  }

  /**
   * Runs after each test.
   * Closes the Playwright page instance.
   * @param page Playwright page instance
   */
  async afterEachTest(page: any): Promise<void> {
    Logger.info('--------------------------------End----------------------------------');
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