const { remote } = require('webdriverio');
const appiumConfig = require('../config/appium.config');
const { getCapabilities } = require('../config/capabilities');
const Logger = require('../utils/Logger');

class AppiumDriver {
  constructor() {
    this.driver = null;
  }

  async initDriver(customCaps = {}) {
    if (this.driver) {
      Logger.warn('Driver instance already active. Returning existing session.');
      return this.driver;
    }

    const caps = getCapabilities(customCaps);
    Logger.info('Initializing Appium 2.x session with capabilities:', caps);

    try {
      this.driver = await remote({
        hostname: appiumConfig.server.host,
        port: appiumConfig.server.port,
        path: appiumConfig.server.basePath,
        capabilities: caps,
        logLevel: 'error',
      });

      await this.driver.setTimeout({ implicit: appiumConfig.timeouts.implicit });
      Logger.info(`Session created successfully. Session ID: ${this.driver.sessionId}`);
      return this.driver;
    } catch (error) {
      Logger.error('Failed to initialize Appium session:', error.message);
      throw error;
    }
  }

  getDriver() {
    if (!this.driver) {
      throw new Error('Appium driver is not initialized. Call initDriver() first.');
    }
    return this.driver;
  }

  async quitDriver() {
    if (this.driver) {
      Logger.info('Ending Appium driver session...');
      try {
        await this.driver.deleteSession();
      } catch (err) {
        Logger.warn('Error closing Appium session:', err.message);
      } finally {
        this.driver = null;
      }
    }
  }

  async getPageSource() {
    if (!this.driver) return '';
    try {
      return await this.driver.getPageSource();
    } catch (err) {
      Logger.error('Failed to capture page source:', err.message);
      return '';
    }
  }

  async getCurrentActivity() {
    if (!this.driver) return '';
    try {
      return await this.driver.getCurrentActivity();
    } catch (err) {
      Logger.warn('Failed to retrieve current activity:', err.message);
      return '';
    }
  }
}

module.exports = new AppiumDriver();
