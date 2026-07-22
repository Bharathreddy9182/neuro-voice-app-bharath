module.exports = {
  avatar: '//android.widget.TextView[@text="👤"]',
  fullName: '//android.widget.TextView[@text="👤"]/following-sibling::android.widget.TextView[1]',
  subtitle: '//android.widget.TextView[@text="Neuro Voice Companion"]',

  phoneLabel: '//android.widget.TextView[@text="Phone"]',
  phoneValue: '//android.widget.TextView[@text="Phone"]/following-sibling::android.widget.TextView[1]',
  ageLabel: '//android.widget.TextView[@text="Age"]',
  ageValue: '//android.widget.TextView[@text="Age"]/following-sibling::android.widget.TextView[1]',

  memoriesStat: '//android.widget.TextView[@text="Memories"]/preceding-sibling::android.widget.TextView[1]',
  remindersStat: '//android.widget.TextView[@text="Reminders"]/preceding-sibling::android.widget.TextView[1]',
  medicationsStat: '//android.widget.TextView[@text="Medicines"]/preceding-sibling::android.widget.TextView[1]',
  contactsStat: '//android.widget.TextView[@text="Contacts"]/preceding-sibling::android.widget.TextView[1]',

  logoutButton: '//android.widget.TextView[@text="Logout"]',
};
