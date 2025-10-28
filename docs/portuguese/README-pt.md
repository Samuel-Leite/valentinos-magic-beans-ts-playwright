<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Automação com Playwright</h1>
  <p><strong>Framework de automação de testes E2E com arquitetura escalável e integração contínua</strong><br>Projetado para validar funcionalidades críticas de aplicações web modernas, com foco em rastreabilidade, qualidade de código e integração com plataformas corporativas.</p><br>
</div>

<p align="center">
  🧭 <a href="../english/architecture.jpe">Visualizar Arquitetura da Automação</a><br>
</p>

<div align="center">
  <!-- Linguagem e Framework -->
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />

  <!-- Qualidade e Padronização -->
  <img src="https://img.shields.io/badge/ESLint-code%20quality-blueviolet?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Husky-Git%20Hooks-critical?style=for-the-badge&logo=git&logoColor=white" alt="Husky" />
  <img src="https://img.shields.io/badge/Commitlint-conventional%20commits-yellow?style=for-the-badge&logo=git&logoColor=white" alt="Commitlint" />

  <!-- Integrações e Observabilidade -->
  <img src="https://img.shields.io/badge/BrowserStack-integrated-orange?style=for-the-badge&logo=browserstack&logoColor=white" alt="BrowserStack" />
  <img src="https://img.shields.io/badge/Azure%20DevOps-Test%20Plans-0078D7?style=for-the-badge&logo=azuredevops&logoColor=white" alt="Azure DevOps Test Plans" />
  <img src="https://img.shields.io/badge/Percy-Visual%20Testing-8c4eff?style=for-the-badge&logo=percy&logoColor=white" alt="Percy" />
  <img src="https://img.shields.io/badge/Prometheus-Metrics-e6522c?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus" />
  <img src="https://img.shields.io/badge/Grafana-Dashboard-f46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana" />

  <!-- CI/CD e Relatórios -->
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <a href="https://samuel-leite.github.io/valentinos-magic-beans-ts-playwright/64/">
    <img src="https://img.shields.io/badge/Allure-Report-blue?style=for-the-badge&logo=allure&logoColor=white" alt="Allure Report" />
  </a>

  <!-- Cobertura e Licença -->
  <img src="https://img.shields.io/badge/Coverage-100%25-success?style=for-the-badge" alt="Coverage" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</div>

## 📦 Requisitos
- Node.js
- Playwright
- TypeScript
- Docker
- BrowserStack
- Azure DevOps (TestPlan)
- Percy (teste visual)
- Allure Report
- Prometheus
- Grafana

