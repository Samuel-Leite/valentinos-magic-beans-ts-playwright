import express from 'express';
import { Counter, Gauge, Summary, Registry, collectDefaultMetrics } from 'prom-client';
import { exec } from 'child_process';
import { Logger } from '../../src/utils/logger';

class StartMetrics {
  private app = express();
  private port = 9464;
  private register = new Registry();

  private testDurationGauge: Gauge;
  private testStatusCounter: Counter;
  private testRetryCounter: Counter;
  private testFailureCounter: Counter;
  private testDurationSummary: Summary;
  private testGroupCounter: Counter;
  private testEnvironmentGauge: Gauge;

  constructor() {
    collectDefaultMetrics({ register: this.register });
    Logger.info('[StartMetrics] Default Node.js metrics registered.');

    this.testDurationGauge = new Gauge({
      name: 'playwright_test_duration_seconds',
      help: 'Duration of Playwright tests in seconds',
      labelNames: ['test'],
      registers: [this.register],
    });

    this.testStatusCounter = new Counter({
      name: 'playwright_test_total',
      help: 'Total number of tests by status',
      labelNames: ['status'],
      registers: [this.register],
    });

    this.testRetryCounter = new Counter({
      name: 'playwright_test_retry_total',
      help: 'Total number of test retries',
      registers: [this.register],
    });

    this.testFailureCounter = new Counter({
      name: 'playwright_test_failures_total',
      help: 'Total number of test failures by error type',
      labelNames: ['error'],
      registers: [this.register],
    });

    this.testDurationSummary = new Summary({
      name: 'playwright_test_avg_duration_seconds',
      help: 'Summary of test durations',
      registers: [this.register],
    });

    this.testGroupCounter = new Counter({
      name: 'playwright_test_group_total',
      help: 'Total number of tests by group',
      labelNames: ['group'],
      registers: [this.register],
    });

    this.testEnvironmentGauge = new Gauge({
      name: 'playwright_test_environment',
      help: 'Environment where tests are executed',
      labelNames: ['env'],
      registers: [this.register],
    });

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/metrics', async (_req, res) => {
      Logger.info('[StartMetrics] /metrics endpoint accessed');
      res.setHeader('Content-Type', this.register.contentType);
      res.end(await this.register.metrics());
    });
  }

  public start(): void {
    this.app.listen(this.port, '0.0.0.0', () => {
      Logger.info(`[StartMetrics] Metrics server running on port ${this.port}`);
      this.runTests();
    });

    setInterval(() => {}, 1000); // Keeps process alive
  }

  private runTests(): void {
    Logger.info('[StartMetrics] Starting Playwright tests...');
    const start = Date.now();

    const environment = process.env.ENV || 'qa';
    this.testEnvironmentGauge.set({ env: environment }, 1);

    exec('npx playwright test tests/e2e', (err, stdout, stderr) => {
      const durationSeconds = (Date.now() - start) / 1000;
      this.testDurationGauge.set({ test: 'all' }, durationSeconds);
      this.testDurationSummary.observe(durationSeconds);
      Logger.info(`[StartMetrics] Test duration recorded: ${durationSeconds.toFixed(2)}s`);

      const group = 'e2e';
      Logger.info(`[StartMetrics] Incrementando grupo: ${group}`);
      this.testGroupCounter.inc({ group });

      if (err) {
        Logger.error('[StartMetrics] Error during test execution');
        Logger.error(`[StartMetrics] Details: ${err.message}`);
        this.testStatusCounter.inc({ status: 'failed' });

        const errorType = err.message.includes('timeout') ? 'timeout' :
                          err.message.includes('locator') ? 'locator-not-found' : 'other';
        this.testFailureCounter.inc({ error: errorType });

        if (err.message.includes('Retry')) {
          this.testRetryCounter.inc();
        } else {
          this.testRetryCounter.inc(0);
        }
      } else {
        this.testStatusCounter.inc({ status: 'passed' });
        this.testFailureCounter.inc({ error: 'none' });
        this.testRetryCounter.inc(0);
      }

      if (stdout) Logger.info('[StartMetrics] Test output:\n' + stdout);
      if (stderr) Logger.warn('[StartMetrics] Test stderr:\n' + stderr);

      setTimeout(() => {
        Logger.info('[StartMetrics] Finalizando após delay');
      }, 5000);
    });
  }
}

new StartMetrics().start();