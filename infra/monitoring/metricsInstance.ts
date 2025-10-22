import { MetricsServer } from './metricsServer';

export const metrics = new MetricsServer();
metrics.start(); // starts with tests
