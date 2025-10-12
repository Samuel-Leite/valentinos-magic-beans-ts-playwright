import { test, TestInfo } from '@playwright/test';
import { YamlReader } from '../utils/yamlReader';
import { Logger } from '../utils/logger';
import { BrowserStackStatus } from '../integrations/browserstack/browserstackStatus';
import { runTestCaseStart, runTestCaseFinished } from '../integrations/azure/AzureTestCaseService';
import { TestMetadataParser } from '../integrations/azure/TestMetadataParser';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

/**
* Manages global test lifecycle hooks including environment setup,
* report cleanup, Azure DevOps integration, and per-test execution tracking.
*/
class Hooks {
  /**
   * Deletes previous test report directories to ensure a clean run.
   * This prevents stale data from affecting current test results.
   */
  async cleanReports(): Promise<void> {
    const reportDirs = ['allure-results', 'playwright-report', 'test-results']
      .map(dir => path.join(__dirname, '..', '..', dir));

    for (const dir of reportDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        Logger.info(`[Hooks] Deleted report directory: ${path.basename(dir)}`);
      } catch (err: any) {
        Logger.warn(`[Hooks] Failed to delete ${path.basename(dir)}: ${err.message}`);
      }
    }
  }

  /**
   * Runs once before all tests.
   * Cleans up previous reports and initializes logging.
   */
  async beforeAllTests(): Promise<void> {
    await this.cleanReports();
    Logger.clearLogFile();
    Logger.info(`[Hooks] Log file cleared and test environment initialized.`);
  }

  /**
   * Runs before each test.
   * Sets execution ID, navigates to base URL, and activates the test case in Azure DevOps.
   * @param page Playwright page instance
   * @param testInfo Playwright test metadata
   */
  async beforeEachTest(page: any, testInfo: TestInfo): Promise<void> {
    Logger.setExecutionId(); // Unique ID for tracking logs per test
    Logger.info(`[Hooks] Test started: ${testInfo.title}`);

    const baseUrl = YamlReader.readUrl(process.env.ENV || 'qa');
    Logger.info(`[YamlReader] Environment URL '${process.env.ENV || 'qa'}' successfully accessed from YAML file`);
    await page.goto(baseUrl);

    // Azure DevOps: Activate test case before execution
    try {
      const { planId, suiteId, testCaseId } = TestMetadataParser.extract(testInfo.title); // ✅ Corrigido aqui
      await runTestCaseStart(planId, suiteId, testCaseId);
      Logger.info(`[Azure] Test case ${testCaseId} activated in Azure DevOps`);
    } catch (err: any) {
      Logger.warn(`[Azure] Failed to activate test case: ${err.message}`);
    }
  }

  /**
   * Runs after each test.
   * Publishes test result to Azure DevOps, updates BrowserStack status, and closes the page.
   * @param page Playwright page instance
   * @param testInfo Playwright test metadata
   */
  async afterEachTest(page: any, testInfo: TestInfo): Promise<void> {
    Logger.info(`[Hooks] Test ended: ${testInfo.title}`);

    // Azure DevOps: Publish test result after execution
    try {
      const { planId, suiteId, testCaseId } = TestMetadataParser.extract(testInfo.title); // ✅ Corrigido aqui

      // Ensure status is valid and mapped correctly
      const status = ['passed', 'failed', 'skipped', 'timedOut', 'interrupted'].includes(testInfo.status ?? '')
        ? testInfo.status!
        : 'failed';

      const error = testInfo.error?.message;
      await runTestCaseFinished(planId, suiteId, testCaseId, status, error);
      Logger.info(`[Azure] Test case ${testCaseId} result published to Azure DevOps`);
    } catch (err: any) {
      Logger.warn(`[Azure] Failed to publish test result: ${err.message}`);
    }

    // BrowserStack: Update test status
    await BrowserStackStatus.updateFromTestInfo(page, testInfo);
    Logger.info(`[BrowserStackStatus] Status updated for test: ${testInfo.title}`);

    // Cleanup: Close browser page
    await page.close();
    Logger.info(`[Hooks] Page instance closed.`);
  }
}

// Register hooks globally
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