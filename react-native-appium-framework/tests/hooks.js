const DriverFactory = require('../drivers/DriverFactory');
const ExcelReporter = require('../utils/ExcelReporter');
const HtmlReporter = require('../utils/HtmlReporter');
const ScreenshotUtils = require('../utils/ScreenshotUtils');
const Logger = require('../utils/Logger');

const testResults = [];

exports.mochaHooks = {
  async beforeAll() {
    Logger.info('Global Hook: Initializing Appium Driver Session...');
    await DriverFactory.createDriver();
  },

  async beforeEach() {
    Logger.info(`Starting Test: "${this.currentTest.title}"`);
    this.currentTest.startTime = Date.now();
    this.currentTest.steps = [];
  },

  async afterEach() {
    const test = this.currentTest;
    const duration = Date.now() - (test.startTime || Date.now());
    let status = 'PASSED';
    let errorMessage = '';
    let screenshotPath = 'N/A';

    if (test.state === 'failed') {
      status = 'FAILED';
      errorMessage = test.err ? test.err.message : 'Unknown error';
      Logger.error(`Test Failed: "${test.title}" - ${errorMessage}`);

      try {
        const driver = DriverFactory.getDriver();
        if (driver) {
          const sanitizedName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
          screenshotPath = await ScreenshotUtils.captureFailureScreenshot(driver, sanitizedName);
        }
      } catch (err) {
        Logger.warn(`Failed to capture screenshot for test "${test.title}":`, err.message);
      }
    } else if (test.state === 'pending') {
      status = 'SKIPPED';
    } else {
      Logger.info(`Test Passed: "${test.title}" (${duration} ms)`);
    }

    testResults.push({
      id: `TC_${testResults.length + 1}`,
      module: test.parent ? test.parent.title : 'E2E Suite',
      title: test.title,
      status: status,
      duration: duration,
      error: errorMessage,
      screenshotPath: screenshotPath,
      steps: test.steps || [],
      device: process.env.DEVICE_NAME || 'Android Emulator',
    });
  },

  async afterAll() {
    Logger.info('Global Hook: Teardown and Generating Reports...');
    try {
      await ExcelReporter.generateReport(testResults, {
        environment: process.env.ENV || 'QA',
        deviceName: process.env.DEVICE_NAME || 'Android Device',
        platformVersion: process.env.PLATFORM_VERSION || '13.0',
      });
      HtmlReporter.generateReport(testResults);
    } catch (err) {
      Logger.error('Failed to generate test reports:', err.message);
    } finally {
      await DriverFactory.quitDriver();
    }
  },
};
