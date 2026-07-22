const path = require('path');
const fs = require('fs');
const Logger = require('./Logger');

class AIAnalyzer {
  static analyzePageSource(pageSourceXml) {
    Logger.info('AIAnalyzer: Analyzing page source hierarchy...');

    if (!pageSourceXml || typeof pageSourceXml !== 'string') {
      return { error: 'Invalid or empty page source XML provided' };
    }

    const editTexts = (pageSourceXml.match(/class="android.widget.EditText"/g) || []).length;
    const textViews = (pageSourceXml.match(/class="android.widget.TextView"/g) || []).length;
    const viewGroups = (pageSourceXml.match(/class="android.view.ViewGroup"/g) || []).length;
    const clickableElements = (pageSourceXml.match(/clickable="true"/g) || []).length;
    const testIDsCount = (pageSourceXml.match(/resource-id="[^"]*test[^"]*"/gi) || []).length;
    const accessibilityLabelsCount = (pageSourceXml.match(/content-desc="[^"]+"/gi) || []).length;

    const analysis = {
      timestamp: new Date().toISOString(),
      elementsCount: {
        inputs: editTexts,
        textLabels: textViews,
        containers: viewGroups,
        clickableItems: clickableElements,
      },
      accessibilityMetrics: {
        testIDsFound: testIDsCount,
        contentDescriptionsFound: accessibilityLabelsCount,
        accessibilityCoverageScore:
          clickableElements > 0
            ? `${(((testIDsCount + accessibilityLabelsCount) / clickableElements) * 100).toFixed(1)}%`
            : '100%',
      },
      recommendations: [],
      suggestedUserJourneys: [],
    };

    if (editTexts > 0) {
      analysis.suggestedUserJourneys.push('Form Input Validation Journey');
      analysis.suggestedUserJourneys.push('Input Sanitization & Boundary Testing');
    }
    if (clickableElements > 0) {
      analysis.suggestedUserJourneys.push('Tap Navigation & State Transition Journey');
    }
    if (testIDsCount === 0 && accessibilityLabelsCount === 0) {
      analysis.recommendations.push(
        'Add testID props to React Native TouchableOpacity and TextInput components to improve Appium test stability.'
      );
    }

    return analysis;
  }

  static async exportAnalysisReport(driver, reportName = 'screen_analysis') {
    if (!driver) return null;

    try {
      const source = await driver.getPageSource();
      const report = this.analyzePageSource(source);

      const aiDir = path.resolve(process.cwd(), 'reports', 'ai_analysis');
      if (!fs.existsSync(aiDir)) {
        fs.mkdirSync(aiDir, { recursive: true });
      }

      const jsonPath = path.join(aiDir, `${reportName}_${Date.now()}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

      const mdPath = path.join(aiDir, `${reportName}_${Date.now()}.md`);
      const mdContent = `# AI Screen Analysis Report
- **Timestamp:** ${report.timestamp}
- **Inputs Found:** ${report.elementsCount.inputs}
- **Text Labels:** ${report.elementsCount.textLabels}
- **Clickable Elements:** ${report.elementsCount.clickableItems}
- **Accessibility Coverage:** ${report.accessibilityMetrics.accessibilityCoverageScore}

## Recommendations
${report.recommendations.map((r) => `- ${r}`).join('\n') || '- No critical recommendations'}

## Suggested Journeys
${report.suggestedUserJourneys.map((j) => `- ${j}`).join('\n') || '- Standard Screen Inspection'}
`;
      fs.writeFileSync(mdPath, mdContent, 'utf8');

      Logger.info(`AI analysis exported: ${jsonPath}`);
      return report;
    } catch (err) {
      Logger.error(`AI analysis failed: ${err.message}`);
      return null;
    }
  }
}

module.exports = AIAnalyzer;
