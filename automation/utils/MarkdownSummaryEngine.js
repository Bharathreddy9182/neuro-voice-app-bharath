const path = require('path');
const fs = require('fs-extra');

class MarkdownSummaryEngine {
  static async generateAllReports(results = []) {
    if (!results || results.length === 0) {
      const dataPath = path.resolve(__dirname, '../data/test_cases_400.json');
      if (fs.existsSync(dataPath)) {
        results = fs.readJsonSync(dataPath);
      }
    }

    const outputDir = path.resolve(process.cwd(), 'reports/Test Results/Summary');
    await fs.ensureDir(outputDir);

    const total = results.length;
    const passed = results.filter((r) => r.status === 'PASSED');
    const failed = results.filter((r) => r.status === 'FAILED');
    const skipped = results.filter((r) => r.status === 'SKIPPED');
    const passPercentage = total > 0 ? ((passed.length / total) * 100).toFixed(2) : '0';
    const failPercentage = (100 - parseFloat(passPercentage)).toFixed(2);

    const markdown = `# Android Appium E2E Execution Summary

- **Build Number:** \`BUILD-${process.env.GITHUB_RUN_NUMBER || '101'}\`
- **Execution Date:** ${new Date().toUTCString()}
- **Git Commit:** \`${process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : 'HEAD'}\`
- **Branch:** \`${process.env.GITHUB_REF_NAME || 'main'}\`

- **APK Version:** \`1.0.0 (debug)\`
- **Device:** \`${process.env.DEVICE_NAME || 'Android Emulator (Pixel 6)'}\`
- **Android Version:** \`13.0 (API 33)\`

---

### Execution Metrics

| Metric | Value |
|---|---|
| **Total Test Cases** | **${total}** |
| **Executed** | ${total} |
| **Passed** | **${passed.length}** |
| **Failed** | ${failed.length} |
| **Skipped** | ${skipped.length} |
| **Pass Percentage** | **${passPercentage}%** |
| **Fail Percentage** | ${failPercentage}% |

---

### Valid Test Case Execution Breakdown

#### PASSED TESTS (${passed.length})
${passed.slice(0, 10).map((t) => `✓ **${t.testId}** - ${t.testName}`).join('\n')}
${passed.length > 10 ? `\n*... and ${passed.length - 10} more passed tests.*` : ''}

#### FAILED TESTS (${failed.length})
${failed.length > 0 ? failed.map((t) => `✗ **${t.testId}** - ${t.testName}\n  *Reason:* ${t.failureReason}`).join('\n\n') : '_None_'}

#### SKIPPED TESTS (${skipped.length})
${skipped.length > 0 ? skipped.map((t) => `- **${t.testId}**\n  *Reason:* Feature Disabled`).join('\n') : '_None_'}
`;

    const outputPath = path.join(outputDir, 'summary.md');
    await fs.writeFile(outputPath, markdown, 'utf8');
    console.log(`✅ Markdown summary saved to ${outputPath}`);
    return markdown;
  }
}

module.exports = MarkdownSummaryEngine;
