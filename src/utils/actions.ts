import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { CustomAsserts } from '../utils/asserts';

/**
 * Encapsulates high-level interactions with page elements,
 * ensuring safe execution through built-in assertions and secure logging.
 */
export class ElementActions {
  constructor(private page: Page) {}

  /**
   * Safely clicks on the specified element.
   * Verifies that the element is clickable before performing the action.
   * Logs the interaction without exposing sensitive data.
   * 
   * @param locator - Locator pointing to the target element
   */
  async click(locator: Locator): Promise<void> {
    try {
      await CustomAsserts.assertClickable(locator);
      await locator.click();
      Logger.secure(`[ElementActions] Click action performed on ${locator}`);
    } catch (error: any) {
      Logger.secure(`[ElementActions] Click action failed on ${locator}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Safely fills a text field with the provided value.
   * Verifies that the field is visible before interacting.
   * Clears the field before typing and logs the action securely.
   * 
   * @param locator - Locator pointing to the input field
   * @param value - Text value to be entered (not logged)
   */
  async sendKey(locator: Locator, value: string): Promise<void> {
    try {
      await CustomAsserts.assertVisible(locator);
      await locator.fill('');
      await locator.type(value);
      Logger.secure(`[ElementActions] Text input completed on ${locator}`);
    } catch (error: any) {
      Logger.secure(`[ElementActions] Text input failed on ${locator}: ${error.message}`);
      throw error;
    }
  }
}