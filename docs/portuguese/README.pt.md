<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Automação com Playwright</h1>
  <p><strong>Projeto desenvolvido durante o curso de automação com Playwright</strong><br>Testes modernos de ponta a ponta para aplicações web reais.</p><br>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Husky-hooks-critical?style=for-the-badge&logo=git&logoColor=white" alt="Husky" />
  <img src="https://img.shields.io/badge/ESLint-qualidade%20de%20código-blueviolet?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI" />
  <img src="https://img.shields.io/badge/Cobertura-100%25-success?style=for-the-badge" alt="Coverage" />
  <img src="https://img.shields.io/badge/BrowserStack-integrado-orange?style=for-the-badge&logo=browserstack&logoColor=white" alt="BrowserStack" />
  <img src="https://img.shields.io/badge/Azure%20DevOps-Test%20Plans-0078D7?style=for-the-badge&logo=azuredevops&logoColor=white" alt="Azure DevOps Test Plans" />
</div>

## 📦 Requisitos
- Node.js  
- Playwright  
- TypeScript  
- Husky  
- BrowserStack  
- Azure DevOps (TestPlan)
- Percy
- ESLint e Prettier  
- Logger Winston  

## 🚀 Propósito
Este projeto tem como objetivo validar funcionalidades críticas da aplicação web **Valentino's Magic Beans** através de testes automatizados robustos, rastreáveis e escaláveis, com foco em boas práticas de desenvolvimento e qualidade de código.

## 📄 Licença
Este projeto está licenciado sob a **Licença MIT**.

---

## 🚀 Sobre o Projeto
Este repositório contém uma suíte de automação de testes ponta a ponta construída com o <a href="https://playwright.dev/">Playwright</a>, desenvolvida como parte de um curso de automação.  
O objetivo é demonstrar como criar, organizar e executar testes automatizados para aplicações web reais.

## 📚 Principais Funcionalidades
- Testes E2E com Playwright e TypeScript  
- Fluxo completo de compra como usuário convidado  
- Validação de produtos, preços e status do pedido  
- Estrutura modular e de fácil manutenção  
- Hooks de pré-commit com Husky para garantir qualidade de código  
- Ambiente CI configurado com GitHub Actions  
- Execução remota de testes via BrowserStack e local  
- Integração nativa com o **Azure DevOps Test Plans**  

## 🛠️ Como Executar
```bash
# Instalar dependências
npm install
npx playwright install

# Executar todos os testes
npm run test

# Executar teste por tag
npm run tag -- '@nome_da_tag'
```

## 🛠️ Variáveis de Ambiente (.env)

```env
#### 🌐 Ambiente de Execução
RUN_ENV=                   # Ambiente alvo para execução dos testes (ex: qa, prod, staging)

#### 🧪 Modo de Execução
RUN_REMOTE=                # Defina como true para executar via BrowserStack; false para execução local
DEVICE=                    # Perfil do dispositivo a ser usado (ex: desktop, mobile, tablet)

#### 🌍 Integração com BrowserStack
BROWSERSTACK_USERNAME=     # Seu nome de usuário no BrowserStack
BROWSERSTACK_ACCESS_KEY=   # Sua chave de acesso do BrowserStack
BUILD_NAME=                # Opcional: nome do build exibido no painel do BrowserStack
PROJECT_NAME=              # Opcional: nome do projeto exibido no painel do BrowserStack

#### 🔗 Integração com Azure DevOps
AZURE_HOST=                # URL do host do Azure DevOps
AZURE_ORGANIZATION=        # Nome da organização do Azure DevOps
AZURE_PROJECT=             # Nome do projeto no Azure DevOps
AZURE_TOKEN=               # Token de Acesso Pessoal (PAT) para autenticação na API do Azure

#### 📸 Integração Visual com Percy
ENABLE_PERCY=true          # Ativa a comparação visual automática com o Percy
PERCY_TOKEN=               # Token de autenticação do projeto Percy
```

---

## 🔗 Integração com Azure DevOps

Para detalhes completos sobre como vincular testes ao Azure DevOps Test Plans e publicar resultados automaticamente, consulte o [Guia de Integração com Azure DevOps](../portuguese/azure-devops.md).

---

## 🌐 Execução de Testes no BrowserStack

Para aprender como executar testes Playwright em navegadores e dispositivos reais usando o BrowserStack, consulte o [Guia de Execução BrowserStack](../portuguese/browserstack.md).

