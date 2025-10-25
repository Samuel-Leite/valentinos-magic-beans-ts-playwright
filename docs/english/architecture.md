## 📐 Automation Architecture

```plaintext
┌────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD & Configuration                             │
│                                                                            │
│  .github/workflows/playwright.yml   → GitHub Actions pipeline (Playwright, Percy, Allure)  
│  .husky/                            → Git hooks for commit and push validation  
│  .env                               → Environment variable definitions  
│  changelog.config.js               → Conventional changelog setup  
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                        Test Runner & Execution Layer                        │
│                                                                            │
│  playwright.config.ts         → Playwright test runner configuration  
│  src/core/hooks.ts            → Global test hooks (setup/teardown)  
│  src/core/remoteRunner.ts     → Switches between local and remote execution  
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌───────────────────────────────────────────────────────────────────────────────────────┐
│                          External Service Integrations                                │
│                                                                                       │
│  src/integrations/browserstack/ → Remote execution and Lighthouse audits              │
│  src/integrations/azure/        → Azure DevOps test lifecycle and evidence publishing │  
│  src/integrations/percy/        → Visual snapshot capture with Percy                  │
└───────────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                         Page Object Model (POM) Layer                      │
│                                                                            │
│  src/pages/                   → Page objects for Login and Home flows      │   
│  src/selectors/              → Element selectors for each page             │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────────┐
│                    Test Configuration & Data Management                        │
│                                                                                │
│  src/resources/config/       → Environment URLs and capabilities (BrowserStack)|  
│  src/resources/data/         → Environment-specific test credentials           |
│  src/utils/yamlReader.ts     → YAML file reader for config and data            |
└────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Utilities & Technical Support                     │
│                                                                            │
│  src/utils/actions.ts        → High-level element actions                  │ 
│  src/utils/asserts.ts        → Custom assertions                           │
│  src/utils/logger.ts         → Winston-based structured logging            │
│  src/utils/highlightElement.ts → Visual element highlighting for debugging │  
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Automated Test Scenarios                          │
│                                                                            │
│  tests/e2e/                  → Functional end-to-end tests with Percy      │
│  tests/performance/         → Performance audits powered by Lighthouse     │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          Monitoring & Observability Layer                           │
│                                                                                     │
│  infra/monitoring/           → Prometheus metrics server and test runner container  │
│     ├── metricsServer.ts     → Defines and exposes Prometheus metrics               │
│     ├── startMetrics.ts      → Executes tests and records metrics                   │ 
│     ├── prometheus.yml       → Prometheus scrape configuration                      │
│     ├── docker-compose.yml   → Services: Prometheus, Grafana, Playwright            │
│     └── Dockerfile           → Builds metrics container                             │
│  infra/dashboards/           → Grafana dashboard JSON for test metrics              │
└─────────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Documentation & Knowledge Base                    │
│                                                                            │
│  docs/english/              → English-language guides and documentation    │
│  docs/portuguese/           → Portuguese-language guides and documentation │  
│  README.md                  → Project overview and setup instructions      │ 
│  CHANGELOG.md               → Version history and release notes            │
└────────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Architectural Highlights
- **Modular Design:** Each layer is isolated and independently testable.
- **Scalability:** Easily extendable to new integrations, environments, or test flows.
- **Observability:** Real-time metrics, logs, and visual snapshots for deep insight.
- **Portability:** Supports local, remote, and CI/CD execution with minimal setup.
- **Maintainability:** Clear structure and naming conventions simplify onboarding and refactoring.