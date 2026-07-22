const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

class ExcelReporter {
  static async generateReport(testResults = [], summaryData = {}) {
    console.log('ExcelReporter: Generating Web_E2E_Selenium_Report.xlsx...');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'NeuroVoiceCompanion Web QA Automation Team';
    workbook.created = new Date();

    // ----------------------------------------------------
    // Sheet 1: Executive Summary
    // ----------------------------------------------------
    const summarySheet = workbook.addWorksheet('Executive Summary');
    summarySheet.columns = [
      { header: 'Metric Name', key: 'metric', width: 32 },
      { header: 'Value / Details', key: 'value', width: 40 },
    ];

    const total = testResults.length;
    const passed = testResults.filter((t) => t.status === 'PASSED').length;
    const failed = testResults.filter((t) => t.status === 'FAILED').length;
    const skipped = testResults.filter((t) => t.status === 'SKIPPED').length;
    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%';

    summarySheet.addRows([
      { metric: 'Automation Tool', value: 'Selenium WebDriver (Node.js)' },
      { metric: 'Execution Timestamp', value: new Date().toLocaleString() },
      { metric: 'Environment', value: summaryData.environment || 'QA / Staging' },
      { metric: 'Browser Engine', value: summaryData.browser || 'Google Chrome (Headless)' },
      { metric: 'Total Web Tests Executed', value: total },
      { metric: 'Passed Scenarios', value: passed },
      { metric: 'Failed Scenarios', value: failed },
      { metric: 'Skipped Scenarios', value: skipped },
      { metric: 'Overall Pass Rate', value: passPercentage },
    ]);

    // ----------------------------------------------------
    // Sheet 2: Web Test Cases
    // ----------------------------------------------------
    const testCasesSheet = workbook.addWorksheet('Web Test Scenarios');
    testCasesSheet.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Feature Module', key: 'module', width: 22 },
      { header: 'Scenario Title', key: 'name', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 18 },
      { header: 'Browser Target', key: 'browser', width: 28 },
    ];

    testResults.forEach((t, idx) => {
      testCasesSheet.addRow({
        id: t.id || `WEB_TC_${idx + 1}`,
        module: t.module || 'Web E2E',
        name: t.title || t.name,
        status: t.status,
        duration: t.duration || 0,
        browser: t.browser || summaryData.browser || 'Chrome',
      });
    });

    // ----------------------------------------------------
    // Sheet 3: Failure Analysis
    // ----------------------------------------------------
    const failedSheet = workbook.addWorksheet('Failure Analysis');
    failedSheet.columns = [
      { header: 'Failed Scenario Title', key: 'name', width: 45 },
      { header: 'Root Cause / Exception Message', key: 'reason', width: 60 },
      { header: 'Screenshot Proof Path', key: 'screenshot', width: 50 },
    ];

    const failedTests = testResults.filter((t) => t.status === 'FAILED');
    failedTests.forEach((ft) => {
      failedSheet.addRow({
        name: ft.title || ft.name,
        reason: ft.error || 'Assertion Error or Element Not Found Exception',
        screenshot: ft.screenshotPath || 'N/A',
      });
    });

    // ----------------------------------------------------
    // Sheet 4: Execution Step Logs
    // ----------------------------------------------------
    const logsSheet = workbook.addWorksheet('Execution Step Logs');
    logsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 25 },
      { header: 'Test Scenario', key: 'test', width: 40 },
      { header: 'Action Step', key: 'step', width: 50 },
      { header: 'Step Status', key: 'status', width: 15 },
      { header: 'Remarks / Response', key: 'remarks', width: 40 },
    ];

    testResults.forEach((t) => {
      if (t.steps && Array.isArray(t.steps)) {
        t.steps.forEach((s) => {
          logsSheet.addRow({
            timestamp: s.timestamp || new Date().toISOString(),
            test: t.title || t.name,
            step: s.action || s.message,
            status: s.status || t.status,
            remarks: s.remarks || '',
          });
        });
      }
    });

    const reportsDir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const outputPath = path.join(reportsDir, 'Web_E2E_Selenium_Report.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`Excel report saved successfully at: ${outputPath}`);
    return outputPath;
  }
}

module.exports = ExcelReporter;
