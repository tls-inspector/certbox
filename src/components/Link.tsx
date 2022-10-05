import * as React from 'react';

interface LinkProps {
    url: string;
    children?: React.ReactNode;
}
export const Link: React.FC<LinkProps> = (props: LinkProps) => {
    return (
        <a href={props.url}>{ props.children }</a>
    );
};
