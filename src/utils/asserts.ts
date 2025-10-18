import { expect, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { highlightElement } from '../utils/highlightElement';

/**
 * Provides reusable assertion methods for Playwright locators,
 * with secure logging and visual highlighting.
 */
export class CustomAsserts {
  /**
   * Asserts that the element contains the expected text.
   * @param locator Target element
   * @param expected Expected text value
   */
  static async assertText(locator: Locator, expected: string): Promise<void> {
    try {
      await highlightElement(locator);
      await expect(locator).toHaveText(expected);
      Logger.secure(`[CustomAsserts] Assertion passed: ${locator} contains expected text.`);
    } catch (error: any) {
      Logger.secure(`[CustomAsserts] Assertion failed: ${locator} does not contain expected text: ${error.message}`);
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