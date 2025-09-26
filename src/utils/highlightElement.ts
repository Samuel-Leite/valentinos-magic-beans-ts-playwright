import { Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Applies a visual highlight to the entire element area.
 * Useful for debugging, evidence, and visibility during test execution.
 * @param locator Playwright Locator
 * @param color Optional RGBA color (default: orange)
 */
export async function highlightElement(locator: Locator, color: string = 'rgba(225, 255, 0, 1)'): Promise<void> {
  try {
    await locator.evaluate((el, highlightColor) => {
      el.style.boxShadow = `inset 0 0 0 1000px ${highlightColor}`;
      el.style.transition = 'box-shadow 0.3s ease-in-out';
      setTimeout(() => {
        el.style.boxShadow = '';
      }, 1000);
    }, color);
  } catch {
    Logger.error('Highlight failed: element could not be styled.');
  }
}
