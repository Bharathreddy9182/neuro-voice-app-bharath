const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.welcomeHeader = By.css('.welcome-header, h1, #welcomeGreeting');
    this.remindersTab = By.css('a[href*="reminders"], #navReminders');
    this.memoriesTab = By.css('a[href*="memories"], #navMemories');
    this.medicationsTab = By.css('a[href*="medications"], #navMedications');
    this.contactsTab = By.css('a[href*="contacts"], #navContacts');
    this.voiceTab = By.css('a[href*="voice"], #navVoice');
    this.profileTab = By.css('a[href*="profile"], #navProfile');
  }

  async getWelcomeText() {
    return await this.getText(this.welcomeHeader);
  }

  async goToReminders() {
    await this.click(this.remindersTab);
  }

  async goToMemories() {
    await this.click(this.memoriesTab);
  }

  async goToMedications() {
    await this.click(this.medicationsTab);
  }

  async goToContacts() {
    await this.click(this.contactsTab);
  }

  async goToVoice() {
    await this.click(this.voiceTab);
  }

  async goToProfile() {
    await this.click(this.profileTab);
  }
}

module.exports = DashboardPage;
