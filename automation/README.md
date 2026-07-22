# 📱 Enterprise Android Appium E2E Automation Framework & CI/CD Pipeline

This repository houses an enterprise-grade, production-ready **Android Mobile Automation Platform** featuring **510 automated test cases**, **multi-format Excel & HTML report engines**, and a **21-stage GitHub Actions CI/CD pipeline** with automated **GitHub Pages report publishing**.

---

## 📁 Repository Directory Structure

```text
automation/
├── config/
│   ├── appium.config.js       # Appium 2.x & UiAutomator2 server configurations
│   └── environment.js         # Base URL, API Endpoints, Timeouts
├── data/
│   ├── test_data.json         # Parameterized test datasets
│   └── test_cases_400.json    # Master registry of 510 test cases across 20 modules
├── drivers/
│   └── DriverFactory.js       # Appium Driver session manager with retry
├── listeners/
│   └── TestListener.js        # Event listener tracking test start, pass, fail
├── pages/                     # Page Object Model (POM) classes
│   ├── BasePage.js            # Foundation page object with fluent waits
│   ├── AuthPage.js            # Authentication & Registration page objects
│   └── DashboardPage.js       # Dashboard overview page objects
├── reports/                   # Compiled execution reports
│   └── Test Results/
│       ├── Excel/             # 4 Workbooks (Automation_Test_Report.xlsx, etc.)
│       ├── HTML/              # 3 Dashboards (execution-report.html, etc.)
│       ├── JSON/              # execution-results.json
│       └── Summary/           # summary.md (GitHub Job Summary)
├── runners/
│   └── TestRunner.js          # Master execution engine for 510 test cases
├── scripts/
│   └── generate_400_test_cases.js # Generator for 510 executable test cases
└── utils/
    ├── ExcelReportEngine.js   # Multi-sheet Excel workbook generator (exceljs)
    ├── HtmlReportEngine.js    # Interactive HTML Dashboard generator
    ├── JsonReportEngine.js    # JSON Execution schema compiler
    └── MarkdownSummaryEngine.js # GitHub Actions job summary builder
```

---

## 📊 510 Test Cases Distribution Across 20 Modules

| Module | Test Cases Count | ID Prefix |
|---|---|---|
| **Authentication** | 40 Test Cases | `TC_AUTH_*` |
| **Authorization** | 30 Test Cases | `TC_AZ_*` |
| **Registration** | 20 Test Cases | `TC_REG_*` |
| **Profile Management** | 20 Test Cases | `TC_PROF_*` |
| **Navigation** | 30 Test Cases | `TC_NAV_*` |
| **Dashboard** | 20 Test Cases | `TC_DASH_*` |
| **Forms** | 40 Test Cases | `TC_FORM_*` |
| **CRUD Operations** | 40 Test Cases | `TC_CRUD_*` |
| **Search** | 20 Test Cases | `TC_SRCH_*` |
| **Filters** | 20 Test Cases | `TC_FLTR_*` |
| **Input Validation** | 40 Test Cases | `TC_VAL_*` |
| **Error Handling** | 20 Test Cases | `TC_ERR_*` |
| **Session Management** | 20 Test Cases | `TC_SESS_*` |
| **Notifications** | 20 Test Cases | `TC_NOTIF_*` |
| **File Upload** | 20 Test Cases | `TC_FILE_*` |
| **Offline Handling** | 10 Test Cases | `TC_OFF_*` |
| **Accessibility** | 20 Test Cases | `TC_ACC_*` |
| **Responsive UI** | 10 Test Cases | `TC_RESP_*` |
| **Performance Smoke Tests** | 20 Test Cases | `TC_PERF_*` |
| **Regression Suite** | 50 Test Cases | `TC_REGRESSION_*` |
| **TOTAL** | **510 Test Cases** | |

---

## 💻 Local Execution Guide

### Prerequisites
- Node.js v18+ or v20+
- Java Development Kit (JDK 17)
- Android SDK & Android Emulator (API 33)
- Appium Server 2.x (`npm install -g appium`)

### Steps
1. Navigate into the automation folder:
   ```bash
   cd automation
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Execute the 510+ test case master suite:
   ```bash
   npm run test:400
   ```
4. View generated report workbooks in `reports/Test Results/Excel/`:
   - `Automation_Test_Report.xlsx` (7 sheets)
   - `Passed_Test_Cases.xlsx`
   - `Failed_Test_Cases.xlsx`
   - `Execution_Summary.xlsx`

---

## 🌐 GitHub Pages Live Report URL

Once deployed via GitHub Actions, your live report is accessible at:  
`https://<github-username>.github.io/neuro-voice-app-bharath/reports/latest/execution-report.html`

Historical report archives are maintained at:  
`https://<github-username>.github.io/neuro-voice-app-bharath/reports/history/build-N/execution-report.html`
