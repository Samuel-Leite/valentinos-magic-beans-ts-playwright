import path from 'path';
import fs from 'fs';
import { YamlReader } from '../../utils/yamlReader';
import { Logger } from '../../utils/logger';

/**
 * Builds the WebSocket endpoint URL for connecting Playwright to BrowserStack.
 */
export class EndpointBuilder {
  private readonly capabilitiesDir: string;

  constructor() {
    this.capabilitiesDir = path.resolve(__dirname, '../../resources/config/capabilities');
  }

  /**
   * Generates the WebSocket endpoint URL for a given device and test name.
   *
   * @param deviceName - The name of the device configuration (e.g., 'desktop', 'tablet').
   * @param testName - The name of the test scenario to be displayed in BrowserStack.
   * @returns A WebSocket URL with encoded capabilities for remote execution.
   */
  public build(deviceName: string, testName: string): string {
    const filePath = path.join(this.capabilitiesDir, `${deviceName}.yml`);

    if (!fs.existsSync(filePath)) {
      Logger.error(`[EndpointBuilder] Capabilities file not found for device: ${deviceName}`);
      throw new Error(`[EndpointBuilder] Capabilities file for device '${deviceName}' not found.`);
    }

    Logger.info(`[EndpointBuilder] Capabilities file successfully located for device: ${deviceName}`);

    const caps = YamlReader.readCapabilities(deviceName);
    Logger.info(`[EndpointBuilder] Capabilities successfully parsed from YAML for device: ${deviceName}`);

    const finalCaps = {
      ...caps,
      name: testName,
      build: YamlReader.getConfigValue('project.build'),
      project: YamlReader.getConfigValue('project.name'),
      'browserstack.username': process.env.BROWSERSTACK_USERNAME,
      'browserstack.accessKey': process.env.BROWSERSTACK_ACCESS_KEY,
      'browserstack.performance': 'assert',
    };

    Logger.info(`[EndpointBuilder] Final capabilities assembled for test: ${testName}`);
    const encoded = encodeURIComponent(JSON.stringify(finalCaps));
    Logger.info(`[EndpointBuilder] Capabilities successfully encoded for WebSocket transmission`);

    return `wss://cdp.browserstack.com/playwright?caps=${encoded}`;
  }
}