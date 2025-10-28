import dotenv from 'dotenv';
dotenv.config();

/**
* Service responsible for managing Azure DevOps configuration parameters.
* Loads environment variables and provides access to structured configuration and base URLs.
*/
export class AzureConfigService {
  private readonly host: string;
  private readonly organization: string;
  private readonly project: string;
  private readonly token: string;
  private readonly planId: string;
  private readonly suiteId: string;

  constructor() {
    this.organization = process.env.AZURE_ORGANIZATION!;
    this.project = process.env.AZURE_PROJECT!;
    this.token = process.env.AZURE_TOKEN!;
    this.planId = process.env.AZURE_PLAN_ID!;
    this.suiteId = process.env.AZURE_SUITE_ID!;
  }

  /**
   * Returns the full base URL for Azure DevOps REST API calls.
   */
  getBaseUrl(): string {
    return `https://dev.azure.com/${this.organization}/${this.project}/`;
  }

  /**
   * Returns the personal access token used for authentication.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Returns the configured test plan ID.
   */
  getPlanId(): string {
    return this.planId;
  }

  /**
   * Returns the configured test suite ID.
   */
  getSuiteId(): string {
    return this.suiteId;
  }
}