import { Page, expect } from '@playwright/test';
import { getHomeLocators } from '../selectors/HomeSelectors';
import { ElementActions } from '../utils/actions';
import { CustomAsserts } from '../utils/asserts';
import { PercyService } from '../integrations/percy/percyService';

/**
 * Represents the home page of the system after a successful login.
 * Encapsulates actions and validations related to the authenticated user.
 */
export class HomePage {
  private actions: ElementActions;
  private locators: ReturnType<typeof getHomeLocators>;

  /**
   * Initializes the Playwright page instance and supporting utilities.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {
    this.actions = new ElementActions(page);
    this.locators = getHomeLocators(page);
  }

  /**
   * Validates that the login was successful by checking
   * the confirmation message displayed in the toast.
   * Also captures a Percy snapshot of the authenticated home state,
   * since this is the first visual confirmation after login.
   *
   * @param expectedMessage Expected success message in the toast
   */
  async assertLoginSuccess(expectedMessage: string): Promise<void> {
    await CustomAsserts.assertText(this.locators.toastLoginSuccess, expectedMessage);
    await PercyService.capture(this.page, 'Login flow: home after success');
  }

  /**
   * Performs logout for the authenticated user:
   * - Opens the user menu
   * - Clicks the logout button
   * - Captures a Percy snapshot of the post-logout state
   *
   * Snapshot is taken at the end to reflect the final state before redirection.
   */
  async doLogOut(): Promise<void> {
    await this.actions.click(this.locators.btnUserMenu);
    await this.actions.click(this.locators.btnLogOut);
    await PercyService.capture(this.page, 'Logout flow: post logout state');
  }
}