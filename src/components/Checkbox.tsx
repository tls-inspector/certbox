import * as React from 'react';
import '../css/Input.scss';
import { Rand } from '../services/Rand';

interface CheckboxProps {
    label: string;
    defaultValue?: boolean;
    onChange?: (value: boolean) => (void);
    disabled?: boolean;
}
export const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
    const [Value, setValue] = React.useState(props.defaultValue || false);

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setValue(checked);
    };

    const id = Rand.ID();
    return (
        <div className="input-checkbox">
            <label htmlFor={id}>
                <input className="checkbox" id={id} name={id} type="checkbox" onChange={onChange} defaultChecked={props.defaultValue} disabled={props.disabled} />
                <span>{props.label}</span>
            </label>
        </div>
    );
};
