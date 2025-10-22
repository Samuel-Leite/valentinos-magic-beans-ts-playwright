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
  private testStatusCounter: InstanceType<typeof promClient.Counter>;
  private testRetryCounter: InstanceType<typeof promClient.Counter>;
  private testFailureCounter: InstanceType<typeof promClient.Counter>;
  private testDurationSummary: InstanceType<typeof promClient.Summary>;
  private testGroupCounter: InstanceType<typeof promClient.Counter>;
  private testEnvironmentGauge: InstanceType<typeof promClient.Gauge>;

  constructor() {
    this.testDurationGauge = new promClient.Gauge({
      name: 'playwright_test_duration_seconds',
      help: 'Duration of Playwright tests in seconds',
      labelNames: ['test'],
    });

    this.testStatusCounter = new promClient.Counter({
      name: 'playwright_test_total',
      help: 'Total number of tests by status',
      labelNames: ['status'],
    });

    this.testRetryCounter = new promClient.Counter({
      name: 'playwright_test_retry_total',
      help: 'Total number of test retries',
    });

    this.testFailureCounter = new promClient.Counter({
      name: 'playwright_test_failures_total',
      help: 'Total number of test failures by error type',
      labelNames: ['error'],
    });

    this.testDurationSummary = new promClient.Summary({
      name: 'playwright_test_avg_duration_seconds',
      help: 'Summary of test durations',
    });

    this.testGroupCounter = new promClient.Counter({
      name: 'playwright_test_group_total',
      help: 'Total number of tests by group',
      labelNames: ['group'],
    });

    this.testEnvironmentGauge = new promClient.Gauge({
      name: 'playwright_test_environment',
      help: 'Environment where tests are executed',
      labelNames: ['env'],
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
   * Executes Playwright tests and updates all relevant metrics.
   */
  private runTests(): void {
    Logger.info('[StartMetrics] Starting Playwright tests...');
    const start = Date.now();

    // Set environment label
    const environment = process.env.ENVIRONMENT || 'qa';
    this.testEnvironmentGauge.set({ env: environment }, 1);

    exec('npx playwright test tests/e2e', (err, stdout, stderr) => {
      const durationSeconds = (Date.now() - start) / 1000;
      this.testDurationGauge.set({ test: 'all' }, durationSeconds);
      this.testDurationSummary.observe(durationSeconds);
      Logger.info(`[StartMetrics] Test duration recorded: ${durationSeconds.toFixed(2)}s`);

      // Simulated group detection
      const group = 'e2e';
      this.testGroupCounter.inc({ group });

      if (err) {
        Logger.error('[StartMetrics] Error during test execution');
        Logger.error(`[StartMetrics] Details: ${err.message}`);
        this.testStatusCounter.inc({ status: 'failed' });

        const errorType = err.message.includes('timeout') ? 'timeout' :
                          err.message.includes('locator') ? 'locator-not-found' : 'other';
        this.testFailureCounter.inc({ error: errorType });

        // Simulated retry detection
        if (err.message.includes('Retry')) {
          this.testRetryCounter.inc();
        }
      } else {
        this.testStatusCounter.inc({ status: 'passed' });
      }

      if (stdout) Logger.info('[StartMetrics] Test output:\n' + stdout);
      if (stderr) Logger.warn('[StartMetrics] Test stderr:\n' + stderr);
    });
  }
}

// Start the server immediately
new StartMetrics().start();