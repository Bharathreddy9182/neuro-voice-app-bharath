const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AuthPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.phoneInput = By.css('input[name="phone"], input[type="tel"], #phone');
    this.passwordInput = By.css('input[name="password"], input[type="password"], #password');
    this.fullNameInput = By.css('input[name="full_name"], input[name="name"], #fullName');
    this.ageInput = By.css('input[name="age"], #age');
    this.loginButton = By.css('button[type="submit"], #loginBtn, .login-button');
    this.registerButton = By.css('button[type="submit"], #registerBtn, .register-button');
    this.createAccountLink = By.css('a[href*="register"], #createAccountLink');
  }

  async login(phone, password) {
    await this.type(this.phoneInput, phone);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async register(fullName, phone, password, age) {
    await this.type(this.fullNameInput, fullName);
    await this.type(this.phoneInput, phone);
    await this.type(this.passwordInput, password);
    await this.type(this.ageInput, age);
    await this.click(this.registerButton);
  }
}

module.exports = AuthPage;
