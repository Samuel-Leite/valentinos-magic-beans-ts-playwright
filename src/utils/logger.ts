import fs from 'fs';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

/**
 * Utility class for centralized log management using Winston.
 * Allows logging messages to both console and file, and supports log file cleanup.
 */
export class Logger {
  /**
   * Internal Winston logger instance configured with timestamp and output to console and file.
   */
  private static logger: WinstonLogger = createLogger({
    level: 'debug',
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        const env = process.env.ENV || 'unknown';
        const uuid = crypto.randomUUID(); // Native UUID generator (Node.js 16+)
        const safeMessage = typeof message === 'string' ? message : String(message);
        return `[ ${env} | ${timestamp} | ${uuid} ] [${level.toUpperCase()}] ${safeMessage}`;
      })
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'winston.log' })
    ]
  });

  /**
   * Clears the contents of the `winston.log` file and logs the action.
   */
  static clearLogFile(): void {
    try {
      fs.writeFileSync('winston.log', '', 'utf8');
      Logger.logger.info('WINSTON: log file was successfully cleared and reset');
    } catch (error: any) {
      Logger.logger.error(`WINSTON: failed to clear and reset log file: ${error.message}`);
    }
  }

  /**
   * Logs a `debug` level message.
   * @param message The message to be logged
   */
  static debug(message: string): void {
    Logger.logger.debug(message);
  }

  /**
   * Logs an `info` level message.
   * @param message The message to be logged
   */
  static info(message: string): void {
    Logger.logger.info(message);
  }

  /**
   * Logs a `warn` level message.
   * @param message The message to be logged
   */
  static warn(message: string): void {
    Logger.logger.warn(message);
  }

  /**
   * Logs an `error` level message.
   * @param message The error message to be logged
   */
  static error(message: string): void {
    Logger.logger.error(message);
  }
}