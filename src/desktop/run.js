const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

function start() {
    return new Promise(resolve => {
        const file = path.resolve('node_modules', '.bin', os.platform() === 'win32' ? 'electron.cmd' : 'electron');
        const args = [path.join('dist', 'main.js')];
        const env = process.env;
        env['DEVELOPMENT'] = '1';
        env['NODE_ENV'] = 'development';
        console.log(file, args);
        const electron = spawn(file, args, { stdio: 'inherit', env: env });
        electron.on('close', () => {
            resolve();
        });
    });
}

(async () => {
    await start();
})();
