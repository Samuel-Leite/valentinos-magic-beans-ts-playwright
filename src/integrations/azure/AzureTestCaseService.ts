import axios from 'axios';
import { AzureConfigService } from './AzureConfigService';
import { AzureAuthService } from './AzureAuthService';
import { TestCaseActive } from './models/TestCaseActive';
import { ResultTestCase } from './models/ResultTestCase';
import { Results } from './models/Results';
import { Attachment } from './models/Attachment';
import { AzureAttachmentService } from './AzureAttachmentService';

type TestPointResponse = {
  value: { id: number }[];
};

/**
* Service responsible for managing test case execution lifecycle in Azure DevOps.
* Includes activation, result publishing, and automation status updates.
*/
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
   * Activates a test case in Azure DevOps before execution.
   * @param planId Test plan ID
   * @param suiteId Test suite ID
   * @param testCaseId Test case ID
   */
  async startTestCase(planId: string, suiteId: string, testCaseId: string): Promise<void> {
    const token = this.auth.generateToken();
    const testPointId = await this.getTestPointId(planId, suiteId, testCaseId, token);

    const url = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview`;
    const body = [new TestCaseActive(testPointId, true)];

    await axios.patch(url, body, {
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await this.updateAutomationStatus(testCaseId, token);
  }

  /**
   * Publishes the result of a test case execution to Azure DevOps.
   * @param planId Test plan ID
   * @param suiteId Test suite ID
   * @param testCaseId Test case ID
   * @param status Execution status (e.g., 'passed', 'failed')
   * @param error Optional error message if the test failed
   */
  async finishTestCase(planId: string, suiteId: string, testCaseId: string, status: string, error?: string): Promise<void> {
    const token = this.auth.generateToken();
    const testPointId = await this.getTestPointId(planId, suiteId, testCaseId, token);

    const url = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview`;
    const body = [new ResultTestCase(testPointId, new Results(this.getStatusCode(status)))];

    await axios.patch(url, body, {
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (status !== 'passed' && error) {
      Attachment.setAttachment(new Attachment('txt', error, 'Exception'));
      await this.attachmentService.publishAttachments('123456', testPointId); // Replace with actual runId if available
    }
  }

  /**
   * Retrieves the test point ID associated with a test case in a given plan and suite.
   * @param planId Test plan ID
   * @param suiteId Test suite ID
   * @param testCaseId Test case ID
   * @param token Encoded Azure DevOps token
   * @returns Test point ID
   */
  private async getTestPointId(planId: string, suiteId: string, testCaseId: string, token: string): Promise<number> {
    const url = `${this.config.getBaseUrl()}_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestPoint?api-version=5.1-Preview&testCaseId=${testCaseId}`;
    const response = await axios.get<TestPointResponse>(url, {
      headers: { Authorization: `Basic ${token}` }
    });
    return response.data.value[0].id;
  }

  /**
   * Updates the automation status of a test case to "Automated" in Azure DevOps.
   * @param testCaseId Test case ID
   * @param token Encoded Azure DevOps token
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

    await axios.patch(url, patchBody, {
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  /**
   * Maps Playwright test status to Azure DevOps result codes.
   * @param status Playwright test status
   * @returns Azure DevOps result code
   */
  private getStatusCode(status: string): number {
    const statusMap: Record<string, number> = {
      passed: 2,
      failed: 3,
      skipped: 4,
      timedOut: 4,
      interrupted: 1,
    };
    return statusMap[status] ?? 0;
  }
}

// ✅ Exported utility functions for use in hooks
const azureTestCaseService = new AzureTestCaseService();

/**
* Wrapper to activate a test case before execution.
*/
export async function runTestCaseStart(planId: string, suiteId: string, testCaseId: string): Promise<void> {
  await azureTestCaseService.startTestCase(planId, suiteId, testCaseId);
}

/**
* Wrapper to publish the result of a test case after execution.
*/
export async function runTestCaseFinished(
  planId: string,
  suiteId: string,
  testCaseId: string,
  status: string,
  error?: string
): Promise<void> {
  await azureTestCaseService.finishTestCase(planId, suiteId, testCaseId, status, error);
}