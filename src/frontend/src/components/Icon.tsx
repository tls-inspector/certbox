import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faCertificate,
    faCheckCircle,
    faCopy,
    faDownload,
    faExclamationCircle,
    faExclamationTriangle,
    faFileExport,
    faFileImport,
    faInfoCircle,
    faPencil,
    faPlusCircle,
    faSpinner,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import '../css/Icon.scss';

export namespace Icon {
    interface IconProps {
        pulse?: boolean;
        spin?: boolean;
        title?: string;
        color?: 'red'|'yellow'|'white'|'blue'|'green';
    }

    interface EIconProps {
        icon: IconProp;
        options: IconProps;
    }

    export const EIcon: React.FC<EIconProps> = (props: EIconProps) => {
        const className = 'icon-' + (props.options.color ?? 'white');
        return (<FontAwesomeIcon className={className} icon={props.icon} pulse={props.options.pulse} spin={props.options.spin} title={props.options.title} />);
    };

    interface LabelProps { icon: React.ReactNode; spin?: boolean; label: string | number; }
    export const Label: React.FC<LabelProps> = (props: LabelProps) => {
        return (
            <span>
                { props.icon }
                <span className="ml-1">{props.label}</span>
            </span>
        );
    };

    export const Certificate: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faCertificate, options: props });
    export const CheckCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faCheckCircle, options: props });
    export const Copy: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faCopy, options: props });
    export const Download: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faDownload, options: props });
    export const ExclamationCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faExclamationCircle, options: props });
    export const ExclamationTriangle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faExclamationTriangle, options: props });
    export const FileExport: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faFileExport, options: props });
    export const FileImport: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faFileImport, options: props });
    export const InfoCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faInfoCircle, options: props });
    export const Pencil: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faPencil, options: props });
    export const PlusCircle: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faPlusCircle, options: props });
    export const Spinner: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faSpinner, options: props });
    export const Trash: React.FC<IconProps> = (props: IconProps) => EIcon({ icon: faTrash, options: props });
}
