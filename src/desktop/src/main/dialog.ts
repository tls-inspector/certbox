import { BrowserWindow, dialog, shell } from 'electron';
import { App } from './app';
import { Paths } from './paths';

export class Dialog {
    private parent: BrowserWindow;

    constructor(parent: BrowserWindow) {
        this.parent = parent;
    }

    private showGenericDialog = (type: 'info' | 'error' | 'question' | 'warning', title: string, body: string, details?: string): Promise<void> => {
        return dialog.showMessageBox(this.parent, {
            type: type,
            buttons: ['OK'],
            defaultId: 0,
            title: title,
            message: body,
            detail: details,
        }).then(() => {
            return;
        }).catch(err => {
            console.error('Error showing generic dialog', err);
        });
    };

    /**
     * Show a generic informational dialog
     * @param title The title of the dialog window
     * @param body The body of the dialog
     */
    public showInfoDialog = (title: string, body: string): Promise<void> => {
        return this.showGenericDialog('info', title, body);
    };

    /**
     * Show an error dialog
     * @param title The title of the dialog window
     * @param body The body of the dialog
     * @param details Additional details about the error, this may be collapsed by default on some platforms
     */
    public showErrorDialog = (title: string, body: string, details?: string): Promise<void> => {
        return this.showGenericDialog('error', title, body, details);
    };

    /**
     * Show a dialog for fatal errors.
     */
    public showFatalErrorDialog = async (): Promise<void> => {
        const result = await dialog.showMessageBox(this.parent, {
            type: 'error',
            buttons: [
                'Report Error & Restart',
                'Restart Certbox'
            ],
            defaultId: 0,
            cancelId: 1,
            title: 'Fatal Error',
            message: 'A non-recoverable error occurred and Certbox must restart. Any unsaved work will be lost. '
        });

        if (result.response == 0) {
            shell.openExternal('https://github.com/tls-inspector/certbox-desktop/issues');
        }

        return;
    };

    /**
     * Show a generic warning dialog
     * @param title The title of the dialog window
     * @param body The body of the dialog
     */
    public showWarningDialog = (title: string, body: string): Promise<void> => {
        return this.showGenericDialog('warning', title, body);
    };

    public async showSelectFolderDialog(): Promise<string> {
        const results = await dialog.showOpenDialog(this.parent, {
            title: 'Export Certificates',
            buttonLabel: 'Export',
            properties: ['openDirectory', 'createDirectory']
        });
        if (results.canceled) {
            return undefined;
        }
        return results.filePaths[0];
    }

    public browseForPEMCert(): Promise<string> {
        return dialog.showOpenDialog(this.parent, {
            title: 'Import Certificate',
            buttonLabel: 'Import',
            filters: [{
                name: 'PEM Certificate',
                extensions: ['cer', 'cert', 'crt', 'pem', 'txt']
            }]
        }).then(results => {
            if (!results.canceled && results.filePaths.length > 0) {
                return results.filePaths[0];
            }
            return undefined;
        });
    }

    public browseForP12(): Promise<string> {
        return dialog.showOpenDialog(this.parent, {
            title: 'Import Certificate',
            buttonLabel: 'Import',
            filters: [{
                name: 'PKCS#12 Archive',
                extensions: ['p12', 'pfx']
            }]
        }).then(results => {
            if (!results.canceled && results.filePaths.length > 0) {
                return results.filePaths[0];
            }
            return undefined;
        });
    }

    /**
     * Prepare an electron modal browser window
     * @param title The title of the window
     * @param height The height of the window
     * @param width The width of the window
     * @param modal (Optional) If this window should be a modal or not. Default: true.
     * @returns A promise that resolves with the browser window object when the window was shown to the user
     */
    private electronModal(title: string, height: number, width: number, modal?: boolean): Promise<BrowserWindow> {
        return new Promise((resolve, reject) => {
            const paths = Paths.default();
            const modalWindow = new BrowserWindow({
                parent: this.parent,
                height: height,
                width: width,
                resizable: false,
                maximizable: false,
                minimizable: false,
                webPreferences: {
                    sandbox: true,
                    preload: paths.preloadJS,
                    contextIsolation: true,
                },
                autoHideMenuBar: true,
                modal: modal == undefined ? true : modal,
                title: title,
                icon: paths.icon,
                show: false
            });
            modalWindow.loadFile(paths.indexHTML).then(() => {
                //
            }, e => {
                console.error('Error loading index HTML', e);
                reject(e);
            }).catch(e => {
                console.error('Error loading index HTML', e);
                reject(e);
            });

            if (!App.isProduction()) {
                modalWindow.webContents.openDevTools();
            }

            modalWindow.on('ready-to-show', () => {
                modalWindow.show();
                resolve(modalWindow);
            });
        });
    }
}
