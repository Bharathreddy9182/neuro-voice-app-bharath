const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');

class HtmlReporter {
  static generateReport(testResults = [], summaryData = {}) {
    Logger.info('HtmlReporter: Generating HTML report index.html...');

    const total = testResults.length;
    const passed = testResults.filter((t) => t.status === 'PASSED').length;
    const failed = testResults.filter((t) => t.status === 'FAILED').length;
    const skipped = testResults.filter((t) => t.status === 'SKIPPED').length;
    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Neuro Voice Companion - E2E Automation Report</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; }
    .card .val { font-size: 32px; font-weight: bold; margin-top: 8px; }
    .passed { color: #16a34a; }
    .failed { color: #dc2626; }
    .skipped { color: #d97706; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 14px 18px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .badge-passed { background: #dcfce7; color: #15803d; }
    .badge-failed { background: #fee2e2; color: #b91c1c; }
    .badge-skipped { background: #fef3c7; color: #b45309; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧠 Neuro Voice Companion - Automation Execution Report</h1>
    <p>Package: com.sandeepreddy9392.neurovoiceapp | Execution Time: ${new Date().toLocaleString()}</p>
  </div>

  <div class="grid">
    <div class="card"><div>Total Tests</div><div class="val">${total}</div></div>
    <div class="card"><div>Passed</div><div class="val passed">${passed}</div></div>
    <div class="card"><div>Failed</div><div class="val failed">${failed}</div></div>
    <div class="card"><div>Skipped</div><div class="val skipped">${skipped}</div></div>
    <div class="card"><div>Pass Rate</div><div class="val">${passPercentage}%</div></div>
  </div>

  <h2>Test Scenarios</h2>
  <table>
    <thead>
      <tr>
        <th>Scenario</th>
        <th>Status</th>
        <th>Duration (ms)</th>
        <th>Error Details</th>
      </tr>
    </thead>
    <tbody>
      ${testResults
        .map(
          (t) => `
        <tr>
          <td><strong>${t.title || t.name}</strong></td>
          <td><span class="badge badge-${(t.status || 'passed').toLowerCase()}">${t.status}</span></td>
          <td>${t.duration || 0} ms</td>
          <td>${t.error ? `<span style="color:red">${t.error}</span>` : '-'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;

    const reportsDir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const outputPath = path.join(reportsDir, 'index.html');
    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    Logger.info(`HTML report generated at: ${outputPath}`);
    return outputPath;
  }
}

module.exports = HtmlReporter;
