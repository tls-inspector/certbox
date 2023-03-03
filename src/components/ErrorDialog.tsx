import * as React from 'react';
import { Dialog } from './Dialog';

interface ErrorDialogProps {
    title: string;
    children?: React.ReactNode;
}

const ErrorDialog: React.FC<ErrorDialogProps> = (props: ErrorDialogProps) => {
    const reloadButton = {
        label: 'Reload',
        onClick: (): Promise<boolean> => {
            location.reload();
            return Promise.resolve(true);
        },
    };

    return (
        <Dialog title={props.title} buttons={[reloadButton]}>
            {props.children}
        </Dialog>
    );
};

export const WasmErrorDialog: React.FC = () => {
    return (
        <ErrorDialog title="WebAssembly Unavailable">
            <span>CertBox requires WebAssembly to function. Your browser either does not support WebAssembly, or security settings are disabling it.</span>
        </ErrorDialog>
    );
};

