import { Certificate, CertificateRequest, ExportFormatType, ExportedFile, RuntimeVersions } from './shared/types';
import { Options } from './shared/options';
import { IInterop } from './shared/IInterop';
import { IPC } from './IPC';
import { Updater } from './Updater';

export const Interop: IInterop = {
    isDesktop: true,
    showCertificateContextMenu: function (root: boolean): Promise<string> {
        return IPC.showCertificateContextMenu(root);
    },
    onImportedCertificate: function (callback: (certificate: Certificate) => void): void {
        IPC.onImportedCertificate((_, args: unknown[]) => {
            callback(args[0] as Certificate);
        });
    },
    onGetImportPassword: function (callback: () => Promise<string>): void {
        IPC.onShowImportPasswordDialog(() => {
            callback().then(password => {
                IPC.finishedImportPasswordDialog(password, password == undefined || password.length == 0);
            });
        });
    },
    generateCertificates: function (requests: CertificateRequest[], importedRoot: Certificate): Promise<Certificate[]> {
        return IPC.generateCertificate(requests, importedRoot);
    },
    exportCSR: function (request: CertificateRequest): Promise<ExportedFile[]> {
        return IPC.exportCSR(request);
    },
    exportCertificates: function (certificates: Certificate[], format: ExportFormatType, password: string): Promise<ExportedFile[]> {
        return IPC.exportCertificates(certificates, format, password).then(() => {
            return <ExportedFile[]>[];
        });
    },
    cloneCertificate: function (): Promise<CertificateRequest> {
        return IPC.cloneCertificate();
    },
    getVersions: function (): Promise<RuntimeVersions> {
        return IPC.runtimeVersions();
    },
    onShowAboutDialog: function (callback: () => void): void {
        IPC.onShowAboutDialog(() => {
            callback();
        });
    },
    onShowOptionsDialog: function (callback: () => void): void {
        IPC.onShowOptionsDialog(() => {
            callback();
        });
    },
    getOptions: function (): Promise<Options> {
        return IPC.getOptions();
    },
    setOptions: function (options: Options): Promise<void> {
        return IPC.updateOptions(options);
    },
    checkForUpdates: function (): Promise<string> {
        return Updater.GetNewerRelease().then(version => {
            if (version) {
                return version.ReleaseURL;
            }
            return undefined;
        });
    },
    fatalError: function (error: unknown, errorInfo: unknown): void {
        IPC.fatalError(error, errorInfo);
    },
    openInBrowser: function (link: string): void {
        IPC.openInBrowser(link);
    },

    zipFiles: function (): Promise<ExportedFile> {
        return Promise.resolve(null);
    },
    importCertificate: function (): void { },
    init: function (): Promise<void> {
        return Promise.resolve();
    },
    saveFile: function (): void { }
};
