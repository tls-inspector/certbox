import * as React from 'react';
import '../css/Input.scss';
import { Rand } from '../services/Rand';

interface InputProps {
    label: string;
    type?: 'text' | 'password' | 'email' | 'date';
    defaultValue?: string;
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
}
export const Input: React.FC<InputProps> = (props: InputProps) => {
    const id = Rand.ID();

    const requiredFlag = props.required ? (<span className="input-required">*</span>) : null;

    return (
        <div className="input">
            <label htmlFor={id}>
                <span className="label">{props.label}{requiredFlag}</span>
                <TextInput id={id} defaultValue={props.defaultValue} type={props.type} onChange={props.onChange} disabled={props.disabled} required={props.required} autofocus={props.autofocus} />
            </label>
        </div>
    );
};

interface TextInputProps {
    defaultValue?: string;
    id: string;
    type?: 'text' | 'password' | 'email' | 'date';
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
}
export const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
    const [Value, setValue] = React.useState(props.defaultValue || '');

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <input id={props.id} name={props.id} className="input" type={props.type || 'text'} onChange={onChange} defaultValue={props.defaultValue} required={props.required} disabled={props.disabled} autoFocus={props.autofocus} />
    );
};
