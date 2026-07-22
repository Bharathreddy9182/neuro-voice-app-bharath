const BasePage = require('./BasePage');
const memoriesLocators = require('../locators/MemoriesLocators');

class MemoriesPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = memoriesLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.headerTitle);
  }

  async saveMemory(memoryText) {
    await this.type(this.locators.memoryTextInput, memoryText);
    await this.hideKeyboard();
    await this.click(this.locators.saveMemoryButton);
  }
}

module.exports = MemoriesPage;
