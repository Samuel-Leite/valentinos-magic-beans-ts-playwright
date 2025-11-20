import axios from 'axios';
import { AzureConfigService } from './AzureConfigService';
import { Attachment } from './models/Attachment';
import { Logger } from '../../utils/logger';

/**
* Service responsável por publicar anexos (evidências) nos resultados de teste do Azure DevOps.
* Inclui logs detalhados mostrando o formato esperado pela API, o payload enviado e a URL da UI.
*/
export class AzureAttachmentService {
  private readonly apiVersion: string = '5.1-preview';

  /**
   * Publica todos os anexos registrados em um resultado de teste dentro de um Test Run.
   * @param runId ID do Test Run no Azure DevOps
   * @param resultId ID do resultado de teste dentro do run
   */
  async publishAttachments(runId: string, resultId: number): Promise<void> {
    const config = new AzureConfigService();
    const token = Buffer.from(`:${config.getToken()}`).toString('base64');
    const url = `${config.getBaseUrl()}_apis/test/Runs/${runId}/Results/${resultId}/attachments?api-version=${this.apiVersion}`;

    const attachments = Attachment.getAttachments();

    Logger.info(`[AzureAttachmentService] Iniciando envio das evidências ao Azure DevOps`);

    if (attachments.length === 0) {
      Logger.warn(`[AzureAttachmentService] Nenhum anexo localizado para envio ao Azure DevOps`);
      return;
    }

    for (const [index, attachment] of attachments.entries()) {
      const body = {
        stream: attachment.stream,               // conteúdo já em Base64
        fileName: attachment.fileName,           // nome do arquivo com extensão
        comment: attachment.comment,             // descrição do anexo
        attachmentType: attachment.attachmentType // tipo aceito pela API
      };

      try {
        const response = await axios.post(url, body, {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
          }
        });

        Logger.info(`[AzureAttachmentService] Enviado com sucesso para o Azure DevOps a quantidade de ${index + 1} anexo(s)`);
        Logger.info(`[AzureAttachmentService] Resultado do Azure DevOps disponível em: https://dev.azure.com/portaldedocumentos/CorbanBoards/_testManagement/runs?_a=attachments&runId=${runId}&resultId=${resultId}`);

      } catch (error: any) {
        Logger.error(`[AzureAttachmentService] Falha ao enviar para o Azure DevOps a quantidade de ${index + 1} anexo(s). Retornou o status: ${error.response?.status} com o StatusText: ${error.response?.statusText}`);
      }
    }
  }
}