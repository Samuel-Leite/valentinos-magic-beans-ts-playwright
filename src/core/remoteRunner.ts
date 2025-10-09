// remoteRunner.ts

import { test as base, BrowserContext, Page, TestInfo } from '@playwright/test';
import { chromium } from 'playwright';
import { EndpointBuilder } from '../integrations/browserstack/endpointBuilder';

// Determines whether tests should run remotely via BrowserStack or locally
const isRemote = process.env.RUN_REMOTE === 'true';

/**
 * RemoteRunner handles browser context creation and lifecycle management
 * for both local and remote (BrowserStack) test execution.
 */
class RemoteRunner {
  /**
   * Creates a remote browser context by connecting to BrowserStack using a WebSocket endpoint.
   * @param testInfo - Metadata about the current test
   */
  private async createRemoteContext(testInfo: TestInfo): Promise<BrowserContext> {
    const builder = new EndpointBuilder();
    const wsEndpoint = builder.build(process.env.DEVICE || 'desktop', testInfo.title);
    const browser = await chromium.connect({ wsEndpoint });
    const context = await browser.newContext();
    // Store browser instance for cleanup
    (context as any)._browser = browser;
    return context;
  }

  /**
   * Creates a local browser context using a locally launched Chromium instance.
   */
  private async createLocalContext(): Promise<BrowserContext> {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    // Store browser instance for cleanup
    (context as any)._browser = browser;
    return context;
  }

  /**
   * Chooses between remote or local context creation based on the RUN_REMOTE flag.
   * @param testInfo - Metadata about the current test
   */
  public async createContext(testInfo: TestInfo): Promise<BrowserContext> {
    return isRemote
      ? await this.createRemoteContext(testInfo)
      : await this.createLocalContext();
  }

  /**
   * Creates a new page within the given browser context.
   * @param context - The browser context to use
   */
  public async createPage(context: BrowserContext): Promise<Page> {
    return await context.newPage();
  }

  /**
   * Closes the browser context and its associated browser instance.
   * @param context - The browser context to close
   */
  public async closeContext(context: BrowserContext): Promise<void> {
    const browser = (context as any)._browser;
    await context.close();
    if (browser) await browser.close();
  }

  /**
   * Extends the Playwright test object with custom context and page setup.
   * Automatically adapts to local or remote execution.
   */
  public extend() {
    return base.extend<{
      context: BrowserContext;
      page: Page;
    }>({
      context: async ({}, use, testInfo) => {
        const context = await this.createContext(testInfo);
        await use(context);
        await this.closeContext(context);
      },

      page: async ({ context }, use) => {
        const page = await this.createPage(context);
        await use(page);
        await page.close();
      },
    });
  }
}

// Instantiates the runner and exports the adapted test object
const runner = new RemoteRunner();
export const test = runner.extend();