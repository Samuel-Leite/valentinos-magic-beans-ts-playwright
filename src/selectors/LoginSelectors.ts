import { Page } from '@playwright/test';

export const getLoginLocators = (page: Page) => ({
  btnDoLogin: page.locator('[data-test-id="header-login-button-desktop"]'),
  txtEmail: page.locator('[data-test-id="login-email-input"]'),
  txtPassword: page.locator('[data-test-id="login-password-input"]'),
  btnSubmit: page.locator('[data-test-id="login-submit-button"]'),
});