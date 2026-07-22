const BasePage = require('./BasePage');
const registerLocators = require('../locators/RegisterLocators');

class RegisterPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = registerLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.heading);
  }

  async enterFullName(name) {
    await this.type(this.locators.fullNameInput, name);
  }

  async enterPhone(phone) {
    await this.type(this.locators.phoneInput, phone);
  }

  async enterAge(age) {
    await this.type(this.locators.ageInput, age.toString());
  }

  async enterPassword(password) {
    await this.type(this.locators.passwordInput, password);
  }

  async clickRegister() {
    await this.click(this.locators.registerButton);
  }

  async clickAlreadyHaveAccount() {
    await this.click(this.locators.loginLink);
  }

  async register(fullName, phone, age, password) {
    await this.enterFullName(fullName);
    await this.enterPhone(phone);
    await this.enterAge(age);
    await this.enterPassword(password);
    await this.hideKeyboard();
    await this.clickRegister();
  }
}

module.exports = RegisterPage;
