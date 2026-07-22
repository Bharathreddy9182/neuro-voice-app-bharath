const BasePage = require('./BasePage');
const remindersLocators = require('../locators/RemindersLocators');

class RemindersPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = remindersLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.headerTitle);
  }

  async clickAddReminderFAB() {
    await this.click(this.locators.fab);
  }

  async addReminder(title, description, date, time, priority = 'medium') {
    await this.clickAddReminderFAB();
    await this.waitForVisible(this.locators.modalTitle);
    await this.type(this.locators.titleInput, title);
    await this.type(this.locators.descriptionInput, description);
    await this.type(this.locators.dateInput, date);
    await this.type(this.locators.timeInput, time);
    await this.type(this.locators.priorityInput, priority);
    await this.hideKeyboard();
    await this.click(this.locators.modalSaveButton);
  }
}

module.exports = RemindersPage;
