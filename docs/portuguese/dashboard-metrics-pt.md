# 📊 Dashboard de Métricas — Infraestrutura e Execução de Testes Automatizados

Este documento explica de forma técnica e acessível todas as métricas coletadas pelo servidor de testes automatizados com Playwright. As métricas são expostas via Prometheus e visualizadas no Grafana, permitindo monitoramento em tempo real da performance, estabilidade e confiabilidade da infraestrutura de execução.

Cada métrica foi escolhida para responder perguntas como:
- Os testes estão rodando bem?
- O ambiente está saudável?
- Os recursos estão sendo usados de forma eficiente?
- Há testes instáveis ou lentos que precisam ser ajustados?

---

## 🔧 Infrastructure

Estas métricas monitoram a saúde do processo Node.js que executa os testes. Elas ajudam a identificar problemas de desempenho, consumo de memória e eficiência do sistema.

### `nodejs_eventloop_lag_seconds`

- **O que é:** Mede o tempo de atraso do event loop — o mecanismo que permite o Node.js lidar com múltiplas tarefas ao mesmo tempo.
- **Por que importa:** Se esse tempo estiver alto, significa que o sistema está sobrecarregado ou travado, o que pode atrasar ou falhar testes.
- **Exemplo prático:** Imagine uma esteira de produção que precisa manter o ritmo para que tudo funcione bem. Se ela começa a travar, os itens se acumulam e o processo todo desacelera. Essa métrica mostra se a “esteira” do Node.js está fluindo bem.
- **Como usar:** Configure alertas para detectar travamentos e revise testes que causam sobrecarga.

---

### `process_resident_memory_bytes`

- **O que é:** Mede quanta memória RAM o processo de testes está usando.
- **Por que importa:** Memória excessiva pode indicar vazamentos ou testes mal otimizados, levando a lentidão ou falhas.
- **Exemplo prático:** É como monitorar o quanto de memória um aplicativo está consumindo no seu computador. Se ele usar demais, pode travar ou afetar o desempenho de outras tarefas.
- **Como usar:** Compare com o volume de testes executados e monitore crescimento anormal.

---

### `nodejs_gc_duration_seconds_sum{kind="incremental"}`

- **O que é:** Tempo total gasto em coletas de lixo (garbage collection) incrementais — pequenas limpezas de memória feitas com frequência.
- **Por que importa:** Se essas coletas forem muito frequentes ou demoradas, podem afetar a performance.
- **Exemplo prático:** É como parar por alguns segundos várias vezes ao dia para organizar sua mesa. Se isso acontecer com muita frequência, você perde produtividade.
- **Como usar:** Avalie se há objetos temporários demais sendo criados nos testes.

---

### `nodejs_gc_duration_seconds_sum{kind="major"}`

- **O que é:** Tempo total gasto em coletas completas de memória — mais pesadas e que pausam o sistema.
- **Por que importa:** Essas pausas podem travar o processo e atrasar os testes.
- **Exemplo prático:** É como fazer uma faxina geral no escritório. Importante, mas se acontecer com frequência, atrasa o trabalho.
- **Como usar:** Identifique momentos críticos e revise o uso de memória nos testes.

---

### `nodejs_gc_duration_seconds_sum{kind="minor"}`

- **O que é:** Tempo total gasto em coletas leves de objetos recém-criados.
- **Por que importa:** Mostra como o sistema lida com objetos temporários. Picos podem indicar uso ineficiente.
- **Exemplo prático:** É como jogar fora papéis que você acabou de usar. Se fizer isso o tempo todo, pode atrapalhar o fluxo de trabalho.
- **Como usar:** Avalie se os testes estão criando objetos desnecessários ou repetitivos.

---

## 🌐 Environment & Context

Estas métricas ajudam a entender onde e como os testes estão sendo executados, permitindo segmentação e rastreabilidade.

### `playwright_test_environment`

