import * as React from 'react';
import { CertificateRequest } from '../shared/types';
import { Icon } from './Icon';
import { Menu, MenuItem } from './Menu';

interface CertificateMenuProps {
    x: number;
    y: number;
    certificate: CertificateRequest;
    menuAction: (action: 'import' | 'export_csr' | 'duplicate' | 'clone' | 'delete') => void;
}
export const CertificateMenu: React.FC<CertificateMenuProps> = (props: CertificateMenuProps) => {
    const importRootClick = () => {
        props.menuAction('import');
    };

    const exportCSRClick = () => {
        props.menuAction('export_csr');
    };

    const duplicateClick = () => {
        props.menuAction('duplicate');
    };

    const cloneClick = () => {
        props.menuAction('clone');
    };

    const deleteClick = () => {
        props.menuAction('delete');
    };

    if (props.certificate.IsCertificateAuthority) {
        return (
            <Menu x={props.x} y={props.y}>
                <MenuItem onClick={importRootClick}><Icon.Label icon={<Icon.FileImport />} label="Import Existing Root Certificate" /></MenuItem>
            </Menu>
        );
    }

    return (
        <Menu x={props.x} y={props.y}>
            <MenuItem onClick={exportCSRClick}><Icon.Label icon={<Icon.FileExport />} label="Export Certificate Signing Request" /></MenuItem>
            <MenuItem onClick={duplicateClick}><Icon.Label icon={<Icon.Copy />} label="Duplicate Certificate" /></MenuItem>
            <MenuItem onClick={cloneClick}><Icon.Label icon={<Icon.FileImport />} label="Clone Existing Certificate" /></MenuItem>
            <MenuItem onClick={deleteClick}><Icon.Label icon={<Icon.Trash />} label="Delete Certificate" /></MenuItem>
        </Menu>
    );
};
