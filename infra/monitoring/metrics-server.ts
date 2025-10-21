import express, { Request, Response } from 'express';
import { Counter, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

/**
 * MetricsServer expõe métricas Prometheus para monitoramento dos testes automatizados.
 * As métricas são acessíveis via endpoint HTTP e podem ser consumidas por Prometheus.
 */
export class MetricsServer {
  private app = express(); // Instância do servidor Express
  private register: Registry; // Registro de métricas personalizado
  private port: number; // Porta de escuta do servidor

  public testDuration: Gauge; // Métrica para duração dos testes
  public testFailures: Counter; // Métrica para contagem de falhas

  /**
   * Inicializa o servidor de métricas e define as métricas customizadas.
   * @param port Porta para expor o endpoint /metrics (default: 9464)
   */
  constructor(port = 9464) {
    this.port = port;
    this.register = new Registry();

    // Coleta métricas padrão do Node.js (heap, event loop, etc.)
    collectDefaultMetrics({ register: this.register });

    // Define métrica de duração dos testes
    this.testDuration = new Gauge({
      name: 'playwright_test_duration_seconds',
      help: 'Duration of Playwright tests in seconds',
      registers: [this.register],
    });

    // Define métrica de falhas nos testes
    this.testFailures = new Counter({
      name: 'playwright_test_failures_total',
      help: 'Total number of failed Playwright tests',
      registers: [this.register],
    });

    this.setupRoutes();
  }

  /**
   * Define as rotas HTTP para expor as métricas.
   * Endpoint principal: GET /metrics
   */
  private setupRoutes(): void {
    this.app.get('/metrics', async (_req: Request, res: Response) => {
      res.set('Content-Type', this.register.contentType);
      res.end(await this.register.metrics());
    });
  }

  /**
   * Inicia o servidor HTTP na porta configurada.
   * Exibe log com a URL de acesso ao endpoint de métricas.
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Metrics server running on http://localhost:${this.port}/metrics`);
    });
  }
}