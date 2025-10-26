import { Page, TestInfo } from '@playwright/test';
import { Logger } from '../../utils/logger';

/**
 * Utility class for updating BrowserStack session status based on Playwright test results.
 */
export class BrowserStackStatus {
  /**
   * Updates the current BrowserStack session status.
   * @param page - The Playwright page instance.
   * @param status - Test result status ('passed' or 'failed').
   * @param reason - A short description explaining the result.
   */
  static async update(page: Page, status: 'passed' | 'failed', reason: string): Promise<void> {
    try {
      const payload = {
        action: 'setSessionStatus',
        arguments: { status, reason }
      };

      await page.evaluate(() => {}, `browserstack_executor: ${JSON.stringify(payload)}`);
      Logger.info(`[BrowserStackStatus] Session status updated: ${status}`);
    } catch (err: any) {
      Logger.warn(`[BrowserStackStatus] Failed to update session status: ${err.message}`);
    }
  }

  /**
   * Determines the appropriate status and reason from Playwright test metadata,
   * and updates the BrowserStack session accordingly.
   * @param page - The Playwright page instance.
   * @param testInfo - Metadata about the executed test.
   */
  static async updateFromTestInfo(page: Page, testInfo: TestInfo): Promise<void> {
    if (testInfo.status === 'skipped') {
      Logger.info(`[BrowserStackStatus] Test was skipped — no status update sent`);
      return;
    }

    const status: 'passed' | 'failed' = testInfo.status === 'passed' ? 'passed' : 'failed';
    const reason = this.generateReason(testInfo);

    Logger.info(`[BrowserStackStatus] Determined status: ${status} | Reason: ${reason}`);
    await this.update(page, status, reason);
  }

  /**
   * Generates a readable reason string based on the test result and error message.
   * @param testInfo - Metadata about the executed test.
   * @returns A descriptive reason string for the test result.
   */
  private static generateReason(testInfo: TestInfo): string {
    if (testInfo.status === 'passed') return 'Test passed';
    if (!testInfo.error?.message) return 'Test failed';

    const msg = testInfo.error.message;
    const reason = this.matchKnownError(msg);
    return reason ?? this.generateFallbackReason(msg);
  }

  /**
   * Matches known error patterns to generate a specific failure reason.
   * @param msg - The error message from the test.
   * @returns A descriptive reason string if a known pattern is matched, otherwise null.
   */
  private static matchKnownError(msg: string): string | null {
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

    const matched = patterns.find(p => msg.match(p.test));
    return matched ? matched.message(msg.match(matched.test)!) : null;
  }

  /**
   * Generates a fallback reason using the first line of the error message and locator info if available.
   * @param msg - The error message from the test.
   * @returns A generic failure reason with optional locator context.
   */
  private static generateFallbackReason(msg: string): string {
    const locatorMatch = msg.match(/Locator:\s*(locator\([^)]+\))/);
    const locator = locatorMatch?.[1];
    const firstLine = msg.split('\n')[0].trim();

    return locator
      ? `Test failed at ${locator}: ${firstLine}`
      : `Test failed: ${firstLine}`;
  }
}