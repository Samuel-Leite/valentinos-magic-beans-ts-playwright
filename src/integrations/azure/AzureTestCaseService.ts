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

  /**
   * Activates a test case (planned) within a suite/plan in Azure DevOps.
   *
   * @param planId - Azure DevOps test plan ID
   * @param suiteId - Azure DevOps test suite ID
   * @param testCaseId - Azure DevOps test case ID
   */
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
      Logger.error(`[AzureTestCaseService] Failed to activate test case in Azure DevOps. Status: ${err.response?.status}, StatusText: ${err.response?.statusText}`);
    }
  }

  /**
   * Finalizes a test case by updating its status, creating a test run and result,
   * and uploading evidence attachments to Azure DevOps.
   *
   * @param planId - Azure DevOps test plan ID
   * @param suiteId - Azure DevOps test suite ID
   * @param testCaseId - Azure DevOps test case ID
   * @param status - Final test status (e.g., passed, failed)
   * @param error - Optional error message
   */
  async finishTestCase(
    planId: string,
    suiteId: string,
    testCaseId: string,
    status: string,
    error?: string
  ): Promise<void> {
    const token = this.auth.generateToken();

    // 1) Update TestPoint status
    const testPointId = await this.getTestPointId(planId, suiteId, testCaseId, token);
    const tpUrl = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview`;
    const tpBody = [new ResultTestCase(testPointId, new Results(this.getStatusCode(status)))];

    try {
      await axios.patch(tpUrl, tpBody, {
        headers: { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      Logger.error(`[AzureTestCaseService] Failed to update TestPoint status: ` + (err?.response?.data || err));
    }

    try {
      // 2) Create Test Run
      const runIdApi = await this.createTestRun(planId, token);

      // 3) Create Test Result
      const resultIdReal = await this.createTestResult(runIdApi, testCaseId, testPointId, status, token);

      // 4) Attach evidence from playwright-report/data folder
      const evidenceDir = path.resolve(process.cwd(), 'playwright-report', 'data');

      if (fs.existsSync(evidenceDir)) {
        const files = fs.readdirSync(evidenceDir);
        for (const file of files) {
          const filePath = path.join(evidenceDir, file);
          if (fs.statSync(filePath).isDirectory()) continue;

          // Read binary file
          const fileBuffer = fs.readFileSync(filePath);
          // Convert to Base64
          const base64Content = fileBuffer.toString('base64');
          // Preserve original file name and extension
          const fileName = path.basename(file);

          // Always send as GeneralAttachment
          Attachment.setAttachment(
            new Attachment('GeneralAttachment', base64Content, fileName)
          );

          Logger.info(`[AzureTestCaseService] Evidence attached: ${fileName}`);
        }
      } else {
        Logger.warn(`[AzureTestCaseService] No screenshot(s) found`);
      }

      // 5) Attach winston.log from the project root
      const logPath = path.resolve(process.cwd(), 'winston.log');
      if (fs.existsSync(logPath)) {
        const logContent = fs.readFileSync(logPath, 'utf-8'); // read as plain text
        Attachment.setAttachment(new Attachment('log', logContent, 'winston.log'));
        Logger.info(`[AzureTestCaseService] winston.log file successfully located`);
      } else {
        Logger.warn(`[AzureTestCaseService] winston.log file not found in the project root`);
      }

      // 6) Publish attachments to Azure DevOps
      await this.attachmentService.publishAttachments(runIdApi.toString(), resultIdReal);

    } catch (err: any) {
      Logger.error(`[AzureTestCaseService] Failed to send the result and/or attachments. Message: ` + (err?.response?.data || err));
    }
  }

  /**
   * Retrieves the TestPointId for a specific test case within a given suite and plan in Azure DevOps.
   * This ID is required to update the test case status or associate it with a test run.
   *
   * @param planId - The ID of the test plan
   * @param suiteId - The ID of the test suite
   * @param testCaseId - The ID of the test case
   * @param token - The authorization token for Azure DevOps API
   * @returns The TestPointId as a number
   */
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
      if (!tpId && tpId !== 0) {
        throw new Error('TestPointId not found for the specified case/suite/plan.');
      }
      return tpId;
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Failed to retrieve TestPointId. Status: ${err.response?.status}, StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Unexpected error (no response): ${err?.message}, ${err?.stack}`);
      }
      throw err;
    }
  }

  /**
   * Creates a new Test Run in Azure DevOps for the specified test plan.
   * This run will be used to associate test results and attachments.
   *
   * @param planId - The ID of the test plan in Azure DevOps
   * @param token - The authorization token for the API
   * @returns The ID of the newly created Test Run
   */
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
        Logger.error(`[AzureTestCaseService] Failed to create Test Run. Status: ${err.response?.status}, StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Unexpected error (no response): ${err?.message}, ${err?.stack}`);
      }
      throw err;
    }
  }

  /**
 * Creates a test result (planned) with required fields and associates it with a Test Run.
 * Note: testCaseRevision and testCaseTitle should reflect the current state of the Work Item.
 * You can retrieve these values via the Work Items API (WIT). Placeholders are used here.
 *
 * @param runId - The ID of the Test Run
 * @param testCaseId - The ID of the Test Case
 * @param testPointId - The ID of the Test Point
 * @param status - The outcome status (e.g., passed, failed)
 * @param token - The Azure DevOps authorization token
 * @returns The ID of the created test result
 */
  private async createTestResult(
    runId: number,
    testCaseId: string,
    testPointId: number,
    status: string,
    token: string
  ): Promise<number> {
    const url = `${this.config.getBaseUrl()}_apis/test/Runs/${runId}/results?api-version=5.1-preview`;

    const body = [
      {
        testCase: { id: testCaseId },
        testPoint: { id: testPointId },
        testCaseRevision: 1, // adjust according to the current WI revision
        testCaseTitle: `Case ${testCaseId}`, // adjust according to the actual WI title
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

      const id = response.data?.value?.[0]?.id;
      if (typeof id !== 'number') {
        throw new Error(`Invalid or missing ResultId. Response: ${JSON.stringify(response.data)}`);
      }
      return id;
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Failed to create test result. Status: ${err.response?.status}, StatusText: ${err.response?.statusText}`);
      } else {
        Logger.error(`[AzureTestCaseService] Unexpected error (no response): ${err?.message}, ${err?.stack}`);
      }
      throw err;
    }
  }

  /**
   * Updates the automation status of the Test Case Work Item to "Automated".
   *
   * @param testCaseId - The ID of the Test Case Work Item
   * @param token - The Azure DevOps authorization token
   */
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

      Logger.info(`[AzureTestCaseService] AutomationStatus successfully updated for TestCase ${testCaseId}`);
    } catch (err: any) {
      if (err.response) {
        Logger.error(`[AzureTestCaseService] Failed to update AutomationStatus. Status: ${err.response?.status}, StatusText: ${err.response?.statusText}, Response: ${JSON.stringify(err.response?.data, null, 2)}`);
      } else {
        Logger.error(`[AzureTestCaseService] Unexpected error (no response): ${err?.message}, ${err?.stack}`);
      }
    }
  }

  /**
   * Maps a test outcome string to the corresponding Azure DevOps TestPoint status code.
   *
   * @param status - The outcome status (e.g., passed, failed)
   * @returns The numeric status code
   */
  private getStatusCode(status: string): number {
    const statusMap: Record<string, number> = {
      passed: 2,       // Passed
      failed: 3,       // Failed
      skipped: 4,      // NotApplicable/None
      timedOut: 4,
      interrupted: 1   // Active
    };
    return statusMap[status] ?? 0;
  }
}