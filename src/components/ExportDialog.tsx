import * as React from 'react';
import { Certificate, CertificateRequest, ExportFormatType } from '../types/types';
import { Filesystem } from '../services/Filesystem';
import { ExportedFile, Wasm } from '../services/Wasm';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { Icon } from './Icon';
import { Input } from './Input';
import { Radio } from './Radio';

interface ExportDialogProps {
    requests: CertificateRequest[];
    importedRoot?: Certificate;
}

export const ExportDialog: React.FC<ExportDialogProps> = (props: ExportDialogProps) => {
    const [Format, SetFormat] = React.useState(ExportFormatType.PKCS12);
    const [Password, SetPassword] = React.useState('');
    const [ExportedFiles, SetExportedFiles] = React.useState<ExportedFile[]>();
    const [Certificates, SetCertificates] = React.useState<Certificate[]>();
    const [IsLoading, SetIsLoading] = React.useState(true);

    const generateCertificates = (): Promise<Certificate[]> => {
        return new Promise((resolve, reject) => {
            try {
                const certificates = Wasm.GenerateCertificates({ Requests: props.requests, ImportedRoot: props.importedRoot });
                resolve(certificates as Certificate[]);
            } catch (ex) {
                reject(ex);
            }
        });
    };

    React.useEffect(() => {
        generateCertificates().then(certificates => {
            SetCertificates(certificates);
            SetIsLoading(false);
        });
    }, []);

    const didSelectFormat = (format: string) => {
        SetFormat(format as ExportFormatType);
    };

    const didChangePassword = (password: string) => {
        SetPassword(password);
    };

    const doExport = () => {
        const exportedFiles = Wasm.ExportCertificates({
            Certificates: Certificates,
            Format: Format,
            Password: Password
        });
        SetExportedFiles(exportedFiles);
    };

    const buttons = [
        {
            label: 'Export',
            disabled: IsLoading,
            onClick: () => {
                doExport();
                return Promise.resolve(false);
            }
        },
        {
            label: 'Cancel'
        }
    ];

    const formatChoices = [
        {
            label: 'P12/PFX',
            value: ExportFormatType.PKCS12
        },
        {
            label: 'PEM',
            value: ExportFormatType.PEM
        },
        {
            label: 'DER',
            value: ExportFormatType.DER
        }
    ];

    const passwordInput = () => {
        if (Format != ExportFormatType.PKCS12) {
            return null;
        }

        return (<Input label="Password" type="password" onChange={didChangePassword} required />);
    };

    const plainTextWarning = () => {
        if (Format == ExportFormatType.PKCS12) {
            return null;
        }

        return (
            <div className="mt-1">
                <Icon.Label icon={<Icon.ExclamationTriangle color='yellow' />} label="Private key will be exported in plain-text" />
            </div>
        );
    };

    if (ExportedFiles) {
        return (<SaveDialog files={ExportedFiles} />);
    }

    return (
        <Dialog title="Export Certificates" buttons={buttons}>
            <Radio label="Format" choices={formatChoices} defaultValue={ExportFormatType.PKCS12} onChange={didSelectFormat} />
            {passwordInput()}
            {plainTextWarning()}
        </Dialog>
    );
};

interface SaveDialogProps {
    files: ExportedFile[];
}

const SaveDialog: React.FC<SaveDialogProps> = (props: SaveDialogProps) => {
    const buttons = [
        {
            label: 'Save All',
            onClick: () => {
                const response = Wasm.ZipFiles({
                    Files: props.files
                });

                Filesystem.SaveFile(response.File);
                return Promise.resolve(true);
            }
        },
        {
            label: 'Dismiss'
        }
    ];

    const saveClick = (file: ExportedFile) => {
        return () => {
            Filesystem.SaveFile(file);
        };
    };

    return (
        <Dialog title="Export Certificates" buttons={buttons}>
            <table>
                {
                    props.files.map((file, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{file.Name}</td>
                                <td><Button onClick={saveClick(file)}><Icon.Label icon={<Icon.Save />} label="Save" /></Button></td>
                            </tr>
                        );
                    })
                }
            </table>
        </Dialog>
    );
};
