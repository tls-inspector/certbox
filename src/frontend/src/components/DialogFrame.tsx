import * as React from 'react';
import '../css/Dialog.scss';

interface GlobalDialogFrameState {
    dialog?: JSX.Element;
}

export class GlobalDialogFrame extends React.Component<unknown, GlobalDialogFrameState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            dialog: undefined
        };
        GlobalDialogFrame.instance = this;
    }

    private static instance: GlobalDialogFrame;

    public static dialogOpen(): boolean {
        return this.instance.state.dialog != undefined;
    }

    public static showDialog(dialog: JSX.Element): void {
        this.instance.setState(state => {
            if (state.dialog != undefined) {
                throw new Error('Refusing to stack dialogs');
            }
            return { dialog: dialog };
        });
    }

    public static removeDialog(): void {
        this.instance.setState({ dialog: undefined });
    }

    render(): JSX.Element {
        if (!this.state.dialog) {
            return null;
        }
        return (
            <div className="dialog-backdrop">
                {
                    this.state.dialog
                }
            </div>
        );
    }
}