const Logger = require('./Logger');
const appiumConfig = require('../config/appium.config');

class WaitUtils {
  static async waitForVisible(driver, selector, timeoutMs = appiumConfig.timeouts.explicit) {
    Logger.debug(`Waiting for element to be visible: [${selector}] (timeout: ${timeoutMs}ms)`);
    const element = await driver.$(selector);
    await element.waitForDisplayed({ timeout: timeoutMs });
    return element;
  }

  static async waitForClickable(driver, selector, timeoutMs = appiumConfig.timeouts.explicit) {
    Logger.debug(`Waiting for element to be clickable: [${selector}] (timeout: ${timeoutMs}ms)`);
    const element = await driver.$(selector);
    await element.waitForClickable({ timeout: timeoutMs });
    return element;
  }

  static async waitForCondition(conditionFn, timeoutMs = appiumConfig.timeouts.explicit, message = 'Condition not met') {
    Logger.debug(`Waiting for custom condition: "${message}"`);
    await driver.waitUntil(conditionFn, {
      timeout: timeoutMs,
      timeoutMsg: message,
    });
  }

  static async sleep(ms) {
    Logger.debug(`Pausing execution for ${ms}ms...`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = WaitUtils;
