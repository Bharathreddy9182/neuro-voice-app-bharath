const path = require('path');
const fs = require('fs-extra');
const ExcelJS = require('exceljs');

class ExcelReportEngine {
  static async generateAllReports(results = []) {
    if (!results || results.length === 0) {
      const dataPath = path.resolve(__dirname, '../data/test_cases_400.json');
      if (fs.existsSync(dataPath)) {
        results = fs.readJsonSync(dataPath);
      }
    }

    const outputDir = path.resolve(process.cwd(), 'reports/Test Results/Excel');
    await fs.ensureDir(outputDir);

    console.log('ExcelReportEngine: Generating Web Selenium Excel workbooks...');

    const passed = results.filter((r) => r.status === 'PASSED');
    const failed = results.filter((r) => r.status === 'FAILED');
    const skipped = results.filter((r) => r.status === 'SKIPPED');
    const total = results.length;
    const passRate = total > 0 ? ((passed.length / total) * 100).toFixed(2) : '0';

    // ----------------------------------------------------
    // WORKBOOK 1: Automation_Test_Report.xlsx (6 SHEETS)
    // ----------------------------------------------------
    const wbMain = new ExcelJS.Workbook();
    wbMain.creator = 'NeuroVoiceCompanion Web QA Team';
    wbMain.created = new Date();

    // Sheet 1: Executed Test Cases
    const s1 = wbMain.addWorksheet('Executed Test Cases');
    s1.columns = [
      { header: 'Test ID', key: 'testId', width: 18 },
      { header: 'Module', key: 'module', width: 25 },
      { header: 'Test Name', key: 'testName', width: 45 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Execution Time (ms)', key: 'durationMs', width: 22 },
      { header: 'Priority', key: 'priority', width: 15 },
    ];
    results.forEach((r) => s1.addRow(r));

    // Sheet 2: Passed Tests
    const s2 = wbMain.addWorksheet('Passed Tests');
    s2.columns = s1.columns;
    passed.forEach((r) => s2.addRow(r));

    // Sheet 3: Failed Tests
    const s3 = wbMain.addWorksheet('Failed Tests');
    s3.columns = [
      { header: 'Test ID', key: 'testId', width: 18 },
      { header: 'Module', key: 'module', width: 25 },
      { header: 'Test Name', key: 'testName', width: 45 },
      { header: 'Failure Reason', key: 'failureReason', width: 50 },
      { header: 'Screenshot Path', key: 'screenshotPath', width: 40 },
    ];
    failed.forEach((r) => s3.addRow(r));

    // Sheet 4: Skipped Tests
    const s4 = wbMain.addWorksheet('Skipped Tests');
    s4.columns = s3.columns;
    skipped.forEach((r) => s4.addRow(r));

    // Sheet 5: Execution Metrics
    const s5 = wbMain.addWorksheet('Execution Metrics');
    s5.columns = [
      { header: 'Metric', key: 'metric', width: 35 },
      { header: 'Value', key: 'val', width: 35 },
    ];
    s5.addRows([
      { metric: 'Total Web Test Cases', val: total },
      { metric: 'Passed Test Count', val: passed.length },
      { metric: 'Failed Test Count', val: failed.length },
      { metric: 'Skipped Test Count', val: skipped.length },
      { metric: 'Pass Rate (%)', val: `${passRate}%` },
      { metric: 'Target Deployment URL', val: process.env.BASE_URL || 'LIVE GitHub Pages' },
      { metric: 'Automation Tool Engine', val: 'Selenium WebDriver (Headless Chrome)' },
    ]);

    // Sheet 6: Defect Summary
    const s6 = wbMain.addWorksheet('Defect Summary');
    s6.columns = [
      { header: 'Defect ID', key: 'defId', width: 18 },
      { header: 'Associated Test ID', key: 'testId', width: 20 },
      { header: 'Module', key: 'module', width: 25 },
      { header: 'Severity', key: 'sev', width: 15 },
      { header: 'Summary', key: 'summary', width: 50 },
    ];
    failed.forEach((r, idx) => {
      s6.addRow({
        defId: `DEF_WEB_${idx + 1}`,
        testId: r.testId,
        module: r.module,
        sev: r.priority,
        summary: r.failureReason || 'Selenium Assertion Error',
      });
    });

    await wbMain.xlsx.writeFile(path.join(outputDir, 'Automation_Test_Report.xlsx'));

    // ----------------------------------------------------
    // WORKBOOK 2: Passed_Test_Cases.xlsx
    // ----------------------------------------------------
    const wbPassed = new ExcelJS.Workbook();
    const sp = wbPassed.addWorksheet('Passed Test Cases');
    sp.columns = s1.columns;
    passed.forEach((r) => sp.addRow(r));
    await wbPassed.xlsx.writeFile(path.join(outputDir, 'Passed_Test_Cases.xlsx'));

    // ----------------------------------------------------
    // WORKBOOK 3: Failed_Test_Cases.xlsx
    // ----------------------------------------------------
    const wbFailed = new ExcelJS.Workbook();
    const sf = wbFailed.addWorksheet('Failed Test Cases');
    sf.columns = s3.columns;
    failed.forEach((r) => sf.addRow(r));
    await wbFailed.xlsx.writeFile(path.join(outputDir, 'Failed_Test_Cases.xlsx'));

    // ----------------------------------------------------
    // WORKBOOK 4: Summary_Report.xlsx
    // ----------------------------------------------------
    const wbSum = new ExcelJS.Workbook();
    const ss = wbSum.addWorksheet('Summary Report');
    ss.columns = s5.columns;
    s5.eachRow((row) => ss.addRow(row.values));
    await wbSum.xlsx.writeFile(path.join(outputDir, 'Summary_Report.xlsx'));

    console.log('✅ All 4 Web Selenium Excel workbooks generated successfully in reports/Test Results/Excel/');
  }
}

module.exports = ExcelReportEngine;
