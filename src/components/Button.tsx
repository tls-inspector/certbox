import * as React from 'react';
import '../css/Button.scss';

interface ButtonProps {
    onClick: () => (void);
    disabled?: boolean;
    small?: boolean;
    children?: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const className = props.small ? 'small' : 'large';

    return (
        <button type="button" className={className} onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    );
};
