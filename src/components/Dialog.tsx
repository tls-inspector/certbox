import * as React from 'react';
import '../css/Dialog.scss';
import { Button } from './Button';
import { GlobalDialogFrame } from './DialogFrame';

interface DialogButton {
    label: string | JSX.Element;
    onClick?: () => Promise<boolean>;
}

interface DialogProps {
    title: string | JSX.Element;
    buttons: DialogButton[];
    children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
    const [IsLoading, SetIsLoading] = React.useState(false);

    const buttonClick = (idx: number) => {
        return () => {
            if (props.buttons[idx].onClick) {
                SetIsLoading(true);
                props.buttons[idx].onClick().then(dismiss => {
                    if (dismiss) {
                        GlobalDialogFrame.removeDialog();
                    } else {
                        SetIsLoading(false);
                    }
                });
            } else {
                GlobalDialogFrame.removeDialog();
            }
        };
    };

    const buttons = () => {
        return (
            <React.Fragment>
                {
                    props.buttons.map((button, idx) => {
                        return (<Button key={idx} onClick={buttonClick(idx)} disabled={IsLoading}>{button.label}</Button>);
                    })
                }
            </React.Fragment>
        );
    };

    return (
        <div className="dialog">
            <div className="dialog-title">
                {props.title}
            </div>
            <div className="dialog-body">
                {props.children}
            </div>
            <div className="dialog-footer">
                {buttons()}
            </div>
        </div>
    );
};
