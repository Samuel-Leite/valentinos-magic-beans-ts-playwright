import { Page } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { Logger } from '../../utils/logger';

/**
 * Provides a minimal interface for capturing Percy snapshots.
 * This version focuses on simplicity and silent behavior when disabled.
 */
export class PercyService {
  /**
   * Captures a visual snapshot of the current page using Percy, if ENABLE_PERCY is set to true.
   * When disabled, no snapshot is taken and no log is emitted to avoid noise.
   *
   * @param page - Playwright page instance
   * @param name - Descriptive name for the snapshot (shown in Percy dashboard)
   */
  static async capture(page: Page, name: string): Promise<void> {
    if (process.env.ENABLE_PERCY?.toLowerCase() !== 'true') return;

    await percySnapshot(page, name);
    Logger.debug(`[Percy] Snapshot captured ${name}`);
  }
}