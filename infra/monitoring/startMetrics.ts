const express = require('express');
const promClient = require('prom-client');
const { exec } = require('child_process');
const { Logger } = require('../../src/utils/logger');

/**
 * StartMetrics handles Playwright test execution and exposes Prometheus metrics via HTTP.
 */
class StartMetrics {
  private app = express();
  private port = 9464;
  private testDurationGauge: InstanceType<typeof promClient.Gauge>;

  constructor() {
    this.testDurationGauge = new promClient.Gauge({
      name: 'playwright_test_duration_seconds',
      help: 'Duration of Playwright tests in seconds',
      labelNames: ['test'],
    });

    this.setupRoutes();
  }

  /**
   * Defines the /metrics endpoint for Prometheus to scrape.
   */
  private setupRoutes(): void {
    this.app.get('/metrics', async (_req: any, res: any) => {
      Logger.info('[StartMetrics] /metrics endpoint accessed');
      res.setHeader('Content-Type', promClient.register.contentType);
      res.end(await promClient.register.metrics());
    });
  }

  /**
   * Starts the HTTP server and triggers Playwright test execution.
   */
  public start(): void {
    this.app.listen(this.port, '0.0.0.0', () => {
      Logger.info(`[StartMetrics] Metrics server running on port ${this.port}`);
      this.runTests();
    });

    // Keeps the process alive after test execution
    setInterval(() => {}, 1000);
  }

  /**
   * Executes Playwright tests and updates the duration metric.
   */
  private runTests(): void {
    Logger.info('[StartMetrics] Starting Playwright tests...');
    const start = Date.now();

    exec('npx playwright test', (err, stdout, stderr) => {
      const durationSeconds = (Date.now() - start) / 1000;
      this.testDurationGauge.set({ test: 'all' }, durationSeconds);
      Logger.info(`[StartMetrics] Test duration recorded: ${durationSeconds.toFixed(2)}s`);

      if (err) {
        Logger.error('[StartMetrics] Error during test execution');
        Logger.error(`[StartMetrics] Details: ${err.message}`);
      }

      if (stdout) Logger.info('[StartMetrics] Test output:\n' + stdout);
      if (stderr) Logger.warn('[StartMetrics] Test stderr:\n' + stderr);
    });
  }
}

// Start the server immediately
new StartMetrics().start();