- **O que é:** Indica o ambiente de execução dos testes (ex: QA, produção).
- **Por que importa:** Garante que os testes estão rodando no ambiente certo e permite comparar resultados entre ambientes.
- **Exemplo prático:** É como saber se você está testando em um ambiente de simulação ou no sistema real. Isso muda o contexto e os riscos.
- **Como usar:** Filtre os painéis por ambiente e valide configurações específicas.

---

### `playwright_test_group_total`

- **O que é:** Conta quantos testes foram executados por grupo (ex: e2e, visual, API).
- **Por que importa:** Mostra a distribuição da cobertura de testes e ajuda a identificar áreas negligenciadas.
- **Exemplo prático:** É como revisar um carro e perceber que você só testou o motor, mas esqueceu os freios. Essa métrica mostra se todos os “sistemas” estão sendo testados.
- **Como usar:** Equilibre os grupos e priorize os que têm menos cobertura.

---

## 🧪 Test Execution

Estas métricas mostram o resultado dos testes: quantos passaram, falharam ou precisaram ser reexecutados.

### `playwright_test_total{status="passed"}`

- **O que é:** Total de testes que passaram com sucesso.
- **Por que importa:** Indica estabilidade da aplicação e qualidade da automação.
- **Exemplo prático:** É como contar quantas tarefas foram concluídas corretamente em uma linha de produção.
- **Como usar:** Acompanhe evolução por build e gere indicadores de qualidade.

---

### `playwright_test_failures_total`

- **O que é:** Total de testes que falharam.
- **Por que importa:** Ajuda a identificar regressões, instabilidades ou falhas recorrentes.
- **Exemplo prático:** É como saber quantas peças saíram com defeito e em qual etapa do processo.
- **Como usar:** Configure alertas e priorize correções em áreas críticas.

---

### `playwright_test_retry_total`

- **O que é:** Total de testes que precisaram ser reexecutados.
- **Por que importa:** Indica testes instáveis (flaky) que não passam sempre.
- **Exemplo prático:** É como ter que repetir uma tarefa porque ela falhou sem motivo claro. Isso consome tempo e reduz a confiança no processo.
- **Como usar:** Identifique testes frágeis e revise lógica ou dependências.

---

## ⏱️ Test Performance

Estas métricas medem o tempo que os testes levam para rodar, ajudando a otimizar a velocidade da pipeline.

### `playwright_test_duration_seconds`

- **O que é:** Tempo total de execução dos testes.
- **Por que importa:** Impacta diretamente o tempo de feedback e entrega contínua.
- **Exemplo prático:** É como saber quanto tempo leva para revisar todo o sistema antes de liberar uma nova versão.
- **Como usar:** Reduza escopo, paralelize execuções e elimine gargalos.

---

### `playwright_test_avg_duration_seconds_count`

- **O que é:** Média de duração dos testes individuais.
- **Por que importa:** Ajuda a identificar testes lentos que afetam o tempo total.
- **Exemplo prático:** É como descobrir quais tarefas estão demorando mais que o esperado em uma equipe e precisam ser otimizadas.
- **Como usar:** Priorize otimizações nos testes mais demorados.

---

## 📈 Recomendações de Monitoramento

- Configure alertas para:
  - `nodejs_eventloop_lag_seconds`: para detectar travamentos
  - `process_resident_memory_bytes`: para evitar estouro de memória
  - `playwright_test_failures_total`: para identificar regressões
  - `playwright_test_retry_total`: para estabilizar testes frágeis

- Use painéis segmentados por ambiente (`playwright_test_environment`) para comparar QA vs produção.

- Correlacione tempo de execução (`playwright_test_duration_seconds`) com número de falhas e retries para identificar gargalos.

- Priorize estabilização de testes com alto índice de retry.

- Use as métricas de garbage collection (`nodejs_gc_duration_seconds_sum`) para validar eficiência de memória e ajustar escopo de execução.

---
