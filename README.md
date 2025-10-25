<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Playwright Automation</h1>
  <p><strong>Enterprise-grade end-to-end test automation framework</strong><br>Designed to validate mission-critical features of modern web applications with scalability, traceability, and seamless integration into CI/CD pipelines.</p><br>

  🌎 <a href="./docs/portuguese/README-pt.md">Versão em Português</a><br>
    🧭 <a href="./docs/english/architecture.md">View Automation Architecture</a><br>
</div>

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

## 📦 Requirements
- Node.js
- Playwright
- TypeScript
- Docker
- BrowserStack
- Azure DevOps (TestPlan)
- Percy (visual testing)
- Allure Report
- Prometheus
- Grafana

## 🚀 Purpose
This project aims to validate critical functionalities of the Valentino's Magic Beans web application through robust, traceable, and scalable automated tests, with a strong focus on development best practices and code quality.

## 📄 License
This project is licensed under the MIT License.

---

## 🚀 About the Project
This repository contains a robust end-to-end test automation suite built with <a href="https://playwright.dev/">Playwright</a>. Its purpose is to validate critical features of modern web applications through reliable, scalable, and well-structured automated tests — fully integrated with CI/CD pipelines and enhanced by visual reporting via Allure.

## 📚 Key Features
- End-to-end testing with Playwright and TypeScript
- Full guest checkout flow simulation
- Validation of products, pricing, and order status
- Modular and scalable test architecture
- Screenshots captured on every test execution
- Trace files generated on first retry after failure
- Performance audits using Lighthouse
- Prometheus metrics for test duration, failures, retries, and environment
- Grafana dashboards for real-time test observability
- Dockerized setup for Prometheus, Grafana, and test runner
- Visual regression testing with Percy
- Native integration with Azure DevOps Test Plans
- Local and remote test execution via BrowserStack
- Pre-commit hooks with Husky to enforce code quality
- Conventional commits with Commitizen and message linting
- Automated versioning and changelog generation with standard-version
- Semantic release tagging with Git integration
- CI pipeline configured with GitHub Actions
- Conditional pipeline execution based on code changes
- Visual test reporting with Allure, including historical data retention
- Structured configuration using YAML for environments and credentials

## 🛠️ How to run
```
# Install dependencies
npm install
npx playwright install

# Run all tests
npm run test

# Run a test with tag
npm run tag -- '@tag_name'
```

## 🛠️ Environment Variables (.env)

```env
#### 🌐 Execution Environment
RUN_ENV=                   # Target environment for test execution (e.g., qa, prod, staging)

#### 🧪 Execution Mode
RUN_REMOTE=                # Set to true to run tests remotely via BrowserStack; false for local execution
DEVICE=                    # Device profile to use (e.g., desktop, mobile, tablet)

#### 🌍 BrowserStack Integration
BROWSERSTACK_USERNAME=     # Your BrowserStack username
BROWSERSTACK_ACCESS_KEY=   # Your BrowserStack access key
BUILD_NAME=                # Optional: name of the build shown in BrowserStack dashboard
PROJECT_NAME=              # Optional: name of the project shown in BrowserStack dashboard

#### 🔗 Azure DevOps Integration
AZURE_HOST=                # Azure DevOps host URL
AZURE_ORGANIZATION=        # Azure DevOps organization name
AZURE_PROJECT=             # Azure DevOps project name
AZURE_TOKEN=               # Personal Access Token (PAT) for Azure DevOps API

#### 📸 Visual Integration with Percy
ENABLE_PERCY=true          # Enables automatic visual comparison with Percy
PERCY_TOKEN=               # Percy project authentication token
```

---

## 🔗 Azure DevOps Integration

For full details on how to link tests to Azure DevOps Test Plans and publish results automatically, see the [Azure DevOps: Test Plan Guide](./docs/english/azure-devops.md).

---

## 🌐 Running Tests on BrowserStack

To learn how to run Playwright tests on real browsers and devices using BrowserStack, refer to the [BrowserStack Execution Guide](./docs/english/browserstack.md).

---

## 📸 Visual Testing with Percy

