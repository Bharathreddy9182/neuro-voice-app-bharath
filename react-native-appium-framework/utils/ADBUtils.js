const { execSync } = require('child_process');
const Logger = require('./Logger');

class ADBUtils {
  static runADBCommand(command) {
    try {
      const output = execSync(`adb ${command}`, { encoding: 'utf8' });
      return output.trim();
    } catch (err) {
      Logger.debug(`ADB command failed [adb ${command}]: ${err.message}`);
      return '';
    }
  }

  static getConnectedDevices() {
    const rawOutput = this.runADBCommand('devices');
    const lines = rawOutput.split('\n').slice(1);
    const devices = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2 && parts[1] === 'device') {
        const udid = parts[0];
        const version = this.runADBCommand(`-s ${udid} shell getprop ro.build.version.release`);
        const model = this.runADBCommand(`-s ${udid} shell getprop ro.product.model`);
        devices.push({
          udid,
          version: version || 'Unknown',
          model: model || udid,
          isEmulator: udid.startsWith('emulator-'),
        });
      }
    }

    Logger.info(`ADB Detected connected devices count: ${devices.length}`);
    return devices;
  }

  static isPackageInstalled(packageName, targetDeviceUdid = null) {
    const deviceFlag = targetDeviceUdid ? `-s ${targetDeviceUdid}` : '';
    const output = this.runADBCommand(`${deviceFlag} shell pm list packages ${packageName}`);
    return output.includes(`package:${packageName}`);
  }

  static installAPK(apkPath, targetDeviceUdid = null) {
    const deviceFlag = targetDeviceUdid ? `-s ${targetDeviceUdid}` : '';
    Logger.info(`Installing APK [${apkPath}] via ADB on device ${targetDeviceUdid || 'default'}...`);
    const output = this.runADBCommand(`${deviceFlag} install -r -g "${apkPath}"`);
    return output.includes('Success');
  }

  static uninstallApp(packageName, targetDeviceUdid = null) {
    const deviceFlag = targetDeviceUdid ? `-s ${targetDeviceUdid}` : '';
    Logger.info(`Uninstalling package [${packageName}] via ADB...`);
    return this.runADBCommand(`${deviceFlag} uninstall ${packageName}`);
  }

  static clearAppData(packageName, targetDeviceUdid = null) {
    const deviceFlag = targetDeviceUdid ? `-s ${targetDeviceUdid}` : '';
    Logger.info(`Clearing app data for package [${packageName}]...`);
    return this.runADBCommand(`${deviceFlag} shell pm clear ${packageName}`);
  }

  static captureLogcat(outputPath, targetDeviceUdid = null) {
    const deviceFlag = targetDeviceUdid ? `-s ${targetDeviceUdid}` : '';
    Logger.info(`Saving logcat to ${outputPath}...`);
    this.runADBCommand(`${deviceFlag} logcat -d > "${outputPath}"`);
  }
}

module.exports = ADBUtils;
