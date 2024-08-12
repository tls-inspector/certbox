import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { App } from './app';
import { log } from './log';

export class Paths {
    /**
     * The absolute path to the index HTML file used for browser windows
     */
    public readonly indexHTML: string;
    /**
     * The absolute path to the preload JavaScript file used for browser windows
     */
    public readonly preloadJS: string;
    /**
     * The absolute path to an icon used for browser windows.
     * On Windows this will be an .ico file, otherwise it will be a .png.
     */
    public readonly icon: string;
    /**
     * The absolute path to the certgen executable. On Windows this must have a .exe extension.
     */
    public readonly certgenEXE: string;

    public static default(): Paths {
        const indexHTML = path.join(__dirname, 'index.html');
        const preloadJS = path.join(__dirname, 'preload.js');
        let icon = path.join(__dirname, 'icons', 'certbox.png');
        let certgenEXE = path.resolve(__dirname, '..', 'certgen');

        if (!App.isProduction()) {
            certgenEXE = path.resolve(__dirname, '..', '..', 'certbox', 'cmd', 'certgen', 'certgen_' + os.platform() + '_' + process.arch);
        }
        if (os.platform() === 'win32') {
            icon = path.join(__dirname, 'icons', 'certbox.ico');
            certgenEXE += '.exe';
        }

        if (!fs.existsSync(indexHTML)) {
            log.error('[FATAL] Path for index HTML does not exist', indexHTML);
            throw new Error('Index HTML does not exist');
        }
        if (!fs.existsSync(preloadJS)) {
            log.error('[FATAL] Path for preload JS does not exist', preloadJS);
            throw new Error('Preload JS does not exist');
        }

        return new Paths(indexHTML, preloadJS, icon, certgenEXE);
    }

    private constructor(indexHTML: string, preloadJS: string, icon: string, certgenEXE: string) {
        this.indexHTML = indexHTML;
        this.preloadJS = preloadJS;
        this.icon = icon;
        this.certgenEXE = certgenEXE;
    }
}
