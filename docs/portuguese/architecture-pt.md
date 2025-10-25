## 📐 Arquitetura da Automação

```plaintext
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        CI/CD e Configuração do Projeto                                         │
│                                                                                                │
│  .github/workflows/playwright.yml   → Pipeline com GitHub Actions (Playwright, Percy, Allure)  │
│  .husky/                            → Hooks de Git para validação de commit e push             │
│  .env                               → Definições de variáveis de ambiente                      │
│  changelog.config.js               → Configuração de changelog convencional                    │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                  Camada de Execução e Orquestração de Testes               │
│                                                                            │
│  playwright.config.ts         → Configuração do runner Playwright          │
│  src/core/hooks.ts            → Hooks globais de teste (setup/teardown)    │
│  src/core/remoteRunner.ts     → Alterna entre execução local e remota      │   
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌───────────────────────────────────────────────────────────────────────────────────────┐
│                   Integrações com Serviços Externos                                   │
│                                                                                       │
│  src/integrations/browserstack/ → Execução remota e auditorias com Lighthouse         │
│  src/integrations/azure/        → Ciclo de vida de testes e publicação de evidências  │  
│  src/integrations/percy/        → Captura de snapshots visuais com Percy              │
└───────────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                      Camada de Page Object Model (POM)                     │
│                                                                            │
│  src/pages/                   → Objetos de página para Login e Home        │   
│  src/selectors/              → Seletores de elementos usados nos testes    │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────────┐
│              Configuração de Testes e Gerenciamento de Dados                   │
│                                                                                │
│  src/resources/config/       → URLs por ambiente e capacidades do BrowserStack │  
│  src/resources/data/         → Credenciais específicas por ambiente            │
│  src/utils/yamlReader.ts     → Leitor de arquivos YAML para configs e dados    │
└────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                  Utilitários e Suporte Técnico aos Testes                  │
│                                                                            │
│  src/utils/actions.ts        → Ações de alto nível sobre elementos         │
│  src/utils/asserts.ts        → Asserções customizadas                      │
│  src/utils/logger.ts         → Logging estruturado com Winston             │
│  src/utils/highlightElement.ts → Destaque visual de elementos para debug   │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                    Cenários Automatizados de Testes                        │
│                                                                            │
│  tests/e2e/                  → Testes funcionais end-to-end com Percy      │
│  tests/performance/         → Auditorias de performance com Lighthouse     │
└────────────────────────────────────────────────────────────────────────────┘

        ↓

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                  Camada de Monitoramento e Observabilidade                          │
│                                                                                     │
│  infra/monitoring/           → Servidor de métricas Prometheus e container de testes│
│     ├── metricsServer.ts     → Define e expõe métricas para Prometheus              │
│     ├── startMetrics.ts      → Executa testes e registra métricas                   │ 
│     ├── prometheus.yml       → Configuração de scrape do Prometheus                 │
│     ├── docker-compose.yml   → Serviços: Prometheus, Grafana, Playwright            │
│     └── Dockerfile           → Build do container de métricas                       │
│  infra/dashboards/           → Dashboard do Grafana em JSON para visualização       │
└─────────────────────────────────────────────────────────────────────────────────────┘

        ↓

┌────────────────────────────────────────────────────────────────────────────┐
│                  Documentação e Base de Conhecimento do Projeto            │
│                                                                            │
│  docs/english/              → Guias e documentação em inglês               │
│  docs/portuguese/           → Guias e documentação em português            │
│  README.md                  → Visão geral e instruções de uso do projeto   │
│  CHANGELOG.md               → Histórico de versões e mudanças relevantes   │
└────────────────────────────────────────────────────────────────────────────┘
```

### 🧠 Destaques arquitetônicos
- **Design modular:** Cada camada é isolada e testável de forma independente.
- **Escalabilidade:** Fácil de estender para novos ambientes, integrações ou fluxos de teste.
- **Observabilidade:** Métricas, logs e snapshots visuais em tempo real.
- **Portabilidade:** Suporte para execução local, remota e CI/CD com configuração mínima.
- **Manutenibilidade:** Estrutura clara e convenções de nome facilitam onboarding e refatorações.