
<div align="center">
  <img src="https://playwright.dev/img/playwright-logo.svg" alt="Playwright Logo" width="120" />
  <h1>Valentino's Magic Beans - Playwright Automation</h1>
  <p>
    <strong>Projeto do curso de automação com Playwright</strong><br>
    Testes end-to-end modernos para aplicações web.
  </p>
  <br>
</div>
<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Playwright-2ead33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI" />
  <img src="https://img.shields.io/badge/Coverage-100%25-success?style=for-the-badge" alt="Coverage" />
</div>
## 📦 Requisitos

- Node.js >= 18
- npm >= 9
- Playwright >= 1.40

## 🚀 Objetivo

Este projeto tem como objetivo validar funcionalidades críticas da aplicação web Valentinos Magic Beans por meio de testes automatizados robustos, rastreáveis e escaláveis.

## 📄 Licença

Este projeto está sob licença MIT.

---

## 🚀 Sobre o Projeto

Este repositório contém uma aplicação de automação de testes end-to-end utilizando <a href="https://playwright.dev/">Playwright</a>, desenvolvida durante o curso de automação. O objetivo é demonstrar como criar, organizar e executar testes automatizados em aplicações web reais.

## 📚 Principais Recursos
- Testes E2E com Playwright e TypeScript
- Fluxo completo de compra como usuário convidado
- Validação de produtos, preços, e status de pedidos
- Estrutura modular e fácil de manter

## 🛠️ Como Executar

```bash
# Instale as dependências
npm install

# Execute todos os testes
npx playwright test

# Execute um teste específico
npx playwright test tests/e2e/brazilian-coffee-order.spec.ts
```

## 📂 Estrutura do Projeto

```
valentino-magic-beans/
├── tests/
│   ├── e2e/
├── playwright.config.ts
├── package.json
└── README.md
```


## 🔗 Links Úteis

- [Documentação Playwright](https://playwright.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)