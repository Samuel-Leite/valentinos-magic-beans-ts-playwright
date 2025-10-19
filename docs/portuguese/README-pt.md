<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Automação com Playwright</h1>
  <p><strong>Framework de automação de testes E2E com arquitetura escalável e integração contínua</strong><br>Projetado para validar funcionalidades críticas de aplicações web modernas, com foco em rastreabilidade, qualidade de código e integração com plataformas corporativas.</p><br>
</div>

<p align="center">
  🧭 <a href="architecture-pt.md">Visualizar Arquitetura da Automação</a><br>
  📊 <a href="https://samuel-leite.github.io/valentinos-magic-beans-ts-playwright/64/">Visualizar relatório Allure</a><br>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Husky-hooks-critical?style=for-the-badge&logo=git&logoColor=white" alt="Husky" />
  <img src="https://img.shields.io/badge/ESLint-code%20quality-blueviolet?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI" />
  <img src="https://img.shields.io/badge/Coverage-100%25-success?style=for-the-badge" alt="Coverage" />
  <img src="https://img.shields.io/badge/BrowserStack-integrated-orange?style=for-the-badge&logo=browserstack&logoColor=white" alt="BrowserStack" />
  <img src="https://img.shields.io/badge/Azure%20DevOps-Test%20Plans-0078D7?style=for-the-badge&logo=azuredevops&logoColor=white" alt="Azure DevOps Test Plans" />
  <a href="https://samuel-leite.github.io/valentinos-magic-beans-ts-playwright/64/">
    <img src="https://img.shields.io/badge/Allure-Report-blue?style=for-the-badge&logo=allure&logoColor=white" alt="Allure Report" />
  </a>
</div>

## 📦 Requisitos
- Node.js  
- Playwright  
- TypeScript  
- Husky  
- BrowserStack  
- Azure DevOps (TestPlan)
- Percy (visual testing)
- Allure Report
- Logger Winston

## 🚀 Propósito
Este projeto tem como objetivo validar funcionalidades críticas da aplicação web **Valentino's Magic Beans** através de testes automatizados robustos, rastreáveis e escaláveis, com foco em boas práticas de desenvolvimento e qualidade de código.

## 📄 Licença
Este projeto está licenciado sob a **Licença MIT**.

---

## 🚀 Sobre o Projeto
Este repositório contém uma suíte robusta de automação de testes ponta a ponta desenvolvida com o framework <a href="https://playwright.dev/">Playwright</a>. Seu propósito é validar funcionalidades críticas de aplicações web modernas por meio de testes confiáveis, organizados e escaláveis, integrados a pipelines de CI/CD e relatórios visuais com Allure.

## 📚 Principais Funcionalidades
## Funcionalidades Principais

- Testes ponta a ponta com Playwright e TypeScript  
- Simulação completa do fluxo de compra como usuário convidado  
- Validação de produtos, preços e status do pedido  
- Arquitetura de testes modular e de fácil manutenção  
- Hooks de pré-commit com Husky para garantir qualidade de código  
- Versionamento automatizado e geração de changelog com standard-version  
- Fluxo de commits convencionais com Commitizen e validação de mensagens  
- Automação de push e controle de Git via scripts Husky  
- Criação de tags de release com versionamento semântico integrado ao Git  
- Ambiente de integração contínua configurado com GitHub Actions  
- Execução condicional da pipeline com base nas alterações (ignora commits apenas de documentação)  
- Execução de testes local e remota via BrowserStack  
- Integração nativa com Azure DevOps Test Plans  
- Relatórios visuais de testes com Allure, incluindo preservação de histórico entre execuções  
- Configuração estruturada via arquivos YAML para ambientes e credenciais

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

Para detalhes completos sobre como vincular testes ao Azure DevOps Test Plans e publicar resultados automaticamente, consulte o [Guia de Integração com Azure DevOps](../portuguese/azure-devops-pt.md).

---

## 🌐 Execução de Testes no BrowserStack

Para aprender como executar testes Playwright em navegadores e dispositivos reais usando o BrowserStack, consulte o [Guia de Execução BrowserStack](../portuguese/browserstack-pt.md).

---

## 📸 Integração e execução com o Percy

