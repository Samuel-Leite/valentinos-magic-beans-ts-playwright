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
AZURE_TOKEN=seu-token-de-acesso-pessoal      # PAT com acesso a Test Management e Work Items
```
⚠️ Nunca faça commit do seu AZURE_TOKEN real. Use .env.example para compartilhamento seguro.

## 📂 Estrutura do Projeto

```bash
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

Carrega e fornece acesso aos parâmetros de configuração do Azure DevOps a partir das variáveis de ambiente.

##### Propósito
- Constrói as URLs base da API
- Fornece acesso ao projeto, organização, token, planId e suiteId

##### Métodos Principais
```ts
getBaseUrl(): string
getToken(): string
getPlanId(): string
getSuiteId(): string
```

---

#### `AzureTestCaseService.ts`

Gerencia todo o ciclo de vida de um caso de teste no Azure DevOps.

##### Propósito
- Ativa o caso de teste antes da execução
- Publica o resultado após a execução
- Atualiza o status de automação para "Automatizado"
- Anexa evidências se o teste falhar

##### Métodos Principais
```ts
startTestCase(planId, suiteId, testCaseId): Promise<void>
finishTestCase(planId, suiteId, testCaseId, status, error?): Promise<void>
```

##### Funções Internas
- getTestPointId(...): Recupera o ID do ponto de teste para um caso específico
- updateAutomationStatus(...): Marca o caso de teste como "Automatizado"
- getStatusCode(status: string): Mapeia o status do Playwright para os códigos de resultado do Azure DevOps

---

#### `TestIdExtractor.ts`

Extrai o ID do caso de teste a partir do título usando a anotação @[12345].

##### Propósito
- Analisa o título do teste para recuperar o ID do caso de teste no Azure DevOps

##### Método Principal
```ts
extract(title: string): string | undefined
```

##### ✅ Funções Utilitárias

Esses wrappers simplificam o uso em hooks ou executores de teste do Playwright:
```ts
runTestCaseStart(planId, suiteId, testCaseId): Promise<void>
runTestCaseFinished(planId, suiteId, testCaseId, status, error?): Promise<void>
```
Eles utilizam internamente o `AzureTestCaseService` para ativar e finalizar casos de teste.

---

####  `TestMetadataParser.ts`

Analisa os metadados estruturados dos títulos dos testes para vinculá-los aos Planos de Teste do Azure DevOps.

##### Propósito

Este serviço extrai os seguintes metadados de um título de teste:

- `@PLAN_ID=xxx` → ID do Plano de Teste
- `@SUITE_ID=xxx` → ID da Suíte de Teste
- `@[xxx]` → ID do Caso de Teste

Garante que cada teste seja mapeado corretamente para seu respectivo caso no Azure DevOps.

##### Formato Esperado

```ts
test('@PLAN_ID=123 @SUITE_ID=456 @[789] Validar fluxo de login', async ({ page }) => {
  // lógica do teste
});
```

##### Método Principal
```ts
static extract(title: string): TestMetadata
```

Retorna um objeto estruturado:
```ts
{
  planId: '123',
  suiteId: '456',
  testCaseId: '789'
}
```

##### Tratamento de Erros
```ts
Error: Missing metadata in test title. Expected format: @PLAN_ID=xxx @SUITE_ID=xxx @[testCaseId]
```

##### Uso
Usado por:
- `AzureTestCaseService.ts` para ativar e finalizar casos de teste
- Hooks ou runners que precisam extrair metadados antes da execução

---

### 🧱 Modelos do Azure DevOps

Este documento descreve as classes de modelo principais usadas para interagir com a API do Azure DevOps Test Plans. Essas classes definem a estrutura dos payloads enviados durante a ativação de casos de teste, publicação de resultados e anexação de evidências.

---

#### `Attachment.ts`

Gerencia a criação e o gerenciamento de anexos de arquivos (por exemplo, logs, capturas de tela) a serem publicados nos resultados de teste do Azure DevOps.

##### Propósito
- Codifica o conteúdo do arquivo em base64
- Gera um nome de arquivo exclusivo com timestamp e sufixo aleatório
- Armazena anexos em uma coleção estática
- Fornece métodos para adicionar, recuperar e limpar anexos

##### Propriedades Principais
- `stream`: Conteúdo do anexo em base64
- `fileName`: Nome de arquivo gerado automaticamente
- `comment`: Descrição ou contexto do anexo
- `attachmentType`: Tipo de anexo (padrão: `GeneralAttachment`)

##### Métodos Estáticos
- `setAttachment(attachment: Attachment)`: Adiciona um anexo à coleção global
- `getAttachments()`: Retorna todos os anexos armazenados
- `clearAttachments()`: Limpa a lista de anexos

---

#### `Results.ts`

Representa o resultado da execução de um caso de teste no Azure DevOps.

##### Propósito
Encapsula o código de resultado esperado pelo Azure DevOps:

| Código | Significado       |
|--------|-------------------|
| 0      | Não especificado  |
| 1      | Interrompido      |
| 2      | Aprovado          |
| 3      | Falhou            |
| 4      | Ignorado/Timeout  |

##### Uso
Usado por `ResultTestCase.ts` e `AzureTestCaseService.ts` para comunicar os resultados dos testes.

---

#### `ResultTestCase.ts`

Define a estrutura do payload para atualizar o resultado de um ponto de teste específico no Azure DevOps.

##### Propósito
- Mapeia o ID do ponto de teste para seu respectivo objeto `Results`

##### Construtor
```ts
new ResultTestCase(id: number, results: Results)
```

##### Uso
Usado por `AzureTestCaseService.ts` ao publicar resultados de teste.

---

#### `TestCaseActive.ts`

Define a estrutura do payload para ativar um ponto de teste antes da execução.

##### Propósito
- Marca um ponto de teste como ativo usando seu ID e um valor booleano

```ts
new TestCaseActive(id: number, isActive: boolean)
```

##### Uso
Usado por `AzureTestCaseService.ts` durante a fase de ativação do teste.

--- 

## 🧯 Solução de Problemas

|          Problema               |                 Causa                |                                Solução                                |
|---------------------------------|--------------------------------------|-----------------------------------------------------------------------|
| `AZURE_TOKEN is not defined`    | Variável de ambiente ausente         | Adicione-a em `.env` ou `.env.local`                                  |
| Caso de teste não atualizado    | Metadados incorretos                 | Verifique `@PLAN_ID`, `@SUITE_ID`, e `@[ID]` no título do teste       |
| Anexos não publicados           | Nenhuma falha ou ausência de chamada | Garanta que `Attachment.setAttachment()` seja chamado em caso de erro |
| Resultado não visível no Azure  | ID de ponto de teste incorreto       | Confirme se o caso está vinculado ao plano e suíte corretos           |

---

## 📄 Arquivos Fonte
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