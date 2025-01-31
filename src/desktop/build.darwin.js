const packager = require('./build.package.js');
const { createDMG } = require('electron-installer-dmg');

async function build(arch) {
    await packager.app('darwin', arch);
    await createDMG({
        appPath: 'package/Certbox-darwin-' + arch + '/Certbox.app',
        name: 'Certbox',
        title: 'Certbox',
        icon: 'src/icons/certbox.icns',
        format: 'ULFO',
        out: 'package/artifacts',
        background: 'src/icons/dmg_bg.png',
        contents: (opts) => {
            return [
                { x: 469, y: 239, type: 'link', path: '/Applications'},
                { x: 185, y: 239, type: 'file', path: opts.appPath}
            ];
        }
    });
    await packager.exec('mv', ['package/artifacts/Certbox.dmg', 'package/artifacts/certbox_macOS_' + arch + '.dmg']);
}

(async function main() {
    try {
        await packager.exec('npm', ['i', 'appdmg']);
        await packager.exec('mkdir', ['-p', 'package/artifacts']);
        await build('x64');
        await build('arm64');
    } catch (err) {
        console.error(err);
    }
})();
