import * as React from 'react';
import { Dialog } from './Dialog';
import { Input } from './Input';

export interface ImportPasswordDialog {
    onSubmit: (password: string, cancelled: boolean) => void;
}

export const ImportPasswordDialog: React.FC<ImportPasswordDialog> = (props: ImportPasswordDialog) => {
    const [Password, SetPassword] = React.useState('');

    const didChangePassword = (password: string) => {
        SetPassword(password);
    };

    const buttons = [
        {
            label: 'Import',
            onClick: () => {
                props.onSubmit(Password, false);
                return Promise.resolve(true);
            }
        },
        {
            label: 'Cancel',
            onClick: () => {
                props.onSubmit(undefined, true);
                return Promise.resolve(true);
            }
        }
    ];

    return (
        <Dialog title="Import Certificate" buttons={buttons}>
            <Input label="P12 Password" type="password" onChange={didChangePassword} autofocus />
        </Dialog>
    );
};
