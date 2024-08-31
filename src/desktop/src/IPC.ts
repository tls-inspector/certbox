import { Certificate, CertificateRequest, ExportedFile, ExportFormatType, RuntimeVersions } from './shared/types';
import { Options } from './shared/options';

interface PreloadBridge {
    packageVersion: string;
    packageName: string;
    onImportedCertificate: (cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    generateCertificate: (requests: CertificateRequest[], importedRoot: Certificate) => Promise<Certificate[]>
    exportCSR: (request: CertificateRequest) => Promise<ExportedFile[]>
    exportCertificates: (certificates: Certificate[], format: ExportFormatType, password: string) => Promise<boolean>
    showCertificateContextMenu: (isRoot: boolean) => Promise<'delete' | 'duplicate'>
    cloneCertificate: () => Promise<CertificateRequest>
    runtimeVersions: () => Promise<RuntimeVersions>
    openInBrowser: (url: string) => void
    fatalError: (error: unknown, errorInfo: unknown) => void
    showMessageBox: (title: string, message: string) => Promise<void>
    getOptions: () => Promise<Options>
    updateOptions: (options: Options) => Promise<void>
    onShowAboutDialog: (cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    onShowImportPasswordDialog: (cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
    finishedImportPasswordDialog: (password: string, cancelled: boolean) => void
    onShowOptionsDialog: (cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => void
}

interface preloadWindow {
    IPC: PreloadBridge
}

export class IPC {
    private static preload: PreloadBridge = (window as unknown as preloadWindow).IPC as PreloadBridge;

    /**
     * The version value from our package.json
     */
    public static readonly packageVersion = this.preload.packageVersion;

    /**
     * The name value from our package.json
     */
    public static readonly packageName = this.preload.packageName;

    /**
     * Register a listener for an imported certificate
     * @param cb callback that is called when a certificate was imported. Args will be Certificate[1]
     */
    public static onImportedCertificate(cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        IPC.preload.onImportedCertificate(cb);
    }

    /**
     * Initiate the process of generating certificates.
     * @param certificates List of certificates to generate
     * @param importedRoot Optional imported root certificate
     */
    public static generateCertificate(requests: CertificateRequest[], importedRoot: Certificate): Promise<Certificate[]> {
        return IPC.preload.generateCertificate(requests, importedRoot);
    }

    /**
     * Export a certificate request and private key
     * @param request The certificate request
     */
    public static exportCSR(request: CertificateRequest): Promise<ExportedFile[]> {
        return IPC.preload.exportCSR(request);
    }

    /**
     * Initiate the process of exporting certificates.
     * @param certificates List of certificates to generate
     * @param format The export format to use
     * @param password The encryption password. Must be specified, but for PEM can be an empty string
     */
    public static exportCertificates(certificates: Certificate[], format: ExportFormatType, password: string): Promise<boolean> {
        return IPC.preload.exportCertificates(certificates, format, password);
    }

    /**
     * Show the certificate context menu when the user right clicks on a certificate
     * @param isRoot If the selected certificate is a root certificate
     */
    public static showCertificateContextMenu(isRoot: boolean): Promise<'delete' | 'clone' | 'duplicate'> {
        return IPC.preload.showCertificateContextMenu(isRoot);
    }

    /**
     * Request to import an existing PEM certificate then return a new certificate request based on it
     * @returns A certificate request object
     */
     public static cloneCertificate(): Promise<CertificateRequest> {
        return IPC.preload.cloneCertificate();
    }

    /**
     * Get the versions of various runtime requirements
     * @returns A promise that resolves with a version object
     */
    public static runtimeVersions(): Promise<RuntimeVersions> {
        return IPC.preload.runtimeVersions();
    }

    /**
     * Open the provided URL in the systems default web browser
     * @param url The URL to open. Must be absolute.
     */
    public static openInBrowser(url: string): void {
        return IPC.preload.openInBrowser(url);
    }

    /**
     * Display an error dialog and reload the browser window
     * @param err The error object
     */
    public static fatalError(error: unknown, errorInfo: unknown): void {
        return IPC.preload.fatalError(error, errorInfo);
    }

    /**
     * Show a simple message box with a dismiss button
     * @param title The title of the message box
     * @param message The message contents of the message box
     * @returns A promise that resolves when the message box is dismissed
     */
    public static showMessageBox(title: string, message: string): Promise<void> {
        return IPC.preload.showMessageBox(title, message);
    }

    /**
     * Get the current options
     * @returns A promise that resolves with the current options
     */
    public static getOptions(): Promise<Options> {
        return IPC.preload.getOptions();
    }

    /**
     * Update the options
     * @param options The new options
     * @returns A promise that resolves when the options have been saved
     */
    public static updateOptions(options: Options): Promise<void> {
        return IPC.preload.updateOptions(options);
    }

    /**
     * Register a listener for when the about dialog should be shown
     * @param cb callback
     */
    public static onShowAboutDialog(cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        IPC.preload.onShowAboutDialog(cb);
    }

    /**
     * Register a listener for when the import password dialog should be shown
     * @param cb callback
     */
    public static onShowImportPasswordDialog(cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        IPC.preload.onShowImportPasswordDialog(cb);
    }

    /**
     * Method to call when the import password dialog was dismissed with a value
     * @param password the password value
     * @param cancelled if the dialog was cancelled or not
     */
    public static finishedImportPasswordDialog(password: string, cancelled: boolean): void {
        IPC.preload.finishedImportPasswordDialog(password, cancelled);
    }

    /**
     * Register a listener for when the options dialog should be shown
     * @param cb callback
     */
    public static onShowOptionsDialog(cb: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void {
        IPC.preload.onShowOptionsDialog(cb);
    }
}
