import express from 'express';
import { register, Gauge } from 'prom-client';
import { exec } from 'child_process';

const app = express();

// Define a métrica personalizada
const testDurationGauge = new Gauge({
  name: 'playwright_test_duration_seconds',
  help: 'Duração dos testes Playwright em segundos',
  labelNames: ['test'],
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Inicia o servidor de métricas
app.listen(9464, '0.0.0.0', () => {
  console.log('✅ Servidor de métricas rodando na porta 9464');

  // Executa os testes Playwright
  const start = Date.now();

  const process = exec('npx playwright test', (err, stdout, stderr) => {
    const durationSeconds = (Date.now() - start) / 1000;
    testDurationGauge.set({ test: 'all' }, durationSeconds);
    console.log(`⏱️ Duração total dos testes: ${durationSeconds.toFixed(2)}s`);

    if (err) {
      console.error('❌ Erro ao executar os testes:', err);
    }

    console.log(stdout);
    console.error(stderr);
  });

  // Mantém o processo vivo mesmo após os testes
  setInterval(() => {}, 1000);
});