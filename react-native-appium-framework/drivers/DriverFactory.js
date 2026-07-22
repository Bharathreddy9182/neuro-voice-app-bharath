const AppiumDriver = require('./AppiumDriver');
const DeviceUtils = require('../utils/DeviceUtils');
const Logger = require('../utils/Logger');

class DriverFactory {
  static async createDriver(options = {}) {
    Logger.info('DriverFactory: Setting up device capabilities...');

    let detectedDevice = null;
    try {
      detectedDevice = await DeviceUtils.getFirstAvailableDevice();
    } catch (err) {
      Logger.warn('ADB device auto-detection skipped or failed:', err.message);
    }

    const mergedCaps = { ...options };

    if (detectedDevice && detectedDevice.udid) {
      mergedCaps['appium:udid'] = detectedDevice.udid;
      mergedCaps['appium:deviceName'] = detectedDevice.name || detectedDevice.udid;
      if (detectedDevice.version) {
        mergedCaps['appium:platformVersion'] = detectedDevice.version;
      }
      Logger.info(`Using detected device: ${detectedDevice.udid} (OS: ${detectedDevice.version || 'Unknown'})`);
    }

    return await AppiumDriver.initDriver(mergedCaps);
  }

  static getDriver() {
    return AppiumDriver.getDriver();
  }

  static async quitDriver() {
    await AppiumDriver.quitDriver();
  }
}

module.exports = DriverFactory;
