# 📸 Integração com Percy

Este projeto oferece suporte à captura de snapshots visuais com **Percy** durante a execução de testes com Playwright.  
A integração permite detectar alterações inesperadas na interface da aplicação e revisar visualmente o impacto de cada mudança.

---

## 📘 Índice

- [🎯 Propósito](#-propósito)
- [⚙️ Como Funciona](#-como-funciona)
- [🔐 Variáveis de Ambiente Necessárias](#-variáveis-de-ambiente-necessárias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Componentes Principais](#-componentes-principais)
  - [`PercyService.ts`](#percyservicets)
  - [LoginPage.ts](#loginpagets)
  - [HomePage.ts](#homepagets)
- [🧯 Solução de Problemas](#-solução-de-problemas)
- [📄 Arquivos Fonte](#-arquivos-fonte)

---

## 🎯 Propósito

- Capturar snapshots visuais durante o fluxo de testes automatizados  
- Detectar regressões visuais entre execuções  
- Integrar com o dashboard do Percy para revisão e aprovação de mudanças  
- Permitir controle condicional da captura via variável de ambiente  

---

## ⚙️ Como Funciona

1. Defina `ENABLE_PERCY=true` no seu arquivo `.env` para ativar a captura de snapshots.  
2. O `PercyService` verifica se Percy está habilitado e captura a imagem da página atual.  
3. Os snapshots são enviados automaticamente para o dashboard do Percy.  
4. As imagens são comparadas com versões anteriores e exibidas para revisão visual.
5. A execução está integrada à pipeline do GitHub Actions, garantindo que os testes visuais rodem em cada push ou pull request nas branches `main` e `develop`.

---

## 🔐 Variáveis de Ambiente Necessárias

```env
ENABLE_PERCY=true
PERCY_TOKEN=seu_token
```
⚠️ Nunca envie seu token real. Use o arquivo .env.example para compartilhamento seguro.

---

📂 Estrutura do Projeto
```bash
src/
│├── integrations/
│      └── percy/
│             └── percyService.ts
│├── pages/
│      ├── LoginPage.ts
│      └── HomePage.ts
```
---

## 🛠️ Componentes Principais

### `PercyService.ts`

Gerencia a captura de snapshots visuais com Percy.

#### 🎯 Propósito
- Capturar imagens da interface durante o teste
- Registrar logs de execução para rastreabilidade
- Condicionar a execução com base na variável ENABLE_PERCY

#### 🔑 Métodos Principais
```ts
capture(page: Page, name: string): Promise<void>
```

#### Uso

##### `LoginPage.ts`
Captura o estado visual inicial da tela de login antes das interações.

```ts
await PercyService.capture(this.page, 'Login flow: initial state');
```

##### `HomePage.ts`
Captura o estado visual após login bem-sucedido e após logout.
```ts
await PercyService.capture(this.page, 'Login flow: home after success');
await PercyService.capture(this.page, 'Logout flow: post logout state');
```

---

## 🧯 Solução de Problemas

|         Problema          |               Causa                    |                              Solução                                      |
|---------------------------|----------------------------------------|---------------------------------------------------------------------------|
| Snapshot skipped          | ENABLE_PERCY não está definido         | Verifique se a variável está presente e com valor `true` no `.env`        |
| Percy dashboard vazio     | Nenhum snapshot foi capturado          | Confirme se o método `PercyService.capture` está sendo chamado nos testes |
| Token inválido ou ausente | PERCY_TOKEN não configurado            | Adicione seu token no `.env` ou configure via secrets no pipeline         |
| Snapshots duplicados      | Captura em múltiplos pontos do fluxo   | Centralize a captura em momentos-chave para evitar redundância            |

--- 

## 📄 Arquivos Fonte

- [`percyService.ts`](../../src/integrations/percy/percyService.ts)  
- [`LoginPage.ts`](../../src/pages/LoginPage.ts)  
- [`HomePage.ts`](../../src/pages/HomePage.ts)