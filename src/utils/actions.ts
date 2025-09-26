import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { highlightElement } from '../utils/highlightElement';

export class ElementActions {
  constructor(private page: Page) { }

  async click(locator: Locator): Promise<void> {
    try {
      await highlightElement(locator);
      await locator.click();
      const description = await this.describe(locator);
      Logger.debug(`Element ${description} was successfully clicked.`);
    } catch (error: any) {
      const description = await this.describe(locator);
      Logger.error(`Failed to click element ${description}: ${error.message}`);
      throw error;
    }
  }

  async sendKey(locator: Locator, value: string): Promise<void> {
    try {
      await highlightElement(locator);
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