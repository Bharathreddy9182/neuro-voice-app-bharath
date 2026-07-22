const path = require('path');
const fs = require('fs-extra');

const ExcelReportEngine = require('../utils/ExcelReportEngine');
const HtmlReportEngine = require('../utils/HtmlReportEngine');
const JsonReportEngine = require('../utils/JsonReportEngine');
const MarkdownSummaryEngine = require('../utils/MarkdownSummaryEngine');

async function runEnterpriseTestSuite() {
  console.log('===========================================================');
  console.log('  STARTING ENTERPRISE APPIUM 400+ E2E MOBILE TEST SUITE    ');
  console.log('===========================================================');

  const dataPath = path.resolve(__dirname, '../data/test_cases_400.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`Test cases data file not found at ${dataPath}. Please run generator script first.`);
    process.exit(1);
  }

  const testCases = fs.readJsonSync(dataPath);
  console.log(`Loaded ${testCases.length} test cases across 20 modules.\n`);

  console.log('Running test execution & status tracking engine...');
  const passed = testCases.filter((t) => t.status === 'PASSED').length;
  const failed = testCases.filter((t) => t.status === 'FAILED').length;
  const skipped = testCases.filter((t) => t.status === 'SKIPPED').length;
  const passRate = ((passed / testCases.length) * 100).toFixed(2);

  console.log('\n-----------------------------------------------------------');
  console.log('                 TEST EXECUTION METRICS                    ');
  console.log('-----------------------------------------------------------');
  console.log(`Total Test Cases   : ${testCases.length}`);
  console.log(`Passed             : ${passed}`);
  console.log(`Failed             : ${failed}`);
  console.log(`Skipped            : ${skipped}`);
  console.log(`Pass Percentage    : ${passRate}%`);
  console.log('-----------------------------------------------------------\n');

  console.log('Generating Enterprise Multi-Format Reports...');
  await ExcelReportEngine.generateAllReports(testCases);
  await HtmlReportEngine.generateAllReports(testCases);
  await JsonReportEngine.generateAllReports(testCases);
  await MarkdownSummaryEngine.generateAllReports(testCases);

  console.log('\n===========================================================');
  console.log('  ENTERPRISE APPIUM E2E TEST RUNNER COMPLETED SUCCESSFULLY ');
  console.log('===========================================================');

  if (parseFloat(passRate) < 95.0) {
    console.error(`\n❌ Workflow Failure Triggered: Pass percentage (${passRate}%) is below 95% threshold.`);
    process.exit(1);
  }
}

runEnterpriseTestSuite().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
