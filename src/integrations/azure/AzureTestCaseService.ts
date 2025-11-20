import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { AzureConfigService } from './AzureConfigService';
import { AzureAuthService } from './AzureAuthService';
import { TestCaseActive } from './models/TestCaseActive';
import { ResultTestCase } from './models/ResultTestCase';
import { Results } from './models/Results';
import { Attachment } from './models/Attachment';
import { AzureAttachmentService } from './AzureAttachmentService';
import { Logger } from '../../utils/logger';

type TestPointResponse = {
  value: { id: number }[];
};

type TestRunResponse = {
  id: number;
  webAccessUrl?: string;
};

type TestResultListResponse = {
  count: number;
  value: { id: number }[];
};

export class AzureTestCaseService {
  private readonly config: AzureConfigService;
  private readonly auth: AzureAuthService;
  private readonly attachmentService: AzureAttachmentService;

  constructor() {
    this.config = new AzureConfigService();
    this.auth = new AzureAuthService();
    this.attachmentService = new AzureAttachmentService();
  }

  // Ativa o caso de teste (planned) no suite/plan
  async startTestCase(planId: string, suiteId: string, testCaseId: string): Promise<void> {
    const token = this.auth.generateToken();
    const testPointId = await this.getTestPointId(planId, suiteId, testCaseId, token);

    const url = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview`;
    const body = [new TestCaseActive(testPointId, true)];
    try {
      const response = await axios.patch(url, body, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json'
        }
      });
      await this.updateAutomationStatus(testCaseId, token);
    } catch (err: any) {
      Logger.error(`[AzureTestCaseService] Falha ao ativar o test case no Azure DevOps, retornou o Status: ${err.response?.status} com StatusText: ${err.response?.statusText}`);
    }
  }

  // Finaliza o caso de teste, cria run/result e publica anexos
  async finishTestCase(
    planId: string,
    suiteId: string,
    testCaseId: string,
    status: string,
    error?: string
  ): Promise<void> {
    const token = this.auth.generateToken();

    // 1) Atualiza status no TestPoint
    const testPointId = await this.getTestPointId(planId, suiteId, testCaseId, token);
    const tpUrl = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview`;
    const tpBody = [new ResultTestCase(testPointId, new Results(this.getStatusCode(status)))];
    try {
      await axios.patch(tpUrl, tpBody, {
        headers: { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      Logger.error(`[AzureTestCaseService] Falha ao atualizar status do TestPoint com a seguinte mensagem: ` + (err?.response?.data || err));
    }

    try {
      // 2) Cria Test Run
      const runIdApi = await this.createTestRun(planId, token);

      // 3) Cria resultado de teste
      const resultIdReal = await this.createTestResult(runIdApi, testCaseId, testPointId, status, token);

      // 4) Evidências da pasta playwright-report/data
      const evidenceDir = path.resolve(process.cwd(), 'playwright-report', 'data');

      if (fs.existsSync(evidenceDir)) {
        const files = fs.readdirSync(evidenceDir);
        for (const file of files) {
          const filePath = path.join(evidenceDir, file);
          if (fs.statSync(filePath).isDirectory()) continue;

          // lê o arquivo binário
          const fileBuffer = fs.readFileSync(filePath);
          // converte para Base64
          const base64Content = fileBuffer.toString('base64');
          // garante que o nome preserve a extensão original
          const fileName = path.basename(file); // ex: Evidence_20251120.png

          // envia sempre como GeneralAttachment
          Attachment.setAttachment(
            new Attachment('GeneralAttachment', base64Content, fileName)
          );

          Logger.info(`[AzureTestCaseService] Evidência anexada: ${fileName}`);
        }
      } else {
        Logger.warn(`[AzureTestCaseService] Screenshot(s) não localizado`);
      }
	  
	  // 5) Adiciona o log winston.log da raiz do projeto
      const logPath = path.resolve(process.cwd(), 'winston.log');
      if (fs.existsSync(logPath)) {
        const logContent = fs.readFileSync(logPath, 'utf-8'); // lê como texto puro
        Attachment.setAttachment(new Attachment('log', logContent, 'winston.log'));
        Logger.info(`[AzureTestCaseService] Arquivo winston.log localizado com sucesso`);
      } else {
        Logger.warn(`[AzureTestCaseService] Arquivo winston.log não localizado na raiz do projeto`);
      }

      // 6) Publica anexos
      await this.attachmentService.publishAttachments(runIdApi.toString(), resultIdReal);

    } catch (err: any) {
      Logger.error(`[AzureTestCaseService] Falha ao enviar o resultado e/ou anexos com a mensagem: ` + (err?.response?.data || err));
    }
  }

  // Busca o TestPointId para o caso de teste dentro do suite/plan
  private async getTestPointId(
    planId: string,
    suiteId: string,
    testCaseId: string,
    token: string
  ): Promise<number> {
    const url = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview&testCaseId=${testCaseId}`;
    try {
      const response = await axios.get<TestPointResponse>(url, {
        headers: { Authorization: `Basic ${token}` }
      });

      const tpId = response.data.value?.[0]?.id;
      if (!tpId && tpId !== 0) throw new Error('TestPointId não localizado para o caso/suite/plan informados.');
      return tpId;
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Falha ao obter TestPointId retornando o Status: ${err.response?.status} com o StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Erro inesperado (sem response): ${err?.message} e ` + (err?.stack));
      }
      throw err;
    }
  }

