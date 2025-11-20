# 🌐 Integração com BrowserStack

Este projeto oferece suporte à execução remota de testes no **BrowserStack** usando o Playwright.  
Ele permite alternar facilmente entre execuções locais e em nuvem com configuração mínima.

---

## 📘 Índice

- [🎯 Propósito](#-propósito)
- [⚙️ Como Funciona](#️-como-funciona)
- [🔐 Variáveis de Ambiente Necessárias](#-variáveis-de-ambiente-necessárias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Componentes Principais](#-componentes-principais)
  - [`BrowserStackStatus.ts`](#browserstackstatusts)
  - [`EndpointBuilder.ts`](#endpointbuilderts)
  - [`RemoteRunner.ts`](#remoterunnerts)
- [🧯 Solução de Problemas](#-solução-de-problemas)
- [📄 Arquivos Fonte](#-arquivos-fonte)

---

## 🎯 Propósito

- Executar testes Playwright em navegadores/dispositivos reais via BrowserStack  
- Alternar dinamicamente entre execução local e remota  
- Atualizar automaticamente o status das sessões no BrowserStack  
- Gerar endpoints WebSocket com capacidades personalizadas  

---

## ⚙️ Como Funciona

1. Defina `execution > runRemote:true` no seu arquivo `test-config.yml` para habilitar a execução remota.  
2. O `RemoteRunner` cria dinamicamente um endpoint WebSocket usando o `EndpointBuilder`.  
3. O Playwright se conecta ao BrowserStack utilizando o endpoint gerado.  
4. Após a execução do teste, o `BrowserStackStatus` atualiza o status da sessão (sucesso/falha) com a justificativa.  

---

## 🔐 Variáveis de Ambiente Necessárias

```env
BROWSERSTACK_USERNAME=seu_usuario
BROWSERSTACK_ACCESS_KEY=sua_chave
BUILD_NAME=Meu Build
PROJECT_NAME=Meu Projeto
```
⚠️ **Nunca** envie suas credenciais reais.  
Use o arquivo `.env.example` para compartilhamento seguro.

---

## 📂 Estrutura do Projeto

```bash
src/
│├── core/
│      ├── hooks.ts
│      └── remoteRunner.ts
│├── integrations/
│      └── browserstack/
│               ├── browserstackStatus.ts
│               └── endpointBuilder.ts
```

## 🛠️ Componentes Principais

### `BrowserStackStatus.ts`

Gerencia as atualizações de status das sessões no painel do BrowserStack.

#### 🎯 Propósito
Envia o status de sucesso ou falha para o BrowserStack:
- Extrai motivos de falha relevantes a partir de `testInfo`
- Identifica padrões de erro conhecidos para relatórios mais detalhados

#### 🔑 Métodos Principais
```ts
update(page: Page, status: 'passed' | 'failed', reason: string): Promise<void>
updateFromTestInfo(page: Page, testInfo: TestInfo): Promise<void>
```

---

#### `EndpointBuilder.ts`

Gera a URL de endpoint WebSocket para conexão com o BrowserStack.

##### Propósito
- Carrega arquivos YAML de capacidades com base no nome do dispositivo
- Injeta metadados dinâmicos (nome do teste, build, projeto e credenciais)
- Codifica as capacidades em um formato compatível com WebSocket

##### Método Principal
```ts
build(deviceName: string, testName: string): string
```

---

#### `RemoteRunner.ts`

Gerencia a criação do contexto do navegador e o ciclo de vida dos testes, tanto local quanto remotamente.

##### Propósito
- Detecta o modo de execução através da variável test-config.yml
- Cria e finaliza contextos de navegador conforme o ambiente
- Estende o objeto de teste do Playwright com uma configuração personalizada

##### Métodos Principais
```ts
createContext(testInfo: TestInfo): Promise<BrowserContext>
createPage(context: BrowserContext): Promise<Page>
closeContext(context: BrowserContext): Promise<void>
extend(): typeof test
```

## 🧯 Solução de Problemas

|         Problema              |               Causa                    |                                         Solução                                                       |
|-------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------|
| `Capabilities file not found` | Arquivo YAML ausente                   | Verifique se `resources/config/capabilities/desktop.yml` existe                                       |
| `Session status not updated`  | Credenciais ausentes ou teste ignorado | Confirme `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, e o status do teste                      |
| `WebSocket connection fails`  | Capacidades ou credenciais inválidas   | Valide o arquivo YAML e os valores do `.env`                                                          |
| `runRemote:true` sem efeito   | Variável não carregada                 | Confirme se o `test-config.yml` está sendo carregado e se `runRemote:true` está definido corretamente |


## 📄 Arquivos Fonte
- [`remoteRunner.ts`](../../src/core/remoteRunner.ts)
- [`browserstackStatus.ts`](../../src/integrations/browserstack/browserstackStatus.ts)
- [`endpointBuilder.ts`](../../src/integrations/browserstack/endpointBuilder.ts)
- [Evidência no BrowserStack](https://automate.browserstack.com/builds/95dfc675c8ac83f638727f1e389e1b1ddf38bb57/sessions/5d94339d84ccdb4b2b06ab54393348b2cc610d03?auth_token=e274aeae75114ba309f54a812b9976ab0f6d8e82cb597232f0167a4e80c28cb4)
- [Execução no BrowserStack](../../docs/img/browserstack.png)