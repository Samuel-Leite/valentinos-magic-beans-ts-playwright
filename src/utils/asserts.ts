import { expect, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { highlightElement } from '../utils/highlightElement';

/**
 * Provides reusable assertion methods for Playwright locators,
 * with secure logging and visual highlighting.
 */
export class CustomAsserts {
  /**
   * Asserts that a locator contains the expected text.
   * Logs both expected and actual values for better traceability.
   *
   * @param locator - Playwright locator to validate
   * @param expected - Expected text content
   */
  static async assertText(locator: Locator, expected: string): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toHaveText(expected);
      Logger.secure(`[CustomAsserts] Assertion passed: '${expected}' was found in ${locator}`);
    } catch (error: any) {
      const actualText = await locator.textContent();
      Logger.secure(`[CustomAsserts] Assertion failed: Expected '${expected}' but received '${actualText ?? '[element not found]'}'`);
      throw error;
    }
  }

  /**
   * Asserts that the element is visible on the page.
   * @param locator Target element
   */
  static async assertVisible(locator: Locator): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toBeVisible();
      Logger.secure(`[CustomAsserts] Assertion passed: ${locator} is visible.`);
    } catch (error: any) {
      Logger.secure(`[CustomAsserts] Assertion failed: ${locator} is not visible: ${error.message}`);
      throw error;
    }
  }

  /**
   * Asserts that the element is clickable (visible, enabled, and not obstructed).
   * @param locator Target element
   */
  static async assertClickable(locator: Locator): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toBeEnabled();
      await locator.click({ trial: true });
      Logger.secure(`[CustomAsserts] Assertion passed: ${locator} is clickable.`);
    } catch (error: any) {
      Logger.secure(`[CustomAsserts] Assertion failed: ${locator} is not clickable: ${error.message}`);
      throw error;
    }
  }
}