const BasePage = require('./BasePage');
const medicationsLocators = require('../locators/MedicationsLocators');

class MedicationsPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.locators = medicationsLocators;
  }

  async isLoaded() {
    return await this.isDisplayed(this.locators.headerTitle);
  }

  async clickAddMedicationFAB() {
    await this.click(this.locators.fab);
  }

  async addMedication(medicineName, dosage, time) {
    await this.clickAddMedicationFAB();
    await this.waitForVisible(this.locators.modalTitle);
    await this.type(this.locators.medicineNameInput, medicineName);
    await this.type(this.locators.dosageInput, dosage);
    await this.type(this.locators.timeInput, time);
    await this.hideKeyboard();
    await this.click(this.locators.saveMedicationButton);
  }

  async markFirstTaken() {
    await this.click(this.locators.markTakenButton);
  }
}

module.exports = MedicationsPage;