---

## 📂 Estrutura do Projeto

```bash
valentino-magic-beans/
├── .github/                             # Configuração do GitHub
│   └── workflows/                       # Workflows de CI/CD
│       └── playwright.yml               # Pipeline de testes com Playwright via GitHub Actions
├── .husky/                              # Hooks do Git gerenciados pelo Husky
│   ├── commit-message                   # Validação de mensagens de commit
│   ├── push.js                          # Script personalizado de push
│   └── _/                               # Scripts internos e definições de hooks
├── src/                                 # Código-fonte
│   ├── core/                            # Lógica central do ciclo de vida dos testes
│   │   ├── hooks.ts                     # Hooks globais (beforeAll, beforeEach, etc.)
│   │   └── remoteRunner.ts              # Gerencia execução local ou remota (BrowserStack)
│   ├── integrations/                    # Integrações com serviços externos
│   │   ├── azure/                       # Camada de integração com Azure DevOps
│   │   │   ├── AzureAttachmentService.ts   # Publica evidências (logs, screenshots) no Azure
│   │   │   ├── AzureAuthService.ts         # Gera token base64 para autenticação na API
│   │   │   ├── AzureConfigService.ts       # Carrega configurações do Azure das variáveis de ambiente
│   │   │   ├── AzureTestCaseService.ts     # Gerencia o ciclo de vida dos casos de teste no Azure
│   │   │   ├── TestIdExtractor.ts          # Extrai o ID do caso de teste do título via @[12345]
│   │   │   ├── TestMetadataParser.ts       # Interpreta planId, suiteId, testCaseId das anotações
│   │   │   └── models/                     # Modelos de dados para payloads da API do Azure
│   │   │       ├── Attachment.ts           # Representa um arquivo base64 anexado
│   │   │       ├── Results.ts              # Define códigos de resultado do teste (passed, failed, etc.)
│   │   │       ├── ResultTestCase.ts       # Payload para atualizar o resultado do teste
│   │   │       └── TestCaseActive.ts       # Payload para ativar um ponto de teste antes da execução
│   │   └── browserstack/                   # Camada de integração com BrowserStack
│   │       ├── browserstackStatus.ts       # Atualiza o status do teste no BrowserStack
│   │       └── endpointBuilder.ts          # Constrói o endpoint WebSocket para execução remota
│   ├── pages/                              # Definições do Page Object Model (POM)
│   │   ├── HomePage.ts                     # Página inicial
│   │   └── LoginPage.ts                    # Página de login
│   ├── resources/                          # Dados de teste e arquivos de configuração
│   │   ├── config/                         # URLs de ambiente e capacidades
│   │   │   ├── url-prod.yml                # URL base de produção
│   │   │   ├── url-qa.yml                  # URL base de QA
│   │   │   └── capabilities/               # Configurações de browser/dispositivo para BrowserStack
│   │   │       ├── desktop.yml
│   │   │       └── mobile.yml
│   │   └── data/                           # Massa de teste por ambiente
│   │       ├── prod/
│   │       │   └── credencial.yml          # Credenciais de produção
│   │       └── qa/
│   │           └── credencial.yml          # Credenciais de QA
│   ├── selectors/                          # Seletores de elementos usados nos Page Objects
│   │   ├── HomeSelectors.ts                # Seletores da página inicial
│   │   └── LoginSelectors.ts               # Seletores da página de login
│   └── utils/                              # Funções utilitárias e lógica compartilhada
│       ├── actions.ts                      # Ações de alto nível (click, type, etc.)
│       ├── asserts.ts                      # Helpers de asserções personalizadas
│       ├── highlightElement.ts             # Destaque visual para debug
│       ├── logger.ts                       # Logger baseado em Winston
│       └── yamlReader.ts                   # Leitor de arquivos YAML
├── tests/                                 # Cenários de teste
│   └── login.spec.ts                      # Caso de teste de login
├── .env                                   # Definição de variáveis de ambiente
├── .gitignore                             # Arquivos e pastas ignoradas pelo Git
├── changelog.config.js                    # Configuração do changelog (ex: commitlint)
├── package.json                           # Dependências e scripts do projeto
├── package-lock.json                      # Arquivo de lock do npm
├── playwright.config.ts                   # Configuração do Playwright
├── winston.log                            # Log gerado pelo logger Winston
├── README.md                              # Documentação do projeto
```

## 🔗 Links Úteis
- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)