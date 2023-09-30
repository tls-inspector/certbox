import * as React from 'react';
import '../css/Button.scss';

interface ButtonProps {
    onClick: () => (void);
    disabled?: boolean;
    small?: boolean;
    children?: React.ReactNode;
    color?: string;
}
export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    let className = props.small ? 'small' : 'large';
    if (props.color) {
        className += ' ' + props.color;
    }

    return (
        <button type="button" className={className} onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    );
};
