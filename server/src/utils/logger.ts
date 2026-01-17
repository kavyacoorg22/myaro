import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { appConfig } from '../infrastructure/config/config';

const isDev = appConfig.server.nodeEnv === 'development';

// Logs folder
const logDir = path.join(process.cwd(), 'logs');

/* ---------------- CUSTOM FORMAT (DEV) ---------------- */
const customFormat = format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return `${timestamp} ${level}: ${stack || message}${metaString}`;
});

/* ---------------- LOGGER ---------------- */
const logger = createLogger({
  level: 'info',

  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    isDev ? customFormat : format.json()
  ),

  transports: [

    /* -------- FILE LOG (ALL LEVELS) -------- */
    new DailyRotateFile({
      dirname: logDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',     // rotate after 100MB
      maxFiles: '14d',     // keep logs for 14 days
      zippedArchive: true,
      level: 'info',
    }),

    /* -------- FILE LOG (ERROR ONLY) -------- */
    new DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
      zippedArchive: true,
      level: 'error',
    }),

    /* -------- CONSOLE (DEV ONLY) -------- */
    ...(isDev
      ? [
          new transports.Console({
            format: format.combine(format.colorize(), customFormat),
          }),
        ]
      : []),
  ],
});

export default logger;
