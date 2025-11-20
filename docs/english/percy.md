# 📸 Percy Integration

This project supports visual snapshot capture using **Percy** during Playwright test execution.  
The integration helps detect unexpected changes in the application's interface and visually review the impact of each update.

---

## 📘 Table of Contents

- [🎯 Purpose](#-purpose)
- [⚙️ How It Works](#️-how-it-works)
- [🔐 Required Environment Variables](#-required-environment-variables)
- [📂 Project Structure](#-project-structure)
- [🛠️ Core Components](#-core-components)
  - [`PercyService.ts`](#percyservicets)
  - [`LoginPage.ts`](#loginpagets)
  - [`HomePage.ts`](#homepagets)
- [🧯 Troubleshooting](#-troubleshooting)
- [📄 Source Files](#-source-files)

---

## 🎯 Purpose

- Capture visual snapshots during automated test flows  
- Detect visual regressions between test runs  
- Integrate with the Percy dashboard for review and approval  
- Enable conditional snapshot capture via environment variable  

---

## ⚙️ How It Works

1. Set `ENABLE_PERCY=true` in your `.env` file to enable snapshot capture.  
2. The `PercyService` checks if Percy is enabled and captures the current page state.  
3. Snapshots are automatically sent to the Percy dashboard.  
4. Images are compared against previous versions and displayed for visual review.  

---

## 🔐 Required Environment Variables

```env
ENABLE_PERCY=true
PERCY_TOKEN=your_token
```
⚠️ Never commit your real token. Use the `.env.example` file for safe sharing.

--- 

## 📂 Project Structure

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

## 🛠️ Core Components

### `PercyService.ts`

Handles visual snapshot capture with Percy.

#### 🎯 Purpose
- Capture interface images during test execution  
- Log snapshot activity for traceability  
- Conditionally execute based on the `ENABLE_PERCY` environment variable  

#### 🔑 Main Method
```ts
capture(page: Page, name: string): Promise<void>
```

#### Usage

##### `LoginPage.ts`
Captures the initial visual state of the login screen before interactions.

```ts
await PercyService.capture(this.page, 'Login flow: initial state');
```

### `HomePage.ts`

Captures the visual state after successful login and after logout.

```ts
await PercyService.capture(this.page, 'Login flow: home after success');
await PercyService.capture(this.page, 'Logout flow: post logout state');
```

---

## 🧯 Troubleshooting

| Issue                   | Cause                                  | Solution                                                                 |
|-------------------------|----------------------------------------|--------------------------------------------------------------------------|
| Snapshot skipped        | `ENABLE_PERCY` not set                 | Make sure the variable is present and set to `true` in `.env`            |
| Empty Percy dashboard   | No snapshots were captured             | Confirm that `PercyService.capture` is being called in your tests        |
| Invalid or missing token| `PERCY_TOKEN` not configured           | Add your token to `.env` or configure it via pipeline secrets            |
| Duplicate snapshots     | Multiple capture points in the flow    | Centralize snapshot capture at key moments to avoid redundancy           |

---

## 📄 Source Files

- [`percyService.ts`](../../src/integrations/percy/percyService.ts)  
- [`LoginPage.ts`](../../src/pages/LoginPage.ts)  
- [`HomePage.ts`](../../src/pages/HomePage.ts)
- [Visual Validation with Percy](../../docs/img/percy_visual_testing.png)