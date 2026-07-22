module = exports = {
  // Bottom Tab Bar Items
  tabs: {
    home: '//android.widget.TextView[@text="Home"] | ~Home',
    reminders: '//android.widget.TextView[@text="Reminders"] | ~Reminders',
    memories: '//android.widget.TextView[@text="Memories"] | ~Memories',
    medications: '//android.widget.TextView[@text="Meds"] | ~Meds',
    contacts: '//android.widget.TextView[@text="Contacts"] | ~Contacts',
    profile: '//android.widget.TextView[@text="Profile"] | ~Profile',
  },

  // Global Floating Action Button
  fab: '//android.widget.TextView[@text="+"]',

  // Alert Dialogs
  alert: {
    title: 'id=android:id/alertTitle',
    message: 'id=android:id/message',
    okButton: '//android.widget.Button[@text="OK"]',
  },

  // Modal Common Controls
  modal: {
    overlay: '//android.view.ViewGroup[contains(@style, "modalOverlay")]',
    cancel: '//android.widget.TextView[@text="Cancel"]',
  },
};
