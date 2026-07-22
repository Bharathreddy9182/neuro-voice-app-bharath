module.exports = {
  headerTitle: '//android.widget.TextView[contains(@text, "My Reminders")]',
  totalCount: '//android.widget.TextView[@text="Total"]/preceding-sibling::android.widget.TextView[1]',
  pendingCount: '//android.widget.TextView[@text="Pending"]/preceding-sibling::android.widget.TextView[1]',
  completedCount: '//android.widget.TextView[@text="Completed"]/preceding-sibling::android.widget.TextView[1]',
  noRemindersText: '//android.widget.TextView[@text="No Reminders Yet"]',

  fab: '//android.widget.TextView[@text="+"]',

  // Add Reminder Modal
  modalTitle: '//android.widget.TextView[@text="Add Reminder"]',
  titleInput: '//android.widget.EditText[@hint="Title" or @text="Title"]',
  descriptionInput: '//android.widget.EditText[@hint="Description" or @text="Description"]',
  dateInput: '//android.widget.EditText[@hint="2026-06-10" or @text="2026-06-10"]',
  timeInput: '//android.widget.EditText[@hint="08:30" or @text="08:30"]',
  priorityInput: '//android.widget.EditText[@hint="high / medium / low" or @text="high / medium / low"]',
  saveButton: '//android.widget.TextView[@text="Save Reminder"]',
  cancelButton: '//android.widget.TextView[@text="Cancel"]',
};
