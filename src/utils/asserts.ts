import { expect, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { highlightElement } from '../utils/highlightElement';

export class CustomAsserts {
  /**
   * Asserts that the element contains the expected text and logs the result.
   * @param locator Playwright Locator
   * @param expected Expected text value
   */
  static async assertText(locator: Locator, expected: string): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toHaveText(expected);
      const description = await this.describe(locator);
      Logger.debug(`Assertion passed: element ${description} contains expected text "${expected}".`);
    } catch (error: any) {
      const description = await this.describe(locator);
      Logger.error(`Assertion failed: expected text "${expected}" not found in element ${description}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts that the element is visible and logs the result.
   * @param locator Playwright Locator
   */
  static async assertVisible(locator: Locator): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toBeVisible();
      const description = await this.describe(locator);
      Logger.debug(`Assertion passed: element ${description} is visible.`);
    } catch (error: any) {
      const description = await this.describe(locator);
      Logger.error(`Assertion failed: element ${description} is not visible: ${error.message}`);
      throw error;
    }
  }

  /**
   * Attempts to describe the locator using its attributes.
   */
  private static async describe(locator: Locator): Promise<string> {
    try {
      const tag = await locator.evaluate(el => el.tagName.toLowerCase());
      const id = await locator.getAttribute('id');
      const name = await locator.getAttribute('name');
      const role = await locator.getAttribute('role');

      if (id) return `"${tag}#${id}"`;
      if (name) return `"${tag}[name='${name}']"`;
      if (role) return `"${tag}[role='${role}']"`;
      return `"${tag}"`;
    } catch {
      return `"unknown element"`;
    }
  }
}