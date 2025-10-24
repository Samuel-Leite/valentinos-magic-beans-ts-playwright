# 📦 Docker + Prometheus Integration

This project integrates **Prometheus monitoring** with **Playwright test automation** using Docker.  
It exposes custom metrics from test executions and visualizes them via Grafana dashboards.

---

## 📘 Table of Contents

- [🎯 Purpose](#-purpose)
- [⚙️ How It Works](#️-how-it-works)
- [📂 Project Structure](#-project-structure)
- [🛠️ Core Components](#-core-components)
  - [`Dockerfile`](#dockerfile)
  - [`docker-compose.yml`](#docker-composeyml)
  - [`startMetrics.ts`](#startmetricsts)
  - [`metricsServer.ts`](#metricsserverts)
  - [`metricsInstance.ts`](#metricsinstancets)
  - [`prometheus.yml`](#prometheusyml)
- [🧯 Docker Commands](#-docker-commands)
- [📄 Source Files](#-source-files)

---

## 🎯 Purpose

- Run Playwright tests inside a containerized environment  
- Expose test metrics via `/metrics` endpoint  
- Scrape metrics with Prometheus  
- Visualize results in Grafana dashboards  
- Enable observability for test performance and reliability

---

## ⚙️ How It Works

1. The `tests` service runs Playwright tests and exposes metrics via `prom-client`.
2. Prometheus scrapes metrics from `http://tests:9464/metrics` every 5 seconds.
3. Grafana connects to Prometheus and displays dashboards.
4. Metrics include test duration, status, retries, failures, environment, and group.

---

## 📂 Project Structure

```bash
infra/
│├── monitoring/
││     ├── Dockerfile
││     ├── startMetrics.ts
││     ├── metricsServer.ts
││     ├── metricsInstance.ts
││     └── prometheus.yml
││     └── docker-compose.yml
```

---

## 🛠️ Core Components

### `Dockerfile`

Builds the container that runs Playwright tests and exposes metrics.

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

Defines services for Prometheus, Grafana, and Playwright tests.

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

Runs Playwright tests and records metrics.
- Captures duration, status, retries, failures, environment, and group
- Exposes `/metrics` endpoint for Prometheus
- Uses `prom-client` and `child_process.exec`

### `metricsServer.ts`

Alternative server for exposing metrics without running tests.
- Defines `Gauge` and `Counter` metrics
- Serves metrics via Express


### `metricsInstance.ts`

Instantiates and starts the metrics server.

```ts
import { MetricsServer } from './metricsServer';

export const metrics = new MetricsServer();
metrics.start(); // starts with tests
```

### `prometheus.yml`

Prometheus scrape configuration.

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

## 🧯 Docker Commands

### 🔨 Build image (only once or after changes)

```bash
docker-compose build tests
```

### ▶️ Start containers
```bash
docker-compose up -d
```
Starts Prometheus, Grafana, and Playwright in the background

### 🛑 Stop containers (without deleting)
```bash
docker-compose stop
```
Shuts down all services but keeps volumes and images

### 🔁 Restart containers (no rebuild)
```bash
docker-compose restart
```
Useful after changing environment variables or configs

### 🧹 Remove containers (keep volumes and images)
```bash
docker-compose down
```
Stops and removes containers, but keeps persistent data

### 💣 Remove everything (containers + volumes + images)
```bash
docker-compose down --volumes --rmi all
```
⚠️ Use with caution — this deletes all related data

---

## 📄 Source Files

- [`docker-compose.yml`](../../infra/monitoring/docker-compose.yml)
- [`Dockerfile`](../../infra/monitoring/Dockerfile)
- [`metricsInstance.ts`](../../infra/monitoring/metricsInstance.ts)
- [`metricsServer.ts`](../../infra/monitoring/metricsServer.ts)
- [`prometheus.yml`](../../infra/monitoring/prometheus.yml)
- [`startMetrics.ts`](../../infra/monitoring/startMetrics.ts)