# 🌐 BrowserStack Integration

This project supports remote test execution on **BrowserStack** using Playwright. It enables seamless switching between local and cloud-based testing environments with minimal configuration.

---

## 📘 Table of Contents

- [🎯 Purpose](#-purpose)
- [⚙️ How It Works](#️-how-it-works)
- [🔐 Required Environment Variables](#-required-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🛠️ Key Components](#-key-components)
  - [`BrowserStackStatus.ts`](#browserstackstatusts)
  - [`EndpointBuilder.ts`](#endpointbuilderts)
  - [`RemoteRunner.ts`](#remoterunnerts)
- [🧯 Troubleshooting](#-troubleshooting)
- [📄 Source Files](#-source-files)

---

## 🎯 Purpose

- Run Playwright tests on real browsers/devices via BrowserStack
- Dynamically switch between local and remote execution
- Automatically update test session status in BrowserStack
- Generate WebSocket endpoints with custom capabilities

---

## ⚙️ How It Works

1. Set `RUN_REMOTE=true` in your `.env` file to enable remote execution.
2. The `RemoteRunner` dynamically builds a WebSocket endpoint using `EndpointBuilder`.
3. Playwright connects to BrowserStack using the generated endpoint.
4. After test execution, `BrowserStackStatus` updates the session status (passed/failed) with a reason.

---

## 🔐 Required Environment Variables

```env
RUN_REMOTE=true
DEVICE=desktop
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
BUILD_NAME=My Build
PROJECT_NAME=My Project
```
⚠️ Never commit your real credentials. Use .env.example for safe sharing.

## 📂 Project Structure
```
src/
│├── core/
│      ├── hooks.ts
│      └── remoteRunner.ts
│├── integrations/
│      └── browserstack/
│               ├── browserstackStatus.ts
│               └── endpointBuilder.ts
```

## 🛠️ Key Components

#### `BrowserStackStatus.ts`

Handles session status updates in the BrowserStack dashboard.

##### Purpose
Sends passed or failed status to BrowserStack
- Extracts meaningful failure reasons from testInfo
- Matches known error patterns for better reporting

##### Key Method
```ts
update(page: Page, status: 'passed' | 'failed', reason: string): Promise<void>
updateFromTestInfo(page: Page, testInfo: TestInfo): Promise<void>
```

---

#### `EndpointBuilder.ts`

Generates the WebSocket endpoint URL for connecting to BrowserStack.

##### Purpose
- Loads YAML capability files based on device name
- Injects dynamic metadata (test name, build, project, credentials)
- Encodes capabilities into a WebSocket-compatible format

##### Key Method
```ts
build(deviceName: string, testName: string): string
```

---

#### `RemoteRunner.ts`

Manages browser context creation and test lifecycle for local and remote execution.

##### Purpose
- Detects execution mode via RUN_REMOTE
- Creates and tears down browser contexts accordingly
- Extends Playwright’s test object with custom setup

##### Key Method
```ts
createContext(testInfo: TestInfo): Promise<BrowserContext>
createPage(context: BrowserContext): Promise<Page>
closeContext(context: BrowserContext): Promise<void>
extend(): typeof test
```

## 🧯 Troubleshooting

| Issue                          | Cause                          | Solution                                                                 |
|-------------------------------|--------------------------------|--------------------------------------------------------------------------|
| `Capabilities file not found` | Missing YAML config            | Ensure `resources/config/capabilities/desktop.yml` exists                |
| `Session status not updated`  | Missing credentials or skipped test | Check `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, and test status |
| `WebSocket connection fails`  | Invalid capabilities or credentials | Validate YAML file and `.env` values                                     |
| `RUN_REMOTE` has no effect    | Variable not loaded            | Confirm `.env` is loaded and `RUN_REMOTE=true` is set correctly          |


## 📄 Source Files
- [`remoteRunner.ts`](../../src/core/remoteRunner.ts)
- [`browserstackStatus.ts`](../../src/integrations/browserstack/browserstackStatus.ts)
- [`endpointBuilder.ts`](../../src/integrations/browserstack/endpointBuilder.ts)