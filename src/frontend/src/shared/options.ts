export interface Options {
    CheckForUpdates: boolean;
    ShowExportedCertificates: boolean;
}

export const GetDefaultOptions = (): Options => {
    return {
        CheckForUpdates: true,
        ShowExportedCertificates: true,
    };
};
