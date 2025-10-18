# 🔗 Integração com Azure DevOps

Este projeto oferece integração nativa com o **Azure DevOps Test Plans**, permitindo rastreabilidade completa entre testes automatizados e fluxos de trabalho de gerenciamento de testes manuais.

## 📘 Índice

- [🧩 Propósito](#-propósito)
- [⚙️ Como Funciona](#-como-funciona)
  - [🧪 Exemplo de Teste](#-exemplo-de-teste)
- [🔐 Variáveis de Ambiente Necessárias](#-variáveis-de-ambiente-necessárias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Componentes Principais](#-componentes-principais)
  - [⚙️ Serviços do Azure DevOps](#-serviços-do-azure-devops)
    - [`AzureAttachmentService.ts`](#azureattachmentservicets)
    - [`AzureAuthService.ts`](#azureauthservicets)
    - [`AzureConfigService.ts`](#azureconfigservicets)
    - [`AzureTestCaseService.ts`](#azuretestcaseservicets)
    - [`TestIdExtractor.ts`](#testidextractorts)
    - [`TestMetadataParser.ts`](#testmetadataparserts)
    - [✅ Funções Utilitárias](#-funções-utilitárias)
  - [🧱 Modelos do Azure DevOps](#-modelos-do-azure-devops)
    - [`Attachment.ts`](#attachmentts)
    - [`Results.ts`](#resultsts)
    - [`ResultTestCase.ts`](#resulttestcasets)
    - [`TestCaseActive.ts`](#testcaseactivets)
- [🧯 Solução de Problemas](#-solução-de-problemas)
- [📄 Arquivos Fonte](#-arquivos-fonte)

## 🧩 Propósito

- Ativa casos de teste antes da execução  
- Publica os resultados dos testes (Aprovado, Falhou, Ignorado)  
- Anexa evidências (logs, capturas de tela) aos resultados dos testes  
- Atualiza o status de automação para "Automatizado" no Azure DevOps  

## ⚙️ Como Funciona

Cada teste deve incluir anotações de metadados em seu título para vinculá-lo a um caso de teste específico no Azure DevOps:

```ts
test('@PLAN_ID=123 @SUITE_ID=456 @[789] Validar fluxo de login', async ({ page }) => {
  // lógica do teste
});
```

- @PLAN_ID=123 → ID do Plano de Teste no Azure
- @SUITE_ID=456 → ID da Suíte de Teste no Azure
- @[789] → ID do Caso de Teste no Azure

Durante a execução:
- Os metadados são analisados a partir do título do teste
- O caso de teste é ativado via API do Azure DevOps
- O resultado é publicado após a execução
- As evidências são enviadas se o teste falhar
- O caso de teste é marcado como “Automatizado”

#### 🧪 Exemplo de Teste
```ts
test('@PLAN_ID=101 @SUITE_ID=202 @[303] Validar login com credenciais válidas', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const credentials = YamlReader.readYamlObject('valid_user');

  await loginPage.doLogin(credentials.email, credentials.password);
  await homePage.assertLoginSuccess('Login bem-sucedido');
  await homePage.doLogOut();
});
```

#### 🔐 Required Environment Variables
```env
AZURE_HOST=dev.azure.com                     # Host do Azure DevOps
AZURE_ORGANIZATION=nome-da-sua-org           # Nome da organização no Azure
AZURE_PROJECT=nome-do-seu-projeto            # Nome do projeto no Azure
AZURE_TOKEN=seu-token-de-acesso-pessoal      # PAT com acesso a Test Management e Work Items
AZURE_PLAN_ID=123                            # ID padrão do Plano de Teste (opcional se usar metadados inline)
AZURE_SUITE_ID=456                           # ID padrão da Suíte de Teste (opcional se usar metadados inline)
```
⚠️ Nunca faça commit do seu AZURE_TOKEN real. Use .env.example para compartilhamento seguro.

## 📂 Estrutura do Projeto
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

## 🛠️ Componentes Principais

###  ⚙️ Serviços do Azure DevOps

Este documento descreve as classes de serviço responsáveis por gerenciar a integração com o Azure DevOps Test Plans. Esses serviços lidam com a ativação de casos de teste, publicação de resultados, anexação de evidências e gerenciamento de configurações.

---

#### `AzureAttachmentService.ts`

Publica evidências de teste (por exemplo, logs, capturas de tela) nos resultados do Azure DevOps.

##### Propósito
- Recupera todos os anexos registrados
- Envia cada anexo para o Azure DevOps via REST API
- Associa os anexos a um resultado de teste específico em uma execução

##### Método Principal
```ts
publishAttachments(runId: string, resultId: number): Promise<void>
```

---

#### `AzureAuthService.ts`

Gera tokens de autenticação para requisições à API do Azure DevOps usando um Token de Acesso Pessoal (PAT).

##### Propósito
- Loads the PAT from environment variables
- Encodes the token in base64 format for HTTP Basic Auth

##### Key Method
```ts
generateToken(): string
```

---

#### `AzureConfigService.ts`

Loads and provides access to Azure DevOps configuration parameters from environment variables.

##### Propósito
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

##### Propósito
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

##### Propósito
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

##### Propósito

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

##### Propósito
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

##### Propósito
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

##### Propósito
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

##### Propósito
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