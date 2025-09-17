import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';

test('Validar a efetuação do login com sucesso', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.doLogin('scrooge-mcduck@uorak.com', 'MoneyBin$1886');
  await homePage.assertLoginSuccess('Login Successful');
  await homePage.doLogOut();
});