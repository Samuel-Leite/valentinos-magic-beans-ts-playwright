import axios from 'axios';
import { AzureConfigService } from './AzureConfigService';
import { Attachment } from './models/Attachment';
import { Logger } from '../../utils/logger';

/**
 * Service responsible for publishing attachments (evidence) to Azure DevOps test results.
 * Includes detailed logging to show expected API format, payload sent, and UI access URL.
 */
export class AzureAttachmentService {
  private readonly apiVersion: string = '5.1-preview';

  /**
   * Publishes all registered attachments to a specific test result within a Test Run in Azure DevOps.
   *
   * @param runId - The ID of the Test Run in Azure DevOps
   * @param resultId - The ID of the individual test result within the run
   */
  async publishAttachments(runId: string, resultId: number): Promise<void> {
    const config = new AzureConfigService();
    const token = Buffer.from(`:${config.getToken()}`).toString('base64');
    const url = `${config.getBaseUrl()}_apis/test/Runs/${runId}/Results/${resultId}/attachments?api-version=${this.apiVersion}`;

    const attachments = Attachment.getAttachments();

    Logger.info(`[AzureAttachmentService] Starting evidence upload to Azure DevOps`);

    // If no attachments are found, log and exit
    if (attachments.length === 0) {
      Logger.warn(`[AzureAttachmentService] No attachments found for upload to Azure DevOps`);
      return;
    }

    // Iterate through each attachment and send it to Azure DevOps
    for (const [index, attachment] of attachments.entries()) {
      const body = {
        stream: attachment.stream,                 // Base64-encoded content
        fileName: attachment.fileName,             // File name with extension
        comment: attachment.comment,               // Description of the attachment
        attachmentType: attachment.attachmentType  // Type accepted by Azure DevOps API
      };

      try {
        const response = await axios.post(url, body, {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
          }
        });

        Logger.info(`[AzureAttachmentService] Successfully uploaded ${index + 1} attachment(s) to Azure DevOps`);
        Logger.info(`[AzureAttachmentService] Azure DevOps result available at: https://dev.azure.com/portaldedocumentos/CorbanBoards/_testManagement/runs?_a=attachments&runId=${runId}&resultId=${resultId}`);

      } catch (error: any) {
        Logger.error(`[AzureAttachmentService] Failed to upload ${index + 1} attachment(s) to Azure DevOps. Returned status: ${error.response?.status} with StatusText: ${error.response?.statusText}`);
      }
    }
  }
}