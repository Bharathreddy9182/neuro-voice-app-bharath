require('dotenv').config();

module.exports = {
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: parseInt(process.env.APPIUM_PORT || '4723', 10),
  path: '/',
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    'appium:platformVersion': process.env.PLATFORM_VERSION || '13.0',
    'appium:app': process.env.APK_PATH || './app-debug.apk',
    'appium:appPackage': 'com.sandeepreddy9392.neurovoiceapp',
    'appium:appActivity': '.MainActivity',
    'appium:newCommandTimeout': 300,
    'appium:noReset': false,
    'appium:fullReset': false,
  },
};
