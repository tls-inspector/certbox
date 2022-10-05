import * as React from 'react';
import '../css/Button.scss';
import '../css/Radio.scss';
import { Rand } from '../services/Rand';

export interface RadioChoice {
    label: string;
    value: string;
}

interface RadioProps {
    label: string;
    choices: RadioChoice[];
    defaultValue?: string;
    onChange: (value: string) => void;
}
export const Radio: React.FC<RadioProps> = (props: RadioProps) => {
    const [SelectedIndex, setSelectedIndex] = React.useState<number>(props.choices.findIndex(c => c.value === props.defaultValue));

    const radioChange = (sender: React.ChangeEvent<HTMLInputElement>) => {
        const checked = sender.target.checked;
        const value = sender.target.value;
        if (checked) {
            props.onChange(value);
            setSelectedIndex(props.choices.findIndex(c => c.value === props.defaultValue));
        }
    };

    const radioId = Rand.ID();
    return (
        <div className="radio">
            <label className="radio-label">{props.label}</label>
            <div className="radio-group">
                {
                    props.choices.map((choice, idx) => {
                        const id = Rand.ID();
                        return (<React.Fragment key={idx}>
                            <input type="radio" className="radio-check" name={radioId} id={id} value={choice.value} defaultChecked={SelectedIndex === idx} onChange={radioChange} />
                            <label htmlFor={id} className="radio-button">{choice.label}</label>
                        </React.Fragment>);
                    })
                }
            </div>
        </div>
    );
};
