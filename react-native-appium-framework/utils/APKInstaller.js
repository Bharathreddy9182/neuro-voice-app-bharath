const path = require('path');
const fs = require('fs');
const ADBUtils = require('./ADBUtils');
const Logger = require('./Logger');
require('dotenv').config();

class APKInstaller {
  static async verifyAndInstallAPK(options = {}) {
    const apkPath = path.resolve(process.cwd(), options.apkPath || process.env.APK_PATH || './app/app-release.apk');
    const packageName = options.packageName || process.env.APP_PACKAGE || 'com.sandeepreddy9392.neurovoiceapp';

    if (!fs.existsSync(apkPath)) {
      Logger.warn(`APK file not found at path: ${apkPath}. Skipping automatic installation.`);
      return false;
    }

    const devices = ADBUtils.getConnectedDevices();
    if (devices.length === 0) {
      Logger.warn('No active ADB devices connected. Automatic APK installation skipped.');
      return false;
    }

    const targetDevice = devices[0].udid;
    const isInstalled = ADBUtils.isPackageInstalled(packageName, targetDevice);

    if (!isInstalled || options.forceReinstall) {
      Logger.info(`Installing/Updating app [${packageName}] from APK [${apkPath}]...`);
      const installed = ADBUtils.installAPK(apkPath, targetDevice);
      if (installed) {
        Logger.info(`App [${packageName}] installed successfully on ${targetDevice}`);
      } else {
        Logger.error(`Failed to install APK [${apkPath}] on ${targetDevice}`);
      }
      return installed;
    } else {
      Logger.info(`Package [${packageName}] is already installed on device [${targetDevice}].`);
      return true;
    }
  }
}

module.exports = APKInstaller;
