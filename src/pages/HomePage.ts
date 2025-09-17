import { Page, expect } from '@playwright/test';
import { HomeSelectors } from '../locators/HomeSelectors';

export class HomePage {
    constructor(private page: Page) { }

    async assertLoginSuccess(expectedMessage: string): Promise<void> {
        await expect(this.page.locator(HomeSelectors.toastLoginSuccess)).toHaveText(expectedMessage);
    }

    async doLogOut(): Promise<void> {
        await this.page.locator(HomeSelectors.btnUserMenu).click();
        await this.page.locator(HomeSelectors.btnLogOut).click();
    }
}