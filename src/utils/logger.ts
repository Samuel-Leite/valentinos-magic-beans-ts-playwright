import fs from 'fs';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

export class Logger {
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

  static clearLogFile(): void {
    try {
      fs.writeFileSync('winston.log', '', 'utf8');
      Logger.logger.info('WINSTON: arquivo do log foi apagado e restaurado com sucesso');
    } catch (error: any) {
      Logger.logger.error(`WINSTON: falha ao apagar e restaurar o arquivo do log: ${error.message}`);
    }
  }

  static info(message: string): void {
    Logger.logger.info(message);
  }

  static error(message: string): void {
    Logger.logger.error(message);
  }
}