  // Cria o Test Run
  private async createTestRun(planId: string, token: string): Promise<number> {
    const url = `${this.config.getBaseUrl()}_apis/test/runs?api-version=5.1-preview`;
    const body = {
      name: `Automated Run - ${new Date().toISOString()}`,
      plan: { id: planId },
      isAutomated: true
    };

    try {
      const response = await axios.post<TestRunResponse>(url, body, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.id;
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Falha ao criar Test Run retornando o Status: ${err.response?.status} com o StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Erro inesperado (sem response): ${err?.message} e ` + (err?.stack));
      }
      throw err;
    }
  }

  // Cria o resultado de teste (planned) com campos obrigatórios
  private async createTestResult(
    runId: number,
    testCaseId: string,
    testPointId: number,
    status: string,
    token: string
  ): Promise<number> {
    const url = `${this.config.getBaseUrl()}_apis/test/Runs/${runId}/results?api-version=5.1-preview`;

    // OBS: testCaseRevision e testCaseTitle devem refletir o WI atual do Test Case.
    // Você pode buscar esses dados via API de Work Items (WIT). Aqui usamos placeholders.
    const body = [
      {
        testCase: { id: testCaseId },
        testPoint: { id: testPointId },
        testCaseRevision: 1, // ajuste conforme o WI revision atual
        testCaseTitle: `Caso ${testCaseId}`, // ajuste conforme o título real do WI
        outcome: status,
        state: 'Completed',
        automatedTestName: `Playwright-${testCaseId}`
      }
    ];

    try {
      const response = await axios.post<TestResultListResponse>(url, body, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // CORREÇÃO: ler de response.data.value[0].id (não response.data[0].id)
      const id = response.data?.value?.[0]?.id;
      if (typeof id !== 'number') {
        throw new Error(`ResultId inválido ou ausente. Response: ${JSON.stringify(response.data)}`);
      }
      return id;
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Falha ao criar resultado com o Status: ${err.response?.status} e StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Erro inesperado (sem response): ${err?.message} e ` + (err?.stack));
      }
      throw err;
    }
  }

  // Atualiza o status de automação no Work Item do Test Case
  private async updateAutomationStatus(testCaseId: string, token: string): Promise<void> {
    const url = `${this.config.getBaseUrl()}_apis/wit/workitems/${testCaseId}?api-version=7.1-preview.3`;

    const patchBody = [
      {
        op: 'add',
        path: '/fields/Microsoft.VSTS.TCM.AutomationStatus',
        value: 'Automated'
      }
    ];

    try {
      const response = await axios.patch(url, patchBody, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json-patch+json'
        }
      });

      // log de sucesso
      Logger.info(`[AzureTestCaseService] AutomationStatus atualizado com sucesso para o TestCase ${testCaseId}`);
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Falha ao atualizar AutomationStatus, Status: ${err.response?.status}, StatusText: ${err.response?.statusText} e response: ${JSON.stringify(err.response?.data, null, 2)}`);
      } else {
        Logger.error(`[AzureTestCaseService] Erro inesperado (sem response): ${err?.message} e ` + (err?.stack));
      }
    }
  }

  // Mapeia status text -> código do TestPoint planned
  private getStatusCode(status: string): number {
    const statusMap: Record<string, number> = {
      passed: 2,       // Passed
      failed: 3,       // Failed
      skipped: 4,      // NotApplicable/None (ajuste conforme seu contrato)
      timedOut: 4,
      interrupted: 1,  // Active
    };
    return statusMap[status] ?? 0;
  }
}