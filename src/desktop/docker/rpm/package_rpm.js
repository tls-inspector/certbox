const os = require('os');
const installer = require('electron-installer-redhat');

const nodeArch = os.arch() === 'arm64' ? 'arm64' : 'x64';
const rpmArch = os.arch() === 'arm64' ? 'aarch64' : 'x86_64';

const options = {
    src: '/build_root/package/Certbox-linux-' + nodeArch + '/',
    dest: '/build_root/package/artifacts/',
    arch: rpmArch,
    icon: '/build_root/package/Certbox-linux-' + nodeArch + '/resources/app/dist/assets/img/certbox.png'
}

async function main(options) {
    console.log('Building .rpm package...', options);

    try {
        await installer(options);
        console.log('Finished');
    } catch (err) {
        console.error(err, err.stack);
        process.exit(1);
    }
}
main(options);