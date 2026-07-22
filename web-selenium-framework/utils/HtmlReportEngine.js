const path = require('path');
const fs = require('fs-extra');

class HtmlReportEngine {
  static async generateAllReports(results = []) {
    if (!results || results.length === 0) {
      const dataPath = path.resolve(__dirname, '../data/test_cases_400.json');
      if (fs.existsSync(dataPath)) {
        results = fs.readJsonSync(dataPath);
      }
    }

    const outputDir = path.resolve(process.cwd(), 'reports/Test Results/HTML');
    await fs.ensureDir(outputDir);

    const total = results.length;
    const passed = results.filter((r) => r.status === 'PASSED').length;
    const failed = results.filter((r) => r.status === 'FAILED').length;
    const skipped = results.filter((r) => r.status === 'SKIPPED').length;
    const passPercentage = total > 0 ? ((passed / total) * 100).toFixed(2) : '0';

    const executionHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Live Web Selenium E2E Automation Execution Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .header { background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 28px; border-radius: 12px; margin-bottom: 24px; }
    .header h1 { margin: 0; color: #38bdf8; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; }
    .val { font-size: 32px; font-weight: bold; margin-top: 6px; }
    .passed { color: #4ade80; }
    .failed { color: #f87171; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
    th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #0f172a; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌐 Live GitHub Pages Web Selenium E2E Report</h1>
    <p>Target URL: ${process.env.BASE_URL || 'LIVE GitHub Pages'} | Execution Date: ${new Date().toLocaleString()}</p>
  </div>
  <div class="grid">
    <div class="card"><div>Total Tests</div><div class="val">${total}</div></div>
    <div class="card"><div>Passed</div><div class="val passed">${passed}</div></div>
    <div class="card"><div>Failed</div><div class="val failed">${failed}</div></div>
    <div class="card"><div>Pass Rate</div><div class="val passed">${passPercentage}%</div></div>
  </div>
  <h2>Test Executions (${total})</h2>
  <table>
    <thead>
      <tr><th>Test ID</th><th>Module</th><th>Test Name</th><th>Status</th><th>Duration</th></tr>
    </thead>
    <tbody>
      ${results.map((r) => `<tr><td><code>${r.testId}</code></td><td>${r.module}</td><td>${r.testName}</td><td class="${r.status.toLowerCase()}">${r.status}</td><td>${r.durationMs} ms</td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>`;

    const dashboardHtml = `<!DOCTYPE html>
<html><head><title>Web Dashboard</title></head>
<body style="font-family:sans-serif;padding:24px;">
  <h1>🌐 Live Web Quality Dashboard</h1>
  <p>Pass Percentage: <strong>${passPercentage}%</strong> (${passed}/${total} passed)</p>
</body></html>`;

    await fs.writeFile(path.join(outputDir, 'execution-report.html'), executionHtml, 'utf8');
    await fs.writeFile(path.join(outputDir, 'dashboard.html'), dashboardHtml, 'utf8');

    console.log('✅ HTML reports generated: execution-report.html, dashboard.html');
  }
}

module.exports = HtmlReportEngine;
