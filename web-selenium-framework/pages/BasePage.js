const { By, until } = require('selenium-webdriver');
const path = require('path');
const fs = require('fs');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.defaultTimeout = 10000;
  }

  async navigateTo(url) {
    await this.driver.get(url);
  }

  async findElement(byLocator) {
    await this.driver.wait(until.elementLocated(byLocator), this.defaultTimeout);
    const element = await this.driver.findElement(byLocator);
    await this.driver.wait(until.elementIsVisible(element), this.defaultTimeout);
    return element;
  }

  async click(byLocator) {
    const element = await this.findElement(byLocator);
    await element.click();
  }

  async type(byLocator, text) {
    const element = await this.findElement(byLocator);
    await element.clear();
    await element.sendKeys(text);
  }

  async getText(byLocator) {
    const element = await this.findElement(byLocator);
    return await element.getText();
  }

  async isDisplayed(byLocator) {
    try {
      const element = await this.findElement(byLocator);
      return await element.isDisplayed();
    } catch (err) {
      return false;
    }
  }

  async takeScreenshot(filename) {
    const image = await this.driver.takeScreenshot();
    const reportsDir = path.resolve(process.cwd(), 'reports', 'screenshots');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const screenshotPath = path.join(reportsDir, `${filename}_${Date.now()}.png`);
    fs.writeFileSync(screenshotPath, image, 'base64');
    return screenshotPath;
  }
}

module.exports = BasePage;
