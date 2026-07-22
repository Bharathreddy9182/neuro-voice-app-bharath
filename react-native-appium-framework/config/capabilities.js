const path = require('path');
require('dotenv').config();

function getCapabilities(overrideCaps = {}) {
  const defaultApkPath = path.resolve(process.cwd(), process.env.APK_PATH || './app/app-release.apk');

  const capabilities = {
    platformName: process.env.PLATFORM_NAME || 'Android',
    'appium:automationName': process.env.AUTOMATION_NAME || 'UiAutomator2',
    'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': process.env.PLATFORM_VERSION || '13.0',
    'appium:app': defaultApkPath,
    'appium:appPackage': process.env.APP_PACKAGE || 'com.sandeepreddy9392.neurovoiceapp',
    'appium:appActivity': process.env.APP_ACTIVITY || 'com.sandeepreddy9392.neurovoiceapp.MainActivity',
    'appium:autoGrantPermissions': process.env.AUTO_GRANT_PERMISSIONS === 'true',
    'appium:noReset': process.env.NO_RESET === 'true',
    'appium:fullReset': process.env.FULL_RESET === 'true',
    'appium:newCommandTimeout': parseInt(process.env.NEW_COMMAND_TIMEOUT || '300', 10),
    'appium:ensureCleanPackageState': false,
    ...overrideCaps,
  };

  return capabilities;
}

module.exports = {
  getCapabilities,
};
