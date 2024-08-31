import { Certificate, CertificateRequest, ExportFormatType } from '../shared/types';
import { certgen } from './certgen';
import { Dialog } from './dialog';
import { shell } from 'electron';
import { log } from './log';
import { OptionsManager } from './options_manager';

export class Exporter {
    public static async ExportCSR(parent: Electron.BrowserWindow, request: CertificateRequest): Promise<string[]> {
        const dialog = new Dialog(parent);

        const saveDirectory = await dialog.showSelectFolderDialog();
        if (!saveDirectory) {
            log.warn('Aborting export, no save directory');
            return undefined;
        }

        log.debug('Exporting csr', {
            save_directory: saveDirectory,
        });
        const fileNames = await certgen.exportCSR(saveDirectory, request);
        
        if (OptionsManager.Get().ShowExportedCertificates) {
            await shell.openPath(saveDirectory);
        }

        return fileNames;
    }

    public static async ExportCertificate(parent: Electron.BrowserWindow, certificates: Certificate[], format: ExportFormatType, password: string): Promise<boolean> {
        const dialog = new Dialog(parent);

        const saveDirectory = await dialog.showSelectFolderDialog();
        if (!saveDirectory) {
            log.warn('Aborting export, no save directory');
            return false;
        }

        log.debug('Exporting certificate', {
            save_directory: saveDirectory,
            format: format,
            password: password,
        });
        await certgen.exportCertificates(saveDirectory, certificates, format, password);
        
        if (OptionsManager.Get().ShowExportedCertificates) {
            await shell.openPath(saveDirectory);
        }

        return true;
    }
}
