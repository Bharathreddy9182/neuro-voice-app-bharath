const BasePage = require('./BasePage');
const welcomeLocators = require('../locators/WelcomeLocators');

class WelcomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = welcomeLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.title);
  }

  async clickGetStarted() {
    await this.click(this.locators.getStartedButton);
  }
}

module.exports = WelcomePage;