## 🚀 Propósito
Este projeto tem como objetivo validar funcionalidades críticas da aplicação web [**Valentino's Magic Beans**](https://valentinos-magic-beans.click) através de testes automatizados robustos, rastreáveis e escaláveis, com foco em boas práticas de desenvolvimento e qualidade de código.

## 📄 Licença
Este projeto está licenciado sob a **Licença MIT**.

---

## 🚀 Sobre o Projeto
Este repositório contém uma suíte robusta de automação de testes ponta a ponta desenvolvida com o framework <a href="https://playwright.dev/">Playwright</a>. Seu propósito é validar funcionalidades críticas de aplicações web modernas por meio de testes confiáveis, organizados e escaláveis, integrados a pipelines de CI/CD e Grafana com Prometheus, e relatórios visuais com Allure.

## 📚 Principais Funcionalidades
- End-to-end testing com Playwright e TypeScript
- Arquitetura de testes modular e escalável
- Geração de screenshots em todos os testes
- Geração de trace na primeira reexecução após falha
- Auditoria de performance com Lighthouse
- Exposição de métricas via Prometheus com visualização de métricas no dashboards Grafana
- Testes visuais com Percy integrados ao fluxo funcional
- Integração com Azure DevOps, Test Plans
- Execução local e remota via BrowserStack
- Hooks de pré-commit com Husky
- Versionamento automático e geração de changelog com standard-version
- Pipeline CI com GitHub Actions
- Execução condicional de pipeline com base em alterações de código
- Relatórios visuais com Allure e histórico preservado entre execuções
- Configuração estruturada com YAML para ambientes e credenciais

## 🛠️ Como Executar
```bash
# Instalar dependências
npm install
npx playwright install

# Executar todos os testes
npm run test

# Executar os testes funcionais
npm run functional

# Executar os testes visuais (percy)
npm run visual

# Executar os testes com auditorias de desempenho em páginas (Lighthouse )
npm run lighthouse

# Executar teste por tag
npm run tag -- '@nome_da_tag'
```

## 🛠️ Variáveis de Ambiente (.env)

```env
#### 🌐 Ambiente de Execução
RUN_ENV=                   # Ambiente alvo para execução dos testes (ex: qa, prod)

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

## 🚦 Auditoria de Performance com Lighthouse

Para aprender como executar auditorias de performance em páginas web usando o Lighthouse integrado ao Playwright, consulte o [Guia de Auditoria Lighthouse](../portuguese/lighthouse-pt.md).

---

## 📸 Integração e execução com o Percy

Este projeto utiliza o [Percy](https://percy.io/) para testes visuais automatizados, permitindo identificar mudanças inesperadas na interface da aplicação durante a execução dos testes com Playwright. Para mais detalhes sobre a configuração e uso do Percy, consulte o [Guia de Execução Percy](../portuguese/percy-pt.md).

---

## 📦 Integração Grafana + Prometheus

Este projeto utiliza o [Docker](https://www.docker.com/) para orquestrar uma stack de monitoramento que inclui o [Prometheus](https://prometheus.io/) para coleta de métricas dos testes e o [Grafana](https://grafana.com/) para visualização em tempo real.  
As execuções dos testes com Playwright expõem métricas como duração, número de tentativas e falhas, que são coletadas pelo Prometheus e exibidas em painéis do Grafana.  
Para instruções detalhadas de configuração e uso, consulte o [Guia do Grafana](./docs/portuguese/grafana.md).

---

## 📂 Estrutura do Projeto

```bash
valentino-magic-beans/
├── .github/                             # Configuração do GitHub
│   └── workflows/                       # Workflows de CI/CD com GitHub Actions
│       ├── playwright-metrics.yml       # Pipeline de métricas com Playwright e Grafana
│       └── playwright.yml               # Pipeline de testes automatizados com Playwright
│   ├── commit-message                  # Hook para validação de mensagens de commit
│   ├── push.js                         # Script personalizado para push
│   └── _/                              # Scripts internos e definições de hooks do Husky
├── docs/                                # Documentação do projeto
│   ├── english/                         # Documentação em inglês
│   └── portuguese/                      # Documentação em português
├── infra/
│   └── dashboards/                      # Monitoring setup for Playwright test metrics
│       └── grafana-playwright.json      # Grafana dashboard visualizing data collected by Prometheus during Playwright test execution
│   └── monitoring/                      # Infraestrutura de monitoramento para métricas dos testes
│       ├── Dockerfile                  # Constrói o container que executa os testes e expõe métricas
│       ├── startMetrics.ts             # Executa os testes e registra métricas para o Prometheus
│       ├── metricsServer.ts            # Servidor Express que define e expõe métricas Prometheus
│       ├── metricsInstance.ts          # Instancia e inicia o servidor de métricas
│       ├── prometheus.yml              # Configuração de coleta do Prometheus
│       └── docker-compose.yml          # Define os serviços: Prometheus, Grafana e executor de testes
├── src/                                 # Código-fonte
│   ├── core/                            # Lógica central de execução e ciclo de vida dos testes
│   │   ├── hooks.ts                    # Hooks globais de teste (beforeAll, beforeEach, etc.)
│   │   └── remoteRunner.ts            # Gerencia execução local e remota (BrowserStack)
│   ├── integrations/                    # Integrações com serviços externos
│   │   ├── azure/                      # Camada de integração com Azure DevOps
│   │   │   ├── AzureAttachmentService.ts   # Publica evidências de teste (logs, screenshots) no Azure
│   │   │   ├── AzureAuthService.ts         # Gera token base64 para autenticação na API do Azure
│   │   │   ├── AzureConfigService.ts       # Carrega configurações do Azure via variáveis de ambiente
│   │   │   ├── AzureTestCaseService.ts     # Gerencia ciclo de vida dos casos de teste no Azure
│   │   │   ├── TestIdExtractor.ts          # Extrai ID do caso de teste do título usando @[12345]
│   │   │   ├── TestMetadataParser.ts       # Interpreta planId, suiteId e testCaseId via anotações
│   │   │   └── models/                     # Modelos de dados para payloads da API do Azure
│   │   │       ├── Attachment.ts           # Representa um anexo codificado em base64
│   │   │       ├── Results.ts              # Encapsula o resultado do teste (aprovado, falhou, etc.)
│   │   │       ├── ResultTestCase.ts       # Payload para envio de atualizações de resultado
│   │   │       └── TestCaseActive.ts       # Payload para ativar ponto de teste antes da execução
│   │   ├── browserstack/              # Camada de integração com BrowserStack
│   │   │   ├── browserstackStatus.ts       # Atualiza status do teste no BrowserStack
│   │   │   └── endpointBuilder.ts          # Constrói endpoint WebSocket para execução remota
│   │   │   └── lighthouseExecutor.ts       # Inicializa e gerencia servidor Lighthouse para auditorias remotas
│   │   └── percy/                     # Integração com testes visuais via Percy
│   │       └── percyService.ts            # Captura snapshots visuais durante a execução dos testes
│   ├── pages/                           # Definições do modelo de páginas (Page Object Model)
│   │   ├── HomePage.ts                  # Objeto de página para a home
│   │   └── LoginPage.ts                 # Objeto de página para login
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
│   ├── selectors/                       # Seletores de elementos usados nos objetos de página
│   │   ├── HomeSelectors.ts             # Seletores da página inicial
│   │   └── LoginSelectors.ts            # Seletores da página de login
│   └── utils/                           # Funções utilitárias e lógica compartilhada
│       ├── actions.ts                  # Ações de alto nível em elementos (click, type, etc.)
│       ├── asserts.ts                  # Helpers de asserções personalizadas
│       ├── highlightElement.ts         # Destaque visual para depuração de elementos
│       ├── logger.ts                   # Utilitário de log baseado em Winston
│       └── yamlReader.ts               # Leitor de arquivos YAML para configs e dados
├── tests/                               # Cenários de teste automatizados
│   ├── e2e/                             # Testes funcionais end-to-end com Playwright e Percy
│   └── performance/                     # Auditorias de performance com Lighthouse
├── .env                                 # Definições de variáveis de ambiente
├── .gitignore                           # Arquivos e pastas ignorados pelo Git
├── changelog.config.js                  # Configuração de geração de changelog (ex: commitlint)
├── CHANGELOG.md                         # Histórico de versões e alterações relevantes
├── package-lock.json                    # Arquivo de lock do npm para instalações reproduzíveis
├── package.json                         # Dependências e scripts do projeto
├── playwright.config.ts                 # Configuração do runner de testes Playwright
├── README.md                            # Documentação principal do projeto
├── tsconfig.json                        # Configuração do compilador TypeScript
├── winston.log                          # Arquivo de log gerado pelo Winston
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
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Hub Docker](https://hub.docker.com/)
- [Winston Logger](https://amirmustafaofficial.medium.com/winston-production-level-logger-in-javascript-b77548044764)