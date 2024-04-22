const { spawn } = require('child_process');
const os = require('os');
const packageInfo = require('./package.json');

const npm = (os.platform() === 'win32' ? 'npm.cmd' : 'npm');
const node = (os.platform() === 'win32' ? 'node.exe' : 'node');

var exec = (file, args, wd) => {
    return new Promise((resolve, reject) => {
        console.log(file, args, wd);
        const ex = spawn(file, args, { stdio: 'inherit', env: process.env, cwd: wd, shell: true });
        ex.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject("Exit " + code);
            }
        });
    });
}

var buildCertgen = () => {
    if (os.platform() === 'win32') {
        return exec('build.cmd', [], '../certbox/cmd/certgen');
    }

    return exec('/bin/bash', ['build.sh'], '../certbox/cmd/certgen');
}

var package = () => {
    switch (os.platform()) {
        case 'win32':
            return exec(node, ['build.windows.js'], __dirname);
        case 'darwin':
            return exec(node, ['build.darwin.js'], __dirname);
        case 'linux':
            return exec(node, ['build.linux.js'], __dirname);
    }

    return Promise.reject('unknown platform');
}

var docker = () => {
    if (os.platform() !== 'linux') {
        return Promise.resolve();
    }

    return exec('/bin/bash', ['build.sh', packageInfo.version], 'docker');
}

(async () => {
    await buildCertgen();
    await exec(npm, ['i'], __dirname);
    await exec(node, ['start_webpack.js', '--mode', 'production'], __dirname);
    await package();
    await docker();
})();
