import { BrowserWindow, ipcMain, shell, WebContents } from 'electron';
import { Certificate, CertificateRequest, ExportFormatType } from '../shared/types';
import { Dialog } from './dialog';
import { Exporter } from './exporter';
import { Menu } from './menu';
import * as manifest from '../../package.json';
import { certgen } from './certgen';
import { Importer } from './importer';
import { OptionsManager } from './options_manager';
import { Options } from '../shared/options';

const browserWindowFromEvent = (sender: WebContents): BrowserWindow => {
    const windows = BrowserWindow.getAllWindows().filter(window => window.webContents.id === sender.id);
    return windows[0];
};

ipcMain.handle('generate_certificate', async (event, args) => {
    const requests = args[0] as CertificateRequest[];
    const importedRoot = args[1] as Certificate;
    return certgen.generateCertificates(requests, importedRoot);
});

ipcMain.handle('export_certificates', async (event, args) => {
    const certificates = args[0] as Certificate[];
    const format = args[1] as ExportFormatType;
    const password = args[2] as string;
    try {
        return Exporter.Export(browserWindowFromEvent(event.sender), certificates, format, password);
    } catch (err) {
        new Dialog(browserWindowFromEvent(event.sender)).showErrorDialog('Error exporting certificates',
            'An error occurred while generating your certificates', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    }
});

ipcMain.handle('show_certificate_context_menu', async (event, args) => {
    const isRoot = args[0] as boolean;

    if (isRoot) {
        return Menu.showRootCertificateContextMenu(browserWindowFromEvent(event.sender));
    }

    return Menu.showLeafCertificateContextMenu(browserWindowFromEvent(event.sender));
});

ipcMain.handle('clone_certificate', async (event) => {
    const window = browserWindowFromEvent(event.sender);
    return Importer.Clone(window);
});

ipcMain.handle('runtime_versions', async () => {
    const app = manifest.version;
    const electron = manifest.dependencies.electron;
    const nodejs = process.version.substr(1);
    const golang = await certgen.getVersion();

    return {
        app: app,
        electron: electron,
        nodejs: nodejs,
        golang: golang,
    };
});

ipcMain.on('open_in_browser', (event, args) => {
    shell.openExternal(args[0]);
});

ipcMain.on('fatal_error', (event, args) => {
    const error = args[0] as Error;
    const errorInfo = args[1] as React.ErrorInfo;
    console.error('Fatal error from renderer: ' + error + errorInfo.componentStack);
    const window = browserWindowFromEvent(event.sender);

    new Dialog(window).showFatalErrorDialog().then(() => {
        window.reload();
    });
});

ipcMain.handle('show_message_box', async (event, args) => {
    const title = args[0] as string;
    const message = args[1] as string;

    return new Dialog(browserWindowFromEvent(event.sender)).showInfoDialog(title, message);
});

ipcMain.handle('get_options', async () => {
    return OptionsManager.Get();
});

ipcMain.handle('update_options', async (event, args) => {
    const newValue = args[0] as Options;
    return OptionsManager.Set(newValue);
});

ipcMain.on('import_password_dialog_finished', async (event, args) => {
    const password = args[0] as string;
    const cancelled = args[1] as boolean;
    if (cancelled) {
        Importer.CancelPendingImport();
    } else {
        Importer.ReadP12(browserWindowFromEvent(event.sender), password);
    }
});
