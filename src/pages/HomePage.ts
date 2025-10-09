import { Page, expect } from '@playwright/test';
import { getHomeLocators } from '../selectors/HomeSelectors';
import { ElementActions } from '../utils/actions';
import { CustomAsserts } from '../utils/asserts';

/**
 * Represents the home page of the system after a successful login.
 * Contains actions and validations related to the authenticated user.
 */
export class HomePage {
  private actions: ElementActions;
  private locators: ReturnType<typeof getHomeLocators>;

  /**
   * Initializes the Playwright page instance and ElementActions.
   * @param page Current Playwright page instance
   */
  constructor(private page: Page) {
    this.actions = new ElementActions(page);
    this.locators = getHomeLocators(page);
  }

  /**
   * Validates that the login was successful by checking
   * the confirmation message displayed in the toast.
   * @param expectedMessage Expected success message in the toast
   */
  async assertLoginSuccess(expectedMessage: string): Promise<void> {
    await CustomAsserts.assertText(this.locators.toastLoginSuccess, expectedMessage);
  }

  /**
   * Performs logout for the authenticated user by accessing
   * the user menu and clicking the logout button.
   */
  async doLogOut(): Promise<void> {
    await this.actions.click(this.locators.btnUserMenu);
    await this.actions.click(this.locators.btnLogOut);
  }
}