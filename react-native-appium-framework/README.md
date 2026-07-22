# Neuro Voice Companion - Appium 2.x Mobile Automation Framework

An enterprise-grade, production-ready End-to-End Mobile Test Automation Framework designed for the **Neuro Voice Companion** React Native Android application (`com.sandeepreddy9392.neurovoiceapp`).

---

## 🏗 Framework Architecture

This framework is built using the **Page Object Model (POM)** pattern with Node.js (ES6+), Appium 2.x, UiAutomator2, Mocha, Chai, Winston logging, ExcelJS, Mochawesome, and an AI-Assisted Screen Analyzer.

```
react-native-appium-framework/
├── app/
│   └── app-release.apk           # Target React Native Android APK
├── config/
│   ├── appium.config.js          # Appium server host/port/timeout config
│   ├── capabilities.js           # Dynamic UiAutomator2 capability builder
│   ├── devices.js                # Real device and emulator profiles (Android 10–15)
│   └── environment.js            # Environment configs (DEV, QA, UAT, PROD)
├── drivers/
│   ├── AppiumDriver.js           # Session manager for WebdriverIO & Appium 2.x
│   └── DriverFactory.js          # Factory managing session init & ADB device selection
├── locators/
│   ├── CommonLocators.js         # Tab bar, FAB (+), Modals, and Alert dialogs
│   ├── WelcomeLocators.js        # Welcome screen locators
│   ├── LoginLocators.js          # Login screen inputs and buttons
│   ├── RegisterLocators.js       # Register screen inputs and buttons
│   ├── HomeLocators.js           # Home dashboard stats, memory score, AI trigger
│   ├── RemindersLocators.js      # Reminders screen & add modal controls
│   ├── MemoriesLocators.js       # Memory journal input & card list
│   ├── MedicationsLocators.js    # Medicine list, mark taken, add modal
│   ├── ContactsLocators.js       # Emergency contacts list & add modal
│   ├── ProfileLocators.js        # User details, stats, logout button
│   └── VoiceLocators.js          # Voice assistant mic, text query, AI response
├── pages/
│   ├── BasePage.js               # Core Page Object with locator fallbacks & action helpers
│   ├── WelcomePage.js            # Welcome screen actions
│   ├── LoginPage.js              # Login screen actions
│   ├── RegisterPage.js           # Register screen actions
│   ├── HomePage.js               # Home dashboard actions
│   ├── RemindersPage.js          # Reminders screen & modal actions
│   ├── MemoriesPage.js           # Memory journal actions
│   ├── MedicationsPage.js        # Medication list & modal actions
│   ├── ContactsPage.js           # Contacts list & modal actions
│   ├── ProfilePage.js            # Profile screen actions
│   ├── VoicePage.js              # Voice & text AI assistant actions
│   ├── NavigationPage.js         # Tab navigation helper methods
│   └── SettingsPage.js           # Non-existent feature stub & reporter
├── utils/
│   ├── Logger.js                 # Winston logger (INFO, WARN, ERROR, DEBUG, STEP)
│   ├── WaitUtils.js              # Explicit wait strategies (visibility, clickability)
│   ├── ScreenshotUtils.js        # Failure screenshots, page source, and logcat capture
│   ├── ADBUtils.js               # ADB wrapper for device detection & app lifecycle
│   ├── APKInstaller.js           # Automated APK verification & installation
│   ├── DeviceUtils.js            # Dynamic device detection & selection
│   ├── GestureUtils.js           # W3C Touch gestures (swipe, tap, longPress, pinch, drag)
│   ├── ExcelReporter.js          # 4-sheet Excel report generator (ReactNative_E2E_Report.xlsx)
│   ├── HtmlReporter.js           # Standalone HTML dashboard report generator
│   └── AIAnalyzer.js             # Page source hierarchy inspection & test journey generator
├── tests/                        # Dedicated test suites (Authentication, Forms, Nav, Gestures, Smoke, Regression)
├── reports/                      # Execution outputs (HTML, Excel, Screenshots, Failures, Logs)
├── .env.example                  # Environment template file
├── .mocharc.json                 # Mocha test runner configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # Framework documentation
```

---

## ⚡ Prerequisites & Setup

### 1. Requirements
* **Node.js**: v18.x or higher
* **Java Development Kit (JDK)**: JDK 17 / OpenJDK
* **Android SDK**: `platform-tools` (adb), `build-tools`, and Android API Level 30+
* **Appium Server**: Appium 2.x (`npm install -g appium`)
* **UiAutomator2 Driver**: `appium driver install uiautomator2`

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your target package name and activity match:
```env
APP_PACKAGE=com.sandeepreddy9392.neurovoiceapp
APP_ACTIVITY=com.sandeepreddy9392.neurovoiceapp.MainActivity
APK_PATH=./app/app-release.apk
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

---

## 🎯 Locator Strategy & Fallbacks

Since static analysis confirmed **0 `testID` and `accessibilityLabel` attributes** are present in the React Native component tree, the framework employs an automatic fallback strategy in `BasePage.js`:

$$\text{Selector Resolution}: \text{Explicit Selector (XPath / Resource ID / Accessibility ID)} \longrightarrow \text{Visible Text Search}$$

1. **XPath / Resource ID Strategy:** `//android.widget.EditText[@hint="Phone Number"]`
2. **Accessibility Description (Content-Desc):** `~Home`
3. **Text Search Strategy:** `//android.widget.TextView[@text="Login"]`

---

## 📊 Reporting Capabilities

1. **Mochawesome HTML Report:** Generated at `reports/index.html` with interactive test case breakdown and failure screenshots.
2. **ExcelJS Multi-Sheet Report:** Generates `reports/ReactNative_E2E_Report.xlsx` with:
   * **Sheet 1:** Summary (Pass %, Total/Passed/Failed count, Environment info)
   * **Sheet 2:** Test Cases (Test ID, Module, Scenario, Duration, Status)
   * **Sheet 3:** Failed Tests (Name, Reason, Failure Screenshot Path, Device ID)
   * **Sheet 4:** Execution Logs (Timestamp, Step details, Remarks)
3. **Failure Artifacts:** Automatically saved to `reports/failures/` containing:
   * Screenshot (`.png`)
   * Page Source XML (`.xml`)
   * Device Logcat Log (`.log`)

---

## 🤖 AI-Assisted Screen Analyzer

Run screen analysis on any active screen hierarchy:
```bash
npm run analyze:screen
```
The analyzer parses the active screen XML, measures input/button counts, evaluates accessibility coverage, and generates test journey suggestions exported to `reports/ai_analysis/`.
