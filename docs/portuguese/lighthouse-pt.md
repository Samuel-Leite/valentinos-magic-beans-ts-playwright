# 🚦 Integração com Lighthouse via BrowserStack

Este projeto oferece suporte à execução de auditorias de performance com **Lighthouse** durante os testes automatizados com Playwright, utilizando sessões do **BrowserStack Automate**.  
A integração permite validar métricas de desempenho e boas práticas da aplicação em tempo real, sem a necessidade de abrir navegadores locais.

---

## 📘 Índice

- [🎯 Propósito](#-propósito)
- [⚙️ Como Funciona](#-como-funciona)
- [🔐 Variáveis de Ambiente Necessárias](#-variáveis-de-ambiente-necessárias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Componentes Principais](#-componentes-principais)
  - [`lighthouseExecutor.ts`](#lighthouseexecutorts)
  - [`login-lighthouse.spec.ts`](#login-lighthousespects)
- [🧯 Solução de Problemas](#-solução-de-problemas)
- [📄 Arquivos Fonte](#-arquivos-fonte)

---

## 🎯 Propósito

- Executar auditorias de performance com Lighthouse durante os testes automatizados  
- Validar métricas como FCP, LCP, TBT e CLS diretamente no fluxo de testes  
- Integrar com o protocolo `browserstack_executor` para execução remota  
- Automatizar validações com base em limites mínimos de qualidade  

---

## ⚙️ Como Funciona

1. O `LighthouseExecutor` utiliza o protocolo `browserstack_executor` para disparar auditorias Lighthouse dentro de uma sessão ativa do BrowserStack.  
2. A auditoria pode ser executada com ou sem URL explícita — por padrão, usa a URL atual da página.  
3. O método `runAuditWithAssertions` permite definir limites mínimos de performance e falha o teste caso não sejam atingidos.  
4. Os resultados são registrados via `Logger` para rastreabilidade e análise posterior.  
5. O cenário `login-lighthouse.spec.ts` executa a auditoria após o login, validando a performance da tela inicial.

---

## 🔐 Variáveis de Ambiente Necessárias

```env
BROWSERSTACK_USERNAME=seu_usuario
BROWSERSTACK_ACCESS_KEY=sua_chave
```
⚠️ Nunca compartilhe suas credenciais reais. Utilize .env.example para referência segura.

---

## 📂 Estrutura do Projeto

```bash
```bash
src/
│├── core/
│      ├── hooks.ts
│      └── remoteRunner.ts
│├── integrations/
│      └── browserstack/
│               ├── lighthouseExecutor.ts
tests/
│├── performance/
│      └── login-lighthouse.spec.ts
```

## 🛠️ Componentes Principais

### `lighthouseExecutor.ts`

Gerencia a execução de auditorias Lighthouse via BrowserStack.

#### 🎯 Propósito
- Disparar auditorias de performance com o protocolo browserstack_executor
- Validar métricas e categorias com base em limites definidos
- Registrar logs de sucesso ou falha para análise

#### 🔑 Métodos Principais
```ts
runAudit(page: Page, url?: string): Promise<void>
runAuditWithAssertions(page: Page, url: string): Promise<void>
```

---

### `login-lighthouse.spec.ts`

Executa o fluxo de login e dispara a auditoria Lighthouse na tela inicial.

#### 🎯 Propósito
- Validar a performance da aplicação após login
- Garantir que a tela inicial atenda aos critérios mínimos de qualidade

#### 💻 Exemplo de Uso
```ts
await LighthouseExecutor.runAudit(page, page.url());
```

---

## 🧯 Solução de Problemas

| Problema                      | Causa                                  | Solução                                                                |
|-------------------------------|----------------------------------------|------------------------------------------------------------------------|
| Erro de execução do protocolo | Sintaxe incorreta no `evaluate`        | Verifique o JSON enviado ao `browserstack_executor`                    |
| Auditoria não executa         | URL inválida ou sessão não iniciada    | Confirme que a página está carregada e a URL é acessível               |
| Falha nas validações          | Métricas abaixo dos limites definidos  | Ajuste os thresholds ou otimize a performance da aplicação             |
| Logger não imprime            | Logger não configurado corretamente    | Verifique se `Logger` está importado e configurado corretamente        |

---

## 📄 Arquivos Fonte
- [`lighthouseExecutor.ts`](../../src/integrations/browserstack/lighthouseExecutor.ts)
- [`login-lighthouse.spec.ts`](../../tests/performance/login-lighthouse.spec.ts)