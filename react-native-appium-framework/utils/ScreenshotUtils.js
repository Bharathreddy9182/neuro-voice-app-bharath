const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');

class ScreenshotUtils {
  static getDir(subDir = 'screenshots') {
    const dir = path.resolve(process.cwd(), 'reports', subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  static async captureScreenshot(driver, name = 'screenshot') {
    if (!driver) return null;
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const filepath = path.join(this.getDir('screenshots'), filename);

      const screenshotBase64 = await driver.takeScreenshot();
      fs.writeFileSync(filepath, screenshotBase64, 'base64');
      Logger.info(`Screenshot captured: ${filepath}`);
      return filepath;
    } catch (err) {
      Logger.error(`Failed to capture screenshot: ${err.message}`);
      return null;
    }
  }

  static async captureFailureArtifacts(driver, testName = 'test_failure') {
    if (!driver) return {};
    const sanitizedName = testName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const failureDir = this.getDir('failures');

    const result = {
      screenshotPath: null,
      pageSourcePath: null,
      logcatPath: null,
      activity: null,
    };

    try {
      // 1. Screenshot
      const ssPath = path.join(failureDir, `${sanitizedName}_${timestamp}.png`);
      const ssBase64 = await driver.takeScreenshot();
      fs.writeFileSync(ssPath, ssBase64, 'base64');
      result.screenshotPath = ssPath;

      // 2. Page Source XML
      const psPath = path.join(failureDir, `${sanitizedName}_${timestamp}_page_source.xml`);
      const pageSource = await driver.getPageSource();
      fs.writeFileSync(psPath, pageSource, 'utf8');
      result.pageSourcePath = psPath;

      // 3. Current Activity
      try {
        result.activity = await driver.getCurrentActivity();
      } catch (e) {
        result.activity = 'Unknown';
      }

      Logger.info(`Failure artifacts generated for test [${testName}] in: ${failureDir}`);
    } catch (err) {
      Logger.error(`Error saving failure artifacts for [${testName}]: ${err.message}`);
    }

    return result;
  }
}

module.exports = ScreenshotUtils;
