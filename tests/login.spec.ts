import { test } from '../src/core/remoteRunner';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';
import { YamlReader } from '../src/utils/yamlReader';
import '../src/core/hooks';

test('@PLAN_ID=92119 @SUITE_ID=98664 @[61931] Validar a efetuação do login com sucesso', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const credencials = YamlReader.readYamlObject("valid_user");

  await loginPage.doLogin(credencials.email, credencials.password);
  await homePage.assertLoginSuccess('Login Successful');
  await homePage.doLogOut();
});