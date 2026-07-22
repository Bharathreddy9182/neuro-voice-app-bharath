const path = require('path');
const fs = require('fs');
const winston = require('winston');

const logsDir = path.resolve(process.cwd(), 'reports', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    step: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    step: 'cyan',
    info: 'green',
    debug: 'grey',
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'execution.log'),
      level: 'debug',
    }),
  ],
});

class Logger {
  static info(message, ...meta) {
    logger.info(message + (meta.length ? ' ' + JSON.stringify(meta) : ''));
  }

  static warn(message, ...meta) {
    logger.warn(message + (meta.length ? ' ' + JSON.stringify(meta) : ''));
  }

  static error(message, ...meta) {
    logger.error(message + (meta.length ? ' ' + JSON.stringify(meta) : ''));
  }

  static debug(message, ...meta) {
    logger.debug(message + (meta.length ? ' ' + JSON.stringify(meta) : ''));
  }

  static step(message) {
    logger.log('step', `---> ${message}`);
  }
}

module.exports = Logger;
