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

    const didSelectFormat = (format: string) => {
        SetFormat(format as ExportFormatType);
    };

    const didChangePassword = (password: string) => {
        SetPassword(password);
    };

    const doExport = () => {
        const response = Wasm.ExportCertificate({
            Requests: props.requests,
            ImportedRoot: props.importedRoot,
            Format: Format,
            Password: Password
        });
        SetExportedFiles(response.Files);
    };

    const buttons = [
        {
            label: 'Export',
            onClick: () => {
                doExport();
                return false;
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
        }
    ];

    const pemWarningLabel = () => {
        if (Format == ExportFormatType.PEM && Password == '') {
            return (
                <Icon.Label icon={<Icon.ExclamationCircle />} label="Without a password the private key will be exported in plain-text" />
            );
        }

        return null;
    };

    if (ExportedFiles) {
        return (<SaveDialog files={ExportedFiles} />);
    }

    return (
        <Dialog title="Export Certificates" buttons={buttons}>
            <Radio label="Format" choices={formatChoices} defaultValue={ExportFormatType.PKCS12} onChange={didSelectFormat} />
            <Input label="Password" type="password" onChange={didChangePassword} required={Format == ExportFormatType.PKCS12} />
            {pemWarningLabel()}
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
