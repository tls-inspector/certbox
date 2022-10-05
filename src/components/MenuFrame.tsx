import * as React from 'react';
import '../css/Menu.scss';

interface GlobalMenuFrameState {
    menu?: JSX.Element;
}

export class GlobalMenuFrame extends React.Component<unknown, GlobalMenuFrameState> {
    constructor(props: unknown) {
        super(props);
        this.state = {
            menu: undefined
        };
        GlobalMenuFrame.instance = this;
    }

    private static instance: GlobalMenuFrame;

    public static menuOpen(): boolean {
        return this.instance.state.menu != undefined;
    }

    public static showMenu(menu: JSX.Element): void {
        this.instance.setState(state => {
            if (state.menu != undefined) {
                throw new Error('Refusing to stack menus');
            }
            return { menu: menu };
        });
    }

    public static removeMenu(): void {
        this.instance.setState({ menu: undefined });
    }

    private backdropClick(): void {
        GlobalMenuFrame.instance.setState({ menu: undefined });
    }

    render(): JSX.Element {
        if (!this.state.menu) {
            return null;
        }
        return (
            <React.Fragment>
                <div className="menu-backdrop" onClick={this.backdropClick} onContextMenu={this.backdropClick}></div>
                {this.state.menu}
            </React.Fragment>
        );
    }
}