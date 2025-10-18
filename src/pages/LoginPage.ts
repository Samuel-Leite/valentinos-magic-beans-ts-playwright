import { Page } from '@playwright/test';
import { getLoginLocators } from '../selectors/LoginSelectors';
import { ElementActions } from '../utils/actions';
import { PercyService } from '../integrations/percy/percyService';

/**
 * Represents the login page of the system.
 * Encapsulates user authentication actions and visual checkpoints.
 */
export class LoginPage {
  private actions: ElementActions;
  private locators: ReturnType<typeof getLoginLocators>;

  /**
   * Initializes the Playwright page instance and supporting utilities.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {
    this.actions = new ElementActions(page);
    this.locators = getLoginLocators(page);
  }

  /**
   * Executes the complete login flow:
   * - Captures a Percy snapshot of the initial login state
   * - Clicks the login button to open the form
   * - Fills in the email and password fields
   * - Submits the login form
   *
   * Snapshot is captured once at the beginning to avoid duplication across asserts and actions.
   *
   * @param email User's email address
   * @param password User's password
   */
  async doLogin(email: string, password: string): Promise<void> {
    await PercyService.capture(this.page, 'Login flow: initial state');
    await this.actions.click(this.locators.btnDoLogin);
    await this.actions.sendKey(this.locators.txtEmail, email);
    await this.actions.sendKey(this.locators.txtPassword, password);
    await this.actions.click(this.locators.btnSubmit);
  }
}