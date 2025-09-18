import fs from 'fs';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

/**
 * Utility class for centralized log management using Winston.
 * Allows logging messages to both console and file, and supports log file cleanup.
 */
export class Logger {
  /**
   * Internal Winston logger instance configured with timestamp and output to console and file.
   */
  private static logger: WinstonLogger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
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
   * Logs an `info` level message.
   * @param message The message to be logged
   */
  static info(message: string): void {
    Logger.logger.info(message);
  }

  /**
   * Logs an `error` level message.
   * @param message The error message to be logged
   */
  static error(message: string): void {
    Logger.logger.error(message);
  }
}