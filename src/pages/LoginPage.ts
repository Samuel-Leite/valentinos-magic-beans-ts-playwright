import { Page } from '@playwright/test';
import { LoginSelectors } from '../selectors/LoginSelectors';

/**
 * Represents the login page of the system.
 * Contains actions related to user authentication.
 */
export class LoginPage {
  /**
   * Initializes the Playwright page instance.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {}

  /**
   * Performs the login process by filling in the email and password fields,
   * and submitting the login form.
   * @param email User's email address
   * @param password User's password
   */
  async doLogin(email: string, password: string): Promise<void> {
    await this.page.locator(LoginSelectors.btnDoLogin).click();
    await this.page.locator(LoginSelectors.txtEmail).fill(email);
    await this.page.locator(LoginSelectors.txtPassword).fill(password);
    await this.page.locator(LoginSelectors.btnSubmit).click();
  }
}