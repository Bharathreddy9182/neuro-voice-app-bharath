const BasePage = require('./BasePage');
const profileLocators = require('../locators/ProfileLocators');

class ProfilePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = profileLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.subtitle);
  }

  async getPhoneValue() {
    return await this.getText(this.locators.phoneValue);
  }

  async getAgeValue() {
    return await this.getText(this.locators.ageValue);
  }

  async clickLogout() {
    await this.scrollToElement(this.locators.logoutButton);
    await this.click(this.locators.logoutButton);
  }
}

module.exports = ProfilePage;
