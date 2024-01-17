const windowsInstaller = require('electron-winstaller');
const packager = require('./build.package.js');

async function build(arch) {
    await packager.app('win32', arch);
    await windowsInstaller.createWindowsInstaller({
        appDirectory: 'package\\Certbox-win32-' + arch,
        outputDirectory: 'package\\artifacts',
        title: 'Certbox',
        iconUrl: 'https://raw.githubusercontent.com/tls-inspector/certbox/main/src/frontend/src/icons/certbox.ico',
        setupIcon: 'src\\icons\\certbox.ico',
        exe: 'certbox.exe',
        setupExe: 'certbox_windows_' + arch + '.exe',
        noMsi: true
    });
}

(async function main() {
    await build('x64');
    await build('arm64');
})();
