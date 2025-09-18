import { Page, expect } from '@playwright/test';
import { HomeSelectors } from '../selectors/HomeSelectors';

/**
 * Represents the home page of the system after a successful login.
 * Contains actions and validations related to the authenticated user.
 */
export class HomePage {
  /**
   * Initializes the Playwright page instance.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {}

  /**
   * Validates that the login was successful by checking
   * the confirmation message displayed in the toast.
   * @param expectedMessage Expected success message in the toast
   */
  async assertLoginSuccess(expectedMessage: string): Promise<void> {
    await expect(this.page.locator(HomeSelectors.toastLoginSuccess)).toHaveText(expectedMessage);
  }

  /**
   * Performs logout for the authenticated user by accessing
   * the user menu and clicking the logout button.
   */
  async doLogOut(): Promise<void> {
    await this.page.locator(HomeSelectors.btnUserMenu).click();
    await this.page.locator(HomeSelectors.btnLogOut).click();
  }
}