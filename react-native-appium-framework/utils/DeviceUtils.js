const ADBUtils = require('./ADBUtils');
const Logger = require('./Logger');

class DeviceUtils {
  static async getFirstAvailableDevice() {
    const devices = ADBUtils.getConnectedDevices();
    if (devices.length === 0) {
      Logger.warn('DeviceUtils: No connected devices found via ADB.');
      return null;
    }
    const selected = devices[0];
    Logger.info(`DeviceUtils: Selected active device UDID: [${selected.udid}] (Model: ${selected.model}, OS: ${selected.version})`);
    return selected;
  }

  static async getAllAvailableDevices() {
    return ADBUtils.getConnectedDevices();
  }
}

module.exports = DeviceUtils;
