# 📊 Metrics Dashboard — Infrastructure and Test Execution

This document explains, in both technical and accessible terms, all metrics collected by the automated test server using Playwright. These metrics are exposed via Prometheus and visualized in Grafana, enabling real-time monitoring of performance, stability, and infrastructure reliability.

Each metric was selected to help answer key questions:
- Are the tests running smoothly?
- Is the environment healthy?
- Are resources being used efficiently?
- Are there unstable or slow tests that need attention?

---

## 🔧 Infrastructure

These metrics monitor the health of the Node.js process that runs the tests. They help identify performance issues, memory usage, and system efficiency.

### `nodejs_eventloop_lag_seconds`

- **What it measures:** The delay in the Node.js event loop — the mechanism that handles asynchronous operations.
- **Why it matters:** High lag means the system is overloaded or blocked, which can delay or fail tests.
- **Practical analogy:** Think of a conveyor belt that needs to keep moving. If it slows down, items pile up and the whole process stalls. This metric shows whether the “belt” is flowing smoothly.
- **How to use it:** Set alerts to catch bottlenecks and review tests that may be causing overload.

---

### `process_resident_memory_bytes`

- **What it measures:** The amount of RAM used by the test process.
- **Why it matters:** Excessive or growing memory usage may indicate leaks or inefficient test design, leading to slowness or crashes.
- **Practical analogy:** Like monitoring how much memory an app uses on your computer. If it uses too much, it can freeze or affect other tasks.
- **How to use it:** Compare against test volume and watch for abnormal growth.

---

### `nodejs_gc_duration_seconds_sum{kind="incremental"}`

- **What it measures:** Total time spent on incremental garbage collection — frequent, small memory cleanups.
- **Why it matters:** If these cleanups happen too often or take too long, they can impact performance.
- **Practical analogy:** Like stopping briefly throughout the day to tidy your desk. Too many interruptions reduce productivity.
- **How to use it:** Check if tests are creating too many temporary objects.

---

### `nodejs_gc_duration_seconds_sum{kind="major"}`

- **What it measures:** Total time spent on full garbage collection — heavier cleanups that pause the system.
- **Why it matters:** These pauses can freeze the process and delay test execution.
- **Practical analogy:** Like doing a full office cleanup. Necessary, but disruptive if done too often.
- **How to use it:** Identify critical moments and optimize memory usage in tests.

---

### `nodejs_gc_duration_seconds_sum{kind="minor"}`

- **What it measures:** Time spent on minor garbage collection — quick cleanups of newly created objects.
- **Why it matters:** Shows how the system handles short-lived objects. Spikes may signal inefficient memory use.
- **Practical analogy:** Like tossing out papers you just used. If done constantly, it disrupts workflow.
- **How to use it:** Review whether tests are generating unnecessary or repetitive objects.

---

## 🌐 Environment & Context

These metrics help you understand where and how tests are running, enabling segmentation and traceability.

### `playwright_test_environment`

- **What it measures:** The environment where tests are executed (e.g., QA, production).
- **Why it matters:** Ensures tests run in the correct context and allows performance comparison across environments.
- **Practical analogy:** Like knowing whether you're testing in a sandbox or on the live system — the stakes and behavior differ.
- **How to use it:** Filter dashboards by environment and validate configuration.

---

### `playwright_test_group_total`

- **What it measures:** Number of tests executed per group (e.g., e2e, visual, API).
- **Why it matters:** Reveals test coverage distribution and helps identify neglected areas.
- **Practical analogy:** Like inspecting a car and realizing you only tested the engine but skipped the brakes. This metric shows if all “systems” are being tested.
- **How to use it:** Balance test groups and prioritize under-tested areas.

---

## 🧪 Test Execution

These metrics show test outcomes: how many passed, failed, or were retried.

### `playwright_test_total{status="passed"}`

- **What it measures:** Total number of tests that passed successfully.
- **Why it matters:** Indicates application stability and test suite reliability.
- **Practical analogy:** Like counting how many tasks were completed correctly on an assembly line.
- **How to use it:** Track progress per build and generate quality indicators.

---

### `playwright_test_failures_total`

- **What it measures:** Total number of failed tests.
- **Why it matters:** Helps detect regressions, instability, or recurring issues.
- **Practical analogy:** Like identifying how many defective items came off the line and where the issue occurred.
- **How to use it:** Set alerts and prioritize fixes in critical areas.

---

### `playwright_test_retry_total`

- **What it measures:** Number of tests that had to be retried.
- **Why it matters:** Indicates flaky tests — those that fail inconsistently.
- **Practical analogy:** Like repeating a task because it failed for no clear reason. It wastes time and lowers confidence.
- **How to use it:** Identify fragile tests and review their logic or dependencies.

---

## ⏱️ Test Performance

These metrics measure how long tests take to run, helping optimize pipeline speed.

### `playwright_test_duration_seconds`

- **What it measures:** Total time taken to execute all tests.
- **Why it matters:** Directly affects feedback speed and continuous delivery.
- **Practical analogy:** Like timing how long it takes to inspect the entire system before a release.
- **How to use it:** Reduce scope, parallelize runs, and eliminate bottlenecks.

---

### `playwright_test_avg_duration_seconds_count`

- **What it measures:** Average duration of individual tests.
- **Why it matters:** Helps pinpoint slow tests that impact overall execution time.
- **Practical analogy:** Like finding which tasks in a team are taking longer than expected and need streamlining.
- **How to use it:** Focus optimization efforts on the slowest tests.

---

## 📈 Monitoring Recommendations

- Set alerts for:
  - `nodejs_eventloop_lag_seconds`: to detect system stalls
  - `process_resident_memory_bytes`: to prevent memory overflows
  - `playwright_test_failures_total`: to catch regressions
  - `playwright_test_retry_total`: to stabilize flaky tests

- Use environment filters (`playwright_test_environment`) to compare QA vs production behavior.

- Correlate execution time (`playwright_test_duration_seconds`) with failure and retry counts to uncover bottlenecks.

- Prioritize fixing tests with high retry rates.

- Use garbage collection metrics (`nodejs_gc_duration_seconds_sum`) to assess memory efficiency and adjust test scope.

---