This project uses [Percy](https://percy.io/) for automated visual testing, helping detect unexpected changes in the application's interface during Playwright test execution.  
For detailed setup and usage instructions, see the [Percy Execution Guide](./docs/english/percy.md).

---

## 📦 Docker + Prometheus Integration

This project uses [Docker](https://www.docker.com/) to orchestrate a monitoring stack that includes [Prometheus](https://prometheus.io/) for collecting test metrics and [Grafana](https://grafana.com/) for visualizing them in real time.  
Playwright test executions expose metrics such as duration, retries, and failure rates, which are scraped by Prometheus and displayed in Grafana dashboards.  
For detailed setup and usage instructions, see the [Grafana Guide](./docs/english/grafana.md).

---

## 📂 Project Structure

```bash
valentino-magic-beans/
├── .github/                             # GitHub configuration
│   └── workflows/                       # CI/CD workflows
│       └── playwright.yml              # Playwright test pipeline using GitHub Actions
├── .husky/                              # Git hooks managed by Husky
│   ├── commit-message                  # Hook for commit message validation
│   ├── push.js                         # Custom push hook script
│   └── _/                              # Internal Husky scripts and hook definitions
├── docs/                                # Project documentation
│   ├── english/                         # English-language documentation and guides
│   └── portuguese/                      # Portuguese-language documentation and guides
├── infra/
│   └── dashboards/                      # Monitoring setup for Playwright test metrics
│       └── grafana-playwright.json      # Defines services: Prometheus, Grafana, and Playwright test runner
│   └── monitoring/                      # Monitoring setup for Playwright test metrics
│       ├── Dockerfile                  # Builds the container that runs tests and exposes metrics
│       ├── startMetrics.ts             # Executes tests and records metrics for Prometheus
│       ├── metricsServer.ts            # Express server that defines and exposes Prometheus metrics
│       ├── metricsInstance.ts          # Instantiates and starts the metrics server
│       ├── prometheus.yml              # Prometheus scrape configuration for collecting metrics
│       └── docker-compose.yml          # Defines services: Prometheus, Grafana, and Playwright test runner
├── src/                                 # Source code
│   ├── core/                            # Core test lifecycle and execution logic
│   │   ├── hooks.ts                    # Global test hooks (beforeAll, beforeEach, etc.)
│   │   └── remoteRunner.ts            # Handles local vs remote (BrowserStack) execution
│   ├── integrations/                    # External service integrations
│   │   ├── azure/                      # Azure DevOps integration layer
│   │   │   ├── AzureAttachmentService.ts   # Publishes test evidence (logs, screenshots) to Azure DevOps
│   │   │   ├── AzureAuthService.ts         # Generates base64 PAT token for Azure API authentication
│   │   │   ├── AzureConfigService.ts       # Loads Azure config from environment variables
│   │   │   ├── AzureTestCaseService.ts     # Manages test case lifecycle in Azure (activate, finish, update status)
│   │   │   ├── TestIdExtractor.ts          # Extracts test case ID from test title using @[12345]
│   │   │   ├── TestMetadataParser.ts       # Parses planId, suiteId, testCaseId from test title annotations
│   │   │   └── models/                     # Data models for Azure DevOps API payloads
│   │   │       ├── Attachment.ts           # Represents a base64-encoded file attachment
│   │   │       ├── Results.ts              # Encapsulates test outcome code (passed, failed, etc.)
│   │   │       ├── ResultTestCase.ts       # Payload for submitting test result updates
│   │   │       └── TestCaseActive.ts       # Payload for activating a test point before execution
│   │   ├── browserstack/              # BrowserStack integration layer
│   │   │   ├── browserstackStatus.ts       # Updates test status on BrowserStack
│   │   │   └── endpointBuilder.ts          # Builds WebSocket endpoint for remote execution
│   │   │   └── lighthouseExecutor.ts          # Initializes and manages Lighthouse WebSocket server for remote audits
│   │   └── percy/                     # Percy visual testing integration
│   │       └── percyService.ts            # Captures visual snapshots during test execution
│   ├── pages/                           # Page Object Model (POM) definitions
│   │   ├── HomePage.ts                  # Page object for the home page
│   │   └── LoginPage.ts                 # Page object for the login page
│   ├── resources/                       # Test data and configuration files
│   │   ├── config/                     # Environment URLs and capabilities
│   │   │   ├── url-prod.yml             # Base URL for production environment
│   │   │   ├── url-qa.yml               # Base URL for QA environment
│   │   │   └── capabilities/            # Browser/device capabilities for BrowserStack
│   │   │       ├── desktop.yml
│   │   │       └── mobile.yml
│   │   └── data/                       # Test data per environment
│   │       ├── prod/
│   │       │   └── credencial.yml       # Credentials for production tests
│   │       └── qa/
│   │           └── credencial.yml       # Credentials for QA tests
│   ├── selectors/                       # Element selectors used in page objects
│   │   ├── HomeSelectors.ts             # Selectors for home page elements
│   │   └── LoginSelectors.ts            # Selectors for login page elements
│   └── utils/                           # Utility functions and shared logic
│       ├── actions.ts                  # High-level element actions (click, type, etc.)
│       ├── asserts.ts                  # Custom assertion helpers
│       ├── highlightElement.ts         # Visual highlight for debugging elements
│       ├── logger.ts                   # Winston-based logging utility
│       └── yamlReader.ts               # Reads YAML config and test data
├── tests/                               # Automated test scenarios
│   ├── e2e/                             # Functional end-to-end tests using Playwright and Percy for visual snapshots
│   └── performance/                     # Performance audits powered by Lighthouse                 
├── .env                                 # Environment variable definitions
├── .gitignore                           # Files and folders to exclude from Git
├── changelog.config.js                  # Changelog generation config (e.g., for commitlint)
├── CHANGELOG.md                         # Version history and notable changes across releases
├── package-lock.json                    # npm lock file for reproducible installs
├── package.json                         # Project dependencies and scripts
├── playwright.config.ts                 # Playwright test runner configuration
├── README.md                            # Project documentation
├── tsconfig.json                        # TypeScript compiler configuration
├── winston.log                          # Log file generated by Winston logger
```

## 🔗 Useful Links
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Node.js Official Site](https://nodejs.org/)
- [Percy Integration for Playwright](https://docs.percy.io/docs/playwright)
- [Percy Dashboard](https://percy.io/)
- [Allure Report for Playwright](https://github.com/allure-framework/allure-playwright)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [BrowserStack Automate for Playwright](https://www.browserstack.com/docs/automate/playwright)
- [Azure DevOps Test Plans](https://learn.microsoft.com/azure/devops/testplans/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Hub Docker](https://hub.docker.com/)
- [Winston Logger](https://amirmustafaofficial.medium.com/winston-production-level-logger-in-javascript-b77548044764)