const BasePage = require('./BasePage');
const contactsLocators = require('../locators/ContactsLocators');

class ContactsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = contactsLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.headerTitle);
  }

  async clickAddContactFAB() {
    await this.click(this.locators.fab);
  }

  async addContact(name, relationship, phone) {
    await this.clickAddContactFAB();
    await this.type(this.locators.modalNameInput, name);
    await this.type(this.locators.modalRelationshipInput, relationship);
    await this.type(this.locators.modalPhoneInput, phone);
    await this.hideKeyboard();
    await this.click(this.locators.saveContactButton);
  }
}

module.exports = ContactsPage;
