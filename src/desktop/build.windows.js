const windowsInstaller = require('electron-winstaller');
const packager = require('./build.package.js');

async function build(arch) {
    await packager.app('win32', arch);
    await windowsInstaller.createWindowsInstaller({
        appDirectory: 'package\\Certbox-win32-' + arch,
        exe: 'certbox.exe',
        iconUrl: 'https://raw.githubusercontent.com/tls-inspector/certbox/main/src/frontend/src/icons/certbox.ico',
        loadingGif: 'src\\icons\\loading.gif',
        noMsi: true,
        outputDirectory: 'package\\artifacts',
        setupExe: 'certbox_windows_' + arch + '.exe',
        setupIcon: 'src\\icons\\certbox.ico',
        title: 'Certbox',
    });
}

(async function main() {
    await build('x64');
    await build('arm64');
})();
