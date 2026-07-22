const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const Logger = require('./Logger');

class ExcelReporter {
  static async generateReport(testResults = [], summaryData = {}) {
    Logger.info('ExcelReporter: Generating ReactNative_E2E_Report.xlsx...');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Neuro Voice Companion QA Team';
    workbook.created = new Date();

    // ----------------------------------------------------
    // Sheet 1: Summary
    // ----------------------------------------------------
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 35 },
    ];

    const total = testResults.length;
    const passed = testResults.filter((t) => t.status === 'PASSED').length;
    const failed = testResults.filter((t) => t.status === 'FAILED').length;
    const skipped = testResults.filter((t) => t.status === 'SKIPPED').length;
    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%';

    summarySheet.addRows([
      { metric: 'Execution Date', value: new Date().toLocaleString() },
      { metric: 'Environment', value: summaryData.environment || process.env.ENV || 'QA' },
      { metric: 'Device', value: summaryData.deviceName || process.env.DEVICE_NAME || 'Android Device' },
      { metric: 'Android Version', value: summaryData.platformVersion || process.env.PLATFORM_VERSION || '13.0' },
      { metric: 'Duration (ms)', value: summaryData.duration || 0 },
      { metric: 'Total Tests', value: total },
      { metric: 'Passed Tests', value: passed },
      { metric: 'Failed Tests', value: failed },
      { metric: 'Skipped Tests', value: skipped },
      { metric: 'Pass Percentage', value: passPercentage },
    ]);

    // ----------------------------------------------------
    // Sheet 2: Test Cases
    // ----------------------------------------------------
    const testCasesSheet = workbook.addWorksheet('Test Cases');
    testCasesSheet.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario Name', key: 'name', width: 45 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 18 },
      { header: 'Device', key: 'device', width: 25 },
    ];

    testResults.forEach((t, idx) => {
      testCasesSheet.addRow({
        id: t.id || `TC_${idx + 1}`,
        module: t.module || 'General',
        name: t.title || t.name,
        status: t.status,
        duration: t.duration || 0,
        device: t.device || summaryData.deviceName || 'Android',
      });
    });

    // ----------------------------------------------------
    // Sheet 3: Failed Tests
    // ----------------------------------------------------
    const failedSheet = workbook.addWorksheet('Failed Tests');
    failedSheet.columns = [
      { header: 'Test Name', key: 'name', width: 40 },
      { header: 'Failure Reason', key: 'reason', width: 50 },
      { header: 'Screenshot Path', key: 'screenshot', width: 45 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Android Version', key: 'osVersion', width: 18 },
    ];

    const failedTests = testResults.filter((t) => t.status === 'FAILED');
    failedTests.forEach((ft) => {
      failedSheet.addRow({
        name: ft.title || ft.name,
        reason: ft.error || 'Assertion/Timeout Failure',
        screenshot: ft.screenshotPath || 'N/A',
        device: ft.device || summaryData.deviceName || 'Android',
        osVersion: summaryData.platformVersion || '13.0',
      });
    });

    // ----------------------------------------------------
    // Sheet 4: Execution Logs
    // ----------------------------------------------------
    const logsSheet = workbook.addWorksheet('Execution Logs');
    logsSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 25 },
      { header: 'Test Name', key: 'test', width: 35 },
      { header: 'Step / Action', key: 'step', width: 55 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 35 },
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

    const outputPath = path.join(reportsDir, 'ReactNative_E2E_Report.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    Logger.info(`Excel report saved successfully at: ${outputPath}`);
    return outputPath;
  }
}

module.exports = ExcelReporter;
