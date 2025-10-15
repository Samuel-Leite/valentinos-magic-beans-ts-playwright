<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Playwright Automation</h1>
  <p><strong>Project developed during the Playwright automation course</strong><br>Modern end-to-end testing for real-world web applications.</p><br>
</div>

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
</div>

## 📦 Requirements
- Node.js
- Playwright
- TypeScript
- Husky
- BrowserStack
- TestPlan - Azure DevOps
- Eslint e Prettier
- Logger Winston

## 🚀 Purpose
This project aims to validate critical functionalities of the Valentino's Magic Beans web application through robust, traceable, and scalable automated tests, with a strong focus on development best practices and code quality.

## 📄 License
This project is licensed under the MIT License.

---

## 🚀 About the Project
This repository contains an end-to-end test automation suite built with <a href="https://playwright.dev/">Playwright</a>, developed as part of an automation course. The goal is to demonstrate how to create, organize, and execute automated tests for real-world web applications.

## 📚 Key Features
- E2E testing with Playwright and TypeScript
- Full purchase flow as a guest user
- Validation of products, pricing, and order status
- Modular and maintainable structure
- Pre-commit hooks with Husky to ensure code quality
- CI environment setup with GitHub Actions
- Remote test execution via BrowserStack and local test execution
- Native integration with Azure DevOps Test Plans

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
```

---

## 🔗 Azure DevOps Integration

For full details on how to link tests to Azure DevOps Test Plans and publish results automatically, see the [Azure DevOps: Test Plan Guide](./docs/azure-devops.md).

---

## 🌐 Running Tests on BrowserStack

To learn how to run Playwright tests on real browsers and devices using BrowserStack, refer to the [BrowserStack Execution Guide](./docs/browserstack.md).

---

## 📂 Project Structure
```
valentino-magic-beans/
├── .github/                             # GitHub configuration
│   └── workflows/                       # CI/CD workflows
│       └── playwright.yml              # Playwright test pipeline using GitHub Actions
├── .husky/                              # Git hooks managed by Husky
│   ├── commit-message                  # Hook for commit message validation
│   ├── push.js                         # Custom push hook script
│   └── _/                              # Internal Husky scripts and hook definitions
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
│   │   └── browserstack/              # BrowserStack integration layer
│   │       ├── browserstackStatus.ts       # Updates test status on BrowserStack
│   │       └── endpointBuilder.ts          # Builds WebSocket endpoint for remote execution
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
├── tests/                               # Test scenarios
│   └── login.spec.ts                   # Login test case
├── .env                                 # Environment variable definitions
├── .gitignore                           # Files and folders to exclude from Git
├── changelog.config.js                  # Changelog generation config (e.g., for commitlint)
├── package.json                         # Project dependencies and scripts
├── package-lock.json                    # npm lock file for reproducible installs
├── playwright.config.ts                 # Playwright test runner configuration
├── winston.log                          # Log file generated by Winston logger
├── README.md                            # Project documentation
```

## 🔗 Useful Links
- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)