import { Page, TestInfo } from '@playwright/test';
import { Logger } from '../../utils/logger';

export class BrowserStackStatus {
  /**
   * Updates the current BrowserStack session status.
   * @param page - The Playwright page instance.
   * @param status - 'passed' or 'failed'
   * @param reason - A short description of the result
   */
  static async update(page: Page, status: 'passed' | 'failed', reason: string): Promise<void> {
    try {
      const payload = {
        action: 'setSessionStatus',
        arguments: { status, reason }
      };

      await page.evaluate(() => {}, `browserstack_executor: ${JSON.stringify(payload)}`);
      Logger.info(`[BrowserStack] status updated: ${status}`);
    } catch (err: any) {
      Logger.warn(`[BrowserStack] Failed to update BrowserStack status: ${err.message}`);
    }
  }

  /**
   * Determines the appropriate status and reason based on testInfo.
   * @param testInfo - Playwright test metadata
   */
  static async updateFromTestInfo(page: Page, testInfo: TestInfo): Promise<void> {
    if (testInfo.status === 'skipped') {
      Logger.info('[BrowserStack] Test was skipped — no status sent to BrowserStack');
      return;
    }

    const status: 'passed' | 'failed' = testInfo.status === 'passed' ? 'passed' : 'failed';
    const reason = this.generateReason(testInfo);

    await this.update(page, status, reason);
  }

  /**
   * Generates a user-friendly reason based on the test result.
   * @param testInfo - Playwright test metadata
   * @returns A clean, readable reason string
   */
  private static generateReason(testInfo: TestInfo): string {
    if (testInfo.status === 'passed') return 'Test passed';
    if (!testInfo.error?.message) return 'Test failed';

    const msg = testInfo.error.message;

    // Matchers for known error patterns
    const patterns: { test: RegExp; message: (match: RegExpMatchArray) => string }[] = [
      {
        test: /Session was idle for more than the set timeout/i,
        message: () => 'Test failed: Session timed out due to inactivity'
      },
      {
        test: /Session execution errored out on BrowserStack/i,
        message: () => 'Test failed: BrowserStack session execution errored out'
      },
      {
        test: /timed out/i,
        message: () => 'Test failed: Operation timed out'
      },
      {
        test: /Expected(?: string)?:\s*"([^"]+)".*element\(s\) not found/i,
        message: (match) => `Test failed: Expected "${match[1]}" but element was not found`
      },
      {
        test: /Expected(?: string)?:\s*"([^"]+)".*Received(?: string)?:\s*"([^"]+)"/i,
        message: (match) => `Test failed: Expected "${match[1]}" but received "${match[2]}"`
      }
    ];

    for (const pattern of patterns) {
      const match = msg.match(pattern.test);
      if (match) return pattern.message(match);
    }

    // Fallback: include locator if available
    const locatorMatch = msg.match(/Locator:\s*(locator\([^)]+\))/);
    const locator = locatorMatch?.[1];
    const firstLine = msg.split('\n')[0].trim();

    return locator
      ? `Test failed at ${locator}: ${firstLine}`
      : `Test failed: ${firstLine}`;
  }
}