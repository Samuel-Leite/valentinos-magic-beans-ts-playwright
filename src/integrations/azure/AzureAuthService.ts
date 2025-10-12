/**
* Service responsible for generating authentication tokens for Azure DevOps API requests.
* Uses the personal access token (PAT) stored in environment variables.
*/
export class AzureAuthService {
  private readonly token: string;

  constructor() {
    const envToken = process.env.AZURE_TOKEN;
    if (!envToken) {
      throw new Error('AZURE_TOKEN is not defined in environment variables.');
    }
    this.token = envToken;
  }

  /**
   * Generates a base64-encoded token for use in Azure DevOps HTTP Authorization headers.
   * Format: Basic <base64(:PAT)>
   * @returns Encoded token string
   */
  generateToken(): string {
    return Buffer.from(`:${this.token}`).toString('base64');
  }
}