import * as React from 'react';
import '../css/Menu.scss';

interface MenuProps {
    x: number;
    y: number;
    children?: React.ReactNode;
}
export const Menu: React.FC<MenuProps> = (props: MenuProps) => {
    return (
        <div className='menu' style={{ top: props.y+1, left: props.x+1 }}>{ props.children }</div>
    );
};

interface MenuItemProps {
    onClick: () => void;
    children?: React.ReactNode;
}
export const MenuItem: React.FC<MenuItemProps> = (props: MenuItemProps) => {
    const onClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        props.onClick();
        GlobalMenuFrame.removeMenu();
    };

    return (
        <div className='menuitem' onClick={onClick}>{ props.children }</div>
    );
};

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
