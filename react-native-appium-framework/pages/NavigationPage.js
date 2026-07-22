const BasePage = require('./BasePage');
const commonLocators = require('../locators/CommonLocators');

class NavigationPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = commonLocators.tabs;
  }

  async navigateToHome() {
    await this.click(this.locators.home);
  }

  async navigateToReminders() {
    await this.click(this.locators.reminders);
  }

  async navigateToMemories() {
    await this.click(this.locators.memories);
  }

  async navigateToMedications() {
    await this.click(this.locators.medications);
  }

  async navigateToContacts() {
    await this.click(this.locators.contacts);
  }

  async navigateToProfile() {
    await this.click(this.locators.profile);
  }
}

module.exports = NavigationPage;
