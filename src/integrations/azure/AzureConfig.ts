import { YamlReader } from '../../utils/yamlReader';

/**
 * AzureConfig class centralizes Azure DevOps configuration values.
 * These values are loaded from environment variables and used across Azure integration services.
 * This class is intended for non-sensitive configuration only (e.g., host, organization, project).
 */
export class AzureConfig {
  /**
   * Azure DevOps host URL (e.g., dev.azure.com)
   */
  public readonly host: string;

  /**
   * Azure DevOps organization name
   */
  public readonly organization: string;

  /**
   * Azure DevOps project name
   */
  public readonly project: string;

  constructor() {
    this.host = YamlReader.getConfigValue('azure.host');
    this.organization = YamlReader.getConfigValue('azure.organization');
    this.project = YamlReader.getConfigValue('azure.project');
  }
}