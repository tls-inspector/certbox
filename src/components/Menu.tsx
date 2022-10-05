import * as React from 'react';
import { GlobalMenuFrame } from './MenuFrame';

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
