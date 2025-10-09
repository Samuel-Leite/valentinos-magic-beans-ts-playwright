import { Page } from '@playwright/test';
import { getLoginLocators } from '../selectors/LoginSelectors';
import { ElementActions } from '../utils/actions';

/**
 * Represents the login page of the system.
 * Contains actions related to user authentication.
 */
export class LoginPage {
  private actions: ElementActions;
  private locators: ReturnType<typeof getLoginLocators>;

  /**
   * Initializes the Playwright page instance and ElementActions.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {
    this.actions = new ElementActions(page);
    this.locators = getLoginLocators(page);
  }

  /**
   * Performs the login process by filling in the email and password fields,
   * and submitting the login form.
   * @param email User's email address
   * @param password User's password
   */
  async doLogin(email: string, password: string): Promise<void> {
    await this.actions.click(this.locators.btnDoLogin);
    await this.actions.sendKey(this.locators.txtEmail, email);
    await this.actions.sendKey(this.locators.txtPassword, password);
    await this.actions.click(this.locators.btnSubmit);
  }
}