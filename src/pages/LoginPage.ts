import { Page } from '@playwright/test';
import { LoginSelectors } from '../locators/LoginSelectors';

export class LoginPage {
    constructor(private page: Page) { }

    async navigate() {
        await this.page.goto('/');
    }

    async doLogin(email: string, password: string): Promise<void> {
        await this.navigate();
        await this.page.locator(LoginSelectors.btnDoLogin).click();
        await this.page.locator(LoginSelectors.txtEmail).fill(email);
        await this.page.locator(LoginSelectors.txtPassword).fill(password);
        await this.page.locator(LoginSelectors.btnSubmit).click();
    }
}