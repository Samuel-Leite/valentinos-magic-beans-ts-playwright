import fs from 'fs';
import crypto from 'crypto';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import dotenv from 'dotenv';
import { YamlReader } from '../utils/yamlReader';
dotenv.config({ quiet: true });

/**
 * Centralized logging utility using Winston.
 * Supports secure logging, session tracking, and automatic sanitization of sensitive data.
 */
export class Logger {
  private static sessionId: string = crypto.randomUUID();
  private static executionId: string = '';

  /**
   * Internal Winston logger instance configured with timestamp and contextual identifiers.
   */
  private static logger: WinstonLogger = createLogger({
    level: 'debug',
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        const env = YamlReader.getConfigValue('execution.runEnv') || 'unknown';
        const id = Logger.executionId || Logger.sessionId;
        const safeMessage = typeof message === 'string' ? Logger.sanitize(message) : String(message);
        return `[ ${env} | ${timestamp} | ${id} ] [${level.toUpperCase()}] ${safeMessage}`;
      })
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'winston.log' })
    ]
  });

  /**
   * Sets a unique execution ID for the current test.
   * Called before each test to isolate logs per test case.
   * @param id Optional custom ID
   */
  static setExecutionId(id?: string): void {
    Logger.executionId = id || crypto.randomUUID();
  }

  /**
   * Clears the contents of the log file.
   */
  static clearLogFile(): void {
    try {
      fs.writeFileSync('winston.log', '', 'utf8');
      Logger.logger.info(`[Logger] Log file cleared and reset`);
    } catch (error: any) {
      Logger.logger.error(`[Logger] Failed to clear log file: ${error.message}`);
    }
  }

  static debug(message: string): void {
    Logger.logger.debug(message);
  }

  static info(message: string): void {
    Logger.logger.info(message);
  }

  static warn(message: string): void {
    Logger.logger.warn(message);
  }

  static error(message: string): void {
    Logger.logger.error(message);
  }

  /**
   * Logs a sanitized debug message, removing sensitive content.
   * @param message The message to be logged
   */
  static secure(message: string): void {
    Logger.logger.debug(Logger.sanitize(message));
  }

  /**
   * Sanitizes sensitive content from log messages using regex.
   * @param message Raw log message
   * @returns Sanitized message
   */
  private static sanitize(message: string): string {
    return message
      .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '***@***.com') // email
      .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '***.***.***-**') // CPF
      .replace(/(["']?password["']?\s*[:=]\s*["']?).+?(["'])/gi, '$1******$2') // password
      .replace(/\bBearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, 'Bearer ******'); // token
  }
}