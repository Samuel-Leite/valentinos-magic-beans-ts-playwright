import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export class ElementActions {
  constructor(private page: Page) {}

  /**
   * Clicks on a given locator and logs the action using its selector or attributes.
   * @param locator Playwright Locator
   */
  async click(locator: Locator): Promise<void> {
    try {
      await locator.click();
      const description = await this.describe(locator);
      Logger.debug(`Element ${description} was successfully clicked.`);
    } catch (error: any) {
      const description = await this.describe(locator);
      Logger.error(`Failed to click element ${description}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sends keys to a given locator and logs the action using its selector or attributes.
   * @param locator Playwright Locator
   * @param value Text to type
   */
  async sendKey(locator: Locator, value: string): Promise<void> {
    try {
      await locator.fill('');
      await locator.type(value);
      const description = await this.describe(locator);
      Logger.debug(`Field ${description} was successfully filled with value "${value}".`);
    } catch (error: any) {
      const description = await this.describe(locator);
      Logger.error(`Failed to fill field ${description} with value "${value}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Attempts to describe the locator using its attributes.
   */
  private async describe(locator: Locator): Promise<string> {
    try {
      const tag = await locator.evaluate(el => el.tagName.toLowerCase());
      const id = await locator.getAttribute('id');
      const name = await locator.getAttribute('name');
      const placeholder = await locator.getAttribute('placeholder');
      const role = await locator.getAttribute('role');

      if (id) return `"${tag}#${id}"`;
      if (name) return `"${tag}[name='${name}']"`;
      if (placeholder) return `"${tag}[placeholder='${placeholder}']"`;
      if (role) return `"${tag}[role='${role}']"`;
      return `"${tag}"`;
    } catch {
      return `"unknown element"`;
    }
  }
}