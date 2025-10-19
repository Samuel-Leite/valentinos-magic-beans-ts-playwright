import { Page } from '@playwright/test';
import { Logger } from '../../utils/logger';

/**
 * LighthouseExecutor triggers a Lighthouse audit inside a BrowserStack Automate session.
 * It uses the browserstack_executor protocol to run audits without launching a separate browser.
 */
export class LighthouseExecutor {
  /**
   * Runs a basic Lighthouse audit on the current page.
   * Optionally accepts a URL to audit; otherwise uses the current page context.
   * @param page Playwright page instance
   * @param url Optional URL to audit
   */
  static async runAudit(page: Page, url?: string): Promise<void> {
    const targetUrl = url || page.url();
    Logger.info(`[LighthouseExecutor] Starting basic Lighthouse audit for: ${targetUrl}`);

    const payload = {
      action: 'lighthouseAudit',
      ...(url && { arguments: { url } }),
    };

    try {
      await page.evaluate(
        () => {},
        `browserstack_executor: ${JSON.stringify(payload)}`
      );
      Logger.info(`[LighthouseExecutor] Lighthouse audit completed successfully.`);
    } catch (error) {
      Logger.error(`[LighthouseExecutor] Lighthouse audit failed: ${error}`);
      throw error;
    }
  }

  /**
   * Runs a Lighthouse audit with custom performance assertions.
   * Fails the test if thresholds are not met.
   * @param page Playwright page instance
   * @param url URL to audit
   */
  static async runAuditWithAssertions(page: Page, url: string): Promise<void> {
    Logger.info(`[LighthouseExecutor] Starting Lighthouse audit with assertions for: ${url}`);

    const payload = {
      action: 'lighthouseAudit',
      arguments: {
        url,
        assertResult: {
          categories: {
            performance: 40,
            'best-practices': 50,
          },
          metrics: {
            'first-contentful-paint': {
              moreThan: 50,
              metricUnit: 'score',
            },
            'largest-contentful-paint': {
              lessThan: 4000,
              metricUnit: 'numeric',
            },
            'total-blocking-time': {
              lessThan: 600,
              metricUnit: 'numeric',
            },
            'cumulative-layout-shift': {
              moreThan: 50,
              metricUnit: 'score',
            },
          },
        },
      },
    };

    try {
      await page.evaluate(
        () => {},
        `browserstack_executor: ${JSON.stringify(payload)}`
      );
      Logger.info(`[LighthouseExecutor] Lighthouse audit with assertions completed successfully.`);
    } catch (error) {
      Logger.error(`[LighthouseExecutor] Lighthouse audit with assertions failed: ${error}`);
      throw error;
    }
  }
}