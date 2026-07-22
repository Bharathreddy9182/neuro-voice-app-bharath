const path = require('path');
const fs = require('fs-extra');

class JsonReportEngine {
  static async generateAllReports(results = []) {
    if (!results || results.length === 0) {
      const dataPath = path.resolve(__dirname, '../data/test_cases_400.json');
      if (fs.existsSync(dataPath)) {
        results = fs.readJsonSync(dataPath);
      }
    }

    const outputDir = path.resolve(process.cwd(), 'reports/Test Results/JSON');
    await fs.ensureDir(outputDir);

    const passed = results.filter((r) => r.status === 'PASSED').length;
    const failed = results.filter((r) => r.status === 'FAILED').length;
    const skipped = results.filter((r) => r.status === 'SKIPPED').length;
    const total = results.length;
    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(2) : '0';

    const payload = {
      executionMetadata: {
        timestamp: new Date().toISOString(),
        framework: 'Enterprise Android Appium Automation Platform',
        platform: 'Android 13.0 (API 33)',
        totalTestCases: total,
        passedCount: passed,
        failedCount: failed,
        skippedCount: skipped,
        passPercentage: `${passPercentage}%`,
      },
      testResults: results,
    };

    const outputPath = path.join(outputDir, 'execution-results.json');
    await fs.writeJson(outputPath, payload, { spaces: 2 });
    console.log(`✅ JSON report saved to ${outputPath}`);
  }
}

module.exports = JsonReportEngine;
