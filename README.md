<div align="center"><img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" /><h1>Valentino's Magic Beans - Playwright Automation</h1><p><strong>Project developed during the Playwright automation course</strong><br>Modern end-to-end testing for real-world web applications.</p><br></div>
<div align="center"><img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /><img src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" /><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /><img src="https://img.shields.io/badge/Husky-hooks-critical?style=for-the-badge&logo=git&logoColor=white" alt="Husky" /><img src="https://img.shields.io/badge/ESLint-code%20quality-blueviolet?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" /><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" /><img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI" /><img src="https://img.shields.io/badge/Coverage-100%25-success?style=for-the-badge" alt="Coverage" /></div>

## 📦 Requirements
- Node.js
- Playwright
- TypeScript
- Husky
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

## 🛠️ How to run
```
# Install dependencies
npm install

# Run all tests
npm run test

# Run a test with tag
npm run tag -- '@tag_name'
```

## 🛠️ Environment Variables (.env)

```
RUN_ENV=                 # Environment name (e.g., qa, prod)
RUN_REMOTE=              # true to run tests on BrowserStack, false for local
DEVICE=desktop           # Device profile name (e.g., desktop, mobile, tablet)
BROWSERSTACK_USERNAME=   # Your BrowserStack username
BROWSERSTACK_ACCESS_KEY= # Your BrowserStack access key
BUILD_NAME=""            # Optional: name of the build shown in BrowserStack
PROJECT_NAME=""          # Optional: name of the project shown in BrowserStack
```

## 📂 Project Structure
```
valentino-magic-beans/
├── .github/
│   └── workflows/
│       └── playwright.yml         # Test pipeline using GitHub Actions
├── .husky/                        # Git hooks managed by Husky
│   ├── commit-message
│   ├── push.js
│   └── _/                         # Internal Husky scripts and hook definitions
├── src/                         # Test framework source code
│   ├── core/                    # Execution logic and shared hooks
│   │   ├── hooks.ts
│   │   └── remote.ts
│   ├── pages/                   # Page Object Models
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   ├── providers/               # External service integrations
│   │   └── browserstack.ts
│   ├── resources/               # Static configuration and test data
│   │   ├── config/              # Environment-specific URLs and capabilities
│   │   │   ├── url-prod.yml
│   │   │   ├── url-qa.yml
│   │   │   └── capabilities/    # Device/browser configurations
│   │   │       ├── desktop.yml
│   │   │       └── mobile.yml
│   │   └── data/                # Test credentials per environment
│   │       ├── prod/
│   │       │   └── credencial.yml
│   │       └── qa/
│   │           └── credencial.yml
│   ├── selectors/               # Centralized UI selectors
│   │   ├── HomeSelectors.ts
│   │   └── LoginSelectors.ts
│   └── utils/                   # Shared utility functions
│       ├── actions.ts
│       ├── asserts.ts
│       ├── highlightElement.ts
│       ├── logger.ts
│       └── yamlReader.ts
├── tests/                       # Test scenarios
│   └── login.spec.ts
├── .env                         # Environment variable definitions
├── .gitignore                   # Files and folders to exclude from Git
├── changelog.config.js           # Changelog configuration
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # npm lock file
├── playwright.config.ts          # Playwright configuration
├── winston.log                   # Log file generated by Winston
├── README.md                     # Project documentation
```

## 🔗 Useful Links
- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)