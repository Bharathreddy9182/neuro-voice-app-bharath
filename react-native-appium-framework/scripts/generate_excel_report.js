const ExcelReporter = require('../utils/ExcelReporter');
const HtmlReporter = require('../utils/HtmlReporter');

async function runReportGenerator() {
  console.log('Generating initial E2E Excel Test Execution & Analysis Report...');

  const mockTestResults = [
    {
      id: 'TC_01',
      module: 'Authentication',
      title: 'TC_01: Verify Welcome Screen & Navigate to Registration',
      status: 'PASSED',
      duration: 1250,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Launch Application', status: 'PASSED', remarks: 'App launched successfully' },
        { action: 'Click Get Started Button', status: 'PASSED', remarks: 'Navigated to Register' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_02',
      module: 'Authentication',
      title: 'TC_02: Register New User Account Successfully',
      status: 'PASSED',
      duration: 2100,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Enter Full Name, Phone, Password', status: 'PASSED', remarks: 'Inputs filled' },
        { action: 'Click Register Account', status: 'PASSED', remarks: 'Registration API 200 OK' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_03',
      module: 'Authentication',
      title: 'TC_03: Login with Registered Credentials',
      status: 'PASSED',
      duration: 1850,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Enter Phone & Password', status: 'PASSED', remarks: 'Credentials entered' },
        { action: 'Click Login', status: 'PASSED', remarks: 'Authenticated, JWT stored' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_04',
      module: 'Dashboard',
      title: 'TC_04: Verify Dashboard Overview Metrics & Quick Actions',
      status: 'PASSED',
      duration: 980,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Fetch Dashboard API Data', status: 'PASSED', remarks: 'Reminders & Memories metrics loaded' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_05',
      module: 'Reminders',
      title: 'TC_05: End-to-End Reminders Management (Create & Verify)',
      status: 'PASSED',
      duration: 1650,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Navigate to Reminders tab', status: 'PASSED', remarks: 'Reminders page displayed' },
        { action: 'Add Reminder "Take Evening Walk"', status: 'PASSED', remarks: 'Reminder saved' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_06',
      module: 'Memories',
      title: 'TC_06: End-to-End Memories Journaling & Memory Health Tracking',
      status: 'PASSED',
      duration: 1420,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Log Memory Entry', status: 'PASSED', remarks: 'Memory recorded' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_07',
      module: 'Medications',
      title: 'TC_07: End-to-End Medication Tracking & Schedule setup',
      status: 'PASSED',
      duration: 1530,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Add Medication "Vitamin D3"', status: 'PASSED', remarks: 'Medication added' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_08',
      module: 'Emergency Contacts',
      title: 'TC_08: End-to-End Emergency Contacts Setup',
      status: 'PASSED',
      duration: 1310,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Add Primary Emergency Contact', status: 'PASSED', remarks: 'Contact saved' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_09',
      module: 'Voice AI Companion',
      title: 'TC_09: End-to-End Voice AI Assistant Query Execution',
      status: 'PASSED',
      duration: 2450,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Submit Voice Query', status: 'PASSED', remarks: 'AI response rendered' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
    {
      id: 'TC_10',
      module: 'Profile & Settings',
      title: 'TC_10: Verify Profile Details & Perform Secure Logout',
      status: 'PASSED',
      duration: 1100,
      error: '',
      screenshotPath: 'N/A',
      steps: [
        { action: 'Click Logout', status: 'PASSED', remarks: 'Session cleared' },
      ],
      device: 'Android Emulator (Pixel 6)',
    },
  ];

  const summaryData = {
    environment: 'QA',
    deviceName: 'Pixel_6_API_33',
    platformVersion: '13.0',
    duration: 14790,
  };

  const excelPath = await ExcelReporter.generateReport(mockTestResults, summaryData);
  const htmlPath = HtmlReporter.generateReport(mockTestResults, summaryData);

  console.log(`\n✅ Excel Analysis Report Generated: ${excelPath}`);
  console.log(`✅ HTML Interactive Report Generated: ${htmlPath}\n`);
}

runReportGenerator();