Este projeto utiliza o [Percy](https://percy.io/) para testes visuais automatizados, permitindo identificar mudanças inesperadas na interface da aplicação durante a execução dos testes com Playwright. Para mais detalhes sobre a configuração e uso do Percy, consulte o [Guia de Execução Percy](../portuguese/percy-pt.md).

---

## 📂 Estrutura do Projeto

```bash
valentino-magic-beans/
├── .github/                             # Configurações do GitHub
│   └── workflows/                       # Fluxos de trabalho de CI/CD
│       └── playwright.yml              # Pipeline de testes Playwright usando GitHub Actions
├── .husky/                              # Hooks de Git gerenciados pelo Husky
│   ├── commit-message                  # Hook para validação de mensagens de commit
│   ├── push.js                         # Script personalizado para o hook de push
│   └── _/                              # Scripts internos e definições de hooks do Husky
├── src/                                 # Código-fonte do projeto
│   ├── core/                            # Lógica central de execução e ciclo de vida dos testes
│   │   ├── hooks.ts                    # Hooks globais de teste (beforeAll, beforeEach, etc.)
│   │   └── remoteRunner.ts            # Gerencia execução local vs remota (BrowserStack)
│   ├── integrations/                    # Integrações com serviços externos
│   │   ├── azure/                      # Camada de integração com Azure DevOps
│   │   │   ├── AzureAttachmentService.ts   # Publica evidências de teste (logs, screenshots) no Azure
│   │   │   ├── AzureAuthService.ts         # Gera token PAT em base64 para autenticação na API do Azure
│   │   │   ├── AzureConfigService.ts       # Carrega configurações do Azure a partir de variáveis de ambiente
│   │   │   ├── AzureTestCaseService.ts     # Gerencia ciclo de vida dos casos de teste no Azure
│   │   │   ├── TestIdExtractor.ts          # Extrai ID do caso de teste a partir do título usando @[12345]
│   │   │   ├── TestMetadataParser.ts       # Interpreta planId, suiteId e testCaseId a partir de anotações
│   │   │   └── models/                     # Modelos de dados para payloads da API do Azure
│   │   │       ├── Attachment.ts           # Representa um arquivo codificado em base64
│   │   │       ├── Results.ts              # Encapsula o código de resultado do teste (passed, failed, etc.)
│   │   │       ├── ResultTestCase.ts       # Payload para envio de atualizações de resultado
│   │   │       └── TestCaseActive.ts       # Payload para ativar um ponto de teste antes da execução
│   │   ├── browserstack/              # Camada de integração com BrowserStack
│   │   │   ├── browserstackStatus.ts       # Atualiza status do teste no BrowserStack
│   │   │   └── endpointBuilder.ts          # Gera endpoint WebSocket para execução remota
│   │   └── percy/                     # Integração com Percy para testes visuais
│   │       └── percyService.ts            # Captura snapshots visuais durante a execução dos testes
│   ├── pages/                           # Definições do Page Object Model (POM)
│   │   ├── HomePage.ts                  # Page object da tela inicial
│   │   └── LoginPage.ts                 # Page object da tela de login
│   ├── resources/                       # Dados de teste e arquivos de configuração
│   │   ├── config/                     # URLs de ambiente e capacidades
│   │   │   ├── url-prod.yml             # URL base para ambiente de produção
│   │   │   ├── url-qa.yml               # URL base para ambiente de QA
│   │   │   └── capabilities/            # Capacidades de navegador/dispositivo para BrowserStack
│   │   │       ├── desktop.yml
│   │   │       └── mobile.yml
│   │   └── data/                       # Dados de teste por ambiente
│   │       ├── prod/
│   │       │   └── credencial.yml       # Credenciais para testes em produção
│   │       └── qa/
│   │           └── credencial.yml       # Credenciais para testes em QA
│   ├── selectors/                       # Seletores de elementos usados nos page objects
│   │   ├── HomeSelectors.ts             # Seletores da tela inicial
│   │   └── LoginSelectors.ts            # Seletores da tela de login
│   └── utils/                           # Funções utilitárias e lógica compartilhada
│       ├── actions.ts                  # Ações de alto nível em elementos (click, type, etc.)
│       ├── asserts.ts                  # Helpers de asserções personalizadas
│       ├── highlightElement.ts         # Destaque visual para depuração de elementos
│       ├── logger.ts                   # Utilitário de logging baseado em Winston
│       └── yamlReader.ts               # Leitura de arquivos YAML de config e dados
├── tests/                               # Cenários de teste
│   └── login.spec.ts                   # Caso de teste de login
├── .env                                 # Definições de variáveis de ambiente
├── .gitignore                           # Arquivos e pastas ignorados pelo Git
├── changelog.config.js                  # Configuração de geração de changelog (ex.: commitlint)
├── package.json                         # Dependências e scripts do projeto
├── package-lock.json                    # Arquivo de lock do npm para instalações reproduzíveis
├── playwright.config.ts                 # Configuração do runner de testes Playwright
├── winston.log                          # Arquivo de log gerado pelo Winston
├── README.md                            # Documentação do projeto
```

## 🔗 Links Úteis
- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Percy para Playwright](https://docs.percy.io/docs/playwright)
- [Percy Dashboard](https://percy.io/)
- [Allure Report para Playwright](https://github.com/allure-framework/allure-playwright)
- [GitHub Actions](https://docs.github.com/actions)
- [BrowserStack Automate](https://www.browserstack.com/docs/automate/playwright)
- [Azure DevOps Test Plans](https://learn.microsoft.com/azure/devops/testplans/)