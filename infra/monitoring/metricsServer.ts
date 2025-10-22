import express, { Request, Response } from 'express';
import { Counter, Gauge, Registry, collectDefaultMetrics } from 'prom-client';
import { Logger } from '../../src/utils/logger.ts'; 

/**
 * MetricsServer handles Prometheus metric exposure for monitoring automated test executions.
 * Metrics are served via an HTTP endpoint and consumed by Prometheus.
 */
export class MetricsServer {
  private app = express(); // Express server instance
  private register: Registry; // Custom metrics registry
  private port: number; // Server listening port

  public testDuration: Gauge; // Metric for test duration
  public testFailures: Counter; // Metric for test failure count

  /**
   * Initializes the metrics server and defines custom metrics.
   * @param port - Port to expose the /metrics endpoint (default: 9464)
   */
  constructor(port = 9464) {
    this.port = port;
    this.register = new Registry();

    collectDefaultMetrics({ register: this.register });
    Logger.info(`[MetricsServer] Default Node.js metrics registered.`);

    this.testDuration = new Gauge({
      name: 'playwright_test_duration_seconds',
      help: 'Duration of Playwright tests in seconds',
      registers: [this.register],
    });

    this.testFailures = new Counter({
      name: 'playwright_test_failures_total',
      help: 'Total number of failed Playwright tests',
      registers: [this.register],
    });

    Logger.info(`[MetricsServer] Custom metrics initialized.`);

    this.setupRoutes();
  }

  /**
   * Defines HTTP routes to expose metrics.
   * Main endpoint: GET /metrics
   */
  private setupRoutes(): void {
    this.app.get('/metrics', async (_req: Request, res: Response) => {
      Logger.info(`[MetricsServer] /metrics endpoint accessed.`);
      res.set('Content-Type', this.register.contentType);
      res.end(await this.register.metrics());
    });
  }

  /**
   * Starts the HTTP server on the configured port.
   * Logs the endpoint URL for visibility.
   */
  public start(): void {
    this.app.listen(this.port, () => {
      Logger.info(`[MetricsServer] Server running at http://localhost:${this.port}/metrics`);
    });
  }
}