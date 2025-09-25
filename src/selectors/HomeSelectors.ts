import { Page } from '@playwright/test';

export const getHomeLocators = (page: Page) => ({
  toastLoginSuccess: page.locator('li[role="status"] .font-semibold'),
  btnUserMenu: page.locator('button:has(svg.lucide-user)'),
  btnLogOut: page.locator('text=Log out'),
});