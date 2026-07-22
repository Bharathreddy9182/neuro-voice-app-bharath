module.exports = {
  greeting: '//android.widget.TextView[contains(@text, "Good Morning")]',
  userName: '//android.widget.TextView[contains(@text, "Good Morning")]/following-sibling::android.widget.TextView[1]',
  subtitle: '//android.widget.TextView[contains(@text, "Stay organized")]',

  totalRemindersStat: '//android.widget.TextView[@text="Total"]/preceding-sibling::android.widget.TextView[1]',
  pendingRemindersStat: '//android.widget.TextView[@text="Pending"]/preceding-sibling::android.widget.TextView[1]',
  completedRemindersStat: '//android.widget.TextView[@text="Completed"]/preceding-sibling::android.widget.TextView[1]',

  medicinesStat: '//android.widget.TextView[contains(@text, "Medicines")]/preceding-sibling::android.widget.TextView[1]',
  pendingMedsStat: '//android.widget.TextView[contains(@text, "Pending Meds")]/preceding-sibling::android.widget.TextView[1]',

  memoryHealthScore: '//android.widget.TextView[contains(@text, "Score:")]',

  aiAssistantTitle: '//android.widget.TextView[contains(@text, "AI Assistant")]',
  startTalkingButton: '//android.widget.TextView[@text="Start Talking"]',

  todaysRemindersSection: '//android.widget.TextView[@text="Today\'s Reminders"]',
  noRemindersText: '//android.widget.TextView[contains(@text, "No reminders today")]',

  recentMemorySection: '//android.widget.TextView[@text="Recent Memory"]',
  recentMemoryText: '//android.widget.TextView[@text="Recent Memory"]/following-sibling::android.view.ViewGroup//android.widget.TextView',
};
