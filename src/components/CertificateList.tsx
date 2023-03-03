import * as React from 'react';
import { CertificateRequest } from '../types/types';
import { Icon } from './Icon';
import { GlobalMenuFrame } from './MenuFrame';
import { CertificateMenu } from './CertificateMenu';
import '../css/CertificateList.scss';

interface CertificateListProps {
    certificates: CertificateRequest[];
    selectedIdx: number;
    invalidCertificates: { [index: number]: string };
    onClick: (idx: number) => void;
    menuAction: (idx: number, action: 'import' | 'duplicate' | 'clone' | 'delete') => void;
}
export const CertificateList: React.FC<CertificateListProps> = (props: CertificateListProps) => {
    const didClick = (idx: number) => {
        return () => {
            props.onClick(idx);
        };
    };

    const menuAction = (idx: number) => {
        return (action: 'import' | 'duplicate' | 'clone' | 'delete') => {
            props.menuAction(idx, action);
        };
    };

    return (
        <React.Fragment>
            {
                props.certificates.map((certificate, idx) => {
                    return (<CertificateListItem certificate={certificate} selected={props.selectedIdx === idx} onClick={didClick(idx)} menuAction={menuAction(idx)} invalidReason={props.invalidCertificates[idx]} key={idx} />);
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
    menuAction: (action: 'import' | 'duplicate' | 'clone' | 'delete') => void;
}
const CertificateListItem: React.FC<CertificateListItemProps> = (props: CertificateListItemProps) => {
    if (!props.certificate) {
        return null;
    }

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        GlobalMenuFrame.showMenu(<CertificateMenu
            x={event.clientX}
            y={event.clientY}
            menuAction={props.menuAction}
            certificate={props.certificate}
        />);
        event.preventDefault();
    };

    let image = (<img src="img/CertLargeStd.png" srcSet="img/CertLargeStd@2x.png 2x" />);
    if (props.certificate.IsCertificateAuthority) {
        image = (<img src="img/CertLargeRoot.png" srcSet="img/CertLargeRoot@2x.png 2x" />);
    }
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

    let invalid: JSX.Element = null;
    if (props.invalidReason) {
        invalid = (<div className="certificate-invalid">
            <Icon.ExclamationCircle title={props.invalidReason} color='red' />
        </div>);
    }

    return (
        <div className={className} onClick={props.onClick} onContextMenu={onContextMenu}>
            {image}
            <div className="certificate-info">
                <span className="title">{title}</span>
                <span className="subtitle">{subtitle}</span>
            </div>
            {invalid}
        </div>
    );
};
