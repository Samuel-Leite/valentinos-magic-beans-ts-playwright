# 🔗 Azure DevOps Integration

This project supports native integration with **Azure DevOps Test Plans**, enabling full traceability between automated tests and manual test management workflows.

## 📘 Table of Contents

- [🧩 Purpose](#-purpose)
- [⚙️ How It Works](#-how-it-works)
  - [🧪 Example Test](#-example-test)
- [🔐 Required Environment Variables](#-required-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🛠️ Key Components](#-key-components)
  - [⚙️ Azure DevOps Services](#-azure-devops-services)
    - [`AzureAttachmentService.ts`](#azureattachmentservicets)
    - [`AzureAuthService.ts`](#azureauthservicets)
    - [`AzureConfigService.ts`](#azureconfigservicets)
    - [`AzureTestCaseService.ts`](#azuretestcaseservicets)
    - [`TestIdExtractor.ts`](#testidextractorts)
    - [`TestMetadataParser.ts`](#testmetadataparserts)
    - [✅ Utility Functions](#-utility-functions)
  - [🧱 Azure DevOps Models](#-azure-devops-models)
    - [`Attachment.ts`](#attachmentts)
    - [`Results.ts`](#resultsts)
    - [`ResultTestCase.ts`](#resulttestcasets)
    - [`TestCaseActive.ts`](#testcaseactivets)
- [🧯 Troubleshooting](#-troubleshooting)
- [📄 Source Files](#-source-files)

## 🧩 Purpose

- Activates test cases before execution
- Publishes test results (Passed, Failed, Skipped)
- Attaches evidence (logs, screenshots) to test results
- Updates automation status to "Automated" in Azure DevOps

## ⚙️ How It Works

Each test must include metadata annotations in its title to link it to a specific Azure Test Case:

```ts
test('@PLAN_ID=123 @SUITE_ID=456 @[789] Validate login flow', async ({ page }) => {
  // test logic
});
```

- @PLAN_ID=123 → Azure Test Plan ID
- @SUITE_ID=456 → Azure Test Suite ID
- @[789] → Azure Test Case ID

During execution:
- Metadata is parsed from the test title
- The test case is activated via Azure DevOps API
- The result is published after execution
- Attachments are uploaded if the test fails
- The test case is marked as "Automated"

#### 🧪 Example Test
```ts
test('@PLAN_ID=101 @SUITE_ID=202 @[303] Validate login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const credentials = YamlReader.readYamlObject('valid_user');

  await loginPage.doLogin(credentials.email, credentials.password);
  await homePage.assertLoginSuccess('Login Successful');
  await homePage.doLogOut();
});
```

#### 🔐 Required Environment Variables
```env
AZURE_TOKEN=your-personal-access-token      # PAT with Test Management and Work Item access
```
⚠️ Never commit your real AZURE_TOKEN. Use .env.example for safe sharing.

## 📂 Project Structure
```
azure/
│ ├── AzureAttachmentService.ts
│ ├── AzureAuthService.ts
│ ├── AzureConfigService.ts
│ ├── AzureTestCaseService.ts
│ ├── TestIdExtractor.ts
│ ├── TestMetadataParser.ts
│ └── models/
│        ├── Attachment.ts
│        ├── Results.ts
│        ├── ResultTestCase.ts
│        └── TestCaseActive.ts
```

## 🛠️ Key Components

###  ⚙️ Azure DevOps Services

This document describes the service classes responsible for managing the Azure DevOps Test Plans integration. These services handle test case activation, result publishing, evidence attachment, and configuration management.

---

#### `AzureAttachmentService.ts`

Publishes test evidence (e.g., logs, screenshots) to Azure DevOps test results.

##### Purpose
- Retrieves all registered attachments
- Sends each attachment to Azure DevOps via REST API
- Associates attachments with a specific test result in a test run

##### Key Method
```ts
publishAttachments(runId: string, resultId: number): Promise<void>
```

---

#### `AzureAuthService.ts`

Generates authentication tokens for Azure DevOps API requests using a Personal Access Token (PAT).

##### Purpose
- Loads the PAT from environment variables
- Encodes the token in base64 format for HTTP Basic Auth

##### Key Method
```ts
generateToken(): string
```

---

#### `AzureConfigService.ts`

Loads and provides access to Azure DevOps configuration parameters from environment variables.

##### Purpose
- Constructs base API URLs
- Provides access to project, organization, token, planId, and suiteId

##### Key Method
```ts
getBaseUrl(): string
getToken(): string
getPlanId(): string
getSuiteId(): string
```

---

#### `AzureTestCaseService.ts`

Manages the full lifecycle of a test case in Azure DevOps.

##### Purpose
- Activates the test case before execution
- Publishes the result after execution
- Updates the automation status to "Automated"
- Attaches evidence if the test fails

##### Key Method
```ts
startTestCase(planId, suiteId, testCaseId): Promise<void>
finishTestCase(planId, suiteId, testCaseId, status, error?): Promise<void>
```

##### Internal Helpers
- getTestPointId(...): Retrieves the test point ID for a given test case
- updateAutomationStatus(...): Marks the test case as "Automated"
- getStatusCode(status: string): Maps Playwright status to Azure DevOps result codes


---

#### `TestIdExtractor.ts`

Extracts the test case ID from a test title using the @[12345] annotation.

##### Purpose
- Parses the test title to retrieve the Azure DevOps test case ID

##### Key Method
```ts
extract(title: string): string | undefined
```

##### ✅ Utility Functions

These wrappers simplify usage in Playwright hooks or test runners:
```ts
runTestCaseStart(planId, suiteId, testCaseId): Promise<void>
runTestCaseFinished(planId, suiteId, testCaseId, status, error?): Promise<void>
```
They internally use AzureTestCaseService to activate and finalize test cases.

---

####  `TestMetadataParser.ts`

Parses structured metadata from test titles to link automated tests with Azure DevOps Test Plans.

##### Purpose

This service extracts the following metadata from a test title:

- `@PLAN_ID=xxx` → Test Plan ID
- `@SUITE_ID=xxx` → Test Suite ID
- `@[xxx]` → Test Case ID

It ensures that each test is correctly mapped to its corresponding Azure DevOps test case.

##### Expected Format

```ts
test('@PLAN_ID=123 @SUITE_ID=456 @[789] Validate login flow', async ({ page }) => {
  // test logic
});
```

##### Key Method
```ts
static extract(title: string): TestMetadata
```

Returns a structured object:
```ts
{
  planId: '123',
  suiteId: '456',
  testCaseId: '789'
}
```

##### Error Handling
```ts
Error: Missing metadata in test title. Expected format: @PLAN_ID=xxx @SUITE_ID=xxx @[testCaseId]
```

##### Usage
Used by:
- AzureTestCaseService.ts to activate and finalize test cases
- Hooks or runners that need to extract metadata before execution

---

### 🧱 Azure DevOps Models

This document describes the core model classes used to interact with the Azure DevOps Test Plans API. These classes define the structure of the payloads sent during test case activation, result publishing, and evidence attachment.

---

#### `Attachment.ts`

Handles the creation and management of file attachments (e.g., logs, screenshots) to be published in Azure DevOps test results.

##### Purpose
- Encodes file content in base64
- Generates a unique filename with timestamp and random suffix
- Stores attachments in a static collection
- Provides methods to add, retrieve, and clear attachments

##### Key Properties
- `stream`: Base64-encoded content of the attachment
- `fileName`: Auto-generated filename with timestamp and random suffix
- `comment`: Description or context for the attachment
- `attachmentType`: Type of attachment (default: `GeneralAttachment`)

##### Static Methods
- `setAttachment(attachment: Attachment)`: Adds an attachment to the global collection
- `getAttachments()`: Retrieves all stored attachments
- `clearAttachments()`: Clears the attachment list

---

#### `Results.ts`

Represents the outcome of a test case execution in Azure DevOps.

##### Purpose
Encapsulates the result code expected by Azure DevOps:

| Code | Meaning       |
|------|---------------|
| 0    | Unspecified   |
| 1    | Interrupted   |
| 2    | Passed        |
| 3    | Failed        |
| 4    | Skipped/Timeout |

##### Usage
Used by `ResultTestCase.ts` and `AzureTestCaseService.ts` to communicate test outcomes.

---

#### `ResultTestCase.ts`

Defines the payload structure for updating the result of a specific test point in Azure DevOps.

##### Purpose
- Maps a test point ID to its corresponding `Results` object

##### Constructor
```ts
new ResultTestCase(id: number, results: Results)
```

##### Usage
Used by AzureTestCaseService.ts when publishing test results.

---

#### `TestCaseActive.ts`

Defines the payload structure for activating a test point before execution.

##### Purpose
- Marks a test point as active using its ID and a boolean flag
```ts
new TestCaseActive(id: number, isActive: boolean)
```

##### Usage
Used by AzureTestCaseService.ts during the test activation phase.

--- 

## 🧯 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `AZURE_TOKEN is not defined` | Missing env variable | Add it to `.env` or `.env.local` |
| Test case not updated | Incorrect metadata | Check `@PLAN_ID`, `@SUITE_ID`, and `@[ID]` in test title |
| Attachments not published | No failure or missing call | Ensure `Attachment.setAttachment()` is called on error |
| Result not visible in Azure | Wrong test point ID | Confirm test case is linked to correct suite and plan |

---

## 📄 Source Files
- [`AzureAttachmentService.ts`](../../src/integrations/azure/AzureAttachmentService.ts)
- [`AzureAuthService.ts`](../../src/integrations/azure/AzureAuthService.ts)
- [`AzureConfigService.ts`](../../src/integrations/azure/AzureConfigService.ts)
- [`AzureTestCaseService.ts`](../../src/integrations/azure/AzureTestCaseService.ts)
- [`TestIdExtractor.ts`](../../src/integrations/azure/TestIdExtractor.ts)
- [`TestMetadataParse.ts`](../../src/integrations/azure/TestMetadataParse.ts)
- [`Attachment.ts`](../../src/integrations/azure/models/Attachment.ts)
- [`Results.ts`](../../src/integrations/azure/models/Results.ts)
- [`ResultTestCase.ts`](../../src/integrations/azure/models/ResultTestCase.ts)
- [`TestCaseActive.ts`](../../src/integrations/azure/models/TestCaseActive.ts)