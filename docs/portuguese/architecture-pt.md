## 📐 Arquitetura da Automação

```plaintext
┌────────────────────────────────────────────────────────────────────────────┐
│                            CI/CD & Configuração                            │
│                                                                            │
│  .github/workflows/playwright.yml   → GitHub Actions (Percy + Allure)     │
│  .husky/                            → Git Hooks (commit, push)             │
│  .env                               → Variáveis de ambiente                │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Runner & Execução de Testes                       │
│                                                                            │
│  src/core/hooks.ts            → Hooks globais (setup/teardown)            │
│  src/core/remoteRunner.ts     → Alterna execução local/remota             │
│  playwright.config.ts         → Configuração do Playwright                │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                           Integrações com Serviços                         │
│                                                                            │
│  src/integrations/browserstack/ → Execução remota e status                │
│  src/integrations/azure/        → Evidências e status no Azure DevOps     │
│  src/integrations/percy/        → Captura de snapshots visuais            │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Page Object Model (POM)                           │
│                                                                            │
│  src/pages/LoginPage.ts        → Fluxo de login                           │
│  src/pages/HomePage.ts         → Pós-login e logout                       │
│  src/selectors/                → Seletores de elementos                   │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                    Configuração e Dados de Teste                           │
│                                                                            │
│  src/resources/config/         → URLs e capacidades                       │
│  src/resources/data/           → Credenciais por ambiente                 │
│  src/utils/yamlReader.ts       → Leitura de arquivos YAML                 │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                        Utilitários e Suporte Técnico                       │
│                                                                            │
│  src/utils/actions.ts          → Ações em elementos                       │
│  src/utils/asserts.ts          → Asserções customizadas                   │
│  src/utils/logger.ts           → Logging estruturado                      │
│  src/utils/highlightElement.ts → Destaque visual para debug               │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                          Testes Automatizados                              │
│                                                                            │
│  tests/login.spec.ts           → Cenário de login                         │
└────────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Destaques arquitetônicos

- Cada camada é modular e desacoplada, facilitando manutenção e escalabilidade.
- As integrações são plugáveis, permitindo ativação condicional via `.env`.
- O fluxo CI/CD garante rastreabilidade visual (Percy), funcional (Playwright) e analítica (Allure).
- O modelo POM promove reutilização e clareza na escrita dos testes.