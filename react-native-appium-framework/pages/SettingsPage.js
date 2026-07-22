const BasePage = require('./BasePage');
const Logger = require('../utils/Logger');

/**
 * SettingsPage representation.
 * NOTE: Architectural analysis confirmed the Settings screen is NOT implemented in the 
 * Neuro Voice Companion application. This stub provides explicit feature unavailability reporting.
 */
class SettingsPage extends BasePage {
  constructor(driver) {
    super(driver);
  }

  async isLoaded() {
    Logger.warn('SettingsPage: Feature does not exist in Neuro Voice Companion application.');
    return false;
  }
}

module.exports = SettingsPage;
