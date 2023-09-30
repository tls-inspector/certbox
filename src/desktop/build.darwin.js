const packager = require('./build.package.js');
const createDMG = require('electron-installer-dmg');

async function build(arch) {
    await packager.app('darwin', arch);
    await createDMG({
        appPath: 'package/Certbox-darwin-' + arch + '/Certbox.app',
        name: 'Certbox',
        title: 'Certbox',
        icon: 'src/icons/certbox.icns',
        format: 'ULFO',
        out: 'package/artifacts'
    });
    await packager.exec('mv', ['package/artifacts/Certbox.dmg', 'package/artifacts/certbox_macOS_' + arch + '.dmg']);
}

(async function main() {
    try {
        await packager.exec('mkdir', ['-p', 'package/artifacts']);
        await build('x64');
        await build('arm64');
    } catch (err) {
        console.error(err);
    }
})();
