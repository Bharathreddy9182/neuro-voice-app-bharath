const Logger = require('../utils/Logger');
const WaitUtils = require('../utils/WaitUtils');
const ScreenshotUtils = require('../utils/ScreenshotUtils');
const appiumConfig = require('../config/appium.config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async resolveLocator(selector) {
    if (!selector) throw new Error('Selector cannot be empty');
    if (selector.startsWith('//') || selector.startsWith('id=') || selector.startsWith('~') || selector.startsWith('android=')) {
      return selector;
    }
    // Fallback order: testID -> accessibilityLabel -> Text
    return `~${selector}`;
  }

  async findElement(selector) {
    const loc = await this.resolveLocator(selector);
    try {
      return await this.driver.$(loc);
    } catch (err) {
      Logger.error(`Failed to find element with selector [${loc}]: ${err.message}`);
      throw err;
    }
  }

  async click(selector) {
    const loc = await this.resolveLocator(selector);
    Logger.step(`Clicking element: ${loc}`);
    const el = await WaitUtils.waitForClickable(this.driver, loc);
    await el.click();
  }

  async type(selector, text) {
    const loc = await this.resolveLocator(selector);
    Logger.step(`Typing "${text}" into element [${loc}]`);
    const el = await WaitUtils.waitForVisible(this.driver, loc);
    await el.setValue(text);
  }

  async clear(selector) {
    const loc = await this.resolveLocator(selector);
    Logger.step(`Clearing input field [${loc}]`);
    const el = await WaitUtils.waitForVisible(this.driver, loc);
    await el.clearValue();
  }

  async getText(selector) {
    const loc = await this.resolveLocator(selector);
    const el = await WaitUtils.waitForVisible(this.driver, loc);
    const text = await el.getText();
    Logger.info(`Retrieved text from [${loc}]: "${text}"`);
    return text;
  }

  async isDisplayed(selector) {
    try {
      const loc = await this.resolveLocator(selector);
      const el = await this.driver.$(loc);
      return await el.isDisplayed();
    } catch (err) {
      return false;
    }
  }

  async waitForVisible(selector, timeoutMs = appiumConfig.timeouts.explicit) {
    const loc = await this.resolveLocator(selector);
    return await WaitUtils.waitForVisible(this.driver, loc, timeoutMs);
  }

  async waitForClickable(selector, timeoutMs = appiumConfig.timeouts.explicit) {
    const loc = await this.resolveLocator(selector);
    return await WaitUtils.waitForClickable(this.driver, loc, timeoutMs);
  }

  async scrollToElement(selector) {
    const loc = await this.resolveLocator(selector);
    Logger.step(`Scrolling to element: ${loc}`);
    const cleanText = selector.replace('~', '').replace(/\/\/[^"]*"([^"]*)".*/, '$1');
    const uiScrollableSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${cleanText}"))`;
    try {
      return await this.driver.$(`android=${uiScrollableSelector}`);
    } catch (err) {
      Logger.warn(`Scroll via text search failed, trying text lookup...`);
      return await this.scrollToText(cleanText);
    }
  }

  async scrollToText(text) {
    Logger.step(`Scrolling to visible text: "${text}"`);
    const uiScrollableSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${text}"))`;
    return await this.driver.$(`android=${uiScrollableSelector}`);
  }

  async takeScreenshot(name) {
    return await ScreenshotUtils.captureScreenshot(this.driver, name);
  }

  async back() {
    Logger.step('Pressing hardware back button');
    await this.driver.back();
  }

  async hideKeyboard() {
    Logger.step('Hiding keyboard');
    try {
      if (await this.driver.isKeyboardShown()) {
        await this.driver.hideKeyboard();
      }
    } catch (err) {
      Logger.debug('Keyboard hide skipped or not active:', err.message);
    }
  }
}

module.exports = BasePage;
