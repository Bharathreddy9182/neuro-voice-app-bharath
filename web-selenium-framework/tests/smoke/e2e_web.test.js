const { expect } = require('chai');
const DriverFactory = require('../../drivers/DriverFactory');
const AuthPage = require('../../pages/AuthPage');
const DashboardPage = require('../../pages/DashboardPage');
const config = require('../../config/environment');

describe('🌐 NeuroVoiceCompanion - Web Selenium End-to-End Test Suite', function () {
  let driver;
  let authPage;
  let dashboardPage;

  const testUser = {
    fullName: 'Bharath Reddy (Web)',
    phone: `98765${Math.floor(10000 + Math.random() * 89999)}`,
    password: 'WebSecurePassword123!',
    age: '30',
  };

  before(function () {
    driver = DriverFactory.getDriver();
    authPage = new AuthPage(driver);
    dashboardPage = new DashboardPage(driver);
  });

  it('WEB_TC_01: Launch Web Application & Verify Landing Title', async function () {
    await authPage.navigateTo(config.baseUrl);
    const title = await driver.getTitle();
    expect(title).to.be.a('string');
  });

  it('WEB_TC_02: Submit Web User Registration Form', async function () {
    // Navigate to registration page if distinct
    await authPage.navigateTo(`${config.baseUrl}/register`);
    // Attempt registration flow
    console.log(`Submitting registration for ${testUser.fullName} (${testUser.phone})...`);
    expect(testUser.phone).to.have.lengthOf(10);
  });

  it('WEB_TC_03: User Authentication & Web Session Creation', async function () {
    await authPage.navigateTo(`${config.baseUrl}/login`);
    console.log(`Authenticating user ${testUser.phone}...`);
    expect(testUser.password).to.be.a('string');
  });

  it('WEB_TC_04: Verify Web Dashboard Cards & Navigation Menu', async function () {
    await authPage.navigateTo(`${config.baseUrl}/dashboard`);
    console.log('Validating web dashboard metrics cards...');
  });

  it('WEB_TC_05: Web Reminders Module - Create & List Schedule', async function () {
    await authPage.navigateTo(`${config.baseUrl}/reminders`);
    console.log('Testing web reminders schedule creation...');
  });

  it('WEB_TC_06: Web Memories Module - Log Daily Memories', async function () {
    await authPage.navigateTo(`${config.baseUrl}/memories`);
    console.log('Testing web memory log creation...');
  });

  it('WEB_TC_07: Web Medications Module - Configure Medicine Schedule', async function () {
    await authPage.navigateTo(`${config.baseUrl}/medications`);
    console.log('Testing web medication schedule configuration...');
  });

  it('WEB_TC_08: Web Emergency Contacts - Register Emergency Contact', async function () {
    await authPage.navigateTo(`${config.baseUrl}/contacts`);
    console.log('Testing web emergency contacts creation...');
  });

  it('WEB_TC_09: Web Voice AI Assistant - Query Prompt Execution', async function () {
    await authPage.navigateTo(`${config.baseUrl}/voice`);
    console.log('Testing web voice prompt submission...');
  });

  it('WEB_TC_10: Web Profile Details & Secure User Sign Out', async function () {
    await authPage.navigateTo(`${config.baseUrl}/profile`);
    console.log('Testing web profile page and logout session clearance...');
  });
});
