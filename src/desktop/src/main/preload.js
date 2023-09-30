import { ipcRenderer, contextBridge } from 'electron';
import manifest from '../../package.json';

contextBridge.exposeInMainWorld('IPC', {
    packageVersion: manifest.version,
    packageName: manifest.name,
    onImportedCertificate: (cb) => ipcRenderer.on('did_import_certificate', cb),
    generateCertificate: (requests, importedRoot) => ipcRenderer.invoke('generate_certificate', [requests, importedRoot]),
    exportCertificates: (certificates, format, password) => ipcRenderer.invoke('export_certificates', [certificates, format, password]),
    showCertificateContextMenu: (isRoot) => ipcRenderer.invoke('show_certificate_context_menu', [isRoot]),
    cloneCertificate: () => ipcRenderer.invoke('clone_certificate'),
    runtimeVersions: () => ipcRenderer.invoke('runtime_versions', []),
    openInBrowser: (url) => ipcRenderer.send('open_in_browser', [url]),
    fatalError: (error, errorInfo) => ipcRenderer.send('fatal_error', [error, errorInfo]),
    showMessageBox: (title, message) => ipcRenderer.invoke('show_message_box', [title, message]),
    getOptions: () => ipcRenderer.invoke('get_options', []),
    updateOptions: (options) => ipcRenderer.invoke('update_options', [options]),
    onShowAboutDialog: (cb) => ipcRenderer.on('show_about_dialog', cb),
    onShowImportPasswordDialog: (cb) => ipcRenderer.on('import_password_dialog_show', cb),
    finishedImportPasswordDialog: (password, cancelled) => ipcRenderer.send('import_password_dialog_finished', [password, cancelled]),
    onShowOptionsDialog: (cb) => ipcRenderer.on('show_options_dialog', cb),
});
