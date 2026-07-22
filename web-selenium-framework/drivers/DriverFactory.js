const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const config = require('../config/environment');

let driverInstance = null;

class DriverFactory {
  static async createDriver(browserName = config.browser) {
    if (driverInstance) {
      return driverInstance;
    }

    console.log(`DriverFactory: Building Selenium WebDriver instance for [${browserName}]...`);

    const builder = new Builder().forBrowser(browserName);

    if (browserName.toLowerCase() === 'chrome') {
      const options = new chrome.Options();
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');

      if (config.headless) {
        options.addArguments('--headless=new');
      }

      builder.setChromeOptions(options);
    } else if (browserName.toLowerCase() === 'firefox') {
      const options = new firefox.Options();
      if (config.headless) {
        options.addArguments('-headless');
      }
      builder.setFirefoxOptions(options);
    }

    driverInstance = await builder.build();
    await driverInstance.manage().setTimeouts({ implicit: config.implicitWait });
    await driverInstance.manage().window().maximize();

    console.log('DriverFactory: Selenium WebDriver initialized successfully.');
    return driverInstance;
  }

  static getDriver() {
    return driverInstance;
  }

  static async quitDriver() {
    if (driverInstance) {
      try {
        await driverInstance.quit();
        console.log('DriverFactory: Selenium WebDriver session closed.');
      } catch (err) {
        console.warn('DriverFactory: Error closing driver session:', err.message);
      } finally {
        driverInstance = null;
      }
    }
  }
}

module.exports = DriverFactory;
