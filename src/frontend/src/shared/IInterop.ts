import { Certificate, CertificateRequest, ExportFormatType, RuntimeVersions, ExportedFile } from './types';
import { Options } from './options';

export interface IInterop {
    isDesktop: boolean
    init: () => Promise<boolean>
    showCertificateContextMenu: (root: boolean) => Promise<string>
    importCertificate: () => void
    onImportedCertificate: (callback: (certificate: Certificate) => void) => void
    onGetImportPassword: (callback: () => Promise<string>) => void
    generateCertificates: (requests: CertificateRequest[], importedRoot: Certificate) => Promise<Certificate[]>
    exportCertificates: (certificates: Certificate[], format: ExportFormatType, password: string) => Promise<ExportedFile[]>
    zipFiles: (files: ExportedFile[]) => Promise<ExportedFile>
    saveFile: (file: ExportedFile) => void
    cloneCertificate: () => Promise<CertificateRequest>
    onShowAboutDialog: (callback: () => void) => void
    onShowOptionsDialog: (callback: () => void) => void
    getVersions: () => Promise<RuntimeVersions>
    getOptions: () => Promise<Options>
    setOptions: (options: Options) => Promise<void>
    checkForUpdates: () => Promise<string>
    fatalError: (error: unknown, errorInfo: unknown) => void;
    openInBrowser: (link: string) => void;
}
