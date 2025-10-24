# 📦 Integração Docker + Prometheus

Este projeto integra o **monitoramento com Prometheus** à **automação de testes com Playwright** usando Docker.  
Ele expõe métricas personalizadas das execuções de testes e as visualiza em painéis do Grafana.

---

## 📘 Índice

- [🎯 Propósito](#-propósito)
- [⚙️ Como Funciona](#️-como-funciona)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Componentes Principais](#-componentes-principais)
  - [`Dockerfile`](#dockerfile)
  - [`docker-compose.yml`](#docker-composeyml)
  - [`startMetrics.ts`](#startmetricsts)
  - [`metricsServer.ts`](#metricsserverts)
  - [`metricsInstance.ts`](#metricsinstancets)
  - [`prometheus.yml`](#prometheusyml)
- [🧯 Comandos Docker](#-comandos-docker)
- [📄 Arquivos Fonte](#-arquivos-fonte)

---

## 🎯 Propósito

- Executar testes Playwright em um ambiente containerizado  
- Expor métricas de testes via endpoint `/metrics`  
- Coletar métricas com Prometheus  
- Visualizar resultados em painéis do Grafana  
- Habilitar observabilidade sobre desempenho e confiabilidade dos testes

---

## ⚙️ Como Funciona

1. O serviço `tests` executa os testes Playwright e expõe métricas via `prom-client`.
2. O Prometheus coleta métricas de `http://tests:9464/metrics` a cada 5 segundos.
3. O Grafana se conecta ao Prometheus e exibe os painéis.
4. As métricas incluem duração dos testes, status, tentativas, falhas, ambiente e grupo.

---

## 📂 Estrutura do Projeto

```bash
infra/
├── dashboards/
│   └── grafana-playwright.json
├── monitoring/
│   ├── Dockerfile
│   ├── startMetrics.ts
│   ├── metricsServer.ts
│   ├── metricsInstance.ts
│   ├── prometheus.yml
│   └── docker-compose.yml
```

├── infra/
│   


---

## 🛠️ Componentes Principais

### `Dockerfile`

Constrói o container que executa os testes Playwright e expõe métricas.

```dockerfile
FROM mcr.microsoft.com/playwright:v1.55.0-jammy
WORKDIR /app
COPY ../../package*.json ./
COPY ../../playwright.config.ts .env tsconfig.json ./
COPY ../../src ./src
COPY ../../tests ./tests
COPY ../../infra ./infra
RUN npm install
EXPOSE 9464
CMD ["npx", "ts-node", "--project", "tsconfig.json", "infra/monitoring/startMetrics.ts"]
```

### `docker-compose.yml`

Define os serviços para Prometheus, Grafana e testes Playwright.

```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus

  tests:
    build:
      context: ../..
      dockerfile: infra/monitoring/Dockerfile
    ports:
      - "9464:9464"
    environment:
      - ENV=qa
    depends_on:
      - prometheus
```

### `startMetrics.ts`

Executa os testes Playwright e registra métricas.
- Captura duração, status, tentativas, falhas, ambiente e grupo
- Expõe o endpoint `/metrics` para o Prometheus
- Utiliza `prom-client` e `child_process.exec`

### `metricsServer.ts`

Servidor alternativo para expor métricas sem executar testes.
- Define métricas do tipo `Gauge` e `Counter`
- Serve métricas via Express


### `metricsInstance.ts`

Instancia e inicia o servidor de métricas.

```ts
import { MetricsServer } from './metricsServer';

export const metrics = new MetricsServer();
metrics.start(); // inicia com os testes
```

### `prometheus.yml`

Configuração de coleta do Prometheus.

```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'playwright-tests'
    metrics_path: /metrics
    static_configs:
      - targets: ['tests:9464']
```

---

## 🧯 Comandos Docker

### 🔨 Construir imagem (uma vez ou após alterações)

```bash
docker-compose build tests
docker-compose build
```

### ▶️ Iniciar containers
```bash
docker-compose up -d
```
Inicia Prometheus, Grafana e Playwright em segundo plano

### 🛑 Parar containers (sem excluir)
```bash
docker-compose stop
```
Desliga todos os serviços, mantendo volumes e imagens

### 🔁 Reiniciar containers (sem reconstruir)
```bash
docker-compose restart
```
Útil após alterações em variáveis de ambiente ou configurações

### 🧹 Remover containers (mantendo volumes e imagens)
```bash
docker-compose down
```
Desliga e remove containers, mas mantém dados persistentes

### 💣 Remover tudo (containers + volumes + imagens)
```bash
docker-compose down --volumes --rmi all
```
⚠️ Use com cautela — isso apaga todos os dados relacionados

---

## 📄 Arquivos Fonte

- [`docker-compose.yml`](../../infra/monitoring/docker-compose.yml)
- [`Dockerfile`](../../infra/monitoring/Dockerfile)
- [`metricsInstance.ts`](../../infra/monitoring/metricsInstance.ts)
- [`metricsServer.ts`](../../infra/monitoring/metricsServer.ts)
- [`prometheus.yml`](../../infra/monitoring/prometheus.yml)
- [`startMetrics.ts`](../../infra/monitoring/startMetrics.ts)
- [`grafana-playwright.json`](../../infra/dashboards/grafana-playwright.json)