const { expect } = require('chai');
const DriverFactory = require('../../drivers/DriverFactory');
const WelcomePage = require('../../pages/WelcomePage');
const RegisterPage = require('../../pages/RegisterPage');
const LoginPage = require('../../pages/LoginPage');

describe('🔐 Authentication & Validation Test Suite', function () {
  let driver;
  let welcomePage;
  let registerPage;
  let loginPage;

  before(function () {
    driver = DriverFactory.getDriver();
    welcomePage = new WelcomePage(driver);
    registerPage = new RegisterPage(driver);
    loginPage = new LoginPage(driver);
  });

  it('AUTH_01: Verify Form Validation on Empty Registration Submit', async function () {
    const isRegisterLoaded = await registerPage.isLoaded();
    if (!isRegisterLoaded) {
      await welcomePage.clickGetStarted();
    }
    await registerPage.clickRegister();
    const isErrorVisible = await registerPage.isDisplayed(registerPage.locators.errorMessage);
    expect(isErrorVisible).to.be.true;
  });

  it('AUTH_02: Verify Error Handling for Invalid Login Credentials', async function () {
    await registerPage.clickLoginLink();
    await loginPage.login('0000000000', 'WrongPassword123');
    const isLoginErrorVisible = await loginPage.isDisplayed(loginPage.locators.errorMessage);
    expect(isLoginErrorVisible).to.be.true;
  });
});
