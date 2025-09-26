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
npx playwright test

# Run a specific test
npx playwright test tests/e2e/brazilian-coffee-order.spec.ts
```

## 📂 Project Structure
```
valentino-magic-beans/
├── .github/
│   └── workflows/
│       └── playwright.yml   # Pipeline de testes com GitHub Actions
├── .husky/                  # Hooks de Git
│   ├── commit-message
│   ├── push.js
│   └── _/                   # Scripts internos do Husky
├── src/
│   ├── core/                # Hooks e lógica compartilhada
│   │   └── hooks.ts
│   ├── pages/               # Page Objects
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   ├── resources/
│   │   ├── config/          # URLs por ambiente
│   │   │   ├── url-prod.yml
│   │   │   └── url-qa.yml
│   │   └── data/            # Credenciais por ambiente
│   │       ├── prod/
│   │       │   └── credencial.yml
│   │       └── qa/
│   │           └── credencial.yml
│   ├── selectors/           # Selectors centralizados
│   │   ├── HomeSelectors.ts
│   │   └── LoginSelectors.ts
│   └── utils/               # Funções auxiliares
│       ├── actions.ts
│       ├── asserts.ts
│       ├── highlightElement.ts
│       ├── logger.ts
│       └── yamlReader.ts
└── tests/
    └── login.spec.ts        # Teste de login
├── .env                      # Variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo Git
├── changelog.config.js      # Configuração de changelog
├── package.json             # Dependências e scripts
├── package-lock.json        # Lockfile do npm
├── playwright.config.ts     # Configuração do Playwright
├── winston.log              # Log gerado pelos testes
├── README.md                # Documentação do projeto    
```

## 🔗 Useful Links
- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)