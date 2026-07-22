const BasePage = require('./BasePage');
const voiceLocators = require('../locators/VoiceLocators');

class VoicePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = voiceLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.title);
  }

  async tapMicrophone() {
    await this.click(this.locators.micButton);
  }

  async getStatusText() {
    return await this.getText(this.locators.statusText);
  }

  async typeQuestion(question) {
    await this.type(this.locators.manualTextInput, question);
  }

  async clickAskAI() {
    await this.click(this.locators.askAIButton);
  }

  async askQuestion(question) {
    await this.typeQuestion(question);
    await this.hideKeyboard();
    await this.clickAskAI();
  }

  async getAIReplyText() {
    return await this.getText(this.locators.aiReplyCard);
  }
}

module.exports = VoicePage;
