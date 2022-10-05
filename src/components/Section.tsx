import * as React from 'react';
import '../css/Section.scss';

interface SectionProps {
    title: string;
    children?: React.ReactNode;
}
export const Section: React.FC<SectionProps> = (props: SectionProps) => {
    return (
        <div className="section">
            <span className="section-title">{props.title}</span>
            <div className="section-content">
                {props.children}
            </div>
        </div>
    );
};
