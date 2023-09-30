/* eslint-disable @typescript-eslint/no-unused-vars */
import { Certificate, CertificateRequest, ExportFormatType, RuntimeVersions, ExportedFile } from './shared/types';
import { IInterop } from './shared/IInterop';
import { Options } from './shared/options';
import { Wasm } from './Wasm';
import { Filesystem } from './Filesystem';
import { Rand } from './services/Rand';

let importCallback: (certificate: Certificate) => void;
let passwordCallback: () => Promise<string>;

export const Interop: IInterop = {
    isDesktop: false,
    init: async function (): Promise<boolean> {
        const id = Rand.ID();
        await Wasm.Init();
        const pong = Wasm.Ping({
            Nonce: id,
        });
        return pong.Nonce === id;
    },
    showCertificateContextMenu: function (root: boolean): Promise<string> {
        throw new Error('Function not implemented.');
    },
    importCertificate: async function () {
        let p12Data: Uint8Array;
        try {
            p12Data = await Filesystem.ReadFile('.p12,.pfx,application/x-pkcs12');
        } catch {
            return;
        }

        const password = await passwordCallback();
        if (!password) {
            return;
        }

        try {
            const certificate = await Wasm.ImportRootCertificate(p12Data, password);
            importCallback(certificate);
        } catch {
            return;
        }
    },
    onImportedCertificate: function (callback: (certificate: Certificate) => void): void {
        importCallback = callback;
    },
    onGetImportPassword: function (callback: () => Promise<string>): void {
        passwordCallback = callback;
    },
    generateCertificates: function (requests: CertificateRequest[], importedRoot: Certificate): Promise<Certificate[]> {
        return Promise.resolve(Wasm.GenerateCertificates({
            Requests: requests,
            ImportedRoot: importedRoot
        }));
    },
    exportCertificates: function (certificates: Certificate[], format: ExportFormatType, password: string): Promise<ExportedFile[]> {
        return Promise.resolve(Wasm.ExportCertificates({
            Certificates: certificates,
            Format: format,
            Password: password
        }));
    },
    zipFiles: function (files: ExportedFile[]): Promise<ExportedFile> {
        const result = Wasm.ZipFiles({
            Files: files
        });
        return Promise.resolve(result.File);
    },
    saveFile: function (file: ExportedFile): void {
        Filesystem.SaveFile(file);
    },
    cloneCertificate: function (): Promise<CertificateRequest> {
        return Filesystem.ReadFile('.cer,.crt,.pem,.txt,application/x-pem-file').then(pemData => {
            return Wasm.CloneCertificate(pemData);
        });
    },
    onShowAboutDialog: function (callback: () => void): void { },
    onShowOptionsDialog: function (callback: () => void): void { },
    getVersions: function (): Promise<RuntimeVersions> {
        return Promise.resolve(undefined);
    },
    getOptions: function (): Promise<Options> {
        return Promise.resolve(undefined);
    },
    setOptions: function (options: Options): Promise<void> {
        return Promise.resolve();
    },
    checkForUpdates: function (): Promise<string> {
        return Promise.resolve(undefined);
    },
    fatalError: function (error: unknown, errorInfo: unknown): void {
        throw new Error('Function not implemented.');
    },
    openInBrowser: function (link: string): void {
        throw new Error('Function not implemented.');
    },
};
