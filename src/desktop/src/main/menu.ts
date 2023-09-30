import { app, BrowserWindow, Menu as EMenu } from 'electron';
import { Importer } from './importer';

export class Menu {
    public static configureAppMenu(): void {
        const template: Electron.MenuItemConstructorOptions[] = [
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Import Root Certificate',
                        accelerator: 'CommandOrControl+O',
                        click: () => {
                            this.importMenuClicked(BrowserWindow.getFocusedWindow());
                        },
                    },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            },
            {
                label: 'Edit',
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ]
            },
            {
                label: 'View',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' },
                    { role: 'resetZoom' },
                    { role: 'zoomIn' },
                    { role: 'zoomOut' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' }
                ]
            },
            {
                label: 'Window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'zoom' },
                    { role: 'close' }
                ]
            },
        ];

        if (process.platform === 'darwin') {
            template.splice(0, 0, {
                label: app.name,
                submenu: [
                    {
                        label: 'About Certbox',
                        click: () => {
                            this.aboutMenuClicked(BrowserWindow.getFocusedWindow());
                        },
                    },
                    { type: 'separator' },
                    {
                        label: 'Preferences',
                        click: () => {
                            this.optionsMenuClicked(BrowserWindow.getFocusedWindow());
                        },
                    },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            });
        } else {
            template.push({
                label: 'Help',
                submenu: [
                    {
                        label: 'About Certbox',
                        click: () => {
                            this.aboutMenuClicked(BrowserWindow.getFocusedWindow());
                        },
                    }
                ]
            });
            (template[1].submenu as Electron.MenuItemConstructorOptions[]).push({
                label: 'Preferences',
                click: () => {
                    this.optionsMenuClicked(BrowserWindow.getFocusedWindow());
                },
            });
        }

        const menu = EMenu.buildFromTemplate(template);
        EMenu.setApplicationMenu(menu);
    }

    private static aboutMenuClicked = (target: Electron.BrowserWindow) => {
        target.webContents.send('show_about_dialog');
    };

    private static optionsMenuClicked = (target: Electron.BrowserWindow) => {
        target.webContents.send('show_options_dialog');
    };

    private static importMenuClicked = (target: Electron.BrowserWindow) => {
        Importer.OpenP12(target);
    };

    public static showRootCertificateContextMenu(target: Electron.BrowserWindow): Promise<string> {
        return new Promise(resolve => {
            const template: Electron.MenuItemConstructorOptions[] = [
                {
                    label: 'Import Existing Root Certificate',
                    click: () => {
                        this.importMenuClicked(target);
                    },
                }
            ];
            const menu = EMenu.buildFromTemplate(template);
            menu.popup({
                window: target,
                callback: () => {
                    resolve(undefined);
                }
            });
        });
    }

    public static showLeafCertificateContextMenu(target: Electron.BrowserWindow): Promise<string> {
        return new Promise(resolve => {
            const template: Electron.MenuItemConstructorOptions[] = [
                {
                    label: 'Duplicate',
                    click: () => {
                        resolve('duplicate');
                    }
                },
                {
                    label: 'Clone Existing Certificate',
                    click: () => {
                        resolve('clone');
                    }
                },
                {
                    label: 'Delete',
                    click: () => {
                        resolve('delete');
                    }
                }
            ];
            const menu = EMenu.buildFromTemplate(template);
            menu.popup({
                window: target,
                callback: () => {
                    resolve(undefined);
                }
            });
        });
    }
}
