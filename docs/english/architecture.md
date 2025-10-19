## 📐 Automation Architecture

```plaintext
┌────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD & Configuration                             │
│                                                                            │
│  .github/workflows/playwright.yml   → GitHub Actions (Percy + Allure)     │
│  .husky/                            → Git Hooks (commit, push)             │
│  .env                               → Environment variables                │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                        Test Runner & Execution Layer                        │
│                                                                            │
│  src/core/hooks.ts            → Global hooks (setup/teardown)             │
│  src/core/remoteRunner.ts     → Switches between local and remote runs    │
│  playwright.config.ts         → Playwright configuration                  │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          External Service Integrations                     │
│                                                                            │
│  src/integrations/browserstack/ → Remote execution and session status     │
│  src/integrations/azure/        → Evidence publishing and test status     │
│  src/integrations/percy/        → Visual snapshot capture with Percy      │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                         Page Object Model (POM) Layer                      │
│                                                                            │
│  src/pages/LoginPage.ts        → Login flow                               │
│  src/pages/HomePage.ts         → Post-login and logout                    │
│  src/selectors/                → Element selectors                        │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                    Test Configuration & Data Management                    │
│                                                                            │
│  src/resources/config/         → URLs and capabilities                    │
│  src/resources/data/           → Environment-specific credentials         │
│  src/utils/yamlReader.ts       → YAML file reader                         │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Utilities & Technical Support                     │
│                                                                            │
│  src/utils/actions.ts          → High-level element actions               │
│  src/utils/asserts.ts          → Custom assertions                        │
│  src/utils/logger.ts           → Structured logging with Winston          │
│  src/utils/highlightElement.ts → Visual element highlighting for debugging│
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Automated Test Scenarios                          │
│                                                                            │
│  tests/login.spec.ts           → Login test case                          │
└────────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Architectural Highlights
- Modular Design: Each layer is isolated and independently testable.
- Scalability: Easily extendable to new integrations, environments, or test flows.
- Observability: Logs, visual snapshots, and test statuses are tracked in real time.
- Portability: Supports local, remote, and CI/CD execution with minimal configuration.
- Maintainability: Clear structure and naming conventions simplify onboarding and refactoring.