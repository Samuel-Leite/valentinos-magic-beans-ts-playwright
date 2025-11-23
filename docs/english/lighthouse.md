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
4. The `login-lighthouse.spec.ts` scenario runs the audit validating the performance of the home screen.

---

## 🔐 Required Environment Variables

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
```
⚠️ Never share your actual credentials. Use .env.example for safe reference.

---

## 📊 Lighthouse Indicators

The indicators below explain how Lighthouse evaluates different aspects of web application quality:

- **Performance** ⚡  
  Measures the speed and efficiency of page loading.  
  Includes metrics such as *First Contentful Paint (FCP)*, *Largest Contentful Paint (LCP)*, *Total Blocking Time (TBT)*, and *Cumulative Layout Shift (CLS)*.  
  In short: shows how fast and stable the site is for the user.

- **Accessibility** ♿  
  Evaluates whether the site is usable by people with disabilities.  
  Checks color contrast, button/link names, heading structure, and keyboard navigation.  
  In short: shows if the site is inclusive and accessible to everyone.

- **Best Practices** ✅  
  Verifies if the site follows good development and security practices.  
  Examples: proper use of HTTPS, protection against XSS attacks, avoiding obsolete resources.  
  In short: ensures the site is built in a modern and secure way.

- **SEO (Search Engine Optimization)** 🔍  
  Measures whether the site is optimized to appear in search engines like Google.  
  Checks indexing, meta tags, and basic SEO recommendations.  
  In short: indicates if the site has good chances of being found in searches.

- **PWA (Progressive Web App)** 📱  
  Evaluates whether the site can function as an installable application.  
  Checks manifest.json, service worker, splash screen, and theme configuration.  
  In short: shows if the site can be used as an app on mobile or desktop.
  
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
- Validate application performance
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
- [Evidence on BrowserStack](https://automate.browserstack.com/builds/95dfc675c8ac83f638727f1e389e1b1ddf38bb57/sessions/3b51375c3ee6bace2e4a91c806f76a530f113927?auth_token=041395920ffcd820ba74e76d1d423c2ee55d7ffbb4170905e78c19f0bb040755)
- [Validation with Lighthouse](../../docs/img/lighthouse_performance_testing.png)