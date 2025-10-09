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
      Logger.secure(`Click action performed on ${locator}`);
    } catch (error: any) {
      Logger.secure(`Click action failed on ${locator}: ${error.message}`);
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
      Logger.secure(`Text input completed on ${locator}`);
    } catch (error: any) {
      Logger.secure(`Text input failed on ${locator}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generates a descriptive label for the target element,
   * using tag name and relevant attributes for traceable logging.
   * 
   * @param locator - Locator pointing to the element
   * @returns A formatted string describing the element
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