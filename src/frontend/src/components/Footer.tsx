import * as React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { Interop } from '../Interop';
import * as manifest from '../../package.json';
import '../css/Footer.scss';

interface FooterProps {
    onClick: () => void;
    disabled?: boolean;
}
export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
    const footerText = (
        <span>
            Nothing entered here leaves your browser • <a href="https://certbox.io/desktop.html" target="_blank" rel="noreferrer">Download desktop version</a><br/>
            Another free &amp; open-source project from <a href="https://ianspence.com" target="_blank" rel="noreferrer">Ian Spence</a> • Version {manifest.version}
        </span>
    );

    return (
        <footer>
            <div>
                {
                    Interop.isDesktop ? null : (footerText)
                }
            </div>
            <div>
                <Button onClick={props.onClick} disabled={props.disabled}>
                    <Icon.Label icon={<Icon.FileExport />} label="Generate Certificates" />
                </Button>
            </div>
        </footer>
    );
};
