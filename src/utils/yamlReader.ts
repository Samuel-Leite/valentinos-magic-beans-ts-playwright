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
    const env = process.env.RUN_ENV || 'qa';
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
}