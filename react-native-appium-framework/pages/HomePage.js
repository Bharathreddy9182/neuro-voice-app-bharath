const BasePage = require('./BasePage');
const homeLocators = require('../locators/HomeLocators');

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = homeLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.greeting);
  }

  async getGreetingText() {
    return await this.getText(this.locators.greeting);
  }

  async getUserNameText() {
    return await this.getText(this.locators.userName);
  }

  async clickStartTalking() {
    await this.click(this.locators.startTalkingButton);
  }
}

module.exports = HomePage;
