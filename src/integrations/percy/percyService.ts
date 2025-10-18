import { Page } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { Logger } from '../../utils/logger';

/**
 * Provides a minimal interface for capturing Percy snapshots.
 * This version focuses on simplicity and direct usage.
 */
export class PercyService {
  /**
   * Captures a visual snapshot of the current page using Percy, if enabled.
   * Logs the snapshot name with enhanced formatting for traceability.
   *
   * @param page Playwright page instance
   * @param name Descriptive name for the snapshot (shown in Percy dashboard)
   */
  static async capture(page: Page, name: string): Promise<void> {
    if (process.env.ENABLE_PERCY?.toLowerCase() === 'true') {
      await percySnapshot(page, name);
      Logger.debug(`[Percy] Snapshot captured ${name}`);
    } else {
      Logger.debug(`[Percy] Snapshot skipped ${name} (ENABLE_PERCY is not true)`);
    }
  }
}