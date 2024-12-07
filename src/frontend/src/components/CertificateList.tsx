import * as React from 'react';
import { GlobalMenuFrame } from './Menu';
import { CertificateRequest } from '../shared/types';
import { Icon } from './Icon';
import { Interop } from '../Interop';
import { CertificateMenu } from './CertificateMenu';
import '../css/CertificateList.scss';

interface CertificateListProps {
    certificates: CertificateRequest[];
    selectedIdx: number;
    invalidCertificates: {[index:number]:string};
    onClick: (idx: number) => void;
    onShowContextMenu: (idx: number) => void;
    menuAction: (idx: number, action: 'import' | 'export_csr' | 'duplicate' | 'clone' | 'delete') => void;
}
export const CertificateList: React.FC<CertificateListProps> = (props: CertificateListProps) => {
    const didClick = (idx: number) => {
        return () => {
            props.onClick(idx);
        };
    };

    const didShowContextMenu = (idx: number) => {
        return () => {
            props.onShowContextMenu(idx);
        };
    };

    const menuAction = (idx: number) => {
        return (action: 'import' | 'export_csr' | 'duplicate' | 'clone' | 'delete') => {
            props.menuAction(idx, action);
        };
    };

    return (
        <React.Fragment>
            {
                props.certificates.map((certificate, idx) => {
                    return (<CertificateListItem certificate={certificate} selected={props.selectedIdx === idx} onClick={didClick(idx)} onShowContextMenu={didShowContextMenu(idx)} menuAction={menuAction(idx)} invalidReason={props.invalidCertificates[idx]} key={idx} />);
                })
            }
        </React.Fragment>
    );
};

interface CertificateListItemProps {
    certificate: CertificateRequest;
    selected?: boolean;
    invalidReason?: string;
    onClick: () => void;
    onShowContextMenu: () => void;
    menuAction: (action: 'import' | 'export_csr' | 'duplicate' | 'clone' | 'delete') => void;
}
const CertificateListItem: React.FC<CertificateListItemProps> = (props: CertificateListItemProps) => {
    if (!props.certificate) {
        return null;
    }

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        if (Interop.isDesktop) {
            props.onShowContextMenu();
            return;
        }

        GlobalMenuFrame.showMenu(<CertificateMenu
            x={event.clientX}
            y={event.clientY}
            menuAction={props.menuAction}
            certificate={props.certificate}
        />);
        event.preventDefault();
    };

    const title = props.certificate.Subject.CommonName === '' ? 'Unnamed Certificate' : props.certificate.Subject.CommonName;
    let subtitle = '';
    if (props.certificate.IsCertificateAuthority) {
        if (props.certificate.Imported) {
            subtitle = 'Imported Root Certificate';
        } else {
            subtitle = 'Root Certificate';
        }
    } else {
        subtitle = 'Leaf Certificate';
    }

    let className = 'certificate ';
    if (props.selected) {
        className += 'selected ';
    }
    if (props.invalidReason) {
        className += 'invalid ';
    }

    let invalid: React.ReactNode = null;
    if (props.invalidReason) {
        invalid = (<div className="certificate-invalid">
            <Icon.ExclamationCircle title={props.invalidReason} color='red'/>
        </div>);
    }

    return (
        <div className={className} onClick={props.onClick} onContextMenu={onContextMenu}>
            <Icon.Certificate color={props.certificate.IsCertificateAuthority ? 'yellow' : undefined} />
            <div className="certificate-info">
                <span className="title">{ title }</span>
                <span className="subtitle">{ subtitle }</span>
            </div>
            { invalid }
        </div>
    );
};
