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
   * @param environment Name of the environment (e.g., 'qa', 'prod')
   * @returns URL as a string
   */
  static readUrl(environment: string): string {
    const filePath = path.resolve(__dirname, `../resources/config/url-${environment}.yml`);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const parsed = yaml.load(fileContents) as { url: string };
      Logger.info(`Environment URL '${environment}' was successfully accessed from YAML file`);
      return parsed.url;
    } catch (error: any) {
      Logger.error(`Failed to access environment URL '${environment}': ${error.message}`);
      throw error;
    }
  }

  /**
   * Reads a complete data block from a YAML file and returns it as an object.
   * @param key Root key name in the YAML file (e.g., 'valid_user')
   * @returns Object containing the data for the specified key
   */
  static readYamlObject(key: string): Record<string, any> {
    const env = process.env.RUN_ENV || 'qa';
    const filePath = path.resolve(__dirname, `../resources/data/${env}/credencial.yml`);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents) as Record<string, any>;
      Logger.info(`YAML data '${key}' loaded successfully`);

      const obj = data[key];
      if (!obj || typeof obj !== 'object') {
        throw new Error(`Block '${key}' not found or invalid`);
      }

      return obj;
    } catch (error: any) {
      Logger.error(`Failed to retrieve YAML data '${key}': ${error.message}`);
      throw error;
    }
  }

  /**
 * Reads BrowserStack capabilities from a YAML file based on the selected device.
 * @param device Device name (e.g., 'desktop', 'mobile', 'tablet')
 * @returns Object containing the capabilities
 */
  static readCapabilities(device: string): Record<string, any> {
    const filePath = path.resolve(__dirname, `../resources/config/capabilities/${device}.yml`);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const capabilities = yaml.load(fileContents) as Record<string, any>;
      Logger.info(`[BrowserStack] Capabilities for device '${device}' were successfully loaded`);
      return capabilities;
    } catch (error: any) {
      Logger.error(`[BrowserStack] Failed to load capabilities for device '${device}': ${error.message}`);
      throw error;
    }
  }
}