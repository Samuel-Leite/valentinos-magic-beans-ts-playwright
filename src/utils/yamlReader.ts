import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Logger } from './logger';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

/**
 * Utility class for reading configuration and data from YAML files.
 */
export class YamlReader {

  private static readonly configPath = path.resolve(__dirname, '../resources/config/test-config.yml');
  private static configCache: Record<string, any> | null = null;

  /**
   * Reads the base URL for a specific environment from a YAML configuration file.
   * @param environment - Name of the environment (e.g., 'qa', 'prod')
   * @returns URL string defined in the YAML file
   * @throws If the file cannot be read or parsed
   */
  static readUrl(environment: string): string {
    const filePath = path.resolve(__dirname, `../resources/config/url-${environment}.yml`);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const parsed = yaml.load(fileContents) as { url: string };
      Logger.info(`[YamlReader] Environment URL '${environment}' successfully retrieved from YAML`);
      return parsed.url;
    } catch (error: any) {
      Logger.error(`[YamlReader] Failed to retrieve environment URL '${environment}': ${error.message}`);
      throw error;
    }
  }

  /**
   * Reads a specific data block from a YAML file based on the current environment.
   * @param key - Root key name in the YAML file (e.g., 'valid_user')
   * @returns Object containing the data for the specified key
   * @throws If the block is missing or invalid
   */
  static readYamlObject(key: string): Record<string, any> {
    const env = YamlReader.getConfigValue('execution.runEnv') || 'qa';
    const filePath = path.resolve(__dirname, `../resources/data/${env}/credencial.yml`);

    const data = this.loadYaml(filePath);
    const obj = data[key];

    if (!obj || typeof obj !== 'object') {
      const message = `Block '${key}' not found or invalid`;
      Logger.error(`[YamlReader] ${message}`);
      throw new Error(message);
    }

    Logger.info(`[YamlReader] YAML block '${key}' successfully loaded`);
    return obj;
  }

  /**
   * Loads and parses a YAML file from the given path.
   * @param filePath - Absolute path to the YAML file
   * @returns Parsed YAML content as an object
   * @throws If the file cannot be read or parsed
   */
  private static loadYaml(filePath: string): Record<string, any> {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return yaml.load(fileContents) as Record<string, any>;
    } catch (error: any) {
      Logger.error(`[YamlReader] Failed to load YAML file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reads BrowserStack capabilities from a YAML file based on the selected device.
   * @param device - Device name (e.g., 'desktop', 'mobile', 'tablet')
   * @returns Object containing the capabilities for the specified device
   * @throws If the file cannot be read or parsed
   */
  static readCapabilities(device: string): Record<string, any> {
    const filePath = path.resolve(__dirname, `../resources/config/capabilities/${device}.yml`);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const capabilities = yaml.load(fileContents) as Record<string, any>;
      Logger.info(`[YamlReader] Capabilities for device '${device}' successfully loaded`);
      return capabilities;
    } catch (error: any) {
      Logger.error(`[YamlReader] Failed to load capabilities for device '${device}': ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieves a value from test-config.yml using dot notation (e.g., 'project.name').
   *
   * @param keyPath - Dot notation path to the desired key
   * @returns The value found at the specified path
   * @throws If the key is not found
   */
  static getConfigValue(keyPath: string): any {
    if (!this.configCache) {
      const fileContent = fs.readFileSync(this.configPath, 'utf8');
      this.configCache = yaml.load(fileContent) as Record<string, any>;
      Logger.info(`[YamlReader] test-config.yml loaded into memory`);
    }

    const value = keyPath
      .split('.')
      .reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), this.configCache);

    if (value === undefined) {
      Logger.error(`[YamlReader] Key '${keyPath}' not found in test-config.yml`);
      throw new Error(`Key '${keyPath}' not found in test-config.yml`);
    }

    // Remova este log se quiser evitar repetição
    // Logger.info(`[YamlReader] Key '${keyPath}' successfully retrieved from test-config.yml`);
    return value;
  }
}