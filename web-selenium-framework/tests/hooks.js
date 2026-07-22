const DriverFactory = require('../drivers/DriverFactory');
const ExcelReporter = require('../utils/ExcelReporter');
const config = require('../config/environment');

const testResults = [];

exports.mochaHooks = {
  async beforeAll() {
    console.log('Global Hook: Initializing Selenium WebDriver session...');
    await DriverFactory.createDriver();
  },

  async beforeEach() {
    console.log(`Starting Web Test: "${this.currentTest.title}"`);
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
      errorMessage = test.err ? test.err.message : 'Unknown Selenium Exception';
      console.error(`Web Test Failed: "${test.title}" - ${errorMessage}`);

      try {
        const driver = DriverFactory.getDriver();
        if (driver) {
          const image = await driver.takeScreenshot();
          const path = require('path');
          const fs = require('fs');
          const reportsDir = path.resolve(process.cwd(), 'reports', 'screenshots');
          if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
          }
          const sanitizedName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
          screenshotPath = path.join(reportsDir, `${sanitizedName}_${Date.now()}.png`);
          fs.writeFileSync(screenshotPath, image, 'base64');
        }
      } catch (err) {
        console.warn('Failed to capture failure screenshot:', err.message);
      }
    } else if (test.state === 'pending') {
      status = 'SKIPPED';
    } else {
      console.log(`Web Test Passed: "${test.title}" (${duration} ms)`);
    }

    testResults.push({
      id: `WEB_TC_${testResults.length + 1}`,
      module: test.parent ? test.parent.title : 'Web E2E Suite',
      title: test.title,
      status: status,
      duration: duration,
      error: errorMessage,
      screenshotPath: screenshotPath,
      steps: test.steps || [],
      browser: config.browser,
    });
  },

  async afterAll() {
    console.log('Global Hook: Teardown & Generating Excel Analysis Report...');
    try {
      await ExcelReporter.generateReport(testResults, {
        environment: 'QA / Staging Web',
        browser: `${config.browser} (Selenium WebDriver)`,
      });
    } catch (err) {
      console.error('Failed to generate Excel report:', err.message);
    } finally {
      await DriverFactory.quitDriver();
    }
  },
};
