import { CertificateRequest } from '../shared/types';
import { Dialog } from './dialog';
import fs = require('fs');
import { certgen } from './certgen';

export class Importer {
    private static pendingP12data: string;

    public static OpenP12(parent: Electron.BrowserWindow) {
        const dialog = new Dialog(parent);
        dialog.browseForP12().then(p12Path => {
            if (p12Path === undefined) {
                return;
            }
            const data = fs.readFileSync(p12Path, { flag: 'r' }).toString('base64');
    
            this.pendingP12data = data;
            parent.webContents.send('import_password_dialog_show');
        });
    }

    public static async ReadP12(parent: Electron.BrowserWindow, password: string): Promise<void> {
        const dialog = new Dialog(parent);

        try {
            const certificate = await certgen.importRootCertificate(this.pendingP12data, password);
            parent.webContents.send('did_import_certificate', [certificate]);
            this.pendingP12data = undefined;
        } catch (err) {
            console.error('Error importing P12', { error: err });

            if (err.indexOf('decryption password incorrect') != -1) {
                await dialog.showErrorDialog('Error Importing Certificate', 'The provided password was incorrect');
                parent.webContents.send('import_password_dialog_show');
            } else if (err.indexOf('expected exactly two safe bags in the PFX PDU') != -1) {
                await dialog.showErrorDialog('Error Importing Certificate', 'The selected certificate does not contain a private key');
                this.pendingP12data = undefined;
                return undefined;
            }

            throw err;
        }
    }

    public static CancelPendingImport() {
        this.pendingP12data = undefined;
    }

    public static async Clone(parent: Electron.BrowserWindow): Promise<CertificateRequest> {
        const dialog = new Dialog(parent);
        const pemPath = await dialog.browseForPEMCert();
        if (pemPath === undefined) {
            return undefined;
        }
        const data = fs.readFileSync(pemPath, { flag: 'r' }).toString('base64');

        try {
            return await certgen.cloneCertificate(data);
        } catch (err) {
            await dialog.showErrorDialog('Error Cloning Certificate', 'The selected certificate was invalid', err);
            return undefined;
        }
    }
}
