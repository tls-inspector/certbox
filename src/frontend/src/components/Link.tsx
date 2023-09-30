import * as React from 'react';
import { Interop } from '../Interop';

interface LinkProps {
    url: string;
    children?: React.ReactNode;
}
export const Link: React.FC<LinkProps> = (props: LinkProps) => {
    const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        Interop.openInBrowser(props.url);
    };

    return (
        <a href="#" onClick={onClick}>{ props.children }</a>
    );
};
