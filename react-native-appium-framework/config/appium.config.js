require('dotenv').config();

module.exports = {
  server: {
    host: process.env.APPIUM_HOST || '127.0.0.1',
    port: parseInt(process.env.APPIUM_PORT || '4723', 10),
    basePath: process.env.APPIUM_BASE_PATH || '/',
    loglevel: process.env.LOG_LEVEL || 'info',
  },
  timeouts: {
    implicit: parseInt(process.env.IMPLICIT_WAIT_MS || '10000', 10),
    explicit: parseInt(process.env.EXPLICIT_WAIT_MS || '15000', 10),
    commandTimeout: parseInt(process.env.NEW_COMMAND_TIMEOUT || '300', 10),
  },
};
