const { expect } = require('chai');
const DriverFactory = require('../../drivers/DriverFactory');

const WelcomePage = require('../../pages/WelcomePage');
const RegisterPage = require('../../pages/RegisterPage');
const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const RemindersPage = require('../../pages/RemindersPage');
const MemoriesPage = require('../../pages/MemoriesPage');
const MedicationsPage = require('../../pages/MedicationsPage');
const ContactsPage = require('../../pages/ContactsPage');
const VoicePage = require('../../pages/VoicePage');
const ProfilePage = require('../../pages/ProfilePage');
const NavigationPage = require('../../pages/NavigationPage');

describe('📱 NeuroVoiceCompanion - End-to-End (E2E) Mobile Automation Suite', function () {
  let driver;
  let welcomePage;
  let registerPage;
  let loginPage;
  let homePage;
  let remindersPage;
  let memoriesPage;
  let medicationsPage;
  let contactsPage;
  let voicePage;
  let profilePage;
  let navigationPage;

  const testUser = {
    fullName: 'Bharath Reddy',
    phone: `98765${Math.floor(10005 + Math.random() * 89999)}`,
    password: 'SecurePassword123!',
    age: '32',
  };

  before(function () {
    driver = DriverFactory.getDriver();
    welcomePage = new WelcomePage(driver);
    registerPage = new RegisterPage(driver);
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
    remindersPage = new RemindersPage(driver);
    memoriesPage = new MemoriesPage(driver);
    medicationsPage = new MedicationsPage(driver);
    contactsPage = new ContactsPage(driver);
    voicePage = new VoicePage(driver);
    profilePage = new ProfilePage(driver);
    navigationPage = new NavigationPage(driver);
  });

  it('TC_01: Verify Welcome Screen & Navigate to Registration', async function () {
    const isWelcomeLoaded = await welcomePage.isLoaded();
    expect(isWelcomeLoaded).to.be.true;

    await welcomePage.clickGetStarted();
    const isRegisterLoaded = await registerPage.isLoaded();
    expect(isRegisterLoaded).to.be.true;
  });

  it('TC_02: Register New User Account Successfully', async function () {
    await registerPage.register(
      testUser.fullName,
      testUser.phone,
      testUser.password,
      testUser.age
    );

    const isLoginLoaded = await loginPage.isLoaded();
    expect(isLoginLoaded).to.be.true;
  });

  it('TC_03: Login with Registered Credentials', async function () {
    await loginPage.login(testUser.phone, testUser.password);

    const isHomeLoaded = await homePage.isLoaded();
    expect(isHomeLoaded).to.be.true;
  });

  it('TC_04: Verify Dashboard Overview Metrics & Quick Actions', async function () {
    const welcomeGreeting = await homePage.getWelcomeText();
    expect(welcomeGreeting).to.be.a('string');

    const isVoiceButtonVisible = await homePage.isDisplayed(homePage.locators.voiceAssistantButton);
    expect(isVoiceButtonVisible).to.be.true;
  });

  it('TC_05: End-to-End Reminders Management (Create & Verify)', async function () {
    await navigationPage.navigateToReminders();
    const isRemindersLoaded = await remindersPage.isLoaded();
    expect(isRemindersLoaded).to.be.true;

    await remindersPage.addReminder('Take Evening Walk', '06:00 PM');
    const isReminderCreated = await remindersPage.isDisplayed(remindersPage.locators.reminderCard);
    expect(isReminderCreated).to.be.true;
  });

  it('TC_06: End-to-End Memories Journaling & Memory Health Tracking', async function () {
    await navigationPage.navigateToMemories();
    const isMemoriesLoaded = await memoriesPage.isLoaded();
    expect(isMemoriesLoaded).to.be.true;

    await memoriesPage.addMemory('Had a pleasant lunch with family today in Hyderabad.');
    const isMemorySaved = await memoriesPage.isDisplayed(memoriesPage.locators.memoryCard);
    expect(isMemorySaved).to.be.true;
  });

  it('TC_07: End-to-End Medication Tracking & Schedule setup', async function () {
    await navigationPage.navigateToMedications();
    const isMedicationsLoaded = await medicationsPage.isLoaded();
    expect(isMedicationsLoaded).to.be.true;

    await medicationsPage.addMedication('Vitamin D3', '1 Tablet', '09:00 AM');
    const isMedicationAdded = await medicationsPage.isDisplayed(medicationsPage.locators.medicationCard);
    expect(isMedicationAdded).to.be.true;
  });

  it('TC_08: End-to-End Emergency Contacts Setup', async function () {
    await navigationPage.navigateToContacts();
    const isContactsLoaded = await contactsPage.isLoaded();
    expect(isContactsLoaded).to.be.true;

    await contactsPage.addContact('Emergency Primary', '9998887770', 'Family Doctor');
    const isContactSaved = await contactsPage.isDisplayed(contactsPage.locators.contactCard);
    expect(isContactSaved).to.be.true;
  });

  it('TC_09: End-to-End Voice AI Assistant Query Execution', async function () {
    await navigationPage.navigateToVoice();
    const isVoiceLoaded = await voicePage.isLoaded();
    expect(isVoiceLoaded).to.be.true;

    await voicePage.sendQuery('What are my scheduled medications for today?');
    const isResponseReceived = await voicePage.isDisplayed(voicePage.locators.aiResponseText);
    expect(isResponseReceived).to.be.true;
  });

  it('TC_10: Verify Profile Details & Perform Secure Logout', async function () {
    await navigationPage.navigateToProfile();
    const isProfileLoaded = await profilePage.isLoaded();
    expect(isProfileLoaded).to.be.true;

    await profilePage.logout();
    const isBackToLogin = await loginPage.isLoaded();
    expect(isBackToLogin).to.be.true;
  });
});
