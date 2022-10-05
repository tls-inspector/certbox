import * as React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import '../css/Footer.scss';

interface FooterProps {
    onClick: () => void;
    disabled?: boolean;
}
export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
    return (
        <footer>
            <div>
                <span>
                    Nothing entered here leaves your browser • <a href="https://tlsinspector.com/factory.html" target="_blank" rel="noreferrer">Download desktop version</a><br/>
                    Another free &amp; open-source project from <a href="https://ianspence.com" target="_blank" rel="noreferrer">Ian Spence</a>.
                </span>
            </div>
            <div>
                <Button onClick={props.onClick} disabled={props.disabled}>
                    <Icon.Label icon={<Icon.FileExport />} label="Generate Certificates" />
                </Button>
            </div>
        </footer>
    );
};
