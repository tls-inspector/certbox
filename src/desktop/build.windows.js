const windowsInstaller = require('electron-winstaller');
const packager = require('./build.package.js');

(async function main() {
    await packager.app('win32', 'x64');
    await windowsInstaller.createWindowsInstaller({
        appDirectory: 'package\\Certbox-win32-x64',
        outputDirectory: 'package\\artifacts',
        title: 'Certbox',
        iconUrl: 'https://raw.githubusercontent.com/tls-inspector/certbox-desktop/develop/icons/certbox.ico',
        setupIcon: 'src\\icons\\certbox.ico',
        exe: 'certbox.exe',
        setupExe: 'certbox_windows_x64.exe',
        noMsi: true
    });
})();
