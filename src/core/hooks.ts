import { test } from '@playwright/test';
import { YamlReader } from '../utils/yamlReader';
import { Logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

class Hooks {
  allureResultsDir: string;

  constructor() {
    this.allureResultsDir = path.join(__dirname, '..', '..', 'allure-results');
  }

  async cleanReports(): Promise<void> {
    const reportDirs = [
      path.join(__dirname, '..', '..', 'allure-results'),
      path.join(__dirname, '..', '..', 'playwright-report'),
      path.join(__dirname, '..', '..', 'test-results'),
    ];

    for (const dir of reportDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        Logger.info(`DIRETÓRIO: '${path.basename(dir)}' foi apagado com sucesso`);
      } catch (err: any) {
        Logger.error(`DIRETÓRIO: erro ao apagar '${path.basename(dir)}': ${err.message}`);
      }
    }

    Logger.info('-----------------------------------------------------------------------');
  }

  async beforeAllTests(): Promise<void> {
    Logger.info('----------------------Variáveis de ambiente---------------------------');
    Logger.info(`ENV: ${process.env.ENV}`);
    await this.cleanReports();
    Logger.clearLogFile();
  }

  async beforeEachTest(page: any): Promise<void> {
    Logger.info('--------------------------------Start---------------------------------');
    const baseUrl = YamlReader.readUrl(process.env.ENV || 'qa');
    Logger.info(`URL carregada: ${baseUrl}`);
    await page.goto(baseUrl);
  }

  async afterEachTest(page: any): Promise<void> {
    Logger.info('--------------------------------End----------------------------------');
    await page.close();
  }
}

const hooks = new Hooks();

test.beforeAll(async () => {
  await hooks.beforeAllTests();
});

test.beforeEach(async ({ page }) => {
  await hooks.beforeEachTest(page);
});

test.afterEach(async ({ page }) => {
  await hooks.afterEachTest(page);
});

export default Hooks;
