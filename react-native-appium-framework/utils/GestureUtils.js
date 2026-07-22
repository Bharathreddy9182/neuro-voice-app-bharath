const Logger = require('./Logger');

class GestureUtils {
  static async tap(driver, x, y) {
    Logger.step(`Performing tap gesture at coordinates (${x}, ${y})`);
    await driver.action('pointer', { pointerType: 'touch' })
      .move({ duration: 0, x, y })
      .down({ button: 0 })
      .pause(50)
      .up({ button: 0 })
      .perform();
  }

  static async doubleTap(driver, x, y) {
    Logger.step(`Performing double-tap gesture at coordinates (${x}, ${y})`);
    await this.tap(driver, x, y);
    await driver.pause(100);
    await this.tap(driver, x, y);
  }

  static async longPress(driver, x, y, durationMs = 1000) {
    Logger.step(`Performing long press at (${x}, ${y}) for ${durationMs}ms`);
    await driver.action('pointer', { pointerType: 'touch' })
      .move({ duration: 0, x, y })
      .down({ button: 0 })
      .pause(durationMs)
      .up({ button: 0 })
      .perform();
  }

  static async swipe(driver, startX, startY, endX, endY, durationMs = 600) {
    Logger.step(`Swiping from (${startX}, ${startY}) to (${endX}, ${endY})`);
    await driver.action('pointer', { pointerType: 'touch' })
      .move({ duration: 0, x: startX, y: startY })
      .down({ button: 0 })
      .pause(100)
      .move({ duration: durationMs, x: endX, y: endY })
      .up({ button: 0 })
      .perform();
  }

  static async swipeUp(driver, percentage = 0.6) {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.8);
    const endY = Math.round(height * (0.8 - percentage));
    await this.swipe(driver, startX, startY, startX, endY);
  }

  static async swipeDown(driver, percentage = 0.6) {
    const { width, height } = await driver.getWindowSize();
    const startX = Math.round(width / 2);
    const startY = Math.round(height * 0.2);
    const endY = Math.round(height * (0.2 + percentage));
    await this.swipe(driver, startX, startY, startX, endY);
  }

  static async swipeLeft(driver, percentage = 0.7) {
    const { width, height } = await driver.getWindowSize();
    const startY = Math.round(height / 2);
    const startX = Math.round(width * 0.85);
    const endX = Math.round(width * (0.85 - percentage));
    await this.swipe(driver, startX, startY, endX, startY);
  }

  static async swipeRight(driver, percentage = 0.7) {
    const { width, height } = await driver.getWindowSize();
    const startY = Math.round(height / 2);
    const startX = Math.round(width * 0.15);
    const endX = Math.round(width * (0.15 + percentage));
    await this.swipe(driver, startX, startY, endX, startY);
  }

  static async dragAndDrop(driver, startX, startY, endX, endY) {
    Logger.step(`Drag and drop from (${startX}, ${startY}) to (${endX}, ${endY})`);
    await this.swipe(driver, startX, startY, endX, endY, 1200);
  }

  static async pinch(driver, scale = 0.5) {
    Logger.step(`Performing pinch gesture (scale: ${scale})`);
    const { width, height } = await driver.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const offset = Math.round(width * 0.3);

    await Promise.all([
      this.swipe(driver, centerX - offset, centerY, centerX - Math.round(offset * scale), centerY),
      this.swipe(driver, centerX + offset, centerY, centerX + Math.round(offset * scale), centerY),
    ]);
  }

  static async zoom(driver, scale = 1.5) {
    Logger.step(`Performing zoom gesture (scale: ${scale})`);
    const { width, height } = await driver.getWindowSize();
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const startOffset = Math.round(width * 0.1);
    const endOffset = Math.round(width * 0.4);

    await Promise.all([
      this.swipe(driver, centerX - startOffset, centerY, centerX - endOffset, centerY),
      this.swipe(driver, centerX + startOffset, centerY, centerX + endOffset, centerY),
    ]);
  }
}

module.exports = GestureUtils;
