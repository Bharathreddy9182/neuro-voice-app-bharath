module.exports = {
  title: '//android.widget.TextView[contains(@text, "Neuro Voice Assistant")]',
  micButton: '//android.widget.TextView[@text="🎤"]',
  statusText: '//android.widget.TextView[contains(@text, "microphone to speak") or contains(@text, "Listening")]',
  manualTextInput: '//android.widget.EditText[@hint="Or type your question..." or @text="Or type your question..."]',
  askAIButton: '//android.widget.TextView[@text="Ask AI"]',
  youSaidLabel: '//android.widget.TextView[@text="You Said"]',
  aiReplyLabel: '//android.widget.TextView[@text="AI Reply"]',
  youSaidCard: '//android.widget.TextView[@text="You Said"]/following-sibling::android.view.ViewGroup[1]//android.widget.TextView',
  aiReplyCard: '//android.widget.TextView[@text="AI Reply"]/following-sibling::android.view.ViewGroup[1]//android.widget.TextView',
};
