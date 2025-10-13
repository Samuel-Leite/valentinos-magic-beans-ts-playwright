import axios from 'axios';
import { AzureConfigService } from './AzureConfigService';
import { Attachment } from './models/Attachment';

/**
* Service responsible for publishing test evidence attachments to Azure DevOps.
* This includes screenshots, logs, and other artifacts linked to test results.
*/
export class AzureAttachmentService {
  private readonly apiVersion: string = '5.1-preview';

  /**
   * Publishes all registered attachments to a specific test result within a test run.
   * @param runId The ID of the test run in Azure DevOps.
   * @param resultId The ID of the test result within the run.
   */
  async publishAttachments(runId: string, resultId: number): Promise<void> {
    const config = new AzureConfigService();
    const token = Buffer.from(`:${config.getToken()}`).toString('base64');
    const url = `${config.getBaseUrl()}_apis/test/Runs/${runId}/Results/${resultId}/attachments?api-version=${this.apiVersion}`;

    const attachments = Attachment.getAttachments();

    for (const attachment of attachments) {
      await axios.post(url, attachment, {
        headers: {
          Authorization: `Basic ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }
}