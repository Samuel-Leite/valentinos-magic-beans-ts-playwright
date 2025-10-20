# 🚦 Lighthouse Integration via BrowserStack

This project supports running **Lighthouse** performance audits during automated Playwright tests using **BrowserStack Automate** sessions.  
The integration allows you to validate performance metrics and best practices in real time, without launching local browsers.

---

## 📘 Table of Contents

- [🎯 Purpose](#-purpose)
- [⚙️ How It Works](#-how-it-works)
- [🔐 Required Environment Variables](#-required-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🛠️ Key Components](#-key-components)
  - [`lighthouseExecutor.ts`](#lighthouseexecutorts)
  - [`login-lighthouse.spec.ts`](#login-lighthousespects)
- [🧯 Troubleshooting](#-troubleshooting)
- [📄 Source Files](#-source-files)

---

## 🎯 Purpose

- Run Lighthouse performance audits during automated test flows  
- Validate metrics like FCP, LCP, TBT, and CLS directly within the test execution  
- Integrate with the `browserstack_executor` protocol for remote execution  
- Automate validations based on minimum quality thresholds  

---

## ⚙️ How It Works

1. `LighthouseExecutor` uses the `browserstack_executor` protocol to trigger Lighthouse audits inside an active BrowserStack session.  
2. The audit can run with or without an explicit URL — by default, it uses the current page URL.  
3. The `runAuditWithAssertions` method allows you to define performance thresholds and fails the test if they’re not met.  
4. Results are logged via `Logger` for traceability and post-analysis.  
5. The `login-lighthouse.spec.ts` scenario runs the audit after login, validating the performance of the home screen.

---

## 🔐 Required Environment Variables

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
```
⚠️ Never share your actual credentials. Use .env.example for safe reference.

---

## 📂 Project Structure

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

## 🛠️ Key Components

### `lighthouseExecutor.ts`

Manages Lighthouse audit execution via BrowserStack.

#### 🎯 Purpose
- Trigger performance audits using the browserstack_executor protocol
- Validate metrics and categories against defined thresholds
- Log success or failure for analysis

#### 🔑 Main Methods
```ts
runAudit(page: Page, url?: string): Promise<void>
runAuditWithAssertions(page: Page, url: string): Promise<void>
```

---

### `login-lighthouse.spec.ts`

Runs the login flow and triggers the Lighthouse audit on the home screen.

#### 🎯 Purpose
- Validate application performance after login
- Ensure the home screen meets minimum quality standards

#### 💻 Usage Example
```ts
await LighthouseExecutor.runAudit(page, page.url());
```

---

## 🧯 Troubleshooting

| Issue                     | Cause                                  | Solution                                                              |
|---------------------------|----------------------------------------|-----------------------------------------------------------------------|
| Protocol execution error  | Incorrect syntax in `evaluate`         | Check the JSON sent to `browserstack_executor`                        |
| Audit not triggered       | Invalid URL or inactive session        | Ensure the page is loaded and the URL is accessible                   |
| Assertion failures        | Metrics below defined thresholds       | Adjust thresholds or optimize application performance                 |
| Logger not printing       | Logger not properly configured         | Verify that Logger is correctly imported and initialized              |

---

## 📄 Arquivos Fonte
- [`lighthouseExecutor.ts`](../../src/integrations/browserstack/lighthouseExecutor.ts)
- [`login-lighthouse.spec.ts`](../../tests/performance/login-lighthouse.spec.ts)
