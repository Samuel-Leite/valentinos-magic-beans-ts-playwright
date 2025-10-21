import { MetricsServer } from './metrics-server';

export const metrics = new MetricsServer();
metrics.start(); // inicia junto com os testes
