const BasePage = require('./BasePage');
const loginLocators = require('../locators/LoginLocators');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = loginLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.title);
  }

  async enterPhone(phone) {
    await this.type(this.locators.phoneInput, phone);
  }

  async enterPassword(password) {
    await this.type(this.locators.passwordInput, password);
  }

  async clickLogin() {
    await this.click(this.locators.loginButton);
  }

  async clickCreateAccount() {
    await this.click(this.locators.createAccountLink);
  }

  async login(phone, password) {
    await this.enterPhone(phone);
    await this.enterPassword(password);
    await this.hideKeyboard();
    await this.clickLogin();
  }
}

module.exports = LoginPage;
