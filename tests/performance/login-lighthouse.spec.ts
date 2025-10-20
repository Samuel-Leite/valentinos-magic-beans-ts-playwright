import { test } from '../../src/core/remoteRunner';
import { LoginPage } from '../../src/pages/LoginPage';
import { HomePage } from '../../src/pages/HomePage';
import { YamlReader } from '../../src/utils/yamlReader';
import { LighthouseExecutor } from '../../src/integrations/browserstack/lighthouseExecutor';
import '../../src/core/hooks';

test.setTimeout(60000);

test('@PLAN_ID=xxxx @SUITE_ID=xxxx @[xxxx] Validar a efetuação do login com lighthouse', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const credencials = YamlReader.readYamlObject("valid_user");

  await loginPage.doLogin(credencials.email, credencials.password);
  await homePage.assertLoginSuccess('Login Successful');
  await LighthouseExecutor.runAudit(page, page.url());
  await homePage.doLogOut();
});